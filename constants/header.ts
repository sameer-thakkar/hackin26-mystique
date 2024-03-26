import { MB_CATEGORISATION } from 'const/index';

export const SUB_ATTRACTIONS = 'Sub-attractions';
export const MISC = 'Misc';

export const labels = {
  EXPLORE: 'EXPLORE',
  ABOUT: 'ABOUT',
};

export const ABOUT = {
  ABOUT: {
    label: 'About',
    types: [
      MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
      MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
      MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
      MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
    ],
    children: {
      HISTORY: {
        label: 'History',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      ARCHITECTURE: {
        label: 'Architecture',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      DESIGN: {
        label: 'Design',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      INSIDE: {
        label: 'Inside',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      COLLECTIONS: {
        label: 'Collections',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      PAINTINGS: {
        label: 'Paintings',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      ANIMALS_EXHIBITS: {
        label: 'Animals & Exhibits',
        types: [
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      HABITATS: {
        label: 'Habitats',
        types: [
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      CONSERVATION: {
        label: 'Conservation',
        types: [
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      PROGRAMMES: {
        label: 'Programmes',
        types: [
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      A2_SIGHTSEEING_CRUISES: {
        label: 'A2 - Sightseeing Cruises',
        types: [MB_CATEGORISATION.MB_TYPE.A2_CATEGORY],
      },
      A2_DINNER_CRUISES: {
        label: 'A2 - Dinner Cruises',
        types: [MB_CATEGORISATION.MB_TYPE.A2_CATEGORY],
      },
      A2_EVENING_CRUISES: {
        label: 'A2 - Evening Cruises',
        types: [MB_CATEGORISATION.MB_TYPE.A2_CATEGORY],
      },
      A2_LUNCH_CRUISES: {
        label: 'A2 - Lunch Cruises',
        types: [MB_CATEGORISATION.MB_TYPE.A2_CATEGORY],
      },
      A2_YACHT_TOURS: {
        label: 'A2 - Yacht Tours',
        types: [MB_CATEGORISATION.MB_TYPE.A2_CATEGORY],
      },
    },
  },
};

export const VISIT = {
  VISIT: {
    label: 'Visit',
    types: [
      MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
      MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
      MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
      MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
    ],
    children: {
      PLAN_YOUR_VISIT: {
        label: 'Plan Your Visit',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      SKIP_THE_LINE: {
        label: 'Skip the Line',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      GUIDED_TOURS: {
        label: 'Guided Tours',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      NIGHT_TOURS: {
        label: 'Night Tours',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      FOOD_TOURS: {
        label: 'Food Tours',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      TIMINGS: {
        label: 'Timings',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      DIRECTIONS: {
        label: 'Directions',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      PARKING: {
        label: 'Parking',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      ROUTES: {
        label: 'Routes',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      REQUIREMENTS: {
        label: 'Requirements',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      RULES: {
        label: 'Rules',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      FAQS: {
        label: 'FAQs',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      ENTRANCES: {
        label: 'Entrances',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      RESTAURANTS: {
        label: 'Restaurants',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      FACTS: {
        label: 'Facts',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      TIPS: {
        label: 'Tips',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      MAP: {
        label: 'Map',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
    },
  },
};

export const THINGS_TO_DO = {
  THINGS_TO_DO: {
    label: 'Things to do',
    types: [
      MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
      MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
      MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
      MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
    ],
    children: {
      RIDES: {
        label: 'Rides',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      SHOWS: {
        label: 'Shows',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      DINING: {
        label: 'Dining',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      SHOPPING: {
        label: 'Shopping',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      EVENTS: {
        label: 'Events',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      HALLOWEEN: {
        label: 'Halloween',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      CHRISTMAS: {
        label: 'Christmas',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      NEW_YEARS_EVE: {
        label: "New Year's Eve",
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
    },
  },
};

export const CITY_GUIDE = {
  CITY_GUIDE: {
    label: 'City Guide',
    types: [
      MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
      MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
      MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
      MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
      MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
    ],
    children: {
      TRAVEL_GUIDE: {
        label: 'Travel Guide',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
          MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      THINGS_TO_DO: {
        label: 'Things to do',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
          MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      TRIP_PLANNER: {
        label: 'Trip Planner',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
          MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
        children: {
          ITINERARY: {
            label: 'Itinerary',
            types: [
              MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
              MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
              MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
            ],
          },
          TRAVEL_TIPS: {
            label: 'Travel Tips',
            types: [
              MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
              MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
              MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
            ],
          },
        },
      },
      WEATHER: {
        label: 'Weather',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
          MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
        children: {
          BEST_TIME_TO_VISIT: {
            label: 'Best Time to Visit',
            types: [
              MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
              MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
              MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
            ],
          },
          JANUARY: {
            label: 'January',
            types: [
              MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
              MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
              MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
            ],
          },
          FEBRUARY: {
            label: 'February',
            types: [
              MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
              MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
              MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
            ],
          },
          MARCH: {
            label: 'March',
            types: [
              MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
              MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
              MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
            ],
          },
          APRIL: {
            label: 'April',
            types: [
              MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
              MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
              MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
            ],
          },
          MAY: {
            label: 'May',
            types: [
              MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
              MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
              MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
            ],
          },
          JUNE: {
            label: 'June',
            types: [
              MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
              MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
              MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
            ],
          },
          JULY: {
            label: 'July',
            types: [
              MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
              MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
              MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
            ],
          },
          AUGUST: {
            label: 'August',
            types: [
              MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
              MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
              MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
            ],
          },
          SEPTEMBER: {
            label: 'September',
            types: [
              MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
              MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
              MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
            ],
          },
          OCTOBER: {
            label: 'October',
            types: [
              MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
              MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
              MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
            ],
          },
          NOVEMBER: {
            label: 'November',
            types: [
              MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
              MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
              MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
            ],
          },
          DECEMBER: {
            label: 'December',
            types: [
              MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
              MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
              MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
              MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
            ],
          },
        },
      },
      WHERE_TO_EAT: {
        label: 'Where to eat',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
          MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      WHERE_TO_STAY: {
        label: 'Where to stay',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
          MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      NEIGHBOURHOODS: {
        label: 'Neighbourhoods',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
          MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      FAMILY_TRAVEL: {
        label: 'Family Travel',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
          MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      TRANSPORTATION: {
        label: 'Transportation',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,

          MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
          MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      SHOPPING: {
        label: 'Shopping',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
          MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
      FESTIVALS_EVENTS: {
        label: 'Festivals and Events',
        types: [
          MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
          MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
        ],
      },
    },
  },
};

export const DOCUMENT_PRIORITY = [
  MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
  MB_CATEGORISATION.MB_TYPE.B1_GLOBAL,
  MB_CATEGORISATION.MB_TYPE.B1_GLOBAL_HOMEPAGE,
  MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
  MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
  MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
  MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
  MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
  MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
  MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
];

export const COLLECTION_MB_MENU_ORDER = [
  'ABOUT',
  'VISIT',
  'THINGS_TO_DO',
  'CITY_ATTRACTIONS',
  'CITY_TOURS',
  'CRUISES',
  'THEMES',
  'CITY_GUIDE',
];

export const NON_COLLECTION_MB_MENU_ORDER = [
  'TOP_THINGS_TO_DO',
  'CITY_TOURS',
  'THEMES',
  'ATTRACTIONS',
  'CRUISES',
  'CITY_GUIDE',
];

export const NESTED_MENU_ORDER = {
  ABOUT: [],
  VISIT: [
    'PLAN_YOUR_VISIT',
    'SKIP_THE_LINE',
    'GUIDED_TOURS',
    'NIGHT_TOURS',
    'FOOD_TOURS',
    'TIMINGS',
    'DIRECTIONS',
    'PARKING',
    'ROUTES',
    'REQUIREMENTS',
    'RULES',
    'FAQS',
    'ENTRANCES',
    'RESTAURANTS',
    'FACTS',
    'TIPS',
    'MAP',
  ],
  THINGS_TO_DO: [
    'RIDES',
    'SHOWS',
    'DINING',
    'SHOPPING',
    'EVENTS',
    'HALLOWEEN',
    'CHRISTMAS',
    'NEW_YEARS_EVE',
  ],
  CITY_GUIDE: [
    'TRAVEL_GUIDE',
    'THINGS_TO_DO',
    'TRIP_PLANNER',
    'WEATHER',
    'WHERE_TO_EAT',
    'WHERE_TO_STAY',
    'NEIGHBOURHOODS',
    'FAMILY_TRAVEL',
    'TRANSPORTATION',
    'SHOPPING',
    'FESTIVALS_EVENTS',
  ],
};
