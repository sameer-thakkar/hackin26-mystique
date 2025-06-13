// App links
export const DROPS_MOBILE_BANNER_LINK = {
  ROME: 'https://headout.app.link/rome/banner_mweb_ho',
  PARIS: 'https://headout.app.link/paris/banner_mweb_ho',
};
export const DROPS_MOBILE_EXIT_INTENT_LINK = {
  ROME: 'https://headout.app.link/rome/exit_mweb_ho',
  PARIS: 'https://headout.app.link/paris/exit_mweb_ho',
};

export const DROPS_FALLBACK_LINK = 'https://headout.app.link/drops-fallback';

// Image and asset URLs
export const DROPS_QR_CODE_IMAGES = {
  PARIS:
    'https://cdn-imgix.headout.com/assets/images/drops/qr-code/ho_banner_paris.png',
  ROME: 'https://cdn-imgix.headout.com/assets/images/drops/qr-code/ho_banner_rome.png',
};

export const DROPS_EXIT_INTENT_QR_CODE_IMAGES = {
  PARIS:
    'https://cdn-imgix.headout.com/assets/images/drops/qr-code/ho_exit_paris.png',
  ROME: 'https://cdn-imgix.headout.com/assets/images/drops/qr-code/ho_exit_rome.png',
};

export const DROPS_IMAGE_URLS = {
  DROPS_LOGO:
    'https://cdn-imgix.headout.com/assets/images/drops/drops-logo.png',
  HEADOUT_LOGO:
    'https://cdn-imgix.headout.com/assets/images/drops/headout-logo-black.png',
  DWEB_RIGHT_SECTION_BG:
    'https://cdn-imgix.headout.com/assets/images/drops/desktop-right-section-bg.svg',
};

export const DROPS_RIVE_URI =
  'https://cdn-imgix.headout.com/assets/rive/drops_banner.riv';

// data constants

export const dropsExitIntentAvailabilityClickedKey = `drops_shown_intent`;

const DROPS_ELIGIBLE_ROME_URLS = [
  'www.thevaticantickets.com',
  'st-peters-basilica-tickets.com',
  'tickets-rome.com',
  'tickets-rome.com.colosseum',
  'castel-sant-angelo-ticket.com',
  'colosseum.tickets-rome.com',
  'tickets-rome.com.roman-pantheon-tickets',
  'colosseum.tickets-rome.com',
  'thevaticantickets.com.fr',
  'colosseum.tickets-rome.com',
  'tickets-rome.com.es',
  'colosseum.tickets-rome.com',
  'hop-on-hop-off-tickets.com.rome-bus-tours',
  'colosseum.tickets-rome.com',
  'tickets-rome.com.trevi-fountain-tickets',
];

const DROPS_ELIGIBLE_PARIS_URLS = [
  'versailles-palace-tickets.com',
  'paristickets.com.eiffel-tower',
  'paristickets.com',
  'eiffel-tower.paristickets.com',
  'disneyland.paristickets.com',
  'notre-dame-tickets.com',
  'paristickets.com.louvre-museum',
  'catacombs.tickets-paris.fr',
  'hop-on-hop-off-tickets.com.paris-bus-tours',
  'paristickets.com.disneyland-paris',
  'paristickets.com.versailles-palace',
  'paristickets.com.catacombs',
  'paristickets.com.fr.eiffel-tower',
  'louvremuseum.tickets-paris.fr',
  'tickets-paris.fr',
];

export const cityDropsEligibleUrls = {
  ROME: DROPS_ELIGIBLE_ROME_URLS,
  PARIS: DROPS_ELIGIBLE_PARIS_URLS,
};

export const CITY_WISE_LABELS = {
  PARIS: {
    price: '€10',
    city: `Paris'`,
  },
  ROME: {
    price: '€10',
    city: `Rome's`,
  },
};

export const DEFAULT_PRICE = '€10';

export const dropsEligibleCountries = ['IT', 'FR'];
