import type { TLanguages } from 'components/Espeon/constants/localisation/types';
// import type {
//   TDescriptorLabels,
//   TDescriptorListVariant,
//   TLongDescriptorTexts,
// } from 'components/Espeon/ProductCard/components/DescriptorList/types';
// import type { TFormattedTourgroupItem } from 'components/Espeon/ProductCard/types';
import type { TClassName } from 'components/Espeon/types';

export type TDescriptorVariant = {
  descriptorVariant: any;
};

export type THorizontalProductCard = {
  tour: any;
  productUrl: string;
  lang: TLanguages;
  isPinnedCard: boolean;
  labels: {
    mainCta: string;
    highlightsMoreDetails: string;
    ratingsNew: string;
    yourPick: string;
    pricing: {
      from: string;
      offPercentage: string;
      cashbackText: string;
    };
    more: string;
    descriptors: any;
    longDescriptorTexts: any;
  };
  productCardPosition: number;
  onCardClick?: React.MouseEventHandler<HTMLDivElement>;
  onCtaClick?: () => void;
  onMoreInfoClick?: React.MouseEventHandler<HTMLButtonElement>;
  onSwiperChange?: (index: number) => void;
  metaLabel?: string;
  showMetaLabel?: boolean;
  overrideDescriptors?: boolean; // temporary solution to override descriptors
  currenciesMap: any;
  onItineraryCTAClick?: React.MouseEventHandler<HTMLButtonElement>;
  showItineraryCTA?: boolean;
};

export type THorizontalProductCardComponent = THorizontalProductCard &
  TClassName;

export type THorizontalProductCardDweb = THorizontalProductCardComponent & {
  lineClampDefault?: number;
  onRatingsClick?: () => void;
  onDescriptorsHover?: (descriptorsLength: number) => void;
};

export type THorizontalProductCardMweb = THorizontalProductCardComponent & {
  onMoreInfoClick?: React.MouseEventHandler<HTMLButtonElement>;
  isDesktop?: boolean;
};
