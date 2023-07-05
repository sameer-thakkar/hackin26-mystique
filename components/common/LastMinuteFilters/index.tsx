import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { HeadoutEndpoints, getHeadoutApiUrl, swrFetcher } from 'utils/apiUtils';
import { addDays, formatDateToString } from 'utils/dateUtils';
import Button from 'UI/Button';
import { useRouter } from 'next/router';
import { getABTestingVariant } from 'utils/experiments/experimentUtils';
import { EXPERIMENT_NAMES, VARIANTS } from 'const/experiments';
import { useRecoilState } from 'recoil';
import { hsidAtom } from 'store/atoms/hsid';
import Skeleton from 'react-loading-skeleton';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';
import { strings } from 'const/strings';

import Conditional from '../Conditional';
import Drawer from '../Drawer';
import Emoji from '../Emoji';
import {
  FilterButton,
  FiltersContainer,
  FiltersWrapper,
  drawerStyles,
  Footer,
  DrawerBody,
  SkeletonWrapper,
} from './styles';
import { ILastMinuteFilters } from './interface';

const LastMinuteFilters = (props: ILastMinuteFilters) => {
  const { orderedTours, setOrderedFilteredTours, setProductsLoading } = props;
  const [showFilters, setShowFilters] = useState<boolean | null>(null);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);
  const [noAvailabilityDrawerOpen, setNoAvailabilityDrawerOpen] = useState(
    false
  );
  const router = useRouter();
  const selectedDate = router.query?.selectedDate;
  const orderedTgids = orderedTours?.map((tour: any) => tour.tgid) ?? [];

  const filters = [
    {
      key: 'all_dates',
      display_name: strings.ALL_DATES,
      value: null,
    },
    {
      key: 'today',
      display_name: strings.TODAY,
      value: formatDateToString(new Date(), 'en', 'YYYY-MM-DD'),
    },
    {
      key: 'tomorrow',
      display_name: strings.TOMORROW,
      value: formatDateToString(addDays(new Date(), 1), 'en', 'YYYY-MM-DD'),
    },
  ];

  const [hsid] = useRecoilState(hsidAtom);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (hsid) {
      const showLastMinuteFilters =
        getABTestingVariant(
          EXPERIMENT_NAMES.LAST_MINUTE_FILTERS_EXPERIMENT,
          hsid
        ) === VARIANTS.TREATMENT;
      setShowFilters(showLastMinuteFilters);
    } else {
      timerId = setTimeout(() => setShowFilters(true), 2000);
    }
    return () => clearTimeout(timerId);
  }, [hsid]);
  const inventoryEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.CalendarInventoryForTourGroupList,
    params: {
      'tour-group-ids': orderedTgids.join(','),
      'from-date': filters.filter((item) => item.key === 'today')[0].value!,
      'to-date': filters.filter((item) => item.key === 'tomorrow')[0].value!,
    },
    id: '',
  });
  let { data, error } = useSWR(inventoryEndpoint, {
    fetcher: swrFetcher,
  });
  let inventoryData = data?.data;
  useEffect(() => {
    if (selectedDate && inventoryData) {
      const selectedFilterIndex = filters.findIndex(
        (item) => item.value === selectedDate
      );
      if (
        selectedFilterIndex > -1 &&
        selectedFilterIndex !== selectedButtonIndex
      ) {
        changeFilterHandler(selectedFilterIndex, false);
      }
    }
  }, [selectedDate, inventoryData]);

  let handleScroll: any;
  const elRef = useCallback((filtersRef) => {
    if (filtersRef !== null) {
      handleScroll = () => {
        if (window.pageYOffset + 1 >= filtersRef.offsetTop) {
          filtersRef.classList.add('sticky');
        } else {
          filtersRef.classList.remove('sticky');
        }
      };
      window.addEventListener('scroll', handleScroll);
    }
  }, []);

  let productsLoadingTimer: NodeJS.Timeout | null = null;
  useEffect(() => {
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (productsLoadingTimer) {
        clearTimeout(productsLoadingTimer!);
      }
    };
  }, []);

  const viewAllDatesHandler = () => {
    changeFilterHandler(0, true);
    setNoAvailabilityDrawerOpen(false);
    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.VIEW_ALL_DATES,
    });
  };

  const setToursWithDelay = (isUserAction: boolean, tours: any[]) => {
    // Filters data is already loaded but to give sense of
    // a false load we have added a delay
    if (isUserAction) {
      setProductsLoading(true);
      setOrderedFilteredTours(tours);
      productsLoadingTimer = setTimeout(() => {
        setProductsLoading(false);
      }, 1500);
    }
  };

  const changeFilterHandler = (clickedIndex: number, isUserAction: boolean) => {
    const selectedFilter = filters[clickedIndex];
    const orderedFilteredTours = orderedTours.filter((tour) => {
      if (selectedFilter.value != null) {
        return inventoryData[tour.tgid]?.dates?.[selectedFilter.value!];
      }
      return true;
    });
    if (selectedFilter.key === 'all_dates') {
      setToursWithDelay(isUserAction, orderedTours);
      setSelectedButtonIndex(clickedIndex);
      const newQuery = { ...router.query };
      delete newQuery.selectedDate;
      router.replace(
        {
          query: newQuery,
        },
        undefined,
        {
          shallow: true,
        }
      );
    } else {
      if (orderedFilteredTours.length) {
        setToursWithDelay(isUserAction, orderedFilteredTours);
        setSelectedButtonIndex(clickedIndex);
        router.replace(
          {
            query: { ...router.query, selectedDate: selectedFilter.value },
          },
          undefined,
          {
            shallow: true,
          }
        );
      } else {
        setNoAvailabilityDrawerOpen(true);
        trackEvent({
          eventName: ANALYTICS_EVENTS.DATE_UNAVAILABLE_DRAWER_VIEWED,
          [ANALYTICS_PROPERTIES.DATE_RANGE_SELECTED]: selectedFilter.key,
        });
      }
    }
    trackEvent({
      eventName: ANALYTICS_EVENTS.DATE_FILTER_APPLIED,
      [ANALYTICS_PROPERTIES.DATE_RANGE_SELECTED]: selectedFilter.key,
      [ANALYTICS_PROPERTIES.EXPERIENCES_AVAILABLE]: orderedFilteredTours.length,
      [ANALYTICS_PROPERTIES.TRIGGERED_BY]: isUserAction ? 'User' : 'Automatic',
    });
  };
  if (showFilters === false || error) {
    return null;
  }
  // Experiment state is loading
  else if (showFilters === null || !data) {
    return (
      <SkeletonWrapper>
        {filters.map((_filter, index) => (
          <Skeleton
            height="2.5rem"
            key={index}
            width="5rem"
            style={{ margin: '0 0.5rem', borderRadius: '1.5rem' }}
          />
        ))}
      </SkeletonWrapper>
    );
  }
  return (
    <>
      <FiltersWrapper ref={elRef}>
        <FiltersContainer>
          {inventoryData &&
            filters.map((filter, index) => (
              <FilterButton
                key={index}
                onClick={() => changeFilterHandler(index, true)}
                isSelected={index === selectedButtonIndex}
              >
                {filter.display_name}
              </FilterButton>
            ))}
        </FiltersContainer>
      </FiltersWrapper>
      <Conditional if={noAvailabilityDrawerOpen}>
        <Drawer
          $drawerStyles={drawerStyles}
          noMargin
          className="no-availability__drawer"
          closeHandler={() => setNoAvailabilityDrawerOpen(false)}
          heading={strings.INVENTORY_UNAVAILABLE.HEADING}
        >
          <DrawerBody>
            {strings.INVENTORY_UNAVAILABLE.MESSAGE}
            <Emoji symbol="😀" label="grinning-face"></Emoji>
          </DrawerBody>
          <Footer>
            <Button
              onClick={viewAllDatesHandler}
              fillType="fill"
              widthProp="100%"
            >
              {strings.INVENTORY_UNAVAILABLE.CTA}
            </Button>
          </Footer>
        </Drawer>
      </Conditional>
    </>
  );
};

export default LastMinuteFilters;
