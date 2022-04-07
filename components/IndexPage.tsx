import React, { useEffect } from 'react';
import ErrorPage from 'next/error';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import { ThemeProvider } from 'styled-components';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import EnvironmentContext from 'contexts/environmentContext';
import { MBContextProvider } from 'contexts/MBContext';
import { getAppTheme } from 'style/theme';
import { Client } from 'config/prismic-config';
import {
  ANALYTICS_PROPERTIES,
  CUSTOM_TYPES,
  DESIGN,
  PAGE_TYPES,
  THEMES,
} from 'const/index';
import { redirectTo, reflect, isNakedDomain } from 'utils';
import { getPageData } from 'utils/prismicUtils';
import { sendVariableToDataLayer } from 'utils/analytics';
import { removePageQuery } from 'utils/urlUtils';
import { traceError } from 'utils/logutils';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { gtmAtom } from 'store/atoms/gtm';
import { hsidAtom, hsidSetFailAtom } from 'store/atoms/hsid';
import { withShortcodes } from 'utils/helper';
import { localServerSideIsMobileCheck } from 'utils/gen';

const Microsite = dynamic(() => import('components/MicrositeV1'));
const ContentPage = dynamic(() => import('components/ContentPage'));
const MicrositeV2 = dynamic(() => import('components/MicrositeV2'));
const Listicle = dynamic(() => import('components/ListiclePage'));
const ShowPage = dynamic(() => import('components/ShowPages'));
const GlobalMB = dynamic(() => import('components/GlobalMbs'));

const getValidUrlParams = (query) =>
  Object.entries(query)
    .filter(([key]) => key !== 'slug')
    .map(([key, val]) => `${key}=${val}`)
    .join('&')
    .trim();
const Page = (props) => {
  useEffect(() => {
    const { query = {}, asPath } = props;
    const { bi } = query;
    if (typeof window != 'undefined') {
      if (bi) {
        sessionStorage.setItem('biLink', bi);
        removePageQuery(query, 'bi', asPath);
      }
    }
  }, []);

  const {
    CMSContent,
    tourGroupData,
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
    categoryTourListData = {},
    isMobile,
    mbTheme = THEMES.DEFAULT,
    isPreview,
    currencySymbolMap,
    activeCurrency,
    queryParams = {},
    biLink,
    isStage,
    primaryCountry,
    primaryCity,
  } = props;
  const [{ eventsReady }, setEventsReady] = useRecoilState(gtmAtom);

  useEffect(() => {
    // GTM Universal Properties
    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.LANGUAGE,
      value: lang,
    });
    const customType = ContentType;
    if (!customType) return;

    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.PAGE_TYPE,
      value:
        customType !== CUSTOM_TYPES.CONTENT_PAGE
          ? PAGE_TYPES.COLLECTION
          : PAGE_TYPES.CONTENT_PAGE,
    });
    const pageHeading =
      customType === CUSTOM_TYPES.MICROSITE
        ? CMSContent?.data?.data?.heading
        : CMSContent?.data?.featured_title;
    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.PAGE_HEADING,
      value: withShortcodes(pageHeading).join(''),
    });

    setEventsReady({ eventsReady: true });
  }, []);

  const { noTrack, tgidToScroll, bookSubdomain } = queryParams;

  if (statusCode) {
    return <ErrorPage statusCode={statusCode} />;
  }

  const microsite = CMSContent?.data?.microsite?.data || CMSContent?.data?.data;
  const isGlobalMb =
    ContentType === CUSTOM_TYPES.GLOBAL_HOMEPAGE ||
    ContentType === CUSTOM_TYPES.GLOBAL_CITY ||
    ContentType === CUSTOM_TYPES.GLOBAL_COUNTRY ||
    ContentType === CUSTOM_TYPES.GLOBAL_COLLECTION ||
    ContentType === CUSTOM_TYPES.GLOBAL_EXPERIENCE;

  function getPageComponent(pageType) {
    switch (pageType) {
      case CUSTOM_TYPES.MICROSITE + DESIGN.V2:
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
          />
        );
      case CUSTOM_TYPES.MICROSITE:
      case CUSTOM_TYPES.MICROSITE + DESIGN.V1:
        return (
          <Microsite
            data={CMSContent.data}
            activeCurrency={activeCurrency}
            scorpioData={tourGroupData}
            categoryTourListData={categoryTourListData}
            offerData={CMSContent.offerData}
            host={host}
            toursList={toursList}
            pathname={pathname}
            isDev={isDev}
            isStage={isStage}
            tgidToScroll={tgidToScroll}
            serverRequestStartTimestamp={serverRequestStartTimestamp}
            isMobile={isMobile}
            mbTheme={mbTheme}
          />
        );
      case CUSTOM_TYPES.CONTENT_PAGE:
        return (
          <ContentPage
            {...CMSContent}
            scorpioData={tourGroupData}
            isDev={isDev}
            host={host}
            categoryTourListData={categoryTourListData}
            activeCurrency={activeCurrency}
            serverRequestStartTimestamp={serverRequestStartTimestamp}
            isMobile={isMobile}
            offerData={CMSContent.offerData}
            toursList={toursList}
            pathname={pathname}
            tgidToScroll={tgidToScroll}
            mbTheme={mbTheme}
            eventsReady={eventsReady}
          />
        );
      case CUSTOM_TYPES.LISTICLE:
        return (
          <Listicle
            {...CMSContent}
            isDev={isDev}
            host={host}
            serverRequestStartTimestamp={serverRequestStartTimestamp}
          />
        );
      case CUSTOM_TYPES.SHOW_PAGE:
        return (
          <ShowPage
            CMSContent={CMSContent}
            tourGroupData={tourGroupData}
            inventorySlotData={inventorySlotData}
            isDev={isDev}
            host={host}
            serverRequestStartTimestamp={serverRequestStartTimestamp}
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
          >
            {Component}
            {typeof window !== 'undefined' ? (
              <HeadoutSessionIdSetterComponent />
            ) : null}
          </MBContextProvider>
        </ThemeProvider>
      </EnvironmentContext.Provider>
    </div>
  );
};

Page.getInitialProps = async (ctx) => {
  const { req, query, res, asPath } = ctx;
  const serverRequestStartTimestamp = Math.floor(new Date().getTime());
  const queryParamsString = getValidUrlParams(query);
  const { host } = req?.headers || window?.location;
  const pathname =
    req?.url.split('?')[0].split('#')[0] || window.location.pathname;
  let isMobile = req
    ? req?.headers?.['cloudfront-is-mobile-viewer'] === 'true'
    : window?.outerWidth < 768;

  // Checking if mystique is running in dev or is a preview
  const isDev = req
    ? !!query.mystique_uid
    : window.location.search.includes('mystique_uid');

  if (query.mystique_uid) {
    isMobile = localServerSideIsMobileCheck(req);
  }

  const isPreview = req
    ? !!query.previewSession
    : window.location.search.includes('previewSession');
  const { bi: biLink } = query;
  // Naked Domain to WWW Redirect.
  if (!isDev && req) {
    if (isNakedDomain(host)) {
      const redirectURL = `https://www.${host}${pathname}${
        queryParamsString ? `?${queryParamsString}` : ''
      }`;
      redirectTo({ res, url: redirectURL, type: 301 });
    }
  }

  // Logic to get the redirect uid
  let redirectUID;
  if (isDev) {
    if (req) {
      redirectUID = query.mystique_uid;
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      redirectUID = urlParams.get('mystique_uid');
    }
  } else {
    if (req) {
      redirectUID = req.headers.host;
    } else {
      redirectUID = window.location.host;
    }
  }
  redirectUID = redirectUID.replace('stage-', '');

  /**
   * Asynchronously check if a redirect exists for the request
   * and get the data for microsite or content page
   */
  const [_redirect, { payload: props }] = await Promise.all(
    [
      Client(req)
        .getByUID(CUSTOM_TYPES.REDIRECT, redirectUID)
        .then((r) => {
          let redirectURL = r.data?.redirect_to_url?.url;
          if (redirectURL) {
            if (redirectURL[redirectURL.length - 1] === '/')
              redirectURL = redirectURL.slice(0, -1);
            redirectTo({
              res,
              url: `${redirectURL}${pathname !== '/index' ? pathname : ''}${
                queryParamsString ? `?${queryParamsString}` : ''
              }`,
              type: r.data?.redirect_type,
            });
          }
        }),
      getPageData({
        res,
        req,
        query,
        isDev,
      }),
    ].map(reflect)
  );

  try {
    let url =
      props?.CMSContent?.data?.data?.redirect_url?.url ||
      props?.CMSContent?.data?.redirect_url?.url;
    if (url) {
      url = `${url}${queryParamsString ? `?${queryParamsString}` : ''}`;
      redirectTo({ res, url });
    }

    if (process?.browser) (window as any).prismic.setupEditButton();
    if (res) {
      if (props?.statusCode) {
        res.statusCode = props.statusCode;
      }
    }
    if (
      req &&
      req.headers.host.startsWith('stage-') &&
      process.env.GIT_BRANCH
    ) {
      res.setHeader('x-git-branch', process.env.GIT_BRANCH);
      res.setHeader('x-git-actor', process.env.GIT_ACTOR);
    }
    const protocol =
      req && req.headers['referer']
        ? req.headers['referer'].split(':')[0]
        : 'https';
    return {
      ...props,
      serverRequestStartTimestamp,
      windowUrl: req
        ? `${protocol}://${req.headers['host']}${req.url}`
        : window.location.href,
      isMobile,
      isPreview,
      query,
      asPath,
      biLink,
    };
  } catch (error) {
    traceError({ error, host: req?.headers?.host, url: req?.url });
    return {};
  }
};

const HeadoutSessionIdSetterComponent = () => {
  const validHsidFromCookie = Cookies.get(ANALYTICS_PROPERTIES.HSID);
  const setHsid = useSetRecoilState(hsidAtom);
  const setHsidSetFail = useSetRecoilState(hsidSetFailAtom);

  const pushSandboxIDtoDataLayer = (hsid) => {
    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.HSID,
      value: hsid,
    });
    setHsid(hsid);
  };
  useEffect(() => {
    const onMessageReceieved = (e) => {
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
          const nakedDomain = window.location.hostname
            .replace('stage-', '')
            .split('.')
            .slice(1)
            .join('.');
          pushSandboxIDtoDataLayer(hsid);
          Cookies.set('h-sid', hsid, {
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
