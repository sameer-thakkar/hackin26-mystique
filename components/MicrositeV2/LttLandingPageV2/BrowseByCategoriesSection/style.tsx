import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const CategoriesSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  background-color: #f8f6ff;
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
    width: 138px;
    height: 140px;
    border: 1px solid #e2e2e2;
    border-radius: 8px;
    margin-right: 1rem;
    cursor: pointer;
    transition: ease 0.2s;

    .icon {
      height: 64px;
      width: 64px;
      svg {
        transition: ease 0.2s;
      }
    }
    .name {
      ${expandFontToken(FONTS.SUBHEADING_LARGE)};
      color: ${COLORS.GRAY.G2};
      margin-top: 1rem;
      transition: ease 0.2s;
    }
    @media (min-width: 768px) {
      &:hover {
        background-color: #fafafa;
        .icon {
          svg {
            transform: scale(1.09375) translateY(4px);
          }
        }
        .name {
          transform: scale(1.2);
          transform: translateY(-4px);
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
        margin-right: 2px;
      }
      .name {
        ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
        margin-top: 0;
      }
    }
  }
`;
