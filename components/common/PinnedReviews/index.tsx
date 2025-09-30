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

  const reviewCardLabels = {
    MODAL_TITLE: strings.REVIEWS_SECTION.REVIEW_CARD_MODAL_TITLE,
    VERIFIED_PARTNER_REVIEW: strings.REVIEWS_SECTION.VERIFIED_REVIEW,
    VERIFIED_BOOKING: strings.REVIEWS_SECTION.TRUST_VB_TAG,
    X_MORE: strings.ITINERARY.MORE,
    READ_MORE: strings.READ_MORE,
    READ_LESS: strings.READ_LESS,
    REVIEW_LOC: {
      VIEW_ORIGINAL: strings.REVIEW_LOC.VIEW_ORIGINAL,
      VIEW_ORIGINAL_NO_LANG: strings.REVIEW_LOC.VIEW_ORIGINAL_NO_LANG,
      TRANSLATE: strings.REVIEW_LOC.TRANSLATE,
      LANGUAGES: {
        EN: strings.REVIEW_LOC.LANGUAGES.EN,
        ES: strings.REVIEW_LOC.LANGUAGES.ES,
        FR: strings.REVIEW_LOC.LANGUAGES.FR,
        IT: strings.REVIEW_LOC.LANGUAGES.IT,
        DE: strings.REVIEW_LOC.LANGUAGES.DE,
        PT: strings.REVIEW_LOC.LANGUAGES.PT,
        NL: strings.REVIEW_LOC.LANGUAGES.NL,
      },
    },
  };

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
            REVIEW_CARD: reviewCardLabels,
            formatString: strings.formatString,
            ...pickByKeys(strings as Record<string, any>, ['REVIEWS_SECTION']),
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
