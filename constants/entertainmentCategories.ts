import {
  CategoryChristmas,
  CategoryChristmasActive,
} from 'assets/categoryChristmas';
import { CategoryComedy, CategoryComedyActive } from 'assets/categoryComedy';
import {
  CategoryDiscount,
  CategoryDiscountActive,
} from 'assets/categoryDiscount';
import {
  CategoryFallback,
  CategoryFallbackActive,
} from 'assets/categoryFallback';
import { CategoryKids, CategoryKidsActive } from 'assets/categoryKids';
import {
  CategoryLastMinute,
  CategoryLastMinuteActive,
} from 'assets/categoryLastMinute';
import {
  CategoryMusicals,
  CategoryMusicalsActive,
} from 'assets/categoryMusicals';
import {
  CategoryNewArrivals,
  CategoryNewArrivalsActive,
} from 'assets/categoryNewArrivals';
import { CategoryPlays, CategoryPlaysActive } from 'assets/categoryPlays';
import {
  CategoryTopShows,
  CategoryTopShowsActive,
} from 'assets/categoryTopShows';

export const ENTERTAINMENT_CATEGORIES: Record<string | number, any> = {
  top: {
    icon: {
      default: CategoryTopShows,
      active: CategoryTopShowsActive,
    },
    name: 'Top Shows',
  },
  lastMinuteTickets: {
    icon: {
      default: CategoryLastMinute,
      active: CategoryLastMinuteActive,
    },
    name: 'Last minute',
  },
  4009: {
    icon: {
      default: CategoryDiscount,
      active: CategoryDiscountActive,
    },
    name: 'Discounts',
  },
  1036: {
    icon: {
      default: CategoryMusicals,
      active: CategoryMusicalsActive,
    },
    name: 'Musicals',
  },
  1037: {
    icon: {
      default: CategoryPlays,
      active: CategoryPlaysActive,
    },
    name: 'Plays',
  },
  1047: {
    icon: {
      default: CategoryKids,
      active: CategoryKidsActive,
    },
    name: 'Kids',
  },
  1046: {
    icon: {
      default: CategoryNewArrivals,
      active: CategoryNewArrivalsActive,
    },
    name: 'New Arrivals',
  },
  1041: {
    icon: {
      default: CategoryComedy,
      active: CategoryComedyActive,
    },
    name: 'Comedy',
  },
  3683: {
    icon: {
      default: CategoryChristmas,
      active: CategoryChristmasActive,
    },
    name: 'Christmas',
  },
  fallback: {
    icon: {
      default: CategoryFallback,
      active: CategoryFallbackActive,
    },
  },
};
