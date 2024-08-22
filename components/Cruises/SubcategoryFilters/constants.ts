import { strings } from 'const/strings';

export const ICON_URLS = {
  ALL: 'https://cdn-imgix-open.headout.com/mb-icons/grid_black.svg',
  SIGHTSEEING: 'https://cdn-imgix-open.headout.com/categories/sub_1061.svg',
  DINNER: 'https://cdn-imgix-open.headout.com/categories/sub_1030.svg',
  LUNCH: 'https://cdn-imgix-open.headout.com/mb-icons/food.svg',
  COMBOS: 'https://cdn-imgix-open.headout.com/categories/sub_1080.svg',
};

export const SUBCATEGORY_PILLS = () => [
  { id: 0, label: strings.CRUISES.FILTERS.ALL, iconUrl: ICON_URLS.ALL },
  {
    id: 1,
    label: strings.CRUISES.FILTERS.SIGHTSEEING,
    iconUrl: ICON_URLS.SIGHTSEEING,
    subCatId: 1061,
  },
  {
    id: 2,
    label: strings.CRUISES.FILTERS.LUNCH,
    iconUrl: ICON_URLS.LUNCH,
    subCatId: 1094,
  },
  {
    id: 3,
    label: strings.CRUISES.FILTERS.DINNER,
    iconUrl: ICON_URLS.DINNER,
    subCatId: 1060,
  },
  {
    id: 4,
    label: strings.CRUISES.FILTERS.COMBOS,
    iconUrl: ICON_URLS.COMBOS,
    subCatId: 1080,
  },
];
