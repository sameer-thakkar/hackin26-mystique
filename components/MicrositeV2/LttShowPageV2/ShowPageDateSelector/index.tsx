import { useContext, useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useRecoilValue } from 'recoil';
import dayjs from 'dayjs';
import { Button } from '@headout/aer';
import Conditional from 'components/common/Conditional';
import Emoji from 'components/common/Emoji';
import { TShowPageDateSelectorProps } from 'components/MicrositeV2/LttShowPageV2/ShowPageDateSelector/interface';
import {
  BuyButtonWrapper,
  CalendarButton,
  DateSelectorHeader,
  HeaderDate,
  HeaderMonthName,
  OverlayWrapper,
  RootLevelPricing,
  SavePercentElement,
  ShowPageDateSelectorWrapper,
  TimeSection,
  TimeSlot,
  TimeSlotCard,
  TimeSlotPricing,
  TimeSlotsDropdown,
  TimeSlotsSection,
  TwoPartTimeSlot,
  UrgencyBooster,
} from 'components/MicrositeV2/LttShowPageV2/ShowPageDateSelector/style';
import Calendar from 'UI/Calendar';
import Dropdown from 'UI/Dropdown';
import LocalisedPrice from 'UI/LPrice';
import { MBContext } from 'contexts/MBContext';
import { useHistoryTraversal } from 'hooks/useHistoryTraversal';
import { createBookingURL, getNakedDomain } from 'utils';
import { trackEvent } from 'utils/analytics';
import { fetchCalendarInventory, fetchInventoryV7 } from 'utils/apiUtils';
import { arrayMedian } from 'utils/arrayUtils';
import { getLocalisedPrice } from 'utils/currency';
import { generateNextXDays, getHumanReadableTime } from 'utils/dateUtils';
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
import { CALENDAR, CHEVRON_UP, SAND_CLOCK } from 'assets/SvgIcons';
import 'react-loading-skeleton/dist/skeleton.css';

const ShowPageDateSelector = ({
  tourGroupData,
  flowType,
  isMobile,
  onClose,
}: TShowPageDateSelectorProps) => {
  const [isCalendarPopupActive, setIsCalendarPopupActive] = useState(false);
  const [currentAnimationState, setCurrentAnimationState] = useState('');
  const [currentSevenDays, setCurrentSevenDays] = useState(
    generateNextXDays({ numberOfDays: 5 })
  );
  const [calendarInventory, setCalendarInventory] = useState<Record<
    string,
    any
  > | null>();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isInventoriesFetching, setIsInventoriesFetching] = useState(true);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [inventoriesMap, setInventoriesMap] = useState<Record<string, any>>({});
  const [isButtonLoading, setButtonLoading] = useState(false);
  const [dropdownError, setDropdownError] = useState(false);
  const [medianPrice, setMedianPrice] = useState(Number.MAX_SAFE_INTEGER);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dateSelectorWrapperRef = useRef<HTMLDivElement>(null);

  const currency = useRecoilValue(currencyAtom);
  const currencyRef = useRef(currency);
  const currencyList = useRecoilValue(currencyListAtom);
  const {
    lang,
    isStage,
    isDev,
    host,
    nakedDomain,
    biLink,
    redirectToHeadoutBookingFlow,
  } = useContext(MBContext);

  const { id: tgid } = tourGroupData;

  const hostname = getHostName(isStage, isDev, host);
  let timeSlots = inventoriesMap[selectedDate ?? ''] ?? [];
  useEffect(() => {
    const fetchReopeningDate = async () => {
      try {
        const inventory = await fetchCalendarInventory({
          tgid,
          currency,
        });
        setCalendarInventory(inventory);
        const firstAvailableDate = inventory.sortedInventoryDates[0];
        setSelectedDate(firstAvailableDate);
        setCurrentSevenDays(
          generateNextXDays({ numberOfDays: 5, startDate: firstAvailableDate })
        );

        const calculateMedianPrice = (inventoryData: {
          sortedInventoryDates: string[];
          metaData: any;
          dates: Record<string, any>;
        }) => {
          const priceList = new Set();
          let minInventoryMap = new Map<string, any>(
            Object.entries(inventoryData?.sortedInventoryDates)
          );
          minInventoryMap.forEach((date) => {
            const price = inventoryData?.dates?.[date]?.listingPrice ?? 0;
            priceList.add(price);
          });
          let median = arrayMedian([...priceList]);
          if (priceList.size === 1) median -= 1;
          return median;
        };

        setMedianPrice(calculateMedianPrice(inventory));
        const medianPrice = calculateMedianPrice(inventory);
        setMedianPrice(medianPrice);

        const firstAvailableDateListingPrice =
          inventory?.dates?.[firstAvailableDate]?.listingPrice ?? 0;

        trackDateSelectorHeaderDateSelectedEvent({
          date: firstAvailableDate,
          ranking: 1,
          isDiscounted: firstAvailableDateListingPrice < medianPrice,
          triggeredBy: 'Automatic',
        });
      } catch (error) {
        return;
      }
    };
    fetchReopeningDate();
    setButtonLoading(false);
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchAndParseInvetories = async () => {
      const inventories = await fetchInventoryV7({
        tgid,
        fromDate: selectedDate,
        ...(currency && {
          currency: `${currency}`,
        }),
        hostname,
      });
      const dateMap: Record<string, any> = {};
      const { availabilities } = inventories ?? {};
      availabilities?.forEach((availability: Record<string, any>) => {
        const { startDate } = availability;
        if (!dateMap[startDate]) {
          dateMap[startDate] = [];
        }

        dateMap[startDate].push(availability);
      });

      Object.keys(dateMap).forEach((date) =>
        dateMap[date].sort((a: Record<string, any>, b: Record<string, any>) =>
          dayjs(a.startTime, 'HH:mm:ss').diff(dayjs(b.startTime, 'HH:mm:ss'))
        )
      );

      const timeSlots = dateMap[selectedDate ?? ''] ?? [];
      if (timeSlots.length && (timeSlots.length < 3 || isMobile)) {
        const leadTimeInDays = dayjs(selectedDate).diff(
          dayjs().startOf('day'),
          'days'
        );

        const { paxAvailability } = timeSlots?.[0] ?? {};

        const hasSellingOutFastBooster =
          paxAvailability?.[0]?.availability === 'LIMITED';

        setSelectedTime(timeSlots[0].startTime);
        trackEvent({
          eventName: ANALYTICS_EVENTS.SHOW_PAGE.EXPERIENCE_TIME_SELECTED,
          [ANALYTICS_PROPERTIES.EXPERIENCE_TIME]: timeSlots[0].startTime,
          [ANALYTICS_PROPERTIES.RANKING]: 0,
          [ANALYTICS_PROPERTIES.LEAD_TIME_DAYS]: leadTimeInDays,
          [ANALYTICS_PROPERTIES.TRIGGERED_BY]: 'Automatic',
          [ANALYTICS_PROPERTIES.HAS_SELLING_OUT_FAST_DESCRIPTOR]:
            hasSellingOutFastBooster ? 'Yes' : 'No',
        });
      }
      setInventoriesMap({
        ...inventoriesMap,
        ...dateMap,
      });
      setIsInventoriesFetching(false);
      if (dateSelectorWrapperRef.current) {
        dateSelectorWrapperRef.current.style.setProperty(
          '--calendar-height',
          `${document.getElementById('base-calendar')?.offsetHeight ?? 0}px`
        );
      }
    };
    if (selectedDate && inventoriesMap[selectedDate]) return;

    fetchAndParseInvetories();
    setIsInventoriesFetching(true);
  }, [selectedDate]);

  useEffect(() => {
    if (timeSlots.length > 2 && selectedTime) {
      setDropdownError(false);
    }
  }, [selectedTime]);

  const trackDateSelectorHeaderDateSelectedEvent = ({
    date,
    triggeredBy,
    ranking,
    isDiscounted,
  }: {
    date: string;
    triggeredBy: 'User' | 'Automatic';
    ranking: number;
    isDiscounted: boolean;
  }) => {
    const leadTimeInDays = dayjs(date).diff(dayjs().startOf('day'), 'days');
    trackEvent({
      eventName: ANALYTICS_EVENTS.SHOW_PAGE.EXPERIENCE_DATE_SELECTED,
      [ANALYTICS_PROPERTIES.EXPERIENCE_DATE]: date,
      [ANALYTICS_PROPERTIES.TRIGGERED_BY]: triggeredBy,
      [ANALYTICS_PROPERTIES.DISCOUNT]: isDiscounted,
      [ANALYTICS_PROPERTIES.RANKING]: ranking,
      [ANALYTICS_PROPERTIES.LEAD_TIME_DAYS]: leadTimeInDays,
    });
  };
  useEffect(() => {
    const setCalendarDynamicHeight = () => {
      if (dateSelectorWrapperRef.current) {
        dateSelectorWrapperRef.current.style.setProperty(
          '--calendar-height',
          `${document.getElementById('base-calendar')?.offsetHeight ?? 0}px`
        );
      }
    };
    setCalendarDynamicHeight();
    window.addEventListener('resize', setCalendarDynamicHeight);
    return () => {
      window.removeEventListener('resize', setCalendarDynamicHeight);
    };
  }, []);

  useEffect(() => {
    const bannerVideo = document.getElementById(
      'show-page-banner'
    ) as HTMLVideoElement;
    if (!bannerVideo) return;

    const closeCalendarOnEscapePressed = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCalendar();
      }
    };

    if (isCalendarPopupActive) {
      bannerVideo.pause();
      window.addEventListener('keydown', closeCalendarOnEscapePressed);
    } else {
      bannerVideo.play();
      window.removeEventListener('keydown', closeCalendarOnEscapePressed);
    }

    return () =>
      window.removeEventListener('keydown', closeCalendarOnEscapePressed);
  }, [isCalendarPopupActive]);

  const onDateSelected = ({
    date,
    isAvailable,
    shiftHeaderStartDate = false,
  }: {
    date: string;
    isAvailable: boolean;
    shiftHeaderStartDate?: boolean;
  }) => {
    if (!isAvailable || isButtonLoading) return;

    setSelectedDate(date);
    const timeSlots = inventoriesMap[date ?? ''] ?? [];
    if (timeSlots.length && (timeSlots.length < 3 || isMobile)) {
      const leadTimeInDays = dayjs(selectedDate).diff(
        dayjs().startOf('day'),
        'days'
      );

      const { paxAvailability } = timeSlots?.[0] ?? {};

      const hasSellingOutFastBooster =
        paxAvailability?.[0]?.availability === 'LIMITED';

      setSelectedTime(timeSlots[0].startTime);
      trackEvent({
        eventName: ANALYTICS_EVENTS.SHOW_PAGE.EXPERIENCE_TIME_SELECTED,
        [ANALYTICS_PROPERTIES.EXPERIENCE_TIME]: selectedTime,
        [ANALYTICS_PROPERTIES.RANKING]: 0,
        [ANALYTICS_PROPERTIES.LEAD_TIME_DAYS]: leadTimeInDays,
        [ANALYTICS_PROPERTIES.TRIGGERED_BY]: 'Automatic',
        [ANALYTICS_PROPERTIES.HAS_SELLING_OUT_FAST_DESCRIPTOR]:
          hasSellingOutFastBooster ? 'Yes' : 'No',
      });
    } else if (timeSlots.length && timeSlots.length >= 3) {
      setSelectedTime(null);
    }
    if (shiftHeaderStartDate) {
      setCurrentSevenDays(
        generateNextXDays({ numberOfDays: 5, startDate: date })
      );
    }
  };

  const onTimeSlotSelected = (
    selectedTime: string,
    index: number,
    hasSellingOutFastBooster: boolean
  ) => {
    if (isButtonLoading) return;
    const leadTimeInDays = dayjs(selectedDate).diff(
      dayjs().startOf('day'),
      'days'
    );
    trackEvent({
      eventName: ANALYTICS_EVENTS.SHOW_PAGE.EXPERIENCE_TIME_SELECTED,
      [ANALYTICS_PROPERTIES.EXPERIENCE_TIME]: selectedTime,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.LEAD_TIME_DAYS]: leadTimeInDays,
      [ANALYTICS_PROPERTIES.TRIGGERED_BY]: 'User',
      [ANALYTICS_PROPERTIES.HAS_SELLING_OUT_FAST_DESCRIPTOR]:
        hasSellingOutFastBooster ? 'Yes' : 'No',
    });
    setSelectedTime(selectedTime);
  };

  const openCalendar = () => {
    if (isButtonLoading) return;

    trackEvent({
      eventName: ANALYTICS_EVENTS.SHOW_PAGE.CALENDAR_OPEN,
    });

    if (isMobile) {
      setCurrentAnimationState('increase');
    }

    setIsCalendarPopupActive(true);
  };

  const closeCalendar = () => {
    if (isButtonLoading) return;

    trackEvent({
      eventName: ANALYTICS_EVENTS.SHOW_PAGE.CALENDAR_CLOSED,
    });

    if (isMobile) {
      setCurrentAnimationState('decrease');
    }

    setIsCalendarPopupActive(false);
  };

  const getHeaderElements = () => {
    if (!calendarInventory?.dates) {
      const skeletons = Array.from({ length: 5 }).map((_, index) => (
        <Skeleton
          key={index}
          height="90%"
          width="3rem"
          style={{
            marginRight: '0.5rem',
            marginBottom: '0.5rem',
            borderRadius: '0.375rem',
          }}
          baseColor={COLORS.GRAY.G8}
        />
      ));
      skeletons.unshift(
        <Skeleton
          height="3.375rem"
          width="1rem"
          style={{
            marginRight: '0.5rem',
            marginBottom: '0.5rem',
            borderRadius: '0.375rem',
          }}
          baseColor={COLORS.GRAY.G8}
        />
      );
      return skeletons;
    }

    const headerElements: JSX.Element[] = [];
    const monthOfFirstDate = dayjs(currentSevenDays[0].date).format('MMM');
    headerElements.push(
      <HeaderMonthName>
        <span className="text-content">{monthOfFirstDate.toUpperCase()}</span>
      </HeaderMonthName>
    );
    currentSevenDays.forEach(({ date, weekday }, index) => {
      const twoDigitDate = dayjs(date).date();

      const inventoryForDate = calendarInventory.dates[date] ?? {};
      const { listingPrice, retailPrice } = inventoryForDate;
      const isAvailable = listingPrice && retailPrice;
      const isDiscounted = listingPrice && listingPrice < medianPrice;

      const priceForDate = isAvailable
        ? getLocalisedPrice({
            price: listingPrice,
            currencyCode:
              currencyRef.current ??
              currency ??
              calendarInventory?.metadata?.currency,
            lang,
            currencyList,
            truncateIfLong: true,
            truncateAfter: 3,
          })
        : '_';

      if (twoDigitDate === 1 && index !== 0) {
        const monthOfDate = dayjs(date).format('MMM');
        headerElements.push(
          <HeaderMonthName>
            <span className="text-content">{monthOfDate.toUpperCase()}</span>
          </HeaderMonthName>
        );
      }
      headerElements.push(
        <HeaderDate
          $isSelected={selectedDate === date}
          $isDiscounted={isDiscounted}
          $isAvailable={isAvailable}
          onClick={() => {
            trackDateSelectorHeaderDateSelectedEvent({
              date,
              ranking: index + 1,
              isDiscounted,
              triggeredBy: 'User',
            });
            onDateSelected({
              date,
              isAvailable,
            });
          }}
        >
          <span className="weekday">{weekday}</span>
          <span className="date">{twoDigitDate}</span>
          <span className="price">{priceForDate}</span>
        </HeaderDate>
      );
    });
    return headerElements;
  };
  const getTimeslotElements = (isDropdown?: boolean) => {
    if (String(tgid) === HARRY_POTTER_CURSED_CHILD_TGID) {
      return <HarryPotterTwoPartTimeSlot timeSlot={timeSlots?.[0]} />;
    }

    return timeSlots.map((availability: Record<string, any>, index: number) => {
      const { startTime, paxAvailability } = availability;

      const hasSellingOutFastBooster =
        paxAvailability?.[0]?.availability === 'LIMITED';

      return (
        <TimeSlotCard
          $isSelected={startTime === selectedTime}
          $isDropDown={isDropdown}
          key={`${selectedDate}-${startTime}`}
          onClick={() =>
            onTimeSlotSelected(startTime, index, hasSellingOutFastBooster)
          }
        >
          <TimeSection>
            <TimeSlot>
              {getHumanReadableTime({
                formattedTime: startTime,
                lang,
              })}
            </TimeSlot>
            <Conditional if={hasSellingOutFastBooster}>
              <UrgencyBooster>
                <Emoji symbol="🔥" label="fire-emoji"></Emoji>
                {strings.LTT_SHOW_PAGE.SELLING_OUT_FAST}
              </UrgencyBooster>
            </Conditional>
          </TimeSection>
          {getPricingElements(availability)}
        </TimeSlotCard>
      );
    });
  };

  const getPricingElements = (
    availability: Record<string, any>,
    atRootLevel: boolean = false
  ) => {
    if (!availability?.priceProfile?.persons?.[0]) return;

    const { listingPrice, retailPrice, discount } =
      availability?.priceProfile?.persons?.[0];

    const totalDiscount = (
      ((retailPrice - listingPrice) / listingPrice) * 100 +
      discount
    ).toFixed(2);

    return (
      <TimeSlotPricing atRootLevel={true}>
        <div className="pricing">
          <span className="scratch-price">
            <Conditional if={atRootLevel}>
              <span className="price-starting-from">
                {strings.FROM?.toLowerCase()}{' '}
              </span>
            </Conditional>
            <Conditional if={retailPrice > listingPrice}>
              <LocalisedPrice
                currencyCode={currencyRef.current ?? currency ?? ''}
                lang={lang}
                price={retailPrice}
                className="original-price"
                truncateIfLong={true}
                truncateAfter={3}
              />
            </Conditional>
          </span>
          <span className="price">
            <LocalisedPrice
              currencyCode={currencyRef.current ?? currency ?? ''}
              lang={lang}
              price={listingPrice}
              truncateIfLong={true}
              truncateAfter={3}
            />
            <Conditional if={totalDiscount > 0}>
              <SavePercentElement>
                {strings.formatString(strings.SAVE_PERCENT, `${totalDiscount}`)}
              </SavePercentElement>
            </Conditional>
          </span>
        </div>
      </TimeSlotPricing>
    );
  };

  const getTimeSlotsHeadingString = () => {
    if (String(tgid) === HARRY_POTTER_CURSED_CHILD_TGID)
      return strings.LTT_SHOW_PAGE.TWO_PART_SHOW;

    return timeSlots.length > 1 || isMobile
      ? strings.LTT_SHOW_PAGE.SELECT_SHOW_TIMMING
      : strings.LTT_SHOW_PAGE.ONLY_ONE_SLOT;
  };
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
  const isButtonDisabled =
    (!selectedDate && !selectedTime) || isInventoriesFetching;

  const SelectSeatsButton = (
    <Button
      tabIndex={0}
      size="medium"
      color="purps"
      variant="primary"
      isLoading={isButtonLoading}
      disabled={isButtonDisabled}
      onClick={() => {
        if (timeSlots.length > 2 && !selectedTime) {
          setDropdownError(true);
          return;
        }
        if (isButtonLoading) return;
        if (!selectedDate && !selectedTime) return;
        const availability = timeSlots.find(
          (availability: Record<string, any>) =>
            availability.startTime === selectedTime
        );
        const { listingPrice, retailPrice } =
          availability?.priceProfile?.persons?.[0] ?? {};

        trackEvent({
          eventName: ANALYTICS_EVENTS.SELECT_SEATS_CTA_CLICKED,
          [ANALYTICS_PROPERTIES.DISCOUNT]: retailPrice > listingPrice,
          [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: listingPrice,
        });

        setButtonLoading(true);
        setDropdownError(false);
        setTimeout(() => setButtonLoading(false), BUTTON_LOADING_DURATION);
        window.open(bookingUrl, '_self', 'noopener, noreferrer');
      }}
      text={strings.LTT_SHOW_PAGE.SELECT_SEATS}
    />
  );

  useHistoryTraversal({
    action: () => {
      setButtonLoading(false);
    },
  });

  const onCalendarDateSelected = ({
    date,
    isAvailable,
  }: {
    date: string;
    isAvailable: boolean;
  }) => {
    const leadTimeInDays = dayjs(selectedDate).diff(
      dayjs().startOf('day'),
      'days'
    );
    const inventoryForDate = calendarInventory?.dates?.[date] ?? {};
    const { listingPrice } = inventoryForDate;

    onDateSelected({
      date,
      isAvailable,
      shiftHeaderStartDate: true,
    });
    trackEvent({
      eventName: ANALYTICS_EVENTS.SHOW_PAGE.CALENDAR_DATE_SELECTED,
      [ANALYTICS_PROPERTIES.SELECTED_DATE]: date,
      [ANALYTICS_PROPERTIES.IS_PRICE_FADED]: false,
      [ANALYTICS_PROPERTIES.LEAD_TIME_DAYS]: leadTimeInDays,
      [ANALYTICS_PROPERTIES.IS_MIN_PRICE]: listingPrice <= medianPrice,
    });
  };

  return (
    <>
      <OverlayWrapper
        onClick={() => {
          if (!isButtonLoading) onClose?.();
        }}
      />
      <ShowPageDateSelectorWrapper
        $isRedirecting={isButtonLoading}
        className={currentAnimationState}
        ref={dateSelectorWrapperRef}
      >
        <div id="sheet">
          <DateSelectorHeader id="header">
            {getHeaderElements()}
            <CalendarButton onClick={openCalendar}>
              {CALENDAR({})}
              <span className="more-dates">
                {strings.LTT_SHOW_PAGE.MORE_DATES}
              </span>
            </CalendarButton>
          </DateSelectorHeader>

          <TimeSlotsSection id="timeslots-section">
            <Conditional
              if={
                (selectedDate && !timeSlots.length) || !calendarInventory?.dates
              }
            >
              <Skeleton
                height="3.5rem"
                style={{ marginTop: '0.75rem', borderRadius: '0.375rem' }}
                baseColor={COLORS.GRAY.G8}
              />
            </Conditional>

            <Conditional if={selectedDate && timeSlots.length}>
              <p>{getTimeSlotsHeadingString()}</p>
              <Conditional if={timeSlots.length > 2 && !isMobile}>
                <Dropdown
                  autoClose={true}
                  onDropdownStateChange={(open: boolean) => {
                    setIsDropdownOpen(open);
                    if (open) {
                      trackEvent({
                        eventName:
                          ANALYTICS_EVENTS.SHOW_PAGE.TIMESLOT_DROPDOWN_OPENED,
                      });
                    }
                  }}
                  triggerElement={
                    <TimeSlotsDropdown $isError={dropdownError}>
                      <Conditional if={selectedTime}>
                        {getHumanReadableTime({
                          formattedTime: selectedTime ?? '',
                          lang,
                        })}
                      </Conditional>
                      <Conditional if={!selectedTime}>
                        <span>{strings.LTT_SHOW_PAGE.SELECT_TIME_SLOT}</span>
                      </Conditional>
                      <span
                        className={`dropdown-chevron ${
                          isDropdownOpen ? 'open' : ''
                        }`}
                      >
                        {CHEVRON_UP}
                      </span>
                    </TimeSlotsDropdown>
                  }
                >
                  {getTimeslotElements(true)}
                </Dropdown>
                <Conditional if={dropdownError}>
                  <p className="dropdown-error">
                    {strings.LTT_SHOW_PAGE.SELECT_TIME_SLOT_ERROR}
                  </p>
                </Conditional>
                <Conditional if={selectedTime}>
                  <RootLevelPricing>
                    {getPricingElements(
                      timeSlots.find(
                        (availability: Record<string, any>) =>
                          availability.startTime === selectedTime
                      ),
                      true
                    )}
                  </RootLevelPricing>
                </Conditional>
              </Conditional>
              <Conditional if={timeSlots.length <= 2 || isMobile}>
                {getTimeslotElements()}
              </Conditional>
            </Conditional>
            <Conditional
              if={String(tgid) === HARRY_POTTER_CURSED_CHILD_TGID && !isMobile}
            >
              <RootLevelPricing $isTwoPartPricing={true}>
                {getPricingElements(
                  timeSlots.find(
                    (availability: Record<string, any>) =>
                      availability.startTime === selectedTime
                  ),
                  true
                )}
              </RootLevelPricing>
            </Conditional>
            <Conditional if={!isMobile}>
              <BuyButtonWrapper $disabled={isButtonDisabled}>
                {SelectSeatsButton}
              </BuyButtonWrapper>
            </Conditional>
          </TimeSlotsSection>

          <Conditional if={isMobile}>
            <BuyButtonWrapper
              id="buy-button-wrapper"
              $disabled={isButtonDisabled}
            >
              {SelectSeatsButton}
            </BuyButtonWrapper>
          </Conditional>
        </div>
      </ShowPageDateSelectorWrapper>
      <Calendar
        tgid={tgid}
        flowType={flowType}
        calendarInventory={calendarInventory}
        onDateSelect={onCalendarDateSelected}
        selectedDate={selectedDate}
        isMobile={isMobile}
        showTimeslotsOnDateSelection={true}
        onClose={closeCalendar}
        timeSlots={timeSlots}
        isCalendarPopupOpen={isCalendarPopupActive}
      />
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
            {getHumanReadableTime({
              formattedTime: startTime,
              lang,
            })}
            <div className="duration">
              {SAND_CLOCK}
              <p>{strings.DURATION}: 2hr 40min</p>
            </div>
          </div>
        </div>
        <div className="gap">
          <div className="spacer" />
          {strings.LTT_SHOW_PAGE.INTERVAL}: 1hr 20 min
        </div>
        <div className="time">
          <div className="time-index">2</div>
          <div className="show-details">
            {getHumanReadableTime({
              formattedTime: partTwoTime,
              lang,
            })}
            <div className="duration">
              {SAND_CLOCK}
              <p>{strings.DURATION}: 2hr 35min</p>
            </div>
          </div>
        </div>
      </TwoPartTimeSlot>
    </>
  );
};

export default ShowPageDateSelector;
