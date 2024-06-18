import { IGNORED_HEADINGS } from 'const/descriptors';
import { strings } from 'const/strings';

export const SECTION_NAMES = {
  TOP_ATTRACTIONS: 'Top Attractions',
  REVIEWS: 'Reviews',
  BUS_ROUTES: 'Bus Routes',
  COMBOS: 'Combos',
  TOP_ATTRACTIONS_COVERED: 'Top attractions covered',
  PRODUCT_CARD: 'Product Card',
  STOPS_AND_ATTRACTIONS: 'Stops and nearby attractions',
  NEARBY_ATTRACTIONS: 'Nearby Attractions',
  ITINERARY_DETAILS: 'Itinerary Details',
};

export const FILTERED_HIGHLIGHTS = () => [
  strings.HOHO.TOUR_TIMINGS,
  strings.HOHO.TOUR_FREQUENCY,
  IGNORED_HEADINGS.OPERATING_HOURS,
  IGNORED_HEADINGS.FREQUENCY,
  IGNORED_HEADINGS.AUDIO_GUIDE,
  IGNORED_HEADINGS.POPULAR_ATTRACTIONS,
  IGNORED_HEADINGS.STARTING_STOP,
  IGNORED_HEADINGS.TRAVEL_TIME,
];
