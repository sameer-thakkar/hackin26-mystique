export const IP_INFO_TOKEN = '108f1155413636';

export const PREFERRED_COUNTRIES_CODES = [
  'us',
  'gb',
  'it',
  'fr',
  'ae',
  'sg',
  'au',
  'de',
  'th',
];

export const SUPPORTED_LANGUAGES = ['en', 'es', 'it', 'fr', 'pt', 'de', 'nl'];

export const SUPPORTED_LANGUAGES_MAP = {
  en: 'en-us',
  es: 'es-es',
  it: 'it-it',
  fr: 'fr-fr',
  pt: 'pt-pt',
  nl: 'nl-nl',
  de: 'de-de',
};

export const FLAGS_IMAGE =
  'https://cdn-imgix-open.headout.com/flags/flags@2x.png';

export const GROUP_TOUR_PREFERED_TOUR = [
  {
    value:
      "Guided tour of Vatican Museum, Sistine Chapel & St. Peter's Basilica",
    label:
      "Guided tour of Vatican Museum, Sistine Chapel & St. Peter's Basilica",
  },
  {
    value:
      "Early Access Group Tour to St. Peter's Basilica, Vatican Museum & Sistine Chapel",
    label:
      "Early Access Group Tour to St. Peter's Basilica, Vatican Museum & Sistine Chapel",
  },
];

export const GROUP_TOUR_PREFERED_TIME = [
  { value: 'Morning Tour', label: 'Morning Tour' },
  { value: 'Afternoon Tour', label: 'Afternoon Tour' },
];

export const GROUP_TOUR_PREFERED_LANG = [
  { value: 'English', label: '🇬🇧 English' },
  { value: 'French', label: '🇫🇷 Français' },
  { value: 'Spanish', label: '🇪🇸 Español' },
  { value: 'Italian', label: '🇮🇹 Italiano' },
];

export const ERROR = {
  TOUR: 'Select your prefered tour.',
  LANG: 'Select your prefered language.',
  TIME: 'Select your prefered time.',
};

export const GROUP_BOOKING_URL = '/group-submit-form';

export const MODAL_STYLE = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  content: {
    width: '75%',
    maxWidth: '1020px',
    margin: 'auto',
    boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.1)',
    background: '#fff',
    borderRadius: '4px',
    padding: '0 0px 25px',
    zIndex: '20',
    top: 0,
    bottom: 0,
    height: 'max-content',
    border: 'none',
  },
};

export const CUSTOM_TYPES = {
  MICROSITE: 'microsite',
  CONTENT_PAGE: 'content_page',
  FOOTER: 'common_footer',
  HEADER: 'common_header',
  POPUP: 'popup',
  REDIRECT: 'redirect',
};

export const DESIGN = {
  V1: 'V1 - Horizontal Card Layout',
  V2: 'V2 - Gird Cards Layout',
};

export const PAGETYPE = {
  HOMEPAGE: 'homepage',
  SEARCH: 'search',
  CATEGORY: 'category',
  MOBILE_PRODUCT_PAGE: 'MOBILE_PRODUCT_PAGE',
};

export const BANNER_PARAMS = {
  DESKTOP: {
    ASPECT_RATIO: '4:1.8',
    WIDTH: '1200',
  },
  MOBILE: {
    ASPECT_RATIO: '1:1:07',
    WIDTH: '500',
  },
};

export const POWERED_BY_HEADOUT_LOGO =
  'https://cdn-imgix-open.headout.com/Powered%20By%20Headout/powered-by-logo.svg';

export const DROPDOWN_ELEMENT = {
  HAMBURGER: 'HAMBURGER',
  LANGUAGE_SELECTOR: 'LANGUAGE_SELECTOR',
};

export const ANALYTICS_EVENTS = {
  COLLECTION_PAGE_VIEWED: 'Collection Page Viewed',
  EXPERIENCE_DETAILS_VIEWED: 'Experience Details Viewed',
  EXPERIENCE_CARD_CLICKED: 'Experience Card Clicked',
};
export const PAGE_TYPE = {
  COLLECTION_PAGE: 'Collection Page',
};

export const COMMON_HEADER_PROPS: string[] = [
  'header_links',
  'logo',
  'link_to_logo_file',
  'logo_alt_text',
  'enable_group_booking',
  'header_links',
  'logo_redirection_url',
  'localization',
  'enable_localization_menu',
  'group_booking_disclaimer',
].map(prop => `${CUSTOM_TYPES.HEADER}.${prop}`);

export const LINKED_MICROSITE_PROPS: string[] = [
  'redirect_url',
  'gtm_id',
  'header_scripts',
  'title',
  'description',
  'image',
  'favicon',
  'seo_keywords',
  'google_site_verification',
  'bing_site_verification',
  'canonical_link',
  'noindex',
  'nofollow',
  'other_meta_tags',
  'blackout_start_date',
  'blackout_end_date',
  'block_n_days_group_booking',
  'enable_powered_by_headout_logo',
  'group_form_blocked_days',
].map(prop => `${CUSTOM_TYPES.MICROSITE}.${prop}`);

export const MICROSITE_STRING_KEYS: string[] = [
  'title',
  'description',
  'gtm_id',
  'seo_keywords',
  'google_site_verification',
  'bing_site_verification',
  'noindex',
  'nofollow',
  'page_url',
  'enable_earliest_availability',
  'blackout_start_date',
  'blackout_end_date',
  'cta_url_suffix',
  'block_n_days_group_booking',
];

export const MICROSITE_OBJECT_KEYS: string[] = [
  'header_scripts',
  'image',
  'favicon',
  'other_meta_tags',
  'logo',
];

export const MICROSITE_ARRAY_KEYS: string[] = ['images'];

export const FOOTER_DISCLAIMER_ARRAY = [
  {
    UID: 'www.colosseum-rome-tickets.com',
    Category: 'Colosseum',
    City: 'Rome',
  },
  {
    UID: 'www.versailles-palace-tickets.com',
    Category: 'Versailles',
    City: 'Paris',
  },
  { UID: 'www.eiffeltickets.com', Category: 'Eiffel Tower', City: 'Paris' },
  {
    UID: 'www.alcazar-seville-tickets.com',
    Category: 'Alcazar',
    City: 'Seville',
  },
  {
    UID: 'www.alhambra-granada-tickets.com',
    Category: 'Alhambra Granada',
    City: 'Granada',
  },
  {
    UID: 'www.borghesegallerytickets.com',
    Category: 'Borghese Gallery',
    City: 'Rome',
  },
  {
    UID: 'harry-potter.london-studio-tours.com',
    Category: 'Warner Bros. Studio',
    City: 'London',
  },
  { UID: 'www.accademia-tickets.com', Category: 'Accademia', City: 'Florence' },
  {
    UID: 'www.st-peters-basilica-tickets.com',
    Category: "St. Peter's Basilica",
    City: 'Rome',
  },
  {
    UID: 'www.doge-palace-tickets.com',
    Category: "Doge's Palace",
    City: 'Venice',
  },
  { UID: 'lido.cabaret-paris.com', Category: 'Paris Cabaret', City: 'Paris' },
  {
    UID: 'www.neuschwanstein-tours.com',
    Category: 'Neuschwanstein',
    City: 'Munich',
  },
];
