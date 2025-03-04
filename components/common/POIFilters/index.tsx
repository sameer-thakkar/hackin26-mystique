import { useContext, useEffect, useMemo } from 'react';
import { debounce, throttle } from '@headout/espeon/utils';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import { convertEngToSentenceCase } from 'utils/stringUtils';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import en from 'const/localization/en';
import { strings } from 'const/strings';
import { DealsSVG, GuidedToursIconSVG, TicketSVG } from 'assets/poiFilterSVGs';
import Conditional from '../Conditional';
import { FILTER_TYPES, TPOIFilterType } from './constant';
import { FilterPillButton } from './FilterPillButton';
import { TPOIFilterProps } from './interface';
import { filtersContainerStyles, separatorStyle } from './styles';
import {
  getAvailablePOIFilterTypes,
  scrollToProductsContainerTop,
  shouldShowFilters,
} from './utils';

export const POIFilters = ({
  isMobile,
  existingFilterTypes,
  activeFilter,
  setActiveFilter,
  inventoryFilteredTours,
  scorpioData,
  setProductsLoading,
  allTours,
  isTourListFiltered,
}: TPOIFilterProps) => {
  const availableFilterTypes = useMemo(
    () => getAvailablePOIFilterTypes(inventoryFilteredTours, scorpioData),
    [inventoryFilteredTours.length]
  );

  const { lang } = useContext(MBContext);

  useEffect(() => {
    if (!isMobile) return;
    const parent = document.getElementById('POI_FILTERS');

    const handleScroll = throttle(() => {
      if (parent) {
        const stickyTop = parseInt(window.getComputedStyle(parent).top, 10);
        const currentTop = parent.getBoundingClientRect().top;
        parent.classList.toggle('sticky', currentTop <= stickyTop + 1);
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;

    const parent = document.getElementById('POI_FILTERS');

    const handleScrollEnd = debounce(() => {
      // hack to remove sticky class when automatically scrolling to top
      if (parent && window.scrollY < 199) {
        parent.classList.remove('sticky');
      }
    }, 150);

    window.addEventListener('scroll', handleScrollEnd);

    return () => {
      window.removeEventListener('scroll', handleScrollEnd);
    };
  }, [isMobile]);

  const shouldRenderFilters = shouldShowFilters({
    existingFilterTypes,
    allTours,
    scorpioData,
    inventoryFilteredTours,
    isTourListFiltered,
  });

  if (!shouldRenderFilters) return null;

  const toggleFilter = (filterType: TPOIFilterType) => {
    setProductsLoading(true);

    if (activeFilter === filterType) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filterType);
      trackEvent({
        eventName: ANALYTICS_EVENTS.FILTER_APPLIED,
        [ANALYTICS_PROPERTIES.FILTER_TYPE]:
          filterType === 'GUIDED_TOURS'
            ? 'Guided Tours'
            : en.FILTERS[filterType],
      });
    }

    scrollToProductsContainerTop(isMobile);

    // Simulate loading state
    setTimeout(() => {
      setProductsLoading(false);
    }, 800);
  };

  return (
    <div className={filtersContainerStyles}>
      <div className={separatorStyle}></div>

      <Conditional if={existingFilterTypes.has(FILTER_TYPES.DEALS)}>
        <FilterPillButton
          icon={<DealsSVG />}
          text={strings.FILTERS.DEALS}
          isSelected={activeFilter === FILTER_TYPES.DEALS}
          onClick={() => {
            toggleFilter(FILTER_TYPES.DEALS);
          }}
          disabled={!availableFilterTypes.has(FILTER_TYPES.DEALS)}
        />
      </Conditional>

      <Conditional if={existingFilterTypes.has(FILTER_TYPES.GUIDED_TOURS)}>
        <FilterPillButton
          icon={<GuidedToursIconSVG />}
          text={convertEngToSentenceCase(
            lang,
            strings.CATEGORY_HEADER.GUIDED_TOURS
          )}
          isSelected={activeFilter === FILTER_TYPES.GUIDED_TOURS}
          onClick={() => {
            toggleFilter(FILTER_TYPES.GUIDED_TOURS);
          }}
          disabled={!availableFilterTypes.has(FILTER_TYPES.GUIDED_TOURS)}
        />
      </Conditional>

      <Conditional if={existingFilterTypes.has(FILTER_TYPES.ENTRY_TICKETS)}>
        <FilterPillButton
          icon={<TicketSVG />}
          text={strings.FILTERS.ENTRY_TICKETS}
          isSelected={activeFilter === FILTER_TYPES.ENTRY_TICKETS}
          onClick={() => {
            toggleFilter(FILTER_TYPES.ENTRY_TICKETS);
          }}
          disabled={!availableFilterTypes.has(FILTER_TYPES.ENTRY_TICKETS)}
        />
      </Conditional>
    </div>
  );
};
