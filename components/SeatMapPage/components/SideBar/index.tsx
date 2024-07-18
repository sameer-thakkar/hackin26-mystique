import { useCallback, useEffect, useMemo, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import Link from 'next/link';
import { createClient } from 'prismicio';
import { useRecoilValue } from 'recoil';
import { predicate } from '@prismicio/client';
import useSWR from 'swr';
import Conditional from 'components/common/Conditional';
import Calendar from 'components/HOHO/components/Calendar';
import { getMedianPrice } from 'components/HOHO/components/Calendar/utils';
import { BoosterType } from 'components/Product/interface';
import Image from 'UI/Image';
import { createBookingURL, truncateNumber } from 'utils';
import { trackEvent } from 'utils/analytics';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { getLocalisedPrice } from 'utils/currency';
import {
  getHumanReadableTime,
  getWeekdaysShort,
  longMonthtoShort,
  sortDateArray,
} from 'utils/dateUtils';
import { findImageUrlFromMediaData } from 'utils/helper';
import { convertUidToUrl } from 'utils/urlUtils';
import { appAtom } from 'store/atoms/app';
import { currencyAtom } from 'store/atoms/currency';
import { currencyListAtom } from 'store/atoms/currencyList';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CUSTOM_TYPES,
  MONTHS,
  PRISMIC_FIELD_ID,
} from 'const/index';
import { LocationPinIcon } from 'assets/LocationPinIcon';
import PracticalInfoCalendar from 'assets/practicalInfoCalendar';
import { StarSvg } from 'assets/StarSvg';
import VerticalProductImagePlaceholder from 'assets/verticalProductImagePlaceholder';
import 'react-loading-skeleton/dist/skeleton.css';
import { TSideBarProps } from './interface';
import {
  ActionContainer,
  CheckAvailability,
  DateSelection,
  DateSelectionSkeleton,
  ExperienceName,
  FixedTourInfoBannerWrapper,
  HorizontalDateList,
  HR,
  MoreTourDates,
  RatingCount,
  Reviews,
  SelectDateTitleBlock,
  SideBarTop,
  SideBarWrapper,
  StyledTimeSelection,
  StyledTourTimeSlot,
  TourDateButton,
  TourDescriptor,
  TourDescriptorContent,
  TourDescriptorContentSkeleton,
  TourImageWrapper,
  TourInfoBanner,
  TourPriceInfo,
  TourTimeSlotContainer,
} from './styles';
import {
  getCurrentDate,
  getDatesInRange,
  getDateXDaysAhead,
  getLeadTimeDays,
  getToursAgainstDates,
} from './utils';

const VERTICAL_IMAGE_ASPECT_RATIO = 10 / 16;

const SideBar = (props: TSideBarProps) => {
  const { isMobile, variantId, isFirstScroll, theatreShowTgid, lang } = props;
  const prismicClient = createClient();

  const headerCurrency = useRecoilValue(currencyAtom);
  const currencyList = useRecoilValue(currencyListAtom);
  const { host } = useRecoilValue(appAtom);
  const [timeSlotIndex, setTimeSlotIndex] = useState(0);
  const [toursAgainstDates, setToursAgainstDates] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showPageLink, setShowPageLink] = useState('');

  const params = useMemo(() => ({ language: lang }), [lang]);

  const theatreShowApiUrl = useMemo(
    () =>
      getHeadoutApiUrl({
        endpoint: HeadoutEndpoints.TourGroupsV6,
        id: theatreShowTgid,
        params,
      }),
    [theatreShowTgid, params]
  );

  const { data: theatreShowData } = useSWR(theatreShowApiUrl, {
    fetcher: swrFetcher,
  });

  const theatreMediaApiUrl = useMemo(
    () =>
      getHeadoutApiUrl({
        endpoint: HeadoutEndpoints.Media,
        id: theatreShowTgid,
        params: {
          'resource-type': 'MB_EXPERIENCE',
          'resource-entity-ids': theatreShowTgid,
        },
      }),
    [theatreShowTgid]
  );

  const { data: theatreMediaData } = useSWR(theatreMediaApiUrl, {
    fetcher: swrFetcher,
  });

  const verticalImageUrl = useMemo(
    () =>
      theatreMediaData?.resourceEntityMedias[0]?.medias
        ? findImageUrlFromMediaData(
            theatreMediaData?.resourceEntityMedias[0]?.medias
          ) ?? ''
        : '',
    [theatreMediaData]
  );

  const {
    name: experienceName,
    reviewsDetails = {},
    listingPrice,
    startLocation = {},
    currency: productCurrencyObj,
  } = theatreShowData ?? {};

  const { code: productCurrencyCode } = productCurrencyObj ?? {};

  const { finalPrice, bestDiscount, cashbackType, cashbackValue } =
    listingPrice ?? {};

  const currencyObj = useMemo(
    () =>
      currencyList?.find(
        (currencyObj) =>
          currencyObj?.code === (headerCurrency ?? productCurrencyCode)
      ),
    [currencyList, headerCurrency, productCurrencyCode]
  );

  const { localSymbol, code: currencyCode } = currencyObj || {};
  const activeCurrencyCode = currencyCode ?? productCurrencyCode;
  const currentDate = getCurrentDate();

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTourDate, setSelectedTourDate] = useState(currentDate);
  const [tourStartDate, setTourStartDate] = useState(currentDate);
  const [minInventoryMap, setMinInventoryMap] = useState(new Map());

  const weekDaysShort = useMemo(() => getWeekdaysShort(lang), [lang]);
  const tourDatesToShow = useMemo(
    () =>
      getDatesInRange({
        startDate: tourStartDate,
        daysInRange: 4,
      }),
    [tourStartDate]
  );

  const { reviewsCount, showRatings, averageRating } = reviewsDetails;
  const ratingsPresent = useMemo(
    () => averageRating > 0 && reviewsCount > 0 && showRatings,
    [averageRating, reviewsCount, showRatings]
  );
  const medianPrice = useMemo(
    () => getMedianPrice(minInventoryMap),
    [minInventoryMap]
  );

  const calendarEndpoint = useMemo(
    () =>
      getHeadoutApiUrl({
        endpoint: HeadoutEndpoints.CalendarInventory,
        id: theatreShowTgid,
        params: {
          ...(tourStartDate && { 'from-date': tourStartDate }),
          ...(tourStartDate && {
            'to-date': getDateXDaysAhead({
              startDate: tourStartDate,
              daysAhead: 7,
            }),
          }),
          ...(variantId && { variantId: variantId?.toString() }),
          ...(activeCurrencyCode && { currency: activeCurrencyCode }),
        },
      }),
    [theatreShowTgid, tourStartDate, variantId, activeCurrencyCode]
  );

  const { data: calendarData } = useSWR(calendarEndpoint, {
    fetcher: swrFetcher,
  });

  useEffect(() => {
    if (calendarData && tourDatesToShow?.length) {
      const { dates } = calendarData;
      const sortedInventoryDates = sortDateArray(Object.keys(dates) ?? []);
      const [firstAvailableDateStr] = sortedInventoryDates ?? [];

      const lastVisibleTourDateStr =
        tourDatesToShow[tourDatesToShow.length - 1];

      const firstAvailableDate = new Date(firstAvailableDateStr);
      const lastVisibleTourDate = new Date(lastVisibleTourDateStr);

      if (firstAvailableDate <= lastVisibleTourDate) {
        setSelectedTourDate(firstAvailableDateStr);
      }
    }
  }, [calendarData]);

  const computeMinInventoryMap = useCallback(() => {
    let { dates } = calendarData;
    let minInventoryMap = new Map(Object.entries(dates));
    setMinInventoryMap(minInventoryMap);
  }, [calendarData]);

  useEffect(() => {
    if (calendarData) {
      computeMinInventoryMap();
    }
  }, [computeMinInventoryMap, calendarData]);

  const fetchShowPageData = useCallback(async () => {
    const showPageDocument = await prismicClient.getByType('showpage', {
      predicates: [
        predicate.any(`my.${CUSTOM_TYPES.SHOW_PAGE}.${PRISMIC_FIELD_ID.TGID}`, [
          Number(theatreShowTgid),
        ]),
      ],
    });
    const showPageUrl = convertUidToUrl({
      uid: showPageDocument?.results?.[0]?.uid,
      lang,
    });

    if (showPageUrl) {
      setShowPageLink(showPageUrl);
    }
  }, [theatreShowTgid, lang, prismicClient]);

  useEffect(() => {
    setIsLoading(false);
    const { listingPrice } = calendarData?.dates[selectedTourDate] ?? {};
    const totalAvailableTours = getTotalAvailableTours(tourDatesToShow);
    addExperienceDateSelectedDataEvents({
      selectedTourDate: selectedTourDate,
      isMinPrice: listingPrice <= medianPrice,
      totalAvailableTours,
    });
    fetchShowPageData();
  }, [
    calendarData,
    selectedTourDate,
    tourDatesToShow,
    fetchShowPageData,
    medianPrice,
  ]);

  const addCalendarToggleDataEvents = useCallback(
    (showCalendar) => {
      if (showCalendar) {
        trackEvent({
          eventName: ANALYTICS_EVENTS.CALENDAR_OPEN,
          [ANALYTICS_PROPERTIES.TGID]: theatreShowTgid,
          [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: experienceName,
        });
      } else {
        trackEvent({
          eventName: ANALYTICS_EVENTS.CALENDAR_CLOSED,
          [ANALYTICS_PROPERTIES.TGID]: theatreShowTgid,
          [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: experienceName,
        });
      }
    },
    [theatreShowTgid, experienceName]
  );

  const getTotalAvailableTours = useCallback(
    (tourDates: string[]) => {
      return tourDates.reduce((count, tourDate) => {
        const isTourAvailable = Boolean(calendarData?.dates[tourDate]);

        if (isTourAvailable) {
          count += 1;
        }

        return count;
      }, 0);
    },
    [calendarData]
  );

  const handleSelectTourDate = useCallback(
    ({ isDisabled, tourDate, isMinPrice }) => {
      if (isDisabled) {
        return;
      }

      const totalAvailableTours = getTotalAvailableTours(tourDatesToShow);
      setSelectedTourDate(tourDate);
      addExperienceDateSelectedDataEvents({
        selectedTourDate: tourDate,
        isUser: true,
        isMinPrice,
        totalAvailableTours,
      });
    },
    [tourDatesToShow, getTotalAvailableTours]
  );

  const handleShowCalendar = useCallback(() => {
    setShowCalendar(true);
    addCalendarToggleDataEvents(true);
  }, [addCalendarToggleDataEvents]);

  const addExperienceDateSelectedDataEvents = useCallback(
    ({
      selectedTourDate,
      isUser,
      isCalendar,
      isMinPrice,
      totalAvailableTours,
    }) => {
      trackEvent({
        eventName: ANALYTICS_EVENTS.EXPERIENCE_DATE_SELECTED,
        [ANALYTICS_PROPERTIES.EXPERIENCE_DATE]: selectedTourDate,
        [ANALYTICS_PROPERTIES.TRIGGERED_BY]: isUser ? 'User' : 'Automatic',
        [ANALYTICS_PROPERTIES.PLACEMENT]: isCalendar
          ? 'Calendar'
          : 'Dates Widget',
        ...(!isCalendar && {
          [ANALYTICS_PROPERTIES.LEAD_TIME_DAYS]: getLeadTimeDays(
            tourDatesToShow[0],
            selectedTourDate
          ),
        }),
        ...(!isCalendar && { [ANALYTICS_PROPERTIES.IS_MIN_PRICE]: isMinPrice }),
        ...(!isCalendar && {
          [ANALYTICS_PROPERTIES.TIME_SLOTS_AVAILABLE]: totalAvailableTours,
        }),
      });
    },
    [tourDatesToShow]
  );

  const addCheckAvailabilityClickedDataEvents = useCallback(() => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: theatreShowTgid,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: experienceName,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: activeCurrencyCode,
      [ANALYTICS_PROPERTIES.AVERAGE_RATING]: averageRating?.toFixed(1),
      [ANALYTICS_PROPERTIES.NUMBER_OF_RATINGS]: truncateNumber(reviewsCount),
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
    });
  }, [
    theatreShowTgid,
    experienceName,
    activeCurrencyCode,
    averageRating,
    reviewsCount,
    finalPrice,
  ]);

  const handleCheckAvailabilityClick = useCallback(() => {
    const selectedTour = toursAgainstDates[selectedTourDate]?.[timeSlotIndex];
    const { startTime } = selectedTour ?? {};
    const checkAvailabilityUrl = createBookingURL({
      lang,
      currency: activeCurrencyCode,
      tgid: theatreShowTgid,
      promoCode: null,
      date: { startDate: selectedTourDate, ...(startTime && { startTime }) },
      isMobile,
      nakedDomain: 'london-theater-tickets.com',
      redirectToHeadoutBookingFlow: false,
    });

    addCheckAvailabilityClickedDataEvents();
    window.location.href = checkAvailabilityUrl;
  }, [
    toursAgainstDates,
    selectedTourDate,
    timeSlotIndex,
    activeCurrencyCode,
    theatreShowTgid,
    lang,
    isMobile,
    addCheckAvailabilityClickedDataEvents,
  ]);

  if (isMobile) {
    const localisedActualPrice = getLocalisedPrice({
      price: finalPrice,
      currencyCode: activeCurrencyCode,
      lang,
      currencyList,
      truncateIfLong: true,
      truncateAfter: 3,
    });
    const localiseStartingPrice = getLocalisedPrice({
      price: finalPrice,
      currencyCode: activeCurrencyCode,
      lang,
      currencyList,
      truncateIfLong: true,
      truncateAfter: 3,
    });

    return (
      <FixedTourInfoBannerWrapper $isHidden={!isFirstScroll}>
        <TourInfoBanner key={'cookie-banner'}>
          <TourDescriptor isMobile={true}>
            <TourImageWrapper>
              <Image
                url={verticalImageUrl}
                style={{
                  maxHeight: 60,
                  aspectRatio: '10 / 16',
                  borderRadius: '4px',
                }}
                alt={`name poster`}
                className="image-container"
              />
            </TourImageWrapper>
            <TourDescriptorContent>
              <div className="rating-container">
                <div className="product-rating">
                  <Conditional if={showRatings}>
                    <StarSvg className="star-svg" />
                  </Conditional>
                  <Conditional if={!!averageRating}>
                    <LSpan>{averageRating?.toFixed(1)}</LSpan>
                  </Conditional>
                </div>
                <Conditional if={ratingsPresent}>
                  <Reviews>({truncateNumber(reviewsCount)})</Reviews>
                </Conditional>
              </div>
              <ExperienceName isMobile={true}>{experienceName}</ExperienceName>
            </TourDescriptorContent>
          </TourDescriptor>
          <HR bgColor={'#F0F0F0'} />
          <ActionContainer>
            <TourPriceInfo>
              <span className="starting-price">
                from {localiseStartingPrice}
              </span>
              <div className="cashback-container">
                <p className="actual-price">{localisedActualPrice}</p>
                <Conditional if={bestDiscount > 0}>
                  <span className="discount">
                    {cashbackValue}
                    {cashbackType === 'PERCENTAGE' && '%'} Cashback
                  </span>
                </Conditional>
              </div>
            </TourPriceInfo>
            <CheckAvailability onClick={handleCheckAvailabilityClick}>
              <span>Find best seats</span>
            </CheckAvailability>
          </ActionContainer>
        </TourInfoBanner>
      </FixedTourInfoBannerWrapper>
    );
  }

  if (isLoading) return <SideBarSkeleton />;

  return (
    <SideBarWrapper>
      <SideBarTop>
        <TourDescriptor>
          <Image
            url={verticalImageUrl}
            style={{
              maxHeight: 60,
              aspectRatio: '10 / 16',
              borderRadius: '4px',
            }}
            alt={`name poster`}
            className="image-container"
          />
          <TourDescriptorContent>
            <div className="rating-container">
              <div className="product-rating">
                <Conditional if={showRatings}>
                  <StarSvg className="star-svg" />
                </Conditional>
                <LSpan>{showRatings ? averageRating.toFixed(1) : '4.6k'}</LSpan>
              </div>
              <Conditional if={ratingsPresent}>
                <Reviews>({truncateNumber(reviewsCount)})</Reviews>
              </Conditional>
            </div>
            <Link href={showPageLink}>
              <ExperienceName>{experienceName}</ExperienceName>
            </Link>

            <div className="experience-location">
              <LocationPinIcon /> {startLocation.addressLine1}
            </div>
          </TourDescriptorContent>
        </TourDescriptor>
        <DateSelection isSingleDate={false} isSingleTime={false}>
          <Conditional if={true}>
            <SelectDateTitleBlock>
              <h2>Select date</h2>

              <p>
                All prices are in {activeCurrencyCode} ({localSymbol})
              </p>
            </SelectDateTitleBlock>
            <HorizontalDateList>
              {tourDatesToShow.map((tourDate) => {
                const tourDateObj = new Date(tourDate);
                const tourDayIndex = tourDateObj.getDay();
                const tourDay = weekDaysShort[tourDayIndex];
                const tourMonthIndex = tourDateObj.getMonth();
                const tourShortMonth = longMonthtoShort({
                  fullMonth: MONTHS[tourMonthIndex],
                  lang,
                });
                const isDisabled = !calendarData?.dates[tourDate];
                const { listingPrice } = calendarData?.dates[tourDate] ?? {};
                const localizedPrice =
                  activeCurrencyCode &&
                  getLocalisedPrice({
                    price: Number(listingPrice),
                    currencyCode: activeCurrencyCode,
                    lang,
                    currencyList,
                  });

                return (
                  <TourDateButton
                    onClick={() =>
                      handleSelectTourDate({
                        isDisabled,
                        tourDate,
                        isMinPrice: listingPrice <= medianPrice,
                      })
                    }
                    isSelected={selectedTourDate === tourDate}
                    isDisabled={isDisabled}
                    key={tourDate}
                    isMinPrice={listingPrice <= medianPrice}
                  >
                    <p>{tourDay} </p>
                    <p className="tourMonth">
                      {tourShortMonth} {tourDateObj.getDate()}{' '}
                    </p>
                    <Conditional if={listingPrice}>
                      <p className="tourPrice">{localizedPrice}</p>
                    </Conditional>
                  </TourDateButton>
                );
              })}
              <MoreTourDates onClick={handleShowCalendar}>
                <PracticalInfoCalendar color={COLORS.GRAY.G3} />
                <p>
                  More <br /> Dates
                </p>
              </MoreTourDates>

              <Calendar
                variantId={variantId}
                tgid={theatreShowTgid}
                variantName={''}
                tourGroupName={''}
                isMobile={isMobile}
                isActive={showCalendar}
                onDateClick={({ date }: { date: string; priceTag: string }) => {
                  setTourStartDate(date);
                  setShowCalendar(false);
                  addExperienceDateSelectedDataEvents({
                    selectedTourDate: date,
                    isCalendar: true,
                    isUser: true,
                  });
                }}
                onClickout={() => {
                  setShowCalendar(false);
                  addCalendarToggleDataEvents(false);
                }}
                currency={activeCurrencyCode}
                setIsLoading={() => {}}
              />
            </HorizontalDateList>
          </Conditional>
        </DateSelection>
        <HR />
        <TimeSelection
          selectedTourDate={selectedTourDate}
          tourStartDate={tourStartDate}
          activeCurrencyCode={activeCurrencyCode}
          currencyList={currencyList}
          lang={lang}
          host={host}
          tgid={theatreShowTgid}
          handleCheckAvailabilityClick={handleCheckAvailabilityClick}
          timeSlotIndex={timeSlotIndex}
          setTimeSlotIndex={setTimeSlotIndex}
          toursAgainstDates={toursAgainstDates}
          setToursAgainstDates={setToursAgainstDates}
        />
      </SideBarTop>
    </SideBarWrapper>
  );
};

const TimeSelection = (props: any) => {
  const {
    selectedTourDate,
    tourStartDate,
    activeCurrencyCode,
    lang,
    currencyList,
    tgid,
    handleCheckAvailabilityClick,
    timeSlotIndex,
    setTimeSlotIndex,
    toursAgainstDates = {},
    setToursAgainstDates,
  } = props;

  const availableToursDateUrl = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupInventoriesV7,
    id: tgid,
    params: {
      'from-date': tourStartDate,
      'to-date': getDateXDaysAhead({ startDate: tourStartDate, daysAhead: 7 }),
      currency: activeCurrencyCode,
      'use-seatmap-prices': 'true',
    },
  });

  const { data: tourAvailabilities } = useSWR(availableToursDateUrl, {
    fetcher: swrFetcher,
  });

  const addExperienceTimeSelectedDataEvents = ({
    tourStartTime,
    hasSellingOutFast,
    isUser = false,
  }: {
    tourStartTime: string;
    hasSellingOutFast: boolean;
    isUser?: boolean;
  }) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_TIME_SELECTED,
      [ANALYTICS_PROPERTIES.EXPERIENCE_TIME]: tourStartTime,
      [ANALYTICS_PROPERTIES.HAS_SELLING_OUT_FAST_DESCRIPTOR]: hasSellingOutFast
        ? 'Yes'
        : 'No',
      [ANALYTICS_PROPERTIES.TRIGGERED_BY]: isUser ? 'User' : 'Automatic',
    });
  };

  useEffect(() => {
    if (!toursAgainstDates[selectedTourDate]?.length) {
      return;
    }

    const availableTour = toursAgainstDates[selectedTourDate][0];
    const { startTime, paxAvailability } = availableTour ?? {};
    const availability = paxAvailability[0]?.availability;
    addExperienceTimeSelectedDataEvents({
      tourStartTime: startTime,
      hasSellingOutFast: availability === 'LIMITED',
    });
  }, []);

  useEffect(() => {
    setTimeSlotIndex && setTimeSlotIndex(0);
  }, [selectedTourDate, setTimeSlotIndex]);

  useEffect(() => {
    const { availabilities } = tourAvailabilities ?? {};
    if (availabilities) {
      const availableToursAgainstDates = getToursAgainstDates(availabilities);

      setToursAgainstDates(availableToursAgainstDates);
    }
  }, [tourAvailabilities, setToursAgainstDates]);

  const handleTourTimeSlotClick = ({
    tourIndex,
    tourStartTime,
    hasSellingOutFast,
  }: {
    tourIndex: number;
    tourStartTime: string;
    hasSellingOutFast: boolean;
  }) => {
    setTimeSlotIndex(tourIndex);
    addExperienceTimeSelectedDataEvents({
      tourStartTime,
      hasSellingOutFast,
      isUser: true,
    });
  };

  return (
    <StyledTimeSelection>
      <Conditional if={toursAgainstDates[selectedTourDate]?.length > 0}>
        <h2 className="sectionTitle">Select a time</h2>
        <TourTimeSlotContainer>
          {toursAgainstDates[selectedTourDate]?.map(
            (availableTour: any, index: number) => {
              const { startTime, priceProfile, paxAvailability } =
                availableTour ?? {};
              const formattedStartTime = getHumanReadableTime({
                formattedTime: startTime,
                lang,
              });
              const { persons } = priceProfile ?? {};
              const price = persons[0]?.retailPrice;
              const availability = paxAvailability[0]?.availability;
              const localizedPrice = getLocalisedPrice({
                price,
                currencyCode: activeCurrencyCode,
                lang,
                currencyList,
              });
              return (
                <StyledTourTimeSlot
                  key={index}
                  isSelected={timeSlotIndex === index}
                  onClick={() =>
                    handleTourTimeSlotClick({
                      tourIndex: index,
                      tourStartTime: formattedStartTime,
                      hasSellingOutFast: availability === 'LIMITED',
                    })
                  }
                >
                  <div className="left">
                    <p className="tourStartTime">{formattedStartTime}</p>
                    <p className="sellingOutFast">
                      {availability === 'LIMITED' &&
                        `🔥 ${BoosterType.SELLING_OUT_FAST}`}
                    </p>
                  </div>
                  <div className="right">
                    <p className="originalPrice">{localizedPrice}</p>
                  </div>
                </StyledTourTimeSlot>
              );
            }
          )}
        </TourTimeSlotContainer>
        <CheckAvailability onClick={handleCheckAvailabilityClick}>
          <span>Find best seats</span>
        </CheckAvailability>
      </Conditional>
    </StyledTimeSelection>
  );
};

const LSpan = ({ id, className, onClick, children, style, testId }: any) => (
  <RatingCount
    {...(testId && { 'data-testid': testId })}
    id={id}
    className={`notranslate ${className || ''}`}
    onClick={onClick}
    style={style}
  >
    {children}
  </RatingCount>
);

const SideBarSkeleton = () => {
  return (
    <SideBarTop>
      <SkeletonTheme baseColor={COLORS.GRAY.G8} highlightColor={COLORS.GRAY.G6}>
        <TourDescriptor>
          <span className="image-placeholder image-container">
            <VerticalProductImagePlaceholder
              $height={77}
              $width={77 * VERTICAL_IMAGE_ASPECT_RATIO}
            />
          </span>

          <TourDescriptorContentSkeleton>
            <Skeleton width="4rem" height="1rem" borderRadius="2px" />
            <Skeleton width="8rem" height="1rem" borderRadius="2px" />
            <Skeleton width="6rem" height="1rem" borderRadius="2px" />
          </TourDescriptorContentSkeleton>
        </TourDescriptor>
        <DateSelectionSkeleton>
          <div>
            <Skeleton width="7rem" height="1rem" borderRadius="2px" />
            <Skeleton width="10rem" height="1rem" borderRadius="2px" />
          </div>

          <HorizontalDateList>
            {Array.apply(null, Array(4)).map((_item: any, index: number) => {
              return (
                <div key={`dateItemSkeleton-${index}`}>
                  <Skeleton width="3rem" height="1rem" borderRadius="2px" />
                  <Skeleton width="3rem" height="1rem" borderRadius="2px" />
                  <Skeleton width="3rem" height="1rem" borderRadius="2px" />
                </div>
              );
            })}
            <MoreTourDates>
              <Skeleton width="1.5rem" height="1rem" borderRadius="2px" />
              <Skeleton width="3rem" height="2rem" borderRadius="2px" />
            </MoreTourDates>
          </HorizontalDateList>
        </DateSelectionSkeleton>
        <HR />
        <StyledTimeSelection>
          <Skeleton width="10rem" height="1.25rem" borderRadius="2px" />
          {Array.apply(null, Array(3)).map((_item: any, index: number) => {
            return (
              <div key={`timeSelectionSkeleton-${index}`} className="tour-tag">
                <Skeleton width="100%" height="3.5rem" borderRadius="2px" />
              </div>
            );
          })}
        </StyledTimeSelection>
      </SkeletonTheme>
    </SideBarTop>
  );
};

export default SideBar;
