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

export const ASPECT_RATIO = {
  GLOBAL_MB: '16:10',
};

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
];

export const SUPPORTED_LANGUAGES_MAP = {
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
};

export const FULL_LANGUAGE_MAP = {
  en: {
    language: 'English',
    paramLang: 'en-us',
    short: 'en',
    bookingFlow: 'en',
  },
  it: {
    language: 'Italiano',
    paramLang: 'it-it',
    short: 'it',
    bookingFlow: 'it',
  },
  es: {
    language: 'Español',
    paramLang: 'es-es',
    short: 'es',
    bookingFlow: 'es',
  },
  fr: {
    language: 'Français',
    paramLang: 'fr-fr',
    short: 'fr',
    bookingFlow: 'fr',
  },
  de: {
    language: 'Deutsch',
    paramLang: 'de-de',
    short: 'de',
    bookingFlow: 'de',
  },
  nl: {
    language: 'Nederlands',
    paramLang: 'nl-nl',
    short: 'nl',
    bookingFlow: 'nl',
  },
  pt: {
    language: 'Português',
    paramLang: 'pt-pt',
    short: 'pt',
    bookingFlow: 'pt',
  },
  cn: {
    language: '简体中文',
    paramLang: 'zh-cn',
    short: 'cn',
    bookingFlow: 'zh-hans',
  },
  tw: {
    language: '繁體中文 ',
    paramLang: 'zh-tw',
    short: 'tw',
    bookingFlow: 'zh-hant',
  },
  ja: {
    language: '日本語',
    paramLang: 'ja-jp',
    short: 'ja',
    bookingFlow: 'ja',
  },
  ko: {
    language: 'Korean',
    paramLang: 'ko-kr',
    short: 'ko',
    bookingFlow: 'ko',
  },
};

export const PRISMIC_LANG_TO_ROUTE_PARAM = {
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
};

export const LANGUAGE_PARAMS_REGEX = /^(\/)?(en|fr|de|it|nl|pt|es|ja|tw|cn|ko){0,2}(\/)/;

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
};

export const CONTENT_PAGE_TYPES = [CUSTOM_TYPES.CONTENT_PAGE];

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
  },
  CATEGORY_TAB_CLICKED: 'Category Tab Clicked',
  MB_SORT_BY_CLICKED: 'MB Sort By Clicked',
  MB_EXPERIENCE_SORTED: 'MB Experiences Sorted',
  EXPERIENCE_CARD_EXPANDED: 'Experience Card Expanded',
  EXPERIENCE_CARD_MORE_DETAILS_CLICKED: 'Experience Card More Details Clicked',
  EXPERIENCE_CARD_BOOK_NOW_CLICKED: 'Experience Card Book Now Clicked',
  CHECK_AVAILABILITY_CLICKED: 'Check Availability Clicked',
  MB_VIDEO_PLAYED: 'MB Video Played',
  MB_LANGUGAGE_CHANGED: 'MB Language Changed',
  LP_TO_BOOKING_PAGE: 'LP to booking page',
  LP_TO_SHOWPAGE: 'LP to showpage',
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
  'favicon',
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
  'enable_powered_by_superbrand_logo',
  'group_form_blocked_days',
  'alert_popup',
  'show_covid19_alert',
  'page_url',
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
  'page_url',
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
  'favicon',
  'other_meta_tags',
  'logo',
  'footer_logo',
];

export const MICROSITE_BOOL_KEYS: string[] = ['disable_amp'];

export const MICROSITE_LINK_KEYS: string[] = ['footer_logo_link'];

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

export const CURRENCY_SYMBOL_MAP = {
  AED: 'AED ',
  SGD: 'S$',
  USD: '$',
  EUR: '€',
  GBP: '£',
  ISK: 'kr',
  HKD: 'HK$',
  INR: '₹',
  AUD: 'AU$',
  CAD: 'CA$',
  NZD: 'NZ$',
  KRW: '₩',
  CHF: 'CHF ',
  JPY: '¥',
  THB: '฿',
  IDR: 'Rp',
  CNY: 'NT$',
  TWD: 'NT$',
};

export const ALLOW_IMMEDIEATE_NESTING = true;

export const DONT_AUTO_SCROLL = false;

export const DONT_HOIST = false;

export const HEADOUT_API_ENDPOINT = 'https://api.headout.com/api';
export const HEADOUT_NAKED_DOMAIN = 'headout.com';

export const TOUR_COMPARISION_DESIGN = {
  TYPE_1: 'Type-1',
  TYPE_2: 'Type-2',
};

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
  SAFETY_CONTACTLESS:
    'https://cdn-imgix-open.headout.com/sites/safe/contactless.jpg',
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
  SAFETY_CONTACTLESS: 'SAFETY_CONTACTLESS',
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

export const DISCOUNTED_FUTURE_IMAGES_SECTION = {
  MOUNTAIN:
    'https://cdn-s3.headout.com/assets/images/discounted-futures/mountain.png',
  BEACH:
    'https://cdn-s3.headout.com/assets/images/discounted-futures/beach.png',
  SMILE:
    'https://cdn-s3.headout.com/assets/images/discounted-futures/smile.png',
  GIRLS:
    'https://cdn-s3.headout.com/assets/images/discounted-futures/girls.png',
  EXPERIENCE:
    'https://cdn-s3.headout.com/assets/images/discounted-futures/experience.png',
  ADVENTURE:
    'https://cdn-s3.headout.com/assets/images/discounted-futures/adventure.png',
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
};

export const GTM_AMP_URL = 'https://www.googletagmanager.com/amp.json';

export const GTM_AMP_KEY_PROD = 'GTM-5HMPHR2';

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
    SHORT: 'DD-MMM-YY',
    FULL: 'DD-MMMM-YYYY',
    DATE_MONTH: 'MMM D',
  },
  ja: {
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

export const TAB_ALLOWED_HIGHLIGHT = [
  'About Show',
  'Show Details',
  'Age Suitability',
  'Top Songs',
  'Tickets',
  'Covid-19 Safety',
];

export const TAB_ALLOWED_INFO = [
  'Getting There',
  'Facilities & Accessibility',
  'Additional Information',
];

export const DETAILS_ALLOWED_SHOWPAGES = [
  'Opening Date',
  'Theatre Name',
  'Duration',
  'Age Limit',
];

export const SAFETY_BANNER_STRING = 'Safety Banner';

export const YES_STRING = 'YES';

export const MONTH_ARRAY = [
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

export const SAFETY_MEASURE_REDIRECT_PAGE_LINK =
  'https://www.london-theater-tickets.com/reopening-london-theatres-safety-measures/';

export const FAVICON_LONDON_THEATRE_TICKETS =
  'https://images.prismic.io/mystique/43d0bf7f-2955-413b-a266-8fc62dd9c933_shows-favicon.png?auto=compress,format';

export const AUDIOGUIDE_TAG_REGEX = /AUDIO_GUIDE_[0-9]+/g;
export const REOPENING_CATEGORIES: number[] = [3159];
export const NEW_ARRIVALS_CATEGORIES: number[] = [1351];

export const ANALYTICS_PROPERTIES = {
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
  CITY: 'City',
  COUNTRY: 'Country',
  VARIANT: 'Experiment Variant',
  EXPERIMENT_NAME: 'Experiment Name',
  EXPERIMENT_VARIANT: 'Experiment Variant',
  DISCOUNT: 'Discount',
  DISPLAY_PRICE: 'Display Price',
  DISPLAY_CURRENCY: 'Display Currency',
  EXPERIENCE_DATE: 'Experience Date',
};
export const PAGE_TYPES = {
  COLLECTION: 'Collection',
  CONTENT_PAGE: 'Content Page',
  SHOW_PAGE: 'Show Page',
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
};

export const CTA_TYPE = {
  BUTTON: 'Button CTA',
  TEXT: 'Text CTA',
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

export const LIVE_CHAT = {
  DELAY: 3000,
  LICENCE_KEY: '8339531',
  SALES_TRACKER_ID: 'xKAt5wZBBFuxqR7H2oMHEdeZksNqY2VL',
};
