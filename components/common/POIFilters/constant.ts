export const FILTER_TYPES = {
  DEALS: 'DEALS',
  GUIDED_TOURS: 'GUIDED_TOURS',
  ENTRY_TICKETS: 'ENTRY_TICKETS',
} as const;

export type TPOIFilterType = (typeof FILTER_TYPES)[keyof typeof FILTER_TYPES];
