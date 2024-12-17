import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { TReview, TReviewMedia } from 'types/reviews';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';

export type TReviewMediaLocation = {
  localIndex: number;
  reviewId: number;
  globalIndex: number;
};

export type TReviewMediaList = Array<
  TReviewMedia & {
    location: TReviewMediaLocation;
  }
>;

/**
 * Helper hook to fetch review media
 * and manage the state of the fetched data.
 *
 * @param tgid current tgid
 * @param limit number of items to fetch
 */
const useFetchReviewMedia = (tgid: string | number, limit = 8) => {
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(10000);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [reviews, updateReviews] = useState(new Map<number, TReview>());
  const [reviewMediaLocations, updateReviewMediaLocations] = useState(
    new Map<string, number>()
  );
  const [reviewMedias, updateReviewMedias] = useState<TReviewMediaList>([]);

  const { data, error } = useSWR<{
    items: Array<TReview>;
    total?: number | null;
    nextOffset?: number | null;
  }>(
    shouldFetch
      ? getHeadoutApiUrl({
          endpoint: HeadoutEndpoints.TourGroupReviewMedias,
          id: tgid,
          params: { offset: String(offset), limit: String(limit) },
        })
      : null,
    swrFetcher
  );

  const getMediaListFromReview = (review: TReview) => {
    const { reviewMedias: reviewMediaList = [], id } = review;
    return reviewMediaList.reduce<TReviewMediaList>((acc, media, index) => {
      acc.push({
        ...media,
        location: {
          localIndex: index,
          reviewId: id,
          globalIndex: -1,
        },
      });
      return acc;
    }, []);
  };

  useEffect(() => {
    if (
      !shouldFetch ||
      offset === null ||
      offset >= total ||
      error ||
      !data ||
      /**
       * to account for possible inconsistencies
       * between different instances of the same hook
       */
      offset < reviews.size
    )
      return;

    const {
      items: newReviews = [],
      total: updatedTotal = 0,
      nextOffset,
    } = data;
    const {
      updatedReviews: currentReviews,
      updatedMedias: currentReviewMedias,
    } = newReviews.reduce(
      (acc, review: TReview) => {
        acc.updatedReviews.set(review.id, review);
        const newMediaList = getMediaListFromReview(review);
        acc.updatedMedias.push(...newMediaList);
        return acc;
      },
      {
        updatedReviews: new Map(reviews),
        updatedMedias: [...reviewMedias],
      }
    );
    const currentReviewMediaLocations = new Map<string, number>(
      reviewMediaLocations
    );

    const currentReviewMediasWithGlobalIndex = currentReviewMedias.map(
      (media, index) => {
        const { reviewId, localIndex } = media.location;
        const key = `${reviewId}-${localIndex}`;

        currentReviewMediaLocations.set(key, index);

        return {
          ...media,
          location: { ...media.location, globalIndex: index },
        };
      }
    );

    updateReviewMedias(currentReviewMediasWithGlobalIndex);
    updateReviews(currentReviews);
    updateReviewMediaLocations(currentReviewMediaLocations);
    setTotal(updatedTotal ?? 0);
    setOffset(nextOffset ?? 0);
    setShouldFetch(false);
  }, [data]);

  const fetchNext = () => {
    setShouldFetch(true);
  };

  const getAssociatedReview = (reviewId: number) => {
    return reviews.get(reviewId);
  };

  const getReviewMediaGlobalLocation = (
    reviewId: number | string,
    localIndex: number
  ) => {
    const key = `${reviewId}-${localIndex}`;
    return reviewMediaLocations.get(key);
  };

  return {
    reviewMedias: reviewMedias,
    canFetch: offset < total,
    fetchNext,
    getAssociatedReview,
    getReviewMediaGlobalLocation,
  };
};

export default useFetchReviewMedia;
