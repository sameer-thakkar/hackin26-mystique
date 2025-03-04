import { EReviewSortType } from 'types/reviews';
import { strings } from 'const/strings';

export const getSortTypeLabel = (index: number) => {
  const sortType = Object.values(EReviewSortType)[index];
  switch (sortType) {
    case EReviewSortType.MOST_RECENT:
      return strings.REVIEW_SECTION.SORTING.MOST_RECENT;
    case EReviewSortType.MOST_RELEVANT:
      return strings.REVIEW_SECTION.SORTING.MOST_RELEVANT;
    default:
      return '';
  }
};
