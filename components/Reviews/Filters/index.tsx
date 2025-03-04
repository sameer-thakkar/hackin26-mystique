import FilterChips from './Chips';
import SortingDropdown from './SortingDropdown';
import { filterContainerStyles } from './styles';
import { TReviewFilterAndSorterProps } from './types';

const ReviewFilterAndSorter = ({
  isDesktop = false,
  onSortTypeChange,
  onFilterChange,
  productDetails,
  showOnlyReviewsWithMedia,
  currentRatingFilter,
  currentSortType,
}: TReviewFilterAndSorterProps) => {
  const { exposeSorting = false, exposeFiltering = false } =
    productDetails.reviewsDetails?.displayConfig ?? {};

  return (
    <div
      className={filterContainerStyles}
      data-qa-marker="qaid-review-filters-container"
    >
      {exposeSorting && (
        <SortingDropdown
          isDesktop={isDesktop}
          onSortTypeChange={onSortTypeChange}
          productDetails={productDetails}
          currentSortType={currentSortType}
        />
      )}
      {exposeFiltering && (
        <FilterChips
          onFilterChange={onFilterChange}
          productDetails={productDetails}
          showOnlyReviewsWithMedia={showOnlyReviewsWithMedia}
          currentRatingFilter={currentRatingFilter}
        />
      )}
    </div>
  );
};

export default ReviewFilterAndSorter;
