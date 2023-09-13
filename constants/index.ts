import {
  AIRPLANE_TOURS,
  AIRPORT_TRANSFERS,
  BEACHES,
  BIKES_AND_SEGWAY,
  CABARETS,
  CABLE_CAR,
  CAMPING,
  CITY,
  CITY_PASSES,
  CLASS_C_RV,
  COFFEE_AND_TEA,
  COMBOS,
  COMING_SOON,
  COOKING_CLASSES,
  CRUISE_TICKETS,
  CRUISES,
  DANCE_CLASSES,
  DINING_AND_EXPERIENCES,
  EVENING_CRUISES,
  EXTERNAL_LINK,
  FOOD_AND_DRINK,
  FOOD_PASSES,
  FOOD_TOURS,
  GUIDED_TOURS,
  HELICOPTER_TOURS,
  HOP_ON_HOP_OFF_TOURS,
  HOT_AIR_BALLOONS,
  LANDMARKS,
  MULTI_DAY_TOURS,
  MUSICALS,
  NATIONAL_PARKS,
  OBSERVATION_DECKS,
  OPERA,
  PARKS,
  PHOTOGRAPHY_CLASSES,
  PHOTOGRAPHY_TOURS,
  PLAYS,
  PLUS,
  PRIVATE_TOURS,
  PUB_CRAWLS,
  QUADBKING,
  RACING,
  RELIGIOUS_SITES,
  SANDBOARDING,
  SHOPPING,
  SNORKELING,
  SPORTS,
  SURFING,
  THEME_PARKS,
  TRAIN_PASSES,
  TRANSPORTATION,
  TRAVEL_INSURANCE,
  WALKING_TOURS,
  WATER_PARKS,
  WIFI_AND_SIM_CARDS,
  WINERIES,
  YACHT_TOURS,
  ZOO_AND_AQUARIUM,
} from 'assets/SvgIcons';

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

export const COOKIE = {
  SANDBOX_ID: 'h-sid',
  CASHBACK_EXP_VIEWED: 'cshbck-exp',
  CURRENT_CURRENCY: 'currentCurrency',
  EXPERIMENT_OVERRIDE: 'experimentOverride',
  CLARITY_PROJECT_ID: 'clarity-pid',
};

export const TIME = {
  SECONDS_IN_YEARS: 365 * 24 * 60 * 60,
  SECONDS_IN_DAY: 24 * 60 * 60,
  IN_YEARS: 365 * 24 * 60 * 60 * 1000,
  IN_DAYS: 24 * 60 * 60 * 1000,
  IN_HOURS: 60 * 60 * 1000,
  IN_MINUTES: 60 * 1000,
  IN_SECONDS: 1000,
};

export const ASPECT_RATIO = {
  GLOBAL_MB: '16:10',
};

export const NON_SUPPORTED_LANGUAGES = ['zh-cn', 'zh-tw'];

export const SUPPORTED_LANGUAGES = [
  'en',
  'es',
  'it',
  'fr',
  'pt',
  'de',
  'nl',
  'ja',
  'tw',
  'cn',
  'ko',
  'id',
  'pl',
  'ar',
] as const;

export type LanguagesUnion = typeof SUPPORTED_LANGUAGES[number];

export const SUPPORTED_LOCALE_MAP: Record<LanguagesUnion, string> = {
  en: 'en-us',
  es: 'es-es',
  it: 'it-it',
  fr: 'fr-fr',
  pt: 'pt-pt',
  nl: 'nl-nl',
  de: 'de-de',
  ja: 'ja-jp',
  cn: 'zh-cn',
  tw: 'zh-tw',
  ko: 'ko-kr',
  id: 'id-id',
  pl: 'pl-pl',
  ar: 'ar-ae',
};

type TLanguageMap = { displayName: string; locale: string; code: string };

export const LANGUAGE_MAP: Record<LanguagesUnion, TLanguageMap> = {
  en: {
    displayName: 'English',
    locale: 'en-us',
    code: 'en',
  },
  it: {
    displayName: 'Italiano',
    locale: 'it-it',
    code: 'it',
  },
  es: {
    displayName: 'Español',
    locale: 'es-es',
    code: 'es',
  },
  fr: {
    displayName: 'Français',
    locale: 'fr-fr',
    code: 'fr',
  },
  de: {
    displayName: 'Deutsch',
    locale: 'de-de',
    code: 'de',
  },
  nl: {
    displayName: 'Nederlands',
    locale: 'nl-nl',
    code: 'nl',
  },
  pt: {
    displayName: 'Português',
    locale: 'pt-pt',
    code: 'pt',
  },
  cn: {
    displayName: '简体中文',
    locale: 'zh-cn',
    code: 'zh-hans',
  },
  tw: {
    displayName: '繁體中文 ',
    locale: 'zh-tw',
    code: 'zh-hant',
  },
  ja: {
    displayName: '日本語',
    locale: 'ja-jp',
    code: 'ja',
  },
  ko: {
    displayName: 'Korean',
    locale: 'ko-kr',
    code: 'ko',
  },
  id: {
    displayName: 'Indonesian',
    locale: 'id-id',
    code: 'id',
  },
  pl: {
    displayName: 'Polish',
    locale: 'pl-pl',
    code: 'pl',
  },
  ar: {
    displayName: 'Arabic',
    locale: 'ar-ae',
    code: 'ar',
  },
};

export const PRISMIC_LANG_TO_ROUTE_PARAM: Record<string, string> = {
  'en-us': 'en',
  'it-it': 'it',
  'es-es': 'es',
  'fr-fr': 'fr',
  'de-de': 'de',
  'nl-nl': 'nl',
  'pt-pt': 'pt',
  'zh-cn': 'cn',
  'zh-tw': 'tw',
  'ja-jp': 'ja',
  'ko-kr': 'ko',
  'id-id': 'id',
  'pl-pl': 'pl',
  'ar-ae': 'ar',
};

export const LANGUAGE_PARAMS_REGEX = new RegExp(
  `^(/)?(${SUPPORTED_LANGUAGES.join('|')}){0,2}(/)`
);

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

export const GROUP_BOOKING_URL = '/api/group-submit-form';

export const CUSTOM_TYPES = {
  MICROSITE: 'microsite',
  VENUE_PAGE: 'venue_page',
  CONTENT_PAGE: 'content_page',
  FOOTER: 'common_footer',
  HEADER: 'common_header',
  POPUP: 'popup',
  REDIRECT: 'redirect',
  COMMON_DATA: 'common_data',
  LISTICLE: 'page',
  CONTENT_FRAMEWORK: 'content_framework',
  SHOW_PAGE: 'showpage',
  GLOBAL_HOMEPAGE: 'global_homepage',
  GLOBAL_CITY: 'global_city',
  GLOBAL_COLLECTION: 'global_collection',
  GLOBAL_COUNTRY: 'global_country',
  GLOBAL_EXPERIENCE: 'global_experience',
  PRODUCT_CARDS: 'product_cards',
  SAFETY_BANNER: 'safety_banner',
  PROMO_CODES: 'promo_codes',
  HEADOUT_CATEGORY_CONTENT: 'ho_category_content',
};

export const DOC_TYPES: Record<string, string> = {
  microsite: 'Microsite',
  content_page: 'Content Page',
  showpage: 'Showpage',
  venue_page: 'Venue Page',
  global_homepage: 'Global Homepage',
  global_city: 'Global City',
  global_country: 'Global Country',
  global_collection: 'Global Collection',
  global_experience: 'Global Experience',
  product_cards: 'Product Cards',
  ho_category_content: 'Headout Content',
  content_framework: 'Content Framework',
};

export const HEADOUT_CATEGORY_CONTENT_TYPE: Record<string, string> = {
  c: 'Collection',
  ca: 'Category',
  sc: 'Sub-category',
  city: 'City',
};

export const CONTENT_PAGE_TYPES = [CUSTOM_TYPES.CONTENT_PAGE];

export const DESIGN = {
  V1: 'V1 - Horizontal Card Layout',
  V2: 'V2 - Gird Cards Layout',
  V3: 'V3 - Grid(v2) + Collapsible(v1) Layout',
};

export const PAGETYPE = {
  HOMEPAGE: 'homepage',
  SEARCH: 'search',
  CATEGORY: 'category',
  MOBILE_PRODUCT_PAGE: 'MOBILE_PRODUCT_PAGE',
};

export const POWERED_BY_HEADOUT_LOGO =
  'https://cdn-imgix-open.headout.com/Powered%20By%20Headout/powered-by-logo.svg';

export const HEADOUT_PURPS_LOGO =
  'https://cdn-imgix-open.headout.com/MB/UGC/headout_logo_circle.png';

export const DROPDOWN_ELEMENT = {
  HAMBURGER: 'HAMBURGER',
  LANGUAGE_SELECTOR: 'LANGUAGE_SELECTOR',
};

export const ANALYTICS_EVENTS = {
  COLLECTION_PAGE_VIEWED: 'Collection Page Viewed',
  EXP_COMPONENT_LOADED: 'Experiment Component Loaded',
  EXPERIENCE_DETAILS_VIEWED: 'Experience Details Viewed',
  EXPERIENCE_CARD_CLICKED: 'Experience Card Clicked',
  EXPERIENCE_MORE_DETAILS_VIEWED: 'More Details Viewed',
  EXPERIENCE_INFO_TAB_CLICKED: 'Experience Information Tab Clicked',
  MICROSITE_PAGE_VIEWED: 'Microsite Page Viewed',
  CONTENT_CARD_CLICKED: 'Content Card Clicked',
  DROPDOWN_SHOWN: 'Header Dropdown Shown',
  DROPDOWN_OPTION_SELECTED: 'Header Dropdown Option Clicked',
  GROUP_FORM_VIEWED: 'Group Form Viewed',
  EXPERIMENT_VIEWED: 'Experiment Viewed',
  CONTENT_TAB_CLICKED: 'Longform Content Tab Clicked',
  FAQ_ITEM_CLICKED: 'FAQ Item Clicked',
  QUICK_LINKS_CLICKED: 'Footer Quick Link Clicked',
  ACCORDION_TOGGLED: 'Accordion Item Toggled',
  INFO_TAB_CLICKED: 'Information Tab Clicked',
  EXPERIENCE_CARD_VISIBLE: 'Experience Card Visible',
  CONTENT_PAGE_PROMO_CLICKED: 'Content Page Apply Promo Clicked',
  PAGINATION_CLICKED: 'Pagination Clicked',
  CUSTOMER_REVIEWS_SCROLLED: 'Customer Reviews Scrolled',
  SEARCH_STARTED: 'Search Started',
  SEARCH_RESULT_CLICKED: 'Search Result Clicked',
  SEARCH_ICON_CLICKED: 'Search Icon Clicked',
  COMBO_VARIANT: {
    POPUP_VIEWED: 'MB Combo Variant Popup viewed',
    VARIANT_CLICKED: 'MB Combo Variant Selected',
    POPUP_CLOSED: 'MB Combo Variant Popup closed',
    MORE_DETAILS: 'MB Combo Variant More Details',
  },
  MB_BANNER: {
    VISIBLE: 'MB Banner Visible',
    CTA_CLICKED: 'MB Banner CTA Clicked',
    BANNER_SCROLL: 'MB Banner Scroll',
    CHEVRON_CLICKED: 'MB Banner Chevron Clicked',
  },
  CHEVRON_CLICKED: 'Chevron Clicked',
  CATEGORY_TAB_CLICKED: 'Category Tab Clicked',
  MB_SORT_BY_CLICKED: 'MB Sort By Clicked',
  MB_EXPERIENCE_SORTED: 'MB Experiences Sorted',
  EXPERIENCE_CARD_EXPANDED: 'Experience Card Expanded',
  EXPERIENCE_CARD_MORE_DETAILS_CLICKED: 'Experience Card More Details Clicked',
  EXPERIENCE_CARD_BOOK_NOW_CLICKED: 'Experience Card Book Now Clicked',
  CHECK_AVAILABILITY_CLICKED: 'Check Availability Clicked',
  YT_VIDEO_PLAYED: 'Video Played',
  YT_VIDEO_VIEWED: 'Video Viewed',
  YT_VIDEO_LOADED: 'Youtube Video Section Viewed',
  MB_VIDEO_PLAYED: 'MB Video Played',
  MB_VIDEO_VIEWED: 'MB Video Viewed',
  MB_LANGUGAGE_CHANGED: 'MB Language Changed',
  MB_CURRENCY_CHANGED: 'MB Currency Changed',
  LP_TO_BOOKING_PAGE: 'LP to booking page',
  LP_TO_SHOWPAGE: 'LP to showpage',
  LOCALE_CLICKED: 'Locale Selector Clicked',
  LOCALE_POPUP_VIEWED: 'Locale Popup Viewed',
  LOCALE_OPTION_SELECTED: 'Locale Option Selected',
  LOCALE_POPUP_CLOSED: 'Locale Popup Closed',
  LOCALE_PRICE_LOADED: 'Product Card Price Loaded',
  UGC: {
    VIEWED: 'Influencer Content Section Viewed',
    CARD_VISIBLE: 'Influencer Content Embed Card Visible',
    CARD_CLICKED: 'Influencer Content Embed Card Clicked',
    POPUP_VIEWED: 'Influencer Content Popup Viewed',
    POPUP_CLOSED: 'Influencer Content Popup Closed',
    USERNAME_CLICKED: 'Influencer Content Username Clicked',
    REDIRECT_TO_IG: 'Influencer Content Redirect To Instagram',
  },
  THEATRE_PAGE: {
    THEATRE_ADDRESS_CLICKED: 'Theatre Address Clicked',
    BEST_SEATS_CTA_CLICKED: 'Best Seats CTA Clicked',
    THEATRE_CARD_CLICKED: 'Theatre Card Clicked',
  },
  PRODUCT_CARD_IMAGE_VIEWED: 'Product Card Image Viewed',
  VIDEO_AUTOPLAY_STARTED: 'Video Autoplay Started',
  VIDEO_AUTOPLAY_FAILED: 'Video Autoplay Failed',
  SCROLL_TO_TOP: 'Scroll To Top Button Clicked',
  HAMBURGER_MENU_CLICKED: 'Hamburger Menu Clicked',
  TOC_OPENED: 'Table Of Contents Opened',
  TOC_OPTION_SELECTED: 'Table of Contents Option Selected',
  TOOLTIP_VIEWED: 'Tooltip Viewed',
  LISTICLE_READ_MORE_CLICKED: 'Listicle Read More Clicked',
  LISTICLE_CTA_CLICKED: 'Listicle CTA Clicked',
  MAP_LINK_CLICKED: 'Map Link Clicked',
  IMAGE_GALLERY: {
    IMAGE_GALLERY_OPENED: 'Image Gallery Opened',
    IMAGE_VIEWED: 'Image Viewed',
    IMAGE_GALLERY_CLOSED: 'Image Gallery Closed',
    IMAGE_GALLERY_SECTION_VIEWED: 'Image Gallery Section Viewed',
    IMAGE_GALLERY_PRESENT: 'Image Gallery Component Present',
  },
  DATE_FILTER_APPLIED: 'Date Filter Applied',
  DATE_UNAVAILABLE_DRAWER_VIEWED: 'Date Unavailable Drawer Viewed',
  MICROSITE_PAGE_CTA_CLICKED: 'Microsite Page CTA Clicked',
  SEE_ALL_CLICKED: 'See All Clicked',
  PAGE_SECTION_VIEWED: 'Page Section Viewed',
};

export const PAGE_TYPE = {
  COLLECTION_PAGE: 'Collection Page',
};

export const COMMON_DATA_PROPS_FOR_LISTICLE: string[] = [
  'listicle_banner_images',
  'listicle_common_title',
  'listicle_common_summary',
  'listicle_categories',
  'why_book_from_us',
  'google_site_verification',
  'bing_site_verification',
  'header_scripts',
].map((prop) => `${CUSTOM_TYPES.COMMON_DATA}.${prop}`);

export const LINKED_MICROSITE_PROPS: string[] = [
  'redirect_url',
  'gtm_id',
  'header_scripts',
  'title',
  'description',
  'image',
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
  'group_form_blocked_days',
  'alert_popup',
  'show_covid19_alert',
].map((prop) => `${CUSTOM_TYPES.MICROSITE}.${prop}`);

export const MICROSITE_STRING_KEYS: string[] = [
  'title',
  'description',
  'gtm_id',
  'seo_keywords',
  'google_site_verification',
  'bing_site_verification',
  'noindex',
  'nofollow',
  'enable_earliest_availability',
  'blackout_start_date',
  'blackout_end_date',
  'cta_url_suffix',
  'block_n_days_group_booking',
  'show_covid19_alert',
  'canonical_link',
];

export const DESCRIPTORS = {
  DURATION: 'DURATION',
};

export const MICROSITE_OBJECT_KEYS: string[] = [
  'header_scripts',
  'image',
  'other_meta_tags',
];

export const MICROSITE_ARRAY_KEYS: string[] = ['images', 'body1'];

export const FULL_WIDTH_SLICES = [
  'background',
  'card_carousel',
  'comparision_table',
];

export const SLACK_USER_MAP = {
  DENVER: 'UCD4L96E5',
  SHADAB: 'US6UTFY5T',
  AAKASH: 'UJU56QQDT',
  SURYA: 'U0AH1EZ62',
  AANCHAL: 'UKGHAUUMQ',
  TWINKLE: 'UCK7VFQBA',
  CHETAN: 'U21LHC4V9',
  HEROSHA: 'U1ZEQS291',
  KARTHIK: 'U6ALFJ4R5',
};

export const ALLOW_IMMEDIATE_NESTING = true;

export const DONT_AUTO_SCROLL = false;

export const DONT_HOIST = false;

export const HEADOUT_API_ENDPOINT = 'https://api.headout.com/api';

export const HEADOUT_NAKED_DOMAIN = 'headout.com';

export const TOUR_COMPARISION_DESIGN = {
  TYPE_1: 'Type-1',
  TYPE_2: 'Type-2',
};

export const RIV_LOGO = 'https://cdn-imgix-open.headout.com/MB/RIV/mb_logo.riv';

export const FALLBACK_IMAGE =
  'https://cdn-imgix-open.headout.com/blog/media/images/Blog.png';

export const FALLBACK_IMAGES = {
  DINING: 'https://cdn-imgix-open.headout.com/MB/fallback-images/dining.png',
  HOTELS: 'https://cdn-imgix-open.headout.com/MB/fallback-images/hotels.png',
  RIDES_AND_ATTRACTIONS:
    'https://cdn-imgix-open.headout.com/MB/fallback-images/rides-and-attractions.png',
  SHOWS: 'https://cdn-imgix-open.headout.com/MB/fallback-images/shows.png',
  SHOPPING:
    'https://cdn-imgix-open.headout.com/MB/fallback-images/shopping.png',
  TICKETS: 'https://cdn-imgix-open.headout.com/MB/fallback-images/tickets.png',
  THEMEPARKS:
    'https://cdn-imgix-open.headout.com/MB/fallback-images/themeparks.png',
};

export const SAFETY_DETAILS_IMAGES = {
  SAFETY_MASK_STAFF: 'https://cdn-imgix-open.headout.com/sites/safe/mask.jpg',
  SAFETY_MASK_GUEST: 'https://cdn-imgix-open.headout.com/sites/safe/mask.jpg',
  SAFETY_MASK_BOTH: 'https://cdn-imgix-open.headout.com/sites/safe/mask.jpg',
  SAFETY_MASK_DEFAULT: 'https://cdn-imgix-open.headout.com/sites/safe/mask.jpg',
  SAFETY_TEMPERATURE_STAFF:
    'https://cdn-imgix-open.headout.com/sites/safe/temp.jpg',
  SAFETY_TEMPERATURE_GUEST:
    'https://cdn-imgix-open.headout.com/sites/safe/temp.jpg',
  SAFETY_TEMPERATURE_DEFAULT:
    'https://cdn-imgix-open.headout.com/sites/safe/temp.jpg',
  SAFETY_HANDWASH: 'https://cdn-imgix-open.headout.com/sites/safe/handwash.jpg',
  SAFETY_CLEANED_VEHICLES:
    'https://cdn-imgix-open.headout.com/sites/safe/equipments.jpg',
  SAFETY_CLEANED_EQUIPMENTS:
    'https://cdn-imgix-open.headout.com/sites/safe/equipments.jpg',
  SAFETY_CLEANED_DEFAULT:
    'https://cdn-imgix-open.headout.com/sites/safe/equipments.jpg',
  SAFETY_TRAINED_STAFF:
    'https://cdn-imgix-open.headout.com/sites/safe/trained.jpg',
  SAFETY_SOCIAL_DISTANCING:
    'https://cdn-imgix-open.headout.com/sites/safe/guidelines.jpg',
  SAFETY_RESTRICTED_CAPACITY:
    'https://cdn-imgix-open.headout.com/sites/safe/guidelines.jpg',
  SAFETY_SOCIAL_DISTANCING_NO_GROUPS:
    'https://cdn-imgix-open.headout.com/sites/safe/guidelines.jpg',
  SAFETY_RESTRICTED_CAPACITY_NO_GROUPS:
    'https://cdn-imgix-open.headout.com/sites/safe/guidelines.jpg',
  SAFETY_SOCIAL_DISTANCING_DEFAULT:
    'https://cdn-imgix-open.headout.com/sites/safe/guidelines.jpg',
};

export const SAFETY_DETAILS_TYPE = {
  SAFETY_MASK_STAFF: 'SAFETY_MASK_STAFF',
  SAFETY_MASK_GUEST: 'SAFETY_MASK_GUEST',
  SAFETY_MASK_BOTH: 'SAFETY_MASK_BOTH',
  SAFETY_MASK_DEFAULT: 'SAFETY_MASK_DEFAULT',
  SAFETY_TEMPERATURE_STAFF: 'SAFETY_TEMPERATURE_STAFF',
  SAFETY_TEMPERATURE_GUEST: 'SAFETY_TEMPERATURE_GUEST',
  SAFETY_TEMPERATURE_DEFAULT: 'SAFETY_TEMPERATURE_DEFAULT',
  SAFETY_HANDWASH: 'SAFETY_HANDWASH',
  SAFETY_CLEANED_VEHICLES: 'SAFETY_CLEANED_VEHICLES',
  SAFETY_CLEANED_EQUIPMENTS: 'SAFETY_CLEANED_EQUIPMENTS',
  SAFETY_CLEANED_DEFAULT: 'SAFETY_CLEANED_DEFAULT',
  SAFETY_TRAINED_STAFF: 'SAFETY_TRAINED_STAFF',
  SAFETY_SOCIAL_DISTANCING: 'SAFETY_SOCIAL_DISTANCING',
  SAFETY_RESTRICTED_CAPACITY: 'SAFETY_RESTRICTED_CAPACITY',
  SAFETY_SOCIAL_DISTANCING_NO_GROUPS: 'SAFETY_SOCIAL_DISTANCING_NO_GROUPS',
  SAFETY_RESTRICTED_CAPACITY_NO_GROUPS: 'SAFETY_RESTRICTED_CAPACITY_NO_GROUPS',
  SAFETY_SOCIAL_DISTANCING_DEFAULT: 'SAFETY_SOCIAL_DISTANCING_DEFAULT',
  SAFETY_NO_GROUPS: 'SAFETY_NO_GROUPS',
};

export const CLUBBED_SAFETY_TAGS = {
  MASK: [
    SAFETY_DETAILS_TYPE.SAFETY_MASK_STAFF,
    SAFETY_DETAILS_TYPE.SAFETY_MASK_GUEST,
    SAFETY_DETAILS_TYPE.SAFETY_MASK_BOTH,
  ],
  TEMPERATURE: [
    SAFETY_DETAILS_TYPE.SAFETY_TEMPERATURE_STAFF,
    SAFETY_DETAILS_TYPE.SAFETY_TEMPERATURE_GUEST,
    SAFETY_DETAILS_TYPE.SAFETY_TEMPERATURE_DEFAULT,
  ],
  CLEAN: [
    SAFETY_DETAILS_TYPE.SAFETY_CLEANED_VEHICLES,
    SAFETY_DETAILS_TYPE.SAFETY_CLEANED_EQUIPMENTS,
    SAFETY_DETAILS_TYPE.SAFETY_CLEANED_DEFAULT,
  ],
  DISTANCING_NO_GROUP: [
    SAFETY_DETAILS_TYPE.SAFETY_SOCIAL_DISTANCING,
    SAFETY_DETAILS_TYPE.SAFETY_NO_GROUPS,
    SAFETY_DETAILS_TYPE.SAFETY_SOCIAL_DISTANCING_NO_GROUPS,
  ],
  RESTRICTED_CAPACITY_NO_GROUPS: [
    SAFETY_DETAILS_TYPE.SAFETY_RESTRICTED_CAPACITY,
    SAFETY_DETAILS_TYPE.SAFETY_NO_GROUPS,
    SAFETY_DETAILS_TYPE.SAFETY_RESTRICTED_CAPACITY_NO_GROUPS,
  ],
};

export const THEMES = {
  DEFAULT: 'Default',
  INHERIT: 'Inherit',
  MIN_BLUE: 'Minimal Blue',
  DEF_INTERIM: 'Default Interim',
};

export const SIDEBAR_TYPES = {
  DEFAULT: 'default',
  FIXED: 'fixed',
  PRODUCT_CARD: 'product-card',
  COMBO_VARIANT: 'combo-variant',
  SIDE_NAV: 'side-navigation',
  LISTICLE_CARD: 'listicle-card',
  CONTACT_US_PANEL: 'contact-us-panel',
};

export const DATE_FORMAT_TYPES = {
  FULL: 'FULL',
  SHORT: 'SHORT',
};

export const LOCALISED_DATE_FORMATS = {
  en: {
    SHORT: 'DD-MMM-YY',
    FULL: 'DD-MMMM-YYYY',
    DATE_MONTH: 'MMM Do',
  },
  es: {
    SHORT: 'DD-MMM-YY',
    FULL: 'DD-MMMM-YYYY',
    DATE_MONTH: 'D MMM',
  },
  de: {
    SHORT: 'DD-MMMM-YYYY',
    FULL: 'DD-MMMM-YYYY',
    DATE_MONTH: 'D MMM',
  },
  nl: {
    SHORT: 'DD-MMMM-YYYY',
    FULL: 'DD-MMMM-YYYY',
    DATE_MONTH: 'MMM D',
  },
  pt: {
    SHORT: 'DD MMM YYYY',
    FULL: 'DD MMMM YYYY',
    DATE_MONTH: 'MMM D',
  },
  fr: {
    SHORT: 'DD/MMM/YY',
    FULL: 'DD/MMMM/YYYY',
    DATE_MONTH: 'MMM D',
  },
  it: {
    SHORT: 'DD MMM YYYY',
    FULL: 'DD MMMM YYYY',
    DATE_MONTH: 'MMM D',
  },
  tw: {
    SHORT: 'DD-MMMM-YYYY',
    FULL: 'DD-MMMM-YYYY',
    DATE_MONTH: 'MMM D',
  },
  cn: {
    SHORT: 'DD-MMM-YY',
    FULL: 'DD-MMMM-YYYY',
    DATE_MONTH: 'MMM Do',
  },
  ko: {
    SHORT: 'YY-MM-DD',
    FULL: 'YYYY-MM-DD',
    DATE_MONTH: 'MM-DD',
  },
  id: {
    SHORT: 'DD/MM/YYYY',
    FULL: 'DD-MMMM-YYYY',
    DATE_MONTH: 'DD MMM',
  },
  pl: {
    SHORT: 'DD.MM.YYYY',
    FULL: 'DD-MMMM-YYYY',
    DATE_MONTH: 'DD MM',
  },
  ja: {
    SHORT: 'DD-MMM-YY',
    FULL: 'DD-MMMM-YYYY',
    DATE_MONTH: 'MMM D',
  },
  ar: {
    SHORT: 'DD-MMM-YY',
    FULL: 'DD-MMMM-YYYY',
    DATE_MONTH: 'MMM D',
  },
};

export const SHORT_CODE_TYPES = {
  FUNCTION: 'FUNCTION',
  COMPONENT: 'COMPONENT',
};

export const NOS_OF_HIGHLIGHTS_TO_SHOW = 4;

export const YES_STRING = 'YES';

export const SAFETY_MEASURE_REDIRECT_PAGE_LINK =
  'https://www.london-theater-tickets.com/reopening-london-theatres-safety-measures/';

export const FAVICON_LONDON_THEATRE_TICKETS =
  'https://images.prismic.io/mystique/43d0bf7f-2955-413b-a266-8fc62dd9c933_shows-favicon.png?auto=compress,format';

export const AUDIOGUIDE_TAG_REGEX = /AUDIO_GUIDE_[0-9]+/g;

export const REOPENING_CATEGORIES: number[] = [3159];

export const NEW_ARRIVALS_CATEGORIES: number[] = [1351];

export const ANALYTICS_PROPERTIES = {
  DURATION: 'Duration',
  COMPONENT_NAME: 'Component Name',
  PLATFORM_NAME: 'Platform Name',
  LANGUAGE: 'Language',
  TGIDS: 'Tour Group IDs',
  TGID: 'Tour Group ID',
  VID: 'Variant ID',
  VARIANT_ID: 'Variant ID',
  PAGE_TYPE: 'Page Type',
  COLLECTION_ID: 'Collection ID',
  HEADER: 'Header',
  OPTION_TEXT: 'Option Text',
  OPTION_NAME: 'Option Name',
  POSITION: 'Position',
  INFO_HEADING: 'Information Heading',
  HEADING: 'Heading',
  ACTION: 'Action',
  PAGE_TITLE: 'Page Title',
  HSID: 'h-sid',
  CARD_TYPE: 'Card Type',
  IS_TRUNCATED: 'Is Truncated Text',
  PAGE_HEADING: 'Page Heading',
  SECTION: 'Section',
  MB_NAME: 'MB Name',
  RANKING: 'Ranking',
  CLICK_COUNT: 'Click Count',
  REVIEW_RANK: 'Review Rank',
  COLLECTION_NAME: 'Collection Name',
  SORT_BY: 'Sort By',
  EXPERIENCE_NAME: 'Experience Name',
  CATEGORY_ID: 'Category ID',
  CATEGORY_NAME: 'Category Name',
  SUB_CAT_ID: 'Sub-Category ID',
  SUB_CAT_NAME: 'Sub-Category Name',
  CATEGORY: 'Category',
  CITY: 'City',
  COUNTRY: 'Country',
  VARIANT: 'Experiment Variant',
  EXPERIMENT_NAME: 'Experiment Name',
  EXPERIMENT_VARIANT: 'Experiment Variant',
  DISCOUNT: 'Discount',
  DISPLAY_PRICE: 'Display Price',
  DISPLAY_CURRENCY: 'Display Currency',
  UGC: {
    CONTENT_TYPE: 'Content Type',
    USERNAME: 'Username',
  },
  EXPERIENCE_DATE: 'Experience Date',
  PAGINATION_TYPE: 'Pagination Type',
  SEARCH_QUERY: 'Search Query',
  DIRECTION: 'Direction',
  NEXT_ITEMS_COUNT: 'Next Items Count',
  OPTION_TYPE: 'Option Type',
  LOAD_TIME: 'Load Time',
  PINNED_CARD_PRESENT: 'Is Pinned Card Present',
  IS_PINNED_CARD: 'Is Pinned Card',
  AVERAGE_RATING: 'Average Rating',
  NUMBER_OF_RATINGS: 'Number Of Ratings',
  IS_DISCOUNT_PRESENT: 'Is Discount Present',
  IS_OPENING_DATE_SHOWN: 'Is Opening Date Shown',
  DIV_TYPE: 'Div Type',
  CURRENCY: 'Currency',
  TRIGGERED_BY: 'Triggered By',
  DISCOUNT_SHOWN: 'Discount Shown',
  CASHBACK_SHOWN: 'Is Cashback Shown',
  L1_BOOSTER_SHOWN: 'L1 Booster Shown',
  TYPE: 'Type',
  AUTOPLAY_LOAD_TIME: 'Autoplay Load Time',
  LEVEL: 'Level',
  TIME_WATCHED: 'Time Watched',
  THEATRE_NAME: 'Theatre Name',
  THEATRE_ADDRESS: 'Theatre Address',
  TOOLTIP_TYPE: 'Tooltip Type',
  CARD_SIZE: 'Card Size',
  CTA_TYPE: 'CTA Type',
  DATE_RANGE_SELECTED: 'Date Range Selected',
  EXPERIENCES_AVAILABLE: 'Experiences Available',
  SHOULDER_PAGE_TYPE: 'Shoulder Page Type',
  MB_TYPE: 'MB Type',
  VIDEO_TITLE: 'Video Title',
  PERCENT_VIEWED: 'Percentage Viewed',
};

export const PAGE_TYPES = {
  COLLECTION: 'Collection',
  CONTENT_PAGE: 'Content Page',
  SHOW_PAGE: 'Show Page',
  VENUE_PAGE: 'Venue Page',
};

export const ANALYTICS_PLATFORM = {
  MOBILE: 'Mobile',
  DESKTOP: 'Desktop',
};

const ESCAPE_ENTITIES = Object.freeze({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
});

export const ESCAPE_REGEX = new RegExp(
  `[${Object.keys(ESCAPE_ENTITIES).join('')}]`,
  'g'
);

export const ESCAPE_REPLACER = (t: string): string =>
  ESCAPE_ENTITIES[t as keyof typeof ESCAPE_ENTITIES];

export const UNIT_ABBREVIATIONS = ['k', 'm', 'b', 't'];

export const PROMO_CODES = {
  DEFAULT: {
    promo_code: 'HEADOUT5',
    discount_percentage: 5,
    absolute_discount: null,
    capped_value: null,
  },
  DEFAULT_2: {
    promo_code: 'SUMMER22',
    discount_percentage: 10,
    absolute_discount: null,
    capped_value: null,
  },
};
export const QUERY_PARAMS = {
  CATEGORY: 'category',
  LIMIT: 'limit',
  OFFSET: 'offset',
};

export const LOCALE_ORDER = [
  LANGUAGE_MAP.en.code,
  LANGUAGE_MAP.es.code,
  LANGUAGE_MAP.fr.code,
  LANGUAGE_MAP.it.code,
  LANGUAGE_MAP.de.code,
  LANGUAGE_MAP.pt.code,
  LANGUAGE_MAP.nl.code,
];

export const FB_DOMAIN_VERIFICATION = 'vrvsgm9rczh57d7fnspfeve29fa6ae';

export const PAGETYPE_BY_CUSTOMTYPE = {
  [CUSTOM_TYPES.CONTENT_PAGE]: PAGE_TYPES.CONTENT_PAGE,
  [CUSTOM_TYPES.SHOW_PAGE]: PAGE_TYPES.SHOW_PAGE,
  [CUSTOM_TYPES.MICROSITE]: PAGE_TYPES.COLLECTION,
  [CUSTOM_TYPES.GLOBAL_CITY]: PAGE_TYPES.COLLECTION,
  [CUSTOM_TYPES.GLOBAL_COLLECTION]: PAGE_TYPES.COLLECTION,
  [CUSTOM_TYPES.GLOBAL_COUNTRY]: PAGE_TYPES.COLLECTION,
  [CUSTOM_TYPES.GLOBAL_EXPERIENCE]: PAGE_TYPES.COLLECTION,
  [CUSTOM_TYPES.GLOBAL_HOMEPAGE]: PAGE_TYPES.COLLECTION,
  [CUSTOM_TYPES.LISTICLE]: PAGE_TYPES.COLLECTION,
  [CUSTOM_TYPES.VENUE_PAGE]: PAGE_TYPES.VENUE_PAGE,
};

export const CTA_TYPE = {
  BUTTON: 'Button CTA',
  TEXT: 'Text CTA',
  SHOW_MORE: 'Show More Button',
  VIEW_ALL_DATES: 'View all dates',
};

export const HIGHLIGHT_TYPES = {
  H6_HEADING: 'heading6',
  LIST_ITEM: 'list-item',
};

export const VALIDITY_TYPES = {
  UNTIL_DATE: 'UNTIL_DATE',
  UNTIL_DAYS_FROM_PURCHASE: 'UNTIL_DAYS_FROM_PURCHASE',
  EXTENDABLE_BUT_UNKNOWN: 'EXTENDABLE_BUT_UNKNOWN',
  NOT_EXTENDABLE: 'NOT_EXTENDABLE',
};

export const CANCELLATION_POLICY_POSSIBLE_LABELS = [
  'Cancelation Policy',
  'Cancellation Poilcy',
  'Cancellatoin Policy',
  'Política de cancelación',
  'Politique d’annulation',
  'Politique d’anulation',
  'Stornierungsfrist',
  'Stornierungsbedingungen',
  'Annuleringsvoorwaarden',
  'Polizza di cancellazione',
  'Política de cancelamento',
  'Política de cancelamenyo',
  'politica di cancellazione',
  'cancellazione',
];

export const RTL_LANGUAGE_CODES = [LANGUAGE_MAP.ar.code];

export const LIVE_CHAT = {
  DELAY: 3000,
  LICENCE_KEY: '8339531',
  SALES_TRACKER_ID: 'xKAt5wZBBFuxqR7H2oMHEdeZksNqY2VL',
};

export const SLICE_TYPES = {
  LISTICLE_SECTION: 'listicle_section',
  LISTICLE: 'listicle',
  LISTICLE_V2: 'listicle_v2',
  LISTICLE_SECTION_V2_START: 'listicle_section_v2',
  SHOULDER_PAGE_TICKET_CARD: 'ticket_card_shoulder_page',
  BREADCRUMBS: 'breadcrumbs',
  TOUR_LIST_CATEGORY_V1: 'tour_list_category_v1',
  TOUR_LIST_CATEGORY: 'tour_list_category',
  CONTENT_TYPE_TAG: 'content_type_tag',
  BANNER: 'banner',
  RICH_TEXT: 'rich_text',
  RICH_TEXT_ONLY: 'rich_text_only',
  INTERNAL_CONTENT_CARD: 'internal_content_card',
  FEATURE_BOX: 'feature_box',
  CARD_CAROUSEL: 'card_carousel',
  TRUST_BOOSTERS: 'trust_boosters',
  MICROBRAND_CARDS: 'microbrand_cards',
  IMAGE_LINKS_CAROUSEL: 'image_links_carousel',
  TAB_WRAPPER: 'tab_wrapper',
  TAB_WRAPPER_START: 'tab_wrapper___start',
  TAB: 'tab',
  QUESTION: 'question',
  CARD_SECTION: 'card_section',
  CARD_SECTION_START: 'card_section___start',
  CARD: 'card',
  IMAGE_GALLERY: 'image_gallery',
  BACKGROUND: 'background',
  UGC_CAROUSEL: 'ugc_carousel',
  REVIEWS: 'reviews',
  CAROUSEL_GALLERY: 'carousel_gallery',
  AUTOMATED_COMPARISION_TABLE: 'automated_comparison_table',
  CUSTOM_LINKED_TOURS: 'custom_linked_tours',
  SHOWS_LIST: 'shows_list',
  SHOWS_GRID: 'shows_grid',
  GOOGLE_MAP: 'google_map_iframe',
  VERTICAL_CARD_GRIDS: 'vertical_cards_grid',
  TABBED_INFO: 'tabbedinfo',
  IMAGE_TEXT_COMBO_GRID: 'image_text_combo_grid',
  TABLE: 'table',
  TABLE_V2_START: 'table_v2___start',
  TICKET_CARDS: 'ticket_cards',
  FULL_WIDTH_ACTION_CARD: 'full_width_action_card',
  ACCORDION: 'accordion',
  LISTICLE_SECTION_START: 'listicle_section___start',
  TABLE_V3: 'table_v3',
};

export const CASHBACK_TYPES = {
  PERCENTAGE: 'PERCENTAGE',
  ABSOLUTE: 'ABSOLUTE',
};

export const ENTERTAINMENT_MB_BREADCRUMBS = {
  LTT: {
    ROOT_DOMAIN: 'www.london-theater-tickets.com',
    MUSICALS: 'www.london-theater-tickets.com.london-musicals',
    PLAYS: 'www.london-theater-tickets.com.west-end-plays-in-london',
    OPERA: 'www.london-theater-tickets.com.london-operas',
  },
  BROADWAY: {
    ROOT_DOMAIN: 'www.broadway-show-tickets.com',
    MUSICALS: 'www.broadway-show-tickets.com.broadway-musicals-in-new-york',
    PLAYS: 'www.broadway-show-tickets.broadway-plays-in-new-york',
    // No shoulder page for Opera adding broadway homepage as fallback
    OPERA: 'www.broadway-show-tickets',
  },
};

export const CUSTOM_HEADER = {
  ORIGIN: 'h-origin',
};

export const PAGE_URL_STRUCTURE = {
  ROOT_DOMAIN: 'Root Domain',
  SUBDOMAIN: 'Subdomain',
  SUBFOLDER: 'Subfolder',
  SUBDOMAIN_SUBFOLDER: 'Subfolder on Subdomain',
};

export const SEO_SUBDOMAINS = [
  'https://harry-potter.london-studio-tours.com/',
  'https://catacombs.tickets-paris.fr/',
  'https://uffizi.tickets-florence.it/',
  'https://sagradafamilia.barcelona-tickets.com/',
];

export const SEO_SUBDOMAINS_UID = [
  'harry-potter.london-studio-tours.com',
  'catacombs.tickets-paris.fr',
  'uffizi.tickets-florence.it',
  'sagradafamilia.barcelona-tickets.com',
];

export const DOCUMENT_READY_STATES = {
  LOADING: 'loading',
  INTERACTIVE: 'interactive',
  COMPLETE: 'complete',
};

export const MEDIA_CAROUSEL_IMAGE_LIMIT = 10;

export const DEFAULT_LOOKER_VALUES = {
  FOOTER_DISCLAIMER: 'Default footer disclaimer',
  BANNER_SUBTEXT: {
    PARTNERED: 'Default partnered banner subtext',
    NON_PARTNERED: 'Default non-partnered banner subtext',
  },
  SHOWPAGE_TITLE: 'Showname - Tickets',
};

export const VIDEO_POSITIONS = {
  BANNER: 'Banner',
  PRODUCT_CARD: 'Product Card',
};

export const MB_TYPES = {
  A1_COLLECTION: 'A1 - Collection MB',
  A1_CITY_GUIDE: 'A1 - City Guide',
  A1_HOMEPAGE: 'A1 - Home Page',
  A1_SUB_CATEGORY: 'A1 - Sub Category MB',
  A1_CATEGORY: 'A1 - Category MB',
  B1_GLOBAL: 'B1 - Global MB',
  B1_GLOBAL_HOMEPAGE: 'B1 - Global Home Page',
  C1_COLLECTION: 'C1 - Collection MB',
  A2_SUB_CATEGORY: 'A2 - Sub Category MB',
  A2_CATEGORY: 'A2 - Category MB',
};

export const MB_CATEGORISATION = {
  MB_TYPE: {
    A1_COLLECTION: 'A1 - Collection MB',
    A1_CITY_GUIDE: 'A1 - City Guide',
    A1_HOMEPAGE: 'A1 - Home Page',
    A1_SUB_CATEGORY: 'A1 - Sub Category MB',
    A1_CATEGORY: 'A1 - Category MB',
    A2_SUB_CATEGORY: 'A2 - Sub Category MB',
    A2_CATEGORY: 'A2 - Category MB',
    B1_GLOBAL: 'B1 - Global MB',
    B1_GLOBAL_HOMEPAGE: 'B1 - Global Home Page',
    C1_COLLECTION: 'C1 - Collection MB',
  },
  PAGE_TYPE: {
    LANDING_PAGE: 'Landing Page',
    SHOULDER_PAGE: 'Shoulder Page',
  },
  CATEGORY: {
    TICKETS: 'Tickets',
    TOURS: 'Tours',
    TRANSPORTATION: 'Transportation',
    TRAVEL_SERVICES: 'Travel Services',
    CRUISES: 'Cruises',
    FOOD_DRINK: 'Food & Drink',
    DAY_TRIPS: 'Day Trips',
    ENTERTAINMENT: 'Entertainment',
    ADVENTURE: 'Adventure',
    AERIAL_SIGHTSEEING: 'Aerial Sightseeing',
    WATER_SPORTS: 'Water Sports',
    NATURE_WILDLIFE: 'Nature & Wildlife',
    WELLNESS: 'Wellness',
    CLASSES: 'Classes',
    SPECIALS: 'Specials',
    RV_RENTALS: 'RV Rentals',
    STAYCATIONS: 'Staycations',
    SPORTS: 'Sports',
  },
};
export const PARTNERED_AND_SENSITIVE_COMBINATIONS = {
  PARTNERED_AND_SENSITIVE: 'Partnered and Sensitive',
  PARTNERED_AND_NON_SENSITIVE: 'Partnered and Non-Sensitive',
  NON_PARTNERED_AND_SENSITIVE: 'Non-Partnered and Sensitive',
  NON_PARTNERED_AND_NON_SENSITIVE: 'Non-Partnered and Non-Sensitive',
};

export const SHOW_DATE_SELECTION_PAGE_TGIDS = [17637];

export const DEFAULT_PRISMIC_SHOWPAGE_UID =
  'www.london-theater-tickets.com.the-lion-king-tickets';

export const DEFAULT_SHOWPAGE_HOSTNAME = 'www.london-theater-tickets.com';

export const DOMAIN_INITIALS = 'www.';

export const SENTRY_TAGS = {
  EXCEPTION_TYPE: 'EXCEPTION_TYPE',
  PAGE_TYPE: 'PAGE_TYPE',
};

export const F1_SPORTS_EXPERIMENT_TGIDS = [
  '19708',
  '20016',
  '20017',
  '21013',
  '20159',
  '19873',
  '20021',
  '20026',
  '6735',
  '20015',
  '21816',
  '20018',
  '20158',
  '20160',
  '20161',
  '21071',
  '21078',
  '21079',
  '21090',
  '19877',
  '21074',
  '20949',
];

export const EXPERIENCES = {
  COLLECTION: 'Collection',
  CATEGORY: 'Category',
  SUBCATEGORY: 'SubCategory',
};

export const LISTICLE_TYPE = {
  SMALL: 'small',
  LARGE: 'large',
  MEDIUM: 'medium',
};

export const SETTINGS_TYPE = {
  SETTINGS_ONE: 'SettingsOne',
  SETTINGS_TWO: 'SettingsTwo',
  SETTINGS_THREE: 'SettingsThree',
};

export const PRISMIC_FIELD_ID = {
  TAGGED_COLLECTION: 'tagged_collection',
  TAGGED_CATEGORY: 'tagged_category',
  TAGGED_SUB_CATEGORY: 'tagged_sub_category',
  TAGGED_CITY: 'tagged_city',
  TAGGED_COUNTRY: 'tagged_country',
  TAGGED_MB_TYPE: 'tagged_mb_type',
  TAGGED_PAGE_TYPE: 'tagged_page_type',
  SHOULDER_PAGE_TYPE: 'shoulder_page_type',
  TAGGED_CONTENT_TYPE: 'tagged_content_type',
  PRIMARY_TAG: 'primary_tag',
};

export const DYNAMIC_RENDER_UID = [
  'www.london-theater-tickets.com.london-musicals',
];

export const PRISMIC_DEV_TAG = '[DEV]';

export const SORT_SELECTOR_FILTERS = {
  POPULARITY: 'popularity',
  PRICE: 'price',
};

export const FLAGS_FOLDER_URL =
  'https://cdn-imgix-open.headout.com/home/country-flags/4x3/';

export const BY_HO_BRAND_SCREEN_ENABLE = [
  'book.hochiminh-city.com',
  'book.cruises-halongbay.com',
];

export const TABLE_V3_COLUMN_TYPE = {
  TEXT_ONLY: 'Text Only',
  IMAGE_TEXT: 'Image Text',
  BOOSTER_TEXT: 'Booster Text',
  SCRATCH_PRICE: 'Scratch Price',
  IMAGE_TEXT_SUBTEXT: 'Image Text SubText',
  NUMERIC_TEXT: 'Numeric Text',
  NUMERIC_IMAGE_TEXT: 'Numeric Image Text',
  LINK_ICON: 'Link Icon',
  NUMERIC_SUB_NUMERIC: 'Numeric SubNumeric',
};

export const TABLE_V3_TEXT_TYPE = {
  TEXT: 'text',
  TEXT_BOLD: 'textBold',
  SUB_TEXT: 'subtext',
};

export const BOOSTER_BACKGROUND_COLOR_CODE_MAPPING = {
  green: '#dbfddb',
  candy: '#FFF2F8',
  red: '#FFD8D8',
  mustard: '#FFE7CE',
  purple: '#F8F6FF',
  'peach orange': '#FFF8EF',
};

export const BACKGROUND_COLOR_MAPPING = {
  '#dbfddb': '#088943',
  '#FFF2F8': '#E5006E',
  '#FFD8D8': '#D60404',
  '#FFE7CE': '#A46E00',
  '#F8F6FF': '#6600CC',
  '#FFF8EF': '#A4563B',
};

export const TABLE_V3_SVG_ICONS = {
  PLUS: 'plus',
  EXTERNAL_LINK: 'external link',
} as const;

export const TABLE_V3_SVG_MAPPING: Record<any, JSX.Element> = {
  plus: PLUS(),
  'external link': EXTERNAL_LINK(),
  musicals: MUSICALS(),
  plays: PLAYS(),
  opera: OPERA(),
  sports: SPORTS(),
  cabarets: CABARETS(),
  'helicopter tours': HELICOPTER_TOURS(),
  'hot air balloon': HOT_AIR_BALLOONS(),
  'airplane tours': AIRPLANE_TOURS(),
  'theme parks': THEME_PARKS(),
  'zoos and aquarium': ZOO_AND_AQUARIUM(),
  parks: PARKS(),
  'water parks': WATER_PARKS(),
  'religious sites': RELIGIOUS_SITES(),
  landmarks: LANDMARKS(),
  'city passes': CITY_PASSES(),
  'observation decks': OBSERVATION_DECKS(),
  'train passes': TRAIN_PASSES(),
  'walking tours': WALKING_TOURS(),
  'guided tours': GUIDED_TOURS(),
  'hop on hop off tours': HOP_ON_HOP_OFF_TOURS(),
  'private tours': PRIVATE_TOURS(),
  'bikes and segway': BIKES_AND_SEGWAY(),
  shopping: SHOPPING(),
  'multi day tours': MULTI_DAY_TOURS(),
  'photography tours': PHOTOGRAPHY_TOURS(),
  'cruise tickets': CRUISE_TICKETS(),
  snorkeling: SNORKELING(),
  surfing: SURFING(),
  'yacht tours': YACHT_TOURS(),
  racing: RACING(),
  sandboarding: SANDBOARDING(),
  'class c rvs': CLASS_C_RV(),
  'cable car': CABLE_CAR(),
  'food and drink': FOOD_AND_DRINK(),
  'dining experiences': DINING_AND_EXPERIENCES(),
  'food tours': FOOD_TOURS(),
  'cooking classes': COOKING_CLASSES(),
  wineries: WINERIES(),
  'coffee and tea': COFFEE_AND_TEA(),
  'pub crawls': PUB_CRAWLS(),
  'food passes': FOOD_PASSES(),
  city: CITY(),
  beaches: BEACHES(),
  'national parks': NATIONAL_PARKS(),
  combos: COMBOS(),
  'coming soon': COMING_SOON(),
  transportation: TRANSPORTATION(),
  'airport transfers': AIRPORT_TRANSFERS(),
  quadbking: QUADBKING(),
  'wifi and sim cards': WIFI_AND_SIM_CARDS(),
  'travel insurance': TRAVEL_INSURANCE(),
  'photography classes': PHOTOGRAPHY_CLASSES(),
  'dance classes': DANCE_CLASSES(),
  camping: CAMPING(),
  cruises: CRUISES(),
  'evening cruises': EVENING_CRUISES(),
};
export const TOUR_RANKING_EXPERIMENT: Record<string, number> = {
  'www.acropolis-tickets.com': 15140,
  'www.barcelona-tickets.com.park-guell': 6705,
  'www.pradomuseumtickets.com': 4082,
  'www.versailles-palace-tickets.com': 6173,
  'www.jeronimosmonasterytickets.com': 20936,
  'www.royal-palace-madrid-tickets.com': 10410,
  'www.london-tickets.co.uk.tower-of-london': 15090,
  'www.tickets-milan.com.duomo-milan': 11291,
  'www.quintadaregaleiratickets.com': 19130,
  'uffizi.tickets-florence.it': 7713,
  'www.castel-sant-angelo-ticket.com': 19557,
  'www.tickets-rome.com.borghese-gallery': 9070,
  'www.tickets-paris.fr.musee-dorsay': 16365,
  'www.alcazar-seville-tickets.com': 10643,
  'www.basilicacisterntickets.com': 13477,
  'www.belemtowertickets.com': 20935,
  'www.tickets-paris.fr.louvre-museum': 9082,
  'www.casamila-tickets.com': 7679,
  'cathedral.seville-tickets.com': 10109,
  'www.doge-palace-tickets.com': 9769,
  'www.praguecastletickets.com': 15284,
  'www.leaningtowerofpisa-tickets.com': 21985,
  'www.topkapipalace-tickets.com': 13472,
  'duomo.sienatickets.com': 15367,
  'harry-potter.london-studio-tours.com': 9578,
  'www.pompeii-tickets.com.herculaneum-tickets': 14304,
  'www.mezquitadescordoba.com': 10651,
  'sagradafamilia.barcelona-tickets.com': 10117,
  'www.london-tickets.co.uk.buckingham-palace': 12286,
  'www.barcelona-tickets.com.camp-nou-tour': 23490,
  'www.tickets-amsterdam.com.rijksmuseum': 12180,
  'www.ticket-madrid.com.reina-sofia-museum-tickets': 15563,
  'www.dolmabahcepalace-tickets.com': 13478,
  'www.alhambra-granada-tickets.com': 10048,
  'www.palazzo-vecchio-tickets.com': 13265,
  'www.london-tickets.co.uk.windsor-castle-tickets': 2926,
  'www.boboligardenstickets.com': 11701,
  'www.london-tickets.co.uk.westminster-abbey': 21379,
  'www.palazzopittitickets.com': 11703,
  'www.stonehenge-london-tours.com': 2817,
  'museo-archeologico.tickets-naples.com': 16964,
  'pantheon.tickets-rome.com': 14412,
  'catacombs.tickets-paris.fr': 9113,
  'palaciodeliria.ticket-madrid.com': 19543,
  'wanda-metropolitano.ticket-madrid.com': 3540,
  'schloss-schoenbrunn.wien-tickets.com': 18223,
};
export const BUTTON_LOADING_DURATION = 45000;
