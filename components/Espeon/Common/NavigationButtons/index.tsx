import React from 'react';
import { Button } from '@headout/eevee';
import { css } from '@headout/pixie/css';
import LeftArrow from 'components/Espeon/Assets/LeftArrow';
import RightArrow from 'components/Espeon/Assets/RightArrow';
import { navigationButtonsStylesRecipe } from './styles';
import type { TNavigationButtonProps } from './types';

export const NavigationButtons = ({
  showLeftArrow,
  showRightArrow,
  prevSlide,
  nextSlide,
  overrideStyles,
  size = 'small',
}: TNavigationButtonProps) => {
  const styles = navigationButtonsStylesRecipe.raw();

  return (
    <div className={css(styles.container, overrideStyles?.container)}>
      <Button
        as="button"
        btnType="black"
        icon={<LeftArrow />}
        iconPosition="leading"
        onClick={prevSlide}
        primaryText=""
        size={size}
        state={showLeftArrow ? 'default' : 'disabled'}
        variant="secondary"
        aria-label="prev"
        className={css(styles.arrowButton, overrideStyles?.arrowButton)}
      />
      <Button
        as="button"
        btnType="black"
        icon={<RightArrow />}
        iconPosition="leading"
        onClick={nextSlide}
        primaryText=""
        size={size}
        state={showRightArrow ? 'default' : 'disabled'}
        variant="secondary"
        aria-label="next"
        className={css(styles.arrowButton, overrideStyles?.arrowButton)}
      />
    </div>
  );
};
