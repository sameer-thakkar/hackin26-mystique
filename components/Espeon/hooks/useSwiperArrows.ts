import { useCallback, useState } from 'react';
import type { TSwiperSlideChangedCbProps } from 'components/Espeon/Common/CustomSwiper/types';

export const useSwiperArrows = (): {
  showLeftArrow: boolean;
  showRightArrow: boolean;
  activeIndex: number;
  onSlideChanged: (args: TSwiperSlideChangedCbProps) => void;
} => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const onSlideChanged = useCallback(
    ({
      isLeftArrowEnabled,
      isRightArrowEnabled,
      index,
    }: TSwiperSlideChangedCbProps) => {
      setShowLeftArrow(isLeftArrowEnabled);
      setShowRightArrow(isRightArrowEnabled);
      index !== undefined && setActiveIndex(index);
    },
    []
  );

  return {
    showLeftArrow,
    showRightArrow,
    activeIndex,
    onSlideChanged,
  };
};
