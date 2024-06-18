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
}: TNavigationButtonProps) => {
  return (
    <StyledNavigationArrowsContainer>
      <StyledArrowButtonContainer
        disabled={!showLeftArrow}
        onClick={prevSlide}
        aria-label={strings.PREVIOUS}
        aria-disabled={!showLeftArrow}
      >
        <LeftArrowSvg />
      </StyledArrowButtonContainer>
      <StyledArrowButtonContainer
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
