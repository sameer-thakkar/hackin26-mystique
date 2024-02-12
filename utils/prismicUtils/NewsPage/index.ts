import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { PrismicDocumentWithUID } from '@prismicio/types';
import { ContentFrameworkDocumentData } from 'types.prismic';
import { TourGroupDataType } from 'components/NewsPage/interface';
import {
  getEnglishDocUid,
  getHeadoutLanguagecode,
  handleSettledPromiseResults,
} from 'utils';
import {
  fetchCollectionReviews,
  fetchTourGroupMedia,
  fetchTourGroupsByCategory,
  fetchTourGroupsByCollection,
  fetchTourGroupV6,
} from 'utils/apiUtils';
import { getNewsPageBreadcrumbs } from 'utils/breadcrumbsUtils';
import {
  checkIfBroadwayMB,
  checkIfLTTMB,
  findVideoUrlFromMediaData,
} from 'utils/helper';
import { convertUidToUrl } from 'utils/urlUtils';
import {
  CUSTOM_TYPE_VALUES,
  CUSTOM_TYPES,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
  SUPPORTED_LOCALE_MAP,
  TLANGUAGELOCALE,
  TOUR_GROUP_MEDIA_RESOURCE_TYPE,
} from 'const/index';
import {
  newsArticlesWithCFrameworkGq,
  newsLandingPageGq,
  newsPageGq,
} from './graphQuery';

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
) => {
  const predicatesArray = [
    predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
    predicate.at(
      `my.${CUSTOM_TYPES.NEWS_PAGE}.${PRISMIC_FIELD_ID.TAGS}`,
      'Featured'
    ),
    predicate.not(`my.${CUSTOM_TYPES.NEWS_PAGE}.${PRISMIC_FIELD_ID.UID}`, uid),
  ];

  const prismicClient = createClient();
  return prismicClient.getByType('news_page', {
    lang,
    pageSize: 30,
    predicates: predicatesArray,
    graphQuery: newsArticlesWithCFrameworkGq,
  });
};

export const getArticlesWithSameTgidPromise = (
  tgid: number,
  uid: string,
  lang: TLANGUAGELOCALE
) => {
  const predicatesArray = [
    predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
    predicate.not(`my.${CUSTOM_TYPES.NEWS_PAGE}.${PRISMIC_FIELD_ID.UID}`, uid),
  ];
  if (tgid) {
    predicatesArray.push(
      predicate.at(
        `my.${CUSTOM_TYPES.NEWS_PAGE}.${PRISMIC_FIELD_ID.TGID}`,
        tgid
      )
    );
  }

  const prismicClient = createClient();
  const promise = prismicClient.getByType('news_page', {
    pageSize: 5,
    lang,
    predicates: predicatesArray,
    graphQuery: newsArticlesWithCFrameworkGq,
  });
  return tgid ? promise : Promise.resolve({});
};

export const getAllArticlesPromise = (uid: string, lang: TLANGUAGELOCALE) => {
  const predicatesArray = [
    predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
    predicate.not(`my.${CUSTOM_TYPES.NEWS_PAGE}.${PRISMIC_FIELD_ID.UID}`, uid),
  ];
  const prismicClient = createClient();
  return prismicClient.getAllByType('news_page', {
    pageSize: 100,
    lang,
    predicates: predicatesArray,
    graphQuery: newsArticlesWithCFrameworkGq,
  });
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
  const prismicClient = createClient({
    req,
  });

  const newsPage = await prismicClient.getByUID('news_page', uid, {
    lang,
    graphQuery: newsPageGq,
  });

  if (newsPage && Object.keys(newsPage)?.length) {
    const baseLangUid = getEnglishDocUid(newsPage?.alternate_languages);
    const baseLangData =
      lang !== SUPPORTED_LOCALE_MAP.en
        ? await prismicClient.getByUID('news_page', baseLangUid || uid, {
            lang: SUPPORTED_LOCALE_MAP.en,
            graphQuery: newsPageGq,
          })
        : newsPage;

    const breadcrumbs = await getNewsPageBreadcrumbs(newsPage);

    const completePageData = {
      ...newsPage,
      data: {
        ...newsPage?.data,
        breadcrumbs,
        taggedCity: mbCategorisationData(
          baseLangData?.data,
          newsPage?.data,
          lang,
          PRISMIC_FIELD_ID.TAGGED_CITY
        ),
        taggedCountry: mbCategorisationData(
          baseLangData?.data,
          newsPage?.data,
          lang,
          PRISMIC_FIELD_ID.TAGGED_COUNTRY
        ),
        taggedCollection: mbCategorisationData(
          baseLangData?.data,
          newsPage?.data,
          lang,
          PRISMIC_FIELD_ID.TAGGED_COLLECTION
        ),
        taggedCategory: mbCategorisationData(
          baseLangData?.data,
          newsPage?.data,
          lang,
          PRISMIC_FIELD_ID.TAGGED_CATEGORY
        ),
        taggedMbType: mbCategorisationData(
          baseLangData?.data,
          newsPage?.data,
          lang,
          PRISMIC_FIELD_ID.TAGGED_MB_TYPE
        ),
      },
    };

    return {
      CMSContent: completePageData,
      ContentType: CUSTOM_TYPES.NEWS_PAGE,
    };
  } else {
    return Promise.reject();
  }
};

export const getNewsLandingPage = async () => {
  const predicatesArray = [
    predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
    predicate.at(
      `my.${CUSTOM_TYPES.NEWS_PAGE}.${PRISMIC_FIELD_ID.IS_LANDING_PAGE}`,
      true
    ),
  ];

  const prismicClient = createClient();
  return prismicClient.getByType('news_page', {
    predicates: predicatesArray,
    graphQuery: newsLandingPageGq,
  });
};

export const getTgidFromCollectionReviews = (reviews: any) => {
  return reviews?.items?.map((review: any) => review?.tourGroup?.id);
};

export const getNewsLandingPageUrl = (
  data: PrismicDocumentWithUID[],
  currentNewsPageUid: string,
  lang: string,
  hostname: string
) => {
  const newsLandingPageUid = data?.find(
    (doc: PrismicDocumentWithUID) =>
      doc?.uid?.split('.')[1] === currentNewsPageUid?.split('.')[1]
  )?.uid;

  return convertUidToUrl({
    uid: newsLandingPageUid,
    hostname,
    lang,
  });
};

export const getNewsPageData = async (
  CMSContent: PrismicDocumentWithUID,
  ContentType: CUSTOM_TYPE_VALUES,
  isDev: boolean,
  host: string,
  hostname: string,
  lang: TLANGUAGELOCALE,
  cookies: any,
  currencyListPromise: Promise<any>,
  domainConfigPromise: Promise<any>
) => {
  const { uid, data } = CMSContent ?? {};
  const { tgid, is_landing_page: isLandingPage, taggedCity } = data;
  const langCode = getHeadoutLanguagecode(lang);

  const collectionDataTgids: number[] = [];
  const collectionIdFromPrismic = CMSContent?.data?.taggedCollection;
  let allArticles,
    featuredArticles,
    articlesWithSameTgid,
    collectionReviews,
    collectionReviewsTgid,
    newsLandingPageData;

  const newsLandingPagePromise = getNewsLandingPage();
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
    isLandingPage ? Promise.resolve([]) : newsLandingPagePromise,
    isLandingPage ? allArticlesPromise : Promise.resolve([]),
  ]);

  [
    featuredArticles,
    articlesWithSameTgid,
    collectionReviews,
    newsLandingPageData,
    allArticles,
  ] = handleSettledPromiseResults(aggregatedPromise, uid);

  const uidToCFIdMap = new Map<string, any>();
  const videoDataMap = new Map<string, string>();

  featuredArticles = filterArticlesBasedOnEntMb(featuredArticles?.results, uid);
  articlesWithSameTgid = filterArticlesBasedOnEntMb(
    articlesWithSameTgid?.results,
    uid
  );
  allArticles = filterArticlesBasedOnEntMb(allArticles, uid);

  const tgidsFromCollectionReviews =
    getTgidFromCollectionReviews(collectionReviews);
  collectionReviewsTgid = new Set([
    tgidsFromCollectionReviews ? tgidsFromCollectionReviews : [],
  ]);

  const articles = [
    ...(allArticles ? allArticles : []),
    ...(featuredArticles ? featuredArticles : []),
    ...(articlesWithSameTgid ? articlesWithSameTgid : []),
  ];

  articles?.forEach((article) => {
    if (!uidToCFIdMap.has(article.uid))
      uidToCFIdMap.set(
        article?.uid,
        article?.data?.content_framework_ref
          ?.data as ContentFrameworkDocumentData
      );
  });

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

  const tgidsOfShows = new Set<number>();
  const popularShowsData = pageData?.items?.filter((e: TourGroupDataType) => {
    return e.id !== tgid;
  });

  [
    ...(pageData?.items ? pageData?.items : []),
    ...(collectionData ? collectionData : []),
  ]?.forEach((item: TourGroupDataType) => {
    tgidsOfShows.add(item.id);
  });

  const showpageTgids: string[] = [
    ...tgidsOfShows,
    ...(tgidMappingData ? [tgidMappingData.id] : []),
  ];

  const mediaData = await fetchTourGroupMedia({
    hostname,
    tgids: [
      ...collectionDataTgids,
      ...showpageTgids,
      ...Array.from(collectionReviewsTgid),
    ],
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

  const prismicClient = createClient();
  const showpages = await prismicClient.getAllByType('showpage', {
    predicates: [
      predicate.any(`my.${CUSTOM_TYPES.SHOW_PAGE}.tgid`, showpageTgids),
    ],
  });

  const showPageDocuments =
    Array.from(tgidsOfShows)?.length > 0 ? showpages : [];
  const newsLandingPageUrl = getNewsLandingPageUrl(
    newsLandingPageData?.results,
    uid,
    langCode,
    hostname
  );

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
      newsLandingPageUrl,
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
