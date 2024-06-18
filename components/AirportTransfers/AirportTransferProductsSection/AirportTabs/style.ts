import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Tab = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  padding: 0 0 0.75rem 0;
  display: block;
  position: relative; // Make the Tab position relative
  border-bottom: ${({ isActive }) =>
    isActive ? `2px solid ${COLORS.BRAND.PURPS}` : 'none'};
  z-index: 2; // Ensure Tab's border is above the TabContainer

  height: 100%;
  box-sizing: border-box;

  cursor: pointer;

  color: ${({ isActive }) => (isActive ? COLORS.BRAND.PURPS : COLORS.GRAY.G3)};

  white-space: nowrap;

  ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};

  &:focus {
    outline: none;
  }

  @media (min-width: 769px) {
    ${expandFontToken(FONTS.HEADING_SMALL)};
  }
`;

export const TabsContainer = styled.div<{
  $hasCategoryHeaderMenuOnTop: boolean;
}>`
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  margin-inline: -1rem;
  margin-top: -0.375rem;

  border-bottom: 1px solid ${COLORS.GRAY.G6};
  padding-inline: 1rem;
  padding-top: 0.875rem;

  ::-webkit-scrollbar {
    display: none;
  }

  position: sticky;
  top: ${({ $hasCategoryHeaderMenuOnTop }) =>
    !$hasCategoryHeaderMenuOnTop ? '0' : '56px'};
  background-color: white;
  z-index: 1;

  &.sticky {
    max-width: 100dvw;
    background-color: white;
    box-shadow: 0px 3px 8px -2px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 769px) {
    margin-top: -0.75rem;
    padding-top: 1.25rem;
    top: ${({ $hasCategoryHeaderMenuOnTop }) =>
      !$hasCategoryHeaderMenuOnTop ? '0' : '44px'};
    margin-inline: 0;
    padding-inline: 0;
    gap: 2rem;

    &.sticky {
      box-shadow: 0px 3px 8px -2px #0000001a;
    }
  }
`;
