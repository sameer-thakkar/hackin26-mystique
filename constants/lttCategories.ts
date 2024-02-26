import {
  LlCategoryChristmas,
  LlCategoryChristmasActive,
} from 'assets/lttCategoryChristmas';
import {
  LttCategoryComedy,
  LttCategoryComedyActive,
} from 'assets/lttCategoryComedy';
import {
  LttCategoryDiscount,
  LttCategoryDiscountActive,
} from 'assets/lttCategoryDiscount';
import {
  LttCategoryFallback,
  LttCategoryFallbackActive,
} from 'assets/lttCategoryFallback';
import { LttCategoryKids, LttCategoryKidsActive } from 'assets/lttCategoryKids';
import {
  LttCategoryLastMinute,
  LttCategoryLastMinuteActive,
} from 'assets/lttCategoryLastMinute';
import {
  LttCategoryMusicals,
  LttCategoryMusicalsActive,
} from 'assets/lttCategoryMusicals';
import {
  LttCategoryNewArrivals,
  LttCategoryNewArrivalsActive,
} from 'assets/lttCategoryNewArrivals';
import {
  LttCategoryPlays,
  LttCategoryPlaysActive,
} from 'assets/lttCategoryPlays';
import {
  LttCategoryTopShows,
  LttCategoryTopShowsActive,
} from 'assets/lttCategoryTopShows';

export const LTT_CATEGORIES: Record<string | number, any> = {
  top: {
    icon: {
      default: LttCategoryTopShows,
      active: LttCategoryTopShowsActive,
    },
    name: 'Top Shows',
  },
  lastMinuteTickets: {
    icon: {
      default: LttCategoryLastMinute,
      active: LttCategoryLastMinuteActive,
    },
    name: 'Last minute',
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
