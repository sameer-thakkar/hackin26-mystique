import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const StyledExpandedMenu = styled.div<{ $isExpanded: boolean }>`
  border-top: 1px solid ${COLORS.GRAY.G6};
  border-bottom: 1px solid ${COLORS.GRAY.G6};
  width: 100%;
  height: 0;
  z-index: 10;
  position: absolute;
  background: ${COLORS.BRAND.WHITE};
  visibility: hidden;
  transition: all 0.2s ease-in-out 0s;
  box-shadow: 0px 5px 8px 0px rgba(0, 0, 0, 0.1);

  ${({ $isExpanded }) =>
    $isExpanded &&
    `
    height: clamp(50vh, 26.5rem, 100%);
    padding: 2rem 0 3rem;
    visibility: visible;
  `}
`;

export const StyledExpandedMenuContainer = styled.div`
  width: calc(100% - (5.46vw * 2));
  max-width: ${SIZES.MAX_WIDTH};
  height: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: 17.625rem 19.625rem 19.625rem auto;

  ul {
    margin: unset;
    padding: unset;
    list-style: none;
  }
`;

const MenuContainerCSS = css`
  border-right: 1px solid ${COLORS.GRAY.G7};
  overflow-y: scroll;

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    width: 1px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${COLORS.GRAY.G4};
  }
`;

const MenuItemCSS = css`
  color: ${COLORS.GRAY.G3};

  &:last-of-type {
    margin-bottom: unset;
  }

  .menu-item {
    display: flex;
    justify-content: space-between;

    svg {
      width: 1rem;
      height: 1rem;
      margin-top: 2px;
      pointer-events: none;
    }

    &:hover {
      color: ${COLORS.BRAND.PURPS};
      svg path,
      svg line {
        stroke: ${COLORS.BRAND.PURPS};
      }
    }
  }
`;

export const StyledParentMenu = styled.div`
  ${MenuContainerCSS}
  padding-right: 1.5rem;

  li {
    ${MenuItemCSS}
    margin-bottom: 1.5rem;
    ${expandFontToken(FONTS.SUBHEADING_LARGE)}
    cursor: pointer;

    .highlighted {
      color: ${COLORS.BRAND.PURPS};
      svg path,
      svg line {
        stroke: ${COLORS.BRAND.PURPS};
      }
    }
  }
`;

export const StyledNestedMenu = styled.div`
  ${MenuContainerCSS}
  padding-left: 1.5rem;

  li {
    ${MenuItemCSS}
    margin-bottom: 1rem;
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}

    .menu-item {
      cursor: pointer;
      padding-right: 1.5rem;
    }

    a {
      color: ${COLORS.GRAY.G3};
      &:hover {
        color: ${COLORS.BRAND.PURPS};
      }
    }
  }

  .empty {
    height: 1.5rem;
  }
`;
