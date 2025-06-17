import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const CategoryWrapper = styled.div<{
  $isActive: boolean;
  $showGridUI: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: auto;
  height: min-content;
  padding: 0.38rem 0.75rem 0.44rem 0.5rem;
  border: 1px solid ${COLORS.GRAY.G6};
  box-sizing: border-box;
  border-radius: 0.5rem;
  margin-right: 1rem;
  cursor: pointer;
  transition: ease 0.2s;
  background-color: ${COLORS.BRAND.WHITE};

  ${({ $isActive }) =>
    $isActive &&
    `
      background-color: ${COLORS.PURPS.LIGHT_TONE_4};
      border-color: ${COLORS.PURPS.LEVEL_15};
    `}

  .icon {
    width: 1.75rem;
    height: 1.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: ease 0.4s;
    margin-right: 0.25rem;
    svg {
      width: 1.16669rem;
      height: 1.16669rem;
    }
  }
  .name {
    ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)};
    color: ${COLORS.GRAY.G2};
    transition: ease 0.4s;
    text-align: center;
    ${({ $isActive }) =>
      $isActive &&
      `
      color: ${COLORS.TEXT.PURPS_3};
      background-color: ${COLORS.PURPS.LIGHT_TONE_4};
    `}
  }

  @media (min-width: 768px) {
    ${({ $isActive }) =>
      !$isActive &&
      `
      &:hover {
        background-color: #fafafa;
        .icon {
          &, svg {
            transform: scale(1.0357)
          }
        }
      }
      `}
  }

  @media (max-width: 768px) {
    ${({ $showGridUI }) =>
      $showGridUI
        ? `
      border: none;
      height: 2.75rem;
      width: max-content;
      padding: 0.625rem 0.875rem 0.625rem 0.625rem;
      margin: 0;
      background: ${COLORS.BRAND.WHITE};
      .icon,
      svg {
        height: 1.5rem;
        width: 1.5rem;
      }
      .icon {
        margin-right: 0.375rem;
      }
      border: 1px solid ${COLORS.PURPS.LIGHT_TONE_4};
    `
        : `
     width: min-content;
     padding: 0.38rem 0.75rem 0.38rem 0.5rem;
     
     &:first-child {
       margin-left: 1.5rem;
     }
     &:last-child {
       margin-right: 1.5rem;
     }
     .icon {
       height: 1.5rem;
       width: 1.5rem;
       margin-right: 0.12rem;
       svg {
         height: 1rem;
         width: 1rem;
       }
     }
     .name {
       width: max-content;
     }
    `}
    flex-direction: row;
    align-items: center;
    border-radius: 0.375rem;

    .name {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
      margin-top: 0;
    }
  }
`;

const gridUiCategoriesSectionCss = css`
  position: relative;
  border-radius: 4px;
  background-color: #f8f6ff;
  padding: 1.5rem 0 1.75rem;

  p {
    ${expandFontToken(FONTS.HEADING_SMALL)};
    margin-bottom: 0.75rem;
  }
  display: flex;
  flex-direction: column;
  .row-wrapper {
    display: flex;
    flex-direction: column;
    padding: 0 1.5rem;
    width: calc(100vw - 3rem);
    scrollbar-width: none;
    overflow: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    .row-one,
    .row-two {
      display: flex;
      flex-direction: row;
      grid-column-gap: 0.75rem;
      width: max-content;
      ${CategoryWrapper} {
        .name {
          width: max-content;
        }
      }
    }
    .row-one {
      margin-bottom: 0.75rem;
    }
  }
`;

const nonGridUiCategoriesSection = css`
  position: sticky;
  top: 3.8125rem;
  z-index: 12;
  padding: 0.75rem 0rem;
  background: ${COLORS.BRAND.WHITE};

  .categories {
    width: 100%;
    overflow: scroll;
    scroll-behavior: smooth;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .categories::after {
    content: '';
    display: block;
    min-width: 0.75rem;
  }
`;

export const CategoriesSection = styled.div<{ $showGridUI: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding: 1.25rem 0;

  ${({ $showGridUI }) =>
    $showGridUI &&
    `
      .browse-by-category-title {
        color: ${COLORS.GRAY.G2};
        ${expandFontToken(FONTS.HEADING_SMALL)};
        margin-bottom: 0.75rem;
        margin-left: 1.5rem;  
      }
    `}

  p {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
    color: ${COLORS.GRAY.G2};
    margin-bottom: 1.5rem;
    margin-top: 0;
  }

  .categories {
    display: flex;
  }

  @media (min-width: 768px) {
    position: sticky;
    top: 5rem;
    z-index: 12;
    background-color: ${COLORS.BRAND.WHITE};
    width: 100%;
    align-items: center;
    justify-content: center;

    .categories {
      width: calc(100% - (1.5rem * 2));
      max-width: 75rem;
      margin-left: auto;
      margin-right: auto;
    }
  }

  @media (max-width: 768px) {
    ${({ $showGridUI }) =>
      $showGridUI ? gridUiCategoriesSectionCss : nonGridUiCategoriesSection}
  }
`;
