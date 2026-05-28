import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import ErrorPage from 'next/error';
import Router from 'next/router';
import { ThemeProvider } from 'styled-components';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import ServerCookies from 'cookies';
import Cookies from 'js-cookie';
import { getAppTheme } from 'style/theme';
import { TPrivateAirportTransfersLandingPageProps } from 'components/PrivateAirportTransfersLandingPage';
import EnvironmentContext from 'contexts/environmentContext';
import { MBContextProvider } from 'contexts/MBContext';
import useABTesting from 'hooks/useABTesting';
import { useGetAndSetExperiments } from 'hooks/useGetAndSetExperiments';
import { getLanguageFromPathname, getNakedDomain, reflect } from 'utils';
import { sendVariableToDataLayer, trackEvent } from 'utils/analytics';
import { checkIfCurrencyCodeValid } from 'utils/currency';
import { getUkExtraChargeExpVariant } from 'utils/experiments/experimentUtils';
import { localServerSideIsMobileCheck } from 'utils/gen';
import { checkIfBroadwayMB, checkIfLTTMB } from 'utils/helper';
import { getLocalizationLabels } from 'utils/localizationUtils';
import { sendLog } from 'utils/logger';
import { traceError } from 'utils/logutils';
import PlatformUtils from 'utils/platformUtils';
import getPageData from 'utils/prismicUtils/getPageData';
import { isAllowedPath, removePageQuery } from 'utils/urlUtils';
import { gtmAtom } from 'store/atoms/gtm';
import { hsidAtom, hsidSetFailAtom } from 'store/atoms/hsid';
import { metaAtom } from 'store/atoms/meta';
import { VARIANTS } from 'const/experiments';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  COOKIE,
  CUSTOM_TYPES,
  DESIGN,
  MB_CATEGORISATION,
  THEMES,
  TIME,
} from 'const/index';
import { LOG_LEVELS } from 'const/logs';
import { strings } from 'const/strings';
import Loader from './common/Loader';
import Analytics from './Analytics';
import UKExtraChargeExperimentTracker from './UKExtraChargeExperimentTracker';

const Microsite = dynamic(() => import('components/MicrositeV1'));
const ContentPage = dynamic(() => import('components/ShoulderPages'));
const MicrositeV2 = dynamic(() => import('components/MicrositeV2'));
const ShowPage = dynamic(() => import('components/ShowPages'));
const ShowPageV2 = dynamic(() => import('components/MicrositeV2/ShowPageV2'));
const GlobalMB = dynamic(() => import('components/GlobalMbs'));
const ReviewsPage = dynamic(() => import('components/ReviewsPage'));
const VenuePage = dynamic(() => import('components/VenuePage'));
const NewsPage = dynamic(() => import('components/NewsPage'));
const PrivateAirportTransfersLandingPage =
  dynamic<TPrivateAirportTransfersLandingPageProps>(() =>
    import('components/PrivateAirportTransfersLandingPage').then(
      (mod) => mod.PrivateAirportTransfersLandingPage
    )
  );

const { SUBATTRACTION_TYPE, SHOULDER_PAGE_TYPE } = MB_CATEGORISATION;

const getValidUrlParams = (query: any) =>
  Object.entries(query)
    .filter(([key]) => key !== 'slug')
    .map(([key, val]) => `${key}=${val}`)
    .join('&')
    .trim();

type PageProps = {
  inventorySlotData: SimplifiedSlotsData;
  [k: string]: any;

  airportTransfersLPExperimentVariant: string;
  countryCode: string;
};

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
    collectionReviews = {},
    catSubCatReviews = {},
    botReviewsByTGID = {},
    countryCode,
    categoryId,
    subCategoryId,
    uid,
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
    ...legacyCategoryTourListData,
    ...(primaryCity && { primaryCity }),
    ...(primaryCountry && { primaryCountry }),
    ...(activeCurrency && { activeCurrency }),
    ...(isCategoryV2 && { isCategoryV2 }),
    ...(scorpioData && { scorpioData }),
    ...(orderedTours && { orderedTours }),
    ...(collectionVideos && { collectionVideos }),
    ...entityIdToursMap,
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
    newsArticlesWithSameTgid,
    featuredNewsArticles,
    newsLandingPageUrl,
    tourGroupData,
    tgidsInPage,
    inventorySlotData,
    ContentType,
    statusCode,
    host,
    isDev,
    windowUrl,
    pathname,
    serverRequestStartTimestamp,
    lang,
    toursList,
    isMobile,
    mbTheme = THEMES.DEFAULT,
    isPreview,
    currencySymbolMap,
    queryParams = {},
    biLink,
    collectionDetails,
    bannerImageData,
    domainConfig,
    categoryHeaderMenu,
    breadcrumbs,
    cityPageParams,
    isCatOrSubCatPage,
    catAndSubCatPageData,
    MBDesign,
    collectionData,
    isSeatingPlanPage,
    theatreType,
    categoryDescriptors,
    subcategoryDescriptors,
    isEntertainmentBanner,
    bannerTrustBoosters,
    bannerV3Data,
    similarityBasedRankingExperimentControlTgids,
    ukExtraChargeExpVariant,
  } = props;

  const isLTT = checkIfLTTMB(uid);
  const isBroadway = checkIfBroadwayMB(uid);

  const showLttSpTreatment = isLTT || isBroadway;

  useGetAndSetExperiments();

  const CMSData =
    CMSContent?.subattractionsContentPageData?.CMSContent?.data ||
    CMSContent?.data;

  const { sections: qnaSections } = CMSContent?.qnaSections || [];

  const {
    isEligible: isSubattractionsExpEligible,
    variant: subattractionsExpVariant,
    isExperimentResolving: isSubattractionsExpResolving,
  } = useABTesting({
    experimentId: 'SUBATTRACTIONS_EXPERIMENT',
    noTrack: false,
    customEligibilityCheckFn: () =>
      CMSData?.shoulder_page_type == SHOULDER_PAGE_TYPE.SUB_ATTRACTIONS &&
      !!SUBATTRACTION_TYPE[
        CMSData?.subattraction_type as keyof typeof SUBATTRACTION_TYPE
      ],
  });

  const {
    isEligible: isMixpanelSessionReplayEligible,
    variant: mixpanelSessionReplayExpVariant,
    isExperimentResolving: isMixpanelSessionReplayExpResolving,
  } = useABTesting({
    experimentId: 'MIXPANEL_SESSION_REPLAY',
    noTrack: true,
    customEligibilityCheckFn: () => true,
  });

  useEffect(() => {
    if (
      isMixpanelSessionReplayEligible &&
      !isMixpanelSessionReplayExpResolving
    ) {
      const isSessionRecorded =
        mixpanelSessionReplayExpVariant === VARIANTS.TREATMENT ? 'Yes' : 'No';
      trackEvent({
        eventName: ANALYTICS_EVENTS.MIXPANEL_SESSION_REPLAY,
        [ANALYTICS_PROPERTIES.IS_SESSION_RECORDED]: isSessionRecorded,
      });
      Cookies.set(COOKIE.MIXPANEL_REPLAY, isSessionRecorded, {
        domain: getNakedDomain(host),
        path: '/',
        expires: TIME.IN_YEARS,
      });
    }
  }, [
    isMixpanelSessionReplayEligible,
    isMixpanelSessionReplayExpResolving,
    mixpanelSessionReplayExpVariant,
  ]);

  const { collectionId: refererCollectionId } = useRecoilValue(metaAtom);
  useEffect(() => {
    if (!refererCollectionId) return;
    Cookies.set(COOKIE.REFERRER_COLLECTION_ID, refererCollectionId, {
      domain: getNakedDomain(host),
      path: '/',
      expires: TIME.IN_YEARS,
    });
  }, [refererCollectionId]);

  const shouldShowNewSubattractionsExp =
    isSubattractionsExpEligible &&
    (subattractionsExpVariant == VARIANTS.TREATMENT ||
      CMSData?.subattraction_type === SUBATTRACTION_TYPE.A);

  const { eventsReady } = useRecoilValue(gtmAtom);

  const { noTrack, tgidToScroll, bookSubdomain } = queryParams;

  if (statusCode) {
    return <ErrorPage statusCode={statusCode} />;
  }

  const microsite =
    CMSContent?.data?.microsite_document_ref?.data || CMSContent?.data;
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
            data={CMSContent}
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
            isCatOrSubCatPage={isCatOrSubCatPage}
            catAndSubCatPageData={catAndSubCatPageData}
            uid={uid}
            isSeatingPlanPage={isSeatingPlanPage}
            theatreType={theatreType}
            categoryDescriptors={categoryDescriptors}
            subcategoryDescriptors={subcategoryDescriptors}
            isEntertainmentBanner={isEntertainmentBanner}
            bannerTrustBoosters={bannerTrustBoosters}
            collectionReviews={collectionReviews}
            catSubCatReviews={catSubCatReviews}
            categoryId={categoryId}
            subCategoryId={subCategoryId}
            botReviewsByTGID={botReviewsByTGID}
          />
        );
      case CUSTOM_TYPES.NEWS_PAGE:
        return (
          <NewsPage
            data={CMSContent}
            isMobile={isMobile}
            host={host}
            lang={lang}
            uid={uid}
            isDev={isDev}
            domainConfig={domainConfig}
            serverRequestStartTimestamp={serverRequestStartTimestamp}
          />
        );

      case CUSTOM_TYPES.REVIEWS_PAGE:
        return (
          <ReviewsPage
            data={CMSContent}
            isMobile={isMobile}
            host={host}
            lang={lang}
            uid={uid}
            isDev={isDev}
            domainConfig={domainConfig}
            serverRequestStartTimestamp={serverRequestStartTimestamp}
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
        if (isSubattractionsExpEligible && isSubattractionsExpResolving)
          return <Loader />;

        if (!shouldShowNewSubattractionsExp) {
          return (
            <Microsite
              cityPageParams={cityPageParams}
              data={CMSContent}
              activeCurrency={activeCurrency}
              scorpioData={tourGroupData}
              categoryTourListData={categoryTourListData}
              offerData={CMSContent.offerData}
              host={host}
              toursList={toursList}
              similarityBasedRankingExperimentControlTgids={
                similarityBasedRankingExperimentControlTgids
              }
              collectionDetails={collectionDetails}
              bannerImageData={bannerImageData}
              bannerV3Data={bannerV3Data}
              pathname={pathname}
              isDev={isDev}
              tgidToScroll={tgidToScroll}
              serverRequestStartTimestamp={serverRequestStartTimestamp}
              isMobile={isMobile}
              mbTheme={mbTheme}
              domainConfig={domainConfig}
              primaryCity={primaryCity}
              categoryHeaderMenu={categoryHeaderMenu}
              breadcrumbs={breadcrumbs}
              isCatOrSubCatPage={isCatOrSubCatPage}
              catAndSubCatPageData={catAndSubCatPageData}
              uid={uid}
              categoryDescriptors={categoryDescriptors}
              subcategoryDescriptors={subcategoryDescriptors}
              isEntertainmentBanner={isEntertainmentBanner}
              bannerTrustBoosters={bannerTrustBoosters}
              collectionReviews={collectionReviews}
              catSubCatReviews={catSubCatReviews}
              categoryId={categoryId}
              subCategoryId={subCategoryId}
              qnaSections={qnaSections}
              botReviewsByTGID={botReviewsByTGID}
            />
          );
        }
      // eslint-disable-next-line no-duplicate-case, no-fallthrough
      case CUSTOM_TYPES.MICROSITE: // Duplicated to treat subatraction pages as shoulder pages instead of microsites
      case CUSTOM_TYPES.CONTENT_PAGE:
        if (isSubattractionsExpEligible && isSubattractionsExpResolving)
          return <Loader />;
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
            uid={uid}
            collectionData={collectionData}
            shouldShowNewSubattractionsExp={shouldShowNewSubattractionsExp}
          />
        );
      case CUSTOM_TYPES.SHOW_PAGE:
        return showLttSpTreatment ? (
          <ShowPageV2
            CMSContent={CMSContent}
            isLTT={isLTT}
            newsArticlesWithSameTgid={newsArticlesWithSameTgid}
            featuredNewsArticles={featuredNewsArticles}
            newsLandingPageUrl={newsLandingPageUrl}
            tourGroupData={tourGroupData}
            inventorySlotData={inventorySlotData}
            isDev={isDev}
            isMobile={isMobile}
            host={host}
            serverRequestStartTimestamp={serverRequestStartTimestamp}
            domainConfig={domainConfig}
            primaryCity={primaryCity}
            categoryHeaderMenu={categoryHeaderMenu}
            breadcrumbs={breadcrumbs}
          />
        ) : (
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

      case CUSTOM_TYPES.MICROSITE + DESIGN.PRIVATE_AIRPORT_TRANSFERS:
        return (
          <PrivateAirportTransfersLandingPage
            cmsContent={CMSContent}
            host={host}
            isDev={isDev}
            domainConfig={domainConfig}
            isMobile={isMobile}
            serverRequestStartTimestamp={serverRequestStartTimestamp}
            cityPageParams={cityPageParams}
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
            bookSubdomain={bookSubdomain}
            primaryCountry={primaryCountry}
            primaryCity={
              MBDesign === DESIGN.PRIVATE_AIRPORT_TRANSFERS
                ? {
                    cityCode: cityPageParams?.mbLocationData?.mbCity,
                    country: {
                      displayName: cityPageParams?.mbLocationData?.mbCountry,
                    },
                  }
                : primaryCity
            }
            redirectToHeadoutBookingFlow={redirectToHeadoutBookingFlow}
            categoryHeaderMenu={categoryHeaderMenu}
            userCountry={countryCode}
          >
            <Analytics cmsContent={CMSContent} contentType={ContentType} />
            {Component}
            {ukExtraChargeExpVariant ? (
              <UKExtraChargeExperimentTracker
                variant={ukExtraChargeExpVariant}
              />
            ) : null}
            {showSessionIdSetter ? <HeadoutSessionIdSetterComponent /> : null}
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

  if (!isAllowedPath(pathname)) {
    return {
      notFound: true,
      props: {},
    };
  }

  const lang = getLanguageFromPathname({ pathname, query }) || 'en';
  const {
    host,
  }: {
    host?: string;
  } = req?.headers || window?.location;

  const localizedStrings = await getLocalizationLabels({ lang });

  const serverRequestStartTimestamp = Math.floor(new Date().getTime());
  strings.setContent({
    default: localizedStrings,
  });
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const isBot = req
    ? req.headers['x-bot'] === 'true' || typeof query?.['bot'] !== 'undefined'
    : PlatformUtils.isBot(userAgent);

  const serverCookies = new ServerCookies(req, res);

  const channel = req.headers['x-channel'];
  if (channel && channel !== serverCookies.get(COOKIE.CURRENT_CHANNEL)) {
    serverCookies.set(COOKIE.CURRENT_CHANNEL, channel as string, {
      domain: getNakedDomain(host as string),
      expires: new Date(Date.now() + TIME.IN_DAYS * 31),
      httpOnly: false,
    });
    req.cookies[COOKIE.CURRENT_CHANNEL] = channel as string; // ensures current API calls include the channel.
  }

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

  const isDev = req
    ? !!query.mystique_uid
    : window.location.search.includes('mystique_uid');

  if (
    host?.includes('localhost') ||
    host?.includes('mystique.test-headout') ||
    host?.includes('mystique.dev-headout')
  ) {
    isMobile = localServerSideIsMobileCheck(req);
  }

  const isPreview = req
    ? !!query.previewSession
    : window.location.search.includes('previewSession');
  const { bi: biLink } = query;

  if (query?.amp) {
    const queryParams = new URLSearchParams(queryParamsString);
    queryParams.delete('amp');
    const queryStr = queryParams.toString();
    const url = `https://${host}${pathname}${queryStr ? `?${queryStr}` : ''}`;
    return {
      redirect: {
        destination: url,
        statusCode: 301,
      },
    };
  }

  /** UK_EXTRA_CHARGE_ENABLED is a browser cookie set client-side after the first render.
   * UK_EXTRA_CHARGE_SSR is set on the request object during SSR (server-side only) since
   * browser cookies aren't available on the very first server-side render.
   * Both represent the same experiment state; we check both to cover SSR and client contexts.
   */

  const ukExtraChargeExpVariant = getUkExtraChargeExpVariant(req?.headers);

  const isUkExtraChargeTreatment =
    ukExtraChargeExpVariant === VARIANTS.TREATMENT ? 'true' : 'false';
  try {
    req.cookies[COOKIE.UK_EXTRA_CHARGE_SSR] = isUkExtraChargeTreatment;

    serverCookies.set(
      COOKIE.UK_EXTRA_CHARGE_ENABLED,
      isUkExtraChargeTreatment,
      {
        domain: getNakedDomain(host as string) || undefined,
        path: '/',
        httpOnly: false,
      }
    );
  } catch (e) {
    // silently fail
  }

  const response = await reflect(
    getPageData({
      res,
      req,
      query,
      isDev,
      localizedStrings,
      isBot,
    })
  );

  const props = response?.payload;

  try {
    let url =
      props?.CMSContent?.data?.redirect_url?.url ||
      props?.CMSContent?.data?.redirect_url?.url;
    if (url) {
      url = `${url}${queryParamsString ? `?${queryParamsString}` : ''}`;
      return {
        redirect: {
          destination: url,
          statusCode: 301,
        },
      };
    }

    if (props?.redirectInfo) {
      return {
        redirect: {
          destination: props?.redirectInfo?.url,
          statusCode: 301,
        },
      };
    }

    if (typeof window !== 'undefined')
      (window as any).prismic.setupEditButton();
    if (res) {
      if (props?.statusCode) {
        sendLog({
          level: LOG_LEVELS.ERROR,
          message: `[getServerSideProps] - props - ${JSON.stringify(props)}`,
        });
        res.statusCode = props.statusCode;
      }
    }

    const protocol =
      req && req.headers['referer']
        ? req.headers['referer'].split(':')[0]
        : 'https';

    const countryCode = req?.headers?.['cloudfront-viewer-country'] as string;

    const response = {
      props: {
        ...props,
        isBot,
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
        headers: JSON.stringify(req?.headers),
        countryCode,
        ukExtraChargeExpVariant,
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
    const nakedDomain = window.location.hostname.split('.').slice(1).join('.');
    if (experimentOverride)
      Cookies.set(COOKIE.EXPERIMENT_OVERRIDE, experimentOverride as string, {
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

          trackEvent({
            eventName: ANALYTICS_EVENTS.HSID_SET_FAIL,
            url: window?.location?.href,
          });

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
      } catch (e: any) {
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
