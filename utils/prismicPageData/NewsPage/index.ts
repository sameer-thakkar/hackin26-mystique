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
  LANGUAGE_MAP,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
  SUPPORTED_LOCALE_MAP,
  TLANGUAGELOCALE,
  TOUR_GROUP_MEDIA_RESOURCE_TYPE,
} from 'const/index';
import { LOG_LEVELS } from 'const/logs';

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

export const getFeaturedArticlesPromise = (uid: string) =>
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
    { pageSize: 30 }
  );

export const getArticlesWithSameTgidPromise = (tgid: number, uid: string) => {
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
        { pageSize: 5 }
      )
    : Promise.resolve([]);
};

export const getAllArticlesPromise = (uid: string) => {
  return Client().query(
    [
      Prismic.Predicates.not(`document.tags`, [`${PRISMIC_DEV_TAG}`]),
      Prismic.Predicates.at('document.type', `${CUSTOM_TYPES.NEWS_PAGE}`),
      Prismic.Predicates.not(
        `my.${CUSTOM_TYPES.NEWS_PAGE}.${PRISMIC_FIELD_ID.UID}`,
        uid
      ),
    ],
    { pageSize: 100 }
  );
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
  }
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
  let allArticles, featuredArticles, articlesWithSameTgid, collectionReviews;

  const featuredArticlesPromise = getFeaturedArticlesPromise(uid);
  const articlesWithSameTgidPromise = getArticlesWithSameTgidPromise(tgid, uid);
  const allArticlesPromise = getAllArticlesPromise(uid);

  const aggregatedPromise = await Promise.allSettled([
    featuredArticlesPromise,
    articlesWithSameTgidPromise,
    allArticlesPromise,
  ]);

  [
    featuredArticles,
    articlesWithSameTgid,
    allArticles,
    collectionReviews,
  ] = handleSettledPromiseResults(aggregatedPromise);

  const uidToCFIdMap = new Map<string, any>();
  const CFIdToDataMap = new Map<string, any>();
  const videoDataMap = new Map<string, string>();
  if (isLandingPage) {
    allArticles = await Client().query(
      [
        Prismic.Predicates.not(`document.tags`, [`${PRISMIC_DEV_TAG}`]),
        Prismic.Predicates.at('document.type', `${CUSTOM_TYPES.NEWS_PAGE}`),
        Prismic.Predicates.not(
          `my.${CUSTOM_TYPES.NEWS_PAGE}.${PRISMIC_FIELD_ID.UID}`,
          uid
        ),
      ],
      { pageSize: 100 }
    );
  }

  featuredArticles = filterArticlesBasedOnEntMb(featuredArticles?.results, uid);
  articlesWithSameTgid = filterArticlesBasedOnEntMb(
    articlesWithSameTgid?.results,
    uid
  );

  const articles = [
    ...(allArticles?.results ? allArticles?.results : []),
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
        language: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
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
    tgids: [...collectionDataTgids],
    cookies,
    resourceType: TOUR_GROUP_MEDIA_RESOURCE_TYPE.MB_EXPERIENCE,
  });

  mediaData?.resourceEntityMedias?.forEach((media: any) => {
    videoDataMap.set(media.resourceEntityId, media.medias[1]?.url);
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
        language: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
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
