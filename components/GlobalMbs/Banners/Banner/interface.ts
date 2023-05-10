import type { ILink } from 'components/GlobalMbs/Breadcrumb/interface';

export enum BannerLayout {
  fullWidth = 'full-width',
  large = 'large',
  small = 'small',
}
export interface IGlobalBannerImage {
  url?: string;
  copyright?: string;
  altText?: string;
}

export interface IBannerProps {
  title: string;
  images: IGlobalBannerImage[];
  cardType: BannerLayout;
  subText?: string;
  breadcrumbs?: ILink[];
  collection?: any;
  startingPrice?: string;
  isTicketPage?: boolean;
  subHeading?: string;
  availableTours?: Array<number>;
}

export interface IStyledBanner {
  isTicketPage: boolean;
  isMobile: boolean;
  cardType: 'full-width' | 'large' | 'small';
}
