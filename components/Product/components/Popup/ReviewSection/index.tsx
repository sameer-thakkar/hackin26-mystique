import Conditional from 'components/common/Conditional';
import ReviewsSection from 'components/MicrositeV2/ShowPageV2/ReviewSection';
import { strings } from 'const/strings';
import DiagonalArrow from 'assets/diagonalArrow';
import {
  StyledExternalLinkIcon,
  StyledReviewSectionContainer,
  StyledReviewSectionTitle,
} from './styles';
import type { TReviewSectionProps } from './types';

const ReviewSection = ({
  reviewsDetails,
  tgid,
  topReviews = [],
  isMobile = false,
  showTitle = true,
}: TReviewSectionProps) => {
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
            slidesPerView: isMobile ? 'auto' : 6.3,
            spaceBetween: 16,
          }}
          showSkeleton
          externalButtonContent={externalButtonContent}
          isMobile={isMobile}
          showReviews={topReviews && topReviews.length > 0}
        />
      </StyledReviewSectionContainer>
    </>
  );
};

export default ReviewSection;
