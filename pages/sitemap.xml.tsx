import { CUSTOM_TYPES } from 'constants/index';

import { Component } from 'react';
import Prismic from 'prismic-javascript';
import builder from 'xmlbuilder';
import { apiEndpoint } from 'config/prismic-config';
import { convertUidToUrl } from 'utils/urlUtils';

const withHttps = (url) =>
  (url.startsWith('http') ? url : `https://${url}`).replace('http:', 'https:');

const withTrailingSlash = (url) =>
  url.charAt(url.length - 1) !== '/' ? `${url}/` : url;

async function getPage(api, uid, documents, page = 1) {
  return await api
    .query(Prismic.Predicates.any('document.tags', [uid]), {
      lang: 'en-us',
      pageSize: 100,
      page,
    })
    .then(async (response) => {
      if (response.page < response.total_pages) {
        return await getPage(
          api,
          uid,
          documents.concat(response.results),
          response.page + 1
        );
      } else {
        return documents.concat(response.results);
      }
    });
}

const createLoc = (doc) => convertUidToUrl({ uid: doc.uid });

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
        '@xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
        '@xsi:schemaLocation':
          'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd',
        '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
        url: [],
      },
    };

    return Prismic.getApi(apiEndpoint, { req })
      .then((api) => {
        return getPage(api, uid, []);
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
              xmlDoc.urlset.url.push({
                loc: withTrailingSlash(withHttps(createLoc(doc))),
                lastmod: new Date(doc.last_publication_date).toISOString(),
                ...createImg(doc),
              });
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
