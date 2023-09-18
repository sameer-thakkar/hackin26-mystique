import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const CategoriesSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  p {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
    color: ${COLORS.GRAY.G2};
    margin-bottom: 1.5rem;
    margin-top: 0;
  }

  .categories {
    display: flex;
  }
  .category-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 96px;
    height: 96px;
    border: 1px solid #e2e2e2;
    box-sizing: border-box;
    border-radius: 8px;
    margin-right: 1rem;
    cursor: pointer;
    transition: ease 0.2s;

    .icon {
      height: 48px;
      width: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: ease 0.4s;
    }
    .name {
      ${expandFontToken(FONTS.SUBHEADING_REGULAR)};
      color: ${COLORS.GRAY.G2};
      margin-top: 0.25rem;
      transition: ease 0.4s;
      text-align: center;
    }
    @media (min-width: 768px) {
      &:hover {
        background-color: #fafafa;
        .icon {
          transform: scale(1.083);
        }
        .name {
          margin-bottom: -2px;
        }
        border: 1px solid #f0f0f0;
      }
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

    p {
      ${expandFontToken(FONTS.HEADING_SMALL)};
      margin-bottom: 0.75rem;
    }

    .categories {
      flex-wrap: wrap;
      gap: 0.5rem;
    }
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
