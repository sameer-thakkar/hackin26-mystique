import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { HALYARD } from 'const/ui-constants';

export const SavingsContainer = styled.div<{ $hasSavings: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;

  transition: transform 300ms ease-in-out 0.6s;
  background: linear-gradient(90deg, #f2fdeb 0%, #e1fad1 100%);
  display: flex;
  align-items: center;
  ${expandFontToken('UI/Label Small (Heavy)')}
  padding: 0.375rem 1.5rem;
  gap: 0.375rem;
  transform: translateY(${({ $hasSavings }) => ($hasSavings ? '-99%' : '0')});
  ${({ $hasSavings }) =>
    $hasSavings && 'box-shadow: 0 -0.125rem 0.75rem 0 #0000000d;'}

  .emoji {
    font-size: 0.875rem;
  }

  p {
    color: ${COLORS.OKAY_GREEN.DARK_TONE};
    margin: 0;
  }
`;

export const TourScratchPrice = styled.div`
  ${expandFontToken('UI/Label Small')}
  text-align: left;
  color: ${COLORS.GRAY.G3};
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  button {
    font-family: ${HALYARD.FONT_STACK};
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.125rem;
    text-align: left;
    letter-spacing: 0 !important;
    white-space: normal;
    text-align: center;
    }
  }
`;

export const PriceElements = styled.div<{
  $hasSavings: boolean;
  $isModifiedCTA?: boolean;
}>`
  background: ${COLORS.BRAND.WHITE};
  justify: space-between;
  ${({ $hasSavings }) =>
    !$hasSavings && 'box-shadow: 0 -0.125rem 0.75rem 0 #0000000d;'}
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem 1rem 1.5rem;
  box-sizing: border-box;
  z-index: 10;
  position: relative;
  ${({ $isModifiedCTA }) =>
    $isModifiedCTA &&
    css`
      display: grid;
      grid-template-columns: auto 10.125rem;
      ${ButtonWrapper} {
        button {
          ${expandFontToken(FONTS.BUTTON_MEDIUM)}
          font-family: ${HALYARD.DISPLAY};
        }
      }
    `}
`;

export const PriceBar = styled.div<{
  $hasSavings: boolean;
  $showContent: boolean;
  $hasDropShadow?: boolean;
}>`
  position: fixed;
  background: ${COLORS.BRAND.WHITE};
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 51;
  box-sizing: border-box;
  ${({ $hasDropShadow }) =>
    $hasDropShadow &&
    css`
      box-shadow: 0px -2px 12px 0px #0000001a;
    `}

  transform: translateY(
    ${({ $showContent }) => (!$showContent ? '100%' : '0')}
  );
  transition: transform 300ms cubic-bezier(0, 0, 0.3, 1) 10ms;

  .strike {
    text-decoration: line-through;
  }

  .tour-price {
    ${expandFontToken('Heading/Small')}
    span {
      color: ${({ $hasSavings }) =>
        $hasSavings ? COLORS.OKAY_GREEN.DARK_TONE : COLORS.GRAY.G1};
    }
  }
`;

export const SavingsStrip = styled.div`
  display: grid;
  grid-template-columns: 0.875rem auto;
  padding: 0.375rem 1rem;
  gap: 0.375rem;
  background: ${COLORS.BACKGROUND.FADED_GREEN};
  color: ${COLORS.TEXT.OKAY_GREEN_3};
  ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
`;
