import {
  CHILD_SECTION_TYPE,
  Itinerary,
  ItineraryType,
  Location,
  Section,
  SECTION_TYPE,
} from 'types/itinerary.type';
import { ItineraryDescriptorsTypes } from 'components/common/Itinerary/ItineraryDescriptors/interface';
import { PassesByCardProps } from 'components/common/Itinerary/TimelineView/components/PassesByCard/types';
import { StopCardProps } from 'components/common/Itinerary/TimelineView/components/StopCard/types';
import { isSubsetArray } from 'utils/arrayUtils';
import { ITINERARY_DESCRIPTORS_DATA } from 'const/itinerary';

export const getEntryPointPlaceHolder = (index: number) => {
  const imageIndex = (index % 5) + 1;
  return `https://cdn-imgix.headout.com/assets/images/itinerary/itinerary-entry-s-${imageIndex}.png`;
};

export type CombinedStopAndPassby = {
  stop?: StopCardProps | null;
  passby?: PassesByCardProps | null;
};

const DEFAULT_VALUE: CombinedStopAndPassby = {
  passby: null,
  stop: null,
};

export const isValidLocation = (location?: Location) =>
  !!location && location.latitude !== 0 && location.longitude !== 0;

export const sectionDataSanitizer = (
  sections: Section[],
  itineraryType: ItineraryType
) => {
  const isHOHO = isHOHOItinerary(itineraryType);

  const startLocations = sections.filter(
    (section) => section.type === SECTION_TYPE.START_LOCATION
  );

  const hasStartLocation = !!startLocations.length;

  const startLocationDescriptors = hasStartLocation
    ? {
        inclusion: startLocations[0].details.inclusion,
        duration: startLocations[0].details.timeSpent || 0,
        attractionsCount: startLocations[0].attractionsCount,
        activitiesCount: startLocations[0].activitiesCount,
      }
    : {};

  const startLocationGroup: CombinedStopAndPassby = hasStartLocation
    ? {
        passby: null,
        stop: isHOHO
          ? null
          : {
              descriptors: startLocationDescriptors,
              sectionDetails: startLocations[0],
              position: 0,
              defaultOpen: startLocations.length > 1,
              findDirections: isValidLocation(startLocations[0].location),
              subCards: !startLocations.length
                ? []
                : startLocations.length > 1
                ? startLocations.map((section, index) => ({
                    descriptors: {
                      inclusion: section.details.inclusion,
                      duration: section.details.timeSpent || 0,
                      attractionsCount: section.attractionsCount,
                      activitiesCount: section.activitiesCount,
                    },
                    sectionDetails: { ...section, rank: index + 1 },
                    isSubSection: false,
                    position: index + 1,
                    findDirections: isValidLocation(section.location),
                  }))
                : startLocations[0].childSections.map((child, index) => ({
                    descriptors: {
                      inclusion: child.details.inclusion,
                      duration: child.details.timeSpent || 0,
                      foodTypes:
                        child.type === CHILD_SECTION_TYPE.FOOD_AND_DRINKS
                          ? child.details.subType
                          : undefined,
                    },
                    subSectionDetails: {
                      ...child,
                      details: {
                        ...child.details,
                        passBy: isHOHO || child.details.passBy,
                      },
                      rank: index + 1,
                    },
                    position: index + 1,
                    isSubSection: true,
                  })),
            },
      }
    : DEFAULT_VALUE;

  const endLocations = sections.filter(
    (section) => section.type === SECTION_TYPE.END_LOCATION
  );

  const hasEndLocation = !!endLocations.length;

  const stopLocations = sections.filter(
    ({ type }) => type === SECTION_TYPE.STOP
  );

  const stopLocationProps: CombinedStopAndPassby[] = stopLocations.map(
    (stop, index) => {
      let subCardPosition = 0;
      return {
        passby: stop.details.passBy
          ? {
              stops: [
                {
                  id: stop.id,
                  title: stop.details.name,
                  image: stop.details.mediaUrls?.[0],
                  description: stop.details.description,
                  link: stop.location
                    ? generateGoogleMapUrl(stop.location)
                    : null,
                  type: stop.type,
                  subType: stop.details.subType,
                },
              ],
            }
          : null,
        stop: stop.details.passBy
          ? null
          : {
              descriptors: isHOHO
                ? {
                    attractionsCount: stop.attractionsCount,
                  }
                : {
                    inclusion: stop.details.inclusion,
                    duration: stop.details.timeSpent || 0,
                    attractionsCount: stop.attractionsCount,
                    activitiesCount: stop.activitiesCount,
                  },
              sectionDetails: {
                ...stop,
                location: isHOHO ? stop.location : undefined,
              },
              findDirections: isHOHO ? isValidLocation(stop.location) : false,
              position: index + startLocations.length,
              subCards: stop.childSections.map((child, index) => {
                subCardPosition += child.details.passBy ? 0 : 1;
                return {
                  descriptors: isHOHO
                    ? {}
                    : {
                        inclusion: child.details.inclusion,
                        duration: child.details.timeSpent || 0,
                        foodTypes:
                          child.type === CHILD_SECTION_TYPE.FOOD_AND_DRINKS
                            ? child.details.subType
                            : undefined,
                      },
                  subSectionDetails: {
                    ...child,
                    details: {
                      ...child.details,
                      passBy: isHOHO || child.details.passBy,
                    },
                    rank: index + 1,
                  },
                  position: subCardPosition,
                  isSubSection: true,
                };
              }),
            },
      };
    }
  );

  const finalStops: CombinedStopAndPassby[] = [];
  let lastStopIndex = 0;

  stopLocationProps.forEach((prop, index) => {
    if (prop.passby) {
      if (index === 0) finalStops.push(prop);
      else {
        if (finalStops[finalStops.length - 1].passby) {
          finalStops[finalStops.length - 1].passby?.stops?.push(
            prop.passby.stops![0]
          );
        } else {
          finalStops.push(prop);
        }
      }
    } else if (prop.stop) {
      lastStopIndex++;
      finalStops.push({
        ...prop,
        stop: {
          ...prop.stop,
          position: lastStopIndex,
          isForcedStart:
            !hasStartLocation || isHOHO ? lastStopIndex === 1 : false,
          isForcedEnd:
            !hasEndLocation || isHOHO
              ? index + 1 === stopLocationProps.length
              : false,
        },
      });
    }
  });

  const endLocationDescriptors = hasEndLocation
    ? {
        inclusion: endLocations[0].details.inclusion,
        duration: endLocations[0].details.timeSpent || 0,
        attractionsCount: endLocations[0].attractionsCount,
        activitiesCount: endLocations[0].activitiesCount,
      }
    : {};

  const endLocationGroup: CombinedStopAndPassby = hasEndLocation
    ? {
        passby: null,
        stop: isHOHO
          ? null
          : endLocations[0].details.sameAsStartingPoint && hasStartLocation
          ? {
              ...startLocationGroup.stop,
              sectionDetails: {
                ...startLocationGroup.stop?.sectionDetails!,
                id: endLocations[0].id,
                type: SECTION_TYPE.END_LOCATION,
                details: {
                  ...startLocationGroup.stop?.sectionDetails?.details,
                  sameAsStartingPoint: true,
                },
              },
              findDirections: false,
              isForcedStart: false,
              position: 1 + stopLocations.length,
              subCards:
                startLocations.length > 1
                  ? startLocations.map((section, index) => ({
                      descriptors: {
                        inclusion: section.details.inclusion,
                        duration: section.details.timeSpent || 0,
                        attractionsCount: section.attractionsCount,
                        activitiesCount: section.activitiesCount,
                      },
                      position: index + 1,
                      sectionDetails: {
                        ...section,
                        type: SECTION_TYPE.END_LOCATION,
                        details: {
                          ...section.details,
                          sameAsStartingPoint: true,
                        },
                        rank: index + 1,
                      },
                      isSubSection: false,
                    }))
                  : [],
            }
          : {
              descriptors: endLocationDescriptors,
              sectionDetails: endLocations[0],
              position: 1 + stopLocations.length,
              findDirections: isValidLocation(endLocations[0].location),
              defaultOpen: endLocations.length > 1,
              subCards: !endLocations.length
                ? []
                : endLocations.length > 1
                ? endLocations.map((section, index) => ({
                    descriptors: {
                      inclusion: section.details.inclusion,
                      duration: section.details.timeSpent || 0,
                      attractionsCount: section.attractionsCount,
                      activitiesCount: section.activitiesCount,
                    },
                    sectionDetails: { ...section, rank: index + 1 },
                    isSubSection: false,
                    position: index + 1,
                    findDirections: isValidLocation(section.location),
                  }))
                : endLocations[0].childSections.map((child, index) => ({
                    descriptors: {
                      inclusion: child.details.inclusion,
                      duration: child.details.timeSpent || 0,
                      foodTypes:
                        child.type === CHILD_SECTION_TYPE.FOOD_AND_DRINKS
                          ? child.details.subType
                          : undefined,
                    },
                    subSectionDetails: {
                      ...child,
                      details: {
                        ...child.details,
                        passBy: isHOHO || child.details.passBy,
                      },
                      rank: index + 1,
                    },
                    position: index + 1,
                    isSubSection: true,
                  })),
            },
      }
    : DEFAULT_VALUE;

  const finalStopsAndPassBys = [
    startLocationGroup,
    ...finalStops,
    endLocationGroup,
  ].filter(({ stop, passby }) => stop || passby);

  return finalStopsAndPassBys;
};

export const generateGoogleMapUrl = ({
  latitude,
  longitude,
  placeId,
}: Location) => {
  const baseURL = 'https://www.google.com/maps/dir/?api=1';
  return `${baseURL}&destination=${latitude},${longitude}${
    placeId ? `&destination_place_id=${placeId}` : ''
  }`;
};

export const getItineraryDescriptorsTypes = (
  itinerary: Itinerary
): Array<keyof typeof ItineraryDescriptorsTypes> => {
  const { details } = itinerary;
  const detailsKeys = Object.keys(details);

  return Object.keys(ITINERARY_DESCRIPTORS_DATA).reduce((result, key) => {
    const descriptorData =
      ITINERARY_DESCRIPTORS_DATA[
        key as keyof typeof ITINERARY_DESCRIPTORS_DATA
      ];
    const isSubset = isSubsetArray(detailsKeys, descriptorData.fieldIdentifier);
    const shouldInclude =
      !descriptorData.hideIfFieldsPresent ||
      !isSubsetArray(detailsKeys, descriptorData.hideIfFieldsPresent ?? []);

    if (isSubset && shouldInclude) {
      result.push(key as keyof typeof ItineraryDescriptorsTypes);
    }

    return result;
  }, [] as Array<keyof typeof ItineraryDescriptorsTypes>);
};

export const isHOHOItinerary = (itineraryType: ItineraryType) => {
  return itineraryType === ItineraryType.HOHO;
};

export const isCruiseItinerary = (itineraryType: ItineraryType) => {
  return itineraryType === ItineraryType.CRUISE;
};

export const isItineraryValid = (itinerary: Itinerary) => {
  if (!itinerary.active || !itinerary.sections.length) return false;

  return true;
};
