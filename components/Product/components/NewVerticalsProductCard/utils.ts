import { SECTION_TYPE } from 'types/itinerary.type';
import { trackEvent } from 'utils/analytics';
import {
  getItineraryDuration,
  getItineraryTiming,
  isCruiseItinerary,
} from 'utils/itinerary';
import { IGNORED_HEADINGS } from 'const/descriptors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  DESCRIPTORS,
} from 'const/index';
import { strings } from 'const/strings';
import { TDescriptorsList, TGetCustomDescriptors } from './types';

enum DESCRIPTOR_TYPE {
  BOARDING_POINT = 'Boarding Points',
  POPULAR_POINTS = 'Popular Points',
}

export const getCustomDescriptors = ({
  isHOHO,
  isCruises,
  descriptorsObject,
  itineraryDetails,
  itinerarySections,
  defaultDescriptors,
  itineraryPopupController,
  setIsItineraryDrawerOpen,
  setIsDescriptorClick,
  itineraryType,
  lang,
  tgid,
}: TGetCustomDescriptors) => {
  let descriptorsList: TDescriptorsList[] = [];

  if (isHOHO) {
    const timings = descriptorsObject[IGNORED_HEADINGS.OPERATING_HOURS];
    const frequency = descriptorsObject[IGNORED_HEADINGS.FREQUENCY];
    const audioGuide = descriptorsObject[IGNORED_HEADINGS.AUDIO_GUIDE];
    const popularAttractions =
      descriptorsObject[IGNORED_HEADINGS.POPULAR_ATTRACTIONS];
    const startingStop = descriptorsObject[IGNORED_HEADINGS.STARTING_STOP];
    const stringConnector = timings && frequency ? '|' : '';
    descriptorsList = [
      {
        type: 'DURATION',
        text:
          timings || frequency
            ? `${timings} ${stringConnector} ${frequency}`
            : '',
      },
      {
        type: 'STARTING_STOP',
        text: startingStop,
      },
      { type: 'AUDIO_GUIDE', text: audioGuide },
      {
        type: 'ATTRACTIONS',
        text: popularAttractions,
      },
    ];
  } else if (isCruises) {
    const {
      firstDepartureTime = '',
      lastDepartureTime = '',
      duration,
      popularAttractionsCovered = '',
    } = itineraryDetails || {};
    const audioGuide = descriptorsObject[IGNORED_HEADINGS.CRUISE_AUDIO_GUIDE];
    const liveEntertainment =
      descriptorsObject[IGNORED_HEADINGS.CRUISE_LIVE_ENTT];
    const mealOptions = descriptorsObject[IGNORED_HEADINGS.CRUISE_MEALS];
    const boatType = descriptorsObject[IGNORED_HEADINGS.CRUISE_BOAT];
    const finalDuration = getItineraryDuration({ duration, lang });
    const timings = getItineraryTiming({
      firstDepartureTime,
      lastDepartureTime,
    });
    const stringConnector = finalDuration && timings ? '|' : '';
    const totalStops = itinerarySections?.filter(
      (stop: Record<string, any>) => stop?.type === SECTION_TYPE.STOP
    )?.length;
    const upfrontStops = popularAttractionsCovered?.split(',')?.length || 0;
    const totalBoardingPoints = itinerarySections?.filter(
      (stop: Record<string, any>) => stop?.type === SECTION_TYPE.START_LOCATION
    )?.length;
    const boardingPoints =
      totalBoardingPoints === 1
        ? strings.formatString(
            strings.CRUISES.BOARD_AT,
            `<span class='clickable'>${itinerarySections?.[0]?.details?.name}</span>`
          )
        : strings.formatString(
            strings.CRUISES.BOARDING_POINTS_AVAILABLE,
            `<span class='clickable'>${totalBoardingPoints} ${strings.CRUISES.BOARDING_POINTS.toLowerCase()}</span>`
          );
    const moreString = strings.formatString(
      strings.CRUISES.MORE,
      String(totalStops - upfrontStops)
    );
    const popularAttractions = strings.formatString(
      strings.CRUISES.VIEW_POPULAR_SIGHTS,
      popularAttractionsCovered,
      `<span class='clickable'>${moreString}</span>`
    );
    const hotelTransfers =
      defaultDescriptors?.includes(DESCRIPTORS.TRANSFERS) &&
      strings.DESCRIPTORS.TRANSFERS;

    const handleDescriptorClick = (descriptorType: DESCRIPTOR_TYPE) => {
      itineraryPopupController?.current?.open();
      setIsItineraryDrawerOpen(true);
      setIsDescriptorClick(true);
      trackEvent({
        eventName: ANALYTICS_EVENTS.DESCRIPTOR_CLICKED,
        [ANALYTICS_PROPERTIES.DESCRIPTOR_TYPE]: descriptorType,
        [ANALYTICS_PROPERTIES.TGID]: tgid,
      });
    };

    descriptorsList = [
      {
        type: 'DURATION',
        text:
          finalDuration || timings
            ? `${finalDuration} ${stringConnector} ${timings}`
            : '',
      },
      {
        type: 'STARTING_STOP',
        text:
          totalBoardingPoints && isCruiseItinerary(itineraryType)
            ? (boardingPoints as string)
            : '',
        onClick: () => handleDescriptorClick(DESCRIPTOR_TYPE.BOARDING_POINT),
      },
      { type: 'MEALS_INCLUDED', text: mealOptions },
      { type: 'AUDIO_GUIDE', text: audioGuide },
      { type: 'LIVE_ENTERTAINMENT', text: liveEntertainment },
      {
        type: 'ATTRACTIONS',
        text: popularAttractionsCovered?.length
          ? (popularAttractions as string)
          : '',
        onClick: () => handleDescriptorClick(DESCRIPTOR_TYPE.POPULAR_POINTS),
      },
      {
        type: 'BOAT_TYPE',
        text: boatType,
      },
      {
        type: 'TRANSFERS',
        text: hotelTransfers,
      },
    ];
  }
  return descriptorsList?.filter((item) => item.text);
};
