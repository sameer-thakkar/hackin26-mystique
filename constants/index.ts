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
import { strings } from './strings';

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
  IS_LAZY: 'is-lazy',
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

export const SUPPORTED_LOCALE_MAP = {
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
} as const;

export type TLANGUAGELOCALE = typeof SUPPORTED_LOCALE_MAP[LanguagesUnion];

type TLanguageMap = {
  displayName: string;
  locale: string;
  code: string;
  translatedName?: string;
};

export const LANGUAGE_MAP: Record<LanguagesUnion, TLanguageMap> = {
  en: {
    displayName: 'English',
    locale: 'en-us',
    code: 'en',
    translatedName: 'English',
  },
  it: {
    displayName: 'Italiano',
    locale: 'it-it',
    code: 'it',
    translatedName: 'Italian',
  },
  es: {
    displayName: 'Español',
    locale: 'es-es',
    code: 'es',
    translatedName: 'Spanish',
  },
  fr: {
    displayName: 'Français',
    locale: 'fr-fr',
    code: 'fr',
    translatedName: 'French',
  },
  de: {
    displayName: 'Deutsch',
    locale: 'de-de',
    code: 'de',
    translatedName: 'German',
  },
  nl: {
    displayName: 'Nederlands',
    locale: 'nl-nl',
    code: 'nl',
    translatedName: 'Dutch',
  },
  pt: {
    displayName: 'Português',
    locale: 'pt-pt',
    code: 'pt',
    translatedName: 'Portuguese',
  },
  cn: {
    displayName: '简体中文',
    locale: 'zh-cn',
    code: 'zh-hans',
    translatedName: 'Chinese (Simplified)',
  },
  tw: {
    displayName: '繁體中文 ',
    locale: 'zh-tw',
    code: 'zh-hant',
    translatedName: 'Chinese (Traditional)',
  },
  ja: {
    displayName: '日本語',
    locale: 'ja-jp',
    code: 'ja',
    translatedName: 'Japanese',
  },
  ko: {
    displayName: 'Korean',
    locale: 'ko-kr',
    code: 'ko',
    translatedName: 'Korean',
  },
  id: {
    displayName: 'Indonesian',
    locale: 'id-id',
    code: 'id',
    translatedName: 'Indonesian',
  },
  pl: {
    displayName: 'Polish',
    locale: 'pl-pl',
    code: 'pl',
    translatedName: 'Polish',
  },
  ar: {
    displayName: 'Arabic',
    locale: 'ar-ae',
    code: 'ar',
    translatedName: 'Arabic',
  },
};

export type IPopularLanguage =
  | 'en'
  | 'es'
  | 'it'
  | 'nl'
  | 'de'
  | 'fr'
  | 'pt'
  | 'pl';

export const LANGUAGE_CODE_MAP = {
  EN: 'en',
  ES: 'es',
  IT: 'it',
  FR: 'fr',
  NL: 'nl',
  PT: 'pt',
  DE: 'de',
  PL: 'pl',
};

export const LANGUAGE_MAP_TRANSLATE_CONSTANT = () => {
  return {
    [LANGUAGE_CODE_MAP.EN]: strings.LANGUAGES.ENGLISH,
    [LANGUAGE_CODE_MAP.IT]: strings.LANGUAGES.ITALIAN,
    [LANGUAGE_CODE_MAP.ES]: strings.LANGUAGES.SPANISH,
    [LANGUAGE_CODE_MAP.FR]: strings.LANGUAGES.FRENCH,
    [LANGUAGE_CODE_MAP.DE]: strings.LANGUAGES.GERMAN,
    [LANGUAGE_CODE_MAP.NL]: strings.LANGUAGES.NEDERLANDS,
    [LANGUAGE_CODE_MAP.PT]: strings.LANGUAGES.PORTUGUESE,
    [LANGUAGE_CODE_MAP.PL]: strings.LANGUAGES.POLISH,
  };
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
  NEWS_PAGE: 'news_page',
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
  HOHO_ROUTES: 'hoho_routes',
  TOP_ATTRACTIONS: 'top_attractions',
};

export const TEMPLATES = {
  HOHO: 'HOHO',
  AIRPORT_TRANSFERS: 'Airport Transfers',
};

export type CUSTOM_TYPE_KEYS = keyof typeof CUSTOM_TYPES;
export type CUSTOM_TYPE_VALUES = typeof CUSTOM_TYPES[CUSTOM_TYPE_KEYS];

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
  EXP_COMPONENT_CLICKED: 'Experiment Component Clicked',
  EXPERIENCE_DETAILS_VIEWED: 'Experience Details Viewed',
  EXPERIENCE_CARD_CLICKED: 'Experience Card Clicked',
  EXPERIENCE_MORE_DETAILS_VIEWED: 'More Details Viewed',
  EXPERIENCE_INFO_TAB_CLICKED: 'Experience Information Tab Clicked',
  MICROSITE_PAGE_VIEWED: 'Microsite Page Viewed',
  MICROSITE_PAGE_SECTION_VIEWED: 'Microsite Page Section Viewed',
  MICROSITE_PAGE_TAB_CLICKED: 'Microsite Page Tab Clicked',
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
  MORE_DETAILS_SECTION_VIEWED: 'More Details Section Viewed',
  CITY_CARD_CLICKED: 'City Card Clicked',
  COLLECTION_CARD_CLICKED: 'Collection Card Clicked',
  SUBCAT_CARD_CLICKED: 'Sub-Category Card Clicked',
  SEE_ALL_CLICKED: 'See All Clicked',
  PAGE_SECTION_VIEWED: 'Page Section Viewed',
  BREADCRUMBS_CLICKED: 'Navigation Breadcrumbs Clicked',
  CAT_SUBCAT_PAGE: {
    COLLECTION_CARD_CTA_CLICKED: 'Collection Card CTA Clicked',
    CATEGORY_CARD_CLICKED: 'Category Card Clicked',
    SUBCATEGORY_PILL_CLICKED: 'Sub-Category Pill Clicked',
    COLLECTIONS_SORTED: 'Collections Sorted',
    SORT_BY_CLICKED: 'Sort By Clicked',
  },
  NEWS_PAGE: {
    RATINGS_WIDGET_CLICKED: 'Ratings Widget Clicked',
    NEWS_CARD_CLICKED: 'News Card Clicked',
    NEWS_PAGE_SECTION_VIEWED: 'News Page Section Viewed',
    NEWS_PAGE_CTA_CLICKED: 'News Page CTA Clicked',
    TRAILER_VIEWED: 'Trailer Viewed',
  },
  FREE_CANCELLATION_TOOLTIP_VIEWED: 'Free Cancellation Tooltip Viewed',
  REVIEWS_SECTION_VIEWED: 'Reviews Section Viewed',
  HOHO: {
    ROUTE_DETAILS_VIEWED: 'Route Details Viewed',
    MORE_DETAILS_VIEWED: 'More Details Viewed',
    CALENDAR_CLOSED: 'Calendar Closed',
    CALENDAR_DATE_SELECTED: 'Calendar Date Selected',
  },
};

export const PAGE_TYPE = {
  COLLECTION_PAGE: 'Collection Page',
};

export const PRODUCT_CARD_REVAMP = {
  PLACEMENT: {
    SIDE_SHEET: 'Side Sheet',
    PRODUCT_CARD: 'Product Card',
  },
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
  FREE_CANCELLATION: 'FREE_CANCELLATION',
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
  HEADOUT: '//cdn-imgix.headout.com/cities/fallback/fallback-city-image.png',
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
  PRODUCT_CARD_EXP: 'product-card-exp',
  TOUR_GROUP_INFO: 'tour-group-info',
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
  VARIANT_NAME: 'Variant Name',
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
  CARD_NAME: 'Card Name',
  CITY_NAME: 'City Name',
  MB_TYPE: 'MB Type',
  VIDEO_TITLE: 'Video Title',
  PERCENT_VIEWED: 'Percentage Viewed',
  LABEL: 'Label',
  SORTING_ORDER: 'Sorting Order',
  IS_SHOW_PLAYING: 'Is Show Playing',
  TITLE: 'Title',
  SELECTED_DATE: 'Selected Date',
  PERCENTAGE_VIEWED: 'Pecentage Viewed',
  IS_DATE_FILTER: 'Is Date Filter',
  PLACEMENT: 'Placement',
};

export const PAGE_TYPES = {
  COLLECTION: 'Collection',
  CONTENT_PAGE: 'Content Page',
  SHOW_PAGE: 'Show Page',
  VENUE_PAGE: 'Venue Page',
  CITY_PAGE: 'City Page',
  CATEGORY_PAGE: 'Category Page',
  SUB_CATEGORY_PAGE: 'Sub-Category Page',
  NEWS_PAGE: 'News Page',
  HOHO: 'Hop-On Hop-Off',
  AIRPORT_TRANSFERS: 'Airport Transfers',
};

export const SHOULDER_PAGE_TYPES = {
  DIRECTIONS: 'Directions',
  PLAN_YOUR_VISIT: 'Plan your visit',
};

export const BOOLEAN_STATES = {
  YES: 'Yes',
  NO: 'No',
} as const;

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
  PAGE: 'page',
};

export const LOCALE_ORDER = [
  LANGUAGE_MAP.en.code,
  LANGUAGE_MAP.es.code,
  LANGUAGE_MAP.fr.code,
  LANGUAGE_MAP.it.code,
  LANGUAGE_MAP.de.code,
  LANGUAGE_MAP.pt.code,
  LANGUAGE_MAP.nl.code,
  LANGUAGE_MAP.cn.code,
  LANGUAGE_MAP.tw.code,
  LANGUAGE_MAP.ko.code,
  LANGUAGE_MAP.ja.code,
  LANGUAGE_MAP.id.code,
  LANGUAGE_MAP.pl.code,
  LANGUAGE_MAP.ar.code,
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
  [CUSTOM_TYPES.NEWS_PAGE]: PAGE_TYPES.NEWS_PAGE,
};

export const CTA_TYPE = {
  BUTTON: 'Button CTA',
  TEXT: 'Text CTA',
  SHOW_MORE: 'Show More Button',
  VIEW_ALL_DATES: 'View all dates',
  SEE_ALL_DAY_TRIPS: 'See all Day Trips',
  VIEW_TRAVEL_GUIDE: 'View Travel Guide',
  SIGN_UP: 'Sign Up',
  SEE_ALL: 'See All',
  LANDING_PAGE: 'Landing Page',
  ALL_NEWS: 'All News',
  ALL_TRAILERS: 'All Trailers',
  REVIEWS_CTA: 'Reviews CTA',
  BUY_TICKETS: 'Buy Tickets',
  THEATRE_PAGE_LINK: 'Theatre Page Link',
  SEE_MORE_SHOWS: 'See More Shows',
  SHOW_MORE_ARTICLES: 'Show More Articles',
  VIEW_ROUTES: 'View All Routes',
};

export const HIGHLIGHT_TYPES = {
  H6_HEADING: 'heading6',
  HEADING: 'heading',
  LIST_ITEM: 'list-item',
};
export const OBJECT_TYPES = {
  DETAIL: 'DETAIL',
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
  DELAY: 5000,
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
  STRUCTURED_CARD: 'structured_card',
  // Airport Transfer
  CARS_CAROUSEL: 'cars_carousel',
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
    OPERA: 'www.london-theater-tickets.com.shows-in-london.opera-shows',
  },
  BROADWAY: {
    ROOT_DOMAIN: 'www.broadway-show-tickets.com',
    MUSICALS: 'www.broadway-show-tickets.com.musical',
    PLAYS: 'www.broadway-show-tickets.com.plays',
    // No shoulder page for Opera adding broadway homepage as fallback
    OPERA: 'www.broadway-show-tickets.com',
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
  TRAILERS: 'Trailers Section',
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
  PRIMARY_TAG: {
    TRAVEL_GUIDE: 'Travel Guide',
    THINGS_TO_DO: 'Things to do',
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

export const GLOBAL_MB_ENABLED_DOMAINS = ['themeparkstickets.com'];

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
  TGID: 'tgid',
  TAGS: 'tags',
  UID: 'uid',
};

export const PRISMIC_DEV_TAG = '[DEV]';

export const SORT_SELECTOR_FILTERS = {
  POPULARITY: 'popularity',
  PRICE: 'price',
};

export const BANNER_API_PARAMS = {
  PLATFORM: {
    DESKTOP: 'DESKTOP',
  },
  RESOURCE_TYPE: {
    CITY_BANNER: 'MB_CITY_BANNER',
  },
  ELM_TYPE: {
    VIDEO: 'VIDEO',
  },
};

export const CAROUSEL_DIR = {
  NEXT: 'Forward',
  PREV: 'Backward',
};
export const FLAGS_FOLDER_URL =
  'https://cdn-imgix-open.headout.com/home/country-flags/4x3/';

export const VIENNA_CONCERT_UID = 'www.vienna-concert-tickets.com';

export const BY_HO_BRAND_SCREEN_ENABLE = [
  'book.hochiminh-city.com',
  'book.cruises-halongbay.com',
];

export const EMAIL_SUBCRIPTION = {
  BANNER_URL: {
    CITY_PAGE:
      'https://cdn-imgix-open.headout.com/MB/subscription-box/subcription.png',
    CAT_SUBCAT_PAGE:
      'https://cdn-imgix-open.headout.com/MB/subscription-box/subcription_cat_page.png',
  },
  ENDPOINT: 'https://vivillion.netlify.app/api/webengage',
  CITY_PAGE_EVENT: 'City Page Subscribe',
  NEWS_PAGE_EVENT: 'News Page Subscribe',
  CAT_SUBCAT_PAGE_EVENT: 'Category/Sub Category Page Subscribe',
};

export const RESOURCE_ASSET_TYPE = {
  IMAGE: 'IMAGE',
};

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

export const BUTTON_LOADING_DURATION = 45000;

export const RESOURCE_TYPE = {
  COLLECTION_VIDEO: 'COLLECTION_VIDEO',
  CATEGORY_CITY: 'CATEGORY_CITY',
  SUB_CATEGORY_CITY: 'SUB_CATEGORY_CITY',
};

export const SUBCATEGORY_IDS: Record<string, string> = {
  Combo: '1080',
  'City Cards': '1008',
  'Airport Transfers': '1019',
  'Public Transport': '1022',
  'Wifin & SIM Cards': '1023',
  'Food Passes': '1031',
  'Ferry Tickets': '1108',
  'Train Tickets': '1133',
  'Train Passes': '1139',
  'Shared Airport Transfers': '1145',
};

export const CATEGORY_IDS: Record<string, string> = {
  Tickets: '1',
  Tours: '2',
  Transportation: '3',
  'Travel Services': '4',
  'Food & Drink': '5',
  'Day Trips': '6',
  Entertainment: '7',
  Adventure: '8',
  'Aerial Sightseeing': '9',
  'Water Sports': '10',
  'Nature & Wildlife': '11',
  Wellness: '12',
  Classes: '13',
  Specials: '14',
  'RV Rentals': '15',
  Staycations: '16',
  Cruises: '18',
  Sports: '19',
};

export const LTD_COLLECTION_ID = 167;

export const LTT_LP_HARDCODED_REVIEWS = [
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Hung Wai',
    country: '🇭🇰 Hong Kong',
    reviewText: `We LOVEEEE it! The show is great! Very good atmosphere and everyone's 
    so happy after the play. The Headout platform is easy to use. You just scan your ticket on your phone for entry.`,
    showName: 'Tina: The Turner Musical',
    stars: 5,
    showLink:
      'https://www.london-theater-tickets.com/tina-the-tina-turner-tickets/',
  },
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Karen Kadore',
    country: '🇬🇧 United Kingdom',
    reviewText: `Ease of booking, regular updates and the text on the day with tickets, maps and easy ordering from the bar. The show was brilliant. Wonderful day!`,
    showName: 'Tina: The Turner Musical',
    stars: 5,
    showLink:
      'https://www.london-theater-tickets.com/tina-the-tina-turner-tickets/',
  },
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Lucia Quiroz',
    country: '🇨🇭 Switzerland',
    reviewText: `Headout helpdesk, was awesome when I had a problem... that at the end turn out to be my fault.
    The show was fantastic. Even my son loved it. Recommended for groups of friends and families!`,
    showName: 'Moulin Rouge! The Musical',
    stars: 5,
    showLink: 'https://www.london-theater-tickets.com/moulin-rouge-tickets/',
  },
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Karina Salby',
    country: '🇩🇰 Denmark',
    reviewText: `Very easy to book tickets, one doesn't need to print anything. An absolutely phenomenal musical experience, amazing scenery, singing and acting.`,
    showName: 'Frozen the Musical',
    stars: 5,
    showLink:
      'https://www.london-theater-tickets.com/frozen-the-musical-tickets/',
  },
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Itziar Iraola',
    country: '🇪🇸 Spain',
    reviewText: `The activity had a very good cast and therefore we enjoyed a quality show. The experience to book the tickets on line was easy and although I missed receiving a pdf on my email we could print them and enter the theatre with no issues.`,
    showName: 'Frozen the Musical',
    stars: 4,
    showLink:
      'https://www.london-theater-tickets.com/frozen-the-musical-tickets/',
  },
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Tracy Lavin',
    country: '🇺🇸 United states',
    reviewText: `We LOVED the theater experience - just amazing! Also, when I coulnd't find my tickets, your team was ever responsive in assisting!`,
    showName: 'Frozen the Musical',
    stars: 5,
    showLink:
      'https://www.london-theater-tickets.com/frozen-the-musical-tickets/',
  },

  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Jane Phillips',
    country: '🇬🇧 United Kingdom',
    reviewText: `The musical was fabulous especially with my granddaughter. Headout had a problem with the booking and rectified it immediately.`,
    showName: 'Matilda The Musical',
    stars: 4,
    showLink:
      'https://www.london-theater-tickets.com/matilda-the-musical-tickets/',
  },

  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Bernardeau Lucie',
    country: '🇫🇷 France',
    reviewText: `Booking tickets with Headout was really easy, I loved the performance and cried a lot, i think its genuinely the best thing i ever saw`,
    showName: 'Matilda The Musical',
    stars: 5,
    showLink:
      'https://www.london-theater-tickets.com/matilda-the-musical-tickets/',
  },
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Joanne Kelly',
    country: '🇮🇪 Ireland',
    reviewText: `Booking with Headout was very easy and received plenty of other recommendations from them for our trip to London. The Lion King was just out of this world. We had our kids (aged 8&9) with us and they loved it. We'd all love to see it again. Theatre was lovely, the seats in the Royal Circle were perfect. Fantastic experience!`,
    showName: 'The Lion King',
    stars: 5,
    showLink: 'https://www.london-theater-tickets.com/the-lion-king-tickets/',
  },
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Andrea Szanyi',
    country: '🇭🇺 Hungary',
    reviewText: `I loved the show. The view from my seat was perfect. I had no problem with buying the ticket. I really recommend headout app 🙂`,
    showName: 'The Lion King',
    stars: 5,
    showLink: 'https://www.london-theater-tickets.com/the-lion-king-tickets/',
  },
  {
    user_image_url: 'https://tourlandish.s3.amazonaws.com/assets/svg/user.svg',
    name: 'Baruch Josef',
    country: '🇮🇱 Israel',
    reviewText: `First, ordering the tickets for the show through Headout was very convenient and easy. The explanation we received on how to get to the show hall was clear and convenient. The show itself was successful, very enjoyable and a perfect experience for the price paid.`,
    showName: 'The Lion King',
    stars: 5,
    showLink: 'https://www.london-theater-tickets.com/the-lion-king-tickets/',
  },
];

export const GUIDES_IMAGE_URL =
  'https://cdn-imgix.headout.com/assets/images/guides/{0}.jpg';
export const LANDSCAPE =
  'https://cdn-imgix-open.headout.com/MB/assets/landscape.svg';
export const LANDSCAPE_MWEB =
  'https://cdn-imgix-open.headout.com/MB/assets/landscape_mobile.svg';
export const BUS = 'https://cdn-imgix-open.headout.com/MB/assets/bus.svg';
export const HO_LOGO =
  'https://cdn-imgix-open.headout.com/MB/assets/ho_logo_circle.svg';

export const ENTITY_ICONS_FOLDER_URL =
  'https://cdn-imgix-open.headout.com/categories';

export const ANALYTICS_SECTION_NAMES = {
  TOP_THINGS_TODO: 'Top things to do',
};

export const BANNER_DESCRIPTORS = {
  CANCELLATION:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/cancellation.svg',
  CHAIR:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/chair.svg',
  CHECK_CIRCLE:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/check-circle.svg',
  CLOCK:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/clock.svg',
  COFFEE:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/coffee.svg',
  CULINARY:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/culinary.svg',
  DOLLAR:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/dollar.svg',
  FnB:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/food-drink.svg',
  GLOBE:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/globe.svg',
  MAP: 'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/map.svg',
  PAID:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/paid.svg',
  PEACE:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/peace.svg',
  ROUND_TRIP:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/round-trip.svg',
  ROUTE:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/route.svg',
  SIGHTSEEING:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/sightseeing.svg',
  STL:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/skip-the-line.svg',
  SPARKS:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/sparks.svg',
  TICK:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/tick.svg',
  TICKET:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/ticket.svg',
  TRANSLATE:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/translate.svg',
  WIFI:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/wifi.svg',
  SPARKS_NEW:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/sparks-new.svg',

  LUGGAGE:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/luggage.svg',
};

export const GDPR_COUNTRY_CODES = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'GB',
  'CH',
  'BH',
  'IL',
  'QA',
  'TR',
  'KE',
  'MU',
  'NG',
  'ZA',
  'UG',
  'JP',
  'KR',
  'NZ',
  'AR',
  'BR',
  'UY',
  'CA',
];
export const COOKIE_BANNER_KEY = 'cookie-banner-state';
export const UAE_COUNTRY_CODE = 'ae';

export const TOUR_GROUP_MEDIA_RESOURCE_TYPE = {
  MB_EXPERIENCE: 'MB_EXPERIENCE',
} as const;

export const NEWS_PAGE_DATE_FORMAT = 'DD MMM YYYY';
export const NEWS_PAGE_SECTIONS = {
  FEATURED_NEWS: 'Featured News',
  MORE_READS: 'More Reads',
  ARTICLES: 'Articles',
  TRAILERS: 'Trailers',
  RECENT_NEWS: 'Recent News',
  LANDING_PAGE_BANNER: 'Landing Page Banner',
  REVIEWS: 'Reviews',
} as const;

export const TRAILER_BG_ILLUSTRATION = 'https://cdn-imgix.headout.com/assets/images/ltt/BG+Illustration.png' as const;

export const MICROBRANDS_URL = 'https://microbrands.headout.com' as const;

export const X_CACHE_HEADER_KEY = 'x-cache' as const;
