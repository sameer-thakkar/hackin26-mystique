import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { PrismicDocumentWithUID } from '@prismicio/types';
import { getHeadoutLanguagecode, handleSettledPromiseResults } from 'utils';
import {
  fetchTourGroupMedia,
  fetchTourGroupReviews,
  fetchTourGroupV6,
} from 'utils/apiUtils';
import { getNewsPageBreadcrumbs as getReviewsPageBreadcrumbs } from 'utils/breadcrumbsUtils';
import { getBreadcrumbLabel } from 'utils/helper';
import { REVIEWS_PAGE_BANNER_HEADING } from 'const/breadcrumbs';
import {
  CUSTOM_TYPE_VALUES,
  CUSTOM_TYPES,
  FILTER_RATING_TO_API_PARAM_MAPPING,
  PRISMIC_FIELD_ID,
  TLANGUAGELOCALE,
  TOUR_GROUP_MEDIA_RESOURCE_TYPE,
} from 'const/index';
import {
  filterArticlesBasedOnEntMb,
  getArticlesWithSameTgidPromise,
  getFeaturedArticlesPromise,
  getNewsLandingPage,
  getNewsLandingPageUrl,
} from '../NewsPage';
import { reviewsPageGq } from './graphQuery';
import { getCollectionReviewsPromise, getPopularShowsPromise } from './utils';

export const getReviewsPageDocument = async ({ req, uid, lang }: any) => {
  const prismicClient = createClient({ req });
  const reviewsPage = await prismicClient.getByUID('reviews_page', uid, {
    lang,
    graphQuery: reviewsPageGq,
  });

  if (reviewsPage) {
    return {
      CMSContent: reviewsPage,
      ContentType: CUSTOM_TYPES.REVIEWS_PAGE,
    };
  } else {
    return Promise.reject();
  }
};

export const getReviewsPageData = async (
  CMSContent: PrismicDocumentWithUID,
  ContentType: CUSTOM_TYPE_VALUES,
  isDev: boolean,
  host: string,
  hostname: string,
  query: Record<string, any>,
  lang: TLANGUAGELOCALE,
  cookies: any,
  currencyListPromise: Promise<any>,
  domainConfigPromise: Promise<any>
) => {
  const prismicClient = createClient();
  const { uid, data } = CMSContent ?? {};
  const { tgid, tagged_collection, tagged_city } = data ?? {};
  const { 'filter-reviews': filterReviews } = query ?? {};
  const langCode = getHeadoutLanguagecode(lang);
  const filterRatingParamInfo =
    FILTER_RATING_TO_API_PARAM_MAPPING[filterReviews];
  const isFitlerReviewQueryParamViable =
    filterReviews in FILTER_RATING_TO_API_PARAM_MAPPING;

  const breadcrumbsPromise = getReviewsPageBreadcrumbs(CMSContent);
  const tgidDataPromise = fetchTourGroupV6({
    tgid,
    hostname,
    cookies,
    language: langCode,
  });
  const reviewsDataPromise = fetchTourGroupReviews({
    tgid,
    hostname,
    cookies,
    language: langCode,
    limit: 5,
    ...(filterReviews &&
      isFitlerReviewQueryParamViable && {
        filterType: filterRatingParamInfo['filter-type'],
        sortType: filterRatingParamInfo['sort-type'],
        sortOrder: filterRatingParamInfo['sort-order'],
      }),
  });
  const mediaDataPromise = fetchTourGroupMedia({
    hostname,
    tgids: [tgid],
    cookies,
    resourceType: TOUR_GROUP_MEDIA_RESOURCE_TYPE.MB_EXPERIENCE,
  });
  const showPageDataPromise = prismicClient.getByType('showpage', {
    predicates: [
      predicate.any(`my.${CUSTOM_TYPES.SHOW_PAGE}.${PRISMIC_FIELD_ID.TGID}`, [
        tgid,
      ]),
    ],
  });
  const featuredNewsArticlesPromise = getFeaturedArticlesPromise(uid, lang);
  const newsArticlesWithSameTgidPromise = getArticlesWithSameTgidPromise(
    tgid,
    uid,
    lang
  );
  const newsLandingPagePromise = getNewsLandingPage();
  const collectionReviewsPromise = getCollectionReviewsPromise(
    tagged_collection,
    cookies,
    lang,
    host
  );
  const popularShowsPromise = getPopularShowsPromise(
    tgid,
    tagged_city,
    lang,
    cookies,
    hostname
  );

  const allPromiseSettledResults = await Promise.allSettled([
    breadcrumbsPromise,
    tgidDataPromise,
    reviewsDataPromise,
    mediaDataPromise,
    showPageDataPromise,
    featuredNewsArticlesPromise,
    newsArticlesWithSameTgidPromise,
    newsLandingPagePromise,
    collectionReviewsPromise,
    popularShowsPromise,
  ]);

  const [
    breadcrumbsData,
    tgidData,
    reviewsData,
    mediaData,
    showPageData,
    featuredNewsArticlesData,
    newsArticlesWithSameTgidData,
    newsLandingPageData,
    collectionReviewsData,
    popularShowsData,
  ] = handleSettledPromiseResults(allPromiseSettledResults);

  /**
   *  Modifying breadcrumbs last node, since we don't have
   * heading field in reviews page doc.
   **/
  if (breadcrumbsData['level_4']) {
    breadcrumbsData['level_4'].label = getBreadcrumbLabel({
      label: REVIEWS_PAGE_BANNER_HEADING,
      mbCity: '',
      showName: tgidData.name,
    });
  }
  const newsLandingPageUrl = getNewsLandingPageUrl(
    newsLandingPageData?.results,
    uid,
    langCode,
    hostname
  );
  const filteredFeaturedNewsArticlesData = filterArticlesBasedOnEntMb(
    featuredNewsArticlesData?.results,
    uid
  );

  return {
    CMSContent: {
      ...CMSContent,
      breadcrumbs: breadcrumbsData,
      tgidData,
      showPageData: showPageData?.results,
      mediaData,
      reviewsData,
      featuredNewsArticlesData: filteredFeaturedNewsArticlesData,
      newsArticlesWithSameTgidData,
      newsLandingPageUrl,
      collectionReviewsData,
      popularShowsData,
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
