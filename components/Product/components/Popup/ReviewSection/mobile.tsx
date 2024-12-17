import Conditional from 'components/common/Conditional';
import ReviewsSection from 'components/MicrositeV2/ShowPageV2/ReviewSection';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import DiagonalArrow from 'assets/diagonalArrow';
import {
  StyledExternalLinkIcon,
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
}: TReviewSectionMobileProps) => {
  const externalButtonContent = (
    <>
      {strings.SHOW_PAGE_V2.SHOW_MORE_REVIEWS}
      <StyledExternalLinkIcon>{DiagonalArrow}</StyledExternalLinkIcon>
    </>
  );

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
          maximumNumberOfReviews={25}
          showFetchMoreButton
          reviewPageUrl={`https://www.headout.com/reviews/${tgid}/`}
          controlledSwiperParams={{
            slidesPerView: 'auto',
            spaceBetween: 16,
          }}
          showSkeleton
          externalButtonContent={externalButtonContent}
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
        />
      </StyledReviewSectionContainer>
    </>
  );
};

export default ReviewSection;
