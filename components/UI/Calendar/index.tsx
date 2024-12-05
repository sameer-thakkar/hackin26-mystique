import { useContext, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import dayjs, { Dayjs } from 'dayjs';
import locale from 'dayjs/locale/en';
import isTodayPlugin from 'dayjs/plugin/isToday';
import objectPlugin from 'dayjs/plugin/toObject';
import weekdayPlugin from 'dayjs/plugin/weekday';
import Button from '@headout/aer/src/atoms/Button';
import { getIntlTime } from '@headout/espeon/utils';
import Conditional from 'components/common/Conditional';
import Emoji from 'components/common/Emoji';
import Loader from 'components/common/Loader';
import { TCalendarProps } from 'components/UI/Calendar/interface';
import {
  BaseCalendarContainer,
  CalendarContentWrapper,
  CalendarPopup,
  CalendarTimeSlotSection,
  Cashback,
  DatesWrapper,
  Day,
  FootNote,
  HeaderContainer,
  MonthSwitcher,
  MonthSwitcherButton,
  MonthTitle,
  MwebHeader,
  PickDate,
  PriceForDay,
  PricingSection,
  SingleTimeSlotAvailableCard,
  TimeSlot,
  TimeSlotCard,
  TimingSection,
  TwoPartTimeSlot,
  UrgencyBooster,
  WeekDay,
  WeekdaysWrapper,
} from 'components/UI/Calendar/style';
import LocalisedPrice from 'UI/LPrice';
import { MBContext } from 'contexts/MBContext';
import { useHistoryTraversal } from 'hooks/useHistoryTraversal';
import { createBookingURL, getNakedDomain } from 'utils';
import { trackEvent } from 'utils/analytics';
import { arrayMedian } from 'utils/arrayUtils';
import { getLocalisedPrice, TCurrencyObj } from 'utils/currency';
import {
  generateAllMonthsBetween,
  generateDaysInMonth,
  generateDaysInTwoMonths,
} from 'utils/dateUtils';
import { getHostName } from 'utils/helper';
import { currencyAtom } from 'store/atoms/currency';
import { currencyListAtom } from 'store/atoms/currencyList';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  BUTTON_LOADING_DURATION,
  HARRY_POTTER_CURSED_CHILD_TGID,
} from 'const/index';
import { strings } from 'const/strings';
import BackArrow from 'assets/backArrow';
import ChevronLeft from 'assets/chevronLeft';
import ChevronRight from 'assets/chevronRight';
import SandClock from 'assets/sandClock';

dayjs.extend(weekdayPlugin);
dayjs.extend(objectPlugin);
dayjs.extend(isTodayPlugin);

const MONTH_FORMAT = 'MMMM YYYY';
const WEEKDAY_FORMAT = 'ddd';

const NOW = dayjs().locale({
  ...locale,
});

const Calendar = ({
  onDateSelect,
  selectedDate: preSelectedDate,
  showTwoMonths = true,
  isMobile,
  calendarInventory,
  showTimeslotsOnDateSelection = false,
  timeSlots,
  onClose,
  isCalendarPopupOpen,
  flowType,
  tgid,
}: TCalendarProps) => {
  const { sortedInventoryDates = [], dates } = calendarInventory ?? {};
  const [isCalendarInTwoMonthsMode, setIsCalendarInTwoMonthsMode] =
    useState(showTwoMonths);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    preSelectedDate
  );
  const [firstMonth, setFirstMonth] = useState(
    dayjs(sortedInventoryDates[0]).startOf('month')
  );
  const [lastMonth, setLastMonth] = useState(
    dayjs(sortedInventoryDates[sortedInventoryDates.length - 1]).endOf('month')
  );
  const [medianPrice, setMedianPrice] = useState(Number.MAX_SAFE_INTEGER);
  const [currentMonths, setCurrentMonths] = useState([
    NOW,
    NOW.add(1, 'month'),
  ]);
  const [arrayOfDays, setArrayOfDays] = useState<(number | null)[][]>(
    generateDaysInTwoMonths(currentMonths[0])
  );
  const [isButtonLoading, setButtonLoading] = useState(false);

  const currency = useRecoilValue(currencyAtom);
  const currencyList = useRecoilValue(currencyListAtom);
  const currencyObject = currencyList.find(
    (currencyObj) => currencyObj.code === currency
  );
  const { currencyName, localSymbol: symbol } = currencyObject as TCurrencyObj;

  const {
    lang,
    isDev,
    host,
    nakedDomain,
    biLink,
    redirectToHeadoutBookingFlow,
  } = useContext(MBContext);
  const hostname = getHostName(isDev, host);

  const handleNextClick = () => {
    const newFirstMonth = currentMonths[currentMonths.length - 1];
    const newSecondMonth = newFirstMonth.add(1, 'month');
    if (
      (isCalendarInTwoMonthsMode ? newSecondMonth : newFirstMonth) > lastMonth
    )
      return;

    setCurrentMonths([newFirstMonth, newSecondMonth]);
    setArrayOfDays(generateDaysInTwoMonths(newFirstMonth));
  };

  const handlePrevClick = () => {
    const newSecondMonth = currentMonths[0];
    const newFirstMonth = currentMonths[0].subtract(1, 'month');
    if (newFirstMonth < firstMonth) return;

    setCurrentMonths([newFirstMonth, newSecondMonth]);
    setArrayOfDays(generateDaysInTwoMonths(newFirstMonth));
  };

  const handleDateClick = (
    date: number | null,
    currentMonth: Dayjs,
    isAvailable: boolean,
    isDiscounted: boolean
  ) => {
    if (!date || currentMonth.date(date).isBefore(NOW, 'day')) return;
    const completeDate = currentMonth.date(date);
    const dateString = completeDate.format('YYYY-MM-DD');
    setSelectedDate(dateString);

    if (showTimeslotsOnDateSelection && date && !isMobile) {
      const selectedMonth = dayjs(dateString).startOf('month');
      setCurrentMonths([selectedMonth]);
    }
    setIsCalendarInTwoMonthsMode(false);
    onDateSelect({
      date: dateString,
      isAvailable,
      isDiscounted,
    });
    if (!showTimeslotsOnDateSelection || (isMobile && isAvailable)) {
      onClose?.();
    }
  };

  useEffect(() => {
    const { sortedInventoryDates = [] } = calendarInventory ?? {};
    setLastMonth(
      dayjs(sortedInventoryDates[sortedInventoryDates.length - 1]).endOf(
        'month'
      )
    );

    const calculateMedianPrice = () => {
      const priceList = new Set();
      let minInventoryMap = new Map<string, any>(
        Object.entries(sortedInventoryDates)
      );
      minInventoryMap.forEach((date) => {
        const price = dates[date]?.listingPrice ?? 0;
        priceList.add(price);
      });
      let median = arrayMedian([...priceList]);
      if (priceList.size === 1) median -= 1;
      return median;
    };
    setMedianPrice(calculateMedianPrice());
  }, [calendarInventory]);

  useEffect(() => {
    if (isMobile) {
      const months = generateAllMonthsBetween(firstMonth, lastMonth);
      setCurrentMonths(months);
      setArrayOfDays(months.map((month) => generateDaysInMonth(month)));
    } else {
      setCurrentMonths([firstMonth, firstMonth.add(1, 'month')]);
      setArrayOfDays(generateDaysInTwoMonths(currentMonths[0]));
    }
  }, [lastMonth]);

  useEffect(() => {
    setSelectedDate(preSelectedDate);
  }, [preSelectedDate]);

  useEffect(() => {
    if (!isCalendarPopupOpen && !isMobile) {
      const selectedMonth = dayjs(selectedDate, {
        format: 'YYYY-MM-DD',
      }).startOf('month');
      if (!selectedMonth.isSame(lastMonth, 'month')) {
        setCurrentMonths([selectedMonth, selectedMonth.add(1, 'month')]);
        setIsCalendarInTwoMonthsMode(true);
      }
    }
    const body = document.querySelector('body');
    if (body && !isMobile)
      body.style.overflowY = isCalendarPopupOpen ? 'hidden' : 'auto';
  }, [isCalendarPopupOpen]);

  useEffect(() => {
    if (sortedInventoryDates?.length) {
      const newFirstMonth = dayjs(sortedInventoryDates[0]).startOf('month');
      const newLastMonth = dayjs(
        sortedInventoryDates[sortedInventoryDates.length - 1]
      ).endOf('month');

      setFirstMonth(newFirstMonth);
      setLastMonth(newLastMonth);

      if (newFirstMonth.isSame(newLastMonth, 'month')) {
        setIsCalendarInTwoMonthsMode(false);
      }
    }
  }, [sortedInventoryDates]);

  const onTimeSlotClick = (
    selectedTime: string,
    index: number,
    hasSellingOutFastBooster: boolean,
    singleTimeSlot: boolean = false
  ) => {
    const leadTimeInDays = dayjs(selectedDate).diff(
      dayjs().startOf('day'),
      'days'
    );

    if (!singleTimeSlot) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.SHOW_PAGE.EXPERIENCE_TIME_SELECTED,
        [ANALYTICS_PROPERTIES.EXPERIENCE_TIME]: selectedTime,
        [ANALYTICS_PROPERTIES.RANKING]: index + 1,
        [ANALYTICS_PROPERTIES.LEAD_TIME_DAYS]: leadTimeInDays,
        [ANALYTICS_PROPERTIES.TRIGGERED_BY]: 'User',
        [ANALYTICS_PROPERTIES.PLACEMENT]: 'Calendar',
        [ANALYTICS_PROPERTIES.HAS_SELLING_OUT_FAST_DESCRIPTOR]:
          hasSellingOutFastBooster ? 'Yes' : 'No',
      });
    }

    const bookingUrl = createBookingURL({
      nakedDomain: nakedDomain || getNakedDomain(hostname),
      lang,
      tgid,
      biLink: biLink,
      redirectToHeadoutBookingFlow,
      currency,
      flowType,
      date: {
        startDate: selectedDate,
        startTime: selectedTime,
      },
    });

    window.open(bookingUrl, '_self', 'noopener');
  };

  useHistoryTraversal({
    action: () => {
      setButtonLoading(false);
    },
  });

  const onOverlayClicked = () => {
    if (isButtonLoading) return;
    onClose?.();
  };

  return (
    <>
      <CalendarPopup $isPopupActive={isCalendarPopupOpen}>
        <div
          className="overlay"
          onClick={onOverlayClicked}
          role="button"
          tabIndex={0}
        ></div>
        <BaseCalendarContainer isOpen={isCalendarPopupOpen} id="base-calendar">
          <CalendarContentWrapper>
            <Conditional if={isMobile}>
              <MwebHeader>
                <PickDate>
                  <div
                    className="back"
                    onClick={onClose}
                    role="button"
                    tabIndex={0}
                  >
                    <BackArrow />
                  </div>
                  {strings.CALENDAR.PICK_DATE}
                </PickDate>
                <WeekdaysWrapper $isSecondMonth={false}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <WeekDay $isSecondMonth={false} key={i}>
                      {NOW.weekday(i).format(WEEKDAY_FORMAT)}
                    </WeekDay>
                  ))}
                </WeekdaysWrapper>
              </MwebHeader>
            </Conditional>
            {currentMonths.map((currentMonth, idx) => {
              if (!isMobile && !isCalendarInTwoMonthsMode && idx == 1) return;
              const isSecondMonth = idx === 1;
              return (
                <div key={idx}>
                  <HeaderContainer $isSecondMonth={isSecondMonth}>
                    <MonthSwitcher
                      $isSecondMonth={
                        isSecondMonth || !isCalendarInTwoMonthsMode
                      }
                    >
                      <Conditional if={!isMobile && idx === 0}>
                        <MonthSwitcherButton
                          $hide={currentMonth.startOf('month') <= firstMonth}
                          onClick={handlePrevClick}
                        >
                          {ChevronLeft}
                        </MonthSwitcherButton>
                      </Conditional>
                      <MonthTitle $isSecondMonth={isSecondMonth}>
                        {currentMonth.format(MONTH_FORMAT)}
                      </MonthTitle>
                      <Conditional
                        if={
                          !isMobile &&
                          (idx == 1 ||
                            (idx === 0 && !isCalendarInTwoMonthsMode))
                        }
                      >
                        <MonthSwitcherButton
                          $hide={currentMonth.endOf('month') >= lastMonth}
                          onClick={handleNextClick}
                        >
                          {ChevronLeft}
                        </MonthSwitcherButton>
                      </Conditional>
                    </MonthSwitcher>
                    <Conditional if={!isMobile}>
                      <WeekdaysWrapper $isSecondMonth={isSecondMonth}>
                        {Array.from({ length: 7 }).map((_, i) => (
                          <WeekDay $isSecondMonth={isSecondMonth} key={i}>
                            {NOW.weekday(i).format(WEEKDAY_FORMAT)}
                          </WeekDay>
                        ))}
                      </WeekdaysWrapper>
                    </Conditional>
                  </HeaderContainer>
                  <DatesWrapper $isSecondMonth={isSecondMonth}>
                    {arrayOfDays?.[idx]?.map((day, index) => {
                      const currentDate = currentMonth
                        .date(day as number)
                        .format('YYYY-MM-DD');
                      const inventoryForDate =
                        calendarInventory?.dates[currentDate] ?? {};
                      const { listingPrice, retailPrice } = inventoryForDate;

                      const isAvailable = listingPrice && retailPrice;
                      const isDiscounted = listingPrice < medianPrice;
                      const priceForDate = isAvailable
                        ? getLocalisedPrice({
                            price: listingPrice,
                            currencyCode:
                              currency ?? calendarInventory?.metadata?.currency,
                            lang,
                            currencyList,
                            truncateIfLong: true,
                            truncateAfter: 3,
                          }).replace(/\u00A0/g, ' ')
                        : '';
                      return (
                        <Day
                          key={index}
                          onClick={() =>
                            handleDateClick(
                              day,
                              currentMonth,
                              isAvailable,
                              isDiscounted
                            )
                          }
                          $isSelected={
                            !!day && currentDate === selectedDate && isAvailable
                          }
                          $isBeforeToday={
                            !!day && currentMonth.date(day).isBefore(NOW, 'day')
                          }
                          $isAvailable={isAvailable}
                          $isDiscounted={isDiscounted}
                        >
                          {day}
                          <Conditional if={day}>
                            <PriceForDay $isDiscounted={isDiscounted}>
                              {priceForDate.replace(/&nbsp;/g, '')}
                            </PriceForDay>
                          </Conditional>
                        </Day>
                      );
                    })}
                  </DatesWrapper>
                </div>
              );
            })}
            <Conditional
              if={
                selectedDate &&
                showTimeslotsOnDateSelection &&
                !isCalendarInTwoMonthsMode &&
                !isMobile
              }
            >
              <CalendarTimeSlotSection>
                <span className="selected-date">
                  {dayjs(selectedDate).format('MMM DD, YYYY')}
                </span>
                <span className="select-time">
                  {timeSlots && timeSlots.length > 1
                    ? strings.SHOW_PAGE_V2.SELECT_TIME_SLOT
                    : strings.SHOW_PAGE_V2.AVAILABLE_TIME}
                </span>
                <Conditional if={selectedDate && !timeSlots?.length}>
                  <Loader />
                </Conditional>
                <Conditional if={timeSlots && timeSlots.length > 1}>
                  <div className="timeslot-cards">
                    {timeSlots?.map(
                      (availability: Record<string, any>, index: number) => {
                        const { startTime, paxAvailability } = availability;
                        const hasSellingOutFastBooster =
                          paxAvailability?.[0]?.availability === 'LIMITED';
                        const {
                          listingPrice = 0,
                          retailPrice = 0,
                          discount = 0,
                        } = availability?.priceProfile?.persons?.[0] ?? {};
                        const totalDiscount = (
                          ((retailPrice - listingPrice) / listingPrice) * 100 +
                          discount
                        ).toFixed(2);

                        return (
                          <TimeSlotCard
                            key={`${selectedDate}-${startTime}-slot`}
                            onClick={() =>
                              onTimeSlotClick(
                                startTime,
                                index,
                                hasSellingOutFastBooster
                              )
                            }
                          >
                            <TimingSection>
                              <TimeSlot>
                                {getIntlTime({
                                  time: startTime,
                                  lang,
                                })}
                              </TimeSlot>
                              <Conditional if={hasSellingOutFastBooster}>
                                <UrgencyBooster>
                                  <Emoji symbol="🔥" label="fire-emoji"></Emoji>
                                  {strings.SHOW_PAGE_V2.SELLING_OUT_FAST}
                                </UrgencyBooster>
                              </Conditional>
                            </TimingSection>
                            <PricingSection>
                              <div className="pricing">
                                <div className="cost">
                                  <Conditional if={retailPrice > listingPrice}>
                                    <span className="scratch-price">
                                      <LocalisedPrice
                                        currencyCode={currency ?? ''}
                                        lang={lang}
                                        price={retailPrice}
                                      />
                                    </span>
                                  </Conditional>
                                  <span className="price">
                                    <LocalisedPrice
                                      currencyCode={currency ?? ''}
                                      lang={lang}
                                      price={listingPrice}
                                      truncateIfLong={true}
                                      truncateAfter={3}
                                    />
                                  </span>
                                </div>
                                <Conditional if={totalDiscount > 0}>
                                  <Cashback>
                                    {strings.formatString(
                                      strings.SAVE_PERCENT,
                                      `${totalDiscount}`
                                    )}
                                  </Cashback>
                                </Conditional>
                              </div>
                              <ChevronRight fillColor={COLORS.GRAY.G2} />
                            </PricingSection>
                          </TimeSlotCard>
                        );
                      }
                    )}
                  </div>
                </Conditional>
                <Conditional if={timeSlots && timeSlots.length === 1}>
                  <Conditional
                    if={String(tgid) !== HARRY_POTTER_CURSED_CHILD_TGID}
                  >
                    <SingleTimeSlotAvailableCard>
                      <p className="info">
                        {strings.SHOW_PAGE_V2.EXPERIENCE_AVAILABLE_ONLY_AT}
                      </p>
                      <span className="time">
                        {getIntlTime({
                          time: timeSlots?.[0]?.startTime,
                          lang,
                        })}
                      </span>
                    </SingleTimeSlotAvailableCard>
                  </Conditional>
                  <Conditional
                    if={String(tgid) === HARRY_POTTER_CURSED_CHILD_TGID}
                  >
                    <HarryPotterTwoPartTimeSlot timeSlot={timeSlots?.[0]} />
                  </Conditional>

                  <Button
                    className="continue-button"
                    tabIndex={0}
                    size="medium"
                    color="purps"
                    variant="primary"
                    isLoading={isButtonLoading}
                    onClick={() => {
                      if (isButtonLoading) return;
                      if (!selectedDate) return;

                      const availability = timeSlots?.[0];
                      const { paxAvailability } = availability ?? {};
                      const hasSellingOutFastBooster =
                        paxAvailability?.[0]?.availability === 'LIMITED';
                      const { listingPrice, retailPrice } =
                        availability?.priceProfile?.persons?.[0] ?? {};

                      trackEvent({
                        eventName: ANALYTICS_EVENTS.SELECT_SEATS_CTA_CLICKED,
                        [ANALYTICS_PROPERTIES.DISCOUNT]:
                          retailPrice > listingPrice,
                        [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: listingPrice,
                        [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currency,
                      });

                      setButtonLoading(true);
                      setTimeout(
                        () => setButtonLoading(false),
                        BUTTON_LOADING_DURATION
                      );
                      onTimeSlotClick(
                        timeSlots?.[0]?.startTime,
                        0,
                        hasSellingOutFastBooster,
                        true
                      );
                    }}
                    text={strings.SHOW_PAGE_V2.SELECT_SEATS}
                  />
                </Conditional>
              </CalendarTimeSlotSection>
            </Conditional>
          </CalendarContentWrapper>
          <FootNote $isTimeSlotSectionVisible={!isCalendarInTwoMonthsMode}>
            {strings.formatString(
              strings.CALENDAR.FOOTNOTE,
              `${currencyName} (${symbol})`
            )}
          </FootNote>
        </BaseCalendarContainer>
      </CalendarPopup>
    </>
  );
};

export const hpPartTwoTime = (startTime: string) =>
  startTime === '14:00:00' ? '19:00:00' : '18:00:00';

export const HarryPotterTwoPartTimeSlot = ({
  timeSlot,
}: {
  timeSlot: Record<string, any>;
}) => {
  const { lang } = useContext(MBContext);
  const { startTime } = timeSlot ?? {};
  const partTwoTime = hpPartTwoTime(startTime);
  return (
    <>
      <TwoPartTimeSlot>
        <div className="time">
          <div className="time-index">1</div>
          <div className="show-details">
            {getIntlTime({
              time: startTime,
              lang,
            })}
            <div className="duration">
              {SandClock}
              <p>{strings.DURATION}: 2hr 40min</p>
            </div>
          </div>
        </div>
        <div className="gap">
          <div className="spacer" />
          {strings.SHOW_PAGE_V2.INTERVAL}: 1hr 20 min
        </div>
        <div className="time">
          <div className="time-index">2</div>
          <div className="show-details">
            {getIntlTime({
              time: partTwoTime,
              lang,
            })}
            <div className="duration">
              {SandClock}
              <p>{strings.DURATION}: 2hr 35min</p>
            </div>
          </div>
        </div>
      </TwoPartTimeSlot>
    </>
  );
};

export default Calendar;
