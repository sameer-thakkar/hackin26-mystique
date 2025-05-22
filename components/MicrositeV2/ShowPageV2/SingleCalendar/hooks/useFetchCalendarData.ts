import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import dayjs from 'dayjs';
import useSWR from 'swr';
import { MBContext } from 'contexts/MBContext';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { arrayMedian } from 'utils/arrayUtils';
import {
  addDays,
  formatDate,
  formatInMonthTitleFormat,
  formatToDay,
  getLastAndFirstDayOfMonthAndYear,
  localDateToJsDate,
  sortDateArray,
} from 'utils/dateUtils';
import { calendarDataAtom } from 'store/atoms/calendar';

interface UseFetchCalendarDataProps {
  tgid: string;
  fromDate?: string;
  toDate?: string;
  variantId?: string;
  currency: string | null;
  setIsLoading: (isLoading: boolean) => void;
  setSelectedTourDate: (selectedTourDate: string) => void;
  setTourStartDate: (tourStartDate: string) => void;
  isShowPageExperiment: boolean;
  defaultSelectedDate: string;
}

export const useFetchCalendarData = ({
  tgid,
  fromDate,
  toDate,
  variantId,
  currency,
  setIsLoading,
  setSelectedTourDate,
  setTourStartDate,
  isShowPageExperiment,
  defaultSelectedDate,
}: UseFetchCalendarDataProps) => {
  const { lang } = useContext(MBContext);
  const [minInventoryMap, setMinInventoryMap] = useState<Map<
    string,
    any
  > | null>(null);
  const setCalendarData = useSetRecoilState(calendarDataAtom);

  const { calendarData: calendarDataInStore } =
    useRecoilValue(calendarDataAtom);

  const calendarEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.CalendarInventory,
    id: tgid,
    params: {
      ...(fromDate && {
        'from-date': fromDate,
      }),
      ...(toDate && {
        'to-date': toDate,
      }),
      ...(variantId && {
        variantId: variantId?.toString(),
      }),
      ...(currency && {
        currency,
      }),
    },
  });

  let { data: calendarData, isValidating } = useSWR(
    !isShowPageExperiment || calendarDataInStore ? null : calendarEndpoint,
    {
      fetcher: swrFetcher,
      onSuccess: (data) => {
        if (data) {
          setCalendarData({
            calendarData: data,
          });
          setIsLoading(false);
        }
      },
    }
  );

  if (calendarDataInStore) {
    calendarData = calendarDataInStore;
  }

  const getEmptyDates = (firstDate: any) =>
    Array.from(new Array(firstDate.getDay()), (_, index) => ({
      isDummy: false,
      isEmpty: true,
      isAvailable: false,
      date: null,
      day: null,
      priceTag: null,
      key: index,
    }));

  const getDesiredFullMonthDate = (monthDate: any, isLastDayDate: any) => {
    const dateAsArray = monthDate?.split('-'),
      month = dateAsArray?.[1],
      year = dateAsArray?.[0];
    return getLastAndFirstDayOfMonthAndYear(year, month, isLastDayDate);
  };

  const getAllDates = useCallback((calendarData: Record<string, any>) => {
    let allDates = [];
    const { metadata } = calendarData || {};
    const { startDate: fromDateAsString, endDate: toDateAsString } =
      metadata || {};
    const firstDayOfMonthInventory = getDesiredFullMonthDate(
      fromDateAsString,
      false
    );
    const lastDayOfMonthInventory = getDesiredFullMonthDate(
      toDateAsString,
      true
    );
    const fromDate = localDateToJsDate(firstDayOfMonthInventory);
    const toDate = localDateToJsDate(lastDayOfMonthInventory);
    let curDate = addDays(fromDate, 0);

    while (curDate.getTime() <= (toDate as any).getTime()) {
      allDates.push(curDate);
      curDate = addDays(curDate, 1);
    }
    return allDates;
  }, []);

  const priceOf = (inventory: any) => {
    if (!inventory) return Number.MAX_SAFE_INTEGER;
    return inventory?.listingPrice;
  };

  const getMedianPrice = (
    minInventoryMap: Map<string, Record<string, any>> | null
  ) => {
    const priceList = new Set();
    minInventoryMap?.forEach((inv) => {
      const price = priceOf(inv);
      priceList.add(price);
    });
    let median = arrayMedian([...priceList]);

    if (priceList.size === 1) median -= 1;
    return median;
  };

  const getDistinctMonths = useCallback(
    (dates: any) => {
      dates = dates.map((d: any) => formatInMonthTitleFormat(d, lang));
      dates = new Set(dates);
      return [...dates];
    },
    [lang]
  );

  const getMonthDateList = useCallback(
    (month: any, allDates: any) => {
      const monthDates = allDates.filter(
        (x: any) => formatInMonthTitleFormat(x, lang) === month
      );

      let offsetDates = 0;
      monthDates.forEach((date: any) => {
        const dateString = formatDate(date, 'YYYY-MM-DD');
        const minInventory = (minInventoryMap as any)?.get(dateString);
        if (!minInventory) offsetDates++;
      });

      const monthDatesToShow =
        offsetDates === monthDates.length
          ? monthDates.slice(offsetDates)
          : monthDates;
      const emptyObjects = monthDatesToShow[0]
        ? getEmptyDates(monthDatesToShow[0])
        : [];
      const dateObjects = ([] as Array<Record<string, any>>).concat(
        emptyObjects
      );
      const datePriceList = [...dateObjects];

      monthDatesToShow.forEach((date: any, index: any) => {
        const dateString = formatDate(date, 'YYYY-MM-DD');
        const priceTag = calendarData?.dates?.[dateString]?.listingPrice;

        const key = index + emptyObjects.length;
        const day = formatToDay(dayjs(date));
        datePriceList.push({
          isDummy: false,
          isEmpty: false,
          date: dateString,
          day,
          isAvailable: !!priceTag,
          priceTag,
          key,
        });
      });

      return monthDatesToShow.length === 0 ? new Map() : datePriceList;
    },
    [calendarData?.dates, lang, minInventoryMap]
  );

  const getDateLists = useCallback(() => {
    const allDates = getAllDates(calendarData);
    const months = getDistinctMonths(allDates);
    const monthsMap = new Map();

    months.map((month) => {
      const datesList = getMonthDateList(month, allDates);
      if ((datesList as any).length > 0) monthsMap.set(month, datesList);
    });
    return monthsMap;
  }, [calendarData, getAllDates, getDistinctMonths, getMonthDateList]);

  const computeMinInventoryMap = useCallback(() => {
    let { dates } = calendarData;
    let minInventoryMap = new Map(Object.entries(dates));
    setMinInventoryMap(minInventoryMap);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarData]);

  useEffect(() => {
    if (!isShowPageExperiment) return;

    if (calendarData) {
      computeMinInventoryMap();
    }
  }, [computeMinInventoryMap, calendarData, isShowPageExperiment]);

  useEffect(() => {
    if (!isShowPageExperiment) return;
    if (calendarData) {
      const { dates } = calendarData;
      const sortedInventoryDates = sortDateArray(Object.keys(dates) ?? []);
      const [firstAvailableDateStr] = sortedInventoryDates ?? [];

      if (defaultSelectedDate) {
        setSelectedTourDate(defaultSelectedDate);
        setTourStartDate(defaultSelectedDate);
      } else if (firstAvailableDateStr) {
        setSelectedTourDate(firstAvailableDateStr);
        setTourStartDate(firstAvailableDateStr);
      }

      setIsLoading(false);
    }
  }, [
    calendarData,
    defaultSelectedDate,
    setIsLoading,
    setSelectedTourDate,
    setTourStartDate,
    isShowPageExperiment,
  ]);

  const inventoryListsMap = useMemo(() => getDateLists(), [getDateLists]);

  if (!isShowPageExperiment) return {};

  const medianPrice = getMedianPrice(minInventoryMap);

  return {
    calendarData,
    isValidating,
    inventoryListsMap,
    medianPrice,
  };
};
