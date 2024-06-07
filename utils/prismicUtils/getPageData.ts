import { NextApiRequest } from 'next';
import { createClient } from 'prismicio';
import * as Sentry from '@sentry/nextjs';
import { toursTabSliceHandler } from 'components/Slices';
import { CollectionDetails } from 'components/StaticBanner';
import {
  deepDeleteKeys,
  getCollectionSection,
  getHeadoutLanguagecode,
  getSinglePrismicSlice,
  handleSettledPromiseResults,
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
} from 'utils/apiUtils';
import { getBreadcrumbs, getShowPageBreadcrumbs } from 'utils/breadcrumbsUtils';
import { getCatAndSubCatPageData } from 'utils/categoryPageUtils';
import { generateCityPageData } from 'utils/cityPageUtils';
import { getDocsForListicleSlice } from 'utils/contentPageUtils';
import {
  getToursGlobalCollection,
  parseVariantsData,
  uncategorizedToursListParser,
} from 'utils/dataParsers';
import getCategoryHeaderMenu from 'utils/headerUtils/getCategoryHeaderMenu';
import {
  checkIfCategoryHeaderExists,
  checkIfCatOrSubCatPage,
  getHostName,
  getLangObject,
} from 'utils/helper';
import { sendLog } from 'utils/logger';
import { traceError } from 'utils/logutils';
import categoryTourListParserV1 from 'utils/parsers/categoryTourListParserV1';
import categoryTourListParserV2 from 'utils/parsers/categoryTourListParserV2';
import monthOnMonthPageParser from 'utils/parsers/monthOnMonthPageParser';
import {
  filterArticlesBasedOnEntMb,
  getArticlesWithSameTgidPromise,
  getFeaturedArticlesPromise,
  getNewsLandingPage,
  getNewsLandingPageUrl,
  getNewsPageData,
} from 'utils/prismicUtils/NewsPage';
import {
  generateDescriptor,
  standardizeCancellationPolicy,
} from 'utils/productUtils';
import { getLangUID, getValidUrlParams } from 'utils/urlUtils';
import {
  CATEGORY_IDS,
  CUSTOM_TYPES,
  DEFAULT_PRISMIC_LANG,
  LANGUAGE_MAP,
  MB_CATEGORISATION,
  MB_TYPES,
  RESOURCE_TYPE,
  SHORTER_CACHE_AGE,
  SLICE_TYPES,
  TEMPLATES,
  THEMES,
  TLANGUAGELOCALE,
} from 'const/index';
import { LOG_LEVELS } from 'const/logs';
import getRouteDetailsDoc from './getRouteDetails';
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
    } = prismicApiResponse;

    const currencyListPromise = fetchCurrencyList();
    const domainConfigPromise = fetchDomainConfig(uid);

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
      res.setHeader('Cache-Control', `max-age=${SHORTER_CACHE_AGE}`);
    }

    /**
     * scorpioAllTourGroupData will yield different sets of Properties based on CUSTOM_TYPE,
     * and finally gets returned with any other common data for CUSTOM_TYPE
     */
    let scorpioAllTourGroupData: any = {};
    let tgidsArray: any = [];
    let minPrice = 0;
    let bestDiscount = 0;
    let collectionData = {};
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

      const [collectionsInListicles, docsForListicles] =
        await getDocsForListicleSlice({
          slices,
          hostname,
          lang: lang as string,
          cookies,
        });

      const collectionId =
        CMSData?.baseLangCategorisationMetadata?.tagged_collection;
      if (collectionId) {
        const languageCode = getLangObject(lang!).code;
        collectionData = await fetchCollection({
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

      let categoryTourListData;
      const hasCategoryTourListV1 = Object.keys(
        categoryTourListV1 || {}
      )?.length;

      if (hasCategoryTourListV1) {
        categoryTourListData = await categoryTourListParserV1({
          shoulderPageTicketsCard: productCardData,
          hostname,
          lang: lang ?? LANGUAGE_MAP.en.code,
          cookies,
          localizedStrings,
          runRankingExperiment,
        });
        minPrice = categoryTourListData.minPrice;
        bestDiscount = categoryTourListData.bestDiscount;
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
      const { activeCurrency, primaryCity, primaryCountry } =
        categoryTourListData || {};
      scorpioAllTourGroupData = {
        CMSContent,
        collectionsInListicles,
        docsForListicles,
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
        ...(primaryCity && { primaryCity }),
        ...(primaryCountry && { primaryCountry }),
        ...(activeCurrency && { activeCurrency }),
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
        const tgidData = await fetchTourGroupV6({
          tgid: CMSContent?.data?.tgid,
          hostname,
          language: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
          cookies,
        });
        const mediaData = await fetchMediaResource({
          entityIds: [CMSContent?.data?.tgid].join(','),
          resourceType: 'MB_EXPERIENCE',
        });
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
          tgidDataWithoutUrlSlugs;

        const inventorySlotData = await fetchTourGroupSlots({
          tgid: CMSContent?.data?.tgid,
          hostname,
          forDays: 20,
          cookies,
        });

        const primaryCountry = tgidDataWithoutUrls?.city?.country;
        const primaryCity = tgidDataWithoutUrls?.city;

        const activeCurrency = tgidDataWithoutUrls?.currency;

        const breadcrumbs = await getShowPageBreadcrumbs(CMSContent);
        const articlesWithSameTgidData = await getArticlesWithSameTgidPromise(
          CMSContent?.data?.tgid,
          uid,
          lang as TLANGUAGELOCALE
        );
        const featuredArticlesData = await getFeaturedArticlesPromise(
          uid,
          lang as TLANGUAGELOCALE
        );
        const newsLandingPageData = await getNewsLandingPage();
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
          currencyList: await currencyListPromise,
          domainConfig: await domainConfigPromise,
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
      let collectionDetails: CollectionDetails | Object = {};
      let finalTgids: Array<number | string> = [];
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

      const isCatOrSubCatPage = await checkIfCatOrSubCatPage(
        CMSContent,
        baseLangCategorisationMetadata
      );

      const categoryCarouselCF = !isCatOrSubCatPage
        ? getSinglePrismicSlice({
            sliceName: 'category_carousel',
            slices: contentFrameworkData?.body ?? [],
          })
        : {};

      let categoryTourListData: Record<string, any> = {};
      let variantsData: Array<Record<string, any>> = [];
      let bannerImageData, routeDetails;
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
          categoryTourListData = await categoryTourListParserV1({
            micrositeProductCardSliceWithData: localisedCategoryTourListV1,
            currentMicrositeProductCardSliceWithData:
              currentPageCategoryTourListV1,
            hostname,
            lang: lang ?? 'en',
            cookies,
            localizedStrings,
            runRankingExperiment,
          });

          minPrice = categoryTourListData.minPrice;
          bestDiscount = categoryTourListData.bestDiscount;
          const [firstTGID] = categoryTourListData?.finalTgids || [];
          const { primarySubCategory: firstProductSubCategory } =
            categoryTourListData.scorpioData?.[firstTGID] || {};
          const subCatId = firstProductSubCategory?.id;
          const categoryId = CATEGORY_IDS?.[taggedCategory];

          const productCardsData =
            localisedCategoryTourListV1?.primary?.product_cards?.data;

          if (productCardsData?.template === TEMPLATES.HOHO) {
            variantsData = await parseVariantsData({
              finalTgids: categoryTourListData?.finalTgids || [],
              currencyCode: categoryTourListData?.activeCurrency?.code,
              language: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
              cookies,
            });
          }

          if (isCollectionMB(taggedMbType)) {
            bannerImageData = await fetchMediaResource({
              resourceType: RESOURCE_TYPE.COLLECTION_VIDEO,
              entityIds: taggedCollection,
            });
          } else if (isSubCategoryMB(taggedMbType)) {
            bannerImageData = await fetchMediaResource({
              resourceType: RESOURCE_TYPE.SUB_CATEGORY_CITY,
              entityIds: `${subCatId}-${taggedCity}`,
            });
          } else if (isCategoryMB(taggedMbType)) {
            bannerImageData = await fetchMediaResource({
              resourceType: RESOURCE_TYPE.CATEGORY_CITY,
              entityIds: `${categoryId}-${taggedCity}`,
            });
          }
          collectionDetails = categoryTourListData.collectionDetails ?? {};

          finalTgids = categoryTourListData.finalTgids || [];
          const { template } = productCardsData || {};
          if (template === TEMPLATES.HOHO) {
            routeDetails = await getRouteDetailsDoc({
              tgids: finalTgids,
              lang: lang ?? 'en',
            });
          }
        } else if (hasCategoryTourListV2 && isLttMonthOnMonthPage) {
          categoryTourListData = await monthOnMonthPageParser({
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
          categoryTourListData = await categoryTourListParserV2({
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

      let cityPageData = {};
      let isCityPageMB = false;
      if (taggedMbType === MB_TYPES.A1_HOMEPAGE && mbCity) {
        isCityPageMB = true;
        cityPageData = await generateCityPageData({
          mbCity,
          mbCountry,
          lang: lang || LANGUAGE_MAP.en.locale,
          cookies,
        });

        const {
          nearbyAndCurrentCityData: { currentCityData },
        } = cityPageData as Record<string, any>;
        const { discoverable } = currentCityData || {};

        isCityPageMB = !!discoverable;
      }

      const cityPageParams = {
        mbLocationData: { mbCity, mbCountry },
        isCityPageMB,
        cityPageData,
      };

      const prismicTours =
        toursTabFirstSlice && !isCatOrSubCatPage
          ? toursTabSliceHandler(toursTabFirstSlice)
          : [];
      const offers = prismicTours
        ?.filter((tour: any) => tour.offer__free_tour?.id)
        ?.map((tour: any) => tour.offer__free_tour?.id);
      const uniqueOfferIds = offers.filter(
        (id: any, index: any) => offers.indexOf(id) === index
      );
      if (uniqueOfferIds.length) {
        const prismicClient = createClient();
        const offerTours = await prismicClient.getByIDs(uniqueOfferIds);

        (CMSContent as any).offerData = offerTours?.results?.forEach(
          (offer: any) => {
            if (parseInt(offer.data.offer_tgid) > 0)
              initial_tgids.push(offer.data.offer_tgid);
          }
        );
      }

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
        bannerImageData,
        ...(primaryCity && { primaryCity }),
        ...(primaryCountry && { primaryCountry }),
        ...(activeCurrency && { activeCurrency }),
        cityPageParams,
        ...(variantsData && { variantsData }),
        ...(routeDetails && { routeDetails }),
      };
    }
    tgidsArray = [...tgidsArray];
    const useTest = !!scorpioAllTourGroupData?.['queryParams']?.bookSubdomain;

    const tourGroupAPIResponses = await fetchTourListV6({
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

      // if tourGroup API fails, assume all tours as unavailable and render rest of the page.
      return {
        // @ts-expect-error TS(7006): Parameter 'tgid' implicitly has an 'any' type.
        tourGroups: tgidsArray.map((tgid) => ({
          id: tgid,
          listingPrice: null,
        })),
      };
    });

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

    const baseLangCategorisationMetadata =
      CMSContent?.data?.baseLangCategorisationMetadata;
    //for content pages baseLangMicrositeData is the base lang microsite doc
    //for microsites baseLangMicrositeData is the current microsite doc (NOT BASE LANG)
    const baseLangMicrositeDoc =
      ContentType === CUSTOM_TYPES.CONTENT_PAGE
        ? CMSContent?.data?.baseLangMicrositeData
        : CMSContent;

    const categoryHeaderMenuExists: boolean =
      checkIfCategoryHeaderExists({
        mbDesign: baseLangMicrositeDoc?.data?.design,
        mbType: baseLangCategorisationMetadata?.tagged_mb_type,
      }) && !!baseLangCategorisationMetadata?.tagged_city;

    const categoryHeaderMenuPromise = categoryHeaderMenuExists
      ? getCategoryHeaderMenu({
          doc: baseLangMicrositeDoc,
          lang: lang || DEFAULT_PRISMIC_LANG,
          ContentType,
        })
      : {};

    const breadcrumbsDoc = CMSContent;

    const breadcrumbsPromise = getBreadcrumbs(breadcrumbsDoc);

    const aggregatedPromise = await Promise.allSettled([
      categoryHeaderMenuPromise,
      breadcrumbsPromise,
    ]);

    const [categoryHeaderMenu, breadcrumbs] = handleSettledPromiseResults(
      aggregatedPromise,
      uid
    );

    const isCatOrSubCatPage = await checkIfCatOrSubCatPage(CMSContent);
    const catAndSubCatPageData = isCatOrSubCatPage
      ? await getCatAndSubCatPageData({
          doc: CMSContent,
          attractionsHeaderMenu: categoryHeaderMenu?.ATTRACTIONS?.menu || {},
          themesHeaderMenu: categoryHeaderMenu?.THEMES?.menu || {},
          cookies,
        })
      : {};
    return {
      ...scorpioAllTourGroupData,
      ...(activeCurrency && { activeCurrency }),
      ...(primaryCity && { primaryCity }),
      tourGroupData,
      currencySymbolMap,
      primaryCountry,
      currencyList: await currencyListPromise,
      domainConfig: await domainConfigPromise,
      categoryHeaderMenu,
      breadcrumbs,
      isCatOrSubCatPage,
      catAndSubCatPageData,
      minPrice,
      bestDiscount,
      prismicApiCacheStatus,
      prismicDocumentTypeApiCacheStatus,
      collectionData,
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
