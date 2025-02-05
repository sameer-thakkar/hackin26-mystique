import type { MouseEventHandler } from 'react';
import type { RecipeVariantProps } from '@headout/pixie/types';
import type { TClassName } from 'components/Espeon/types';
import type { mediaCarouselWrapper } from './styles';

export type TMediaCarouselVariants = RecipeVariantProps<
  typeof mediaCarouselWrapper
>;

export type TProductMediaCarousel = TClassName & {
  images: any;
  variant: TMediaCarouselVariants;
  isMobile: boolean;
  productCardPosition: number;
  onSwiperChange?: (index: number) => void;
  width?: number;
  height?: number;
  aspectRatio?: string;
};

export type TNavigationButton = {
  onClick: MouseEventHandler;
  ariaLabel: string;
  position: 'left' | 'right';
};
