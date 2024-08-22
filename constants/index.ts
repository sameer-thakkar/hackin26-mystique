import { longMonthtoShort } from 'utils/dateUtils';
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
  CONSENT_POLICY_STATE: 'consent-state',
  HEADOUT_ATTRIBUTION_TRACKER: 'h-attr',
  LANG: 'content_lang',
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

export type LanguagesUnion = (typeof SUPPORTED_LANGUAGES)[number];

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

export type TLANGUAGELOCALE = (typeof SUPPORTED_LOCALE_MAP)[LanguagesUnion];

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
    displayName: 'Polski',
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

export const DEFAULT_PRISMIC_LANG = LANGUAGE_MAP['en'].locale;

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
  REVIEWS_PAGE: 'reviews_page',
  SEATING_PLAN: 'seating-plan',
};

export const THEATRE_TYPES = {
  ABBA_ARENA: 'abba-arena',
  HIS_MAJESTYS_THEATRE: 'his-majestys-theatre',
  NOVELLO_THEATRE: 'novello-theatre',
  PRINCE_EDWARD_THEATRE: 'prince-edward-theatre',
  THEATRE_ROYAL_DRURY_LANE: 'theatre-royal-drury-lane',
};

export const TEMPLATES = {
  HOHO: 'HOHO',
  AIRPORT_TRANSFERS: 'Airport Transfers',
};

export type CUSTOM_TYPE_KEYS = keyof typeof CUSTOM_TYPES;
export type CUSTOM_TYPE_VALUES = (typeof CUSTOM_TYPES)[CUSTOM_TYPE_KEYS];

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
  SHOULDER_PAGE_SECTION_VIEWED: 'Shoulder Page Section Viewed',
  SHOW_PAGE_SECTION_VIEWED: 'Show Page Section Viewed',
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
  CATEGORY_TAG_CLICKED: 'Category Tag Clicked',
  MB_SORT_BY_CLICKED: 'MB Sort By Clicked',
  MB_EXPERIENCE_SORTED: 'MB Experiences Sorted',
  EXPERIENCE_CARD_EXPANDED: 'Experience Card Expanded',
  EXPERIENCE_CARD_MORE_DETAILS_CLICKED: 'Experience Card More Details Clicked',
  EXPERIENCE_CARD_BOOK_NOW_CLICKED: 'Experience Card Book Now Clicked',
  CHECK_AVAILABILITY_CLICKED: 'Check Availability Clicked',
  SELECT_SEATS_CTA_CLICKED: 'Select Seat CTA Clicked',
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
    THEATRE_PAGE_CTA_CLICKED: 'Theatre Page CTA Clicked',
    CARD_DESCRIPTOR_CLICKED: 'Card Descriptor Clicked',
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
  SUBSCRIBED_SUCCESSFULLY: 'Subscribed Successfully',
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
  SHOW_PAGE: {
    RATING_WIDGET_CLICKED: 'Rating Widget Clicked',
    EXPERIENCE_DATE_SELECTED: 'Experience Date Selected',
    EXPERIENCE_TIME_SELECTED: 'Expereince Time Selected',
    CALENDAR_OPEN: 'Calendar Opened',
    CALENDAR_CLOSED: 'Calendar Closed',
    CALENDAR_DATE_SELECTED: 'Calendar Date Selected',
    CALENDAR_TIME_SELECTED: 'Calendar Time Selected',
    THEATRE_NAME_CLICKED: 'Theatre Name Clicked',
    DATE_SELECTION_CLOSED: 'Date Selection Drawer Closed',
    TIMESLOT_DROPDOWN_OPENED: 'Timeslot Dropdown Opened',
    CONTENT_SECTION_LINK_CLICKED: 'Content Section Link Clicked',
    VIDEO_CLICKED: 'Video Clicked',
    RATINGS_HOVERED: 'Ratings Hovered',
    SHOW_PAGE_CTA_CLICKED: 'Show Page CTA Clicked',
  },
  MB_CARD_CLICKED: 'MB Card Clicked',
  FREE_CANCELLATION_TOOLTIP_VIEWED: 'Free Cancellation Tooltip Viewed',
  REVIEWS_SECTION_VIEWED: 'Reviews Section Viewed',
  HOHO: {
    ROUTE_DETAILS_VIEWED: 'Route Details Viewed',
    MORE_DETAILS_VIEWED: 'More Details Viewed',
    CALENDAR_CLOSED: 'Calendar Closed',
    CALENDAR_DATE_SELECTED: 'Calendar Date Selected',
  },
  VIDEO_PLAYER_OPENED: 'Video Player Opened',
  MONTH_ICON_CLICKED: 'Month Icon Clicked',
  FAB_ICON_CLICKED: 'Fab Icon Clicked',
  CATEGORY_SELECTED: 'Category Selected',
  CATEGORY_FILTER_APPLIED: 'Category Filter Applied',
  CATEGORY_FILTER_CLEARED: 'Category Filter Cleared',
  FILTER_DRAWER_OPENED: 'Filter Drawer Opened',
  COMBO_CARDS_CLICKED: 'Combo Card Clicked',
  SHOULDER_PAGE_CTA_CLICKED: 'Shoulder Page CTA Clicked',
  REVIEWS_PAGE_CTA_CLICKED: 'Reviews Page CTA Clicked',
  RATING_WIDGET_CLICKED: 'Rating Widget Clicked',
  REVIEWS_PAGE_SECTION_VIEWED: 'Reviews Page Section Viewed',
  CONTENT_SECTION_LINK_CLICKED: 'Content Section Link Clicked',
  BOOSTERS: {
    PRESENT: 'Booster Present',
    VIEWED: 'Product Booster Viewed',
  },
  MORE_DETAILS_SWIPESHEET_CLOSED: 'More Details Swipesheet Closed',
  PRODUCT_CARD_DEADCLICK: 'Product Card Deadclick',
  MORE_REVIEWS_CLICKED: 'Show More Reviews Clicked',
  SEATMAP_EXPERIMENT: {
    THEATRE_NAME: 'Theatre Name',
    HAS_ACTIVE_SHOWS: 'Has Active Shows',
    NUMBER_OF_PRODUCTS: 'Number of products',
    SEATMAP_SECTION: 'Seatmap Section',
    SEATS_LEFT: 'Seats Left',
    READ_MORE: 'Read More',
    FIND_BEST_SEATS: 'Find Best Seats',
    THEATRE_SECTION_VIEWED: 'Seatmap Section Details Viewed',
    VENUE_SEATS_PAGE_SECTION_VIEWED: 'Venue Seats Page Section Viewed',
  },
  VIEW_ITINERARY_CLICKED: 'View Itinerary Clicked',
  ITINERARY_POPUP_VIEWED: 'Itinerary Popup Viewed',
  ITINERARY_POPUP_CLOSED: 'Itinerary Popup Closed',
  ITINERARY_VARIANT_CLICKED: 'Itinerary Variant Clicked',
  BACK_BUTTON_CLICKED: 'Back Button Clicked',
  ITINERARY_CTA_CLICKED: 'Itinerary CTA Clicked',
  MAP_VIEWED: 'Map Viewed',
  MAP_ZOOMED: 'Map Zoomed',
  MAP_CLICKED: 'Map Clicked',
  STOPS_SCROLLED: 'Stops Scrolled',
  ITINERARY: {
    TIMELINE_VIEWED: 'Timeline Viewed',
    STOP_CLICKED: 'Stop Clicked',
    SUB_STOP_CLICKED: 'Sub Stop Clicked',
    ITINERARY_VARIANT_CLICKED: 'Itinerary Variant Clicked',
    ITINERARY_TOGGLE_CLICKED: 'Itinerary Toggle Clicked',
    MAP_VIEWED: 'Map Viewed',
    VIEW_ITINERARY_CLICKED: 'View Itinerary Clicked',
    ITINERARY_DRAWER_CTA_CLICKED: 'Itinerary Drawer CTA Clicked',
  },
  AIRPORT_TRANSFERS: {
    SEARCH_FILTER_CLICKED: 'Search Filter Clicked',
    SEARCH_FILTER_APPLIED: 'Search Filter Applied',
    ERROR_VIEWED: 'Error Viewed',
    SEARCH_BAR_TAB_CLICKED: 'Search Bar Tab Clicked',
    DRAWER_CTA_CLICKED: 'Drawer CTA Clicked',
    DRAWER_CLOSED: 'Drawer Closed',
  },
  EXPERIENCE_DATE_SELECTED: 'Experience Date Selected',
  EXPERIENCE_TIME_SELECTED: 'Expereince Time Selected',
  CALENDAR_OPEN: 'Calendar Opened',
  CALENDAR_CLOSED: 'Calendar Closed',
  CALENDAR_DATE_SELECTED: 'Calendar Date Selected',
  FILTER_APPLIED: 'Filter Applied',
  FOOD_TAB_CLICKED: 'Food Menu Tab Clicked',
  DEAD_CLICK: 'Dead Click Captured',
  DESCRIPTOR_CLICKED: 'Descriptor Clicked',
  EXPERIENCE_CARD_VIEWED: 'Experience Card Viewed',
};

export const MORE_DETAILS_SWIPESHEET = {
  ACTION: {
    CLOSE_BUTTON: 'Close Button',
    OVERLAY_CLICKED: 'Overlay Clicked',
  },
};

export const FILTER_TYPE = {
  SUB_CATEGORY: 'Sub-Category Filter',
};

export const PAGE_TYPE = {
  COLLECTION_PAGE: 'Collection Page',
};

export const PRODUCT_CARD_REVAMP = {
  PLACEMENT: {
    SIDE_SHEET: 'Side Sheet',
    PRODUCT_CARD: 'Product Card',
    POPUP: 'Popup',
    MORE_DETAILS: 'More Details',
    SWIPESHEET: 'Swipesheet',
    DESCRIPTORS: 'Descriptors',
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

export const MICROSITE_STRING_KEYS = [
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
  GUIDED_TOUR: 'GUIDED_TOUR',
  TRANSFERS: 'TRANSFERS',
};

export const MICROSITE_OBJECT_KEYS = [
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

export const RIV_LOGO =
  'https://cdn-imgix-open.headout.com/MB/RIV/dynamicHeader.riv';

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
  PRODUCT_CARD_NEW: 'product-card-new',
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
  RATING: 'Rating',
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
  WATCH_VIDEO: 'Watch Video',
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
  SELECTED_DATE: 'Selected Date',
  IS_PRICE_FADED: 'Is Price Faded',
  IS_MIN_PRICE: 'Is Minimum Price',
  LEAD_TIME_DAYS: 'Lead Time Days',
  EXPERIENCE_TIME: 'Experience Time',
  HAS_SELLING_OUT_FAST_DESCRIPTOR: 'Has Selling Out Descriptor',
  USER_EMAIL: 'User Email',
  CARD_MB_TYPE: 'Card MB Type',
  TITLE: 'Title',
  PERCENTAGE_VIEWED: 'Percentage Viewed',
  IS_DATE_FILTER: 'Is Date Filter',
  PLACEMENT: 'Placement',
  MONTH_ICON: 'Month Icon',
  MONTH_PAGE: 'Month Page',
  ICON_TYPE: 'Icon Type',
  FILTER_TYPE: 'Filter Type',
  BOOSTER_NAME: 'Booster Name',
  DESCRIPTOR_TYPE: 'Descriptor Type',
  DESCRIPTOR_NAME: 'Descriptor Name',
  IS_LANDING_PAGE: 'Is Landing Page',
  COMPONENT: 'Component',
  SUBATTRACTION_TYPE: 'Sub-Attraction Type',
  PRODUCTS_PRESENT: 'Products Present',
  SECTION_TYPE: 'Section Type',
  SLICE_TYPE: 'Slice Type',
  AIRPORT_TRANSFERS: {
    IS_SEARCH_PRESENT: 'Is Search Present',
    PRIVATE_TRANSFERS_PRESENT: 'Private Transfers Present',
    NUMBER_OF_PRODUCTS: 'Number Of Products',
    FILTER_NAME: 'Filter Name',
    FILTER_VALUE: 'Filter Value',
    ERROR_REASON: 'Error Reason',
    TAB_NAME: 'Tab Name',
    DRAWER_TYPE: 'Drawer Type',
  },
  CONTAINER: 'Container',
  NUMBER_OF_PRODUCTS: 'Number Of Products',
  NUMBER_OF_SLICES: 'Number Of Slices',
  FIRST_SLICE_TYPE: 'First Slice Type',
  HYPERLINK: 'Hyperlink',
  DETAILS_TYPE: 'Details Type',
  RANK: 'Rank',
  TIME_SLOTS_AVAILABLE: 'Timeslots Available',
  HAS_ACTIVE_SHOWS: 'Has Active Shows',
  ITINERARY_ID: 'Itinerary ID',
  ITINERARY_NAME: 'Itinerary Name',
  CLICK_TYPE: 'Click Type',
  STOP_NAME: 'Stop Name',
  STOP_NUMBER: 'Stop Number',
  DESCRIPTORS: 'Descriptors',
  HAS_MAP: 'Has Map',
  ITINERARY_TYPE: 'Itinerary Type',
  INFORMATION_HEADING: 'Information Heading',
  ITINERARY_VIEW: 'Itinerary View',
  ZOOM_TYPE: 'Zoom Type',
  IS_BLOG_BANNER_PRESENT: 'Is Blog Banner Present',
  FILTERS_PRESENT: 'Filters Present',
  PRIMARY_PRODUCTS_PRESENT: 'Primary Products Present',
  FILTER_NAME: 'Filter Name',
  BOARDING_POINTS: 'Boarding Points Present',
  FOOD_MENUS_PRESENT: 'Food Menus Present',
  TAB_NAME: 'Tab Name',
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
  REVIEWS_PAGE: 'Reviews Page',
  VENUE_SEATS_PAGE: 'Venue Seats Page',
  CRUISES_LP: 'Cruises Landing Page',
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
  EXPERIMENT_OVERRIDE: 'experimentOverride',
  FILTER_REVIEWS: 'filter-reviews',
  ATRIBUTION_CHANNEL_ID: 'ci',
  ATRIBUTION_CHANNEL_META: 'cm',
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
  SELECT_SEATS: 'Select Seats',
  ALL_PHOTOS: 'All photos',
  READ_MORE: 'Read More',
  READ_DETAILED_REVIEWS: 'Read detailed reviews',
  BIG_CTA: 'Big CTA',
  SMALL_CTA: 'Small CTA',
  SHOW_MORE_ARTICLES: 'Show More Articles',
  VIEW_ROUTES: 'View All Routes',
  TICKETS: 'Tickets',
  LOAD_MORE: 'Load More',
  MORE_INFORMATION: 'More Information',
  MAP_LINK: 'Map Link',
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

export const REVIEW_API_DOMAIN = 'MICROBRAND';

export const RTL_LANGUAGE_CODES = [LANGUAGE_MAP.ar.code];

export const LIVE_CHAT = {
  DELAY: 5000,
  LICENCE_KEY: '8339531',
  SALES_TRACKER_ID: 'xKAt5wZBBFuxqR7H2oMHEdeZksNqY2VL',
};

export const ZENDESK_CHAT = {
  DELAY: 5000,
  LICENSE_KEY: '5791c268-bf5b-4545-a4c1-521271954710',
};

export const SLICE_TYPES = {
  LISTICLE_SECTION: 'listicle_section',
  LISTICLE: 'listicle',
  LISTICLE_V2: 'listicle_v2',
  LISTICLE_SECTION_V2_START: 'listicle_section_v2',
  SHOULDER_PAGE_TICKET_CARD: 'ticket_card_shoulder_page',
  BREADCRUMBS: 'breadcrumbs',
  // V1 product card slice
  TOUR_LIST_CATEGORY_V1: 'tour_list_category_v1',
  // V2 product card slice
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
  CONTENT_TABS: 'Content Tabs',
  // Airport Transfer
  CARS_CAROUSEL: 'cars_carousel',
  //Reviews Page
  DETAILED_REVIEW: 'detailed_review',
  REVIEW_CHIPS: 'review_chips',
  CRITICS_REVIEWS: 'critics_review',
  CONTRIBUTORS_REVIEW: 'contributors_review',
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
  SHOULDER_PAGE_TYPE: {
    DIRECTIONS: 'Directions',
    PLAN_YOUR_VISIT: 'Plan your visit',
    ABOUT: 'About',
    TIMINGS: 'Timings',
    GETTING_THERE: 'Getting there',
    FACTS: 'Facts',
    ENTRANCES: 'Entrances',
    Architecture: 'Architecture',
    SUB_ATTRACTIONS: 'Sub-attractions',
    SKIP_THE_LINE: 'Skip the Line',
    INSIDE: 'Inside',
    TIPS: 'Tips',
    GUIDED_TOURS: 'Guided Tours',
    MISC: 'Misc',
    HISTORY: 'History',
    RESTAURANTS: 'Restaurants',
  },
  SUBATTRACTION_TYPE: {
    A: 'A',
    B: 'B',
    C: 'C',
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
  IS_LANDING_PAGE: 'is_landing_page',
  NOINDEX: 'noindex',
  CANONICAL_LINK: 'canonical_link',
  IS_ENTERTAINMENT_MB: 'is_entertainment_mb',
  PARENT_COLLECTION_ID: 'parent_collection_id',
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
    IMAGE: 'IMAGE',
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

export const HARRY_POTTER_CURSED_CHILD_TGID = '16816';

export const GUIDES_IMAGE_URL =
  'https://cdn-imgix.headout.com/assets/images/guides/{0}.jpg';
export const LANDSCAPE =
  'https://cdn-imgix-open.headout.com/MB/assets/landscape.svg';
export const LANDSCAPE_MWEB =
  'https://cdn-imgix-open.headout.com/MB/assets/landscape_mobile.svg';
export const BUS = 'https://cdn-imgix-open.headout.com/MB/assets/bus.svg';
export const HO_LOGO =
  'https://cdn-imgix-open.headout.com/MB/assets/ho_logo_circle.svg';
export const ATTRACTIONS_PLACEHOLDER =
  'https://cdn-imgix-open.headout.com/MB/assets/attractions-placeholder.png';

export const ENTITY_ICONS_FOLDER_URL =
  'https://cdn-imgix-open.headout.com/categories';

export const LANGUAGE_SORT_ORDER = ['en', 'es', 'fr', 'it', 'de', 'pt', 'nl'];

export const ANALYTICS_SECTION_NAMES = {
  TOP_THINGS_TODO: 'Top things to do',
};

export const BANNER_DESCRIPTORS = {
  AUDIOGUIDE:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/audio-guide.svg',
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
  FnB: 'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/food-drink.svg',
  GLOBE:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/globe.svg',
  MAP: 'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/map.svg',
  ONBOARD_MEAL:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/onboard-meal.svg',
  PAID: 'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/paid.svg',
  PEACE:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/peace.svg',
  ROUND_TRIP:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/round-trip.svg',
  ROUTE:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/route.svg',
  SIGHTSEEING:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/sightseeing.svg',
  STL: 'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/skip-the-line.svg',
  SPARKS:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/sparks.svg',
  TICK: 'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/tick.svg',
  TICKET:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/ticket.svg',
  TRANSLATE:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/translate.svg',
  WIFI: 'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/wifi.svg',
  SPARKS_NEW:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/sparks-new.svg',
  LUGGAGE:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/luggage.svg',
  BEVERAGE:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-beverage.svg',
  HELICOPTER:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-helicopter.svg',
  HEART:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-heart.svg',
  HOURGLASS:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-hourglass.svg',
  LANDMARKS:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-landmarks.svg',
  LOTUS:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-lotuus.svg',
  LUXURY:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-luxury.svg',
  MAP_PIN:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-map-pin.svg',
  NIGHT:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-night.svg',
  PAINT:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-paint.svg',
  PAN: 'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-pan.svg',
  PANAROMA:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-panaroma.svg',
  CHARGING:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-charging.svg',
  PUBLIC_TRANSPORT:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-public-transport.svg',
  SEARCH:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-search.svg',
  SKYDIVING:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-skydiving.svg',
  SNORKELLING:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-snorkelling.svg',
  SPEED_BOAT:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-speed-boat.svg',
  TRANSFERS:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-transfers.svg',
  ADVENTURE:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-adventure.svg',
  MAP_HEART_PIN:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-heart-map-pin.svg',
  DIAMOND:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-diamond.svg',
  PLANNING:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-planning.svg',
  INSIGHTS:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-insights.svg',
  CAMERA:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-camera.svg',
  ONE_CARD:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-one-card.svg',
  MULTI_OP:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-multi-option.svg',
  COST_EFF:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-cost-eff.svg',
  EASY_BEST:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-ticket-discount.svg',
  INSTANT_MOBILE:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-mticket.svg',
  MULTI_TRANSPORT:
    'https://cdn-imgix-open.headout.com/mb-icons/banner-descriptor/colored-multi-transport.svg',
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
  'UY',
];
export const COOKIE_BANNER_KEY = 'cookie-banner-state';
export const UAE_COUNTRY_CODE = 'ae';
export const THRESHOLD = [90, 75, 50, 25];

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

export const MONTH_ON_MONTH_PAGE_SECTIONS = {
  CALENDARY_MONTH: 'Calendar Month',
};
export const TRAILER_BG_ILLUSTRATION =
  'https://cdn-imgix.headout.com/assets/images/ltt/BG+Illustration.png' as const;

export const MICROBRANDS_URL = 'https://microbrands.headout.com' as const;

export const X_CACHE_HEADER_KEY = 'x-cache' as const;

export const CALENDAR_UNIT = 'calendar-unit';

function capitalizeFirstLetter(word: string | null) {
  if (!word) {
    return '';
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export const getLocalizedQuarters = (lang = 'en-us') => {
  const quarterMonths = [
    'January - March',
    'April - June',
    'July - September',
    'October - December',
  ];
  let JAN_MAR = '',
    APR_JUN = '',
    JUL_SEP = '',
    OCT_DEC = '';

  quarterMonths.forEach((quarterValue, index) => {
    const [startMonth, endMonth] = quarterValue.split(' - ');
    let localisedStartMonth = longMonthtoShort({
      fullMonth: startMonth,
      lang,
    });
    let localisedEndMonth = longMonthtoShort({
      fullMonth: endMonth,
      lang,
    });

    localisedStartMonth = capitalizeFirstLetter(localisedStartMonth);
    localisedEndMonth = capitalizeFirstLetter(localisedEndMonth);

    if (index === 0) {
      JAN_MAR = `${localisedStartMonth} - ${localisedEndMonth}`;
    } else if (index === 1) {
      APR_JUN = `${localisedStartMonth} - ${localisedEndMonth}`;
    } else if (index === 2) {
      JUL_SEP = `${localisedStartMonth} - ${localisedEndMonth}`;
    } else {
      OCT_DEC = `${localisedStartMonth} - ${localisedEndMonth}`;
    }
  });

  const quartersData = [
    { start: 1, end: 3, label: JAN_MAR },
    { start: 4, end: 6, label: APR_JUN },
    { start: 7, end: 9, label: JUL_SEP },
    { start: 10, end: 12, label: OCT_DEC },
  ];

  return {
    quarters: quartersData,
    JAN_MAR,
    APR_JUN,
    JUL_SEP,
    OCT_DEC,
  };
};

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const ENTITY_ICONS_FOLDER_LINK =
  'https://cdn-imgix-open.headout.com/categories';

export const SHORTER_CACHE_AGE = 10;

export const SIXTY_DAYS_CACHE = 5552000;

export const SUBCATEGORY = {
  CITY_CARDS: 'City Cards',
};

export const REVIEWS_PAGE_BANNER_ILLUSTRATION =
  'https://cdn-imgix.headout.com/media/images/ec1dfb688ac20d1222e805405e66e86a-reviews-dweb.png';

export const REVIEW_CHIPS_BACKGROUND_ILLUSTRATION =
  'https://cdn-imgix.headout.com/media/images/86ce0621f7a25d709e3ed8133b068ccf-adobestock_652508416.jpeg';

export const THEATRE_LANDING_PAGE_ILLUSTRATION =
  'https://cdn-imgix.headout.com/media/images/67c63d1f914a453897b62736759289c6-Frame%20220015309.png';

export const PERMANENT_SHOWS_TGIDS = [
  16818, 16816, 22293, 3031, 19737, 20045, 17432, 18161, 13402, 9858, 2863,
  9162, 9723, 3023, 3027, 3032, 3026, 3028, 3037, 2843, 18551, 519, 507, 512,
  730, 508, 1293, 24533, 10069, 10017, 5838, 24863, 11845, 19636, 11340, 20498,
];

export enum SHOULDER_TIMINGS_SCALE_ICONS {
  PLEASANT = 'PLEASANT',
  CROWDED = 'CROWDED',
  VERY_CROWDED = 'VERY_CROWDED',
  CLOSED = 'CLOSED',
  LOW_SEASON = 'LOW_SEASON',
  MID_SEASON = 'MID_SEASON',
  PEAK_SEASON = 'PEAK_SEASON',
}

export enum SHOULDER_TIMINGS_SCALE_TYPES {
  week = 'week',
  year = 'year',
}

export const SHOULDER_TIMINGS_SCALE_LEGENDS = {
  [SHOULDER_TIMINGS_SCALE_TYPES.week]: [
    SHOULDER_TIMINGS_SCALE_ICONS.PLEASANT,
    SHOULDER_TIMINGS_SCALE_ICONS.CROWDED,
    SHOULDER_TIMINGS_SCALE_ICONS.VERY_CROWDED,
    SHOULDER_TIMINGS_SCALE_ICONS.CLOSED,
  ],
  [SHOULDER_TIMINGS_SCALE_TYPES.year]: [
    SHOULDER_TIMINGS_SCALE_ICONS.LOW_SEASON,
    SHOULDER_TIMINGS_SCALE_ICONS.MID_SEASON,
    SHOULDER_TIMINGS_SCALE_ICONS.PEAK_SEASON,
  ],
};

export const RATINGS_ORDER = [5, 4, 3, 2, 1];

export const FILTER_RATING_TO_API_PARAM_MAPPING: TFilterRating = {
  'most-relevant': {
    'filter-type': 'TOP',
    'sort-type': 'HELPFULNESS',
    'sort-order': 'DESC',
    value: 'most-relevant',
    default: true,
    label: strings.REVIEWS_PAGE.MOST_RELEVANT,
  },
  'high-to-low': {
    'filter-type': 'TOP',
    'sort-type': 'RATING',
    'sort-order': 'DESC',
    value: 'high-to-low',
    label: strings.REVIEWS_PAGE.RATING_HIGH_TO_LOW,
  },
  'low-to-high': {
    'filter-type': 'TOP',
    'sort-type': 'RATING',
    'sort-order': 'ASC',
    value: 'low-to-high',
    label: strings.REVIEWS_PAGE.RATING_LOW_TO_HIGH,
  },
};

export type TFilterRating = {
  [key: string]: Record<string, any>;
};

export type TFilterRatingKeys = keyof typeof FILTER_RATING_TO_API_PARAM_MAPPING;

export const REVIEWS_PAGE_SECTIONS = {
  DETAILED_REVIEW: 'Detailed Reviews',
  CRITIC_REVIEWS: 'Critic Reviews',
  USER_REVIEWS: 'User Reviews',
  CONTRIBUTOR_REVIEW: 'Contributor Review',
  MORE_READS: 'More Reads',
  CRITICS_USER_REVIEWS: 'Critics/User Reviews',
  REVIEWS: 'Reviews',
};

// an experiment to see if we get more ctr
export const siteNameMappings = new Map<string, string>([
  ['www.london-theater-tickets.com', 'London Theatre Tickets'],
]);

export const BOOSTER_RIVE_LOCATION =
  'https://cdn-imgix.headout.com/mb/boosters_4.riv';

export const PRODUCT_CARD_CHILDREN_POSITIONS = {
  MORE_DETAILS: 'More Details',
};

export const RANKING_EXPERIMENT_UIDS: Array<string> = [
  'www.dubai-tickets.co.burj-khalifa',
  'www.acropolis-tickets.com',
  /**
   * removed because being used in other experiment
   * will re-add later
   */
  // 'www.thevaticantickets.com',
  'www.eiffeltickets.com',
  'www.tickets-paris.fr.disneyland-paris',
  'www.london-tickets.co.uk.london-eye-tickets',
  'www.kennedyspacecenter-tickets.com',
  'the-edge-nyc.new-york-tickets.com',
  'www.accademia-tickets.com',
  'www.london-tickets.co.uk.tower-of-london',
];

export const CAROUSEL_UNITS = {
  dotsLimit: 4,
  mobileDotSize: 6,
  mobileDotMargin: 4,
  mobileTabSize: 24,
  mobileTabMargin: 2,
};

export const COLLECTION_ID_THEATRE_NAMES_MAP: Record<number, string> = {
  167: 'West End',
  24: 'Broadway',
};

export const LFC_IMPACT_EXPERIMENT_EXCLUDED_UIDS = [
  'sagradafamilia.barcelona-tickets.com',
  'catacombs.tickets-paris.fr',
];

export const ENTERTAINMENT_CATEGORIES = [
  'Musicals',
  'Plays',
  'Kids',
  'Dance',
  'Opera',
  'Comedy',
  'Cabarets',
  'Magic',
  'Drama',
  'Circus',
];
export const LFC_IMPACT_EXPERIMENT_UIDS = [
  'www.schindlers-factory-tickets.com',
  'louvremuseum.tickets-paris.fr',
  'www.versailles-palace-tickets.com',
  'www.st-peters-basilica-tickets.com',
  'www.alcazar-seville-tickets.com',
  'www.seville-cathedral-tickets.com',
  'www.penapalacetickets.com',
  'www.tulip-garden-tickets.com',
  'www.singapore-tickets.com.gardens-by-the-bay-tickets',
  'www.london-tickets.co.uk.warner-bros-studio-tour-london',
  'www.singapore-tickets.com.resorts-world-sentosa.universal-studios-tickets',
  'www.topkapipalace-tickets.com',
  'www.royal-palace-madrid-tickets.com',
  'www.oceanografictickets.com',
  'www.barcelona-tickets.com.hola-barcelona-travel-card',
  'www.barcelona-aerobus-tickets.com',
  'www.acropolis-tickets.com.acropolis-museum',
  'www.friedrichstadt-palast.berlin-tickets.com',
  'www.barcelona-aerobus-tickets.com',
  'www.singapore-tickets.com.mandai-wildlife-reserve.night-safari',
  'www.new-york-tickets.com.summit-one-vanderbilt',
  'www.london-tickets.co.uk.sea-life-london-aquarium-tickets',
  'safari-world.bangkok-tickets.com',
];

export const ENTERTAINMENT_MB_CITIES = {
  LONDON: 'London',
  NEW_YORK: 'New York',
};

export const MYSTIQUE = 'Mystique';

export const HOHO_SUBCATEGORY_ID = 1011;
export const CRUISE_CATEGORY_ID = 18;

export const CRUISES_REVAMP_UIDS = [
  'www.seine-river-cruises.com',
  'www.canal-cruise-amsterdam.com',
  'www.chaophrayacruises.com',
  'www.thames-river-cruise.com',
  'www.bangkok-river-cruise.com',
];

export const CRUISES_ILLUSTRATION =
  'https://cdn-imgix-open.headout.com/MB/assets/cruise-banner.svg';

export const MEALS_SUBCAT_IDS = [1060, 1094];
export const SUBCAT_IDS = { COMBOS: 1080 };
export const GREEN_TICK =
  'https://cdn-imgix-open.headout.com/mb-icons/green-tick.svg';
export const RED_CROSS =
  'https://cdn-imgix-open.headout.com/mb-icons/red-cross.svg';

export const IMAGE_QUALITY_EXPERIMENT_UIDS = [
  'www.thevaticantickets.com',
  'www.alcazar-seville-tickets.com',
  'www.london-tickets.co.uk.windsor-castle-tickets',
  'www.london-tickets.co.uk.sea-life-london-aquarium-tickets',
  'anne-frank.tickets-amsterdam.com',
  'www.stonehenge-london-tours.com',
  'www.abudhabi-tickets.com.warner-bros-world-abu-dhabi',
  'www.castel-sant-angelo-ticket.com',
  'www.versailles-palace-tickets.com',
  'www.belvederepalacetickets.com',
  'moma.new-york-tickets.com',
  'www.palmtowertickets.com',
  'www.dubai-tickets.co.dubai-aquarium',
  'www.krkanationalparktickets.com',
  'summit-one-vanderbilt.new-york-tickets.com',
  'www.new-york-tickets.com/summit-one-vanderbilt',
  'www.knossospalacetickets.com',
  'www.jeronimosmonasterytickets.com',
  'skytree.tickets-tokyo.com',
  'gardaland.themeparkstickets.com',
  'www.singapore-tickets.com.mandai-wildlife-reserve.night-safari',
  'www.tickets-valencia.com.ciudad-de-las-artes-y-las-ciencias',
];

export const OLYMPICS_BANNER = {
  BANNER_CONTENT: `No fuss, just fun – tips, tricks, and zones unlocked! Plus, learn <a href="https://www.headout.com/blog/how-to-apply-for-a-pass-jeux-paris-olympics" rel="nofollow" target="_blank">how to get the Pass Jeux!</a>`,
  CTA_CONTENT: `<a
      href="https://www.headout.com/blog/2024-summer-olympics-paris-city-guide"
      rel="nofollow"
      target="_blank"
    >Get your free guide</a>`,
  HOW_TO_GET_PASS: 'How to get the pass Jeux',
  VIP_ACCESS: 'Your VIP Access To The Paris 2024 Olympics',
  GET_YOUR_FREE_GUIDE: 'Get your free guide',
  BLOG_BANNER: 'Olympics Blog Banner',
  BLOG_REDIRECTION: 'Blog Redirection',
};
