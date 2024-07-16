import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  CHILD_SECTION_TYPE,
  type Location as MarkerLocation,
  SECTION_TYPE,
} from 'types/itinerary.type';
import type { MapMarker } from '@headout/aer/src/molecules/LeafletMap/map';
import { trackEvent } from 'utils/analytics';
import { isValidLocation } from 'utils/itinerary';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import type { TMapController, TMapProps, TZoomInfo } from './interface';
import ResetButton from './ResetButton';
import { MapContainer } from './styles';
import { getChildMarkers, getMarkerIconProps } from './utils';

const LeafletMap = dynamic(
  () => import('@headout/aer/src/molecules/LeafletMap'),
  {
    ssr: false,
  }
);

const RouteMap = ({
  itinerary,
  controller,
  onActiveSectionChange,
  onClickTrackEvent,
  interactionBlockingOverlayText,
  onZoomTrackEvent,
}: TMapProps) => {
  const [markers, setMarkers] = useState<Array<MapMarker> | undefined>();
  const [zoomInfo, setZoomInfo] = useState<TZoomInfo>(null);
  const [currentZoom, setCurrentZoom] = useState(0);
  const [mapPinClick, setMapPinClick] = useState(false);

  const localController = useRef<TMapController | undefined>();
  const mapController = controller ?? localController;

  const calculateMarkers = useCallback(() => {
    if (!mapController?.current) return;

    let markers: Array<MapMarker> = [];

    let stopIndex = 0;

    const localZoomInfo: Record<
      number,
      { zoom: number; bounds: L.LatLngBounds }
    > = {};

    const currentZoom = mapController.current!.map?.getZoom();

    const childToParent = new Map<number, number>();

    markers = itinerary.sections.reduce((acc, section) => {
      if (section.details.name) {
        const { location, type, id, details, childSections = [] } = section;
        const { name, passBy } = details;
        if (type === SECTION_TYPE.STOP && !passBy) stopIndex++;
        if (!isValidLocation(location)) return acc;
        const { latitude = 0, longitude = 0 } = location!;

        const markerType = passBy ? CHILD_SECTION_TYPE.PASS_BY : type;
        const locations: Array<MarkerLocation> = [location!];
        const pushLocation = (location: MarkerLocation) => {
          locations.push(location!);
        };
        const childMarkers = getChildMarkers(childSections, pushLocation);
        childSections.forEach(({ id }) => childToParent.set(id, section.id));

        const bounds = mapController.current!.calculateBounds(
          locations.map(({ latitude = 0, longitude = 0 }) => ({
            lat: latitude,
            lng: longitude,
          }))
        );
        const parentPotentialZoom = mapController.current!.map.getBoundsZoom(
          bounds,
          false
        );

        const isCenteringNeeded = parentPotentialZoom - currentZoom > 1;

        const finalParentZoom =
          isCenteringNeeded && childSections.length
            ? parentPotentialZoom - 1
            : currentZoom + 1;

        localZoomInfo[id] = {
          bounds: bounds,
          zoom: finalParentZoom,
        };

        acc.push({
          id,
          element: section,
          position: {
            lat: latitude,
            lng: longitude,
          },
          title: name!,
          icon: getMarkerIconProps({
            type: markerType,
            title: name!,
            stopNumber: stopIndex,
          }),
          autoFly: true,
          stickyTitleVisibilityLevel: finalParentZoom,
          hasPriority: true,
        });

        acc.push(
          ...childMarkers.map((marker) => {
            const bounds = mapController.current!.calculateBounds([
              {
                lat: marker.element.location.latitude,
                lng: marker.element.location.longitude,
              },
            ]);

            localZoomInfo[marker.element.id] = {
              bounds: bounds,
              zoom: finalParentZoom,
            };

            return {
              ...marker,
              stickyTitleVisibilityLevel: finalParentZoom,
            };
          })
        );
      }
      return acc;
    }, [] as Array<MapMarker>);

    const zoomIntoSection: TMapController['zoomIntoSection'] = ({
      section,
      childSection,
    }) => {
      const { id } = childSection ?? section!;

      if (!localZoomInfo?.[id]) return;
      const { bounds, zoom } = localZoomInfo[id];
      if (childSection || !section?.childSections.length) {
        mapController.current!.map?.flyTo(bounds.getCenter(), zoom);
      } else
        mapController.current!.map?.flyToBounds(bounds, {
          padding: [60, 60],
        });
    };

    if (!zoomInfo) {
      setZoomInfo(localZoomInfo);
    }

    setMarkers(
      markers.reverse().map((marker) => ({
        ...marker,
        onClick: () => {
          setMapPinClick(true);
          setTimeout(() => {
            setMapPinClick(false);
          }, 3000);
          const {
            element: { type, rank },
            title,
          } = marker || {};
          onClickTrackEvent?.({
            type: type,
            stopName: title,
            stopNumber: rank,
          });

          onActiveSectionChange?.(
            childToParent.get(marker.element.id) ?? marker.element.id
          );
          const isSection = Array.isArray(marker.element.childSections);
          const sectionName = isSection ? 'section' : 'childSection';

          zoomIntoSection({ [sectionName]: marker.element });
        },
      }))
    );

    mapController.current.zoomIntoSection = zoomIntoSection;

    mapController.current?.map?.invalidateSize();
  }, [itinerary, !!mapController?.current, onActiveSectionChange]);

  const handleZoomChange = (zoom: number) => {
    setCurrentZoom(zoom);
    if (!mapPinClick && currentZoom !== 0) {
      onZoomTrackEvent?.({
        zoomType: zoom > currentZoom ? 'Zoom In' : 'Zoom Out',
      });
    }
  };

  const handleFreeTouch = (e: any) => {
    e.stopPropagation();
    const { className } = e.target as HTMLElement;
    if (typeof className === 'string' && className.includes('leaflet-touch')) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MAP_CLICKED,
        [ANALYTICS_PROPERTIES.CLICK_TYPE]: 'Free Area',
      });
    }
  };

  useEffect(() => {
    controller?.current?.reset();
  }, [markers]);

  if (!itinerary.map || !itinerary.map.active) return null;

  const {
    polyline,
    polylineColor,
    active: isItineraryRouteActive,
  } = itinerary.map.itineraryRoute || {};

  return (
    <MapContainer onClick={handleFreeTouch} onTouchEnd={handleFreeTouch}>
      <LeafletMap
        lines={
          isItineraryRouteActive
            ? [
                {
                  path: polyline,
                  options: {
                    color: polylineColor ?? COLORS.BRAND.PURPS,
                    lineJoin: 'round',
                  },
                },
              ]
            : itinerary.sections.length
            ? [
                {
                  path: itinerary.sections.reduce<
                    { lat: number; lng: number }[]
                  >((acc, { location }) => {
                    if (location && isValidLocation(location)) {
                      acc.push({
                        lat: location.latitude,
                        lng: location.longitude,
                      });
                    }
                    return acc;
                  }, []),
                  visible: false,
                },
              ]
            : []
        }
        markers={markers}
        interactionBlockingOverlayText={interactionBlockingOverlayText}
        maxZoomLevel={15}
        showZoomControls={false}
        onMapLoad={(map, reset, calculateBounds) => {
          if (map && reset && mapController && !mapController?.current) {
            mapController.current = {
              map,
              reset,
              calculateBounds,
            };
            calculateMarkers();
          }
        }}
        onMapUnload={() => {
          if (mapController && mapController.current)
            mapController.current = null;
        }}
        onZoomChanged={handleZoomChange}
      />

      <ResetButton onClick={mapController?.current?.reset} />
    </MapContainer>
  );
};

export default RouteMap;
