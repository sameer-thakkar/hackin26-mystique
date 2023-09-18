import {
  LL_CATEGORY_CHRISTMAS,
  LTT_CATEGORY_COMEDY,
  LTT_CATEGORY_DISCOUNT,
  LTT_CATEGORY_FALLBACK,
  LTT_CATEGORY_KIDS,
  LTT_CATEGORY_MUSICALS,
  LTT_CATEGORY_NEW_ARRIVALS,
  LTT_CATEGORY_PLAYS,
} from 'assets/SvgIcons';

export const LTT_CATEGORIES: Record<string, any> = {
  4009: {
    icon: LTT_CATEGORY_DISCOUNT,
    name: 'Discounts',
  },
  1036: {
    icon: LTT_CATEGORY_MUSICALS,
    name: 'Musicals',
  },
  1037: {
    icon: LTT_CATEGORY_PLAYS,
    name: 'Plays',
  },
  1047: {
    icon: LTT_CATEGORY_KIDS,
    name: 'Kids',
  },
  1046: {
    icon: LTT_CATEGORY_NEW_ARRIVALS,
    name: 'New Arrivals',
  },
  1041: {
    icon: LTT_CATEGORY_COMEDY,
    name: 'Comedy',
  },
  3683: {
    icon: LL_CATEGORY_CHRISTMAS,
    name: 'Christmas',
  },
  fallback: {
    icon: LTT_CATEGORY_FALLBACK,
  },
};
