import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import ErrorPage from 'next/error';
import Router from 'next/router';
import { ThemeProvider } from 'styled-components';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import ServerCookies from 'cookies';
import Cookies from 'js-cookie';
import { getAppTheme } from 'style/theme';
import EnvironmentContext from 'contexts/environmentContext';
import { MBContextProvider } from 'contexts/MBContext';
import {
  getLanguageFromPathname,
  isNakedDomain,
  reflect,
  shouldRenderDynamicPage,
} from 'utils';
import { sendVariableToDataLayer } from 'utils/analytics';
import { checkIfCurrencyCodeValid } from 'utils/currency';
import { localServerSideIsMobileCheck } from 'utils/gen';
import { getLocalizationLabels } from 'utils/localizationUtils';
import { traceError } from 'utils/logutils';
import PlatformUtils from 'utils/platformUtils';
import { getPageData } from 'utils/prismicUtils';
import { removePageQuery } from 'utils/urlUtils';
import { gtmAtom } from 'store/atoms/gtm';
import { hsidAtom, hsidSetFailAtom } from 'store/atoms/hsid';
import {
  ANALYTICS_PROPERTIES,
  COOKIE,
  CUSTOM_TYPES,
  DESIGN,
  GDPR_COUNTRY_CODES,
  THEMES,
  TIME,
} from 'const/index';
import { strings } from 'const/strings';
import Analytics from './Analytics';

const Microsite = dynamic(() => import('components/MicrositeV1'));
const ContentPage = dynamic(() => import('components/ContentPage'));
const MicrositeV2 = dynamic(() => import('components/MicrositeV2'));
const ShowPage = dynamic(() => import('components/ShowPages'));
const GlobalMB = dynamic(() => import('components/GlobalMbs'));
const VenuePage = dynamic(() => import('components/VenuePage'));

const getValidUrlParams = (query: any) =>
  Object.entries(query)
    .filter(([key]) => key !== 'slug')
    .map(([key, val]) => `${key}=${val}`)
    .join('&')
    .trim();

type PageProps = { inventorySlotData: SimplifiedSlotsData; [k: string]: any };

const Page = (props: PageProps) => {
  // Render headout's session-id-setter on mount
  const [showSessionIdSetter, setShowSessionIdSetter] = useState(false);

  const {
    simplifiedCategoryTourListData,
    primaryCity,
    isCategoryV2,
    primaryCountry,
    activeCurrency,
    scorpioData,
    orderedTours,
    collectionVideos,
    // Not sure where this is used. Don't see this being passed in `prismicUtils` either
    categoryTourListData: legacyCategoryTourListData,
    docsForListicles,
    collectionsInListicles,
  } = props;
  const { tourGroupMap, ...rawCategoryTgidMap } =
    simplifiedCategoryTourListData ?? {};
  const entityIdToursMap: { [k: string]: Array<ProductCard> } = Object.entries(
    rawCategoryTgidMap || {}
  ).reduce((acc, [catId, tgids]: any) => {
    return {
      ...acc,
      [catId]: tgids.map((tgid: any) => tourGroupMap[tgid]),
    };
  }, {});

  const categoryTourListData = {
    ...entityIdToursMap,
    ...legacyCategoryTourListData,
    ...(primaryCity && { primaryCity }),
    ...(primaryCountry && { primaryCountry }),
    ...(activeCurrency && { activeCurrency }),
    ...(isCategoryV2 && { isCategoryV2 }),
    ...(scorpioData && { scorpioData }),
    ...(orderedTours && { orderedTours }),
    ...(collectionVideos && { collectionVideos }),
  };

  strings.setContent({
    default: props.localizedStrings ?? {},
  });
  useEffect(() => {
    const { query = {}, asPath } = props;
    const { bi } = query;
    if (typeof window != 'undefined') {
      if (bi) {
        sessionStorage.setItem('biLink', bi);
        removePageQuery(query, 'bi', asPath);
      }
    }

    setShowSessionIdSetter(true);
  }, []);

  const {
    CMSContent,
    tourGroupData,
    tgidsInPage,
    inventorySlotData,
    ContentType,
    statusCode,
    host,
    MBDesign,
    isDev,
    windowUrl,
    pathname,
    serverRequestStartTimestamp,
    lang,
    uid,
    toursList,
    isMobile,
    mbTheme = THEMES.DEFAULT,
    isPreview,
    currencySymbolMap,
    queryParams = {},
    biLink,
    isStage,
    collectionDetails,
    bannerImageData,
    domainConfig,
    categoryHeaderMenu,
    isExperimentalBot,
    breadcrumbs,
    cityPageParams,
  } = props;
  const { eventsReady } = useRecoilValue(gtmAtom);

  const { noTrack, tgidToScroll, bookSubdomain } = queryParams;

  if (statusCode) {
    return <ErrorPage statusCode={statusCode} />;
  }

  const microsite = CMSContent?.data?.microsite?.data || CMSContent?.data?.data;
  const redirectToHeadoutBookingFlow =
    ContentType === CUSTOM_TYPES.MICROSITE
      ? microsite?.redirect_to_headout_booking_flow
      : CMSContent?.data?.redirect_to_headout_booking_flow;

  const isGlobalMb =
    ContentType === CUSTOM_TYPES.GLOBAL_HOMEPAGE ||
    ContentType === CUSTOM_TYPES.GLOBAL_CITY ||
    ContentType === CUSTOM_TYPES.GLOBAL_COUNTRY ||
    ContentType === CUSTOM_TYPES.GLOBAL_COLLECTION ||
    ContentType === CUSTOM_TYPES.GLOBAL_EXPERIENCE;

  function getPageComponent(pageType: any) {
    switch (pageType) {
      case CUSTOM_TYPES.MICROSITE + DESIGN.V2:
      case CUSTOM_TYPES.MICROSITE + DESIGN.V3:
        return (
          <MicrositeV2
            data={CMSContent.data}
            lang={lang}
            host={host}
            isDev={isDev}
            scorpioData={tourGroupData}
            categoryTourListData={categoryTourListData}
            serverRequestStartTimestamp={serverRequestStartTimestamp}
            isMobile={isMobile}
            domainConfig={domainConfig}
            primaryCity={primaryCity}
            categoryHeaderMenu={categoryHeaderMenu}
            breadcrumbs={breadcrumbs}
          />
        );
      case CUSTOM_TYPES.VENUE_PAGE:
        return (
          <VenuePage
            data={CMSContent}
            isMobile={isMobile}
            host={host}
            lang={lang}
            uid={uid}
            isDev={isDev}
            domainConfig={domainConfig}
            serverRequestStartTimestamp={serverRequestStartTimestamp}
            tgidsInPage={tgidsInPage}
            breadcrumbs={breadcrumbs}
          />
        );
      case CUSTOM_TYPES.MICROSITE:
      case CUSTOM_TYPES.MICROSITE + DESIGN.V1:
        return (
          <Microsite
            cityPageParams={cityPageParams}
            data={CMSContent.data}
            activeCurrency={activeCurrency}
            scorpioData={tourGroupData}
            categoryTourListData={categoryTourListData}
            offerData={CMSContent.offerData}
            host={host}
            toursList={toursList}
            collectionDetails={collectionDetails}
            bannerImageData={bannerImageData}
            pathname={pathname}
            isDev={isDev}
            isStage={isStage}
            tgidToScroll={tgidToScroll}
            serverRequestStartTimestamp={serverRequestStartTimestamp}
            isMobile={isMobile}
            mbTheme={mbTheme}
            domainConfig={domainConfig}
            primaryCity={primaryCity}
            categoryHeaderMenu={categoryHeaderMenu}
            breadcrumbs={breadcrumbs}
          />
        );
      case CUSTOM_TYPES.CONTENT_PAGE:
        return (
          <ContentPage
            {...CMSContent}
            scorpioData={tourGroupData}
            isDev={isDev}
            host={host}
            prismicDocsForListicle={docsForListicles}
            collectionsInListicles={collectionsInListicles}
            categoryTourListData={categoryTourListData}
            activeCurrency={activeCurrency}
            serverRequestStartTimestamp={serverRequestStartTimestamp}
            isMobile={isMobile}
            offerData={CMSContent.offerData}
            toursList={toursList}
            pathname={pathname}
            tgidToScroll={tgidToScroll}
            mbTheme={mbTheme}
            domainConfig={domainConfig}
            primaryCity={primaryCity}
            categoryHeaderMenu={categoryHeaderMenu}
            eventsReady={eventsReady}
            breadcrumbs={breadcrumbs}
          />
        );
      case CUSTOM_TYPES.SHOW_PAGE:
        return (
          <ShowPage
            CMSContent={CMSContent}
            tourGroupData={tourGroupData}
            inventorySlotData={inventorySlotData}
            isDev={isDev}
            isMobile={isMobile}
            host={host}
            serverRequestStartTimestamp={serverRequestStartTimestamp}
            domainConfig={domainConfig}
            breadcrumbs={breadcrumbs}
          />
        );
      case CUSTOM_TYPES.GLOBAL_CITY:
      case CUSTOM_TYPES.GLOBAL_COUNTRY:
      case CUSTOM_TYPES.GLOBAL_COLLECTION:
      case CUSTOM_TYPES.GLOBAL_EXPERIENCE:
      case CUSTOM_TYPES.GLOBAL_HOMEPAGE:
        return (
          <GlobalMB
            {...CMSContent}
            isDev={isDev}
            isMobile={isMobile}
            host={host}
            categoryTourListData={categoryTourListData}
            serverRequestStartTimestamp={serverRequestStartTimestamp}
            domainConfig={domainConfig}
          />
        );
      default:
        return <ErrorPage statusCode={500} />;
    }
  }

  const pageType = ContentType + (MBDesign || '');
  const Component = getPageComponent(pageType);

  return (
    <div id="body-wrap">
      <EnvironmentContext.Provider
        value={{
          isDev,
          windowUrl,
        }}
      >
        <ThemeProvider theme={getAppTheme(mbTheme)}>
          <MBContextProvider
            host={host}
            uid={uid}
            lang={lang}
            microsite={microsite}
            design={MBDesign || DESIGN.V1}
            mbTheme={mbTheme}
            isPreview={isPreview}
            currencySymbolMap={currencySymbolMap}
            noTrack={!!noTrack || isDev}
            biLink={biLink}
            isGlobalMb={isGlobalMb}
            isDev={isDev}
            isStage={isStage}
            bookSubdomain={bookSubdomain}
            primaryCountry={primaryCountry}
            primaryCity={primaryCity}
            redirectToHeadoutBookingFlow={redirectToHeadoutBookingFlow}
            isExperimentalBot={isExperimentalBot}
          >
            {Component}
            {showSessionIdSetter ? <HeadoutSessionIdSetterComponent /> : null}
            <Analytics cmsContent={CMSContent} contentType={ContentType} />
          </MBContextProvider>
        </ThemeProvider>
      </EnvironmentContext.Provider>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, query, res, resolvedUrl: asPath } = ctx;
  const [pathname] = asPath.split('?') ?? [];
  const queryParamsString = getValidUrlParams(query);

  const lang = getLanguageFromPathname({ pathname, query }) || 'en';
  const { host }: { host?: string } = req?.headers || window?.location;

  const localizedStrings = await getLocalizationLabels({ lang });

  const serverRequestStartTimestamp = Math.floor(new Date().getTime());
  strings.setContent({
    default: localizedStrings,
  });
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  let isExperimentalBot = true;
  const isBot = req
    ? req.headers['x-bot'] === 'true' || typeof query?.['bot'] !== 'undefined'
    : PlatformUtils.isBot(userAgent);

  const serverCookies = new ServerCookies(req, res);
  /**
   * Adding window check below since `serverCookies.get` runs only on server side :/
   */
  if (
    typeof window === 'undefined' &&
    !checkIfCurrencyCodeValid({
      currencyCode: serverCookies.get(COOKIE.CURRENT_CURRENCY) as string,
    })
  ) {
    delete req.cookies[COOKIE.CURRENT_CURRENCY];
    serverCookies.set(COOKIE.CURRENT_CURRENCY);
  }

  let isMobile = req
    ? req?.headers?.['cloudfront-is-mobile-viewer'] === 'true'
    : window?.outerWidth < 768;

  // Checking if mystique is running in dev or is a preview
  const isDev = req
    ? !!query.mystique_uid
    : window.location.search.includes('mystique_uid');

  if (host?.includes('localhost') || host?.includes('test-headout')) {
    isMobile = localServerSideIsMobileCheck(req);
  }

  const isPreview = req
    ? !!query.previewSession
    : window.location.search.includes('previewSession');
  const { bi: biLink } = query;
  // Naked Domain to WWW Redirect.
  if (!isDev && req) {
    if (isNakedDomain(host as string)) {
      const redirectURL = `https://www.${host}${pathname}${
        queryParamsString ? `?${queryParamsString}` : ''
      }`;

      return {
        redirect: {
          destination: redirectURL,
          permanent: true,
          type: 301,
        },
      };
    }
  }

  if (query?.amp) {
    const queryParams = new URLSearchParams(queryParamsString);
    queryParams.delete('amp');
    const queryStr = queryParams.toString();
    const url = `https://${host}${pathname}${queryStr ? `?${queryStr}` : ''}`;
    return {
      redirect: {
        destination: url,
        permanent: true,
        type: 301,
      },
    };
  }

  // Asynchronously get the data for microsite or content page
  const { payload: props } = await reflect(
    getPageData({
      res,
      req,
      query,
      isDev,
      localizedStrings,
    })
  );

  if (shouldRenderDynamicPage(props?.CMSContent)) {
    isExperimentalBot = req
      ? req.headers['x-bot'] === 'true'
      : PlatformUtils.isBot(userAgent);
  }

  try {
    let url =
      props?.CMSContent?.data?.data?.redirect_url?.url ||
      props?.CMSContent?.data?.redirect_url?.url;
    if (url) {
      url = `${url}${queryParamsString ? `?${queryParamsString}` : ''}`;
      return {
        redirect: {
          destination: url,
          type: 302,
          permanent: false,
          props: {},
        },
      };
    }

    if (typeof window !== 'undefined')
      (window as any).prismic.setupEditButton();
    if (res) {
      if (props?.statusCode) {
        res.statusCode = props.statusCode;
      }
    }

    const protocol =
      req && req.headers['referer']
        ? req.headers['referer'].split(':')[0]
        : 'https';

    const countryCode = req?.headers?.['cloudfront-viewer-country'] as string;
    const isGDPRCompliant =
      !countryCode || GDPR_COUNTRY_CODES.includes(countryCode);

    const response = {
      props: {
        ...props,
        isExperimentalBot,
        localizedStrings,
        serverRequestStartTimestamp,
        windowUrl: req
          ? `${protocol}://${req.headers['host']}${req.url}`
          : window.location.href,
        isMobile,
        isPreview,
        query,
        asPath,
        biLink,
        cookies: req?.cookies ?? {},
        headers: JSON.stringify(req?.headers),
        isBot,
        isGDPRCompliant,
      },
    };
    const removeEmpty = (obj: any) => {
      const strData = JSON.stringify(obj);

      return JSON.parse(strData);
    };

    return removeEmpty(response);
  } catch (error) {
    traceError({ error, host: req?.headers?.host, url: req?.url });
    return {
      props: {},
    };
  }
};

const HeadoutSessionIdSetterComponent = () => {
  const experimentOverride = Router.query?.[COOKIE.EXPERIMENT_OVERRIDE];
  const validHsidFromCookie = Cookies.get(COOKIE.SANDBOX_ID);
  const setHsid = useSetRecoilState(hsidAtom);
  const setHsidSetFail = useSetRecoilState(hsidSetFailAtom);

  const pushSandboxIDtoDataLayer = (hsid: any) => {
    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.HSID,
      value: hsid,
    });
    setHsid(hsid);
  };
  useEffect(() => {
    const nakedDomain = window.location.hostname
      .replace('stage-', '')
      .split('.')
      .slice(1)
      .join('.');
    if (experimentOverride)
      Cookies.set(COOKIE.EXPERIMENT_OVERRIDE, experimentOverride, {
        domain: nakedDomain,
        path: '/',
        expires: TIME.IN_MINUTES,
      });
    const onMessageReceieved = (e: any) => {
      const { origin, data } = e;
      if (origin !== process.env.NEXT_PUBLIC_HEADOUT_DOMAIN) {
        return;
      }

      const { hsid } = JSON.parse(data);
      try {
        if (hsid === null) {
          // eslint-disable-next-line no-console
          console.warn(
            '[localStorage] hsid-ensurer failure, Unsupported Browser'
          );
          /**
           * hsid will also be null when third-party cookie is blocked or api fails, use a global state for that
           */
          setHsidSetFail(true);
        }

        if (hsid) {
          pushSandboxIDtoDataLayer(hsid);
          Cookies.set(COOKIE.SANDBOX_ID, hsid, {
            domain: nakedDomain,
            path: '/',
            expires: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
          });
        }
      } catch (e) {
        //
      }
    };
    if (!validHsidFromCookie)
      window.addEventListener('message', onMessageReceieved, true);
    if (validHsidFromCookie) {
      pushSandboxIDtoDataLayer(validHsidFromCookie);
    }
    return () =>
      window.removeEventListener('message', onMessageReceieved, true);
  }, []);

  if (validHsidFromCookie) return null;

  return (
    <iframe
      width="0"
      height="0"
      tabIndex={-1}
      title="empty"
      className="hidden"
      src={`${process.env.NEXT_PUBLIC_HEADOUT_DOMAIN}/hsid-provider.html`}
    ></iframe>
  );
};

export default Page;
