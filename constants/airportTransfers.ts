export const VEHICLE_TYPE_ILLUSTRATION_MAP = {
  Sedan: 'https://cdn-imgix.headout.com/airport-transfer-mbs/svgs/sedan.svg',
  SUV: 'https://cdn-imgix.headout.com/airport-transfer-mbs/svgs/suv.svg',
  Hatchback:
    'https://cdn-imgix.headout.com/airport-transfer-mbs/svgs/hatchback.svg',
  Minivan:
    'https://cdn-imgix.headout.com/airport-transfer-mbs/svgs/minivan.svg',
  Bus: 'https://cdn-imgix.headout.com/airport-transfer-mbs/svgs/bus.svg',
  Train: 'https://cdn-imgix.headout.com/airport-transfer-mbs/svgs/train.svg',
} as const;

export type TVehicleTypes = keyof typeof VEHICLE_TYPE_ILLUSTRATION_MAP;

// TODO: check if reviews will need localisation
export const AIRPORT_TRANSFER_REVIEWS = [
  {
    name: 'Mark Wilson',
    rating: 5,
    vehicleType: 'Airport Bus',
    text: 'Departure point was easy to locate and it was a short wait for the bus. Only had to open the email on my phone for the conductor to scan. Best way to travel to the airport. Thank you!',
  },
  {
    name: 'Anna Meritt',
    rating: 5,
    vehicleType: 'Private Cab',
    text: 'Our cab was very easy to find due to the clear meeting point instructions that were shared with us beforehand. Entire process from booking online to getting dropped at our hotel was seamless!',
  },
  {
    name: 'James Campbell',
    rating: 4,
    vehicleType: 'Shared Shuttle',
    text: "I'm almost 80 yrs old and booking online for anything gets me a bit tense. But there was no hitch booking a ticket with your shuttle service. The driver was very cheerful and polite.",
  },
  {
    name: 'Gemma Bradford',
    rating: 5,
    vehicleType: 'Airport Train',
    text: 'Everything was perfect. Train was on time and we had a smooth ride. This was definitely a much better way to get to the city without any traffic hassles.',
  },
  {
    name: 'Abner Gutierrez',
    rating: 4,
    vehicleType: 'Private Cab',
    text: 'The cab was very clean, the driver was very polite and helpful. He even helped us with our luggage! The cab arrived at our hotel very early and we were able to reach the airport on time.',
  },
];

export const AIRPORT_TRANSFER_PRODUCT_CARD_TEMPLATE = 'Airport Transfers';

export const AIRPORT_TRANSFER_PRIMARY_SUBCATEGORY_ID = 1019;

export const CITY_AIRPORT_STATION_TGID_MAP: Record<
  string,
  Record<
    string,
    Record<
      string,
      {
        stationType: string;
        tgids: number[];
      }
    >
  >
> = {
  LONDON: {
    'Heathrow Airport': {
      'London Paddington Station': {
        stationType: 'TRAIN_STATION',
        tgids: [21373],
      },
      Oxford: {
        stationType: 'BUS_STOP',
        tgids: [26380],
      },
      'London Victoria Station': {
        stationType: 'BUS_STOP',
        tgids: [9158],
      },
    },
    'Stansted Airport': {
      'Liverpool Street Station': {
        stationType: 'TRAIN_STATION',
        tgids: [22104, 9277],
      },
      'Tottenham Hale Station': {
        stationType: 'TRAIN_STATION',
        tgids: [22104],
      },
      'Stratford Station': {
        stationType: 'TRAIN_STATION',
        tgids: [22104, 9277],
      },
      'London Victoria Station': {
        stationType: 'BUS_STOP',
        tgids: [9277],
      },
    },
    'Gatwick Airport': {
      'London Victoria Station': {
        stationType: 'BUS_STOP',
        tgids: [9156],
      },
    },
    'Luton Airport': {
      'London Victoria Station': {
        stationType: 'BUS_STOP',
        tgids: [9157],
      },
    },
  },

  ROME: {
    'Fiumicino Airport': {
      'Rome Termini Station': {
        stationType: 'TRAIN_STATION',
        tgids: [19643, 19677, 21603, 21856, 8839],
      },
      'Rome Tiburtina Station': {
        stationType: 'BUS_STOP',
        tgids: [21977, 22664],
      },
      'Siena Central TRAIN_STATION': {
        stationType: 'TRAIN_STATION',
        tgids: [22078, 22665],
      },
    },
    'Ciampino Airport': {
      'Rome Termini Station': {
        stationType: 'BUS_STOP',
        tgids: [21678, 21857, 8841],
      },
    },
  },
};

export const AIRPORT_TRANSFER_SEARCH_ENABLED_UIDS_AIRPORT_MAP: Record<
  string,
  string
> = {
  'heathrow-airport-transfers.london-tickets.co.uk': 'Heathrow Airport',
  'www.london-tickets.co.uk.heathrow-airport-transfers': 'Heathrow Airport',
  'www.london-tickets.co.uk.stansted-airport-transfers': 'Stansted Airport',
  'stansted-airport-transfers.london-tickets.co.uk': 'Stansted Airport',
  'www.tickets-rome.com.ciampino-international-airport-transfers':
    'Ciampino Airport',
  'ciampino-airport-transfers.tickets-rome.com': 'Ciampino Airport',
  'fiumicino-leonardo-da-vinci-airport-transfers.tickets-rome.com':
    'Fiumicino Airport',
};

export const AIRPORT_TRANSFER_MB_HIGHLIGHTS_DESCRIPTORS = {
  OPERATING_HOURS: 'operating hours DoNotTranslate',
  FREQUENCY: 'frequency DoNotTranslate',
  TRAVEL_TIME: 'travel time DoNotTranslate',
} as const;

export const AIRPORT_TRANSFER_MB_HIGHLIGHTS_DESCRIPTOR_H6 = Object.values(
  AIRPORT_TRANSFER_MB_HIGHLIGHTS_DESCRIPTORS
);

export const AT_TRUSTED_PARTNERS_IMG_URL =
  'https://cdn-imgix.headout.com/airport-transfer-mbs/images/at-brands.png';

export const AT_SHARED_TRUSTBOOSTER_ILLUSTRATION_URL =
  'https://cdn-imgix.headout.com/airport-transfer-mbs/svgs/shared-trustbooster-illustration.svg';

export const AT_HERO_ILLUSTRATION_IMG_URL =
  'https://cdn-imgix.headout.com/airport-transfer-mbs/svgs/airport-hero-illustration.svg';

export const PRIVATE_AT_CTA_CARD_CAR_ILLUSTRATION_URL =
  'https://cdn-imgix.headout.com/airport-transfer-mbs/svgs/car-private-at-cta-card.svg';
