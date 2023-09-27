import { strings } from 'const/strings';
import {
  ART_AND_CULTURE_ICON,
  COMMUNITY_ICON,
  EAT_ICON,
  HOME_ICON,
  INFO_ICON_LARGE,
  KIDS_ICON,
  SHOPPING_ICON,
  TIPS_ICON,
  TO_DO_ICON,
  TRANSAPORTATION_ICON,
  TRAVEL_PLAN_ICON,
  WEATHER_ICON,
} from 'assets/SvgIcons';

export const TAGS = {
  TRAVEL_GUIDE: 'Travel Guide',
  WHERE_TO_EAT: 'Where to eat',
  WHERE_TO_STAY: 'Where to stay',
  THINGS_TO_DO: 'Things to do',
  WEATHER: 'Weather',
  NEIGHBOURHOODS: 'Neighbourhoods',
  TRANSPORTATION: 'Transportation',
  TRIP_PLANNER: 'Trip Planner',
  FAMILY_TRAVEL: 'Family Travel',
  TRAVEL_TIPS: 'Travel Tips',
  SHOPPING: 'Shopping',
  ART_AND_CULTURE: 'Art and Culture',
};

export const GUIDE_MAP = () => {
  return {
    [TAGS.TRAVEL_GUIDE]: {
      IconSvg: INFO_ICON_LARGE,
      description: strings.CITY_GUIDE_DESCRIPTIONS.TRAVEL_GUIDE,
      displayName: strings.CITY_PAGE.GUIDE_ITEM_HEADINGS.TRAVEL_GUIDE,
    },
    [TAGS.WHERE_TO_EAT]: {
      IconSvg: EAT_ICON,
      description: strings.CITY_GUIDE_DESCRIPTIONS.WHERE_TO_EAT,
      displayName: strings.CITY_PAGE.GUIDE_ITEM_HEADINGS.WHERE_TO_EAT,
    },
    [TAGS.WHERE_TO_STAY]: {
      IconSvg: HOME_ICON,
      description: strings.CITY_GUIDE_DESCRIPTIONS.WHERE_TO_STAY,
      displayName: strings.CITY_PAGE.GUIDE_ITEM_HEADINGS.WHERE_TO_STAY,
    },
    [TAGS.THINGS_TO_DO]: {
      IconSvg: TO_DO_ICON,
      description: strings.CITY_GUIDE_DESCRIPTIONS.THINGS_TO_DO,
      displayName: strings.CITY_PAGE.GUIDE_ITEM_HEADINGS.THINGS_TO_DO,
    },
    [TAGS.TRANSPORTATION]: {
      IconSvg: TRANSAPORTATION_ICON,
      description: strings.CITY_GUIDE_DESCRIPTIONS.TRANSPORTATION,
      displayName: strings.CITY_PAGE.GUIDE_ITEM_HEADINGS.TRANSPORTATION,
    },
    [TAGS.WEATHER]: {
      IconSvg: WEATHER_ICON,
      description: strings.CITY_GUIDE_DESCRIPTIONS.WEATHER,
      displayName: strings.CITY_PAGE.GUIDE_ITEM_HEADINGS.WEATHER,
    },
    [TAGS.NEIGHBOURHOODS]: {
      IconSvg: COMMUNITY_ICON,
      description: strings.CITY_GUIDE_DESCRIPTIONS.NEIGHBOURHOODS,
      displayName: strings.CITY_PAGE.GUIDE_ITEM_HEADINGS.NEIGHBOURHOODS,
    },
    [TAGS.TRIP_PLANNER]: {
      IconSvg: TRAVEL_PLAN_ICON,
      description: strings.CITY_GUIDE_DESCRIPTIONS.TRIP_PLANNER,
      displayName: strings.CITY_PAGE.GUIDE_ITEM_HEADINGS.TRIP_PLANNER,
    },
    [TAGS.FAMILY_TRAVEL]: {
      IconSvg: KIDS_ICON,
      description: strings.CITY_GUIDE_DESCRIPTIONS.FAMILY_TRAVEL,
      displayName: strings.CITY_PAGE.GUIDE_ITEM_HEADINGS.FAMILY_TRAVEL,
    },
    [TAGS.TRAVEL_TIPS]: {
      IconSvg: TIPS_ICON,
      description: strings.CITY_GUIDE_DESCRIPTIONS.TRAVEL_TIPS,
      displayName: strings.CITY_PAGE.GUIDE_ITEM_HEADINGS.TRAVEL_TIPS,
    },
    [TAGS.SHOPPING]: {
      IconSvg: SHOPPING_ICON,
      description: strings.CITY_GUIDE_DESCRIPTIONS.SHOPPING,
      displayName: strings.CITY_PAGE.GUIDE_ITEM_HEADINGS.SHOPPING,
    },
    [TAGS.ART_AND_CULTURE]: {
      IconSvg: ART_AND_CULTURE_ICON,
      description: strings.CITY_GUIDE_DESCRIPTIONS.ART_AND_CULTURE,
      displayName: strings.CITY_PAGE.GUIDE_ITEM_HEADINGS.ART_AND_CULTURE,
    },
  };
};

export const WHITELISTED_TAGS = Object.values(TAGS);

// categories
export const CAT = 'CATEGORY';
export const SUBCAT = 'SUBCATEGORY';

export const EXPLORE_CATSUBCAT = [
  {
    id: 2,
    type: CAT,
    rank: 1,
  },
  {
    id: 1007,
    type: SUBCAT,
    rank: 2,
  },
  {
    id: 1002,
    type: SUBCAT,
    rank: 3,
  },
  {
    id: 1006,
    type: SUBCAT,
    rank: 4,
  },
  {
    id: 1001,
    type: SUBCAT,
    rank: 5,
  },
  {
    id: 1003,
    type: SUBCAT,
    rank: 6,
  },
  {
    id: 1140,
    type: SUBCAT,
    rank: 7,
  },
  {
    id: 18,
    type: CAT,
    rank: 8,
  },
  {
    id: 8,
    type: CAT,
    rank: 9,
  },
  {
    id: 7,
    type: CAT,
    rank: 10,
  },
];

//trackings
export const SECTION_NAMES = {
  TOP_ATTRACTIONS: 'Top Attractions',
  POP_CAT: 'Popular Categories',
  EXPLORE: 'Explore City',
  GO_BEYOND: 'Go Beyond City',
  CITY_GUIDE: 'Go-to City Guide',
  NEARBY: 'Cities Nearby',
  MAILER: 'Email Subscription',
};
