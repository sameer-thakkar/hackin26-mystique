export type StructuredCardProps = {
  introText?: Record<string, string>;
  outroText?: Record<string, any>;
  cardImageUrl?: Record<string, any>;
  altText?: string;
  timings?: string;
  frequency?: string;
  duration?: string;
  ctaText?: string;
  ctaUrl?: Record<string, any>;
  isMobile?: boolean;
  activeTabIndex?: number;
};
