import type { SystemStyleObject } from '@headout/pixie/types';

export type TNavigationButtonProps = {
  showLeftArrow: boolean;
  showRightArrow: boolean;
  prevSlide?: () => void;
  nextSlide?: () => void;
  overrideStyles?: Record<string, SystemStyleObject>;
  size?: 'small' | 'medium' | 'large';
};
