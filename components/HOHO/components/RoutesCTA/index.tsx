import { useRef, useState } from 'react';
import Conditional from 'components/common/Conditional';
import Drawer from 'components/common/Drawer';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  MORE_DETAILS_SWIPESHEET,
} from 'const/index';
import RouteDetails from '../RouteDetails';
import Popup from '../RouteDetails/Popup';
import { TController } from '../RouteDetails/Popup/interface';
import ItineraryEntryPoint from './EntryPoint';
import { TRoutesCTA } from './interface';
import { routesDrawerStyles } from './styles';

const RoutesCTA = (props: TRoutesCTA) => {
  const popupController = useRef<TController>();

  const { tourGroupName, tgid, listingPrice, bookingUrl, isMobile, ranking } =
    props;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);

  const onCTAClick = (e: any) => {
    e?.stopPropagation();
    trackEvent({
      eventName: ANALYTICS_EVENTS.VIEW_ITINERARY_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: 'Itinerary',
      [ANALYTICS_PROPERTIES.LABEL]: 'Route Details',
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.RANKING]: ranking,
    });
    if (isMobile) {
      setIsDrawerOpen(true);
    } else {
      popupController.current?.open();
    }
  };

  return (
    <>
      <ItineraryEntryPoint onClick={onCTAClick} />
      <Conditional if={!isMobile}>
        <Popup controller={popupController}>
          <RouteDetails
            closePopup={() => popupController.current?.close(true)}
            isMobile={isMobile}
            tourGroupName={tourGroupName}
            tgid={tgid}
            listingPrice={listingPrice}
            bookingUrl={bookingUrl}
            setIsSideDrawerOpen={setIsSideDrawerOpen}
          />
        </Popup>
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
          }}
          slideOutOnClose={true}
        >
          <RouteDetails
            closePopup={() => popupController.current?.close(true)}
            isMobile={isMobile}
            tourGroupName={tourGroupName}
            tgid={tgid}
            listingPrice={listingPrice}
            bookingUrl={bookingUrl}
            setIsSideDrawerOpen={setIsSideDrawerOpen}
          />
        </Drawer>
      </Conditional>
    </>
  );
};
export default RoutesCTA;
