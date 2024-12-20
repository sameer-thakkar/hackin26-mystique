import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { TourGroupDataType } from 'components/NewsPage/interface';
import { getHeadoutLanguagecode } from 'utils';
import {
  fetchCollectionReviews,
  fetchTourGroupMedia,
  fetchTourGroupsByCategory,
  fetchTourGroupV6,
} from 'utils/apiUtils';
import { CUSTOM_TYPES, TOUR_GROUP_MEDIA_RESOURCE_TYPE } from 'const/index';

export const getCollectionReviewsTgid = (
  collectionReviews: Record<string, any>[]
) => {
  const collectionReviewsTgid: Set<number> = new Set();
  collectionReviews.forEach((review) => {
    if (review?.tourGroup?.id) collectionReviewsTgid.add(review.tourGroup.id);
  });
  return Array.from(collectionReviewsTgid);
};

export const getTgidToReviewsUidMapping = (
  reviewsPages: Record<string, any>[]
) => {
  const result: {
    [key: string]: string;
  } = {};

  reviewsPages.map((reviewsPage: Record<string, any>) => {
    const tgid = reviewsPage?.data?.tgid;
    if (tgid) result[tgid] = reviewsPage?.uid;
  });
  return result;
};

export const getCollectionReviewsPromise = async (
  collectionId: number,
  cookies: any,
  lang: string,
  hostname: string
) => {
  const prismicClient = createClient();
  const collectionReviewsData = await fetchCollectionReviews({
    collectionId,
    cookies,
    limit: '9',
    language: getHeadoutLanguagecode(lang),
  });

  const collectionReviewsTgids = getCollectionReviewsTgid(
    collectionReviewsData?.result?.reviews?.items
  );

  const mediaData = await fetchTourGroupMedia({
    hostname,
    tgids: collectionReviewsTgids,
    cookies,
    resourceType: TOUR_GROUP_MEDIA_RESOURCE_TYPE.MB_EXPERIENCE,
  });
  const reviewsPages = collectionReviewsTgids?.length
    ? await prismicClient.getAllByType('reviews_page', {
        predicates: [
          predicate.any(
            `my.${CUSTOM_TYPES.REVIEWS_PAGE}.tgid`,
            collectionReviewsTgids
          ),
        ],
      })
    : [];

  const tgidToReviewsPageUidMapping = getTgidToReviewsUidMapping(reviewsPages);

  return {
    reviewsData: collectionReviewsData,
    mediaData,
    tgidToReviewsPageUidMapping,
  };
};

export const getPopularShowsPromise = async (
  tgid: number,
  taggedCity: string,
  lang: string,
  cookies: any,
  hostname: string
) => {
  const prismicClient = createClient();
  const tgidsOfShows = new Set<number>();
  const tgidData = await fetchTourGroupV6({
    tgid,
    hostname,
    cookies,
    language: getHeadoutLanguagecode(lang),
  });
  const primarySubCategoryId = tgidData?.primarySubCategory?.id;

  let { pageData = {} } = primarySubCategoryId
    ? await fetchTourGroupsByCategory({
        categoryId: primarySubCategoryId,
        hostname,
        isSubCategory: true,
        language: getHeadoutLanguagecode(lang),
        limit: '10',
        city: taggedCity,
        cookies,
      })
    : {};

  const popularShowsData = pageData?.items?.filter((e: TourGroupDataType) => {
    return e.id !== tgid;
  });

  [...(pageData?.items ? pageData?.items : [])]?.forEach(
    (item: TourGroupDataType) => {
      tgidsOfShows.add(item.id);
    }
  );

  const showpageTgids: number[] = [...tgidsOfShows];
  const showpages = showpageTgids?.length
    ? await prismicClient.getAllByType('showpage', {
        predicates: [
          predicate.any(`my.${CUSTOM_TYPES.SHOW_PAGE}.tgid`, showpageTgids),
        ],
      })
    : [];

  const showPageDocuments =
    Array.from(tgidsOfShows)?.length > 0 ? showpages : [];

  const mediaData = await fetchTourGroupMedia({
    hostname,
    tgids: showpageTgids,
    cookies,
    resourceType: TOUR_GROUP_MEDIA_RESOURCE_TYPE.MB_EXPERIENCE,
  });

  return {
    showPageDocuments,
    subCategoryData: popularShowsData,
    mediaData,
  };
};
