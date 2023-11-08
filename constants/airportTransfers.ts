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

export const AIRPORT_TRANSFER_REVIEWS = [
  {
    avatarPath: '/static/images/review-avatar-1.png',
    name: 'Hung Wai',
    countryEmoji: '🇭🇰',
    country: 'Hong Kong',
    // stars: 5,
    text: `We LOVEEEE it! The show is great! Very good atmosphere and everyone's so happy after the play. The Headout platform is easy to use. You just scan your ticket on your phone for entry.`,
  },
  {
    avatarPath: '/static/images/review-avatar-2.png',
    name: 'Karen Kadore',
    countryEmoji: '🇬🇧 ',
    country: 'United Kingdom',
    // stars: 5,
    text:
      'Ease of booking, regular updates and the text on the day with tickets, maps and easy ordering from the bar. The show was brilliant. Wonderful day!',
  },

  {
    avatarPath: `/static/images/review-avatar-3.png`,
    name: 'Lucia Quiroz',
    countryEmoji: '🇨🇭 ',
    country: 'Switzerland',
    // stars: 5,
    text:
      'Headout helpdesk, was awesome when I had a problem... that at the end turn out to be my fault. The show was fantastic. Even my son loved it. Recommended for groups of friends and families!',
  },
  {
    avatarPath: `/static/images/review-avatar-3.png`,
    name: '4th reviewer',
    countryEmoji: '🇨🇭 ',
    country: 'Switzerland',
    // stars: 5,
    text:
      'Headout helpdesk, was awesome when I had a problem... that at the end turn out to be my fault. The show was fantastic. Even my son loved it. Recommended for groups of friends and families!',
  },
];

export const AIRPORT_TRANSFER_PRODUCT_CARD_TEMPLATE = 'Airport Transfers';
