export type TNavigationButtonProps = {
  showLeftArrow: boolean;
  showRightArrow: boolean;
  prevSlide?: () => void;
  nextSlide?: () => void;
  buttonSize?: TButtonSize;
};

export type TButtonSize = 'small' | 'large';
