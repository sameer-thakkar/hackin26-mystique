import { createTrackingHandler } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';

export const getPinnedReviewsTrackingContext = (tgid?: string | number) => {
  return {
    onReviewSectionView: createTrackingHandler(
      ANALYTICS_EVENTS.MORE_DETAILS_SECTION_TAB_VIEWED,
      {
        [ANALYTICS_PROPERTIES.TAB_NAME]: 'Pinned Reviews',
        [ANALYTICS_PROPERTIES.TGID]: tgid,
      }
    ),
    onSlideChange: createTrackingHandler(
      ANALYTICS_EVENTS.REVIEWS_CAROUSEL_SCROLLED,
      {
        [ANALYTICS_PROPERTIES.SECTION]: 'Pinned Reviews',
        [ANALYTICS_PROPERTIES.TGID]: tgid,
      }
    ),
    onToggleReviewContent: createTrackingHandler(ANALYTICS_EVENTS.REVIEW_LOC),
    onCardClick: createTrackingHandler(ANALYTICS_EVENTS.REVIEW_CARD_CLICKED, {
      [ANALYTICS_PROPERTIES.SECTION]: 'Pinned Reviews',
      [ANALYTICS_PROPERTIES.TGID]: tgid,
    }),
    onSeeAllClick: createTrackingHandler(
      ANALYTICS_EVENTS.SHOW_ALL_REVIEWS_CTA_CLICKED,
      {
        [ANALYTICS_PROPERTIES.TGID]: tgid,
        [ANALYTICS_PROPERTIES.SECTION]: 'Pinned Reviews',
      }
    ),
    onModalOpen: createTrackingHandler(
      ANALYTICS_EVENTS.PINNED_REVIEWS_MODAL_OPENED,
      {
        [ANALYTICS_PROPERTIES.TGID]: tgid,
      }
    ),
    onModalClose: createTrackingHandler(
      ANALYTICS_EVENTS.PINNED_REVIEWS_MODAL_CLOSED,
      {
        [ANALYTICS_PROPERTIES.TGID]: tgid,
      }
    ),
    onSwipeSheetOpen: createTrackingHandler(
      ANALYTICS_EVENTS.PINNED_REVIEWS_SWIPESHEET_OPENED,
      {
        [ANALYTICS_PROPERTIES.TGID]: tgid,
      }
    ),
    onSwipeSheetClose: createTrackingHandler(
      ANALYTICS_EVENTS.PINNED_REVIEWS_SWIPESHEET_CLOSED,
      {
        [ANALYTICS_PROPERTIES.TGID]: tgid,
      }
    ),
  };
};
