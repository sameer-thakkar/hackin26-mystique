import React, { useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import RatingStars from 'UI/RatingStars';
import StarRebranded from 'UI/StarRebranded';
import ReadMoreText from 'UI/ReadMoreText';
import { trackEvent } from 'utils/analytics';
import { truncateNumber } from 'utils/gen';
import { strings } from 'const/strings';
import { COLORS, SOLEIL } from 'const/ui-constants';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';

const StyledList = styled.div`
  @media (max-width: 768px) {
    margin-top: 2rem;
  }
`;

const StyledHeading = styled.div`
  display: flex;
  align-items: center;

  .reviews-heading {
    font-size: 1.5rem;
    line-height: 1.16;
    margin-right: 0.5rem;
  }

  svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.2rem;
  }

  .average-rating,
  .review-count {
    font-size: 1.125rem;
    line-height: 1.12;
  }
`;

const StyledReview = styled.div`
  margin-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed ${COLORS.GREY.G6};

  &:first-child {
    margin-top: 0.25rem;
  }

  .review-name-container {
    display: flex;
    justify-content: space-between;

    .customer-name {
      font-weight: ${SOLEIL.BOLD};
      font-size: 0.9375rem;
      line-height: 1.5rem;
      letter-spacing: 0.6px;
    }

    .review-time {
      font-weight: ${SOLEIL.REGULAR};
      font-size: 0.75rem;
      line-height: 1rem;
      letter-spacing: 0.2px;
    }
  }

  svg {
    height: 0.75rem;
    width: 0.75rem;
  }

  .review-content {
    margin-top: 0.5rem;

    span {
      font-weight: ${SOLEIL.REGULAR};
      font-size: 0.9375rem;
      line-height: 1.5rem;
      letter-spacing: 0.6px;
    }
  }
`;

const StyledButton = styled.div`
  cursor: pointer;
  margin-top: 0.75rem;
  display: inline-block;

  &.show-less-reviews {
    float: right;
  }

  span {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: ${COLORS.PURPS3};
    font-weight: ${SOLEIL.REGULAR};
  }

  @media (max-width: 768px) {
    border: 1px solid ${COLORS.PURPS};
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;

    span {
      font-size: 1rem;
      line-height: 1rem;
      font-weight: ${SOLEIL.BOLD};
    }
  }
`;

interface ReviewObject {
  id: number;
  name: string;
  time: string;
  rating: number;
  content: string;
}

interface Props {
  reviews: Array<ReviewObject>;
  showHeading?: boolean;
  reviewCount?: number;
  averageRating?: number;
  isMobile?: boolean;
  tgid: number;
}

const SHOW_MORE_REVIEWS_COUNT = 3;
const REVIEW_LENGTH_LIMIT_MWEB = 140;
const REVIEW_LENGTH_LIMIT_DWEB = 370;

const ReviewsList: React.FC<Props> = ({
  reviews,
  showHeading = false,
  averageRating,
  reviewCount,
  isMobile,
  tgid,
}) => {
  const [showMoreClickCount, setShowMoreClickCount] = useState(0);
  const [visibleReviews, setVisibleReviews] = useState(SHOW_MORE_REVIEWS_COUNT);

  const changeVisibleReviewLimit = () => {
    const updatedVisibleReviews =
      visibleReviews + SHOW_MORE_REVIEWS_COUNT > reviews.length
        ? reviews.length
        : visibleReviews + SHOW_MORE_REVIEWS_COUNT;
    const updatedCount = showMoreClickCount + 1;
    setVisibleReviews(updatedVisibleReviews);
    setShowMoreClickCount(updatedCount);
    trackEvent({
      eventName: ANALYTICS_EVENTS.SHOW_MORE_REVIEWS_CLICKED,
      [ANALYTICS_PROPERTIES.CLICK_COUNT]: updatedCount,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
    });
  };

  const resetVisibleReviewsLimit = () => {
    setVisibleReviews(SHOW_MORE_REVIEWS_COUNT);
    trackEvent({
      eventName: ANALYTICS_EVENTS.SHOW_LESS_REVIEWS_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
    });
  };

  return (
    <StyledList id="reviews-list">
      {showHeading && (
        <StyledHeading>
          <span className="reviews-heading">{strings.REVIEWS}</span>
          <StarRebranded fillValue={1} fillColor={COLORS.HEADOUT_CANDY} />
          <span className="average-rating">{averageRating}</span>
          <span className="review-count">
            &nbsp;{`(${truncateNumber(reviewCount)} ${strings.REVIEWS})`}
          </span>
        </StyledHeading>
      )}
      {reviews.slice(0, visibleReviews).map((review, index) => (
        <StyledReview key={review.id}>
          <div className="review-name-container">
            <span className="customer-name">{review.name}</span>
            <span className="review-time">
              {dayjs(review.time).format('MMM, YYYY')}
            </span>
          </div>
          <RatingStars averageRating={review.rating} />
          <div className="review-content">
            <ReadMoreText
              text={review.content}
              textLimit={
                isMobile ? REVIEW_LENGTH_LIMIT_MWEB : REVIEW_LENGTH_LIMIT_DWEB
              }
              reviewIndex={index}
              tgid={tgid}
            />
          </div>
        </StyledReview>
      ))}
      <div>
        {visibleReviews < reviews.length && (
          <StyledButton
            className="show-more-reviews"
            onClick={changeVisibleReviewLimit}
          >
            <span>{`${!isMobile ? '+ ' : ''}${
              strings.SHOW_MORE_REVIEWS
            }`}</span>
          </StyledButton>
        )}
        {visibleReviews > SHOW_MORE_REVIEWS_COUNT && !isMobile && (
          <StyledButton
            className="show-less-reviews"
            onClick={resetVisibleReviewsLimit}
          >
            <span>- {strings.SHOW_LESS_REVIEWS}</span>
          </StyledButton>
        )}
      </div>
    </StyledList>
  );
};

export default ReviewsList;
