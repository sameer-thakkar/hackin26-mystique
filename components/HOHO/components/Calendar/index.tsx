import { useCallback, useContext, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import dayjs from 'dayjs';
import useSWR from 'swr';
import Conditional from 'components/common/Conditional';
import Modal from 'components/common/Modal';
import { CalendarProps } from 'components/HOHO/components/Calendar/interface';
import {
  CalendarBody,
  CalendarContainer,
  CalendarWrapper,
  DateComponentsWrapper,
  DateEl,
  MonthTitle,
  MonthWrapper,
  StyledFootNote,
  TopBar,
} from 'components/HOHO/components/Calendar/styles';
import {
  getAllDates,
  getDaysDiv,
  getEmptyDates,
  getMedianPrice,
} from 'components/HOHO/components/Calendar/utils';
import CalendarDatePrice from 'UI/CalendarDatePrice';
import { MBContext } from 'contexts/MBContext';
import { createBookingURL, genUniqueId } from 'utils';
import { trackEvent } from 'utils/analytics';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import {
  formatDate,
  formatInMonthTitleFormat,
  formatToDay,
} from 'utils/dateUtils';
import { currencyListAtom } from 'store/atoms/currencyList';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import ChevronRight from 'assets/chevronRight';

const Calendar: React.FC<CalendarProps> = (props) => {
  const {
    isMobile,
    tgid,
    currency,
    variantId,
    tourId,
    fromDate = null,
    toDate = null,
    isActive = false,
    onClickout,
    setIsLoading,
    variantName,
    tourGroupName,
  } = props;
  const {
    lang,
    nakedDomain,
    redirectToHeadoutBookingFlow,
    biLink,
    bookSubdomain,
  } = useContext(MBContext);

  const currencyList = useRecoilValue(currencyListAtom);
  const [currVisibleMonth, setCurrVisibleMonth] = useState(null);
  const [nextVisibleMonth, setNextVisibleMonth] = useState(null);
  const [minInventoryMap, setMinInventoryMap] = useState<Map<
    string,
    any
  > | null>(null);
  const medianPrice = getMedianPrice(minInventoryMap);
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

  let { data: calendarData } = useSWR(calendarEndpoint, {
    fetcher: swrFetcher,
  });
  if (calendarData) {
    setIsLoading(false);
  }

  const getMonthDateList = (month: any, allDates: any) => {
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
    const dateObjects = ([] as Array<Record<string, any>>).concat(emptyObjects);
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
  };

  const getDateLists = () => {
    const allDates = getAllDates(calendarData);
    const months = getDistinctMonths(allDates);
    const monthsMap = new Map();

    months.map((month) => {
      const datesList = getMonthDateList(month, allDates);
      if ((datesList as any).length > 0) monthsMap.set(month, datesList);
    });
    return monthsMap;
  };

  const getDistinctMonths = (dates: any) => {
    dates = dates.map((d: any) => formatInMonthTitleFormat(d, lang));
    dates = new Set(dates);
    return [...dates];
  };
  const computeMinInventoryMap = useCallback(() => {
    let { dates } = calendarData;
    let minInventoryMap = new Map(Object.entries(dates));
    setMinInventoryMap(minInventoryMap);
  }, [calendarData]);
  const inventoryListsMap = getDateLists();

  useEffect(() => {
    if (calendarData) {
      computeMinInventoryMap();
    }
  }, [computeMinInventoryMap, calendarData]);

  useEffect(() => {
    const months = [...inventoryListsMap.keys()];
    if (!currVisibleMonth) {
      setCurrVisibleMonth(months[0]);
      setNextVisibleMonth(months.length > 1 ? months[1] : null);
    }
  }, [inventoryListsMap, currVisibleMonth]);

  const onMonthChange = (direction: number, e: any) => {
    e?.stopPropagation();
    const months = [...inventoryListsMap.keys()];
    const currIndex = months.indexOf(currVisibleMonth),
      nextIndex = nextVisibleMonth ? months.indexOf(nextVisibleMonth) : null;
    if (currIndex < 0 || currIndex >= (months as Record<string, any>).size) {
      return;
    }
    setCurrVisibleMonth(months[currIndex + direction]);
    setNextVisibleMonth(nextIndex ? months[nextIndex + direction] : null);
  };

  const getMonthHeader = (isSecondMonth: any, showBothArrows?: boolean) => {
    const currMonthIndex = [...inventoryListsMap.keys()].indexOf(
      currVisibleMonth
    );

    const leftButton =
      !isSecondMonth || showBothArrows ? (
        <div
          className="chevron-icon scroll-left"
          onClick={(e) => onMonthChange(-1, e)}
          role="button"
          tabIndex={0}
          aria-label="Previous Month"
        >
          {ChevronRight({ fillColor: COLORS.GRAY.G3 })}
        </div>
      ) : null;

    const rightButton =
      isSecondMonth || showBothArrows ? (
        <div
          className="chevron-icon scroll-right"
          onClick={(e) => onMonthChange(+1, e)}
          role="button"
          tabIndex={0}
          aria-label="Next Month"
        >
          {ChevronRight({ fillColor: COLORS.GRAY.G3 })}
        </div>
      ) : null;

    const showRightButton = currMonthIndex >= inventoryListsMap.size - 2;

    return (
      <MonthTitle isSecondMonth={isSecondMonth}>
        {currMonthIndex <= 0 ? null : leftButton}
        <Conditional if={!isSecondMonth}>
          <span className="monthName first">{currVisibleMonth}</span>
        </Conditional>
        <Conditional if={nextVisibleMonth && isSecondMonth}>
          <span className="monthName second">{nextVisibleMonth}</span>
        </Conditional>
        {showRightButton ? null : rightButton}
      </MonthTitle>
    );
  };

  const onCheckAvailabilityClick = (
    date: string,
    priceTag: string | number
  ) => {
    if (!date || !priceTag) return;
    trackEvent({
      eventName: ANALYTICS_EVENTS.HOHO.CALENDAR_DATE_SELECTED,
      [ANALYTICS_PROPERTIES.VARIANT_ID]: variantId,
      [ANALYTICS_PROPERTIES.VARIANT_NAME]: variantName,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: tourGroupName,
      [ANALYTICS_PROPERTIES.SELECTED_DATE]: date,
    });
    window.open(
      createBookingURL({
        nakedDomain,
        lang,
        currency,
        tgid,
        variantId: String(variantId),
        tourId: String(tourId),
        date: { startDate: date, startTime: 'FLEXIBLE_START_TIME' },
        isMobile,
        redirectToHeadoutBookingFlow,
        biLink,
        bookSubdomain,
        showFullScreenPax: true,
      }),
      isMobile ? '_self' : '_blank',
      'noopener, noreferrer'
    );
  };

  const getDateComponents = ({
    isSecondMonth,
    monthName,
  }: {
    isSecondMonth?: boolean;
    monthName?: string;
  }) => {
    const finalMonth = isMobile
      ? monthName
      : isSecondMonth
      ? nextVisibleMonth
      : currVisibleMonth;
    return (
      <DateComponentsWrapper>
        {inventoryListsMap?.get(finalMonth)?.map((invDetails: any) => {
          const { priceTag, date } = invDetails;

          const dateAsString =
            date != null ? String(new Date(date).getUTCDate()) : '';

          return (
            <DateEl
              key={date || genUniqueId()}
              onClick={() => onCheckAvailabilityClick(date, priceTag)}
            >
              <CalendarDatePrice
                date={dateAsString}
                price={priceTag}
                currencyCode={currency || ''}
                className={
                  date === null
                    ? 'empty'
                    : !priceTag
                    ? 'unavailable'
                    : priceTag <= medianPrice
                    ? 'min-price'
                    : ''
                }
              />
            </DateEl>
          );
        })}
      </DateComponentsWrapper>
    );
  };

  const getCalendarHTML = () =>
    isMobile ? (
      <CalendarContainer>
        {[...inventoryListsMap.keys()]?.map((month) => {
          return (
            <MonthWrapper key={month}>
              <div className="month-name">{month}</div>
              <div className="calendar-body-wrapper">
                <CalendarBody isSingleMonthCalendar={false}>
                  {getDateComponents({ monthName: month })}
                </CalendarBody>
              </div>
            </MonthWrapper>
          );
        })}
      </CalendarContainer>
    ) : (
      <>
        <CalendarContainer>
          <MonthWrapper isSecondMonth={false}>
            <Conditional if={!isMobile}>
              <TopBar isSingleMonthCalendar={false}>
                <Conditional if={!isMobile}>
                  {getMonthHeader(false)}
                </Conditional>
                {getDaysDiv(lang)}
              </TopBar>
            </Conditional>
            <div className="calendar-body-wrapper">
              <CalendarBody isSingleMonthCalendar={false}>
                {getDateComponents({ isSecondMonth: false })}
              </CalendarBody>
            </div>
          </MonthWrapper>
          <MonthWrapper isSecondMonth={true}>
            <TopBar isSecondMonth={true}>
              <Conditional if={!isMobile}>{getMonthHeader(true)}</Conditional>
              {getDaysDiv(lang)}
            </TopBar>
            <div className="calendar-body-wrapper">
              <CalendarBody isSecondMonth={true}>
                {getDateComponents({ isSecondMonth: true })}
              </CalendarBody>
            </div>
          </MonthWrapper>
        </CalendarContainer>
      </>
    );

  const getFootNote = () => {
    const currencyObj = currencyList?.find((c) => c?.code === currency);
    const { currencyName, localSymbol } = currencyObj || {};

    return (
      <StyledFootNote>
        {strings.formatString(
          strings.HOHO.CALENDAR_FOOTNOTE,
          `${currencyName} (${localSymbol})`
        )}
      </StyledFootNote>
    );
  };

  return (
    <>
      <Conditional if={calendarData}>
        <Modal active={isActive} closeModal={onClickout}>
          <Conditional if={isMobile}>
            <TopBar isSingleMonthCalendar={false}>{getDaysDiv(lang)}</TopBar>
          </Conditional>
          <CalendarWrapper>
            <div>
              {getCalendarHTML()}
              {!isMobile && getFootNote()}
            </div>
          </CalendarWrapper>
          <Conditional if={isMobile}>{getFootNote()}</Conditional>
        </Modal>
      </Conditional>
    </>
  );
};
export default Calendar;
