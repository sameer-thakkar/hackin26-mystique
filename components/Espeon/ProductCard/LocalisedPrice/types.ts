import type { RecipeVariantProps } from '@headout/pixie/types';
import type { TLanguages } from 'components/Espeon/constants/localisation/types';
import type {
  TClassName,
  // TCurrency,
  // TCurrencyCode,
} from 'components/Espeon/types';
import type { localisedPriceStyles } from './styles';

export type TLocalisedPrice = TClassName & {
  currencyCode: any;
  lang: TLanguages;
  price: number;
  currencyList: Array<any>;
  prefix?: string;
  truncateIfLong?: boolean;
  truncateAfter?: number;
  variant: RecipeVariantProps<typeof localisedPriceStyles>;
};
