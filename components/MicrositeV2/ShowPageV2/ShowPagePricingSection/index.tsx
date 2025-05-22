import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { Box, Button, Text } from '@headout/eevee';
import { css, cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import HorizontalProductCard from 'components/MicrositeV2/EntertainmentMBLandingPageV2/ProductCards/HorizontalProductCard';
import { TShowPagePricingSectionProps } from 'components/MicrositeV2/ShowPageV2/ShowPagePricingSection/interface';
import {
  BuyButtonWrapper,
  Pricing,
  PricingSection,
  SavePercentElement,
  ShowPageDateSelectorWrapper,
} from 'components/MicrositeV2/ShowPageV2/ShowPagePricingSection/style';
import { getUnavailableTicketStylesRecipe } from 'components/MicrositeV2/ShowPageV2/ShowPagePricingSection/ticketUnavailableStyles';
import { getCurrentDate } from 'components/SeatMapPage/components/SideBar/utils';
import LocalisedPrice from 'UI/LPrice';
import { MBContext } from 'contexts/MBContext';
import useABTesting from 'hooks/useABTesting';
import { useHistoryTraversal } from 'hooks/useHistoryTraversal';
import useOnScreen from 'hooks/useOnScreen';
import { createBookingURL, getNakedDomain, getTagPageMap } from 'utils';
import { trackEvent } from 'utils/analytics';
import { formatInMonthTitleFormat } from 'utils/dateUtils';
import { checkIfLTTMB, getHostName } from 'utils/helper';
import { currencyAtom } from 'store/atoms/currency';
import { hsidAtom } from 'store/atoms/hsid';
import { metaAtom } from 'store/atoms/meta';
import { VARIANTS } from 'const/experiments';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  BUTTON_LOADING_DURATION,
  CASHBACK_TYPES,
  CTA_TYPE,
} from 'const/index';
import { strings } from 'const/strings';
import BanSvg from 'assets/banSvg';
import VerticalProductImagePlaceholder from 'assets/verticalProductImagePlaceholder';
import { useIsLTTShowPageExperiementEnabled } from '../hooks/useIsLTTShowPageExperiementEnabled';
import { useFetchCalendarData } from '../SingleCalendar/hooks/useFetchCalendarData';
import SingleCalendar from '../SingleCalendar/SingleCalendar';
import { TimeList } from '../SingleCalendar/TimeList/TimeList';
import RiveShowPageCTA from './RiveCTA';

const ShowPagePricingSection = ({
  tourGroupData,
  flowType,
  moreShows,
  primarySubCategory,
  fromDate,
  toDate,
  variantId,
}: TShowPagePricingSectionProps) => {
  const router = useRouter();
  const { query } = router;
  const defaultTimeSlotIndex = query.timeSlot
    ? parseInt(query.timeSlot as string)
    : 0;
  const defaultSelectedDate = query.date as string;

  const [isButtonLoading, setButtonLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSkeletonVisible, setIsSkeletonVisible] = useState(true);
  const [horProductCardLoadedCount, setHorProductCardLoadedCount] = useState(0);
  const [isRiveVisible, setIsRiveVisible] = useState(false);
  const [selectedTourDate, setSelectedTourDate] = useState(defaultSelectedDate);
  const [tourStartDate, setTourStartDate] = useState(
    defaultSelectedDate ?? getCurrentDate()
  );
  const [selectedTimeSlotIndex, setSelectedTimeSlotIndex] =
    useState(defaultTimeSlotIndex);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | undefined>(
    undefined
  );
  const [showTimeList, setShowTimeList] = useState(true);
  const dateSelectorWrapperRef = useRef<HTMLDivElement>(null);
  const buyButtonWrapperRef = useRef<HTMLDivElement>(null);
  const handleChildLoaded = () => {
    setHorProductCardLoadedCount((prevCount) => prevCount + 1);
  };

  const totalChildren = 2;

  useEffect(() => {
    if (horProductCardLoadedCount === totalChildren) {
      setIsSkeletonVisible(false);
    }
  }, [horProductCardLoadedCount, totalChildren]);

  const currency = useRecoilValue(currencyAtom);
  const { collectionId: refererCollectionId } = useRecoilValue(metaAtom);

  const {
    lang,
    isDev,
    host,
    nakedDomain,
    biLink,
    redirectToHeadoutBookingFlow,
    uid,
  } = useContext(MBContext);

  const { isShowPageExperiment } = useIsLTTShowPageExperiementEnabled(uid);

  const { id: tgid, listingPrice } = tourGroupData;
  const {
    originalPrice,
    finalPrice,
    cashbackValue,
    cashbackType,
    currencyCode,
  } = listingPrice ?? {};

  const totalDiscount = Number(
    (((originalPrice - finalPrice) / originalPrice) * 100).toFixed(2)
  );
  const showCashbackElement =
    cashbackValue > 0 && cashbackType === CASHBACK_TYPES.PERCENTAGE;

  const hostname = getHostName(isDev, host);

  const {
    TicketsUnavailableSection,
    TicketsUnavailableHeaderDweb,
    TicketsUnavailableTextWrapper,
    SvgWrapper,
    AlternativeShowRecommendationSection,
    TicketsUnavailableText,
    TicketsUnavailableSubText,
    MustSeeHeading,
    MoreShowsButtonWrapper,
    TicketsUnavailableHeaderCommon,
    ticketUnavailableDummyCard,
    ticketUnavailableDummyText,
    ticketUnavailableDummyHeading,
    ticketUnavailableDummyPrice,
  } = getUnavailableTicketStylesRecipe();

  useEffect(() => {
    setButtonLoading(false);
  }, []);

  const hsid = useRecoilValue(hsidAtom);
  const checkAvailabilityButtonRef = useRef<HTMLButtonElement>(null);

  const bookingUrl = createBookingURL({
    nakedDomain: nakedDomain || getNakedDomain(hostname),
    lang,
    tgid,
    refererCollectionId,
    biLink: biLink,
    redirectToHeadoutBookingFlow,
    currency,
    flowType,
    hsid,
    date: isShowPageExperiment
      ? {
          startDate: selectedTourDate,
          startTime: selectedTimeSlot,
        }
      : undefined,
  });

  useHistoryTraversal({
    action: () => {
      setButtonLoading(false);
    },
  });

  const LTT_TAG_PAGE_MAP = getTagPageMap(uid);
  const moreShowsCategoryUrl = LTT_TAG_PAGE_MAP[primarySubCategory?.name];

  const onCheckAvailabilityClicked = () => {
    const hasDiscountElement = totalDiscount > 0 || showCashbackElement;

    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.DISCOUNT]: originalPrice > finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currency,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: hasDiscountElement
        ? CTA_TYPE.BIG_CTA
        : CTA_TYPE.SMALL_CTA,
    });

    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), BUTTON_LOADING_DURATION);
    window.open(bookingUrl, '_self', 'noopener');
  };

  const handleMoreShowsCTAClicked = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.SEE_MORE_SHOWS,
      [ANALYTICS_PROPERTIES.SECTION]: 'Tickets Unavailable',
    });

    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), BUTTON_LOADING_DURATION);
  };

  const {
    variant: lttCTAExperimentVariant,
    isExperimentResolving,
    isEligible,
  } = useABTesting({
    experimentId: 'LTT_CTA_COPY_EXPERIMENT',
    customEligibilityCheckFn: () => checkIfLTTMB(uid),
    noTrack: true,
  });

  const buyButtonText =
    lttCTAExperimentVariant === VARIANTS.TREATMENT
      ? strings.SELECT_SEATS
      : strings.CHECK_AVAIL;

  const buttonType =
    (isEligible && isExperimentResolving) || isButtonLoading
      ? 'loading'
      : 'default';

  const isBuyButtonInViewport = useOnScreen({
    ref: buyButtonWrapperRef,
    options: {
      threshold: 1,
    },
  });

  const { isValidating, inventoryListsMap, medianPrice } = useFetchCalendarData(
    {
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
    }
  );

  const updateQueryParamsWithDateAndTimeSlot = (
    date: string,
    timeSlot: number
  ) => {
    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          date,
          timeSlot,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      <ShowPageDateSelectorWrapper
        ref={dateSelectorWrapperRef}
        $isShowPageExperiment={isShowPageExperiment}
        $showTimeList={showTimeList}
      >
        <Conditional if={isShowPageExperiment}>
          <SingleCalendar
            hidePrice={false}
            showTimeList={showTimeList}
            selectedTourDate={selectedTourDate}
            inventoryListsMap={inventoryListsMap}
            medianPrice={medianPrice}
            type="calendar"
            onDateSelected={(fullDateAsString: string) => {
              // bring entire calendar into viewport
              if (!isBuyButtonInViewport) {
                dateSelectorWrapperRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }
              setSelectedTourDate(fullDateAsString);
              setTourStartDate(fullDateAsString);
              setSelectedTimeSlotIndex(0);
              setShowTimeList(true);
              updateQueryParamsWithDateAndTimeSlot(fullDateAsString, 0);
              trackEvent({
                eventName: ANALYTICS_EVENTS.EXPERIENCE_DATE_SELECTED,
                [ANALYTICS_PROPERTIES.EXPERIENCE_DATE]: fullDateAsString,
                [ANALYTICS_PROPERTIES.TRIGGERED_BY]: 'User',
              });
            }}
            onMonthNavigated={(currVisibleMonth: string) => {
              if (
                currVisibleMonth ===
                formatInMonthTitleFormat(selectedTourDate, lang)
              ) {
                setShowTimeList(true);
              } else {
                setShowTimeList(false);
              }
            }}
          />
          <Box
            className={css({
              transform: showTimeList ? 'scaleY(1)' : 'scaleY(0)',
              transformOrigin: 'top',
              height: showTimeList ? 'auto' : '0',
              visibility: showTimeList ? 'visible' : 'hidden',
              transition: showTimeList
                ? 'transform 0.3s cubic-bezier(0.7, 0, 0.3, 1) !important'
                : 'none',
            })}
          >
            <TimeList
              tgid={tgid}
              tourStartDate={tourStartDate}
              activeCurrencyCode={currencyCode ?? ''}
              loading={isLoading}
              selectedTourDate={selectedTourDate}
              selectedTimeSlotIndex={selectedTimeSlotIndex}
              setSelectedTimeSlotIndex={setSelectedTimeSlotIndex}
              setSelectedTimeSlot={setSelectedTimeSlot}
              onTimeSlotClick={(index: number) => {
                updateQueryParamsWithDateAndTimeSlot(selectedTourDate, index);
              }}
              defaultSelectedTimeSlotIndex={defaultTimeSlotIndex}
            />
            <BuyButtonWrapper $isShowPageExperiment ref={buyButtonWrapperRef}>
              <Button
                tabIndex={0}
                disabled={
                  !inventoryListsMap || isValidating || !selectedTourDate
                }
                as="button"
                btnType="primary"
                onClick={onCheckAvailabilityClicked}
                primaryText={strings.SELECT_SEATS}
                size="medium"
                state={buttonType}
                variant="primary"
                ref={checkAvailabilityButtonRef}
              />
            </BuyButtonWrapper>
          </Box>
        </Conditional>
        <Conditional if={listingPrice && !isShowPageExperiment}>
          <PricingSection>
            <Pricing>
              <div className="pricing">
                <div className="scratch-price">
                  <span className="price-starting-from">
                    {strings.FROM?.toLowerCase()}{' '}
                  </span>
                  <Conditional if={originalPrice > finalPrice}>
                    <LocalisedPrice
                      currencyCode={currencyCode ?? currency ?? ''}
                      lang={lang}
                      price={originalPrice}
                      className="original-price"
                      truncateIfLong={true}
                      truncateAfter={3}
                    />
                  </Conditional>
                </div>
                <div className="price">
                  <LocalisedPrice
                    currencyCode={currencyCode ?? currency ?? ''}
                    lang={lang}
                    price={finalPrice}
                  />
                  <Conditional if={totalDiscount > 0}>
                    <SavePercentElement>
                      {strings.formatString(
                        strings.SAVE_UPTO_PERCENT,
                        `${totalDiscount}`
                      )}
                    </SavePercentElement>
                  </Conditional>

                  <Conditional if={totalDiscount <= 0 && showCashbackElement}>
                    <SavePercentElement>
                      {strings.formatString(
                        strings.CASHBACK,
                        `${cashbackValue}`
                      )}
                    </SavePercentElement>
                  </Conditional>
                </div>
              </div>
            </Pricing>
            <BuyButtonWrapper className={isRiveVisible ? 'withRive' : ''}>
              <Conditional if={!isRiveVisible}>
                <Button
                  tabIndex={0}
                  as="button"
                  btnType="primary"
                  onClick={onCheckAvailabilityClicked}
                  primaryText={buyButtonText}
                  size="medium"
                  state={buttonType}
                  variant="primary"
                />
              </Conditional>
              <RiveShowPageCTA
                onClick={onCheckAvailabilityClicked}
                onRiveVisible={(status: boolean) => setIsRiveVisible(status)}
                primaryText={buyButtonText}
                tgid={tgid}
                primarySubCatId={primarySubCategory?.id}
              />
            </BuyButtonWrapper>
          </PricingSection>
        </Conditional>
        <Conditional if={!listingPrice && !isShowPageExperiment}>
          <div className={TicketsUnavailableSection}>
            <div
              className={cx(
                TicketsUnavailableHeaderDweb,
                TicketsUnavailableHeaderCommon
              )}
            >
              <div className={SvgWrapper}>
                <BanSvg />
              </div>
              <div className={TicketsUnavailableTextWrapper}>
                <Text className={TicketsUnavailableText}>
                  {strings.SHOW_PAGE_V2.TICKETS_UNAVAILABLE}
                </Text>
                <Text className={TicketsUnavailableSubText}>
                  {strings.SHOW_PAGE_V2.TICKETS_UNAVAILABLE_SUBTEXT}
                </Text>
              </div>
            </div>
            <div className={AlternativeShowRecommendationSection}>
              <Text className={MustSeeHeading}>
                {strings.SHOW_PAGE_V2.MUST_SEE_SHOWS}
              </Text>
              {moreShows?.map((show: Record<string, any>) => {
                return (
                  <HorizontalProductCard
                    key={show.id}
                    product={{ ...show, title: show.name }}
                    background="LIGHT"
                    isTopShowsSection={false}
                    handleChildLoaded={handleChildLoaded}
                  />
                );
              })}
              <Conditional if={isSkeletonVisible}>
                {Array.from({ length: totalChildren }, (_, index) => (
                  <div
                    className={ticketUnavailableDummyCard}
                    key={`image-placeholder-${index}`}
                  >
                    <VerticalProductImagePlaceholder
                      $width={88}
                      $height={131}
                    />
                    <div className={ticketUnavailableDummyText}>
                      <div className={ticketUnavailableDummyHeading}></div>
                      <div className={ticketUnavailableDummyPrice}></div>
                    </div>
                  </div>
                ))}
              </Conditional>
              <div className={MoreShowsButtonWrapper}>
                <Button
                  as="anchor"
                  target="_blank"
                  href={moreShowsCategoryUrl}
                  btnType="black"
                  onClick={handleMoreShowsCTAClicked}
                  primaryText={strings.SHOW_PAGE_V2.SEE_ALL_SHOWS}
                  state={'default'}
                  size="medium"
                  variant="secondary"
                />
              </div>
            </div>
          </div>
        </Conditional>
      </ShowPageDateSelectorWrapper>
    </>
  );
};

export default ShowPagePricingSection;
