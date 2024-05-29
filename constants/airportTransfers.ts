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

export const AIRPORT_TRANSFER_MB_HIGHLIGHTS_DESCRIPTORS = {
  OPERATING_HOURS: 'operating hours DoNotTranslate',
  FREQUENCY: 'frequency DoNotTranslate',
  TRAVEL_TIME: 'travel time DoNotTranslate',
} as const;

export const AIRPORT_TRANSFER_MB_HIGHLIGHTS_DESCRIPTOR_H6 = Object.values(
  AIRPORT_TRANSFER_MB_HIGHLIGHTS_DESCRIPTORS
);
