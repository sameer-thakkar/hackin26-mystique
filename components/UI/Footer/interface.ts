import { SliceZoneLike } from '@prismicio/react';

export type FooterProps = {
  linksTitle?: string;
  currentLanguage?: string;
  attraction?: string;
  logoURL: string;
  logoAlt: string;
  hasPoweredByHeadoutLogo: boolean;
  disclaimerText: string;
  slices?: SliceZoneLike;
  themeOverride?: string;
  secondarySlices?: Array<any>;
  secondaryHeading?: string;
  primaryHeading?: string;
  isEntertainmentMb?: boolean;
  isCatOrSubCatPage?: boolean;
  showGmapsDisclaimer?: boolean;
  isDark?: boolean;
  isLTT?: boolean;
  isDarkPurps?: boolean;
  footerRef?: React.RefObject<HTMLDivElement>;
};

export type TLinkSlices = {
  linksTitle: string;
  slices: SliceZoneLike;
  theme: string | null;
  className?: string;
  isCatOrSubCatPage: boolean;
};

export type FooterLink = {
  href: string;
  label: string;
  prefetch?: boolean;
  rel?: string;
  as?: string;
  icon?: JSX.Element;
};

export type SocialDetail = {
  href: string;
  icon: JSX.Element;
  id: string;
};
