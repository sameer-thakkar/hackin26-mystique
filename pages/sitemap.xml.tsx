import { CUSTOM_TYPES } from 'constants/index';

import { Component } from 'react';
import Prismic from 'prismic-javascript';
import builder from 'xmlbuilder';
import { convertUidToUrl } from 'utils/urlUtils';
import { fetchAllMatchingDocs } from 'utils/prismicUtils';

const createImg = (doc) => {
  if (doc.type === CUSTOM_TYPES.MICROSITE) {
    if (doc.data.image && doc.data.image.url) {
      return {
        'image:image': {
          'image:loc': doc.data.image.url,
        },
      };
    }
    return {};
  }
  return {};
};

const createAltLangUrls = (langArr) => {
  const langLinksArr = langArr.map((langItem) => {
    const { lang, url } = langItem;
    return {
      '@rel': 'alternate',
      '@hreflang': lang,
      '@href': url,
    };
  });

  return {
    'xhtml:link': langLinksArr,
  };
};

const createUrlArr = (doc) => {
  const {
    alternate_languages: languages = [],
    uid,
    lang: defaultLang = '',
  } = doc;

  const langData = languages.map((language) => {
    const { lang, uid: alternateLanguageUid = uid } = language;
    const langPrefix = lang?.split('-')[0];
    return {
      lang: langPrefix,
      url: convertUidToUrl({
        uid: alternateLanguageUid,
        lang: langPrefix,
      }),
    };
  });

  const defaultLangPrefix = defaultLang.split('-')[0];
  langData.push({
    lang: defaultLangPrefix,
    url: convertUidToUrl({ uid, lang: defaultLangPrefix }),
    isDefault: true,
  });

  return langData.map((item) => {
    return {
      loc: item.url,
      lastmod: new Date(doc.last_publication_date).toISOString(),
      ...createImg(doc),
      ...createAltLangUrls(langData),
    };
  });
};

export default class SitemapXml extends Component {
  static async getInitialProps({ req, res, query }) {
    let uid;
    if (query.mystique_uid) {
      uid = query.mystique_uid;
    } else {
      uid = req.headers.host.replace('stage-', '');
    }

    const xmlDoc = {
      urlset: {
        '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        '@xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
        '@xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
        '@xsi:schemaLocation':
          'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd',
        '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
        url: [],
      },
    };

    return fetchAllMatchingDocs({
      query: [Prismic.Predicates.at('document.tags', [uid])],
      params: {
        pageSize: 100,
        page: 1,
        lang: 'en-US',
      },
    })
      .then((documents) => {
        documents
          .filter((doc) =>
            [
              CUSTOM_TYPES.MICROSITE,
              CUSTOM_TYPES.CONTENT_PAGE,
              CUSTOM_TYPES.GLOBAL_CITY,
              CUSTOM_TYPES.GLOBAL_COUNTRY,
              CUSTOM_TYPES.GLOBAL_HOMEPAGE,
              CUSTOM_TYPES.GLOBAL_COLLECTION,
              CUSTOM_TYPES.GLOBAL_EXPERIENCE,
              CUSTOM_TYPES.SHOW_PAGE,
            ].includes(doc.type)
          )
          .reduce(
            (accum, item) => {
              if (item.type === CUSTOM_TYPES.MICROSITE) {
                return [[...accum[0], item], accum[1]];
              }
              return [accum[0], [...accum[1], item]];
            },
            [[], []]
          )
          .reduce((accum, item) => [...accum, ...item])
          .filter((doc) => doc.data.is_excluded_from_sitemap !== 'Yes')
          .forEach((doc) => {
            if (!doc?.data?.microbrand_url) {
              xmlDoc.urlset.url.push(...createUrlArr(doc));
            }
          });
        const xml = builder.create(xmlDoc, { encoding: 'utf-8' });
        const xmlStr = xml.end();
        res.setHeader('Content-Type', 'application/xml');
        res.write(xmlStr);
        res.end();
      })
      .catch(() => {
        res.end();
      });
  }
}
