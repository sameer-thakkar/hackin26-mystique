import type { RecipeVariantProps } from '@headout/pixie/types';
import type { TLanguages } from 'components/Espeon/constants/localisation/types';
import type {
  TClassName,
  TCurrency,
  TListingPrice,
} from 'components/Espeon/types';
import type { priceBlockStyles } from './styles';

export type TPriceBlock = TClassName & {
  lang: TLanguages;
  listingPrice: TListingPrice;
  labels: {
    from: string;
    offPercentage: string;
    cashbackText: string;
  };
  currencyList: TCurrency[];
  isSportsExperiment?: boolean;
  showSavings?: boolean;
  showScratchPrice?: boolean;
  prefix?: boolean;
  save?: number;
  showCashback?: boolean;
  showCashbackBlock?: boolean;
  isShowPage?: boolean;
  id?: number;
  isLoading?: boolean;
  isMobile?: boolean;
  showDummyScratchPrice?: boolean;
  uid?: string;
  variant?: RecipeVariantProps<typeof priceBlockStyles>;
  showNewDiscountTag?: boolean;
  showAngledTag?: boolean;
  shouldPointLeft?: boolean;
};
