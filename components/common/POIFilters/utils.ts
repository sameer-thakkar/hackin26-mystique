import { TScorpioData, TTour } from 'components/AirportTransfers/interface';
import { FILTER_TYPES, TPOIFilterType } from './constant';

export const isTourCategory = (
  tour: TTour,
  scorpioData: Record<string, TScorpioData>,
  categoryName: string
): boolean => {
  const { primaryCategory, primarySubCategory } =
    scorpioData?.[tour.tgid] || {};

  const isCategory =
    primaryCategory &&
    (!primarySubCategory ||
      (primaryCategory.id === 1 && primarySubCategory.id !== 1008));

  const { name } = isCategory ? primaryCategory : primarySubCategory || {};

  return name === categoryName;
};

export const isDiscountedProduct = (
  tour: TTour,
  scorpioData: Record<string, TScorpioData>
): boolean => {
  const bestDiscount = scorpioData[tour.tgid]?.listingPrice?.bestDiscount;
  return bestDiscount > 0;
};

export const getAvailablePOIFilterTypes = (
  allTours: TTour[],
  scorpioData: Record<string, TScorpioData>
): Set<TPOIFilterType> => {
  const availableTypes = new Set<TPOIFilterType>();

  if (
    allTours?.some((tour) => isTourCategory(tour, scorpioData, 'Guided Tours'))
  ) {
    availableTypes.add(FILTER_TYPES.GUIDED_TOURS);
  }

  if (allTours?.some((tour) => isTourCategory(tour, scorpioData, 'Tickets'))) {
    availableTypes.add(FILTER_TYPES.ENTRY_TICKETS);
  }

  if (allTours?.some((tour) => isDiscountedProduct(tour, scorpioData))) {
    availableTypes.add(FILTER_TYPES.DEALS);
  }

  return availableTypes;
};

export const filterTours = (
  tours: TTour[],
  predicate: (tour: TTour) => boolean
) => {
  return tours.reduce(
    (acc, tour) => {
      if (predicate(tour)) {
        acc.filteredTours.push(tour);
      } else {
        acc.filteredOutTours.push(tour);
      }
      return acc;
    },
    {
      filteredOutTours: [] as TTour[],
      filteredTours: [] as TTour[],
    }
  );
};

export const filterToursByPOIFilter = (
  tours: TTour[],
  poiFilter: TPOIFilterType | null,
  scorpioData: Record<string, TScorpioData>
) => {
  switch (poiFilter) {
    case FILTER_TYPES.GUIDED_TOURS:
      return filterTours(tours, (tour) =>
        isTourCategory(tour, scorpioData, 'Guided Tours')
      );
    case FILTER_TYPES.ENTRY_TICKETS:
      return filterTours(tours, (tour) =>
        isTourCategory(tour, scorpioData, 'Tickets')
      );
    case FILTER_TYPES.DEALS:
      return filterTours(tours, (tour) =>
        isDiscountedProduct(tour, scorpioData)
      );
    default:
      return {
        filteredTours: tours,
        filteredOutTours: [] as TTour[],
      };
  }
};

export function scrollParentToChildInline(
  parent: HTMLElement,
  child: HTMLElement
) {
  const parentRect = parent.getBoundingClientRect();

  const parentViewableArea = {
    height: parent.clientHeight,
    width: parent.clientWidth,
  };

  const childRect = child.getBoundingClientRect();

  const isViewable =
    childRect.left >= parentRect.left &&
    childRect.right <= parentRect.left + parentViewableArea.width;

  const offset = 20;

  if (!isViewable) {
    const scrollLeft = childRect.left - parentRect.left;
    const scrollRight = childRect.right - parentRect.right;
    if (Math.abs(scrollLeft) < Math.abs(scrollRight)) {
      // Near the left of the list
      parent.scrollTo({
        left: parent.scrollLeft + scrollLeft - offset,
        behavior: 'smooth',
      });
    } else {
      // Near the right of the list
      parent.scrollTo({
        left: parent.scrollLeft + scrollRight + offset,
        behavior: 'smooth',
      });
    }
  }
}

export const scrollToProductsContainerTop = (isMobile: boolean) => {
  const productsSection = document.getElementById('products-container');

  if (!productsSection) return;

  window.scrollTo({
    top: productsSection?.offsetTop - (isMobile ? 121 : 118),
    behavior: 'smooth',
  });
};

export const isJustOneFilter = (existingFilterTypes: Set<TPOIFilterType>) => {
  return existingFilterTypes.size === 1;
};

export const hasLessThanThreeTours = (inventoryFilteredTours: TTour[]) => {
  return inventoryFilteredTours.length < 3;
};

export const hasFiltersAndAllToursSatisfyAllFilters = (
  inventoryFilteredTours: TTour[],
  existingFilterTypes: Set<TPOIFilterType>,
  scorpioData: Record<string, TScorpioData>
) => {
  return inventoryFilteredTours.every((tour) => {
    return Array.from(existingFilterTypes).every((filter) => {
      switch (filter) {
        case FILTER_TYPES.DEALS:
          return isDiscountedProduct(tour, scorpioData);
        case FILTER_TYPES.GUIDED_TOURS:
          return isTourCategory(tour, scorpioData, 'Guided Tours');
        case FILTER_TYPES.ENTRY_TICKETS:
          return isTourCategory(tour, scorpioData, 'Tickets');
        default:
          return false;
      }
    });
  });
};

export const shouldShowFilters = ({
  existingFilterTypes,
  allTours,
  scorpioData,
  inventoryFilteredTours,
  isTourListFiltered,
}: {
  existingFilterTypes: Set<TPOIFilterType>;
  allTours: TTour[];
  scorpioData: Record<string, TScorpioData>;
  inventoryFilteredTours: TTour[];
  isTourListFiltered: boolean;
}) => {
  const shouldNotHaveShownFiltersOnUnfilteredTours =
    isJustOneFilter(existingFilterTypes) ||
    hasLessThanThreeTours(allTours) ||
    hasFiltersAndAllToursSatisfyAllFilters(
      allTours,
      existingFilterTypes,
      scorpioData
    );

  const hideFiltersOnFilteredTours =
    isJustOneFilter(existingFilterTypes) ||
    hasLessThanThreeTours(inventoryFilteredTours) ||
    hasFiltersAndAllToursSatisfyAllFilters(
      inventoryFilteredTours,
      existingFilterTypes,
      scorpioData
    );

  if (isTourListFiltered) {
    if (shouldNotHaveShownFiltersOnUnfilteredTours) {
      return false;
    }
  } else {
    if (hideFiltersOnFilteredTours) {
      return false;
    }
  }

  return true;
};
