import React, { useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';
import useSWR from 'swr';
import Conditional from 'components/common/Conditional';
import Drawer from 'components/common/Drawer';
import Emoji from 'components/common/Emoji';
import {
  ILastMinuteFilters,
  TOnFilterChangeParams,
} from 'components/common/LastMinuteFilters/interface';
import {
  DrawerBody,
  drawerStyles,
  FilterButton,
  FiltersContainer,
  FiltersWrapper,
  Footer,
  SkeletonWrapper,
} from 'components/common/LastMinuteFilters/styles';
import Button from 'UI/Button';
import { trackEvent } from 'utils/analytics';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { addDays, formatDateToString } from 'utils/dateUtils';
import { getABTestingVariant } from 'utils/experiments/experimentUtils';
import { currencyAtom } from 'store/atoms/currency';
import { hsidAtom } from 'store/atoms/hsid';
import { EXPERIMENT_NAMES, VARIANTS } from 'const/experiments';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';
import { strings } from 'const/strings';

const LastMinuteFilters = (props: ILastMinuteFilters) => {
  const {
    orderedTours,
    setOrderedFilteredTours,
    setProductsLoading,
    changeTourListFilterStatus,
  } = props;
  const [showFilters, setShowFilters] = useState<boolean | null>(null);
  const [
    selectedDateTimeFilterButtonIndex,
    setSelectedDateTimeFilterButtonIndex,
  ] = useState(0);
  const [noAvailabilityDrawerOpen, setNoAvailabilityDrawerOpen] =
    useState(false);
  const router = useRouter();
  const selectedDate = router.query?.selectedDate;
  const orderedTgids = orderedTours?.map((tour: any) => tour.tgid) ?? [];

  const currency = useRecoilValue(currencyAtom);

  const dateTimeFilters = [
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
        getABTestingVariant({
          expName: EXPERIMENT_NAMES.LAST_MINUTE_FILTERS_EXPERIMENT,
          hsid,
          noTrack: true,
        }) === VARIANTS.TREATMENT;
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
      'from-date': dateTimeFilters.filter((item) => item.key === 'today')[0]
        .value!,
      'to-date': dateTimeFilters.filter((item) => item.key === 'tomorrow')[0]
        .value!,
      ...(currency && {
        currency,
      }),
    },
    id: '',
  });

  let { data, error } = useSWR(inventoryEndpoint, {
    fetcher: swrFetcher,
  });
  let inventoryData = data?.data;

  const onFilterChange = useCallback(
    (
      { dateTimeFilter }: TOnFilterChangeParams = {
        dateTimeFilter: {
          clickedIndex: selectedDateTimeFilterButtonIndex,
          isUserAction: false,
        },
      }
    ) => {
      let { clickedIndex, isUserAction } = dateTimeFilter ?? {
        clickedIndex: selectedDateTimeFilterButtonIndex,
        isUserAction: false,
      };

      let hasNoFilter = clickedIndex === 0;
      const selectedDateTimeFilter = dateTimeFilters[clickedIndex];

      const orderedFilteredTours = orderedTours.filter(({ tgid }) => {
        return (
          !selectedDateTimeFilter.value ||
          inventoryData[tgid]?.dates?.[selectedDateTimeFilter.value]
        );
      });

      if (orderedFilteredTours.length) {
        const { query } = router;
        if (selectedDateTimeFilter.key === dateTimeFilters[0].key)
          delete query.selectedDate;
        else query.selectedDate = selectedDateTimeFilter.value!;

        setSelectedDateTimeFilterButtonIndex(clickedIndex);
        changeTourListFilterStatus?.(!hasNoFilter);
        setToursWithDelay(isUserAction, orderedFilteredTours);

        if (clickedIndex || isUserAction) {
          trackEvent({
            eventName: ANALYTICS_EVENTS.DATE_FILTER_APPLIED,
            [ANALYTICS_PROPERTIES.DATE_RANGE_SELECTED]:
              selectedDateTimeFilter.key,
            [ANALYTICS_PROPERTIES.EXPERIENCES_AVAILABLE]:
              orderedFilteredTours.length,
            [ANALYTICS_PROPERTIES.TRIGGERED_BY]: isUserAction
              ? 'User'
              : 'Automatic',
          });
        }

        router.replace(
          {
            query,
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
          [ANALYTICS_PROPERTIES.DATE_RANGE_SELECTED]:
            selectedDateTimeFilter.key,
        });
      }
    },
    [inventoryData, selectedDateTimeFilterButtonIndex]
  );

  useEffect(() => {
    if (inventoryData) {
      let dateFilterParams:
        | { clickedIndex: number; isUserAction: boolean }
        | undefined = undefined;
      if (selectedDate) {
        const selectedFilterIndex = dateTimeFilters.findIndex(
          (item) => item.value === selectedDate
        );
        if (
          selectedFilterIndex > -1 &&
          selectedFilterIndex !== selectedDateTimeFilterButtonIndex
        ) {
          dateFilterParams = {
            clickedIndex: selectedFilterIndex,
            isUserAction: false,
          };
        }
      }

      onFilterChange({
        dateTimeFilter: dateFilterParams,
      });
    }
  }, [inventoryData]);

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
    onFilterChange({ dateTimeFilter: { clickedIndex: 0, isUserAction: true } });
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
    } else {
      setOrderedFilteredTours(tours);
    }
  };

  if (showFilters === false || error) {
    return null;
  }
  // Experiment state is loading
  else if (showFilters === null || !data) {
    return (
      <SkeletonWrapper>
        {dateTimeFilters.map((_filter, index) => (
          <Skeleton
            height="2rem"
            key={index}
            width="5rem"
            style={{ margin: '0 0.5rem 0.5rem', borderRadius: '1.5rem' }}
          />
        ))}
      </SkeletonWrapper>
    );
  }

  return (
    <>
      <FiltersWrapper ref={elRef}>
        {inventoryData && (
          <FiltersContainer>
            {dateTimeFilters.map((filter, index) => (
              <FilterButton
                key={index}
                onClick={() =>
                  onFilterChange({
                    dateTimeFilter: {
                      clickedIndex: index,
                      isUserAction: true,
                      deSelect: index === selectedDateTimeFilterButtonIndex,
                    },
                  })
                }
                isSelected={index === selectedDateTimeFilterButtonIndex}
              >
                <span>{filter.display_name}</span>
              </FilterButton>
            ))}
          </FiltersContainer>
        )}
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
