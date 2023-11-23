import { arrayMedian } from 'utils/arrayUtils';
import {
  addDays,
  getLastAndFirstDayOfMonthAndYear,
  getWeekdaysShort,
  localDateToJsDate,
} from 'utils/dateUtils';

export const getEmptyDates = (firstDate: any) =>
  Array.from(new Array(firstDate.getDay()), (_, index) => ({
    isDummy: false,
    isEmpty: true,
    isAvailable: false,
    date: null,
    day: null,
    priceTag: null,
    key: index,
  }));

export const getDesiredFullMonthDate = (monthDate: any, isLastDayDate: any) => {
  const dateAsArray = monthDate?.split('-'),
    month = dateAsArray?.[1],
    year = dateAsArray?.[0];
  return getLastAndFirstDayOfMonthAndYear(year, month, isLastDayDate);
};

export const getDaysDiv = (lang: string) => {
  const dayInitials = getWeekdaysShort(lang);
  const divArray = dayInitials.map((day) => (
    <div className="day-wrapper" key={day}>
      <span>{day}</span>
    </div>
  ));
  return <div className="day-list">{divArray}</div>;
};

export const getAllDates = (calendarData: Record<string, any>) => {
  let allDates = [];
  const { metadata } = calendarData || {};
  const { startDate: fromDateAsString, endDate: toDateAsString } =
    metadata || {};
  const firstDayOfMonthInventory = getDesiredFullMonthDate(
    fromDateAsString,
    false
  );
  const lastDayOfMonthInventory = getDesiredFullMonthDate(toDateAsString, true);
  const fromDate = localDateToJsDate(firstDayOfMonthInventory);
  const toDate = localDateToJsDate(lastDayOfMonthInventory);
  let curDate = addDays(fromDate, 0);

  while (curDate.getTime() <= (toDate as any).getTime()) {
    allDates.push(curDate);
    curDate = addDays(curDate, 1);
  }
  return allDates;
};

export const priceOf = (inventory: any) => {
  if (!inventory) return Number.MAX_SAFE_INTEGER;
  return inventory?.listingPrice;
};

export const getMedianPrice = (
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
