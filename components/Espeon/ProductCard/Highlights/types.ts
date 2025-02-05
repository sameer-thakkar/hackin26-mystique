import type { RecipeVariant } from '@headout/pixie/types';
import type { TClassName } from 'components/Espeon/types';
import type { highlightsStyle } from './styles';

type THighlightVariant = {
  variant?: RecipeVariant<typeof highlightsStyle>;
};

export type THighlights = TClassName &
  THighlightVariant & {
    highlights: string;
  };

export type THighlightsList = THighlightVariant & {
  highlights: Array<string>;
};
