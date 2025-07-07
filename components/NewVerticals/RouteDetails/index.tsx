import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import { IItinerary } from '@headout/espeon/components/Itinerary';
import Conditional from 'components/common/Conditional';
import Loader from 'components/common/Loader';
import { SECTION_NAMES } from 'components/HOHO/constants';
import { BookNowCta } from 'components/Product/components/BookNowCta';
import {
  CTABlock,
  CTAContainer,
  PopupPricingUnit,
  PriceContainer,
} from 'components/Product/styles';
import TabWrapper from 'components/slices/TabWrapper';
import PriceBlock from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PRODUCT_CARD_REVAMP,
} from 'const/index';
import en from 'const/localization/en';
import { strings } from 'const/strings';
import BackArrow from 'assets/backArrow';
import CloseIcon from 'assets/closeIcon';
import { SideModal } from './RouteInfo/styles';
import { TRouteDetails } from './interface';
import RouteInfo from './RouteInfo';
import { HeadingContainer, MainContainer, PricingContainer } from './styles';

const RouteDetails = (props: TRouteDetails) => {
  const { lang } = useContext(MBContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  const {
    closePopup,
    isMobile,
    tourGroupName,
    tgid,
    rank,
    listingPrice,
    bookingUrl,
    setIsSideDrawerOpen,
    isCruise = false,
    itineraryData = [],
    isDescriptorClick,
    isSightsCoveredLayout = false,
  } = props;

  const itineraryEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.ItinerariesByTGID,
    id: tgid,
    params: {
      sections: 'true',
    },
  });
  const showSightsCoveredLayout = isCruise || isSightsCoveredLayout;

  let { data: fetchedItineraryData } = useSWR(
    !isCruise || !isSightsCoveredLayout ? itineraryEndpoint : null,
    {
      fetcher: swrFetcher,
    }
  );
  const { itineraries } = fetchedItineraryData || {};

  useEffect(() => {
    if (showSightsCoveredLayout || fetchedItineraryData) {
      setIsLoading(false);
    }
  }, [fetchedItineraryData]);

  const tabs = showSightsCoveredLayout
    ? itineraryData
    : (itineraries as IItinerary[]);
  const sectionName = showSightsCoveredLayout
    ? en.CRUISES.BOARDING_POINTS
    : SECTION_NAMES.STOPS_AND_ATTRACTIONS;

  const tabsArray = tabs?.map((route, index: number) => {
    const {
      id: itineraryId,
      name: itineraryName,
      details: { routeName = '' } = {},
    } = route || {};

    const sideModalHeading = showSightsCoveredLayout
      ? tabs?.length > 1
        ? `${itineraryName}: ${strings.CRUISES.BOARDING_POINTS}`
        : strings.CRUISES.BOARDING_POINTS
      : `${routeName}: ${strings.HOHO.STOPS_AND_ATTRACTIONS}`;

    return {
      children: (
        <>
          <RouteInfo
            tgid={tgid}
            rank={rank}
            openRoutesTimeline={() => {
              setIsOpen(true);
              setTimeout(() => {
                setIsSideDrawerOpen(true);
              }, 200);
              trackEvent({
                eventName: ANALYTICS_EVENTS.ITINERARY_CTA_CLICKED,
                [ANALYTICS_PROPERTIES.CTA_TYPE]: 'View More',
                [ANALYTICS_PROPERTIES.LABEL]: sectionName,
                [ANALYTICS_PROPERTIES.ITINERARY_NAME]: routeName,
              });
            }}
            isMobile={isMobile}
            routeData={route}
            setIsHeaderSticky={setIsHeaderSticky}
            isDescriptorClick={isDescriptorClick}
            isCruise={isCruise}
            isSightsCoveredLayout={isSightsCoveredLayout}
          />
          <SideModal key={routeName}>
            <MainContainer $isTimelineModal={true} $showSideModal={isOpen}>
              <HeadingContainer
                $isTimelineModal={true}
                $isHeaderSticky={isHeaderSticky}
              >
                <BackArrow
                  onClick={() => {
                    setIsOpen(false);
                    setTimeout(() => {
                      setIsSideDrawerOpen(false);
                    }, 200);
                    trackEvent({
                      eventName: ANALYTICS_EVENTS.BACK_BUTTON_CLICKED,
                      [ANALYTICS_PROPERTIES.SECTION]: sectionName,
                      [ANALYTICS_PROPERTIES.ITINERARY_NAME]: routeName,
                    });
                  }}
                  height={16}
                  width={16}
                />
                <h3>{sideModalHeading}</h3>
              </HeadingContainer>
              <RouteInfo
                tgid={tgid}
                rank={rank}
                openRoutesTimeline={() => {
                  setIsOpen(true);
                  setTimeout(() => {
                    setIsSideDrawerOpen(true);
                  }, 200);
                }}
                showRoutesTimeline={true}
                isSideModalOpen={isOpen}
                isMobile={isMobile}
                routeData={route}
                setIsHeaderSticky={setIsHeaderSticky}
                isDescriptorClick={isDescriptorClick}
                isCruise={isCruise}
                isSightsCoveredLayout={isSightsCoveredLayout}
              />
            </MainContainer>
          </SideModal>
        </>
      ),
      heading: routeName || itineraryName,
      trackingObject: {
        eventName: ANALYTICS_EVENTS.ITINERARY_VARIANT_CLICKED,
        [ANALYTICS_PROPERTIES.ITINERARY_ID]: itineraryId,
        [ANALYTICS_PROPERTIES.ITINERARY_NAME]: routeName,
        [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      },
    };
  });

  const sendBookNowEvent = (placement?: string) => {
    const placementProperty = placement
      ? {
          [ANALYTICS_PROPERTIES.PLACEMENT]: placement,
        }
      : {};
    const { finalPrice, originalPrice, currencyCode } = listingPrice ?? {};
    trackEvent({
      eventName: !isMobile
        ? ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED
        : ANALYTICS_EVENTS.EXPERIENCE_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.DISCOUNT]: originalPrice > finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currencyCode,
      ...placementProperty,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
      [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: tourGroupName,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
    });
  };

  return (
    <>
      <MainContainer
        $showLoader={isLoading}
        $showSideModal={isOpen}
        $noStickyCta={showSightsCoveredLayout}
        $noTabs={tabs?.length < 2}
      >
        <Conditional if={isLoading}>
          <Loader />
        </Conditional>
        <Conditional if={!isLoading}>
          <Conditional if={!isMobile}>
            <HeadingContainer>
              <h3>{tourGroupName}</h3>
              <CloseIcon onClick={closePopup} />
            </HeadingContainer>
          </Conditional>
          <TabWrapper
            tabElements={tabsArray}
            renderTabElements={true}
            showDropShadow={true}
          />
        </Conditional>
        <Conditional if={!isCruise && !isSightsCoveredLayout && !isLoading}>
          <PricingContainer $noDiscount={!listingPrice?.bestDiscount}>
            <PopupPricingUnit>
              <CTAContainer>
                <PriceContainer>
                  <PriceBlock
                    isMobile={isMobile}
                    showScratchPrice={true}
                    listingPrice={listingPrice}
                    lang={lang}
                    showSavings
                    id={tgid}
                    prefix
                    key={'price-block'}
                    newDiscountTagDesignProps={{ shouldPointLeft: !isMobile }}
                  />
                </PriceContainer>
                <CTABlock isSticky={false}>
                  <BookNowCta
                    clickHandler={() => {
                      sendBookNowEvent(PRODUCT_CARD_REVAMP.PLACEMENT.POPUP);
                    }}
                    isMobile={isMobile}
                    ctaText={strings.CHECK_AVAIL}
                    showLoadingState={false}
                    bookingUrl={bookingUrl}
                    anchorTarget={isMobile ? '_self' : '_blank'}
                    anchorRel="nofollow noreferrer"
                  />
                </CTABlock>
              </CTAContainer>
            </PopupPricingUnit>
          </PricingContainer>
        </Conditional>
      </MainContainer>
    </>
  );
};
export default RouteDetails;
