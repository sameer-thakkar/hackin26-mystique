import { useEffect } from 'react';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { StyleSheetManager } from 'styled-components';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { captureException } from '@sentry/nextjs';
import Cookies from 'js-cookie';
import rtlPlugin from 'stylis-plugin-rtl';
import Clarity from 'components/common/Clarity';
import DeferredComponent from 'components/common/DeferredComponent';
import LiveChat from 'components/common/LiveChat';
import ScrollToTop from 'components/common/ScrollToTop';
import { sendVariablesToDataLayer, trackEvent } from 'utils/analytics';
import { checkIfLazyLoadApplicable } from 'utils/gen';
import { getLangObject } from 'utils/helper';
import { initDayJSLocale } from 'utils/localizationUtils';
import renderShortCodes from 'utils/shortCodes';
import { appAtom } from 'store/atoms/app';
import { currencyAtom } from 'store/atoms/currency';
import { currencyListAtom } from 'store/atoms/currencyList';
import { localeLoaderAtom } from 'store/atoms/localeLoader';
import { metaAtom } from 'store/atoms/meta';
import { ArabicGlobalStyle } from 'const/globalStyles/ar';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  COOKIE,
  CUSTOM_TYPES,
  PAGE_TYPES,
  PAGETYPE_BY_CUSTOMTYPE,
  RTL_LANGUAGE_CODES,
  SENTRY_TAGS,
} from 'const/index';
import 'public/global.css';

const CookieBanner = dynamic(
  () =>
    import(
      /* webpackChunkName: "CollectionCarousel" */ 'components/common/CookieBanner'
    ),
  { ssr: false }
);

type PageProps = {
  lang: string;
  host: string;
  uid: string;
  ContentType: string;
  MBDesign?: string;
  baseLangPageTitle?: string;
  CMSContent: any;
  tourGroupData: any;
  primaryCity: any;
  currencyList: [];
  isDev: boolean;
  isStage: boolean;
  cookies: Record<string, string>;
  isMobile: boolean;
  isCategoryV2: boolean;
  categoryTourListData: any;
  simplifiedCategoryTourListData: any;
  scorpioData: any;
  cityPageParams: Record<string, string>;
  isBot: boolean;
  isGDPRCompliant: boolean;
  isLazyExpTreatment: boolean;
};

interface IGetCurrencyCode {
  isValidCookieCurrency: boolean | undefined;
  cityPageParams: Record<string, any>;
  primaryCity: Record<string, any>;
  cookies: Record<string, string>;
}

const getCurrencyCode = ({
  isValidCookieCurrency,
  cityPageParams,
  primaryCity,
  cookies,
}: IGetCurrencyCode) => {
  const { isCityPageMB, cityPageData } = cityPageParams || {};
  if (isValidCookieCurrency) {
    return cookies?.[COOKIE.CURRENT_CURRENCY];
  } else if (isCityPageMB) {
    const {
      nearbyAndCurrentCityData: { currentCityData },
    } = cityPageData;
    return currentCityData?.country?.currency?.code;
  } else {
    return primaryCity?.country?.currency?.code;
  }
};

const App = ({ Component, pageProps }: AppProps<PageProps>) => {
  const {
    lang: locale,
    isMobile,
    isGDPRCompliant,
    ContentType,
    MBDesign,
    isLazyExpTreatment,
    uid,
  } = pageProps;

  const pageType = ContentType + (MBDesign || '');

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

  useEffect(() => {
    const isLazyLoadApplicable = checkIfLazyLoadApplicable(uid);
    if (!isLazyLoadApplicable) return;

    if (typeof Cookies.get(COOKIE.IS_LAZY) === 'undefined')
      Cookies.set(COOKIE.IS_LAZY, isLazyExpTreatment ? '1' : '0', {
        path: '/',
        expires: 31,
      });
    setTimeout(() => {
      trackEvent({
        eventName: ANALYTICS_EVENTS.EXPERIMENT_VIEWED,
        'Experiment Name': 'Lazy Load Experiment',
        'Experiment Variant': isLazyExpTreatment ? 'Treatment' : 'Control',
      });
    });
  }, [uid, isLazyExpTreatment]);

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
      cityPageParams,
      isBot,
    } = pageProps;

    const { title } = CMSContent?.data ?? {};
    const { isCityPageMB } = cityPageParams || {};

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
    } else if (customType === CUSTOM_TYPES.NEWS_PAGE) {
      pageTitle = CMSContent?.data?.heading;
    } else if (customType === CUSTOM_TYPES.VENUE_PAGE) {
      pageTitle = CMSContent?.data?.theatreName;
    } else pageTitle = CMSContent?.data?.featured_title;

    pageTitle = pageTitle ?? metaTitle;
    pageTitle = renderShortCodes(pageTitle)?.join?.('');

    const cookieCurrency = cookies?.[COOKIE.CURRENT_CURRENCY];
    const isValidCookieCurrency = cookieCurrency
      ? currencyList?.find((c: any) => c.code === cookieCurrency)
      : false;

    const ssrCurrencyCode = getCurrencyCode({
      isValidCookieCurrency,
      cityPageParams,
      cookies,
      primaryCity,
    });

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
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: isCityPageMB
        ? PAGE_TYPES.CITY_PAGE
        : pageType,
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
      isLazyExpTreatment,
    });
    set(currencyListAtom, currencyList);
    set(currencyAtom, ssrCurrencyCode);
    set(localeLoaderAtom, false);
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
        <DeferredComponent delay={3_000}>
          <CookieBanner
            isMobile={isMobile}
            isGDPRCompliant={isGDPRCompliant}
            pageType={pageType}
          />
        </DeferredComponent>
        <Clarity host={host} />
      </RecoilRoot>
    </StyleSheetManager>
  );
};

export default App;
