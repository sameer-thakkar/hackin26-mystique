import Prismic from 'prismic-javascript';
import { Client } from 'config/prismic-config';
import { PrismicDocumentWithUID } from '@prismicio/types';
import * as Sentry from '@sentry/nextjs';
import { TourGroupDataType } from 'components/NewsPage/interface';
import {
  getEnglishDocUid,
  getHeadoutLanguagecode,
  handleSettledPromiseResults,
  refsArrayToObject,
} from 'utils';
import {
  fetchCollectionReviews,
  fetchTourGroupMedia,
  fetchTourGroupsByCategory,
  fetchTourGroupsByCollection,
  fetchTourGroupV6,
} from 'utils/apiUtils';
import { getNewsPageBreadcrumbs } from 'utils/breadcrumbsUtils';
import { checkIfBroadwayMB, checkIfLTTMB } from 'utils/helper';
import { sendLog } from 'utils/logger';
import { getRefsArrayByIds } from 'utils/prismicUtils';
import {
  CUSTOM_TYPE_VALUES,
  CUSTOM_TYPES,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
  SUPPORTED_LOCALE_MAP,
  TLANGUAGELOCALE,
  TOUR_GROUP_MEDIA_RESOURCE_TYPE,
} from 'const/index';
import { LOG_LEVELS } from 'const/logs';

export const findVideoUrlFromMediaData = (media: Record<string, any>[]) => {
  return media.find((item) => item?.type === 'VIDEO')?.url;
};

export const mbCategorisationData = (
  baseLangData: Record<string, any>,
  pageData: Record<string, any>,
  lang: TLANGUAGELOCALE,
  mbCategoryData: string
) => {
  if (lang !== SUPPORTED_LOCALE_MAP.en) {
    return baseLangData[mbCategoryData];
  } else {
    return pageData[mbCategoryData];
  }
};

export const filterArticlesBasedOnEntMb = (
  articles: PrismicDocumentWithUID[],
  uid: string
): PrismicDocumentWithUID[] => {
  let callbackFunction: (arg0: string) => unknown;

  switch (true) {
    case checkIfBroadwayMB(uid):
      callbackFunction = checkIfBroadwayMB;
      break;
    case checkIfLTTMB(uid):
      callbackFunction = checkIfLTTMB;
      break;
    default:
      callbackFunction = checkIfLTTMB;
      break;
  }

  return articles?.filter((article) => {
    return callbackFunction(article.uid);
  });
};

export const getFeaturedArticlesPromise = (
  uid: string,
  lang: TLANGUAGELOCALE
) =>
  Client().query(
    [
      Prismic.Predicates.not(`document.tags`, [`${PRISMIC_DEV_TAG}`]),
      Prismic.Predicates.at(
        `my.${CUSTOM_TYPES.NEWS_PAGE}.${PRISMIC_FIELD_ID.TAGS}`,
        'Featured'
      ),
      Prismic.Predicates.not(
        `my.${CUSTOM_TYPES.NEWS_PAGE}.${PRISMIC_FIELD_ID.UID}`,
        uid
      ),
    ],
    { pageSize: 30, lang }
  );

export const getArticlesWithSameTgidPromise = (
  tgid: number,
  uid: string,
  lang: TLANGUAGELOCALE
) => {
  return tgid
    ? Client().query(
        [
          Prismic.Predicates.not(`document.tags`, [`${PRISMIC_DEV_TAG}`]),
          Prismic.Predicates.at(
            `my.${CUSTOM_TYPES.NEWS_PAGE}.${PRISMIC_FIELD_ID.TGID}`,
            tgid
          ),
          Prismic.Predicates.not(
            `my.${CUSTOM_TYPES.NEWS_PAGE}.${PRISMIC_FIELD_ID.UID}`,
            uid
          ),
        ],
        { pageSize: 5, lang }
      )
    : Promise.resolve([]);
};

export const getAllArticlesPromise = (uid: string, lang: TLANGUAGELOCALE) => {
  return Client().query(
    [
      Prismic.Predicates.not(`document.tags`, [`${PRISMIC_DEV_TAG}`]),
      Prismic.Predicates.at('document.type', `${CUSTOM_TYPES.NEWS_PAGE}`),
      Prismic.Predicates.not(
        `my.${CUSTOM_TYPES.NEWS_PAGE}.${PRISMIC_FIELD_ID.UID}`,
        uid
      ),
    ],
    { pageSize: 100, lang }
  );
};

export const getCollectionReviewsPromise = (
  collectionId: number,
  cookies: any,
  lang: TLANGUAGELOCALE
) => {
  return fetchCollectionReviews({
    collectionId,
    cookies,
    limit: '9',
    language: getHeadoutLanguagecode(lang),
  });
};

export const getNewsPageDocument = async ({ req, uid, lang }: any) => {
  try {
    const response = await Client(req).getByUID(CUSTOM_TYPES.NEWS_PAGE, uid, {
      lang,
    });

    if (response) {
      const {
        header_ref,
        primary_footer_ref,
        secondary_footer_ref,
        content_framework_ref,
      } = response.data;

      const linkedRefIDs = [];
      linkedRefIDs.push(
        header_ref.id,
        primary_footer_ref.id,
        secondary_footer_ref.id,
        content_framework_ref.id
      );

      const refArray = await getRefsArrayByIds(linkedRefIDs, req);

      const {
        commonFooter,
        commonHeader,
        secondaryFooter,
        contentFramework,
      } = refsArrayToObject(refArray);

      const baseLangUid = getEnglishDocUid(response?.alternate_languages);
      const baseLangData =
        lang !== SUPPORTED_LOCALE_MAP.en
          ? await Client(req)
              .getByUID(CUSTOM_TYPES.NEWS_PAGE, baseLangUid || uid, {
                lang: SUPPORTED_LOCALE_MAP.en,
              })
              .then((res: any) => res)
          : response.data;

      const breadcrumbs = await getNewsPageBreadcrumbs(response);

      const newsPageData = {
        ...response,
        data: {
          refs: {
            commonHeader,
            commonFooter,
            secondaryFooter,
            contentFramework,
          },
          breadcrumbs,
          isLandingPage: response?.data?.is_landing_page,
          heading: response?.data?.heading,
          authorName: response?.data?.author_name,
          bannerImage: response?.data?.banner_image,
          tgid: response?.data?.tgid,
          title: response?.data?.title,
          description: response?.data?.description,
          keywords: response?.data?.keywords,
          taggedCity: mbCategorisationData(
            baseLangData?.data,
            response?.data,
            lang,
            PRISMIC_FIELD_ID.TAGGED_CITY
          ),
          taggedCountry: mbCategorisationData(
            baseLangData?.data,
            response?.data,
            lang,
            PRISMIC_FIELD_ID.TAGGED_COUNTRY
          ),
          taggedCollection: mbCategorisationData(
            baseLangData?.data,
            response?.data,
            lang,
            PRISMIC_FIELD_ID.TAGGED_COLLECTION
          ),
          taggedCategory: mbCategorisationData(
            baseLangData?.data,
            response?.data,
            lang,
            PRISMIC_FIELD_ID.TAGGED_CATEGORY
          ),
          taggedMbType: mbCategorisationData(
            baseLangData?.data,
            response?.data,
            lang,
            PRISMIC_FIELD_ID.TAGGED_MB_TYPE
          ),
        },
      };

      return {
        CMSContent: newsPageData,
        ContentType: CUSTOM_TYPES.NEWS_PAGE,
      };
    }
    return Promise.reject(new Error('Error fetching News Page'));
  } catch (err) {
    Sentry.captureException(err);
    sendLog({
      level: LOG_LEVELS.ERROR,
      err,
    });
    // eslint-disable-next-line no-console
    console.error('Error fetching news page document', err);
    return Promise.reject();
  }
};

export const getTgidFromCollectionReviews = (reviews: any) => {
  return reviews?.items?.map((review: any) => {
    return review?.tourGroup?.id;
  });
};

export const getNewsPageData = async (
  CMSContent: PrismicDocumentWithUID,
  ContentType: CUSTOM_TYPE_VALUES,
  isDev: boolean,
  req: any,
  host: string,
  hostname: string,
  lang: TLANGUAGELOCALE,
  cookies: any,
  currencyListPromise: Promise<any>,
  domainConfigPromise: Promise<any>
) => {
  const { uid } = CMSContent;
  const data = CMSContent?.data;
  const { tgid, isLandingPage, taggedCity } = data;
  const collectionDataTgids: number[] = [];
  const collectionIdFromPrismic = CMSContent?.data?.taggedCollection;
  let allArticles,
    featuredArticles,
    articlesWithSameTgid,
    collectionReviews,
    collectionReviewsTgid;

  const featuredArticlesPromise = getFeaturedArticlesPromise(uid, lang);
  const articlesWithSameTgidPromise = getArticlesWithSameTgidPromise(
    tgid,
    uid,
    lang
  );
  const allArticlesPromise = getAllArticlesPromise(uid, lang);
  const collectionReviewsPromise = getCollectionReviewsPromise(
    collectionIdFromPrismic,
    cookies,
    lang
  );

  const aggregatedPromise = await Promise.allSettled([
    featuredArticlesPromise,
    articlesWithSameTgidPromise,
    collectionReviewsPromise,
    isLandingPage ? allArticlesPromise : [],
  ]);

  [
    featuredArticles,
    articlesWithSameTgid,
    collectionReviews,
    allArticles,
  ] = handleSettledPromiseResults(aggregatedPromise);

  const uidToCFIdMap = new Map<string, any>();
  const CFIdToDataMap = new Map<string, any>();
  const videoDataMap = new Map<string, string>();

  featuredArticles = filterArticlesBasedOnEntMb(featuredArticles?.results, uid);
  articlesWithSameTgid = filterArticlesBasedOnEntMb(
    articlesWithSameTgid?.results,
    uid
  );
  allArticles = filterArticlesBasedOnEntMb(allArticles?.results, uid);

  const tgidsFromCollectionReviews = getTgidFromCollectionReviews(
    collectionReviews
  );
  collectionReviewsTgid = new Set([
    tgidsFromCollectionReviews ? tgidsFromCollectionReviews : [],
  ]);

  const articles = [
    ...(allArticles ? allArticles : []),
    ...(featuredArticles ? featuredArticles : []),
    ...(articlesWithSameTgid ? articlesWithSameTgid : []),
  ];
  const contentFrameworkIds = articles?.map((article) => {
    if (!uidToCFIdMap.has(article.uid))
      uidToCFIdMap.set(
        article.uid,
        article?.data?.content_framework_ref?.id as string
      );
    return article?.data?.content_framework_ref?.id;
  });

  const contentFrameworkRefArray = await getRefsArrayByIds(
    Array.from(new Set(contentFrameworkIds)),
    req
  );
  contentFrameworkRefArray.forEach((article: any) =>
    CFIdToDataMap.set(article?.id, article?.data)
  );
  for (const [key, value] of uidToCFIdMap) {
    uidToCFIdMap.set(key, CFIdToDataMap.get(value));
  }

  const tgidMappingData = tgid
    ? await fetchTourGroupV6({
        tgid,
        hostname,
        language: getHeadoutLanguagecode(lang),
        cookies,
      })
    : null;

  const collectionId =
    tgidMappingData?.primaryCollection?.id || collectionIdFromPrismic || null;

  let collectionData = collectionId
    ? (
        await fetchTourGroupsByCollection({
          collectionId,
          hostname,
          cookies,
          language: getHeadoutLanguagecode(lang),
        })
      )?.pageData?.items
    : [];

  if (tgid) {
    collectionData = collectionData?.filter((trailer: TourGroupDataType) => {
      return trailer.id != tgid;
    });
  }
  const trailerSectionData = [
    ...(tgidMappingData ? [tgidMappingData] : []),
    ...(collectionData ? collectionData : []),
  ];
  trailerSectionData.forEach((item) => {
    collectionDataTgids.push(item?.id);
  });

  const mediaData = await fetchTourGroupMedia({
    hostname,
    tgids: [...collectionDataTgids, ...Array.from(collectionReviewsTgid)],
    cookies,
    resourceType: TOUR_GROUP_MEDIA_RESOURCE_TYPE.MB_EXPERIENCE,
  });

  mediaData?.resourceEntityMedias?.forEach((media: any) => {
    const videoUrl = findVideoUrlFromMediaData(media?.medias);
    videoDataMap.set(media.resourceEntityId, videoUrl);
  });

  const filteredTrailerSectionData = trailerSectionData.filter(
    (trailerData) => {
      return videoDataMap.get(String(trailerData.id));
    }
  );

  const { primarySubCategory } = tgidMappingData || {};

  let { pageData = {} } = primarySubCategory
    ? await fetchTourGroupsByCategory({
        categoryId: primarySubCategory?.id,
        hostname,
        isSubCategory: true,
        language: getHeadoutLanguagecode(lang),
        limit: '10',
        city: taggedCity,
        cookies,
      })
    : {};

  if (Object.keys(pageData)?.length === 0) {
    pageData = {
      items: collectionData,
    };
  }

  const tgidsOfShows = new Set();
  const popularShowsData = pageData?.items?.filter((e: TourGroupDataType) => {
    return e.id !== tgid;
  });

  [
    ...(pageData?.items ? pageData?.items : []),
    ...(collectionData ? collectionData : []),
  ]?.forEach((item: TourGroupDataType) => {
    tgidsOfShows.add(item.id);
  });

  const showPageDocuments =
    Array.from(tgidsOfShows)?.length > 0
      ? await Client().query(
          Prismic.Predicates.any('my.showpage.tgid', [
            ...tgidsOfShows,
            ...(tgidMappingData ? [tgidMappingData.id] : []),
          ])
        )
      : [];

  return {
    CMSContent: {
      ...CMSContent,
      tgidMappingData,
      allArticles,
      featuredArticles,
      articlesWithSameTgid,
      trailerSectionData: filteredTrailerSectionData,
      videoData: Object.fromEntries(videoDataMap),
      CFData: Object.fromEntries(uidToCFIdMap),
      showPageDocuments,
      subCategoryData: popularShowsData,
      mediaData: mediaData.resourceEntityMedias as [],
      collectionReviews,
    },
    uid,
    host,
    ContentType,
    lang,
    isDev,
    currencyList: await currencyListPromise,
    domainConfig: await domainConfigPromise,
  };
};
