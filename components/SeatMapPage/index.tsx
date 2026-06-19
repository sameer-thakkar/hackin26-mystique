import { useContext, useEffect, useState } from 'react';
import { MBContext } from 'contexts/MBContext';
import HeroBanner from './components/HeroBanner';
import InteractiveMap from './components/InteractiveMap';
import SideBar from './components/SideBar';
import { SEATING_MAP } from './constants';
import { TSeatMapPageParams } from './interface';
import { SeatMapBody, SeatMapContainer, SeatMapWrapper } from './styles';

const SeatMapPage = (props: TSeatMapPageParams) => {
  const {
    theatreType,
    isMobile,
    breadcrumbs,
    addVenueSeatsPageSectionViewedDataEvents,
    flashDealSlots,
  } = props;
  const { lang } = useContext(MBContext);
  const [isFirstScroll, setIsFirstScroll] = useState(false);
  const availableShowsTgids = SEATING_MAP.availableShowsTgid[theatreType];
  const theatreShowTgid = availableShowsTgids[0];

  const removeEventListeners = () => {
    document.removeEventListener('scroll', () => {});
  };

  const addEventListeners = () => {
    document.addEventListener('scroll', () => {
      if (!isFirstScroll) {
        setIsFirstScroll(true);
      }
    });
  };

  useEffect(() => {
    addEventListeners();

    return () => {
      removeEventListeners();
    };
  }, []);

  return (
    <SeatMapWrapper>
      <HeroBanner
        breadcrumbs={breadcrumbs}
        isMobile={isMobile}
        theatreType={theatreType}
        addVenueSeatsPageSectionViewedDataEvents={
          addVenueSeatsPageSectionViewedDataEvents
        }
      />
      <SeatMapContainer>
        <SeatMapBody>
          <div className="seatmap-body-left">
            <InteractiveMap
              isFirstScroll={isFirstScroll}
              theatreType={theatreType}
              isMobile={isMobile}
              theatreShowTgid={theatreShowTgid}
              addVenueSeatsPageSectionViewedDataEvents={
                addVenueSeatsPageSectionViewedDataEvents
              }
              flashDealSlots={flashDealSlots}
            />
          </div>
          <div className="seatmap-body-right">
            <SideBar
              isMobile={isMobile}
              isFirstScroll={isFirstScroll}
              theatreShowTgid={theatreShowTgid}
              lang={lang}
            />
          </div>
        </SeatMapBody>
      </SeatMapContainer>
    </SeatMapWrapper>
  );
};

export default SeatMapPage;
