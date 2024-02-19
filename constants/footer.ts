import { FooterLink } from 'UI/Footer/interface';
import { strings } from 'const/strings';
import Facebook from 'assets/facebook';
import HelpIcon from 'assets/footerHelp';
import MailIcon from 'assets/footerMail';
import MessageIcon from 'assets/footerMessage';
import PhoneIcon from 'assets/footerPhone';
import Linkedin from 'assets/linkedin';
import Pinterest from 'assets/pinterest';
import Twitter from 'assets/twitter';
import Youtube from 'assets/youtube';

export const PAYMENT_CARD_ICONS = {
  APPLEPAY:
    'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/ApplePay.svg',
  GPAY: 'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/GPay.svg',
  VISA: 'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/Visa.svg',
  MASTERCARD:
    'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/MasterCard.svg',
  MAESTROCARD:
    'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/MaestroCard.svg',
  IDEAL:
    'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/IDealCard.svg',
  DISCOVER:
    'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/DiscoverCard.svg',
  DINERS:
    'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/DinerClub.svg',

  AMEX: 'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/AmexCard.svg',
};

export const FOOTER_CONTACT_ICON_DIM = 12;

export const CONTACT_ICONS = {
  EMAIL:
    'https://cdn-imgix-open.headout.com/headout-connect/contact-icons/Mail.svg',
  PHONE:
    'https://cdn-imgix-open.headout.com/headout-connect/contact-icons/Phone.svg',
  HELP: 'https://cdn-imgix-open.headout.com/headout-connect/contact-icons/Help.svg',
  MESSAGE:
    'https://cdn-imgix-open.headout.com/headout-connect/contact-icons/Message.svg',
};

export const HEADOUT_ADDRESS =
  '© Headout Inc, 82 Nassau St #60351 New York, NY 10038';

export const DOWNLOAD_APP_QR =
  'https://cdn-imgix-open.headout.com/headout-connect/app_download.svg';

export const STAR_LOGO_LIGHT =
  'https://cdn-imgix-open.headout.com/ltt-assets/star-logo.png';

export const STAR_LOGO_DARK =
  'https://cdn-imgix-open.headout.com/ltt-assets/star-logo-dark.svg';

export const STAR_VERIFICATION_LINK =
  'https://www.star.org.uk/verify?dn=https://www.london-theater-tickets.com';

export const SOCIAL_LINKS = {
  FB_URL: 'https://www.facebook.com/headoutapp',
  TWITTER_URL: 'https://www.twitter.com/headout',
  INSTAGRAM_HEADOUT_URL: 'https://www.instagram.com/headout/',
  INSTAGRAM_HEADOUT_DUBAI_URL: 'https://www.instagram.com/headoutuae/',
  PINTEREST_URL: 'https://in.pinterest.com/headout/',
  YOUTUBE_URL: 'https://www.youtube.com/c/Headout-Official',
  LINKEDIN_URL: 'https://www.linkedin.com/company/headout-com/mycompany/',
};

export const HEADOUT_SUPPORT_LINE = '+1 347-897-0100';

export const HEADOUT_SUPPORT_MAIL = 'support@headout.com';

export const HEADOUT_BASE_URL = 'https://headout.com';

export const HEADOUT_STUDIO_URL = 'https://www.headout.studio';

export const TOP_CITY_CODES = {
  NEW_YORK: 'new-york',
  LAS_VEGAS: 'las-vegas',
  ROME: 'rome',
  PARIS: 'paris',
  LONDON: 'london',
  DUBAI: 'dubai',
  BARCELONA: 'barcelona',
};

export const FOOTER_LOGO_WIDTH = 144;

export const FOOTER_LOGO_HEIGHT = 44;

export const DOWNLOAD_APP_QR_DIM = 84;

export const CONTACT_LINKS: FooterLink[] = [
  {
    label: strings.FOOTER.HELP_CENTER,
    href: `${HEADOUT_BASE_URL}/${strings.FOOTER.LANGUAGE_CODE}/help/`,
    rel: 'noreferrer noopener',
    icon: HelpIcon,
  },
  {
    label: strings.FOOTER.CHAT_WITH_US,
    href: 'https://secure.livechatinc.com/licence/8339531/v2/open_chat.cgi?groups=0',
    rel: 'noreferrer noopener',
    icon: MessageIcon,
  },
  {
    label: strings.FOOTER.CALL_US,
    href: `tel:${HEADOUT_SUPPORT_LINE}`,
    rel: 'noreferrer noopener',
    icon: PhoneIcon,
  },
  {
    label: HEADOUT_SUPPORT_MAIL,
    href: 'mailto:support@headout.com',
    rel: 'noreferrer noopener',
    icon: MailIcon,
  },
];

export const COMPANY_LINKS: FooterLink[] = [
  {
    label: strings.FOOTER.COMPANY_LINKS.ABOUT_US,
    href: `${HEADOUT_BASE_URL}/about-us/`,
    prefetch: false,
    rel: 'noreferrer noopener',
  },
  {
    label: strings.FOOTER.COMPANY_LINKS.CAREERS,
    href: `${HEADOUT_BASE_URL}/careers/`,
    prefetch: false,
  },
  {
    label: strings.FOOTER.COMPANY_LINKS.PRESS_MEDIA,
    href: `${HEADOUT_BASE_URL}/press/`,
    rel: 'noreferrer noopener',
  },
  {
    label: strings.FOOTER.COMPANY_LINKS.NEWSROOM,
    href: `${HEADOUT_BASE_URL}/newsroom/`,
    prefetch: false,
    rel: 'noreferrer noopener',
  },
  {
    label: strings.FOOTER.COMPANY_LINKS.BLOG,
    href: `${HEADOUT_STUDIO_URL}`,
    prefetch: false,
    rel: 'noreferrer noopener',
  },
  {
    label: strings.FOOTER.COMPANY_LINKS.TRAVEL_BLOG,
    href: `${HEADOUT_BASE_URL}/blog/`,
    prefetch: false,
    rel: 'noreferrer noopener',
  },
];

export const CITY_LINKS: FooterLink[] = [
  {
    label: strings.FOOTER.CITY_LIST.NEW_YORK,
    href: `${HEADOUT_BASE_URL}/${strings.FOOTER.LANGUAGE_CODE}/${strings.FOOTER.CITY_BASE_LINK}-city-${TOP_CITY_CODES.NEW_YORK}`,
    prefetch: false,
    rel: 'noreferrer noopener',
  },
  {
    label: strings.FOOTER.CITY_LIST.LAS_VEGAS,
    href: `${HEADOUT_BASE_URL}/${strings.FOOTER.LANGUAGE_CODE}/${strings.FOOTER.CITY_BASE_LINK}-city-${TOP_CITY_CODES.LAS_VEGAS}`,
    prefetch: false,
    rel: 'noreferrer noopener',
  },
  {
    label: strings.FOOTER.CITY_LIST.ROME,
    href: `${HEADOUT_BASE_URL}/${strings.FOOTER.LANGUAGE_CODE}/${strings.FOOTER.CITY_BASE_LINK}-city-${TOP_CITY_CODES.ROME}`,
    prefetch: false,
    rel: 'noreferrer noopener',
  },
  {
    label: strings.FOOTER.CITY_LIST.PARIS,
    href: `${HEADOUT_BASE_URL}/${strings.FOOTER.LANGUAGE_CODE}/${strings.FOOTER.CITY_BASE_LINK}-city-${TOP_CITY_CODES.PARIS}`,
    prefetch: false,
    rel: 'noreferrer noopener',
  },
  {
    label: strings.FOOTER.CITY_LIST.LONDON,
    href: `${HEADOUT_BASE_URL}/${strings.FOOTER.LANGUAGE_CODE}/${strings.FOOTER.CITY_BASE_LINK}-city-${TOP_CITY_CODES.LONDON}`,
    prefetch: false,
    rel: 'noreferrer noopener',
  },
  {
    label: strings.FOOTER.CITY_LIST.DUBAI,
    href: `${HEADOUT_BASE_URL}/${strings.FOOTER.LANGUAGE_CODE}/${strings.FOOTER.CITY_BASE_LINK}-city-${TOP_CITY_CODES.DUBAI}`,
    prefetch: false,
    rel: 'noreferrer noopener',
  },
  {
    label: strings.FOOTER.CITY_LIST.BARCELONA,
    href: `${HEADOUT_BASE_URL}/${strings.FOOTER.LANGUAGE_CODE}/${strings.FOOTER.CITY_BASE_LINK}-city-${TOP_CITY_CODES.BARCELONA}`,
    prefetch: false,
    rel: 'noreferrer noopener',
  },
  {
    label: strings.FOOTER.CITY_LIST.MORE,
    href: `${HEADOUT_BASE_URL}/${strings.FOOTER.LANGUAGE_CODE}/cities`,
    prefetch: false,
    rel: 'noreferrer noopener',
  },
];

export const SOCIAL_DETAILS = [
  {
    href: SOCIAL_LINKS.PINTEREST_URL,
    icon: Pinterest,
  },
  {
    href: SOCIAL_LINKS.LINKEDIN_URL,
    icon: Linkedin,
  },
  {
    href: SOCIAL_LINKS.YOUTUBE_URL,
    icon: Youtube,
  },
  {
    href: SOCIAL_LINKS.FB_URL,
    icon: Facebook,
  },
  {
    href: SOCIAL_LINKS.TWITTER_URL,
    icon: Twitter,
  },
];
