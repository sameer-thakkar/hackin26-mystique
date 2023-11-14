import {
  LL_CATEGORY_CHRISTMAS,
  LL_CATEGORY_CHRISTMAS_ACTIVE,
  LTT_CATEGORY_COMEDY,
  LTT_CATEGORY_COMEDY_ACTIVE,
  LTT_CATEGORY_DISCOUNT,
  LTT_CATEGORY_DISCOUNT_ACTIVE,
  LTT_CATEGORY_FALLBACK,
  LTT_CATEGORY_FALLBACK_ACTIVE,
  LTT_CATEGORY_KIDS,
  LTT_CATEGORY_KIDS_ACTIVE,
  LTT_CATEGORY_MUSICALS,
  LTT_CATEGORY_MUSICALS_ACTIVE,
  LTT_CATEGORY_NEW_ARRIVALS,
  LTT_CATEGORY_NEW_ARRIVALS_ACTIVE,
  LTT_CATEGORY_PLAYS,
  LTT_CATEGORY_PLAYS_ACTIVE,
  LTT_CATEGORY_TOP_SHOWS,
  LTT_CATEGORY_TOP_SHOWS_ACTIVE,
} from 'assets/SvgIcons';

export const LTT_CATEGORIES: Record<string, any> = {
  top: {
    icon: {
      default: LTT_CATEGORY_TOP_SHOWS,
      active: LTT_CATEGORY_TOP_SHOWS_ACTIVE,
    },
    name: 'Top Shows',
  },
  4009: {
    icon: {
      default: LTT_CATEGORY_DISCOUNT,
      active: LTT_CATEGORY_DISCOUNT_ACTIVE,
    },
    name: 'Discounts',
  },
  1036: {
    icon: {
      default: LTT_CATEGORY_MUSICALS,
      active: LTT_CATEGORY_MUSICALS_ACTIVE,
    },
    name: 'Musicals',
  },
  1037: {
    icon: {
      default: LTT_CATEGORY_PLAYS,
      active: LTT_CATEGORY_PLAYS_ACTIVE,
    },
    name: 'Plays',
  },
  1047: {
    icon: {
      default: LTT_CATEGORY_KIDS,
      active: LTT_CATEGORY_KIDS_ACTIVE,
    },
    name: 'Kids',
  },
  1046: {
    icon: {
      default: LTT_CATEGORY_NEW_ARRIVALS,
      active: LTT_CATEGORY_NEW_ARRIVALS_ACTIVE,
    },
    name: 'New Arrivals',
  },
  1041: {
    icon: {
      default: LTT_CATEGORY_COMEDY,
      active: LTT_CATEGORY_COMEDY_ACTIVE,
    },
    name: 'Comedy',
  },
  3683: {
    icon: {
      default: LL_CATEGORY_CHRISTMAS,
      active: LL_CATEGORY_CHRISTMAS_ACTIVE,
    },
    name: 'Christmas',
  },
  fallback: {
    icon: {
      default: LTT_CATEGORY_FALLBACK,
      active: LTT_CATEGORY_FALLBACK_ACTIVE,
    },
  },
};
