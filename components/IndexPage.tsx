import React from 'react';
import ErrorPage from 'next/error';
import dynamic from 'next/dynamic';
import fetch from 'isomorphic-unfetch';
import Cookies from 'js-cookie';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import {
  redirectTo,
  reflect,
  isNakedDomain,
  getHeadoutLanguagecode,
} from 'utils';
import { uncategorizedToursListParser } from 'utils/dataParsers';
import { getLangUID, isAmpUrl, removePageQuery } from 'utils/urlUtils';
import { currencyAtom } from 'store/atoms/currency';
import { getPrismicDocument } from 'utils/prismicUtils';
import { fetchCategory, fetchCurrencyList } from 'utils/apiUtils';
import { getHostName } from 'utils/getHostName';

import { getAppTheme } from '../style/theme';
import EnvironmentContext from '../contexts/environmentContext';
import { Client } from '../config/prismic-config';
import { CUSTOM_TYPES, DESIGN, THEMES } from '../constants';
import { MBContextProvider } from '../contexts/MBContext';
import { toursTabSliceHandler } from './Slices';
import { fetchTourGroupData } from '../utils/apiUtils';

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
export default class Page extends React.Component<any, any> {
  static async getInitialProps(ctx) {
    const { req, query, res, asPath } = ctx;
    const serverRequestStartTimestamp = Math.floor(new Date().getTime());
    const queryParamsString = getValidUrlParams(query);
    const pathname =
      req?.url.split('?')[0].split('#')[0] || window.location.pathname;
    const isMobile = req
      ? req?.headers?.['cloudfront-is-mobile-viewer'] === 'true'
      : window?.outerWidth < 768;
    // Checking if mystique is running in dev or is a preview
    const isDev = req
      ? !!query.mystique_uid
      : window.location.search.includes('mystique_uid');
    const isPreview = req
      ? !!query.previewSession
      : window.location.search.includes('previewSession');
    const { bi: biLink } = query;
    // Naked Domain to WWW Redirect.
    if (!isDev && req) {
      const { host } = req.headers;
      if (isNakedDomain(host)) {
        const redirectURL = `https://www.${host}${pathname}${queryParamsString ? `?${queryParamsString}` : ''
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
                url: `${redirectURL}${pathname !== '/index' ? pathname : ''}${queryParamsString ? `?${queryParamsString}` : ''
                  }`,
                type: r.data?.redirect_type,
              });
            }
          }),
        Page.getData({
          res,
          req,
          query,
          isDev,
        }),
      ].map(reflect)
    );

    try {
      let url = props?.CMSContent?.data?.data?.redirect_url?.url;
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
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  static async getData({ res: serverResponse, req, query, isDev }) {
    const { host } = req.headers || window.location;
    const isStage = host.includes('stage-');
    const { uid, lang } = getLangUID(req, query);
    try {
      let initial_tgids = [];

      const { ContentType, CMSContent, statusCode } = await getPrismicDocument({
        query,
        req,
        serverResponse,
      });

      if (statusCode) {
        return {
          statusCode,
        };
      }

      /**
       * AllData will yield different sets of Properties based on CUSTOM_TYPE,
       * and finally gets returned with any other common data for CUSTOM_TYPE
       */
      let AllData = {};
      if (ContentType === CUSTOM_TYPES.CONTENT_PAGE) {
        AllData = {
          CMSContent,
          ContentType,
          uid,
          lang,
          isDev,
          host,
        };
      }

      if (ContentType === CUSTOM_TYPES.GLOBAL_COLLECTION) {
        let ticketsData, startingPrice, currencyCode, currencySymbol;
        const categoryId = CMSContent?.data?.headout_category_id;
        if (categoryId) {
          ticketsData = await fetchCategory(categoryId);
        }
        if (ticketsData?.products?.length) {
          currencyCode = ticketsData?.products
            ?.map((ticket) => ticket?.listingPrice?.currencyCode)
            ?.filter(
              (currency, index, self) => self.indexOf(currency) === index
            )
            ?.reduce((acc, cur) => acc + cur);

          startingPrice = Math.min(
            ...ticketsData?.products?.map(
              (ticket) => ticket?.listingPrice?.finalPrice
            )
          );
        }

        if (currencyCode) {
          const allCurrencies = await fetchCurrencyList();
          currencySymbol = allCurrencies
            ?.filter((d) => d.code === currencyCode)
            ?.reduce((acc, cur) => acc + cur);
        }

        return {
          CMSContent: {
            ...CMSContent,
            tickets: {
              data: ticketsData,
              startingPrice,
              currencySymbol,
            },
          },
          ContentType,
          uid,
          lang,
          isDev,
          host,
        };
      }

      if (ContentType === CUSTOM_TYPES.GLOBAL_CITY) {
        const allCurrencies = await fetchCurrencyList();
        return {
          CMSContent: {
            ...CMSContent,
            allCurrencies,
          },
          ContentType,
          uid,
          lang,
          isDev,
          host,
        };
      }

      if (
        ContentType === CUSTOM_TYPES.GLOBAL_HOMEPAGE ||
        ContentType === CUSTOM_TYPES.GLOBAL_COUNTRY ||
        ContentType === CUSTOM_TYPES.GLOBAL_EXPERIENCE ||
        ContentType === CUSTOM_TYPES.LISTICLE
      ) {
        return { CMSContent, ContentType, uid, lang, isDev, host };
      }
      if (ContentType === CUSTOM_TYPES.SHOW_PAGE) {
        try {
          const hostName = getHostName(isStage, isDev);
          const tgidData = await fetchTourGroupData(
            CMSContent.data?.tgid,
            hostName
          ).then((res) => {
            return res.json();
          });

          return {
            CMSContent,
            tourGroupData: tgidData,
            ContentType,
            uid,
            lang,
            isDev,
            host,
          };
        } catch (err) {
          console.log(err);
        }
      }
      /**
       * Setting a Common Microsite Reference for Content Page & Regular Microsite
       * Added to make tour data available on Content Pages.
       * i.e Content Page now contains all of the data from its related Microsite.
       */
      let microsite =
        ContentType === CUSTOM_TYPES.CONTENT_PAGE
          ? CMSContent.data.microsite
          : CMSContent.data;

      const all_tours_tab_tgids =
        microsite.data.all_tours.reduce((accum, tour) => {
          return [...accum, tour.primary.tgid];
        }, []) || [];

      let labelIds;
      if (all_tours_tab_tgids.length) {
        labelIds = microsite.data.content_order.reduce((accum, label) => {
          return [...accum, label.label.id];
        }, []);
        microsite.data.labels = await Client(req)
          .getByIDs(labelIds)
          .then((res) => {
            return res.results;
          });
      }
      let tgidsArray = [];

      if (ContentType === CUSTOM_TYPES.MICROSITE) {
        const MBDesign = CMSContent.data.data.design || '';
        const mbTheme = CMSContent.data.data.theme || THEMES.DEFAULT;
        const toursTabFirstSlice = CMSContent.data.data.body1[0];
        const primsicTours = toursTabFirstSlice
          ? await toursTabSliceHandler(toursTabFirstSlice)
          : [];
        const offers = primsicTours
          .filter((tour) => tour.offer__free_tour?.id)
          .map((tour) => tour.offer__free_tour?.id);
        const uniqueOfferIds = offers.filter(
          (id, index) => offers.indexOf(id) === index
        );
        if (uniqueOfferIds.length)
          (CMSContent as any).offerData = await Client(req)
            .getByIDs(uniqueOfferIds)
            .then((offerData) => {
              offerData.results.map((offer) => {
                if (parseInt(offer.data.offer_tgid) > 0)
                  initial_tgids.push(offer.data.offer_tgid);
              });
              return offerData;
            });

        const toursList = uncategorizedToursListParser(
          primsicTours,
          initial_tgids
        );
        tgidsArray = toursList.reduce((acc, tour) => {
          return [...acc, tour.tgid];
        }, []);

        const queryParams = (function getScrollTgid() {
          try {
            const href = req
              ? `http://${host}${req.url}`
              : window.location.href;
            const url = new URL(href);
            if (url) {
              return {
                tgidToScroll: url.searchParams.get('tgid'),
                noTrack: typeof url.searchParams.get('no-track') === 'string',
                currencyCode: url.searchParams.get('currencyCode'),
              };
            }
            return {};
          } catch (e) {
            console.log(e);
            return {};
          }
        })();

        AllData = {
          CMSContent,
          toursList,
          ContentType,
          uid,
          lang,
          host,
          MBDesign,
          isDev,
          queryParams,
          mbTheme,
        };
      }

      tgidsArray = [...tgidsArray, ...all_tours_tab_tgids];
      const currency = AllData?.['queryParams']?.currencyCode
        ? `&currency=${AllData?.['queryParams']?.currencyCode}`
        : '';
      const tourGroupAPIResponses = await fetch(
        `https://${isStage ? 'stage-' : ''
        }microbrands.headout.com/api/tours/v5/tour-group/list?ids[]=${tgidsArray}&language=${getHeadoutLanguagecode(
          lang
        )}${currency}`
      ).then((r) => r.json());

      const tourGroupData = tourGroupAPIResponses?.tourGroups?.reduce(
        (accum: {}, tour: any) => {
          const { hide_df, hide_safe } = AllData['CMSContent']?.data?.data || {
            hide_df: false,
            hide_safe: false,
          };
          let allTags = tour.allTags || [];
          if (hide_df) {
            allTags = allTags.filter((t) => !t.includes('DF-'));
          }
          if (hide_safe) {
            allTags = allTags.filter((t) => !t.includes('SAFE'));
          }
          return {
            ...accum,
            [tour['id']]: {
              title: tour.name,
              highlights: tour.microBrandsHighlight,
              descriptors: tour.microBrandsDescriptor,
              productHighlights: tour.highlights,
              productTitle: tour.name,
              images: [
                ...(tour.media?.productImages || []),
                { url: tour.imageUrl },
              ],
              averageRating: tour.averageRating,
              reviewCount: tour.reviewCount,
              ctaBooster: tour.callToAction,
              available:
                !(tour.listingPrice === null) ||
                !(tour.discountedFuturesListingPrice === null),
              allTags,
              dfListingPrice: tour.discountedFuturesListingPrice,
              safetyImages: tour.media?.safetyImages || [],
              validity: tour?.validity,
              ...(isAmpUrl(query) && { listingPrice: tour.listingPrice }),
            },
          };
        },
        {}
      );

      const currencySymbolMap = tourGroupAPIResponses?.currencies?.reduce(
        (acc, currency) => ({
          ...acc,
          [currency.code]: { ...currency },
        }),
        {}
      );
      const activeCurrency = tourGroupAPIResponses?.currencies?.[0];
      return {
        ...AllData,
        tourGroupData,
        currencySymbolMap,
        activeCurrency,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
      };
    }
  }

  static async getRefsArrayByIds(ref_ids: Array<String>, req: Request) {
    const linkedRefsPromise = Client(req).getByIDs(ref_ids.filter((id) => id));
    return await Promise.resolve(linkedRefsPromise).then((res: any) => {
      return res.results;
    });
  }

  constructor(props) {
    super(props);
    const { query = {}, asPath } = props;
    const { bi } = query;
    if (typeof window != 'undefined') {
      if (bi) {
        sessionStorage.setItem('biLink', bi);
        removePageQuery(query, 'bi', asPath);
      }
    }
  }

  componentDidMount() {
    window.addEventListener(
      'message',
      (e) => {
        const { origin, data } = e;
        if (origin !== process.env.NEXT_PUBLIC_HEADOUT_DOMAIN) {
          return;
        }

        const { hsid } = JSON.parse(data);
        try {
          if (hsid) {
            const nakedDomain = window.location.hostname
              .replace('stage-', '')
              .split('.')
              .slice(1)
              .join('.');

            Cookies.set('h-sid', hsid, {
              domain: nakedDomain,
              path: '/',
              expires: new Date(
                new Date().getTime() + 365 * 24 * 60 * 60 * 1000
              ),
            });
          }
        } catch (e) {
          //
        }
      },
      true
    );
  }

  render() {
    const {
      CMSContent,
      tourGroupData,
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
      activeCurrency,
      queryParams = {},
      biLink,
    } = this.props;

    const { noTrack, tgidToScroll, currencyCode } = queryParams;

    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />;
    }

    const microsite = CMSContent.data?.microsite?.data || CMSContent.data?.data;
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
              offerData={CMSContent.offerData}
              host={host}
              toursList={toursList}
              pathname={pathname}
              isDev={isDev}
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
              serverRequestStartTimestamp={serverRequestStartTimestamp}
              isMobile={isMobile}
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
              host={host}
              uid={uid}
              lang={lang}
              tourGroupData={tourGroupData}
              isDev={isDev}
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
              serverRequestStartTimestamp={serverRequestStartTimestamp}
            />
          );
        default:
          return <ErrorPage statusCode={500} />;
      }
    }

    const pageType = ContentType + (MBDesign || '');
    const Component = getPageComponent(pageType);

    const initRecoil = ({ set }: MutableSnapshot) => {
      if (currencyCode?.length) {
        set(currencyAtom, currencyCode);
      }
    };

    return (
      <div id="body-wrap">
        <EnvironmentContext.Provider
          value={{
            isDev,
            windowUrl,
          }}
        >
          <ThemeProvider theme={getAppTheme(mbTheme)}>
            <RecoilRoot initializeState={initRecoil}>
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
              >
                {Component}
              </MBContextProvider>
            </RecoilRoot>
          </ThemeProvider>
        </EnvironmentContext.Provider>
        {typeof window !== 'undefined' ? (
          <HeadoutSessionIdSetterComponent />
        ) : null}
      </div>
    );
  }
}
const HSID_VAR = 'h-sid';
const HeadoutSessionIdSetterComponent = () => {
  const validHsidFromCookie = Cookies.get(HSID_VAR);
  if (validHsidFromCookie) {
    return null;
  }

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
