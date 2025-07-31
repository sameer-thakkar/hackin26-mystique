import { SocialDetail } from 'UI/Footer/interface';
import Facebook from 'assets/facebook';
import Instagram from 'assets/instagram';
import Linkedin from 'assets/linkedin';
import Twitter from 'assets/twitter';
import Youtube from 'assets/youtube';

export const PAYMENT_CARD_ICONS = {
  VISA: 'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/Visa.svg',
  MASTERCARD:
    'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/MasterCard.svg',
  AMEX: 'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/AmexCard.svg',
  PAYPAL:
    'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/PayPalLight.svg',
  MAESTROCARD:
    'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/MaestroCard.svg',
  APPLEPAY:
    'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/ApplePay.svg',
  GPAY: 'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/GPay.svg',
  DISCOVER:
    'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/DiscoverCard.svg',
  DINERS:
    'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/DinerClub.svg',
  IDEAL:
    'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/IDealCard.svg',
  FPX: 'https://cdn-imgix-open.headout.com/headout-connect/payment-methods/FPXLight.svg',
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
  'Headout Inc, 82 Nassau St #60351 New York, NY 10038';

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

export const HEADOUT_MAIL_REDIRECT = 'mailto:support@headout.com';

export const HEADOUT_BASE_URL = 'https://headout.com';

export const HEADOUT_STUDIO_URL = 'https://www.headout.studio';

export const FOOTER_LOGO_WIDTH = 144;

export const FOOTER_LOGO_HEIGHT = 44;

export const DOWNLOAD_APP_QR_DIM = 84;

export const LIVE_CHAT_LINK =
  'https://static.zdassets.com/web_widget/latest/liveChat.html?v=10#key=headout.zendesk.com';

export const COMPANY_DETAILS_LINK = '/company-details/';

export const PRIVACY_POLICY_LINK = '/privacy-policy/';

export const CANCELLATION_POLICY_LINK = '/cancellation-policy/';

export const TERMS_LINK = '/terms/';

export const SOCIAL_DETAILS: SocialDetail[] = [
  {
    href: SOCIAL_LINKS.LINKEDIN_URL,
    icon: Linkedin,
    id: 'LINKEDIN',
  },
  {
    href: SOCIAL_LINKS.INSTAGRAM_HEADOUT_URL,
    icon: Instagram,
    id: 'INSTAGRAM',
  },
  {
    href: SOCIAL_LINKS.YOUTUBE_URL,
    icon: Youtube,
    id: 'YOUTUBE',
  },
  {
    href: SOCIAL_LINKS.FB_URL,
    icon: Facebook,
    id: 'FACEBOOK',
  },
  {
    href: SOCIAL_LINKS.TWITTER_URL,
    icon: Twitter,
    id: 'TWITTER',
  },
];
