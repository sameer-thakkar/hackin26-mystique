import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const CategoryWrapper = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 3.25rem;
  padding: 0.625rem 0.875rem 0.625rem 0.625rem;
  border: 1px solid ${COLORS.GRAY.G6};
  box-sizing: border-box;
  border-radius: 6px;
  margin-right: 1rem;
  cursor: pointer;
  transition: ease 0.2s;
  background-color: ${COLORS.BRAND.WHITE};

  ${({ $isActive }) =>
    $isActive &&
    `
      background-color: ${COLORS.PURPS.LIGHT_TONE_4};
      border: ${COLORS.PURPS.LEVEL_15};
    `}

  .icon {
    width: 2rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: ease 0.4s;
    margin-right: 0.25rem;
    svg {
      width: 1.33331rem;
      height: 1.33331rem;
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
          svg {
            height: 1.375rem;
            width: 1.375rem;

          }
        }
      }
      `}
  }

  @media (max-width: 768px) {
    .category-wrapper {
      border: none;
      flex-direction: row;
      align-items: center;
      height: auto;
      width: auto;
      border-radius: 0.25rem;
      border: 1px solid ${COLORS.PURPS.LIGHT_TONE_4};
      padding: 0.625rem 0.875rem 0.625rem 0.625rem;
      margin: 0;
      background: ${COLORS.BRAND.WHITE};

      .icon,
      svg {
        height: 24px;
        width: 24px;
      }
      .icon {
        margin-right: 6px;
      }
      .name {
        ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
        margin-top: 0;
      }
    }
  }
`;

export const CategoriesSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding: 0.875rem 0;

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
    padding-top: 0;
    position: relative;
    margin-left: -1.5rem !important;
    width: 100vw;
    padding: 1.5rem 1.5rem 1.75rem;
    border-radius: 4px;
    background-color: #f8f6ff;
    width: 100%;
    max-width: 100vw;
    margin-left: auto;
    margin-right: auto;
    p {
      ${expandFontToken(FONTS.HEADING_SMALL)};
      margin-bottom: 0.75rem;
    }

    .categories {
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  }
`;
