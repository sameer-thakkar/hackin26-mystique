import type { TNavigationButtonProps } from 'components/common/NavigationButtons/interface';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import LeftArrowFilledSvg from 'assets/leftArrowFilledSvg';
import RightArrowFilledSvg from 'assets/rightArrowFilledSvg';
import {
  StyledSubStopArrowButtonContainer,
  StyledSubStopNavigationArrowsContainer,
} from './styles';

const SubStopSwiperNavigationButtons = ({
  showLeftArrow,
  showRightArrow,
  prevSlide,
  nextSlide,
}: TNavigationButtonProps) => {
  return (
    <StyledSubStopNavigationArrowsContainer>
      <StyledSubStopArrowButtonContainer
        disabled={!showLeftArrow}
        onClick={prevSlide}
        aria-label={strings.PREVIOUS}
        aria-disabled={!showLeftArrow}
      >
        <LeftArrowFilledSvg svgFill={COLORS.BRAND.WHITE} />
      </StyledSubStopArrowButtonContainer>
      <StyledSubStopArrowButtonContainer
        disabled={!showRightArrow}
        onClick={nextSlide}
        aria-label={strings.NEXT}
        aria-disabled={!showRightArrow}
      >
        <RightArrowFilledSvg svgFill={COLORS.BRAND.WHITE} />
      </StyledSubStopArrowButtonContainer>
    </StyledSubStopNavigationArrowsContainer>
  );
};

export default SubStopSwiperNavigationButtons;
