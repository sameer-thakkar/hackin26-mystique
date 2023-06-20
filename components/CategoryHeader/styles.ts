import styled from 'styled-components';
import { expandFontToken } from 'const/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { SIZES } from 'const/ui-constants';

export const StyledCategoryHeader = styled.div`
  border-bottom: 1px solid ${COLORS.GRAY.G6};

  @media (max-width: 768px) {
    border: none;
    border-top: 1px solid ${COLORS.GRAY.G6};
  }
`;

export const StyledCategoryHeaderContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
  width: calc(100% - (5.46vw * 2));
  max-width: ${SIZES.MAX_WIDTH};
  margin: auto;

  @media (max-width: 768px) {
    grid-auto-flow: row;
    grid-auto-columns: unset;
    width: 100%;
    max-width: unset;
    margin: 1rem 0 4rem;

    .copyright-container {
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: 0.5rem 0 2rem;
      background-color: ${COLORS.BRAND.WHITE};
    }
  }
`;

export const StyledMainMenuItems = styled.div<{
  $isExpanded: boolean;
  $isMobile: boolean;
}>`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  padding: 0.75rem 0.938rem;
  color: ${COLORS.GRAY.G3};
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
  cursor: pointer;

  svg {
      width: 1rem;
      height: 1rem;
      position: relative;
      top: 1.75px;
      margin-right: 0.5rem;
      pointer-events: none;
    }


  &:hover {
    color: ${COLORS.BRAND.PURPS};
    svg path, 
    svg line {
        stroke: ${COLORS.BRAND.PURPS};
      }
  }

  :first-of-type {
    padding-left: unset;
  }

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    width: auto;
    padding: 1.125rem 1.125rem 1.125rem 1rem;
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.SUBHEADING_LARGE)}
    border-bottom: 0.5px solid ${COLORS.GRAY.G6};

    &:hover {
    color: unset;
    svg path, 
    svg line {
        stroke: ${COLORS.GRAY.G3}};
      }
    }

    ${({ $isMobile }) =>
      $isMobile &&
      `
      :first-of-type {  
        padding-left: 1rem;
      }

      &.last {
        margin-bottom: 5rem;
      }

      svg {
        width: 1rem;
        height: 1rem;
        margin-top: 4px;
        pointer-events: none;
        transition: all 0.2s ease-in-out 0s;
      }
      `}

    &.active {
      ${({ $isExpanded, $isMobile }) =>
        $isExpanded &&
        $isMobile &&
        `
        &.last {
          margin-bottom: unset;
        }

        svg {
          transform: rotate(90deg);
        }
      `} 
    }
`;

export const StyledNestedMenuWrapper = styled.div<{ $isVisible?: boolean }>`
  display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
`;

export const StyledDeepNestedMenuWrapper = styled.div<{ $isVisible?: boolean }>`
  display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
`;
