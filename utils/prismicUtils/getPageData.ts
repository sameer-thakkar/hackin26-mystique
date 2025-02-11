import { NextApiRequest } from 'next';
import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import * as Sentry from '@sentry/nextjs';
import { ShowpageDocument } from 'types.prismic';
import {
  getObject,
  parseShowPageData,
} from 'components/ShowPages/parseShowPage';
import { toursTabSliceHandler } from 'components/Slices';
import { CollectionDetails } from 'components/StaticBanner';
import {
  deepDeleteKeys,
  getCollectionSection,
  getHeadoutLanguagecode,
  getSinglePrismicSlice,
  isCategoryMB,
  isCollectionMB,
  isSubCategoryMB,
} from 'utils';
import {
  constructHeaders,
  fetchBannersV3,
  fetchCategoryReviews,
  fetchCollection,
  fetchCollectionBasicInfo,
  fetchCollectionList,
  fetchCollectionReviews,
  fetchCurrencyList,
  fetchDomainConfig,
  fetchMediaResource,
  fetchSubCategoryReviews,
  fetchTourGroupReviews,
  fetchTourGroupsByCategory,
  fetchTourGroupSlots,
  fetchTourGroupV6,
  fetchTourListV6,
  getCatSubcatDescriptors,
} from 'utils/apiUtils';
import {
  getBreadcrumbs,
  getSeatingPlanBreadcrumbs,
  getShowPageBreadcrumbs,
} from 'utils/breadcrumbsUtils';
import { getCatAndSubCatPageData } from 'utils/categoryPageUtils';
import {
  getToursGlobalCollection,
  uncategorizedToursListParser,
} from 'utils/dataParsers';
import {
  checkIfCatOrSubCatPage,
  getHostName,
  getLangObject,
  getSeatingPlanAndTheatreType,
  isTheatreInSeatMapExperiment,
} from 'utils/helper';
import { sendLog } from 'utils/logger';
import { traceError } from 'utils/logutils';
import categoryTourListParserV1 from 'utils/parsers/categoryTourListParserV1';
import categoryTourListParserV2 from 'utils/parsers/categoryTourListParserV2';
import { dayTripCollectionParser } from 'utils/parsers/dayTripCollectionParser';
import monthOnMonthPageParser from 'utils/parsers/monthOnMonthPageParser';
import { getCategoryData } from 'utils/prismicUtils/categoryUtils';
import { getCityPageData } from 'utils/prismicUtils/cityUtils';
import {
  filterArticlesBasedOnEntMb,
  getArticlesWithSameTgidPromise,
  getFeaturedArticlesPromise,
  getNewsLandingPage,
  getNewsLandingPageUrl,
  getNewsPageData,
} from 'utils/prismicUtils/NewsPage';
import { extractOfferFromTourSliceTgids } from 'utils/prismicUtils/tourUtils';
import {
  generateDescriptor,
  standardizeCancellationPolicy,
} from 'utils/productUtils';
import {
  conditionalPromise,
  labeledPromiseAllSettled,
} from 'utils/promiseUtils';
import { setShortTTL } from 'utils/serverUtils';
import {
  getEncodedUrlSlugs,
  getLangUID,
  getValidUrlParams,
} from 'utils/urlUtils';
import { CURRENCY_SYMBOL_MAP } from 'const/currency';
import { DAY_TRIPS_COLLECTION_MBS } from 'const/daytrips';
import {
  CATEGORY_IDS,
  COOKIE,
  CUSTOM_TYPES,
  DESIGN,
  LANGUAGE_MAP,
  MB_CATEGORISATION,
  PRISMIC_DEV_TAG,
  RESOURCE_TYPE,
  SLICE_TYPES,
  SUPPORTED_LOCALE_MAP,
  TEMP_HARDCODED_PRODUCT,
  THEMES,
  TLANGUAGELOCALE,
} from 'const/index';
import { LOG_LEVELS } from 'const/logs';
import {
  MBS_EXTENDED_REVIEWS_V2_ENABLED_DOMAINS,
  MBS_REVIEWS_V2_ENABLED_DOMAINS,
} from 'const/reviews';
import { allShowPagesGq } from './microsite/graphQuery';
import { TPrismicTrustBooster } from './interface';
import { getReviewsPageData } from './reviewsPage';
import { getVenuePageData } from './venuePage';
import { fetchPrismicDocument } from '.';

function getQueryparams(req: NextApiRequest) {
  try {
    const { headers, url: reqUrl } = req ?? {};
    const { host } = headers ?? {};
    const href = req ? `http://${host}${reqUrl}` : window.location.href;
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
    traceError({ error, host: req?.headers?.host, url: req?.url });
    return {};
  }
}

export const getPageData = async ({
  res,
  req,
  query,
  isDev,
  localizedStrings,
  runRankingExperiment = false,
  isBot = false,
}: any) => {
  const { host } = req.headers || window.location;
  const { cookies } = req;
  const { uid, lang } = getLangUID(req, query);
  const hostname = getHostName(isDev, host);
  const { bypassCache } = query;

  try {
    let initial_tgids: any = [];
    const { prismicApiResponse, prismicApiCacheStatus } =
      await fetchPrismicDocument({
        req,
        host,
        isDev,
        uid,
        lang,
        bypassCache,
      });

    const {
      ContentType,
      CMSContent,
      statusCode,
      redirectInfo,
      shouldPageHaveShorterTtl,
      prismicDocumentTypeApiCacheStatus,
      categoryHeaderMenu,
      docsForListicles,
      collectionIdsInListicles,
    } = prismicApiResponse;

    const currencyListPromise = fetchCurrencyList();
    const domainConfigPromise = fetchDomainConfig(uid);
    const isCatOrSubCatPagePromise = checkIfCatOrSubCatPage(CMSContent);

    const { data: CMSData } = CMSContent ?? {};

    const {
      body4: bannerSlices = [],
      is_entertainment_banner: isEntertainmentBanner,
    } = CMSData ?? {};

    const bannerTrustBoostersSlice = getSinglePrismicSlice({
      sliceName: SLICE_TYPES.TRUST_BOOSTERS,
      slices: bannerSlices ?? [],
    });

    const bannerTrustBoosters: TPrismicTrustBooster[] =
      bannerTrustBoostersSlice?.items;

    if (redirectInfo) {
      const { url, type } = redirectInfo;
      const queryParamsString = getValidUrlParams(query);
      const urlWithParams = `${url}${
        queryParamsString ? `?${queryParamsString}` : ''
      }`;

      return {
        redirectInfo: {
          url: urlWithParams,
          type,
        },
      };
    } else if (statusCode) {
      sendLog({
        level: LOG_LEVELS.ERROR,
        message: `[getPageData] - ${uid} (${lang}) ${JSON.stringify(
          prismicApiResponse
        )}`,
      });
      return {
        statusCode,
        uid,
        lang,
      };
    } else if (shouldPageHaveShorterTtl) {
      setShortTTL(res);
    }

    /**
     * scorpioAllTourGroupData will yield different sets of Properties based on CUSTOM_TYPE,
     * and finally gets returned with any other common data for CUSTOM_TYPE
     */
    let scorpioAllTourGroupData: any = {};
    let tgidsArray: any = [];
    let minPrice = 0;
    let bestDiscount = 0;
    let categoryId = '';
    let subCatId = '';
    let collectionDataPromise = Promise.resolve(
      {} as ReturnType<typeof fetchCollection>
    );
    let bannerImageDataPromise: ReturnType<typeof fetchMediaResource> =
      Promise.resolve(undefined);
    let bannerV3DataPromise: ReturnType<typeof fetchBannersV3> =
      Promise.resolve(undefined);
    let collectionReviewsPromise = Promise.resolve(
      {} as ReturnType<typeof fetchCollectionReviews>
    );
    let catSubCatReviewsPromise = Promise.resolve(
      {} as ReturnType<
        typeof fetchCategoryReviews | typeof fetchSubCategoryReviews
      >
    );
    let botReviewsByTGIDPromise = Promise.resolve(
      {} as ReturnType<typeof fetchTourGroupReviews>
    );
    let routeDetailsPromise: Promise<Record<string, any>> =
      null as unknown as Promise<any>;
    let variantsDataPromise: Promise<Record<string, any>[]> =
      null as unknown as Promise<any>;

    let collectionListPromise = Promise.resolve(
      {} as ReturnType<typeof fetchCollectionList>
    );

    let categoryTourListDataPromise = Promise.resolve(
      {} as ReturnType<typeof getCategoryData>
    );

    let dayTripCollectionDataPromise = Promise.resolve(
      {} as ReturnType<typeof dayTripCollectionParser>
    );

    let collectionBasicInfo = {} as Awaited<
      ReturnType<typeof fetchCollectionBasicInfo>
    >;

    const queryParams = getQueryparams(req);

    if (ContentType === CUSTOM_TYPES.NEWS_PAGE) {
      return await getNewsPageData(
        CMSContent,
        ContentType,
        isDev,
        host,
        hostname,
        lang as TLANGUAGELOCALE,
        cookies,
        currencyListPromise,
        domainConfigPromise
      );
    }

    if (ContentType === CUSTOM_TYPES.REVIEWS_PAGE) {
      return await getReviewsPageData(
        CMSContent,
        ContentType,
        isDev,
        host,
        hostname,
        query,
        lang as TLANGUAGELOCALE,
        cookies,
        currencyListPromise,
        domainConfigPromise
      );
    }

    if (ContentType === CUSTOM_TYPES.VENUE_PAGE) {
      return await getVenuePageData(
        CMSContent,
        ContentType,
        isDev,
        host,
        hostname,
        lang as TLANGUAGELOCALE,
        cookies,
        currencyListPromise,
        domainConfigPromise
      );
    }

    if (
      ContentType === CUSTOM_TYPES.CONTENT_PAGE ||
      CMSContent?.data?.shoulder_page_type ===
        MB_CATEGORISATION.SHOULDER_PAGE_TYPE.SUB_ATTRACTIONS
    ) {
      const { data: CMSData } = CMSContent || {};
      const { productCardData, content_framework: contentFramework } =
        CMSData || {};
      const { data: contentFrameworkData } = contentFramework || {};
      const { body: slices } = contentFrameworkData || {};

      if (collectionIdsInListicles?.length > 0) {
        const language = getHeadoutLanguagecode(
          lang ?? SUPPORTED_LOCALE_MAP.en
        );
        collectionListPromise = fetchCollectionList({
          collectionIds: collectionIdsInListicles,
          language,
          hostname,
          cookies,
        });
      }

      const collectionId =
        CMSData?.baseLangCategorisationMetadata?.tagged_collection;
      if (collectionId) {
        const languageCode = getLangObject(lang!).code;
        collectionDataPromise = fetchCollection({
          collectionId,
          hostname,
          language: languageCode,
          currency: 'USD',
          cookies,
        });
      }

      const { design, theme, body1 } = CMSData || {};
      const MBDesign = design || '';
      const mbTheme = theme || THEMES.DEFAULT;
      const toursTabFirstSlice = body1?.[0];

      const categoryTourListV1 = getSinglePrismicSlice({
        sliceName: SLICE_TYPES.SHOULDER_PAGE_TICKET_CARD,
        slices,
      });

      const hasCategoryTourListV1 = Object.keys(
        categoryTourListV1 || {}
      )?.length;

      if (hasCategoryTourListV1) {
        categoryTourListDataPromise = getCategoryData({
          cookies,
          hostname,
          lang: lang as string,
          localizedStrings,
          productCardData,
        });
      }

      const prismicTours = toursTabFirstSlice
        ? toursTabSliceHandler(toursTabFirstSlice)
        : [];

      const toursList = uncategorizedToursListParser(
        prismicTours,
        initial_tgids
      );

      tgidsArray = toursList?.reduce((acc: any, tour: any) => {
        return [...acc, tour.tgid];
      }, []);

      scorpioAllTourGroupData = {
        CMSContent,
        docsForListicles,
        toursList,
        ContentType,
        uid,
        lang,
        host,
        MBDesign,
        isDev,
        queryParams,
        mbTheme,
        currencyList: await currencyListPromise,
        prismicApiCacheStatus,
        prismicDocumentTypeApiCacheStatus,
      };
    }

    if (ContentType === CUSTOM_TYPES.GLOBAL_COLLECTION) {
      let ticketsData, startingPrice, currencyCode;
      const language = getHeadoutLanguagecode(lang ?? 'en-us');
      const city = CMSContent?.data?.city_name?.trim()?.split(' ')?.join('_');
      categoryId = CMSContent?.data?.headout_category_id;
      const collectionId = CMSContent?.data?.headout_collection_id;
      if (collectionId) {
        const collectionData =
          (await fetchCollection({
            collectionId,
            hostname,
            language,
            currency: 'USD',
            cookies,
          })) ?? {};
        const pinnedCards =
          getCollectionSection(collectionData, 'PINNED_CARDS') ?? [];
        const genericSection =
          getCollectionSection(collectionData, 'GENERIC') ?? [];
        const headoutPicks =
          getCollectionSection(collectionData, 'HEADOUT_PICKS') ?? [];
        ticketsData = [...pinnedCards, ...genericSection, ...headoutPicks];
        const { collections: collectionList } =
          (await fetchCollectionList({
            collectionIds: [collectionId],
            language,
            currency: 'USD',
            hostname,
            cookies,
          })) ?? {};
        const [currentCollection] = collectionList ?? [];
        const { startingPrice: price } = currentCollection ?? {};
        startingPrice = price?.listingPrice;
        currencyCode = price?.currency;
      }
      if (!collectionId && categoryId) {
        const categoryData =
          (await fetchTourGroupsByCategory({
            categoryId,
            hostname,
            isSubCategory: false,
            city,
            language,
            currency: 'USD',
            cookies,
          })) ?? {};
        ticketsData = categoryData?.pageData?.items;
        startingPrice = categoryData?.unFilteredMetaData?.minPrice;
        currencyCode = categoryData?.currency?.code;
      }
      return {
        CMSContent: {
          ...CMSContent,
          tickets: {
            data: ticketsData,
            startingPrice,
            currencyCode,
          },
        },
        ContentType,
        uid,
        lang,
        isDev,
        host,
        currencyList: await currencyListPromise,
        domainConfig: await domainConfigPromise,
        prismicApiCacheStatus,
        prismicDocumentTypeApiCacheStatus,
      };
    }

    if (ContentType === CUSTOM_TYPES.GLOBAL_CITY) {
      return {
        CMSContent: {
          ...CMSContent,
        },
        ContentType,
        uid,
        lang,
        isDev,
        host,
        currencyList: await currencyListPromise,
        domainConfig: await domainConfigPromise,
        prismicApiCacheStatus,
        prismicDocumentTypeApiCacheStatus,
      };
    }

    if (
      ContentType === CUSTOM_TYPES.GLOBAL_HOMEPAGE ||
      ContentType === CUSTOM_TYPES.GLOBAL_COUNTRY
    ) {
      return {
        CMSContent,
        ContentType,
        uid,
        lang,
        isDev,
        host,
        currencyList: await currencyListPromise,
        domainConfig: await domainConfigPromise,
        prismicApiCacheStatus,
        prismicDocumentTypeApiCacheStatus,
      };
    }

    if (ContentType === CUSTOM_TYPES.GLOBAL_EXPERIENCE) {
      const { data: CMSData, lang, cityName } = CMSContent;

      const { collection: globalCollection } = CMSData ?? {};

      const {
        data: {
          headout_category_id: sub_category,
          headout_collection_id: collection,
          headout_tgid: tgid,
        },
      } = globalCollection ?? {
        data: {
          headout_category_id: '',
          headout_collection_id: '',
          headout_tgid: '',
        },
      };

      const categoryTourListData = await getToursGlobalCollection({
        collection,
        sub_category,
        tgid,
        commonScratchPrice: true,
        hostname,
        cityName,
        lang: getHeadoutLanguagecode(lang),
        cookies,
      });

      const primaryCity = categoryTourListData?.primaryCity;
      const primaryCountry = primaryCity?.country;
      const activeCurrency = primaryCountry?.currency?.code;

      return {
        CMSContent: {
          ...CMSContent,
          data: {
            ...CMSContent?.data,
            city_name: cityName,
          },
        },
        ContentType,
        uid,
        lang,
        isDev,
        host,
        ...categoryTourListData,
        ...(primaryCity && { primaryCity }),
        ...(primaryCountry && { primaryCountry }),
        ...(activeCurrency && { activeCurrency }),
        currencyList: await currencyListPromise,
        domainConfig: await domainConfigPromise,
        prismicApiCacheStatus,
        prismicDocumentTypeApiCacheStatus,
      };
    }

    if (ContentType === CUSTOM_TYPES.SHOW_PAGE) {
      try {
        const langCode = getHeadoutLanguagecode(lang as TLANGUAGELOCALE);
        const tgidDataPromise = fetchTourGroupV6({
          tgid: CMSContent?.data?.tgid,
          hostname,
          language: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
          cookies,
        });
        const mediaDataPromise = fetchMediaResource({
          entityIds: [CMSContent?.data?.tgid].join(','),
          resourceType: 'MB_EXPERIENCE',
        });

        const inventorySlotDataPromise = fetchTourGroupSlots({
          tgid: CMSContent?.data?.tgid,
          hostname,
          forDays: 20,
          cookies,
        });

        const breadcrumbsPromise = getShowPageBreadcrumbs(CMSContent);
        const articlesWithSameTgidDataPromise =
          getArticlesWithSameTgidPromise(
            CMSContent?.data?.tgid,
            uid,
            lang as TLANGUAGELOCALE
          ) || Promise.resolve(undefined);
        const featuredArticlesDataPromise = getFeaturedArticlesPromise(
          uid,
          lang as TLANGUAGELOCALE
        );
        const newsLandingPageDataPromise = getNewsLandingPage();

        const {
          breadcrumbs,
          articlesWithSameTgidData,
          featuredArticlesData,
          newsLandingPageData,
          tgidData,
          mediaData,
          inventorySlotData,
          currencyList,
          domainConfig,
        } = await labeledPromiseAllSettled([
          {
            label: 'breadcrumbs',
            promise: breadcrumbsPromise,
          },
          {
            label: 'articlesWithSameTgidData',
            promise: articlesWithSameTgidDataPromise,
          },
          {
            label: 'featuredArticlesData',
            promise: featuredArticlesDataPromise,
          },
          {
            label: 'newsLandingPageData',
            promise: newsLandingPageDataPromise,
          },
          {
            label: 'tgidData',
            promise: tgidDataPromise,
          },
          {
            label: 'mediaData',
            promise: mediaDataPromise,
          },
          {
            label: 'inventorySlotData',
            promise: inventorySlotDataPromise,
          },
          { promise: currencyListPromise, label: 'currencyList' },
          { promise: domainConfigPromise, label: 'domainConfig' },
        ]);

        const verticalImageData =
          mediaData?.resourceEntityMedias?.[0]?.medias?.find(
            (media: any) => media.type === 'IMAGE'
          );
        const nativeShowTrailerData =
          mediaData?.resourceEntityMedias?.[0]?.medias?.find(
            (media: any) => media.type === 'VIDEO'
          );
        const verticalImage = {
          url: verticalImageData?.url,
          height: verticalImageData?.metadata.height,
          width: verticalImageData?.metadata.width,
          altText: verticalImageData?.metadata.altText,
        };
        const nativeShowTrailer = {
          url: nativeShowTrailerData?.url,
          altText: nativeShowTrailerData?.metadata?.altText,
        };
        const tgidDataWithoutUrlSlugs = deepDeleteKeys({
          obj: tgidData,
          keys: ['urlSlugs', 'urlSlug'],
        });
        const { url: _tgidDataUrl, ...tgidDataWithoutUrls } =
          tgidDataWithoutUrlSlugs || {};

        const primaryCountry = tgidDataWithoutUrls?.city?.country;
        const primaryCity = tgidDataWithoutUrls?.city;

        const activeCurrency = tgidDataWithoutUrls?.currency;

        const featuredNewsArticles = filterArticlesBasedOnEntMb(
          featuredArticlesData?.results,
          uid
        );
        const newsArticlesWithSameTgid =
          articlesWithSameTgidData && 'results' in articlesWithSameTgidData
            ? filterArticlesBasedOnEntMb(articlesWithSameTgidData?.results, uid)
            : [];

        const newsLandingPageUrl = getNewsLandingPageUrl(
          newsLandingPageData?.results,
          uid,
          langCode,
          hostname
        );

        return {
          CMSContent,
          newsArticlesWithSameTgid,
          featuredNewsArticles,
          newsLandingPageUrl,
          tourGroupData: {
            ...tgidDataWithoutUrls,
            verticalImage,
            nativeShowTrailer,
          },
          inventorySlotData,
          ContentType,
          uid,
          lang,
          isDev,
          host,
          ...(primaryCity && { primaryCity }),
          ...(primaryCountry && { primaryCountry }),
          ...(activeCurrency && { activeCurrency }),
          currencyList,
          domainConfig,
          breadcrumbs,
          prismicApiCacheStatus,
          prismicDocumentTypeApiCacheStatus,
        };
      } catch (error) {
        traceError({ error, host: req?.headers?.host, url: req?.url });
      }
    }
    /**
     * Setting a Common Microsite Reference for Content Page & Regular Microsite
     * Added to make tour data available on Content Pages.
     * i.e Content Page now contains all of the data from its related Microsite.
     */
    let microsite =
      ContentType === CUSTOM_TYPES.CONTENT_PAGE
        ? CMSContent?.data?.microsite_document_ref?.data
        : CMSContent?.data;

    if (
      ContentType === CUSTOM_TYPES.MICROSITE
      // CMSContent?.data?.shoulder_page_type !==
      //   MB_CATEGORISATION.SHOULDER_PAGE_TYPE.SUB_ATTRACTIONS
    ) {
      let categoryDescriptors: any = [],
        subcategoryDescriptors = [];
      let collectionDetails: CollectionDetails | Object = {};

      const { data: CMSData } = CMSContent ?? {};
      const {
        content_framework: contentFramework,
        body1,
        body4: bannerSlices,
        design,
        theme,
        localisedCategoryTourListV1,
        currentPageCategoryTourListV1,
        categoryTourListV2,
        baseLangCategorisationMetadata,
        is_entertainment_mb: isEntertainmentMb,
      } = CMSData ?? {};

      const { data: contentFrameworkData } = contentFramework || {};

      const {
        tagged_mb_type: taggedMbType,
        tagged_category: taggedCategory,
        tagged_collection: taggedCollection,
        tagged_city: taggedCity,
      } = baseLangCategorisationMetadata || {};

      const MBDesign = design || '';
      const mbTheme = theme || THEMES.DEFAULT;
      const toursTabFirstSlice = body1?.[0] ?? [];

      const isEntertainmentMbListicle =
        isEntertainmentMb && categoryTourListV2?.primary?.islisticle;
      let pageTabs = bannerSlices?.find?.(
        ({ slice_type }: { slice_type: string }) => slice_type === 'page_tabs'
      );

      pageTabs = getSinglePrismicSlice({
        sliceName: SLICE_TYPES.PAGE_TABS,
        slices: bannerSlices ?? [],
      });
      const isLttMonthOnMonthPage =
        isEntertainmentMbListicle && pageTabs?.items?.[0]?.month_label !== null;

      const isCatOrSubCatPage = await isCatOrSubCatPagePromise;

      const categoryCarouselCF = !isCatOrSubCatPage
        ? getSinglePrismicSlice({
            sliceName: 'category_carousel',
            slices: contentFrameworkData?.body ?? [],
          })
        : {};

      let categoryTourListPromise: Promise<Record<string, any>> = {} as Promise<
        Record<string, any>
      >;
      const hasCategoryTourListV1 = Object.keys(
        localisedCategoryTourListV1 || {}
      )?.length;
      const hasCategoryTourListV2 = Object.keys(
        categoryTourListV2 || {}
      )?.length;

      const hasCategoryTourList =
        hasCategoryTourListV2 ||
        hasCategoryTourListV1 ||
        Object.keys(categoryCarouselCF || {})?.length;

      if (isCollectionMB(taggedMbType) && taggedCollection) {
        collectionBasicInfo = await fetchCollectionBasicInfo({
          collectionId: taggedCollection,
        });
      }

      const isDayTripCollection =
        isCollectionMB(taggedMbType) &&
        taggedCollection &&
        collectionBasicInfo?.type === 'DAY_TRIP' &&
        DAY_TRIPS_COLLECTION_MBS.includes(uid);

      if (isDayTripCollection) {
        const primaryCityCurrency =
          localisedCategoryTourListV1?.primary?.product_cards?.data?.city
            ?.currency?.code;
        dayTripCollectionDataPromise = dayTripCollectionParser({
          collectionId: taggedCollection,
          lang: lang ?? 'en',
          hostname,
          localizedStrings,
          currency:
            cookies?.[COOKIE.CURRENT_CURRENCY] || primaryCityCurrency || 'USD',
          micrositeData: microsite,
        });
      }
      if (hasCategoryTourList && !isCatOrSubCatPage) {
        if (hasCategoryTourListV1) {
          categoryTourListPromise = categoryTourListParserV1({
            micrositeProductCardSliceWithData: localisedCategoryTourListV1,
            currentMicrositeProductCardSliceWithData:
              currentPageCategoryTourListV1,
            hostname,
            lang: lang ?? 'en',
            cookies,
            localizedStrings,
            runRankingExperiment,
          });
        } else if (hasCategoryTourListV2 && isLttMonthOnMonthPage) {
          categoryTourListPromise = monthOnMonthPageParser({
            uid,
            tourListCategory: categoryTourListV2,
            hostname,
            lang: lang ?? 'en',
            localizedStrings,
            cookies,
            MBDesign,
            taggedCollection,
          });
        } else {
          const timestampForCoralogix = Date.now();
          categoryTourListPromise = categoryTourListParserV2({
            tourListCategory: categoryTourListV2,
            hostname,
            categoryCarousel: categoryCarouselCF,
            lang: lang ?? 'en',
            localizedStrings,
            cookies,
            MBDesign,
            runRankingExperiment,
          });
          const timestampDeltaForCoralogix = Date.now() - timestampForCoralogix;
          sendLog({
            level: LOG_LEVELS.INFO,
            message: `[categoryTourListParserV2] ${uid} (${lang}) Time taken: ${timestampDeltaForCoralogix}ms`,
          });
        }
      }

      const { tagged_city: mbCity, tagged_country: mbCountry } =
        microsite?.baseLangCategorisationMetadata || {};
      const cityPageDataPromise = getCityPageData({
        cookies,
        lang: lang as string,
        mbCity,
        mbCountry,
        taggedMbType,
        mbDesign: MBDesign,
      });
      const offerTgidsPromise = extractOfferFromTourSliceTgids({
        isCatOrSubCatPage,
        toursTabFirstSlice,
      });
      const languageCode = getHeadoutLanguagecode(lang!);

      const isExtendedReviewsV2Enabled =
        MBS_EXTENDED_REVIEWS_V2_ENABLED_DOMAINS.includes(uid);
      const isReviewsV2Enabled = MBS_REVIEWS_V2_ENABLED_DOMAINS.includes(uid);

      collectionReviewsPromise = conditionalPromise(
        taggedCollection &&
          (isDayTripCollection ||
            isReviewsV2Enabled ||
            isExtendedReviewsV2Enabled),
        () =>
          fetchCollectionReviews({
            collectionId: taggedCollection,
            cookies,
            language: languageCode,
            limit: isExtendedReviewsV2Enabled ? '40' : '8',
          })
      );

      const {
        categoryTourListData,
        cityPageParams,
        offerDetails,
        collectionReviews,
      } = await labeledPromiseAllSettled([
        { promise: categoryTourListPromise, label: 'categoryTourListData' },
        { promise: cityPageDataPromise, label: 'cityPageParams' },
        { promise: offerTgidsPromise, label: 'offerDetails' },
        { promise: collectionReviewsPromise, label: 'collectionReviews' },
      ] as const);

      if (
        (hasCategoryTourListV1 || MBDesign === DESIGN.V3) &&
        hasCategoryTourList &&
        !isCatOrSubCatPage
      ) {
        minPrice = categoryTourListData?.minPrice;
        bestDiscount = categoryTourListData?.bestDiscount;
        const [firstTGID] = categoryTourListData?.finalTgids || [];

        let firstProductData;

        if (MBDesign === DESIGN.V3) {
          firstProductData = categoryTourListData?.firstProductData;
        } else {
          firstProductData = categoryTourListData?.scorpioData?.[firstTGID];
        }

        const { primarySubCategory: firstProductSubCategory, primaryCategory } =
          firstProductData || {};
        subCatId = firstProductSubCategory?.id;
        const categoryId = CATEGORY_IDS?.[taggedCategory];
        const isAirportTransfersMB =
          (taggedMbType === 'Private Airport Transfers' ||
            taggedMbType === 'Airport Transfers') &&
          taggedMbType === 'Airport Transfers';

        const shouldFetchBannerDescriptors =
          isAirportTransfersMB ||
          isCollectionMB(taggedMbType) ||
          isSubCategoryMB(taggedMbType) ||
          isCategoryMB(taggedMbType);

        if (shouldFetchBannerDescriptors) {
          const { name = '', id: primaryCategoryId } = primaryCategory || {};
          const categoryName = name
            .toLowerCase()
            .replace(' &', '')
            .replace(/\s+/g, '-');
          const descriptorsUid = `${categoryName}-${primaryCategoryId}-descriptors`;

          const bannerDescriptors = await getCatSubcatDescriptors({
            host,
            isDev,
            descriptorsUid,
            lang,
          });

          if (bannerDescriptors) {
            categoryDescriptors = bannerDescriptors?.categoryDescriptors || [];
            subcategoryDescriptors =
              bannerDescriptors?.subcategoryDescriptors || [];
          }
        }

        if (isDayTripCollection) {
          bannerV3DataPromise = fetchBannersV3({
            id: taggedCollection,
            mediaResourceType: 'COLLECTION_BANNER',
            platform: 'ALL',
          }).then(({ result: { banners = [] } = {} }) => {
            return banners;
          });
        }
        if (isCollectionMB(taggedMbType)) {
          bannerImageDataPromise = fetchMediaResource({
            resourceType: RESOURCE_TYPE.COLLECTION_VIDEO,
            entityIds: taggedCollection,
          });
        } else if (isSubCategoryMB(taggedMbType)) {
          bannerImageDataPromise = fetchMediaResource({
            resourceType: RESOURCE_TYPE.SUB_CATEGORY_CITY,
            entityIds: `${subCatId}-${taggedCity}`,
          });
          catSubCatReviewsPromise = conditionalPromise(
            taggedCity && subCatId,
            () =>
              fetchSubCategoryReviews({
                subCategoryId: Number(subCatId),
                cityId: taggedCity,
              })
          );
        } else if (isCategoryMB(taggedMbType)) {
          bannerImageDataPromise = fetchMediaResource({
            resourceType: RESOURCE_TYPE.CATEGORY_CITY,
            entityIds: `${categoryId}-${taggedCity}`,
          });
          catSubCatReviewsPromise = conditionalPromise(
            taggedCity && categoryId,
            () =>
              fetchCategoryReviews({
                categoryId: Number(categoryId),
                cityId: taggedCity,
              })
          );
        }
        collectionDetails = categoryTourListData?.collectionDetails ?? {};
      }

      const { prismicTours, offerTgids } = offerDetails;

      initial_tgids = initial_tgids.concat(offerTgids);

      const toursList = uncategorizedToursListParser(
        prismicTours,
        initial_tgids
      );

      tgidsArray = toursList?.reduce((acc: any, tour: any) => {
        return [...acc, tour.tgid];
      }, []);

      const {
        activeCurrency,
        primaryCity,
        isCategoryV2,
        primaryCountry: _,
        scorpioData,
        orderedTours,
        collectionVideos,
        ...rawCategories
      } = categoryTourListData ?? {};

      const simplifiedCategoryTourListData =
        !hasCategoryTourListV1 && !isCatOrSubCatPage
          ? Object.entries(rawCategories || {}).reduce<{
              tourGroupMap: TGIDProductCardMap;
            }>(
              (simpleCategoryData: any, [categoryId, productGroups]: any) => {
                const tgids: Array<number> = [];
                const productGroupMap: TGIDProductCardMap =
                  productGroups?.reduce?.(
                    (map: TGIDProductCardMap, productGroup: ProductCard) => {
                      if (productGroup.showPageUid) {
                        delete productGroup.highlights;
                      }
                      tgids.push(productGroup.tgid);
                      return {
                        ...map,
                        [productGroup.tgid]: productGroup,
                      };
                    },
                    {}
                  );

                return {
                  ...simpleCategoryData,
                  tourGroupMap: {
                    ...simpleCategoryData.tourGroupMap,
                    ...productGroupMap,
                  },
                  [categoryId]: tgids,
                };
              },
              { tourGroupMap: {} }
            )
          : {};
      const primaryCountry = primaryCity?.country;

      scorpioAllTourGroupData = {
        CMSContent,
        toursList,
        ...(!hasCategoryTourListV1 && { simplifiedCategoryTourListData }),
        ...(hasCategoryTourListV1 && {
          scorpioData,
          orderedTours,
          collectionVideos,
        }),
        isCategoryV2,
        ContentType,
        uid,
        lang,
        host,
        MBDesign,
        isDev,
        queryParams,
        mbTheme,
        collectionDetails: {
          ...collectionDetails,
          type: collectionBasicInfo?.type,
          id: taggedCollection,
        },
        ...(primaryCity && { primaryCity }),
        ...(primaryCountry && { primaryCountry }),
        ...(activeCurrency && { activeCurrency }),
        cityPageParams,
        categoryDescriptors,
        subcategoryDescriptors,
        collectionReviews: collectionReviews || {},
      };
    }
    tgidsArray = [...tgidsArray];

    //temporary fix for hardcoded product, will be reverted
    if (uid === TEMP_HARDCODED_PRODUCT.UID) {
      tgidsArray.push(TEMP_HARDCODED_PRODUCT.TGID);
    }

    const useTest = !!scorpioAllTourGroupData?.['queryParams']?.bookSubdomain;

    const tourGroupAPIResponsesPromise = fetchTourListV6({
      hostname,
      language: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
      tgids: tgidsArray,
      fallbackToEnglish:
        getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale) === 'en',
      currency: scorpioAllTourGroupData?.['queryParams']?.currency ?? null,
      useTest,
      cookies,
    }).catch((error) => {
      Sentry.captureException(error);
      traceError({ error, host: req?.headers?.host, url: req?.url });
      sendLog({
        err: error,
        message: `[getPageData] fetchTourListV6 failed for tgids: ${tgidsArray}`,
      });
      setShortTTL(res);

      // if tourGroup API fails, assume all tours as unavailable and render rest of the page.
      return {
        // @ts-expect-error TS(7006): Parameter 'tgid' implicitly has an 'any' type.
        tourGroups: tgidsArray.map((tgid) => ({
          id: tgid,
          listingPrice: null,
        })),
      };
    });

    const breadcrumbsDoc = CMSContent;

    const { isSeatingPlanPage, theatreType } =
      getSeatingPlanAndTheatreType(uid);
    const isSeatingPlanExperiment =
      isTheatreInSeatMapExperiment(theatreType) && isSeatingPlanPage;

    const breadcrumbsPromise = isSeatingPlanExperiment
      ? getSeatingPlanBreadcrumbs(breadcrumbsDoc, theatreType)
      : getBreadcrumbs(breadcrumbsDoc);

    const isCatOrSubCatPage = await isCatOrSubCatPagePromise;

    const catAndSubCatPageDataPromise = conditionalPromise(
      isCatOrSubCatPage,
      () =>
        getCatAndSubCatPageData({
          doc: CMSContent,
          attractionsHeaderMenu: categoryHeaderMenu?.ATTRACTIONS?.menu || {},
          themesHeaderMenu: categoryHeaderMenu?.THEMES?.menu || {},
          cookies,
        })
    );

    const tourGroupIds =
      scorpioAllTourGroupData.orderedTours?.map((tour: any) => tour.tgid) || [];
    const languageCode = getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale);

    const tgidBotReviewsPromise = tourGroupIds.map((tgid: number) =>
      fetchTourGroupReviews({
        tgid,
        offset: 0,
        limit: 25,
        filterType: 'TOP',
        language: languageCode,
      })
    );

    botReviewsByTGIDPromise = conditionalPromise(isBot, () =>
      Promise.all(tgidBotReviewsPromise)
    );

    const {
      tourGroupAPIResponses,
      breadcrumbs,
      catAndSubCatPageData,
      currencyList,
      domainConfig,
      bannerImageData,
      bannerV3Data,
      variantsData,
      routeDetails,
      collectionData,
      collectionList,
      categoryTourListData,
      dayTripCollectionData,
      catSubCatReviews,
      botReviewsByTGID,
    } = await labeledPromiseAllSettled([
      {
        promise: tourGroupAPIResponsesPromise,
        label: 'tourGroupAPIResponses',
      },
      { promise: bannerImageDataPromise, label: 'bannerImageData' },
      { promise: bannerV3DataPromise, label: 'bannerV3Data' },
      { promise: breadcrumbsPromise, label: 'breadcrumbs' },
      { promise: catAndSubCatPageDataPromise, label: 'catAndSubCatPageData' },
      { promise: currencyListPromise, label: 'currencyList' },
      { promise: domainConfigPromise, label: 'domainConfig' },
      { promise: variantsDataPromise, label: 'variantsData' },
      { promise: routeDetailsPromise, label: 'routeDetails' },
      { promise: collectionDataPromise, label: 'collectionData' },
      { promise: collectionListPromise, label: 'collectionList' },
      { promise: categoryTourListDataPromise, label: 'categoryTourListData' },
      { promise: dayTripCollectionDataPromise, label: 'dayTripCollectionData' },
      { promise: catSubCatReviewsPromise, label: 'catSubCatReviews' },
      { promise: botReviewsByTGIDPromise, label: 'botReviewsByTGID' },
    ] as const);

    const currencySymbolMap = tourGroupAPIResponses?.currencies?.reduce(
      // @ts-expect-error TS(7006): Parameter 'acc' implicitly has an 'any' type.
      (acc, currency) => ({
        ...acc,
        [currency.code]: { ...currency },
      }),
      {}
    );

    const botReviewsByTGIDMap = botReviewsByTGID
      ? botReviewsByTGID?.reduce(
          (
            acc: Record<number, any>,
            reviewResponse: Record<string, any>,
            index: number
          ) => {
            acc[tourGroupIds[index]] = reviewResponse?.items ?? [];
            return acc;
          },
          {}
        )
      : {};

    const tourGroupData = await tourGroupAPIResponses?.tourGroups
      ?.filter((tour: Record<string, any>) => {
        const { hidden } = tour ?? {};
        //temporary fix for hardcoded product, will be reverted
        if (
          uid === TEMP_HARDCODED_PRODUCT.UID &&
          tour?.id === TEMP_HARDCODED_PRODUCT.TGID
        )
          return true;
        return !hidden;
      })
      ?.reduce(async (accum: {}, tour: Record<string, any>) => {
        //temporary fix for hardcoded product, will be reverted. god forgive me for this garbage i needed to write
        if (
          uid === TEMP_HARDCODED_PRODUCT.UID &&
          tour?.id === TEMP_HARDCODED_PRODUCT.TGID
        ) {
          const {
            microBrandsDescriptor,
            descriptors: secondaryDescriptors,
            listingPrice,
            allTags,
            name,
            imageUrl,
            id,
            averageRating,
            reviewCount,
            ratingCount,
            primaryCollection,
            primaryCategory,
            primarySubCategory,
            cancellationPolicy,
            cancellationPolicyV2,
            reschedulePolicy,
            ticketValidity,
            minDuration,
            maxDuration,
            combo,
            multiVariant,
            urlSlugs,
            media,
            flowType,
          } = tour || {};
          const { displayName: collectionName } = primaryCollection || {};
          const { displayName: primaryCategoryName } = primaryCategory || {};
          const { displayName: primarySubCategoryName } =
            primarySubCategory || {};
          const {
            urlSlugs: _primaryCategoryUrlSlugs,
            ...primaryCategoryWithoutSlugs
          } = primaryCategory ?? {};
          const {
            urlSlugs: _primarySubCategoryUrlSlugs,
            ...primarySubCategoryWithoutSlugs
          } = primarySubCategory ?? {};
          const {
            finalPrice,
            originalPrice,
            currencyCode,
          }: {
            finalPrice: number;
            originalPrice: number;
            currencyCode: string;
          } = listingPrice || {};
          const currencySymbol = CURRENCY_SYMBOL_MAP[currencyCode as keyof {}];
          const mbDescriptors = generateDescriptor({
            v2Descriptors: microBrandsDescriptor,
            lang: 'en',
            isEntertainmentMb: true,
            primarySubCategory: primarySubCategory as PrimarySubCategory,
          });
          let { microBrandsHighlight } = tour ?? {};
          microBrandsHighlight = standardizeCancellationPolicy({
            highlights: microBrandsHighlight,
            cancellationPolicy: cancellationPolicyV2 ?? cancellationPolicy,
            reschedulePolicy,
            ticketValidity,
            showValidity: false,
            lang: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
            localizedStrings,
          });
          const filterHighlights = [
            localizedStrings.SHOW_PAGE.THEATRE_NAME,
            localizedStrings.SHOW_PAGE.SHOW_TIMINGS,
            localizedStrings.SHOW_PAGE.DURATION,
            localizedStrings.SHOW_PAGE.YOUR_TICKETS,
            localizedStrings.SHOW_PAGE.CANCELLATION_POLICY,
            localizedStrings.SHOW_PAGE.AGE_LIMIT,
          ];
          const { listicleSchema, hasSpecialOffer } =
            parseShowPageData(microBrandsHighlight);
          let listicleShowSummary, listicleWhyWatch;

          for (let item of listicleSchema) {
            const heading = item['heading'];
            if (
              heading === localizedStrings.SHOW_PAGE.LISTICLE_SHOW_WHY_WATCH
            ) {
              listicleWhyWatch = item;
            }
            if (heading === localizedStrings.SHOW_PAGE.LISTICLE_SHOW_SUMMARY) {
              listicleShowSummary = item;
            }
          }
          const { detailsObjects: highlights, isSafetyBanner: hasBestSafety } =
            getObject(microBrandsHighlight, filterHighlights) || {};
          const { detailsObjects: reopeningDate } =
            getObject(microBrandsHighlight, [
              localizedStrings.SHOW_PAGE.OPENING_DATE,
              localizedStrings.SHOW_PAGE.CLOSING_DATE,
            ]) || {};
          const contentBlocks: any = {
            hidden: [],
            left: [],
            right: [],
          };
          for (const key of filterHighlights) {
            const isLeftBlock = [
              localizedStrings.SHOW_PAGE.THEATRE_NAME,
              localizedStrings.SHOW_PAGE.SHOW_TIMINGS,
              localizedStrings.SHOW_PAGE.DURATION,
            ].includes(key);
            const value = highlights[key];
            const block = {
              label: value ? key : null,
              content: value ? value : null,
              align: isLeftBlock ? 'left' : 'right',
              len: value?.length,
              labelId: key?.toLowerCase()?.split(' ')?.join('-'),
            };
            isLeftBlock
              ? contentBlocks?.left?.push(block)
              : contentBlocks?.right?.push(block);
          }
          const { productImages } = media || {};
          const [, descriptionImage] = productImages || [];
          let verticalImagesDataMap = new Map<string, any>();
          const mediaData = await fetchMediaResource({
            language: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
            resourceType: 'MB_EXPERIENCE',
            entityIds: String(TEMP_HARDCODED_PRODUCT.TGID),
          });
          mediaData?.resourceEntityMedias?.forEach((resource) => {
            const verticalImageData = resource.medias.find(
              (media) => media.type === 'IMAGE'
            );
            if (verticalImageData) {
              verticalImagesDataMap.set(
                resource.resourceEntityId,

                {
                  url: verticalImageData.url,
                  height: verticalImageData.metadata.height,
                  width: verticalImageData.metadata.width,
                  altText: verticalImageData.metadata.altText,
                }
              );
            }
          });
          const verticalImage = verticalImagesDataMap.get(String(id));
          let showpageData: Record<number, string> = {};
          let showpages: ShowpageDocument[] | never[] = [];
          try {
            const prismicClient = createClient();
            showpages = await prismicClient.getAllByType('showpage', {
              pageSize: 100,
              ...(lang && { lang }),
              graphQuery: allShowPagesGq,
              predicates: [
                predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
                predicate.at('my.showpage.tgid', TEMP_HARDCODED_PRODUCT.TGID),
              ],
            });
          } catch (error) {
            sendLog({
              err: error,
              message: '[categoryTourListParserV2] allShowPages fetch failed',
            });
          }
          for (const page of showpages ?? []) {
            const {
              uid,
              data: { tgid },
            } = page || { data: {} };
            showpageData[tgid as number] = uid;
          }
          const tgidsWithShowPages = Object.keys(showpageData);
          const hasShowPageData = !!tgidsWithShowPages.length;

          return {
            ...accum,
            [id]: {
              title: name,
              highlights: microBrandsHighlight,
              primaryCollection,
              primaryCategory: primaryCategoryWithoutSlugs,
              primarySubCategory: primarySubCategoryWithoutSlugs,
              descriptors: mbDescriptors,
              secondaryDescriptors,
              productHighlights: null,
              cardFooter: null,
              theater: null,
              content_theater: null,
              contentBlocks,
              productImage: imageUrl,
              descriptionImage:
                productImages?.length > 1 ? descriptionImage?.url : imageUrl,
              price: finalPrice,
              flowType,
              scratchPrice: originalPrice,
              currencySymbol,
              tgid: id,
              images: productImages,
              averageRating,
              reviewCount,
              ratingCount,
              ctaBooster: null,
              description: null,
              available: !!listingPrice?.finalPrice,
              overlayBooster: null,
              vendor: null,
              allTags,
              reopeningDate:
                reopeningDate[localizedStrings.SHOW_PAGE.OPENING_DATE],
              closingDate:
                reopeningDate[localizedStrings.SHOW_PAGE.CLOSING_DATE],
              hasBestSafety,
              category: {
                collectionName,
                primaryCategoryName,
                primarySubCategoryName,
              },
              microBrandsHighlight: highlights,
              listingPrice,
              safetyImages: null,
              showPageUid: hasShowPageData ? showpageData[id] : null,
              listicleShowSummary,
              listicleWhyWatch,
              hasSpecialOffer,
              minDuration,
              maxDuration,
              combo,
              multiVariant,
              urlSlugs: getEncodedUrlSlugs(urlSlugs),
              verticalImage,
            },
          };
        }

        const { hide_df, hide_safe } = scorpioAllTourGroupData['CMSContent']
          ?.data?.data || {
          hide_df: false,
          hide_safe: false,
        };
        const {
          name,
          descriptors,
          minDuration,
          maxDuration,
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
          combo,
          multiVariant,
          primaryCollection,
          ticketValidity,
          reschedulePolicy,
          cancellationPolicy,
          cancellationPolicyV2,
          flowType,
        } = tour ?? {};

        let { microBrandsHighlight } = tour ?? {};

        microBrandsHighlight = standardizeCancellationPolicy({
          highlights: microBrandsHighlight,
          ticketValidity,
          reschedulePolicy,
          cancellationPolicy: cancellationPolicyV2 ?? cancellationPolicy,
          lang: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
          localizedStrings,
        });

        const { productImages, safetyImages } = media || {};
        const updatedDescriptors = generateDescriptor({
          descriptors,
          lang: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
        });

        let allTags = allTagsTour || [];
        if (hide_df) {
          allTags = allTags?.filter((t: any) => !t.includes('DF-'));
        }
        if (hide_safe) {
          allTags = allTags?.filter((t: any) => !t.includes('SAFE'));
        }

        const isMBHighlightsExist = microBrandsHighlight?.length > 0;
        return {
          ...accum,
          [id]: {
            title: name,
            primaryCollection,
            highlights: microBrandsHighlight,
            descriptors: updatedDescriptors,
            productHighlights: highlights,
            productTitle: name,
            imageUrl,
            images: [...(productImages || []), { url: imageUrl }],
            averageRating,
            reviewCount,
            ctaBooster: callToAction,
            available: !(listingPrice === null),
            allTags,
            safetyImages: safetyImages || [],
            validity,
            combo,
            multiVariant,
            minDuration,
            maxDuration,
            listingPrice: {
              ...listingPrice,
              ...currencySymbolMap[listingPrice?.currencyCode],
            },
            flowType,
            isMBHighlightsExist,
          },
        };
      }, {});

    const primaryCountry =
      tourGroupAPIResponses?.cities?.[0]?.country ||
      scorpioAllTourGroupData?.primaryCountry;

    const primaryCity = tourGroupAPIResponses?.cities?.[0];
    const activeCurrency = tourGroupAPIResponses?.currencies?.[0];

    //temporary fix for hardcoded product, will be reverted. god forgive me for this garbage i needed to write
    if (uid === TEMP_HARDCODED_PRODUCT.UID) {
      scorpioAllTourGroupData.simplifiedCategoryTourListData.tourGroupMap = {
        ...scorpioAllTourGroupData.simplifiedCategoryTourListData.tourGroupMap,
        ...tourGroupData,
      };
      scorpioAllTourGroupData.simplifiedCategoryTourListData[
        TEMP_HARDCODED_PRODUCT.COLLECTION_ID
      ] = [
        TEMP_HARDCODED_PRODUCT.TGID,
        ...scorpioAllTourGroupData.simplifiedCategoryTourListData[
          TEMP_HARDCODED_PRODUCT.COLLECTION_ID
        ],
      ];
      scorpioAllTourGroupData.simplifiedCategoryTourListData[
        TEMP_HARDCODED_PRODUCT.SUBCAT_ID
      ] = [
        TEMP_HARDCODED_PRODUCT.TGID,
        ...scorpioAllTourGroupData.simplifiedCategoryTourListData[
          TEMP_HARDCODED_PRODUCT.SUBCAT_ID
        ],
      ];
    }

    return {
      ...categoryTourListData,
      ...scorpioAllTourGroupData,
      collectionList,
      bannerImageData,
      bannerV3Data,
      variantsData,
      routeDetails,
      ...(activeCurrency && { activeCurrency }),
      ...(primaryCity && { primaryCity }),
      tourGroupData,
      currencySymbolMap,
      primaryCountry,
      currencyList,
      domainConfig,
      categoryHeaderMenu,
      breadcrumbs,
      isCatOrSubCatPage,
      catAndSubCatPageData: catAndSubCatPageData || {},
      minPrice,
      bestDiscount,
      prismicApiCacheStatus,
      prismicDocumentTypeApiCacheStatus,
      collectionData,
      isSeatingPlanPage,
      theatreType,
      isEntertainmentBanner,
      bannerTrustBoosters,
      catSubCatReviews: catSubCatReviews || {},
      categoryId,
      subCategoryId: subCatId,
      botReviewsByTGID: botReviewsByTGIDMap,
      dayTripCollectionData,
    };
  } catch (error) {
    const { uid, lang } = getLangUID(req, query);

    const { headers, cookies } = req;
    const requestHeaders = constructHeaders({
      cookies,
      currentHeaders: headers,
    });
    const requestHeadersObject = Object.fromEntries(requestHeaders);

    traceError({
      error,
      host: req?.headers?.host,
      url: req?.url,
      uid,
      lang,
      requestHeadersObject,
    });
    sendLog({
      err: error,
      message: `[getPageData] Error fetching Prismic data for ${uid} (${lang}) URL: ${req?.url}`,
    });

    return {
      statusCode: 500,
      url: req?.url,
      uid,
      lang,
    };
  }
};

export default getPageData;
