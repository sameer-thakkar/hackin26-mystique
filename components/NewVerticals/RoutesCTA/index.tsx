import { useRef, useState } from 'react';
import Conditional from 'components/common/Conditional';
import Drawer from 'components/common/Drawer';
import PdfPopup from 'components/common/PDF';
import { trackEvent } from 'utils/analytics';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  MORE_DETAILS_SWIPESHEET,
} from 'const/index';
import en from 'const/localization/en';
import { strings } from 'const/strings';
import FoodAndDrink from 'assets/foodAndDrink';
import Landmarks from 'assets/landmarks';
import MapBackground from 'assets/mapBackground';
import MealBackground from 'assets/mealBackground';
import Route from 'assets/route';
import RouteDetails from '../RouteDetails';
import Popup from '../RouteDetails/Popup';
import { TController } from '../RouteDetails/Popup/interface';
import { TRoutesCTA } from './interface';
import { Container, routesDrawerStyles, TextIconContainer } from './styles';

const RoutesCTA = (props: TRoutesCTA) => {
  const pdfPopupController = useRef<TController>();

  const {
    tourGroupName,
    tgid,
    listingPrice,
    bookingUrl,
    isMobile,
    ranking,
    cruiseData,
    popupController,
    isDrawerOpen,
    setIsDrawerOpen,
    isDescriptorClick,
    setIsDescriptorClick,
  } = props;
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const { isCruise, isMealCruise, cruisesItineraryData } = cruiseData || {};

  let ctaText = strings.HOHO.ROUTES;
  let ctaType = en.HOHO.ROUTES;
  if (isCruise) {
    if (isMealCruise) {
      ctaText = strings.CRUISES.MENU;
      ctaType = en.CRUISES.FOOD_MENU;
    } else {
      ctaText = strings.CRUISES.SIGHTS_COVERED;
      ctaType = en.CRUISES.SIGHTS_COVERED;
    }
  }

  const onCTAClick = (e: any) => {
    e?.stopPropagation();
    trackEvent({
      eventName: ANALYTICS_EVENTS.VIEW_ITINERARY_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.RANKING]: ranking,
      [ANALYTICS_PROPERTIES.ITINERARY_TYPE]: ctaType,
    });
    if (isMobile) {
      if (isMealCruise) {
        pdfPopupController.current?.open();
      } else {
        setIsDrawerOpen(true);
      }
    } else {
      if (isMealCruise) {
        pdfPopupController.current?.open();
      } else {
        popupController.current?.open();
      }
    }
  };

  return (
    <>
      <Container onClick={onCTAClick}>
        {isMealCruise ? <MealBackground /> : <MapBackground />}
        <TextIconContainer $isMealVariant={isMealCruise}>
          <Conditional if={isCruise && isMealCruise}>
            <FoodAndDrink
              height={20}
              width={20}
              stroke={COLORS.TEXT.JOY_MUSTARD_3}
            />
          </Conditional>
          <Conditional if={isCruise && !isMealCruise}>
            <Landmarks height={20} width={20} stroke={COLORS.TEXT.PURPS_3} />
          </Conditional>
          <Conditional if={!isCruise}>
            <Route />
          </Conditional>
          <span className="routes-text">{ctaText}</span>
        </TextIconContainer>
      </Container>
      <Conditional if={!isMobile}>
        <Popup controller={popupController} isCruise={isCruise}>
          <RouteDetails
            closePopup={() => {
              popupController.current?.close(true);
              setIsDescriptorClick(false);
            }}
            isMobile={isMobile}
            tourGroupName={tourGroupName}
            tgid={tgid}
            rank={ranking}
            listingPrice={listingPrice}
            bookingUrl={bookingUrl}
            setIsSideDrawerOpen={setIsSideDrawerOpen}
            isCruise={isCruise}
            cruisesItineraryData={cruisesItineraryData}
            isDescriptorClick={isDescriptorClick}
          />
        </Popup>
      </Conditional>
      <Conditional if={isMealCruise}>
        <PdfPopup
          tgid={tgid}
          rank={ranking}
          controller={pdfPopupController}
          pdfData={cruisesItineraryData?.[0]?.details?.cruiseMenus}
          isCTA={true}
          onHide={() => {
            document.body.style.overflow = 'auto';
          }}
        />
      </Conditional>

      <Conditional if={isMobile && isDrawerOpen}>
        <Drawer
          className={`${
            isSideDrawerOpen ? 'side-drawer' : ''
          } route-details-drawer`}
          hideSeparator
          $drawerStyles={routesDrawerStyles}
          heading={tourGroupName}
          closeHandler={() => {
            trackEvent({
              eventName: ANALYTICS_EVENTS.ITINERARY_POPUP_CLOSED,
              [ANALYTICS_PROPERTIES.ACTION]:
                MORE_DETAILS_SWIPESHEET.ACTION.CLOSE_BUTTON,
            });
            setIsDrawerOpen(false);
            setIsSideDrawerOpen(false);
            setIsDescriptorClick(false);
          }}
          slideOutOnClose={true}
        >
          <RouteDetails
            closePopup={() => {
              popupController.current?.close(true);
              setIsDescriptorClick(false);
            }}
            isMobile={isMobile}
            tourGroupName={tourGroupName}
            tgid={tgid}
            rank={ranking}
            listingPrice={listingPrice}
            bookingUrl={bookingUrl}
            setIsSideDrawerOpen={setIsSideDrawerOpen}
            isCruise={isCruise}
            cruisesItineraryData={cruisesItineraryData}
            isDescriptorClick={isDescriptorClick}
          />
        </Drawer>
      </Conditional>
    </>
  );
};
export default RoutesCTA;
