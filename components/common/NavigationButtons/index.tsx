import React from 'react';
import { strings } from 'const/strings';
import { LeftArrowSvg } from 'assets/leftArrowSvg';
import { RightArrowSvg } from 'assets/rightArrowSvg';
import type { TNavigationButtonProps } from './interface';
import {
  StyledArrowButtonContainer,
  StyledNavigationArrowsContainer,
} from './styles';

const NavigationButtons = ({
  showLeftArrow,
  showRightArrow,
  prevSlide,
  nextSlide,
  buttonSize = 'small',
}: TNavigationButtonProps) => {
  return (
    <StyledNavigationArrowsContainer>
      <StyledArrowButtonContainer
        $size={buttonSize}
        disabled={!showLeftArrow}
        onClick={prevSlide}
        aria-label={strings.PREVIOUS}
        aria-disabled={!showLeftArrow}
      >
        <LeftArrowSvg />
      </StyledArrowButtonContainer>
      <StyledArrowButtonContainer
        $size={buttonSize}
        disabled={!showRightArrow}
        onClick={nextSlide}
        aria-label={strings.NEXT}
        aria-disabled={!showRightArrow}
      >
        <RightArrowSvg />
      </StyledArrowButtonContainer>
    </StyledNavigationArrowsContainer>
  );
};

export default NavigationButtons;
