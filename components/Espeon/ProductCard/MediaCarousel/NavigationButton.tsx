import React from 'react';
import ChevronLeftCircle from 'components/Espeon/Assets/ChevronLeftCircle';
import { controlButtonStyles } from 'components/Espeon/ProductCard/MediaCarousel/styles';
import type { TNavigationButton } from 'components/Espeon/ProductCard/MediaCarousel/types';

const NavigationButton = ({
  ariaLabel,
  onClick,
  position,
}: TNavigationButton) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={controlButtonStyles({ position })}
      onClick={onClick}
    >
      <ChevronLeftCircle height={36} width={36} />
    </button>
  );
};

export default NavigationButton;
