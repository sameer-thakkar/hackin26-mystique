import { GetServerSidePropsContext } from 'next';
import { createClient } from 'prismicio';
import * as Sentry from '@sentry/nextjs';
import { fetchDomainConfig, getPrismicProxyDomain } from 'utils/apiUtils';
import { getLangObject } from 'utils/helper';
import { getLocalizationLabels } from 'utils/localizationUtils';
import { sendLog } from 'utils/logger';
import { traceError } from 'utils/logutils';
import { getDomainFromUid, getLangUID } from 'utils/urlUtils';
import { CUSTOM_TYPES, DEFAULT_PRISMIC_LANG } from 'const/index';
import { strings } from 'const/strings';
import { globalHomepagStaticPageGq, micrositeStaticPageGq } from './graphQuery';

export const getStaticPageMicrosite = async ({ uid }: { uid: string }) => {
  try {
    const prismicClient = createClient();
    const micrositeData = await prismicClient.getByUID('microsite', uid, {
      lang: DEFAULT_PRISMIC_LANG,
      graphQuery: micrositeStaticPageGq,
    });
    const {
      logo: { logoUrl, showPoweredLogo },
      name: whiteLabelName,
    } = (await fetchDomainConfig(uid ?? '')) ?? {};

    if (micrositeData) {
      return {
        CMSContent: {
          ...micrositeData.data,
          commonFooter: micrositeData.data.footer_ref,
          logoUrl,
          logoAltText: whiteLabelName,
          hasPoweredByHeadoutLogo: showPoweredLogo ?? true,
        },
        ContentType: CUSTOM_TYPES.MICROSITE,
      };
    } else {
      return Promise.reject();
    }
  } catch (error) {
    Sentry.captureException(error);
    sendLog({
      err: error,
      message: `[getStaticPageMicrosite] - ${uid}`,
    });
    // eslint-disable-next-line no-console
    console.log(`${CUSTOM_TYPES.MICROSITE}`, error);
  }
};

export const getStaticPageGlobalMB = async ({ uid }: { uid: string }) => {
  try {
    const prismicClient = createClient();
    const globalHomepageData = await prismicClient.getByUID(
      'global_homepage',
      uid,
      {
        lang: DEFAULT_PRISMIC_LANG,
        graphQuery: globalHomepagStaticPageGq,
      }
    );
    const {
      logo: { logoUrl, showPoweredLogo },
      name: whiteLabelName,
    } = await fetchDomainConfig(uid ?? '');
    if (globalHomepageData) {
      return {
        CMSContent: {
          ...globalHomepageData.data,
          commonFooter: globalHomepageData.data.common_footer,
          logoUrl,
          logoAltText: whiteLabelName,
          hasPoweredByHeadoutLogo: showPoweredLogo ?? true,
        },
        ContentType: CUSTOM_TYPES.GLOBAL_HOMEPAGE,
      };
    } else {
      return Promise.reject();
    }
  } catch (error) {
    Sentry.captureException(error);
    sendLog({
      err: error,
      message: `[getStaticPageGlobalMB] - ${uid}`,
    });
    // eslint-disable-next-line no-console
    console.log(`${CUSTOM_TYPES.MICROSITE}`, error);
  }
};

type TStaticMicrosite = Awaited<ReturnType<typeof getStaticPageMicrosite>>;
type TStaticGlobalHomepage = Awaited<ReturnType<typeof getStaticPageGlobalMB>>;

const getLegalPageData = async ({ req, query }: GetServerSidePropsContext) => {
  try {
    const isDev = req
      ? !!query.mystique_uid
      : window.location.search.includes('mystique_uid');

    const { host } = req ? req.headers : window.location;

    const { uid: prodUid, lang } = getLangUID(req, query);

    const uid = isDev
      ? (query.mystique_uid as string)
      : (getDomainFromUid(prodUid) as string);

    const domain = getPrismicProxyDomain({ isDev, host: host! });
    const endpoint = `${domain}/api/prismic/get-document-type/${uid}/`;

    const contentType = await fetch(endpoint).then((res) => res.json());

    let response:
      | TStaticMicrosite
      | TStaticGlobalHomepage
      | Record<string, any> = {};

    switch (contentType.type) {
      case CUSTOM_TYPES.MICROSITE:
        response = await getStaticPageMicrosite({ uid });
        break;
      case CUSTOM_TYPES.GLOBAL_HOMEPAGE:
        response = await getStaticPageGlobalMB({ uid });
        break;
    }

    const localizedStrings = await getLocalizationLabels({
      lang: getLangObject(lang || 'en-us')?.code || 'en',
    });

    strings.setContent({
      default: localizedStrings,
    });

    return {
      props: {
        ...response,
        host,
        uid,
        lang,
        isDev,
        localizedStrings,
      },
    };
  } catch (error) {
    traceError({ error, host: req?.headers?.host, url: req?.url });
    return {
      props: {},
    };
  }
};

export default getLegalPageData;
