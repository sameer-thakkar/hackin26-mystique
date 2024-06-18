import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
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
    listingPrice,
    bookingUrl,
    setIsSideDrawerOpen,
  } = props;
  const itineraryEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.ItinerariesByTGID,
    id: tgid,
    params: {
      sections: 'true',
      ...(lang && {
        lang,
      }),
    },
  });

  let { data: itineraryData } = useSWR(itineraryEndpoint, {
    fetcher: swrFetcher,
  });
  const { itineraries: routes } = itineraryData || {};

  useEffect(() => {
    if (itineraryData) {
      setIsLoading(false);
      trackEvent({ eventName: ANALYTICS_EVENTS.ITINERARY_POPUP_VIEWED });
    }
  }, [itineraryData]);

  const tabsArray = routes?.map((route: Record<string, any>, index: number) => {
    const { id: itineraryId, details: { routeName = '' } = {} } = route || {};
    return {
      children: (
        <>
          <RouteInfo
            openRoutesTimeline={() => {
              setIsOpen(true);
              setTimeout(() => {
                setIsSideDrawerOpen(true);
              }, 200);
              trackEvent({
                eventName: ANALYTICS_EVENTS.ITINERARY_CTA_CLICKED,
                [ANALYTICS_PROPERTIES.CTA_TYPE]: 'View More',
                [ANALYTICS_PROPERTIES.LABEL]: 'Stops and nearby attractions',
                [ANALYTICS_PROPERTIES.ITINERARY_NAME]: routeName,
              });
            }}
            isMobile={isMobile}
            routeData={route}
            setIsHeaderSticky={setIsHeaderSticky}
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
                      [ANALYTICS_PROPERTIES.SECTION]:
                        SECTION_NAMES.STOPS_AND_ATTRACTIONS,
                      [ANALYTICS_PROPERTIES.ITINERARY_NAME]: routeName,
                    });
                  }}
                  height={16}
                  width={16}
                />
                <h3>
                  {routeName}: {strings.HOHO.STOPS_AND_ATTRACTIONS}
                </h3>
              </HeadingContainer>
              <RouteInfo
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
              />
            </MainContainer>
          </SideModal>
        </>
      ),
      heading: routeName,
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
      <MainContainer $showLoader={isLoading} $showSideModal={isOpen}>
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
        <Conditional if={!isLoading}>
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
                  <a
                    target={isMobile ? '_self' : '_blank'}
                    href={bookingUrl}
                    rel="nofollow noreferrer"
                  >
                    <BookNowCta
                      clickHandler={() => {
                        sendBookNowEvent(PRODUCT_CARD_REVAMP.PLACEMENT.POPUP);
                      }}
                      isMobile={isMobile}
                      ctaText={strings.CHECK_AVAIL}
                      showLoadingState={false}
                    />
                  </a>
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
