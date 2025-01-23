import { useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChildSection, Section, SECTION_TYPE } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import { BottomSheet } from 'components/common/DraggableBottomSheet';
import { TMapController } from 'components/common/Itinerary/MapView/Map/interface';
import type { TMWebMapViewComponentProps } from 'components/common/Itinerary/MapView/MWebMapView/interface';
import MapViewCard from 'components/common/Itinerary/MapView/MWebMapView/MapCard';
import {
  StyledMWebMapViewContainer,
  StyledMWebMapViewStylesheetContainer,
} from 'components/common/Itinerary/MapView/MWebMapView/styles';
import { getStopLabelText } from 'components/common/Itinerary/StopLabel/utils';
import { useItinerary } from 'contexts/ItineraryContext';
import { debounce } from 'utils/gen';
import {
  checkIfItineraryHasSameStartAndEndPoint,
  sectionDataSanitizer,
} from 'utils/itinerary';
import BackArrow from 'assets/backArrow';

const RouteMap = dynamic(
  () => import('components/common/Itinerary/MapView/Map'),
  {
    ssr: false,
  }
);
const MAP_CAROUSEL_CONTAINER_ID = 'map-carousel-container';

const MWebMapView = ({
  itinerary,
  onCloseBottomSheet,
  onCloseInitBottomSheet,
}: TMWebMapViewComponentProps) => {
  const mapController = useRef<TMapController | null>(null);
  const mapCardsCarouselRef = useRef<HTMLDivElement | null>(null);
  const bottomSheetContainerRef = useRef<HTMLDivElement | null>(null);
  const skipZoomToMapMarker = useRef<boolean>(false);
  const [isMapCardsVisible, setIsMapCardsVisible] = useState<boolean>(false);
  const stopCardProps = useMemo(
    () => sectionDataSanitizer(itinerary.sections as Section[], itinerary.type),
    [itinerary]
  );
  const isEndpointSameAsStartPoint = useMemo(
    () => checkIfItineraryHasSameStartAndEndPoint(stopCardProps),
    [stopCardProps]
  );

  const childParentSectionMap = useMemo(() => {
    const sectionMap = stopCardProps.reduce(
      (acc: Record<number, number>, { stop }) => {
        if (stop) {
          stop?.subCards?.forEach(({ subSectionDetails }) => {
            if (subSectionDetails) {
              acc[subSectionDetails.id] = stop.sectionDetails?.id!;
            }
          });
        }
        return acc;
      },
      {}
    );
    return Object.keys(sectionMap)
      .sort()
      .reduce((sortedMap: Record<number, number>, key) => {
        sortedMap[Number(key)] = sectionMap[Number(key)];
        return sortedMap;
      }, {} as Record<number, number>);
  }, [stopCardProps]);

  const {
    activeItineraryStopId,
    selectedSubStopId,
    setActiveStopIndex,
    setActiveItineraryStopId,
    setSelectedSubStopId,
  } = useItinerary();

  const handleCloseBottomSheet = () => {
    onCloseBottomSheet?.();
  };

  const handleCloseInitBottomSheet = () => {
    onCloseInitBottomSheet?.();
  };

  const handleActiveMapCardChange = (
    sectionDetails: Section | ChildSection | Omit<Section, 'childSections'>
  ) => {
    if (!skipZoomToMapMarker.current) {
      const isSection = Object.keys(sectionDetails).includes('childSections');
      mapController.current?.zoomIntoSection?.(
        isSection
          ? { section: sectionDetails as Section }
          : { childSection: sectionDetails as ChildSection }
      );
    }
    if (sectionDetails.id === activeItineraryStopId) {
      skipZoomToMapMarker.current = false;
    }

    if (selectedSubStopId) {
      debouncedClearActiveSubSection(selectedSubStopId, sectionDetails.id);
    }
  };

  const handleActiveMarkerChange = (sectionId: number) => {
    setActiveStopId({ sectionId, scrollTo: true });
  };

  const setActiveStopId = ({
    sectionId,
    scrollTo,
  }: {
    sectionId: number;
    scrollTo?: boolean;
  }) => {
    const idx = stopCardProps.findIndex(({ stop, passby }) => {
      if (stop) {
        return stop?.sectionDetails?.id === sectionId;
      } else if (passby) {
        return passby?.stops?.[0]?.id === sectionId;
      }
    });

    if (idx >= 0) {
      setActiveStopIndex(idx);
      setActiveItineraryStopId(sectionId);
      if (scrollTo) {
        scrollToMapViewCardByStopId(sectionId);
      }
    } else {
      const parentStopId = childParentSectionMap[sectionId];

      if (parentStopId) {
        const parentIndex = stopCardProps.findIndex(
          ({ stop }) => stop?.sectionDetails?.id === parentStopId
        );
        setActiveItineraryStopId(parentStopId);
        setActiveStopIndex(parentIndex);
        if (scrollTo) {
          scrollToMapViewCardByStopId(parentStopId);
          setSelectedSubStopId(sectionId);
        }
      }
    }
  };

  const scrollToMapViewCardByStopId = (
    stopId: number,
    scrollDelay: number = 0
  ) => {
    const mapCardId = `map-view-card-${stopId}`;
    setTimeout(() => {
      document
        .getElementById(mapCardId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, scrollDelay);
  };

  const handleBackButton = () => {
    const overlayElement = bottomSheetContainerRef.current?.querySelector(
      '#bottomsheet-overlay'
    ) as HTMLElement;
    overlayElement?.click();
  };

  const handleActiveMapSectionChange = (id: number) => {
    setIsMapCardsVisible(true);
    setSelectedSubStopId(null);
    handleActiveMarkerChange(id);
    skipZoomToMapMarker.current = true;
  };

  const handleNearbyCardClick = (payload: {
    sectionDetails: Section | ChildSection | Omit<Section, 'childSections'>;
    subStopId: number;
  }) => {
    mapController.current?.zoomIntoSection?.({
      childSection: payload.sectionDetails as ChildSection,
    });
  };

  const clearActiveSubSection = (subStopId: number, parentStopId: number) => {
    const parent = childParentSectionMap[subStopId];
    if (parentStopId !== parent) {
      setSelectedSubStopId(null);
    }
  };

  const debouncedClearActiveSubSection = debounce(clearActiveSubSection, 500);

  if (!itinerary.map || !itinerary.map.active) return null;

  return (
    <StyledMWebMapViewStylesheetContainer ref={bottomSheetContainerRef}>
      <BottomSheet
        sheetHeight={'100%'}
        onCloseCompletion={handleCloseBottomSheet}
        onCloseInit={handleCloseInitBottomSheet}
      >
        <StyledMWebMapViewContainer>
          <nav className="navigation-tab">
            <BackArrow
              height={'1.25rem'}
              width={'1.25rem'}
              onClick={handleBackButton}
            />
            <div className="navigation-heading-container">
              <h6 className="navigation-heading">
                {itinerary.details.routeName || itinerary.name}
              </h6>
            </div>
          </nav>
          <div className="map-container">
            <RouteMap
              itinerary={itinerary}
              controller={mapController}
              onActiveSectionChange={handleActiveMapSectionChange}
              zoomPadding={[60, 250]}
              onReset={() => setIsMapCardsVisible(false)}
              enableFreeTouchPropagation
              mapChildToParent={false}
            />
          </div>
          <Conditional if={isMapCardsVisible}>
            <div
              className="map-cards-carousel"
              ref={mapCardsCarouselRef}
              id={MAP_CAROUSEL_CONTAINER_ID}
            >
              {stopCardProps.map(({ stop, passby }, index) => {
                const stopLabelText = getStopLabelText({
                  stopCardProps,
                  currentStop: index,
                });
                const isEndPoint =
                  stop?.sectionDetails?.type === SECTION_TYPE.END_LOCATION;
                const hideViewDetails =
                  isEndPoint && isEndpointSameAsStartPoint;

                return (
                  <>
                    <Conditional if={!!stop}>
                      <MapViewCard
                        key={`${stop?.sectionDetails?.id}`}
                        {...stop}
                        stopIndex={index}
                        onCardInView={handleActiveMapCardChange}
                        stopLabelText={stopLabelText}
                        childParentSectionMap={childParentSectionMap}
                        hideViewDetails={hideViewDetails}
                        onNearbyCardClick={handleNearbyCardClick}
                      />
                    </Conditional>
                    <Conditional if={!!passby}>
                      <MapViewCard
                        key={`${passby?.stops?.[0]?.id}`}
                        {...passby}
                        stopIndex={index}
                        isPassBy
                        onCardInView={handleActiveMapCardChange}
                        stopLabelText={stopLabelText}
                        childParentSectionMap={childParentSectionMap}
                        hideViewDetails={hideViewDetails}
                      />
                    </Conditional>
                  </>
                );
              })}
            </div>
          </Conditional>
        </StyledMWebMapViewContainer>
      </BottomSheet>
    </StyledMWebMapViewStylesheetContainer>
  );
};

export default MWebMapView;
