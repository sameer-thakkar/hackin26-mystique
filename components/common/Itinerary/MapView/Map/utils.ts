import { renderToString } from 'react-dom/server';
import {
  CHILD_SECTION_TYPE,
  ChildSection,
  Location as MarkerLocation,
  SECTION_TYPE,
} from 'types/itinerary.type';
import { MapMarker } from '@headout/aer/src/molecules/LeafletMap/map';
import { isValidLocation } from 'utils/itinerary';
import { ICONS } from './constants';
import { TGetMarkerIconProps } from './interface';
import NumberedMarkerIcon from './NumberedMarkerIcon';

export const getIconProps = (url: string, size = [45, 50], anchor = [22, 38]) =>
  ({
    iconUrl: url,
    iconSize: size,
    iconAnchor: anchor,
    tooltipAnchor: [0, -5],
  } as L.DivIconOptions);

export const iconsSetup = {
  default: getIconProps(ICONS.DEFAULT),
  start: getIconProps(ICONS.START),
  end: getIconProps(ICONS.END),
  passBy: getIconProps(ICONS.PASS_BY, [20, 20], [10, 10]),
};

export const getMarkerIconProps = ({
  type,
  title,
  stopNumber,
  color,
  hideNumber,
}: TGetMarkerIconProps) => {
  const { default: defaultIcon, start, end, passBy } = iconsSetup;
  switch (type) {
    case SECTION_TYPE.START_LOCATION:
      return start;
    case SECTION_TYPE.END_LOCATION:
      return end;
    case CHILD_SECTION_TYPE.PASS_BY:
    case CHILD_SECTION_TYPE.ATTRACTION:
      return passBy;
    case SECTION_TYPE.STOP:
      return {
        html: renderToString(
          NumberedMarkerIcon({ title, stopNumber, color, hideNumber })
        ),
        iconSize: [32, 38] as L.PointTuple,
        iconAnchor: [16, 35] as L.PointTuple,
        tooltipAnchor: [0, -15] as L.PointTuple,
        className: 'numbered-marker',
      } as L.DivIconOptions;
    default:
      return defaultIcon;
  }
};

export const getChildMarkers = (
  childSections: ChildSection[],
  pushLocation: (location: MarkerLocation) => void
) => {
  let childIndex = 0;
  const childMarkers = childSections.reduce((childAcc, childSection) => {
    if (childSection.details.name) {
      const { location, type, id, details } = childSection;
      const { name, passBy } = details;

      if (!passBy) childIndex++;
      if (!isValidLocation(location)) return childAcc;

      const { latitude = 0, longitude = 0 } = location!;

      const markerType = passBy ? CHILD_SECTION_TYPE.PASS_BY : type;

      pushLocation(location!);

      childAcc.push({
        id,
        element: childSection,
        position: {
          lat: latitude,
          lng: longitude,
        },
        title: name!,
        icon: getMarkerIconProps({
          type: markerType,
          title: name!,
          stopNumber: childIndex,
        }),
        autoFly: true,
      });
    }
    return childAcc;
  }, [] as Array<MapMarker>);
  return childMarkers;
};
