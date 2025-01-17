import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledDeepNestedMenuContainer = styled.ul`
  @media (max-width: 767px) {
    margin: unset;
    padding: unset;

    li {
      padding: 0.875rem 3rem;
      color: ${COLORS.GRAY.G2};
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
      border-bottom: 0.5px solid ${COLORS.GRAY.G6};

      &.main-menu-wrapper {
        display: flex;
        justify-content: space-between;
        padding: 0 0.125rem 0 1rem;
        border: none;

        .main-menu-label {
          margin: auto 0;
          padding: 1.125rem 0;
          ${expandFontToken(FONTS.SUBHEADING_LARGE)}
        }
        .main-menu {
          margin: auto 0;
          padding: 1.125rem 1rem;
          ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)}
          color: ${COLORS.GRAY.G4A};
        }
      }

      &.back-to-main-menu {
        padding: 0.875rem 1.25rem;
        ${expandFontToken(FONTS.SUBHEADING_LARGE)}
        background-color: ${COLORS.GRAY.G8};
        border: none;

        svg {
          position: relative;
          top: 2px;
          width: 1rem;
          height: 1rem;
          margin-right: 0.5rem;
          pointer-events: none;
        }
      }

      &:last-of-type {
        border-bottom: none;
      }
    }
  }
`;

export const StyledDeepNestedMenuItem = styled.li<{ $isSelected?: boolean }>`
  display: ${({ $isSelected }) => ($isSelected ? 'block' : 'none')};
`;
