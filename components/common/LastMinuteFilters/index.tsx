import React, { useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';
import useSWR from 'swr';
import CategoryFilterDrawer from 'components/common/CategoryFilterDrawer';
import Conditional from 'components/common/Conditional';
import Drawer from 'components/common/Drawer';
import Emoji from 'components/common/Emoji';
import {
  ILastMinuteFilters,
  TOnFilterChangeParams,
} from 'components/common/LastMinuteFilters/interface';
import {
  Counter,
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
import { getCategoryMap } from 'utils/productUtils';
import { currencyAtom } from 'store/atoms/currency';
import { hsidAtom } from 'store/atoms/hsid';
import { EXPERIMENT_NAMES, VARIANTS } from 'const/experiments';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';
import { strings } from 'const/strings';
import ChevronDown from 'assets/ChevrontDown';
import { CrossIconSvg } from 'assets/SvgIcons';
import Ticket from 'assets/ticket';

const LastMinuteFilters = (props: ILastMinuteFilters) => {
  const {
    orderedTours,
    setOrderedFilteredTours,
    setProductsLoading,
    categoryInfo,
    isProductCardPhase1ExpTreatment = false,
    changeTourListFilterStatus,
  } = props;
  const [showFilters, setShowFilters] = useState<boolean | null>(null);
  const [
    selectedDateTimeFilterButtonIndex,
    setSelectedDateTimeFilterButtonIndex,
  ] = useState(0);
  const [noAvailabilityDrawerOpen, setNoAvailabilityDrawerOpen] =
    useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [categoryStates, setCategoryStates] =
    useState<Record<number, boolean>>();
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

  const getCurrentCategoryNames = (
    categoriesAndSubCategories: ReturnType<
      typeof getCategoryMap
    >['categoriesAndSubCategories'],
    currentCategoryStates: Record<number, boolean>
  ) =>
    Object.keys(categoriesAndSubCategories)
      .filter((key) => currentCategoryStates[+key])
      .map((id) => categoriesAndSubCategories[+id].nonLocalizedName)
      .join(',');

  const onFilterChange = useCallback(
    (
      { categoryFilter, dateTimeFilter }: TOnFilterChangeParams = {
        categoryFilter: { categoryStates },
        dateTimeFilter: {
          clickedIndex: selectedDateTimeFilterButtonIndex,
          isUserAction: false,
          deSelect: false,
        },
      }
    ) => {
      let { clickedIndex, isUserAction, deSelect } = dateTimeFilter ?? {
        clickedIndex: selectedDateTimeFilterButtonIndex,
        isUserAction: false,
      };
      if (deSelect) {
        if (isProductCardPhase1ExpTreatment) clickedIndex = 0;
        else return;
      }

      let hasNoFilter = clickedIndex === 0;
      const selectedDateTimeFilter = dateTimeFilters[clickedIndex];

      const { categoryStates: localCategoryStates } = categoryFilter ?? {
        categoryStates,
      };
      const isCategoriesClear = !(
        localCategoryStates && Object.values(localCategoryStates).find((v) => v)
      );
      hasNoFilter = hasNoFilter && isCategoriesClear;

      const orderedFilteredTours = orderedTours.filter(({ tgid }) => {
        const isSelectedCategory =
          categoryInfo?.mapping[tgid]?.categoryId &&
          localCategoryStates?.[categoryInfo?.mapping[tgid]?.categoryId!];

        const isSelectedSubCategory =
          categoryInfo?.mapping[tgid]?.subCategoryId &&
          localCategoryStates?.[categoryInfo?.mapping[tgid]?.subCategoryId!];

        return (
          (isSelectedCategory || isSelectedSubCategory || isCategoriesClear) &&
          (!selectedDateTimeFilter.value ||
            inventoryData[tgid]?.dates?.[selectedDateTimeFilter.value])
        );
      });

      if (orderedFilteredTours.length) {
        const { query } = router;
        if (selectedDateTimeFilter.key === dateTimeFilters[0].key)
          delete query.selectedDate;
        else query.selectedDate = selectedDateTimeFilter.value!;
        if (isCategoriesClear) delete query.categories;
        else
          query.categories = Object.keys(localCategoryStates!)
            .filter((key) => localCategoryStates![Number(key)])
            .join(',');

        setSelectedDateTimeFilterButtonIndex(clickedIndex);
        setCategoryStates(localCategoryStates);
        changeTourListFilterStatus?.(!hasNoFilter);
        setToursWithDelay(isUserAction, orderedFilteredTours);

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

        if (isProductCardPhase1ExpTreatment) {
          if (isCategoriesClear)
            trackEvent({
              eventName: ANALYTICS_EVENTS.CATEGORY_FILTER_CLEARED,
              [ANALYTICS_PROPERTIES.CATEGORY]: getCurrentCategoryNames(
                categoryInfo!.categoriesAndSubCategories,
                localCategoryStates!
              ),
            });
          else
            trackEvent({
              eventName: ANALYTICS_EVENTS.CATEGORY_FILTER_APPLIED,
              [ANALYTICS_PROPERTIES.CATEGORY]: getCurrentCategoryNames(
                categoryInfo!.categoriesAndSubCategories,
                localCategoryStates
              ),
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
    [
      inventoryData,
      selectedDateTimeFilterButtonIndex,
      categoryStates,
      categoryInfo,
    ]
  );

  useEffect(() => {
    if (
      inventoryData &&
      categoryInfo?.categoriesAndSubCategories &&
      Object.keys(categoryInfo?.categoriesAndSubCategories).length
    ) {
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

      let categoryFilterParams:
        | { categoryStates: Record<number, boolean> }
        | undefined = undefined;
      const { categories } = router.query;
      const categoryList = categories ? (categories as string).split(',') : [];
      const obj: Record<number, boolean> = {};
      Object.keys(categoryInfo.categoriesAndSubCategories).forEach((key) => {
        obj[+key] = categoryList.includes(key) || false;
      });
      categoryFilterParams = { categoryStates: obj };

      onFilterChange({
        categoryFilter: categoryFilterParams,
        dateTimeFilter: dateFilterParams,
      });
    }
  }, [inventoryData, categoryInfo]);

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

  const isAnyCategorySelected = !!(
    categoryStates && Object.values(categoryStates).find((v) => v)
  );

  const clearCategoryFilter = () => {
    const obj: Record<number, boolean> = {};
    Object.keys(categoryInfo?.categoriesAndSubCategories ?? []).forEach(
      (key) => {
        obj[Number(key)] = false;
      }
    );
    onFilterChange({ categoryFilter: { categoryStates: obj } });
  };

  const openCategoryFilterDrawer = () => {
    setIsCategoryDrawerOpen(true);
    trackEvent({
      eventName: ANALYTICS_EVENTS.FILTER_DRAWER_OPENED,
      [ANALYTICS_PROPERTIES.FILTER_TYPE]: 'Category',
    });
  };

  const closeCategoryFilterDrawer = () => {
    setIsCategoryDrawerOpen(false);
  };

  if (showFilters === false || error) {
    return null;
  }
  // Experiment state is loading
  else if (showFilters === null || !data) {
    return (
      <SkeletonWrapper>
        {isProductCardPhase1ExpTreatment &&
          categoryInfo?.categoriesAndSubCategories &&
          categoryStates && (
            <Skeleton
              height="2rem"
              width="5rem"
              style={{ margin: '0 0.5rem 0.5rem', borderRadius: '1.5rem' }}
            />
          )}
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
            {isProductCardPhase1ExpTreatment &&
              categoryInfo?.categoriesAndSubCategories &&
              categoryStates && (
                <FilterButton
                  key={'category-selector'}
                  onClick={openCategoryFilterDrawer}
                  isSelected={isAnyCategorySelected}
                >
                  <Ticket className="ticket" />
                  <span>{strings.PC_EXP.CATEGORIES}</span>
                  <Counter>
                    <span className="counter-text">
                      {
                        Object.keys(categoryStates).filter(
                          (id) => categoryStates[Number(id)]
                        ).length
                      }
                    </span>
                  </Counter>
                  <ChevronDown className="chevron" />
                </FilterButton>
              )}
            {dateTimeFilters.map((filter, index) =>
              index === 0 && isProductCardPhase1ExpTreatment ? null : (
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
                  <Conditional if={isProductCardPhase1ExpTreatment}>
                    <CrossIconSvg className="cross" />
                  </Conditional>
                </FilterButton>
              )
            )}
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
      <Conditional if={isCategoryDrawerOpen && categoryInfo && categoryStates}>
        <CategoryFilterDrawer
          categoriesAndSubCategories={categoryInfo!.categoriesAndSubCategories}
          categoryStates={categoryStates!}
          onApply={(state) =>
            onFilterChange({ categoryFilter: { categoryStates: state } })
          }
          onClear={clearCategoryFilter}
          onClose={closeCategoryFilterDrawer}
        />
      </Conditional>
    </>
  );
};

export default LastMinuteFilters;
