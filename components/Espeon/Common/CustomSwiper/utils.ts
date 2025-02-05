import { DATA_INDEX_ATTRIBUTE, DIRECTIONS } from './constants';
import type {
  TGetDynamicStyles,
  TGetSlidesWrapperDynamicStyles,
  TSwiperDirection,
} from './types';

const { FORWARD, BACKWARD } = DIRECTIONS;

export const getSlideIndex = (slideElement: Element): number => {
  return +(slideElement.getAttribute(DATA_INDEX_ATTRIBUTE) || 0);
};
export const getDirection = (
  oldIndex: number,
  newIndex: number
): TSwiperDirection => {
  return (newIndex === oldIndex && newIndex === 0) ||
    (Math.abs(newIndex - oldIndex) <= 1 && newIndex > oldIndex)
    ? FORWARD
    : BACKWARD;
};

export const wheelListener = (e: MouseEvent) => {
  e.preventDefault();
};

export const getSlidesWrapperDynamicStyles = ({
  edgeCompensation,
  isMobile,
  isVariable = false,
}: TGetSlidesWrapperDynamicStyles) => {
  if (isMobile || isVariable) {
    return {};
  } else {
    return {
      width: `calc(100% + ${edgeCompensation * 2}rem)`,
      transform: `translateX(-${edgeCompensation}rem)`,
    };
  }
};

export const getSlideDynamicStyles = ({
  slidesToShow,
  slideWidth,
}: TGetDynamicStyles) => {
  if (slideWidth === 'variable') {
    return { width: 'max-content', minWidth: 'max-content' };
  }
  return {
    minWidth: `calc(${100 / slidesToShow}%)`,
    maxWidth: `calc(${100 / slidesToShow}%)`,
    width: `calc(${100 / slidesToShow}%)`,
  };
};
