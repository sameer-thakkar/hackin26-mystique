import type { MutableRefObject } from 'react';
import type { RecipeVariantProps } from '@headout/pixie/types';
import type { DIRECTIONS } from './constants';
import type { container, slidesWrapper } from './styles';

export type TSwiperRefActions = {
  nextSlide: () => void;
  prevSlide: () => void;
  scrollToSlide?: (index: number) => void;
};

export type TSwiperSlideChangedCbProps = {
  index?: number;
  isLeftArrowEnabled: boolean;
  isRightArrowEnabled: boolean;
  isScrollCustom?: boolean | null;
};

export enum ESlideWidth {
  Variable = 'variable',
}

export enum ESwiperNextPrevControls {
  Show = 'show',
  ShowOnHover = 'show-on-hover',
  Hide = 'hide',
}

export enum ESwiperNextPrevPosX {
  Edge = 'edge',
}

export enum ESwiperNextPrevSize {
  Small = 'small',
  Medium = 'medium',
}

export type TSwiperProps = {
  /** Number of slide to show.*/
  slidesToShow?: number;
  /** Should be equal to margin provided to the individual card (margin: '0 1rem' => edgeCompensation: 1 ). used to align carousel on either edges */
  edgeCompensation?: number;
  blurWidthInPx?: number;
  showBlurNearEdges?: boolean;
  slideWidth?: ESlideWidth;
  slidesToScrollBy?: number;
  rtlEnabled?: boolean;
  loop?: boolean;
  pauseAutoPlayOnHover?: boolean;
  autoPlay?: boolean;
  autoPlayTimeMs?: number;
  onSlideChanged?: (props: TSwiperSlideChangedCbProps) => void;
  nextPrevControls?: ESwiperNextPrevControls;
  nextPrevControlPosX?: ESwiperNextPrevPosX | string;
  nextPrevControlPosY?: string;
  nextPrevControlSize?: ESwiperNextPrevSize;
  paginationDots?: boolean;
  /** pass swiperRef to enable outside control buttons  */
  swiperRef?: MutableRefObject<TSwiperRefActions | null>;
  children: React.ReactNode[];
  beforeChangeCallback?: (index: number) => void;
  allowLoopOnMobile?: boolean;
  variant?: RecipeVariantProps<typeof container>;
  mWebSideGapVariant?: RecipeVariantProps<typeof slidesWrapper>;
  isMobile: boolean;
};

export type TGetSlidesWrapperDynamicStyles = {
  edgeCompensation: number;
  isMobile: boolean;
  isVariable: boolean;
};

export type TSwiperDirection = (typeof DIRECTIONS)[keyof typeof DIRECTIONS];

export type TGetDynamicStyles = {
  slidesToShow: number;
  slideWidth?: ESlideWidth;
};
