import { getSinglePrismicSlice } from 'utils';
import { hashCode } from 'utils/integerUtils';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  SLICE_TYPES,
} from 'const/index';

export const getSlicesUsedInReviewsPage = (
  contentFramework: Record<string, any>
) => {
  const detailedReviewSlice = getSinglePrismicSlice({
    sliceName: SLICE_TYPES.DETAILED_REVIEW,
    slices: contentFramework?.data?.body,
  });
  const reviewChipsSlice = getSinglePrismicSlice({
    sliceName: SLICE_TYPES.REVIEW_CHIPS,
    slices: contentFramework?.data?.body,
  });
  const criticsReviewSlice = getSinglePrismicSlice({
    sliceName: SLICE_TYPES.CRITICS_REVIEWS,
    slices: contentFramework?.data?.body,
  });
  const contributorsReviewSlice = getSinglePrismicSlice({
    sliceName: SLICE_TYPES.CONTRIBUTORS_REVIEW,
    slices: contentFramework?.data?.body,
  });

  return {
    detailedReviewSlice,
    reviewChipsSlice,
    criticsReviewSlice,
    contributorsReviewSlice,
  };
};

export const getUICompatibleReviewsData = (
  reviewsData?: Record<string, any>[]
) => {
  return (
    reviewsData?.reduce((acc: Record<string, any>[], curr) => {
      const { nonCustomerName, reviewTime, rating, content } = curr ?? {};
      const result = {
        author_name: nonCustomerName,
        origin_website: null,
        origin_website_link: null,
        review_date: reviewTime,
        rating: rating,
        review: content,
        reviewer_img_url: getRandomImage(nonCustomerName),
      };
      acc.push(result);
      return acc;
    }, []) ?? []
  );
};

/*
 * Returns reviews with image urls by hashing the reviewer name
 * if hash is even, selects one of the default DPs
 * else selects one of the random DPs
 */
export const getRandomImage = (nonCustomerName: string): string => {
  const userNameHash = hashCode(nonCustomerName);

  const totalAvatarVariants = 24;
  const avatarIndex = userNameHash % totalAvatarVariants;
  const isEvenNameLength = nonCustomerName?.length % 2 === 0;
  const finalAvatarIndex =
    isEvenNameLength || avatarIndex === 0 ? avatarIndex + 1 : avatarIndex;

  return `https://cdn-imgix.headout.com/reviews/avatars/Avatar_${finalAvatarIndex}.svg`;
};

export const getTrackingObject = (section: string) => {
  return {
    eventName: ANALYTICS_EVENTS.REVIEWS_PAGE_SECTION_VIEWED,
    [ANALYTICS_PROPERTIES.SECTION]: section,
  };
};
