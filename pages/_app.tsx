import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { StyleSheetManager } from 'styled-components';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { captureException } from '@sentry/nextjs';
import rtlPlugin from 'stylis-plugin-rtl';
import { TCatAndSubCatPageData } from 'components/CatAndSubCatPage/interface';
import Conditional from 'components/common/Conditional';
import DeferredComponent from 'components/common/DeferredComponent';
import ScrollToTop from 'components/common/ScrollToTop';
import { ToastProvider } from 'contexts/toastContext';
import { getAnalyticsPageType } from 'utils';
import { sendVariablesToDataLayer, trackEvent } from 'utils/analytics';
import { dynamicPolyfillIntlLocale } from 'utils/currency';
import { getLangObject } from 'utils/helper';
import { initDayJSLocale } from 'utils/localizationUtils';
import renderShortCodes from 'utils/shortCodes';
import { dynamicPolyfillIntlRelativeTime } from 'utils/timeUtils';
import { appAtom } from 'store/atoms/app';
import { currencyAtom } from 'store/atoms/currency';
import { currencyListAtom } from 'store/atoms/currencyList';
import { localeLoaderAtom } from 'store/atoms/localeLoader';
import { metaAtom } from 'store/atoms/meta';
import { shortcodesAtom } from 'store/atoms/shortcodes';
import { AIRPORT_TRANSFER_PRODUCT_CARD_TEMPLATE } from 'const/airportTransfers';
import { ArabicGlobalStyle } from 'const/globalStyles/ar';
import {
  ANALYTICS_PROPERTIES,
  COOKIE,
  CUSTOM_TYPES,
  PAGETYPE_BY_CUSTOMTYPE,
  RTL_LANGUAGE_CODES,
  SENTRY_TAGS,
  TEMPLATES,
} from 'const/index';
import 'public/global.css';

const ConsentBanner = dynamic(
  () =>
    import(/* webpackChunkName: "ConsentBanner" */ 'components/common/Consent'),
  { ssr: false }
);
const Clarity = dynamic(
  () => import(/* webpackChunkName: "Clarity" */ 'components/common/Clarity'),
  { ssr: false }
);

const ZendeskChat = dynamic(
  () =>
    import(
      /* webpackChunkName: "ZendeskChat" */ 'components/common/ZendeskChat'
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
  cityPageParams: Record<string, any>;
  catAndSubCatPageData: TCatAndSubCatPageData;
  isCatOrSubCatPage: boolean;
  isBot: boolean;
  isGDPRCompliant: boolean;
  bestDiscount?: number;
  minPrice?: number;
  domainConfig?: Record<string, any>;
  countryCode?: string;
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
  const { lang: locale, isGDPRCompliant, CMSContent, countryCode } = pageProps;

  const { data } = CMSContent || {};
  const { categoryTourListV2, is_entertainment_mb, body4 } = data || {};
  const isEntertainmentMbListicle =
    is_entertainment_mb && categoryTourListV2?.primary?.islisticle;
  const isLttMonthOnMonthPage =
    isEntertainmentMbListicle && body4[0]?.items?.[0]?.month_label !== null;

  const langCode = getLangObject(locale).code;
  if (langCode !== 'en') initDayJSLocale(langCode);
  dynamicPolyfillIntlRelativeTime(langCode);
  dynamicPolyfillIntlLocale();

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
      catAndSubCatPageData,
      isCatOrSubCatPage,
      cityPageParams,
      isBot,
      minPrice,
      bestDiscount,
    } = pageProps;
    set(shortcodesAtom, {
      minPrice,
      bestDiscount,
    });

    const { title, refs = {} } = CMSContent?.data ?? {};
    const { baseLangCategorisationMetadata } = CMSContent?.data ?? {};
    const { isCityPageMB } = cityPageParams || {};
    const isHOHO = refs?.productCardData?.template === TEMPLATES.HOHO;
    const { isSubCategoryPage } = catAndSubCatPageData || {};

    let primaryCollectionId;

    /**
     * Clean-up seems to be missed from https://github.com/headout/mystique/pull/1712
     * This is causing the `collectionId` field to not be present for analytics.
     *
     * TODO: Confirm clean-up logic and remove invalid if-else flows from below.
     */
    if (baseLangCategorisationMetadata?.tagged_collection) {
      primaryCollectionId = baseLangCategorisationMetadata?.tagged_collection;
    } else if (CMSContent?.data?.data) {
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

    const isAirportTransferMB =
      CMSContent?.data?.refs?.productCardData?.template ===
      AIRPORT_TRANSFER_PRODUCT_CARD_TEMPLATE;

    sendVariablesToDataLayer({
      [ANALYTICS_PROPERTIES.COLLECTION_ID]: primaryCollectionId,
      [ANALYTICS_PROPERTIES.CITY]: primaryCity?.displayName,
      [ANALYTICS_PROPERTIES.COUNTRY]: primaryCity?.country?.displayName,
      [ANALYTICS_PROPERTIES.COLLECTION_NAME]: primaryCollectionName,
      [ANALYTICS_PROPERTIES.LANGUAGE]: getLangObject(lang).code,
      [ANALYTICS_PROPERTIES.CURRENCY]: ssrCurrencyCode,
      [ANALYTICS_PROPERTIES.MB_NAME]: mbName,
      [ANALYTICS_PROPERTIES.PAGE_TITLE]: pageTitle,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: getAnalyticsPageType({
        isCityPageMB,
        isHOHO,
        isCatOrSubCatPage,
        isSubCategoryPage,
        isAirportTransferMB,
        defaultType: pageType,
      }),
    });
    trackEvent({
      eventName: 'Canary Build Viewed',
    });
    set(metaAtom, {
      city: primaryCity || baseLangCategorisationMetadata?.tagged_city,
      country:
        primaryCity?.country || baseLangCategorisationMetadata?.tagged_country,
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
      isPillBarSticky: false,
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
        <ToastProvider>
          {getLanguageBasedGlobalStyling(langCode)}
          <Component {...pageProps} />
          <ScrollToTop $isLttMonthOnMonthPage={isLttMonthOnMonthPage} />
          <Conditional if={!isLttMonthOnMonthPage}>
            <ZendeskChat
              uid={pageProps?.uid}
              isLttMonthOnMonthPage={isLttMonthOnMonthPage}
            />
          </Conditional>
          <Clarity host={host} />
          <DeferredComponent delay={3_000}>
            <ConsentBanner
              isGDPRCompliant={isGDPRCompliant}
              countryCode={countryCode}
            />
          </DeferredComponent>
        </ToastProvider>
      </RecoilRoot>
    </StyleSheetManager>
  );
};

export default App;
