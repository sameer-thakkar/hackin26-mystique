import { EReviewRatingFilter } from 'types/reviews';
import en from 'const/localization/en';
import { strings } from 'const/strings';

export const getRatingFilterLabel = (index: number, isLocalized = false) => {
  const sortType = Object.values(EReviewRatingFilter)[index];
  if (isLocalized)
    switch (sortType) {
      case EReviewRatingFilter.EQUAL_TO_3:
        return strings.REVIEW_SECTION.FILTERING.EQUAL_TO_3;
      case EReviewRatingFilter.GREATER_THAN_4:
        return strings.REVIEW_SECTION.FILTERING.GREATER_THAN_4;
      default:
        return strings.REVIEW_SECTION.FILTERING.LESS_THAN_3;
    }
  switch (sortType) {
    case EReviewRatingFilter.EQUAL_TO_3:
      return en.REVIEW_SECTION.FILTERING.EQUAL_TO_3;
    case EReviewRatingFilter.GREATER_THAN_4:
      return en.REVIEW_SECTION.FILTERING.GREATER_THAN_4;
    default:
      return en.REVIEW_SECTION.FILTERING.LESS_THAN_3;
  }
};
