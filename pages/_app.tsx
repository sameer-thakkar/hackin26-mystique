import rtlPlugin from 'stylis-plugin-rtl';
import { StyleSheetManager } from 'styled-components';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import '@formatjs/intl-relativetimeformat/polyfill';
import 'public/global.css';
import { currencyListAtom } from 'store/atoms/currencyList';
import { appAtom } from 'store/atoms/app';
import { currencyAtom } from 'store/atoms/currency';
import { metaAtom } from 'store/atoms/meta';
import { mediaUpgradeExperimentAtom } from 'store/atoms/mediaupgrade';
import LiveChat from 'components/common/LiveChat';
import {
  PAGETYPE_BY_CUSTOMTYPE,
  CUSTOM_TYPES,
  ANALYTICS_PROPERTIES,
  RTL_LANGUAGE_CODES,
  COOKIE,
} from 'const/index';
import { strings } from 'const/strings';
import {
  getLocalizationLabels,
  initDayJSLocale,
} from 'utils/localizationUtils';
import { getLanguageFromPathname } from 'utils';
import renderShortCodes from 'utils/shortCodes';
import { sendVariablesToDataLayer } from 'utils/analytics';
import { getLangObject } from 'utils/helper';
import { ArabicGlobalStyle } from 'const/globalStyles/ar';

const App = ({ Component, pageProps, localizedStrings, lang }) => {
  strings.setContent({
    default: localizedStrings,
  });
  if (lang !== 'en') initDayJSLocale(lang);

  const initRecoil = ({ set }: MutableSnapshot) => {
    if (!pageProps?.ContentType) return;
    const { lang } = pageProps ?? {};
    const {
      baseLangPageTitle,
      categoryTourListData,
      CMSContent,
      ContentType: customType,
      tourGroupData,
      primaryCity,
      currencyList,
      host,
      isDev,
      isStage,
      mediaUpgradeExperiment,
      cookies = {},
    } = pageProps;
    const { title } = CMSContent?.data ?? {};
    const metaTitle = renderShortCodes(title)?.join?.('');
    let pageTitle =
      customType === CUSTOM_TYPES.MICROSITE
        ? CMSContent?.data?.data?.heading
        : CMSContent?.data?.featured_title;
    pageTitle = pageTitle ?? metaTitle;
    pageTitle = renderShortCodes(pageTitle)?.join?.('');
    const cookieCurrency = cookies?.[COOKIE.CURRENT_CURRENCY];
    const isValidCookieCurrency = cookieCurrency
      ? currencyList.find((c) => c.code === cookieCurrency)
      : false;
    const ssrCurrencyCode = isValidCookieCurrency
      ? cookies?.[COOKIE.CURRENT_CURRENCY]
      : primaryCity?.country?.currency?.code;

    const pageType = PAGETYPE_BY_CUSTOMTYPE[customType];
    const mbName = renderShortCodes(baseLangPageTitle)?.join?.('');
    let scorpioData = categoryTourListData?.isCategoryV2
      ? Object.values(categoryTourListData).reduce(
          (acc: Array<any>, tours) => acc.concat(tours),
          []
        )
      : categoryTourListData?.scorpioData ?? tourGroupData ?? {};
    let primaryCollectionName = null,
      primaryCollectionId = null;
    if (
      Object.keys(scorpioData).length > 0 &&
      customType !== CUSTOM_TYPES.SHOW_PAGE
    ) {
      const [firstTour]: any = Object.values(scorpioData);
      const { primaryCollection } = firstTour ?? {};
      const { id, name } = primaryCollection ?? {};
      primaryCollectionName = name;
      primaryCollectionId = id;
    } else if (customType === CUSTOM_TYPES.SHOW_PAGE) {
      const { primaryCollection } = tourGroupData;
      const { id, displayName } = primaryCollection ?? {};
      primaryCollectionName = displayName;
      primaryCollectionId = id;
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
      isMobile: pageProps.isMobile,
      host,
      isDev,
      isStage,
      initialCurrency: ssrCurrencyCode,
      isPageLoaded: false,
    });
    set(currencyListAtom, currencyList);
    set(currencyAtom, ssrCurrencyCode);
    set(mediaUpgradeExperimentAtom, {
      ...mediaUpgradeExperiment,
    });
  };

  const getLanguageBasedGlobalStyling = (lang) => {
    switch (lang) {
      case 'ar':
        return <ArabicGlobalStyle />;
      default:
        return null;
    }
  };

  return (
    <StyleSheetManager
      stylisPlugins={RTL_LANGUAGE_CODES.includes(lang) ? [rtlPlugin] : []}
    >
      <RecoilRoot initializeState={initRecoil}>
        {getLanguageBasedGlobalStyling(lang)}
        <Component {...pageProps} />
        <LiveChat />
      </RecoilRoot>
    </StyleSheetManager>
  );
};

App.getInitialProps = async ({ Component, ctx }) => {
  const { asPath, query, res } = ctx;
  const [pathname, ..._query] = asPath.split('?');
  const lang = getLanguageFromPathname({ pathname, query }) || 'en';
  const localizedStrings = await getLocalizationLabels({ lang });
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps({ ...ctx, localizedStrings })
    : {};

  if (query?.amp) {
    const location = asPath.replace('?amp=1', '');
    res.writeHead(301, {
      location,
    });
    res.end();
  }

  return { localizedStrings, pageProps, lang };
};

export default App;
