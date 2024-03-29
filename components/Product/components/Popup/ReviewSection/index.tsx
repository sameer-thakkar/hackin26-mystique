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
}: TReviewSectionProps) => {
  const externalButtonContent = (
    <>
      {strings.LTT_SHOW_PAGE.SHOW_MORE_REVIEWS}
      <StyledExternalLinkIcon>{DiagonalArrow}</StyledExternalLinkIcon>
    </>
  );

  return (
    <>
      <StyledReviewSectionTitle id="review-section-title">
        {strings.LTT_SHOW_PAGE.CONTENT_TABS.Reviews}
      </StyledReviewSectionTitle>
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
            slidesPerView: 6.3,
            spaceBetween: 16,
          }}
          showSkeleton
          externalButtonContent={externalButtonContent}
        />
      </StyledReviewSectionContainer>
    </>
  );
};

export default ReviewSection;
