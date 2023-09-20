import { AppProps } from 'next/app';
import { StyleSheetManager } from 'styled-components';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { captureException } from '@sentry/nextjs';
import rtlPlugin from 'stylis-plugin-rtl';
import Clarity from 'components/common/Clarity';
import LiveChat from 'components/common/LiveChat';
import ScrollToTop from 'components/common/ScrollToTop';
import { sendVariablesToDataLayer } from 'utils/analytics';
import { getLangObject } from 'utils/helper';
import { initDayJSLocale } from 'utils/localizationUtils';
import renderShortCodes from 'utils/shortCodes';
import { appAtom } from 'store/atoms/app';
import { currencyAtom } from 'store/atoms/currency';
import { currencyListAtom } from 'store/atoms/currencyList';
import { metaAtom } from 'store/atoms/meta';
import { ArabicGlobalStyle } from 'const/globalStyles/ar';
import {
  ANALYTICS_PROPERTIES,
  COOKIE,
  CUSTOM_TYPES,
  PAGETYPE_BY_CUSTOMTYPE,
  RTL_LANGUAGE_CODES,
  SENTRY_TAGS,
} from 'const/index';
import '@formatjs/intl-relativetimeformat/polyfill';
import 'public/global.css';

type PageProps = {
  lang: string;
  host: string;
  uid: string;
  ContentType: string;
  baseLangPageTitle?: string;
  CMSContent: any;
  tourGroupData: any;
  primaryCity: any;
  currencyList: [];
  isDev: boolean;
  isStage: boolean;
  cookies: { [k: string]: string };
  isMobile: boolean;
  isCategoryV2: boolean;
  categoryTourListData: any;
  simplifiedCategoryTourListData: any;
  scorpioData: any;
  isBot: boolean;
};

const App = ({ Component, pageProps }: AppProps<PageProps>) => {
  const { lang: locale } = pageProps;

  const langCode = getLangObject(locale).code;
  if (langCode !== 'en') initDayJSLocale(langCode);

  const getLanguageBasedGlobalStyling = (lang: any) => {
    switch (lang) {
      case 'ar':
        return <ArabicGlobalStyle />;
      default:
        return null;
    }
  };

  const initRecoil = ({ set }: MutableSnapshot) => {
    if (!pageProps?.ContentType) return;
    const { lang } = pageProps ?? {};
    const {
      baseLangPageTitle,
      CMSContent,
      ContentType: customType,
      tourGroupData,
      primaryCity,
      currencyList,
      host,
      isDev,
      isStage,
      cookies = {},
      isMobile,
      uid,
      isCategoryV2,
      simplifiedCategoryTourListData,
      scorpioData: scorpioDataProp,
      categoryTourListData,
      isBot,
    } = pageProps;

    const { title } = CMSContent?.data ?? {};

    let primaryCollectionId;
    if (CMSContent?.data?.data) {
      ({ tagged_collection: primaryCollectionId } = CMSContent.data.data);
    } else if (CMSContent?.data) {
      ({ tagged_collection: primaryCollectionId } = CMSContent.data);
    }

    const metaTitle = renderShortCodes(title)?.join?.('');
    let pageTitle = '';
    if (customType === CUSTOM_TYPES.MICROSITE) {
      pageTitle = CMSContent?.data?.data?.heading;
    } else if (customType === CUSTOM_TYPES.VENUE_PAGE) {
      pageTitle = CMSContent?.data?.theatreName;
    } else pageTitle = CMSContent?.data?.featured_title;

    pageTitle = pageTitle ?? metaTitle;
    pageTitle = renderShortCodes(pageTitle)?.join?.('');

    const cookieCurrency = cookies?.[COOKIE.CURRENT_CURRENCY];
    const isValidCookieCurrency = cookieCurrency
      ? currencyList?.find((c: any) => c.code === cookieCurrency)
      : false;
    const ssrCurrencyCode = isValidCookieCurrency
      ? cookies?.[COOKIE.CURRENT_CURRENCY]
      : primaryCity?.country?.currency?.code;

    const pageType = PAGETYPE_BY_CUSTOMTYPE[customType];

    const mbName = renderShortCodes(baseLangPageTitle)?.join?.('');

    let primaryCollectionName = null;

    let scorpioData = isCategoryV2
      ? simplifiedCategoryTourListData?.tourGroupMap ?? {}
      : scorpioDataProp ?? simplifiedCategoryTourListData?.tourGroupMap ?? {};

    // remove this once we handle exception cases (if any) on Sentry
    try {
      if (customType === CUSTOM_TYPES.CONTENT_PAGE) {
        const collectionDetails = categoryTourListData?.collectionDetails || {};
        primaryCollectionName = collectionDetails?.displayName;
      } else if (customType !== CUSTOM_TYPES.SHOW_PAGE) {
        const [firstTour]: any = Object.values(scorpioData);
        const { primaryCollection } = firstTour ?? {};
        const { name } = primaryCollection ?? {};
        primaryCollectionName = name;
      } else if (customType === CUSTOM_TYPES.SHOW_PAGE) {
        const { primaryCollection } = tourGroupData;
        const { displayName } = primaryCollection ?? {};
        primaryCollectionName = displayName;
      }
    } catch (e) {
      captureException(e, {
        tags: {
          [SENTRY_TAGS.EXCEPTION_TYPE]: 'Init Recoil Product Missing',
          [SENTRY_TAGS.PAGE_TYPE]: pageType,
        },
      });
    }
    sendVariablesToDataLayer({
      [ANALYTICS_PROPERTIES.COLLECTION_ID]: primaryCollectionId,
      [ANALYTICS_PROPERTIES.CITY]: primaryCity?.displayName,
      [ANALYTICS_PROPERTIES.COUNTRY]: primaryCity?.country?.displayName,
      [ANALYTICS_PROPERTIES.COLLECTION_NAME]: primaryCollectionName,
      [ANALYTICS_PROPERTIES.LANGUAGE]: getLangObject(lang).code,
      [ANALYTICS_PROPERTIES.CURRENCY]: ssrCurrencyCode,
      [ANALYTICS_PROPERTIES.MB_NAME]: mbName,
      [ANALYTICS_PROPERTIES.PAGE_TITLE]: pageTitle,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageType,
    });

    set(metaAtom, {
      city: primaryCity,
      country: primaryCity?.country,
      language: getLangObject(lang).code,
      pageTitle: pageTitle,
      collectionId: primaryCollectionId,
      collectionName: primaryCollectionName,
      mbName,
      pageType,
    });
    set(appAtom, {
      isMobile,
      host,
      isDev,
      isStage,
      initialCurrency: ssrCurrencyCode,
      isPageLoaded: false,
      uid,
      isSidenavScroll: false,
      isBot,
      language: lang,
    });
    set(currencyListAtom, currencyList);
    set(currencyAtom, ssrCurrencyCode);
  };

  const { host } = pageProps;
  return (
    <StyleSheetManager
      // @ts-expect-error TS(2769): No overload matches this call.
      stylisPlugins={RTL_LANGUAGE_CODES.includes(langCode) ? [rtlPlugin] : []}
    >
      <RecoilRoot initializeState={initRecoil}>
        {getLanguageBasedGlobalStyling(langCode)}
        <Component {...pageProps} />
        <ScrollToTop />
        <LiveChat uid={pageProps?.uid} />
        <Clarity host={host} />
      </RecoilRoot>
    </StyleSheetManager>
  );
};

export default App;
