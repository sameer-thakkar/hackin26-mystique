import styled from 'styled-components';
import COLORS from 'const/colors';
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

export const PriceElements = styled.div<{ $hasSavings: boolean }>`
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
`;

export const ButtonWrapper = styled.div<{ $width: number }>`
  ${({ $width }) => $width && `width: ${$width / 16}rem;`}
  button {
    ${({ $width }) =>
      $width >= 182 &&
      ` font-family: ${HALYARD.DISPLAY};
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1.125rem;
        letter-spacing: 0.038rem;
        text-align: left;
        white-space: normal;
        max-width: 11.375rem;
        text-align: center;
    `}
  }
  max-width: 182px;
`;

export const PriceBar = styled.div<{
  $hasSavings: boolean;
  $showContent: boolean;
}>`
  position: fixed;
  background: ${COLORS.BRAND.WHITE};
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 51;
  box-sizing: border-box;

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
