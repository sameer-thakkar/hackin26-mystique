export const DESCRIPTORS = {
  DURATION: 'DURATION',
  FREE_CANCELLATION: 'FREE_CANCELLATION',
  GUIDED_TOUR: 'GUIDED_TOUR',
};

export const MAX_DESCRIPTORS_DISPLAYED = 8;

export const MAX_CARD_DESCRIPTORS_DISPLAYED = 3;

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
  'MODE_OF_TRANSPORT',
] as const;

export const COLLECTION_CARD_DESCRIPTOR_RANKING = [
  'FREE_CANCELLATION',
  'EXTENDED_VALIDITY',
  'INSTANT_CONFIRMATION',
  'DURATION',
  'MOBILE_TICKET',
  'AUDIO_GUIDE',
  'GUIDED_TOUR',
  'TRANSFERS',
  'HOTEL_PICKUP',
  'MEALS_INCLUDED',
  'MODE_OF_TRANSPORT',
] as const;

export const COLLECTION_CARD_LONG_DESCRIPTORS = ['FREE_CANCELLATION'];

export enum ECardSectionMarkers {
  ActionButton = 'ActionButton',
  Reviews = 'Reviews',
  Descriptors = 'Descriptors',
  Category = 'Category',
  Image = 'Image',
  Whitespace = 'Whitespace',
  Title = 'Title',
  Pricing = 'Pricing',
  Availability = 'Availability',
}
