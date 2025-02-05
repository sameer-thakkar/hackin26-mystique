import type { RecipeVariantProps } from '@headout/pixie/types';
import type { TLanguages } from 'components/Espeon/constants/localisation/types';
// import type { TDescriptorCodes } from 'components/Espeon/ProductCard/components/Descriptor/types';
// import type {
//   ETourGroupRankedDescriptorType,
//   TFormattedTourgroupItem,
//   TTourGroupRankedDescriptor,
// } from 'components/Espeon/ProductCard/types';
import type { TClassName } from 'components/Espeon/types';
import type { descriptorListStyles } from './styles';

export type TLongDescriptorTexts = {
  FREE_CANCELLATION_HOURS: string;
  FREE_CANCELLATION_DAYS: string;
  EXTENDED_VALIDITY: string;
  FLEXIBLE_DURATION: string;
};

export type TDescriptorLabels = {
  FREE_CANCELLATION: string;
  EXTENDED_VALIDITY: string;
  INSTANT_CONFIRMATION: string;
  MOBILE_TICKET: string;
  DURATION: string;
  FLEXIBLE_DURATION: string;
  FLEXIBLE_DURATION_LABEL: string;
  AUDIO_GUIDE: string;
  GUIDED_TOUR: string;
  TRANSFERS: string;
  HOTEL_PICKUP: string;
  MEALS_INCLUDED: string;
};

export type TDescriptorListVariant = RecipeVariantProps<
  typeof descriptorListStyles
>;

export type TDescriptorList = TClassName & {
  tour: any;
  descriptorCodes: any;
  longDescriptorTexts: any;
  descriptorLabels: any;
  totalCount: number;
  moreLabel: string;
  variant: TDescriptorListVariant;
  lang: TLanguages;
  minDuration: number | null;
  maxDuration: number | null;
  showIcon?: boolean;
  onDescriptorsHover?: (descriptorsLength: number) => void;
  showMoreLabel?: boolean;
  isMobile?: boolean;
  showSpacer?: boolean;
  rankedDescriptors?: Record<any, { items: Omit<any, 'type'>[] }>;
};
