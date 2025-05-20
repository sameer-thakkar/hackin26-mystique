import Conditional from 'components/common/Conditional';
import ReviewsSection from 'components/MicrositeV2/ShowPageV2/ReviewSection';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { MAX_REVIEW_COUNT } from './constants';
import {
  StyledReviewSectionContainer,
  StyledReviewSectionTitle,
} from './styles';
import type { TReviewSectionMobileProps } from './types';

const ReviewSection = ({
  reviewsDetails,
  tgid,
  topReviews = [],
  showTitle = true,
  imageGalleryController,
  getReviewMediaGlobalLocation,
  snapshotSectionProps,
  isBot = false,
}: TReviewSectionMobileProps) => {
  return (
    <>
      <Conditional if={showTitle}>
        <StyledReviewSectionTitle data-review-section-title="true">
          {strings.SHOW_PAGE_V2.CONTENT_TABS.Reviews}
        </StyledReviewSectionTitle>
      </Conditional>
      <StyledReviewSectionContainer>
        <ReviewsSection
          reviewsDetails={reviewsDetails}
          tgid={tgid}
          initialReviews={topReviews}
          numberOfReviewsToFetchAtOnce={5}
          maximumNumberOfReviews={isBot ? MAX_REVIEW_COUNT : null}
          showFetchMoreButton
          controlledSwiperParams={{
            slidesPerView: 'auto',
            spaceBetween: 16,
          }}
          showSkeleton
          isMobile
          showReviews={!!topReviews?.length}
          onImageClick={(reviewId, localIndex) => {
            const globalIndex = getReviewMediaGlobalLocation?.(
              Number(reviewId),
              localIndex
            );
            imageGalleryController?.current?.open(globalIndex);
            if (typeof globalIndex !== 'undefined')
              trackEvent({
                eventName: ANALYTICS_EVENTS.GUEST_SNAPSHOT_CLICKED,
                [ANALYTICS_PROPERTIES.RANKING]: localIndex + 1,
                [ANALYTICS_PROPERTIES.POSITION]: 'Reviews Section',
              });
          }}
          snapshotSectionProps={snapshotSectionProps}
          numberOfReviewsToShow={isBot ? MAX_REVIEW_COUNT : 5}
          showCountriesSection
        />
      </StyledReviewSectionContainer>
    </>
  );
};

export default ReviewSection;
