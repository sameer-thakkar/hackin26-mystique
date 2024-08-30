import { NextApiRequest } from 'next';
import * as Sentry from '@sentry/nextjs';
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
  fetchCollection,
  fetchCollectionList,
  fetchCurrencyList,
  fetchDomainConfig,
  fetchMediaResource,
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
import { getLangUID, getValidUrlParams } from 'utils/urlUtils';
import {
  CATEGORY_IDS,
  CUSTOM_TYPES,
  LANGUAGE_MAP,
  MB_CATEGORISATION,
  RESOURCE_TYPE,
  SLICE_TYPES,
  SUPPORTED_LOCALE_MAP,
  THEMES,
  TLANGUAGELOCALE,
} from 'const/index';
import { LOG_LEVELS } from 'const/logs';
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
}: any) => {
  const { host } = req.headers || window.location;
  const isStage = host.includes('stage-');
  const { cookies } = req;
  const { uid, lang } = getLangUID(req, query);
  const hostname = getHostName(isStage, isDev, host);
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
    let collectionDataPromise = Promise.resolve(
      {} as ReturnType<typeof fetchCollection>
    );
    let bannerImageDataPromise: ReturnType<typeof fetchMediaResource> =
      Promise.resolve(undefined);
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
          runRankingExperiment,
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
        isStage,
        currencyList: await currencyListPromise,
        prismicApiCacheStatus,
        prismicDocumentTypeApiCacheStatus,
      };
    }

    if (ContentType === CUSTOM_TYPES.GLOBAL_COLLECTION) {
      let ticketsData, startingPrice, currencyCode;
      const language = getHeadoutLanguagecode(lang ?? 'en-us');
      const city = CMSContent?.data?.city_name?.trim()?.split(' ')?.join('_');
      const categoryId = CMSContent?.data?.headout_category_id;
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
        body4,
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
      const isLttMonthOnMonthPage =
        isEntertainmentMbListicle &&
        body4?.[0]?.items?.[0]?.month_label !== null;

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
      });
      const offerTgidsPromise = extractOfferFromTourSliceTgids({
        isCatOrSubCatPage,
        toursTabFirstSlice,
      });

      const { categoryTourListData, cityPageParams, offerDetails } =
        await labeledPromiseAllSettled([
          { promise: categoryTourListPromise, label: 'categoryTourListData' },
          { promise: cityPageDataPromise, label: 'cityPageParams' },
          { promise: offerTgidsPromise, label: 'offerDetails' },
        ] as const);

      if (hasCategoryTourListV1 && hasCategoryTourList && !isCatOrSubCatPage) {
        minPrice = categoryTourListData.minPrice;
        bestDiscount = categoryTourListData.bestDiscount;
        const [firstTGID] = categoryTourListData?.finalTgids || [];
        const { primarySubCategory: firstProductSubCategory, primaryCategory } =
          categoryTourListData.scorpioData?.[firstTGID] || {};
        const subCatId = firstProductSubCategory?.id;
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
          const categoryName = name.toLowerCase();

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
        } else if (isCategoryMB(taggedMbType)) {
          bannerImageDataPromise = fetchMediaResource({
            resourceType: RESOURCE_TYPE.CATEGORY_CITY,
            entityIds: `${categoryId}-${taggedCity}`,
          });
        }
        collectionDetails = categoryTourListData.collectionDetails ?? {};
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
                  productGroups?.reduce(
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
        isStage,
        collectionDetails,
        ...(primaryCity && { primaryCity }),
        ...(primaryCountry && { primaryCountry }),
        ...(activeCurrency && { activeCurrency }),
        cityPageParams,
        categoryDescriptors,
        subcategoryDescriptors,
      };
    }
    tgidsArray = [...tgidsArray];
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

    const {
      tourGroupAPIResponses,
      breadcrumbs,
      catAndSubCatPageData,
      currencyList,
      domainConfig,
      bannerImageData,
      variantsData,
      routeDetails,
      collectionData,
      collectionList,
      categoryTourListData,
    } = await labeledPromiseAllSettled([
      {
        promise: tourGroupAPIResponsesPromise,
        label: 'tourGroupAPIResponses',
      },
      { promise: bannerImageDataPromise, label: 'bannerImageData' },
      { promise: breadcrumbsPromise, label: 'breadcrumbs' },
      { promise: catAndSubCatPageDataPromise, label: 'catAndSubCatPageData' },
      { promise: currencyListPromise, label: 'currencyList' },
      { promise: domainConfigPromise, label: 'domainConfig' },
      { promise: variantsDataPromise, label: 'variantsData' },
      { promise: routeDetailsPromise, label: 'routeDetails' },
      { promise: collectionDataPromise, label: 'collectionData' },
      { promise: collectionListPromise, label: 'collectionList' },
      { promise: categoryTourListDataPromise, label: 'categoryTourListData' },
    ] as const);

    const currencySymbolMap = tourGroupAPIResponses?.currencies?.reduce(
      // @ts-expect-error TS(7006): Parameter 'acc' implicitly has an 'any' type.
      (acc, currency) => ({
        ...acc,
        [currency.code]: { ...currency },
      }),
      {}
    );

    const tourGroupData = tourGroupAPIResponses?.tourGroups
      ?.filter((tour: Record<string, any>) => {
        const { hidden } = tour ?? {};
        return !hidden;
      })
      ?.reduce((accum: {}, tour: Record<string, any>) => {
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

    return {
      ...categoryTourListData,
      ...scorpioAllTourGroupData,
      collectionList,
      bannerImageData,
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
