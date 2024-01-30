import LlCategoryChristmas from 'assets/llCategoryChristmas';
import LlCategoryChristmasActive from 'assets/llCategoryChristmasActive';
import LttCategoryComedy from 'assets/lttCategoryComedy';
import LttCategoryComedyActive from 'assets/lttCategoryComedyActive';
import LttCategoryDiscount from 'assets/lttCategoryDiscount';
import LttCategoryDiscountActive from 'assets/lttCategoryDiscountActive';
import LttCategoryFallback from 'assets/lttCategoryFallback';
import LttCategoryFallbackActive from 'assets/lttCategoryFallbackActive';
import LttCategoryKids from 'assets/lttCategoryKids';
import LttCategoryKidsActive from 'assets/lttCategoryKidsActive';
import LttCategoryMusicals from 'assets/lttCategoryMusicals';
import LttCategoryMusicalsActive from 'assets/lttCategoryMusicalsActive';
import LttCategoryNewArrivals from 'assets/lttCategoryNewArrivals';
import LttCategoryNewArrivalsActive from 'assets/lttCategoryNewArrivalsActive';
import LttCategoryPlays from 'assets/lttCategoryPlays';
import LttCategoryPlaysActive from 'assets/lttCategoryPlaysActive';
import LttCategoryTopShows from 'assets/lttCategoryTopShows';
import LttCategoryTopShowsActive from 'assets/lttCategoryTopShowsActive';

export const LTT_CATEGORIES: Record<string, any> = {
  top: {
    icon: {
      default: LttCategoryTopShows,
      active: LttCategoryTopShowsActive,
    },
    name: 'Top Shows',
  },
  4009: {
    icon: {
      default: LttCategoryDiscount,
      active: LttCategoryDiscountActive,
    },
    name: 'Discounts',
  },
  1036: {
    icon: {
      default: LttCategoryMusicals,
      active: LttCategoryMusicalsActive,
    },
    name: 'Musicals',
  },
  1037: {
    icon: {
      default: LttCategoryPlays,
      active: LttCategoryPlaysActive,
    },
    name: 'Plays',
  },
  1047: {
    icon: {
      default: LttCategoryKids,
      active: LttCategoryKidsActive,
    },
    name: 'Kids',
  },
  1046: {
    icon: {
      default: LttCategoryNewArrivals,
      active: LttCategoryNewArrivalsActive,
    },
    name: 'New Arrivals',
  },
  1041: {
    icon: {
      default: LttCategoryComedy,
      active: LttCategoryComedyActive,
    },
    name: 'Comedy',
  },
  3683: {
    icon: {
      default: LlCategoryChristmas,
      active: LlCategoryChristmasActive,
    },
    name: 'Christmas',
  },
  fallback: {
    icon: {
      default: LttCategoryFallback,
      active: LttCategoryFallbackActive,
    },
  },
};
