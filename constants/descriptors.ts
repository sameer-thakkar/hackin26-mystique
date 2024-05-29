import { AIRPORT_TRANSFER_MB_HIGHLIGHTS_DESCRIPTORS } from './airportTransfers';

export const MAX_DESCRIPTORS_DISPLAYED = 5;

export const DESCRIPTOR_RANKING_LOGIC = [
  'FREE_CANCELLATION',
  'EXTENDED_VALIDITY',
  'INSTANT_CONFIRMATION',
  'MOBILE_TICKET',
  'DURATION',
  'AUDIO_GUIDE',
  'GUIDED_TOUR',
  'TRANSFERS',
  'HOTEL_PICKUP',
  'MEALS_INCLUDED',
];

export const IGNORED_HEADINGS = {
  OPERATING_HOURS: 'operating hours DoNotTranslate',
  FREQUENCY: 'frequency DoNotTranslate',
  AUDIO_GUIDE: 'audio guide DoNotTranslate',
  POPULAR_ATTRACTIONS: 'popular attractions DoNotTranslate',
  STARTING_STOP: 'starting stop DoNotTranslate',
  TRAVEL_TIME: AIRPORT_TRANSFER_MB_HIGHLIGHTS_DESCRIPTORS.TRAVEL_TIME,
};
