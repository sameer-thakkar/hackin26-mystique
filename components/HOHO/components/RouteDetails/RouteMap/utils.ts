import { renderToString } from 'react-dom/server';
import type { LeafletMouseEvent } from 'leaflet';
import type { MapMarker } from '@headout/aer/src/molecules/LeafletMap/map';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { TItineraryLocationPoint } from '../interface';
import { iconsSetup } from './constants';
import NumberedMarkerIcon from './NumberedMarkerIcon';

export const getMarkerIconProps = (type: any, title: any, stopNumber: any) => {
  switch (type) {
    case 'PASSBY':
    case 'ATTRACTION':
      return iconsSetup.passBy;
    case 'START_LOCATION':
    case 'END_LOCATION':
    case 'STOP':
      return {
        html: renderToString(NumberedMarkerIcon({ title, stopNumber })),
        iconSize: [45, 50],
        iconAnchor: [22, 38],
        popupAnchor: [0, -30],
        className: 'numbered-marker',
      };
    default:
      return iconsSetup.default;
  }
};

export const locationToLatLng = (location: TItineraryLocationPoint) => {
  if (!location) return undefined;
  const { latitude, longitude } = location;
  return { lat: latitude, lng: longitude };
};

const getMarkerPoints = (allSections: Record<string, any>[]) => {
  const points = allSections.reduce((acc: Record<string, any>[], point) => {
    const { childSections } = point;
    acc.push(point);
    if (childSections.length) {
      acc.push(...childSections);
    }
    return acc;
  }, []);
  return points;
};

const isStopSection = (type: string) => {
  return type === 'STOP';
};

export const getLeafletMapMarkers = ({
  itinerary,
  sectionName,
  itineraryName,
}: {
  itinerary: Record<string, any>[];
  sectionName: string;
  itineraryName: string;
}) => {
  const points = getMarkerPoints(itinerary);
  let stopNumber = 0;

  return points
    .map((point) => {
      const {
        location: { latitude = 0, longitude = 0 } = {},
        type,
        details: { name = '' } = {},
        id,
      } = point;
      if (!latitude || !longitude) return null;
      if (isStopSection(type)) ++stopNumber;

      return {
        id,
        element: point,
        position: { lat: latitude, lng: longitude },
        title: name,
        icon: getMarkerIconProps(type, name, stopNumber),
        autoFly: true,
        onClick: (_e: LeafletMouseEvent, markerMeta: any, optionals: any) => {
          trackEvent({
            eventName: ANALYTICS_EVENTS.MAP_CLICKED,
            [ANALYTICS_PROPERTIES.SECTION]: sectionName,
            [ANALYTICS_PROPERTIES.ITINERARY_NAME]: itineraryName,
            [ANALYTICS_PROPERTIES.CLICK_TYPE]: type,
            [ANALYTICS_PROPERTIES.STOP_NAME]: name,
            [ANALYTICS_PROPERTIES.STOP_NUMBER]: stopNumber,
          });

          const { element: { id = null } = {} } = markerMeta;
          const { calculateBounds, map, currentZoom } = optionals;
          const bounds = calculateBounds([
            locationToLatLng(points.find((p) => p.id === id)?.location),
          ]);
          const potentialZoom = map.getBoundsZoom(bounds, false);
          const zoomDiff = potentialZoom - currentZoom;
          zoomDiff > 1
            ? map.flyTo(bounds.getCenter(), currentZoom + 1)
            : map.flyToBounds(bounds, {
                padding: [60, 60],
              });
        },
      };
    })
    .filter(Boolean) as MapMarker[];
};
