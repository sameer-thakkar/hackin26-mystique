export const WHY_DAY_TRIPS_WITH_HO_SECTION_ID = 'why-day-trips-with-ho';
export const WHY_DAY_TRIPS_WITH_HO_IMAGES = {
  CURATED_EXPERIENCES: {
    url: 'https://cdn-imgix.headout.com/assets/svg/daytrips/curated_experiences.svg',
    alt: 'Curated experiences',
  },
  EXPERT_GUIDES: {
    url: 'https://cdn-imgix.headout.com/assets/svg/daytrips/expert_guides.svg',
    alt: 'Expert guides',
  },
  FLEXI_CANCELLATION: {
    url: 'https://cdn-imgix.headout.com/assets/svg/daytrips/flexi_cancellation.svg',
    alt: 'Flexi cancellation',
  },
  GUEST_SUPPORT: {
    url: 'https://cdn-imgix.headout.com/assets/svg/daytrips/guest_support.svg',
    alt: 'Guest support',
  },
};

export const getWhyDayTripsWithHoItems = (strings: any) => [
  {
    title: strings.DAY_TRIPS.WHY_WITH_HO.CURATED_EXPERIENCES.TITLE,
    description: strings.DAY_TRIPS.WHY_WITH_HO.CURATED_EXPERIENCES.DESCRIPTION,
    image: WHY_DAY_TRIPS_WITH_HO_IMAGES.CURATED_EXPERIENCES,
  },
  {
    title: strings.DAY_TRIPS.WHY_WITH_HO.EXPERT_GUIDES.TITLE,
    description: strings.DAY_TRIPS.WHY_WITH_HO.EXPERT_GUIDES.DESCRIPTION,
    image: WHY_DAY_TRIPS_WITH_HO_IMAGES.EXPERT_GUIDES,
  },
  {
    title: strings.DAY_TRIPS.WHY_WITH_HO.FLEXI_CANCELLATION.TITLE,
    description: strings.DAY_TRIPS.WHY_WITH_HO.FLEXI_CANCELLATION.DESCRIPTION,
    image: WHY_DAY_TRIPS_WITH_HO_IMAGES.FLEXI_CANCELLATION,
  },
  {
    title: strings.DAY_TRIPS.WHY_WITH_HO.GUEST_SUPPORT.TITLE,
    description: strings.DAY_TRIPS.WHY_WITH_HO.GUEST_SUPPORT.DESCRIPTION,
    image: WHY_DAY_TRIPS_WITH_HO_IMAGES.GUEST_SUPPORT,
  },
];
