import { SwiperProps } from 'swiper/react';

export type VariantCarouselProps = {
  isMobile: boolean;
  swiperParams: SwiperProps;
  variants: Record<string, any>;
  tgid: number | string;
  tourGroupName: string;
  currency: string | null;
  isSingleVariant: boolean;
};

//NOTE: Will modify this accordingly once we start consuming data from the API
