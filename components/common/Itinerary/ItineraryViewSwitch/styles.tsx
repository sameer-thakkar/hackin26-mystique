import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

const initialToggleSliderStyles = css`
  transform: translateX(0);
`;

const finalToggleSliderStyles = css`
  transform: translateX(calc(100% - 2px));
`;

export const StyledToggleSwitch = styled.div<{ $isChecked: boolean }>`
  position: relative;
  width: 2.625rem;
  height: 1.5rem;
  border-radius: 66.67px;
  background-color: ${({ $isChecked }) =>
    $isChecked ? COLORS.BRAND.PURPS : COLORS.GRAY.G2};

  .input-element {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    cursor: pointer;
  }

  .slider {
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    background-color: ${COLORS.BRAND.WHITE};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.6s cubic-bezier(0.7, 0, 0.3, 1);
    top: 2px;
    left: 2px;
    bottom: 2px;
    ${({ $isChecked }) =>
      $isChecked ? finalToggleSliderStyles : initialToggleSliderStyles};
  }

  .icon-container {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    svg {
      height: 0.75rem;
      width: 0.75rem;
    }
  }
`;

export const StyledItineraryViewSwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  .label {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
    color: ${COLORS.GRAY.G2};

    &.timeline {
      padding-right: 0.1875rem; // prevent layout shift
    }

    &.map {
      padding-left: 0.1875rem; // prevent layout shift
    }

    &.active {
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};

      &.timeline {
        padding-right: 0;
      }

      &.map {
        padding-left: 0;
      }
    }

    &.timeline {
      padding-right: 2px;
    }
  }
`;
