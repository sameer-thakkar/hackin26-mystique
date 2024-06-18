import { useState } from 'react';
import { Swiper as TSwiper } from 'swiper/types';

export const useSwiperArrows = (): {
  showLeftArrow: boolean;
  showRightArrow: boolean;
  onSlideChange: (swiper: TSwiper) => void;
} => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const onSlideChange = (swiper: TSwiper) => {
    setShowLeftArrow(!swiper.isBeginning);
    setShowRightArrow(!swiper.isEnd);
  };

  return {
    showLeftArrow,
    showRightArrow,
    onSlideChange,
  };
};
