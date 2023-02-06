import { CUSTOM_TYPES } from 'constants/index';

import * as Sentry from '@sentry/nextjs';
import { Component } from 'react';
import Prismic from 'prismic-javascript';
import builder from 'xmlbuilder';
import { convertUidToUrl, getLangUID } from 'utils/urlUtils';
import { fetchAllMatchingDocs } from 'utils/prismicUtils';
import { getHeadoutLanguagecode, legacyBooleanCheck } from 'utils';
import { NextPageContext } from 'next';

interface LangData {
  lang: string;
  url: string;
  isDefault: boolean;
}

const createImg = (doc: any) => {
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

const createAltLangUrls = (langArr: any) => {
  const langLinksArr = langArr.map((langItem: any) => {
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

const checkIfinValidUrl = async (url: string) => {
  const res = await fetch(url, { method: 'head' });
  const status = res.status;

  if (status === 200 && url !== res.url) return true;

  const threeXSeriesStatus = status.toString().charAt(0) === '3';

  if (status === 404 || threeXSeriesStatus) {
    return true;
  }
  return false;
};

const getLangData = async (
  languages: Record<string, any>[],
  sitemapUrl: string,
  uid: string
) => {
  const res = [];
  for (const language of languages) {
    const { lang, uid: alternateLanguageUid = uid } = language;
    const langPrefix = getHeadoutLanguagecode(lang);
    const obj = {
      lang: langPrefix,
      url: convertUidToUrl({
        uid: alternateLanguageUid,
        lang: langPrefix,
      }),
    };
    try {
      const url = new URL(obj.url);
      const isUrlInValid = await checkIfinValidUrl(url.href);
      if (!isUrlInValid && url.hostname === sitemapUrl) {
        res.push(obj);
      }
    } catch (e) {
      Sentry.captureException(e);
    }
  }
  return res;
};

const getDefaultLangData = async (
  defaultUrl: string,
  sitemapUrl: string,
  defaultLangPrefix: string
): Promise<LangData | undefined> => {
  try {
    const url = new URL(defaultUrl);
    const isUrlInValid = await checkIfinValidUrl(url.href);
    if (url.hostname === sitemapUrl && !isUrlInValid) {
      return {
        lang: defaultLangPrefix,
        url: defaultUrl,
        isDefault: true,
      };
    }
  } catch (e) {
    Sentry.captureException(e);
  }
};

const createUrlArr = async (doc: Record<string, any>, sitemapUrl: string) => {
  const {
    alternate_languages: languages = [],
    uid,
    lang: defaultLang = '',
  } = doc;

  const langData = await getLangData(languages, sitemapUrl, uid);
  const defaultLangPrefix = defaultLang.split('-')[0];
  const defaultUrl = convertUidToUrl({ uid, lang: defaultLangPrefix });

  const defaultLangObj = await getDefaultLangData(
    defaultUrl,
    sitemapUrl,
    defaultLangPrefix
  );

  if (defaultLangObj) langData.push(defaultLangObj);

  return langData.map((item) => {
    return {
      loc: item.url,
      lastmod: new Date(doc.last_publication_date).toISOString(),
      ...createImg(doc),
      ...createAltLangUrls(langData),
    };
  });
};

const isSelfReferringCanonical = (doc: Record<string, any>) =>
  !doc?.data?.canonical_link;

const isNotIndexed = (doc: Record<string, any>) =>
  !legacyBooleanCheck(doc?.data?.noindex);

export default class SitemapXml extends Component {
  static async getInitialProps({ req, res, query }: NextPageContext) {
    let uid;

    if (query.mystique_uid) {
      uid = query.mystique_uid;
    } else {
      uid = req?.headers?.host?.replace('stage-', '');
    }
    const { uid: langUid } = getLangUID(req, query);

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

    try {
      const response = await fetchAllMatchingDocs({
        // @ts-ignore
        query: [Prismic.Predicates.at('document.tags', [uid])],
        params: {
          pageSize: 100,
          page: 1,
          lang: 'en-US',
        },
      });
      const docs = response
        .filter((doc: Record<string, any>) =>
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
          (accum: Record<string, any>, item: Record<string, any>) => {
            if (item.type === CUSTOM_TYPES.MICROSITE) {
              return [[...accum[0], item], accum[1]];
            }
            return [accum[0], [...accum[1], item]];
          },
          [[], []]
        )
        .reduce((accum: Record<string, any>[], item: Record<string, any>[]) => [
          ...accum,
          ...item,
        ])
        .filter(
          (doc: Record<string, any>) =>
            doc.data.is_excluded_from_sitemap !== 'Yes'
        );

      for (const doc of docs) {
        if (isSelfReferringCanonical(doc) && isNotIndexed(doc)) {
          try {
            const result = await createUrlArr(doc, langUid);
            // @ts-ignore
            xmlDoc.urlset.url.push(...result);
          } catch (e) {
            Sentry.captureException(e);
          }
        }
      }

      const xml = builder.create(xmlDoc, { encoding: 'utf-8' });
      const xmlStr = xml.end();
      res?.setHeader('Content-Type', 'application/xml');
      res?.write(xmlStr);
      res?.end();
    } catch (e) {
      Sentry.captureException(e);
      res?.end();
    }
  }
}
