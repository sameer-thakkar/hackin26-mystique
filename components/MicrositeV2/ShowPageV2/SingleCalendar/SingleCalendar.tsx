import React, { useContext, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { Text } from '@headout/eevee';
import { css } from '@headout/pixie/css';
import { MBContext } from 'contexts/MBContext';
import { getLocalisedPrice } from 'utils/currency';
import { currencyAtom } from 'store/atoms/currency';
import { currencyListAtom } from 'store/atoms/currencyList';
import { RightArrowSvg } from 'assets/rightArrowSvg';
import { LoadingCalendar } from './LoadingCalendar';
import LSpan from './LSpan';
import { SingleCalendarDate } from './SingleCalendarDate';
import styles from './styles';
import { sendNextClickedEvent } from './utils';

const MonthScrollDir = { LEFT: -1, RIGHT: +1 };

interface SingleCalendarProps {
  inventoryListsMap?: Map<string, any[]>;
  medianPrice: number;
  selectedTourDate: string;
  onDateSelected: (
    date: string,
    price: number,
    type: string,
    isMinPrice: boolean
  ) => void;
  hidePrice: boolean;
  type: string;
  onMonthNavigated: (month: string) => void;
  showTimeList: boolean;
}

const SingleCalendar = ({
  inventoryListsMap,
  medianPrice,
  selectedTourDate,
  onDateSelected,
  hidePrice,
  type,
  onMonthNavigated,
  showTimeList,
}: SingleCalendarProps) => {
  const months = [...(inventoryListsMap?.keys() ?? [])];
  const [currVisibleMonth, setCurrVisibleMonth] = useState<string>(months[0]);
  const [nextVisibleMonth, setNextVisibleMonth] = useState<string | null>(null);
  const currenciesMap = useRecoilValue(currencyListAtom);

  const currencyCode = useRecoilValue(currencyAtom);
  const { lang } = useContext(MBContext);

  const isSingleAvailability = () => {
    let availableCount = 0;

    inventoryListsMap?.forEach((month) => {
      month.forEach((item: any) => {
        if (item.isAvailable) {
          availableCount++;
        }
      });
    });

    return availableCount === 1;
  };

  const isSingleDateProduct =
    inventoryListsMap && inventoryListsMap.size === 1 && isSingleAvailability();

  const isPrevMonthDisabled =
    currVisibleMonth !== null && months.indexOf(currVisibleMonth) <= 0;
  const isNextMonthDisabled =
    currVisibleMonth !== null &&
    months.indexOf(currVisibleMonth) >= months.length - 1;

  const onMonthChange = (
    direction: typeof MonthScrollDir.LEFT | typeof MonthScrollDir.RIGHT
  ) => {
    const currIndex = months.indexOf(currVisibleMonth);
    const nextIndex = nextVisibleMonth
      ? months.indexOf(nextVisibleMonth)
      : null;

    if (isPrevMonthDisabled && direction === MonthScrollDir.LEFT) {
      return;
    }
    if (isNextMonthDisabled && direction === MonthScrollDir.RIGHT) {
      return;
    }
    setCurrVisibleMonth(months[currIndex + direction]);
    setNextVisibleMonth(nextIndex ? months[nextIndex + direction] : null);
    onMonthNavigated?.(months[currIndex + direction]);
    sendNextClickedEvent(direction === MonthScrollDir.LEFT ? -1 : 1);
  };

  const getDaysDiv = () => {
    const dayInitials = dayjs.weekdaysShort();
    const divArray = dayInitials.map((day, index) => (
      <div className="day-wrapper" key={index}>
        <LSpan>{day}</LSpan>
      </div>
    ));
    return (
      <div className="day-list-container-dual-month">
        <div className="day-list">{divArray}</div>
      </div>
    );
  };

  const getSingleDateProductDate = () => {
    const inventory = [...(inventoryListsMap ?? new Map())]?.[0]?.[1];
    const availableInventory = inventory?.filter(
      (item: any) => item.isAvailable
    );

    const date = availableInventory?.[0]?.date ?? new Date();
    const day = availableInventory?.[0]?.day ?? dayjs(new Date()).format('ddd');
    return `${day}, ${dayjs(date).format('DD MMMM YYYY')}`;
  };

  useEffect(() => {
    const inventory = [...(inventoryListsMap ?? new Map())]?.[0]?.[1];
    const availableInventory = inventory?.filter(
      (item: any) => item.isAvailable
    );
    const selectedDate = availableInventory?.[0]?.date ?? new Date();
    if (isSingleDateProduct && selectedTourDate !== selectedDate) {
      onDateSelected(
        availableInventory?.[0]?.date ?? new Date(),
        availableInventory?.[0]?.price ?? 0,
        type,
        true
      );
    }
  }, [
    inventoryListsMap,
    isSingleDateProduct,
    onDateSelected,
    selectedTourDate,
    type,
  ]);

  const getMonthHeader = () => {
    if (isSingleDateProduct) {
      return (
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: 'space.6',
            margin: 'space.16',
            marginTop: 'space.20',
            marginBottom: 'space.4',
          })}
        >
          <Text textStyle="Semantics/UI Label/Small" color="core.grey.900">
            This show is only available on
          </Text>
          <Text
            textStyle="Semantics/UI Label/Large (Heavy)"
            color="core.grey.900"
            as="h2"
          >
            {getSingleDateProductDate()}
          </Text>
        </div>
      );
    }

    const leftButton = (
      <div
        className={styles.arrowButton}
        onClick={() => onMonthChange(MonthScrollDir.LEFT)}
        onMouseDown={(event) => {
          event.preventDefault();
        }}
        role="button"
        tabIndex={0}
        aria-label="Previous Month"
        aria-disabled={isPrevMonthDisabled}
      >
        <RightArrowSvg />
      </div>
    );
    const rightButton = (
      <div
        className={styles.arrowButton}
        onClick={() => onMonthChange(MonthScrollDir.RIGHT)}
        onMouseDown={(event) => {
          event.preventDefault();
        }}
        role="button"
        tabIndex={0}
        aria-label="Next Month"
        aria-disabled={isNextMonthDisabled}
      >
        <RightArrowSvg />
      </div>
    );
    return (
      <div className={styles.monthTitle}>
        <div>
          <span className="monthName first">{currVisibleMonth}</span>
        </div>
        <div className={styles.monthNavButtons}>
          {leftButton}
          {rightButton}
        </div>
      </div>
    );
  };

  const getDateComponents = () => (
    <div className={styles.dateComponentsWrapper}>
      {inventoryListsMap?.get(currVisibleMonth)?.map((invDetails: any) => {
        const { priceTag, date } = invDetails;
        const dateAsString = String(new Date(date).getUTCDate());
        const selectedDateAsString = String(selectedTourDate);
        const fullDateAsString = dayjs(date).format('YYYY-MM-DD');
        let displayPrice,
          isMinPriceDate = false;

        if (priceTag) {
          displayPrice = getLocalisedPrice({
            price: priceTag,
            currencyCode: currencyCode ?? 'USD',
            lang,
            currencyList: currenciesMap,
            truncateIfLong: true,
            truncateAfter: 5,
            removeCurrencyIfExceedsMaxLength: true,
          });

          isMinPriceDate = priceTag <= medianPrice;
        }

        return (
          <SingleCalendarDate
            isAvailable={invDetails.isAvailable}
            isEmpty={invDetails.isEmpty}
            key={invDetails.key}
            dateAsString={dateAsString}
            price={displayPrice}
            fullDate={fullDateAsString}
            isMinPrice={isMinPriceDate}
            onClick={() =>
              onDateSelected(fullDateAsString, priceTag, type, isMinPriceDate)
            }
            selectedDate={selectedDateAsString}
            hidePrice={hidePrice}
          />
        );
      })}
    </div>
  );

  const getFootNote = () => {
    if (!showTimeList) return null;
    return <div className={styles.styledFootNote}></div>;
  };

  const getCalendarHTML = () => (
    <div className={styles.calendarContainer}>
      <div className={styles.monthWrapper}>
        <div className={styles.topBar}>
          {getMonthHeader()}
          {isSingleDateProduct ? null : getDaysDiv()}
        </div>
        {isSingleDateProduct ? null : (
          <div className={styles.calendarBodyWrapper}>
            <div className={styles.calendarBody}>{getDateComponents()}</div>
          </div>
        )}
      </div>
    </div>
  );

  useEffect(() => {
    const months = [...(inventoryListsMap?.keys() ?? [])];

    if (selectedTourDate) {
      const currSelectedMonth = dayjs(selectedTourDate)
        .locale(lang)
        .format('MMMM YYYY');
      const selectedDateMonthIndex = months.indexOf(currSelectedMonth);
      let currMonthIndex =
        selectedDateMonthIndex >= 0 ? selectedDateMonthIndex : 0;
      let nextMonthIndex =
        currMonthIndex > months.length - 1 ? null : currMonthIndex + 1;
      //If users selects last month, show nextMonth as currentMonth
      if (nextMonthIndex === null && months.length > 1) {
        nextMonthIndex = currMonthIndex;
        currMonthIndex -= 1;
      }
      setCurrVisibleMonth(
        currMonthIndex !== null ? months[currMonthIndex] : months[0]
      );
      setNextVisibleMonth(
        nextMonthIndex !== null ? months[nextMonthIndex] : null
      );
    } else {
      setCurrVisibleMonth(months[0]);
      setNextVisibleMonth(months.length > 1 ? months[1] : null);
    }
  }, [selectedTourDate, inventoryListsMap, lang]);

  if (!currVisibleMonth) return <LoadingCalendar />;

  const getCalendarWrapper = () => (
    <div
      className={classNames(
        styles.calendarWrapper,
        showTimeList ? '' : styles.borderBottomRadius
      )}
    >
      {getCalendarHTML()}
      {getFootNote()}
    </div>
  );

  return getCalendarWrapper();
};

export default SingleCalendar;
