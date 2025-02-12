import React, { useRef, useState } from 'react';
import SortFilters from 'components/CatAndSubCatPage/SubCategoryCards/SortFilters';
import {
  SortSelectorProps,
  TSortingOrders,
} from 'components/CatAndSubCatPage/SubCategoryCards/SortSelector/interface';
import {
  DrawerContentWrapper,
  DrawerControls,
  DrawerFilters,
  drawerStyles,
  drawerWrapperStyles,
  SelectorDropdown,
  SelectorFilter,
  SortSelectorContainer,
} from 'components/CatAndSubCatPage/SubCategoryCards/SortSelector/styles';
import Conditional from 'components/common/Conditional';
import Drawer from 'components/common/Drawer';
import RadioList from 'components/common/RadioList';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { trackEvent } from 'utils/analytics';
import { PRICING } from 'const/catAndSubcatPage';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import ChevronDown from 'assets/chevronDown';
import ReversibleArrow from 'assets/reversibleArrow';

const SortSelector: React.FC<React.PropsWithChildren<SortSelectorProps>> = (
  props
) => {
  const { sortingOrder, setSortingOrder, isMobile } = props;
  const sortingOptions: Array<{
    label: string;
    value: TSortingOrders;
  }> = [
    { label: strings.POPULARITY, value: 'popularity' },
    { label: strings.CAT_SUBCAT_PAGE.PRICE_LOW_HIGH, value: 'ascending' },
    { label: strings.CAT_SUBCAT_PAGE.PRICE_HIGH_LOW, value: 'descending' },
  ];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  const handleDropdownOpen = () => {
    setIsDropdownOpen((prevState) => {
      if (prevState === false) {
        trackEvent({
          eventName: ANALYTICS_EVENTS.CAT_SUBCAT_PAGE.SORT_BY_CLICKED,
          [ANALYTICS_PROPERTIES.SORT_BY]: PRICING,
        });
      }

      return !prevState;
    });
  };

  useCaptureClickOutside(
    dropdownRef,
    () => {
      setIsDropdownOpen(false);
    },
    [selectorRef]
  );

  return (
    <SortSelectorContainer>
      <SelectorFilter
        onClick={handleDropdownOpen}
        onBlur={() => setIsDropdownOpen(false)}
        ref={selectorRef}
        $isDropdownOpen={isDropdownOpen}
      >
        <span className="arrow-icon">
          <ReversibleArrow />
        </span>
        <Conditional if={!isMobile}>
          {`${strings.SORT_BY}: `}
          {sortingOrder === 'popularity'
            ? strings.POPULARITY
            : sortingOrder === 'ascending'
            ? strings.CAT_SUBCAT_PAGE.PRICE_LOW_HIGH
            : strings.CAT_SUBCAT_PAGE.PRICE_HIGH_LOW}
          <span className="chevron-icon">
            <ChevronDown />
          </span>
        </Conditional>
      </SelectorFilter>
      <Conditional if={isDropdownOpen && !isMobile}>
        <SelectorDropdown ref={dropdownRef}>
          <SortFilters
            filters={sortingOptions}
            onChange={(item) => {
              setSortingOrder(item.value);
              setIsDropdownOpen(false);
            }}
            currentValue={sortingOrder}
          />
        </SelectorDropdown>
      </Conditional>
      <Conditional if={isDropdownOpen && isMobile}>
        <Drawer
          $drawerStyles={drawerStyles}
          $drawerWrapperStyles={drawerWrapperStyles}
          closeHandler={() => setIsDropdownOpen(false)}
          heading={strings.CAT_SUBCAT_PAGE.FILTERS}
          noMargin
        >
          <DrawerContentWrapper>
            <DrawerFilters>
              <RadioList
                onChange={(args) =>
                  setSortingOrder(args.value as TSortingOrders)
                }
                currentValue={sortingOrder}
                items={sortingOptions}
                isCatOrSubCatPage={true}
              />
            </DrawerFilters>
            <DrawerControls>
              <button
                className="reset"
                onClick={() => {
                  setSortingOrder('popularity');
                  setIsDropdownOpen(false);
                }}
              >
                {strings.CAT_SUBCAT_PAGE.RESET}
              </button>
              <button
                className="apply"
                onClick={() => setIsDropdownOpen(false)}
              >
                {strings.CAT_SUBCAT_PAGE.APPLY}
              </button>
            </DrawerControls>
          </DrawerContentWrapper>
        </Drawer>
      </Conditional>
    </SortSelectorContainer>
  );
};

export default SortSelector;
