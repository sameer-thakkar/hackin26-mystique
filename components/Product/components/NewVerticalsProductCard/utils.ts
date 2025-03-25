import { Section, SECTION_TYPE } from 'types/itinerary.type';
import { trackEvent } from 'utils/analytics';
import { isCruiseItinerary } from 'utils/itinerary';
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
  tgid,
  isCruisesCombosRevamp = false,
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
      popularAttractionsCovered = '',
      meal,
      entertainment,
    } = itineraryDetails || {};

    const audioGuide =
      !isCruisesCombosRevamp &&
      defaultDescriptors?.includes(DESCRIPTORS.AUDIO_GUIDE) &&
      strings.DESCRIPTORS.MULTILINGUAL_AUDIO_GUIDE;
    const liveGuide =
      defaultDescriptors?.includes(DESCRIPTORS.GUIDED_TOUR) &&
      strings.DESCRIPTORS.LIVE_GUIDE;
    const liveEntertainment =
      entertainment?.name ||
      descriptorsObject[IGNORED_HEADINGS.CRUISE_LIVE_ENTT];
    const mealOptions =
      meal?.name || descriptorsObject[IGNORED_HEADINGS.CRUISE_MEALS];

    const totalStops = itinerarySections?.filter(
      (stop: Record<string, any>) => stop?.type === SECTION_TYPE.STOP
    )?.length;
    const upfrontStops = popularAttractionsCovered?.split(',')?.length || 0;

    const totalBoardingPoints = itinerarySections?.filter(
      (stop: Record<string, any>) => stop?.type === SECTION_TYPE.START_LOCATION
    )?.length;
    const boardingPoints = getBoardingPointsText({
      totalBoardingPoints,
      itinerarySections,
    });

    const moreStopsAvailable = totalStops - upfrontStops;
    const moreString =
      moreStopsAvailable > 0
        ? strings.formatString(strings.CRUISES.MORE, String(moreStopsAvailable))
        : '';

    const popularAttractions = strings.formatString(
      strings.CRUISES.VIEW_POPULAR_SIGHTS,
      moreStopsAvailable > 0
        ? popularAttractionsCovered
        : `<span class='clickable'>${popularAttractionsCovered}</span>`,
      `<span class='clickable'>${moreString}</span>`
    );

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
        type: 'STARTING_STOP',
        text:
          totalBoardingPoints && isCruiseItinerary(itineraryType)
            ? (boardingPoints as string)
            : '',
        onClick: () => handleDescriptorClick(DESCRIPTOR_TYPE.BOARDING_POINT),
      },

      { type: 'MEALS_INCLUDED', text: mealOptions },
      { type: 'AUDIO_GUIDE', text: audioGuide },
      { type: 'GUIDED_TOUR', text: liveGuide },
      { type: 'LIVE_ENTERTAINMENT', text: liveEntertainment },
      {
        type: 'ATTRACTIONS',
        text: popularAttractionsCovered?.length
          ? (popularAttractions as string)
          : '',
        onClick: () => handleDescriptorClick(DESCRIPTOR_TYPE.POPULAR_POINTS),
      },
    ];
  }
  return descriptorsList?.filter((item) => item.text);
};

const getBoardingPointsText = ({
  totalBoardingPoints,
  itinerarySections,
}: {
  totalBoardingPoints: number;
  itinerarySections: Section[];
}) => {
  if (!totalBoardingPoints) {
    return '';
  }
  if (totalBoardingPoints === 1) {
    const bpName = itinerarySections?.[0]?.details?.name;
    if (!bpName) {
      return '';
    }
    return strings.formatString(
      strings.CRUISES.BOARD_AT,
      `<span class='clickable'>${bpName}</span>`
    );
  }
  return strings.formatString(
    strings.CRUISES.BOARDING_POINTS_AVAILABLE,
    `<span class='clickable'>${totalBoardingPoints} ${strings.CRUISES.BOARDING_POINTS.toLowerCase()}</span>`
  );
};
