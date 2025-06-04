import React, { useState } from 'react';
import useSWR from 'swr';
import {
  PinnedReviewsSection,
  PinnedReviewsSkeleton,
} from '@headout/espeon/components/ReviewsSection';
import { css } from '@headout/pixie/css';
import { fetchPinnedReviewsByTgid } from 'utils/apiUtils';
import { pickByKeys } from 'utils/gen';
import { strings } from 'const/strings';
import { containerRecipe } from './styles';
import type { TPinnedReviewsProps } from './types';
import { getPinnedReviewsTrackingContext } from './utils';

export const PinnedReviews = ({
  pinnedReviews: initialPinnedReviews,
  lang,
  reviewsDetails,
  onSeeMoreClick,
  isMobile = false,
  tgid,
}: TPinnedReviewsProps) => {
  const [showLoader, setShowLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Only fetch data if initialPinnedReviews is empty or doesn't have items
  const shouldFetch =
    (!initialPinnedReviews || !initialPinnedReviews?.items?.length) && !!tgid;

  const { data, error } = useSWR(
    shouldFetch ? ['pinnedReviews', tgid, lang] : null,
    async () => {
      setIsLoading(true);
      setShowLoader(true);
      const data = await fetchPinnedReviewsByTgid({
        tgid: tgid!,
        language: lang,
      });
      setIsLoading(false);
      return data?.result || null;
    },
    {
      errorRetryCount: 0,
      revalidateOnFocus: false,
    }
  );

  // Use data from SWR or fallback to initialPinnedReviews
  const pinnedReviews = data || initialPinnedReviews;

  if (
    !isLoading &&
    (pinnedReviews === null ||
      error ||
      !pinnedReviews?.displayConfig?.exposePinnedReviews ||
      !pinnedReviews?.items?.length)
  )
    return null;

  const styles = containerRecipe.raw();

  return (
    <div className={css(styles.root)} data-is-loading={showLoader}>
      {showLoader ? (
        <PinnedReviewsSkeleton
          isMobile={isMobile}
          visible={isLoading}
          onClose={() => {
            setShowLoader(false);
          }}
        />
      ) : (
        <PinnedReviewsSection
          reviews={pinnedReviews?.items || []}
          isMobile={isMobile}
          strings={{
            ...pickByKeys(strings as Record<string, any>, [
              'REVIEWS_SECTION',
              'REVIEW_LOC',
              'ALL_PHOTOS',
            ]),
            ...{
              X_MORE: strings.ITINERARY.MORE,
              READ_MORE: strings.READ_MORE,
            },
            formatString: strings.formatString,
          }}
          shouldFocusProductCardOnCTAClick={true}
          lang={lang}
          onCTAClick={() => {}}
          trackingContext={getPinnedReviewsTrackingContext(tgid)}
          rating={reviewsDetails?.averageRating || 0}
          ratingsCount={reviewsDetails?.reviewsCount || 0}
          overrideStyles={styles}
          {...(pinnedReviews.displayConfig?.exposeLoadMore && {
            onSeeMoreClick,
          })}
        />
      )}
    </div>
  );
};
