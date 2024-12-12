import dynamic from 'next/dynamic';
import {
  CHILD_SECTION_TYPE,
  ModeOfTravelOptions,
  SUB_TYPES,
} from 'types/itinerary.type';
import { getDurationInHmNotation, getIntlTime } from '@headout/espeon/utils';
import { ItineraryDescriptorsTypes } from 'components/common/Itinerary/ItineraryDescriptors/interface';
import { descriptorIcons } from 'const/descriptorIcons';
import { strings } from 'const/strings';

export const ITINERARY_DESCRIPTORS_DATA: Record<
  keyof typeof ItineraryDescriptorsTypes,
  {
    label?: string;
    icon?: () => JSX.Element;
    fieldIdentifier: string[];
    fieldTransformer?: (
      value: Record<string, any>,
      additionalMeta: { lang: string }
    ) => string;
    useCTA?: boolean;
    ctaLabel?: string;
    onCTAClick?: (value: any) => void;
    hideIfFieldsPresent?: string[];
    getIcon?: (value: Record<string, any>) => () => JSX.Element;
    getLabel?: (value: Record<string, any>) => string;
  }
> = {
  [ItineraryDescriptorsTypes.TOTAL_DURATION]: {
    label: strings.ITINERARY.DESCRIPTORS.TOTAL_DURATION,
    icon: descriptorIcons.TOTAL_DURATION,
    fieldIdentifier: ['duration'],
    fieldTransformer: ({ duration }, { lang }) => {
      const { hours, minutes } = duration;
      const timeInMinutes = hours * 60 + minutes;
      return getDurationInHmNotation({
        durationInMinutes: timeInMinutes,
        // @ts-expect-error
        lang,
      });
    },
    getLabel: () => strings.ITINERARY.DESCRIPTORS.TOTAL_DURATION,
  },
  [ItineraryDescriptorsTypes.FREQUENCY]: {
    label: strings.ITINERARY.DESCRIPTORS.FREQUENCY,
    icon: descriptorIcons.FREQUENCY,
    fieldIdentifier: ['frequency'],
    getLabel: () => strings.ITINERARY.DESCRIPTORS.FREQUENCY,
  },
  [ItineraryDescriptorsTypes.FIRST_DEPARTURE_TIME]: {
    label: strings.ITINERARY.DESCRIPTORS.FIRST_DEPARTURE_TIME,
    icon: descriptorIcons.FIRST_DEPARTURE,
    fieldIdentifier: ['firstDepartureTime'],
    hideIfFieldsPresent: ['firstDepartureStop'],
    fieldTransformer: ({ firstDepartureTime }, { lang }) => {
      return getIntlTime({
        time: firstDepartureTime,
        lang,
      });
    },
    getLabel: () => strings.ITINERARY.DESCRIPTORS.FIRST_DEPARTURE_TIME,
  },
  [ItineraryDescriptorsTypes.LAST_DEPARTURE_TIME]: {
    label: strings.ITINERARY.DESCRIPTORS.LAST_DEPARTURE_TIME,
    icon: descriptorIcons.LAST_DEPARTURE,
    fieldIdentifier: ['lastDepartureTime'],
    hideIfFieldsPresent: ['lastDepartureStop'],
    fieldTransformer: ({ lastDepartureTime }, { lang }) => {
      return getIntlTime({
        time: lastDepartureTime,
        lang,
      });
    },
    getLabel: () => strings.ITINERARY.DESCRIPTORS.LAST_DEPARTURE_TIME,
  },
  [ItineraryDescriptorsTypes.FOOD_AND_DRINKS]: {
    label: strings.ITINERARY.DESCRIPTORS.FOOD_AND_DRINKS,
    icon: descriptorIcons.FOOD_AND_DRINKS,
    fieldIdentifier: ['menuImageLink'],
    useCTA: true,
    ctaLabel: 'View Menu',
    onCTAClick: (url: string) => {
      window.open(url);
    },
    getLabel: () => strings.ITINERARY.DESCRIPTORS.FOOD_AND_DRINKS,
  },
  [ItineraryDescriptorsTypes.MODE_OF_TRANSPORT]: {
    label: strings.ITINERARY.DESCRIPTORS.MODE_OF_TRANSPORT,
    icon: descriptorIcons.MODE_OF_TRANSPORT,
    fieldIdentifier: ['modeOfTravel'],
    getIcon: ({ modeOfTravel }) => {
      return dynamic(
        motIcons[modeOfTravel.label as ModeOfTravelOptions]
      ) as () => JSX.Element;
    },
    fieldTransformer: ({ modeOfTravel }) => {
      return modeOfTravel.localisedLabel;
    },
    getLabel: () => strings.ITINERARY.DESCRIPTORS.MODE_OF_TRANSPORT,
  },
  [ItineraryDescriptorsTypes.FIRST_DEPARTURE]: {
    label: strings.ITINERARY.DESCRIPTORS.FIRST_DEPARTURE,
    icon: descriptorIcons.FIRST_DEPARTURE,
    fieldIdentifier: ['firstDepartureStop', 'firstDepartureTime'],
    fieldTransformer: (
      { firstDepartureStop, firstDepartureTime },
      { lang }
    ) => {
      return `${firstDepartureStop}\nat ${getIntlTime({
        time: firstDepartureTime,
        lang,
      })}`;
    },
    getLabel: () => strings.ITINERARY.DESCRIPTORS.FIRST_DEPARTURE,
  },
  [ItineraryDescriptorsTypes.LAST_DEPARTURE]: {
    label: strings.ITINERARY.DESCRIPTORS.LAST_DEPARTURE,
    icon: descriptorIcons.LAST_DEPARTURE,
    fieldIdentifier: ['lastDepartureStop', 'lastDepartureTime'],
    fieldTransformer: ({ lastDepartureStop, lastDepartureTime }, { lang }) => {
      return `${lastDepartureStop}\nat ${getIntlTime({
        time: lastDepartureTime,
        lang,
      })}`;
    },
    getLabel: () => strings.ITINERARY.DESCRIPTORS.LAST_DEPARTURE,
  },
};

export const motIcons: Record<ModeOfTravelOptions, () => Promise<any>> = {
  [ModeOfTravelOptions.BOAT]: () => import('assets/boat'),
  [ModeOfTravelOptions.BUS_COACH]: () => import('assets/coach'),
  [ModeOfTravelOptions.CAR]: () => import('assets/car'),
  [ModeOfTravelOptions.FERRY]: () => import('assets/ferry'),
  [ModeOfTravelOptions.MINIBUS]: () => import('assets/minibus'),
  [ModeOfTravelOptions.MINIVAN]: () => import('assets/minivan'),
  [ModeOfTravelOptions.SHIP]: () => import('assets/ship'),
  [ModeOfTravelOptions.SPEEDBOAT]: () => import('assets/speedboat'),
  [ModeOfTravelOptions.SUV]: () => import('assets/suv'),
  [ModeOfTravelOptions.TRAIN]: () => import('assets/motTrain'),
  [ModeOfTravelOptions.YACHT]: () => import('assets/yacht'),
  [ModeOfTravelOptions.WALK]: () => import('assets/walkingTours'),
};

export const nearbyThingsIcon: Record<string, () => Promise<any>> = {
  [SUB_TYPES.POI]: () => import('assets/cityTours'),
  [SUB_TYPES.LANDMARK]: () => import('assets/landmarks'),
  [SUB_TYPES.SHOPPING_CENTER]: () => import('assets/shopping'),
  [SUB_TYPES.SUBSECTION_OF_POI]: () => import('assets/cityTours'),
  [SUB_TYPES.NEIGHBOURHOOD_AREA]: () => import('assets/neighbourhood'),
  [SUB_TYPES.HOHO_BUS_STOP]: () => import('assets/stop'),
  [SUB_TYPES.OTHERS]: () => import('assets/locationPin'),

  [SUB_TYPES.BREAKFAST]: () => import('assets/foodAndDrink'),
  [SUB_TYPES.LUNCH]: () => import('assets/foodAndDrink'),
  [SUB_TYPES.SNACKS]: () => import('assets/foodAndDrink'),
  [SUB_TYPES.DINNER]: () => import('assets/foodAndDrink'),

  [SUB_TYPES.DRINKS]: () => import('assets/beverage'),

  [CHILD_SECTION_TYPE.ACTIVITY]: () => import('assets/activities'),
  [CHILD_SECTION_TYPE.ATTRACTION]: () => import('assets/attractions'),
  [CHILD_SECTION_TYPE.FOOD_AND_DRINKS]: () => import('assets/foodAndDrink'),
};

export const ITINERARY_MAP_BANNER_ICON_IMAGE =
  'https://cdn-imgix.headout.com/assets/images/itinerary/itinerary-map-banner-icon.svg';

export const ITINERARY_MAP_BANNER_BG_IMAGE =
  'https://cdn-imgix.headout.com/assets/images/itinerary/itinerary-map-banner-bg.png';

export const tgidsWithSitesVisited = [28144, 3696, 26310];
