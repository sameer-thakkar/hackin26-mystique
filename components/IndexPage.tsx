import React, { useContext, useEffect } from 'react';
import ErrorPage from 'next/error';
import dynamic from 'next/dynamic';
import fetch from 'isomorphic-unfetch';
import Cookies from 'js-cookie';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import EnvironmentContext from 'contexts/environmentContext';
import { MBContext, MBContextProvider } from 'contexts/MBContext';
import { getAppTheme } from 'style/theme';
import { Client } from 'config/prismic-config';
import { toursTabSliceHandler } from 'components/Slices';
import { currencyAtom } from 'store/atoms/currency';
import { CUSTOM_TYPES, DESIGN, THEMES } from 'const/index';
import {
  redirectTo,
  reflect,
  isNakedDomain,
  getHeadoutLanguagecode,
  extractSinglePrismicSlice,
} from 'utils';
import { getPrismicDocument } from 'utils/prismicUtils';
import {
  fetchCategory,
  fetchCurrencyList,
  fetchTourGroup,
} from 'utils/apiUtils';
import Analytics from 'utils/analytics';
import {
  categoryTourListParserV1,
  categoryTourListParserV2,
  uncategorizedToursListParser,
} from 'utils/dataParsers';
import { getHostName } from 'utils/helper';
import { addCashbackValueToDescriptor } from 'utils/productUtils';
import { getLangUID, removePageQuery } from 'utils/urlUtils';

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
    } catch (error) {
      console.log({ error, reqUrl: req?.url });
      return {};
    }
  }

  static async getData({ res: serverResponse, req, query, isDev }) {
    const { host } = req.headers || window.location;
    const isStage = host.includes('stage-');
    const { uid, lang } = getLangUID(req, query);
    const hostname = getHostName(isStage, isDev);

    try {
      let initial_tgids = [];

      const { ContentType, CMSContent, statusCode } = (await getPrismicDocument(
        {
          query,
          req,
          serverResponse,
        }
      )) || { statusCode: 404 };

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
      let tgidsArray = [];
      const queryParams = (function getQueryparams() {
        try {
          const href = req ? `http://${host}${req.url}` : window.location.href;
          const url = new URL(href);
          if (url) {
            return {
              tgidToScroll: url.searchParams.get('tgid'),
              noTrack: typeof url.searchParams.get('no-track') === 'string',
              currencyCode: url.searchParams.get('currencyCode'),
              bookSubdomain: url.searchParams.get('bookSubdomain') ?? undefined,
            };
          }
          return {};
        } catch (error) {
          console.log({ error, reqUrl: req?.url });
          return {};
        }
      })();

      if (ContentType === CUSTOM_TYPES.CONTENT_PAGE) {
        const { data } = CMSContent || {};
        const {
          productCardData,
          content_framework: contentFramework,
          data: CMSData,
        } = data || {};
        const { data: contentFrameworkData } = contentFramework || {};
        const { design, theme, body1 } = CMSData || {};
        const MBDesign = design || '';
        const mbTheme = theme || THEMES.DEFAULT;
        const toursTabFirstSlice = body1?.[0];

        const categoryTourListV1 = extractSinglePrismicSlice({
          sliceName: 'ticket_card_shoulder_page',
          slices: contentFrameworkData?.body,
        });
        let categoryTourListData;
        const hasCategoryTourListV1 = Object.keys(categoryTourListV1)?.length;

        if (hasCategoryTourListV1) {
          categoryTourListData = await categoryTourListParserV1({
            productCard: productCardData,
            sliceObj: categoryTourListV1,
            hostname,
            lang,
            isShoulderPage: true,
          });
        }

        const prismicTours = toursTabFirstSlice
          ? await toursTabSliceHandler(toursTabFirstSlice)
          : [];

        const toursList = uncategorizedToursListParser(
          prismicTours,
          initial_tgids
        );

        tgidsArray = toursList?.reduce((acc, tour) => {
          return [...acc, tour.tgid];
        }, []);

        AllData = {
          CMSContent,
          toursList,
          categoryTourListData,
          ContentType,
          uid,
          lang,
          host,
          MBDesign,
          isDev,
          queryParams,
          mbTheme,
          isStage,
        };
      }

      if (ContentType === CUSTOM_TYPES.GLOBAL_COLLECTION) {
        let ticketsData, startingPrice, currencyCode, currencySymbol;
        const categoryId = CMSContent?.data?.headout_category_id;
        if (categoryId) {
          ticketsData = await fetchCategory(categoryId, hostname);
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
          const tgidData = await fetchTourGroup(
            CMSContent?.data?.tgid,
            hostname
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
        } catch (error) {
          console.log({ error, reqUrl: req?.url });
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
          return [...accum, parseInt(tour.primary.tgid)];
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

      if (ContentType === CUSTOM_TYPES.MICROSITE) {
        const { data } = CMSContent || {};
        const { refs, data: CMSData } = data || {};
        const { contentFramework, productCardData } = refs || {};
        const { data: contentFrameworkData } = contentFramework || {};
        const {
          design,
          theme,
          body,
          body1,
          allShowPages,
          categorisedToursV1: categoryTourListV1,
        } = CMSData || {};
        const MBDesign = design || '';
        const mbTheme = theme || THEMES.DEFAULT;
        const toursTabFirstSlice = body1[0];
        const categorizedTours = body;

        const categoryTourList = extractSinglePrismicSlice({
          sliceName: 'tour_list_category',
          slices: categorizedTours,
        });

        const categoryCarouselCF = extractSinglePrismicSlice({
          sliceName: 'category_carousel',
          slices: contentFrameworkData?.body,
        });

        let categoryTourListData;
        const hasCategoryTourListV1 = Object.keys(categoryTourListV1)?.length;
        const hasCategoryTourListV2 = Object.keys(categoryTourList)?.length;
        const hasCategoryTourList =
          hasCategoryTourListV2 ||
          hasCategoryTourListV1 ||
          Object.keys(categoryCarouselCF)?.length;
        if (hasCategoryTourList) {
          if (hasCategoryTourListV1) {
            categoryTourListData = await categoryTourListParserV1({
              productCard: productCardData,
              sliceObj: categoryTourListV1,
              hostname,
              lang,
            });
          } else {
            categoryTourListData = await categoryTourListParserV2({
              tourListCategory: categoryTourList,
              hostname,
              showpages: allShowPages,
              categoryCarousel: categoryCarouselCF,
            });
          }
        }

        const prismicTours = toursTabFirstSlice
          ? await toursTabSliceHandler(toursTabFirstSlice)
          : [];
        const offers = prismicTours
          ?.filter((tour) => tour.offer__free_tour?.id)
          ?.map((tour) => tour.offer__free_tour?.id);
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
          prismicTours,
          initial_tgids
        );

        tgidsArray = toursList?.reduce((acc, tour) => {
          return [...acc, tour.tgid];
        }, []);

        AllData = {
          CMSContent,
          toursList,
          categoryTourListData,
          ContentType,
          uid,
          lang,
          host,
          MBDesign,
          isDev,
          queryParams,
          mbTheme,
          isStage,
        };
      }
      let constructedTourgroupURL;
      tgidsArray = [...tgidsArray, ...all_tours_tab_tgids];
      try {
        const useTest = !!AllData?.['queryParams']?.bookSubdomain;
        const tgEndpoint = new URL(
          `https://${
            isStage ? 'stage-' : ''
          }microbrands.headout.com/api/tours/v6/tour-groups/`
        );
        tgEndpoint.searchParams.set('language', getHeadoutLanguagecode(lang));
        tgEndpoint.searchParams.set('ids[]', tgidsArray.join(','));
        if (AllData?.['queryParams']?.currency)
          tgEndpoint.searchParams.set(
            'currency',
            AllData?.['queryParams']?.currency
          );
        if (useTest) {
          tgEndpoint.searchParams.set('useTest', 'true');
        }
        constructedTourgroupURL = tgEndpoint.toString();
      } catch (e) {
        constructedTourgroupURL = `https://${
          isStage ? 'stage-' : ''
        }microbrands.headout.com/api/tours/v6/tour-groups/?ids[]=${tgidsArray}&language=${getHeadoutLanguagecode(
          lang
        )}`;
      }

      const tourGroupAPIResponses = await fetch(
        constructedTourgroupURL.toString()
      ).then((r) => r.json());

      const currencySymbolMap = tourGroupAPIResponses?.currencies?.reduce(
        (acc, currency) => ({
          ...acc,
          [currency.code]: { ...currency },
        }),
        {}
      );

      const tourGroupData = tourGroupAPIResponses?.tourGroups?.reduce(
        (accum: {}, tour: any) => {
          const { hide_df, hide_safe } = AllData['CMSContent']?.data?.data || {
            hide_df: false,
            hide_safe: false,
          };
          const {
            name,
            microBrandsHighlight,
            microBrandsDescriptor,
            highlights,
            media,
            imageUrl,
            averageRating,
            reviewCount,
            callToAction,
            listingPrice,
            validity,
            allTags: allTagsTour,
            id,
          } = tour || {};
          const { productImages, safetyImages } = media || {};
          const { cashbackValue } = listingPrice || {};
          const updatedDescriptors = addCashbackValueToDescriptor({
            descriptor: microBrandsDescriptor,
            cashbackValue,
          });

          let allTags = allTagsTour || [];
          if (hide_df) {
            allTags = allTags?.filter((t) => !t.includes('DF-'));
          }
          if (hide_safe) {
            allTags = allTags?.filter((t) => !t.includes('SAFE'));
          }
          return {
            ...accum,
            [id]: {
              title: name,
              highlights: microBrandsHighlight,
              descriptors: updatedDescriptors,
              productHighlights: highlights,
              productTitle: name,
              images: [...(productImages || []), { url: imageUrl }],
              averageRating,
              reviewCount,
              ctaBooster: callToAction,
              available: !(listingPrice === null),
              allTags,
              safetyImages: safetyImages || [],
              validity,
              listingPrice: {
                ...listingPrice,
                ...currencySymbolMap[listingPrice?.currencyCode],
              },
            },
          };
        },
        {}
      );

      const primaryCountry = tourGroupAPIResponses?.cities?.[0]?.country;

      const activeCurrency = tourGroupAPIResponses?.currencies?.[0];
      return {
        ...AllData,
        tourGroupData,
        currencySymbolMap,
        activeCurrency,
        primaryCountry,
      };
    } catch (error) {
      console.log({ error, reqUrl: req?.url });
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
    } = this.props;

    const { noTrack, tgidToScroll, currencyCode, bookSubdomain } = queryParams;

    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />;
    }

    const microsite =
      CMSContent?.data?.microsite?.data || CMSContent?.data?.data;
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
                isStage={isStage}
                bookSubdomain={bookSubdomain}
                primaryCountry={primaryCountry}
              >
                {Component}
                {typeof window !== 'undefined' ? (
                  <HeadoutSessionIdSetterComponent />
                ) : null}
              </MBContextProvider>
            </RecoilRoot>
          </ThemeProvider>
        </EnvironmentContext.Provider>
      </div>
    );
  }
}
const HSID_VAR = 'h-sid';
const HeadoutSessionIdSetterComponent = () => {
  const validHsidFromCookie = Cookies.get(HSID_VAR);
  const { setHsid } = useContext(MBContext);
  const pushSandboxIDtoDataLayer = (hsid) => {
    const analytics = new Analytics();
    analytics.sendHsidToDataLayer({ 'h-sid': hsid });
    setHsid(hsid);
  };
  useEffect(() => {
    window.addEventListener(
      'message',
      (e) => {
        const { origin, data } = e;
        if (origin !== process.env.NEXT_PUBLIC_HEADOUT_DOMAIN) {
          return;
        }

        const { hsid } = JSON.parse(data);
        try {
          if (hsid === null)
            console.warn(
              '[localStorage] hsid-ensurer failure, Unsupported Browser'
            );
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
  }, []);

  if (validHsidFromCookie) {
    pushSandboxIDtoDataLayer(validHsidFromCookie);
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
