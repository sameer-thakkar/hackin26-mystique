import React from 'react';
import { getTrackingObject } from 'components/ReviewsPage/utils';
import ContributorsReview from 'components/slices/ContributorsReview';
import { REVIEWS_PAGE_SECTIONS } from 'const/index';
import Reviews from '../Reviews';
import { TReviewsSectionProps } from './interface';

const ReviewsSection: React.FC<
  React.PropsWithChildren<TReviewsSectionProps>
> = ({
  criticsReviewsRepeatableContent,
  reviewsData,
  tgidData,
  isMobile,
  contributorsReviewHeading,
  contributorsReviewContent,
  redirectionLink,
  contributorsReviewAuthorImage,
  contributorsReviewAuthorName,
  date,
  handleReadMoreCtaClick,
}) => {
  const reviewsTrackingObject = getTrackingObject(
    REVIEWS_PAGE_SECTIONS.CRITICS_USER_REVIEWS
  );
  const contributorsReviewTrackingObject = getTrackingObject(
    REVIEWS_PAGE_SECTIONS.CONTRIBUTOR_REVIEW
  );

  return (
    <>
      <Reviews
        criticReviewsData={criticsReviewsRepeatableContent}
        reviewsData={reviewsData}
        tgid={tgidData?.id}
        isMobile={isMobile}
        trackingObject={reviewsTrackingObject}
      />
      <ContributorsReview
        heading={contributorsReviewHeading}
        content={contributorsReviewContent}
        redirectionLink={redirectionLink?.url}
        authorImage={contributorsReviewAuthorImage?.url}
        authorName={contributorsReviewAuthorName}
        date={date}
        handleReadMoreCtaClick={handleReadMoreCtaClick}
        trackingObject={contributorsReviewTrackingObject}
      />
    </>
  );
};

export default ReviewsSection;
