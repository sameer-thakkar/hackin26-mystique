import React from 'react';
import Conditional from 'components/common/Conditional';
import { truncateNumber } from 'utils';
import COLORS from 'const/colors';
import { RATINGS_ORDER } from 'const/index';
import { strings } from 'const/strings';
import OUTLINE_STAR from 'assets/outlineStar';
import StarFullNew from 'assets/starFullNew';
import {
  TRatingSplitProps,
  TRatingStarsProps,
  TReviewCountProps,
  TScaleOfRatings,
} from './interface';
import {
  RatingCount,
  RatingSplitWrapper,
  RatingStarsWrapper,
  ReviewsCount,
  Scale,
  VerticalSeparator,
  Wrapper,
} from './styles';

export const RatingStars: React.FC<
  React.PropsWithChildren<TRatingStarsProps>
> = ({ averageRating, isComponentVisible = true }) => {
  const totalRatingsArray = [1, 2, 3, 4, 5];

  return (
    <Conditional if={isComponentVisible}>
      <RatingStarsWrapper>
        {totalRatingsArray.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <Conditional if={item <= averageRating}>
                <StarFullNew fillColor={COLORS.BRAND.CANDY} />
              </Conditional>
              <Conditional if={item > averageRating}>
                <OUTLINE_STAR strokeColor={COLORS.BRAND.CANDY} />
              </Conditional>
            </React.Fragment>
          );
        })}
      </RatingStarsWrapper>
    </Conditional>
  );
};

const RatingSplit: React.FC<React.PropsWithChildren<TRatingSplitProps>> = ({
  ratingsSplit,
  ratingsCount,
}) => {
  const RATINGS_SCALE = {
    1: strings.REVIEWS_PAGE.TERRIBLE,
    2: strings.REVIEWS_PAGE.POOR,
    3: strings.REVIEWS_PAGE.AVERAGE,
    4: strings.REVIEWS_PAGE.GOOD,
    5: strings.REVIEWS_PAGE.AWESOME,
  };

  return (
    <RatingSplitWrapper>
      {RATINGS_ORDER.map((item: number) => {
        const progressBarValue = (ratingsSplit[item] / ratingsCount) * 100;
        const formattedReviewCount = truncateNumber(ratingsSplit[item]);

        return (
          <Scale key={RATINGS_SCALE[item as TScaleOfRatings]}>
            <p>{RATINGS_SCALE[item as TScaleOfRatings]}</p>
            {/* Used progress instead of meter tag due to meter having incompatible pseudo elements */}
            <progress
              id={RATINGS_SCALE[item as TScaleOfRatings]}
              max="100"
              value={progressBarValue}
            />
            <span>{formattedReviewCount}</span>
          </Scale>
        );
      })}
    </RatingSplitWrapper>
  );
};

const ReviewCount: React.FC<React.PropsWithChildren<TReviewCountProps>> = ({
  averageRating,
  ratingsCount,
  reviewsCount,
  ratingsSplit,
  isMobile,
  handleReviewCountClick,
}) => {
  const { REVIEWS_PAGE } = strings;
  const { REVIEWS_COUNT } = REVIEWS_PAGE;
  const floorAverageRating = Math.floor(averageRating);
  const formattedReviewCount = truncateNumber(reviewsCount);
  if (!ratingsCount) return null;

  return (
    <Wrapper>
      <RatingCount>
        <strong>
          {averageRating}
          <Conditional if={isMobile}>
            <StarFullNew fillColor={COLORS.BRAND.CANDY} />
          </Conditional>
        </strong>
        <RatingStars
          averageRating={floorAverageRating}
          isComponentVisible={!isMobile}
        />
        <ReviewsCount onClick={handleReviewCountClick}>
          {strings.formatString(REVIEWS_COUNT, formattedReviewCount)}
        </ReviewsCount>
      </RatingCount>
      <VerticalSeparator />
      <RatingSplit ratingsSplit={ratingsSplit} ratingsCount={ratingsCount} />
    </Wrapper>
  );
};

export default ReviewCount;
