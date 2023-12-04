import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const PinnedCardWrapper = styled.div`
  width: calc(100vw - (5.46vw * 2));
  max-width: 1200px;
  background-color: ${COLORS.GRAY.G8};
  border-radius: 8px;
  display: grid;
  grid-template-columns: 1.2fr 1.5fr 0fr 1fr;

  .product-image {
    img {
      border-radius: 8px 0 0 8px;
    }
    height: 15rem;
  }

  .product-description {
    padding: 1.5rem;
    height: auto;
    .tags-wrapper {
      margin-bottom: 0.25rem;
      span {
        ${expandFontToken(FONTS.SUBHEADING_XS)};
        padding-right: 0.25rem;
        color: ${COLORS.GRAY.G3};
      }
      span::after {
        content: ' •';
        color: ${COLORS.GRAY.G3};
      }
      > :last-child::after,
      > :last-child span::after {
        content: '';
      }
    }
    .rating {
      display: grid;
      grid-template-columns: repeat(2, max-content);
      align-items: center;
      column-gap: 4px;
      font-size: 14px;
    }

    .avg-rating {
      .rating-number {
        margin-right: 0.125rem;
        color: ${COLORS.TEXT.CANDY_1};
        ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
      }
    }

    .avg-rating svg {
      position: relative;
      top: 0.063rem;
      width: 12px;
      height: 12px;
      path {
        fill: ${COLORS.TEXT.CANDY_1};
        stroke: ${COLORS.TEXT.CANDY_1};
      }
    }
    .total-rating {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
      color: ${COLORS.GRAY.G3};
    }
    .date {
      display: inline-block;
      margin-top: 0.875rem;
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
      color: ${COLORS.TEXT.BEACH};
    }
    .descriptors-list {
      margin-top: 1rem;
    }
    .descriptors {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;
      span {
        ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
        margin-left: 0.625rem;
      }
    }

    .product-name {
      h3 {
        margin: 0 0 0.25rem 0;
        ${expandFontToken(FONTS.HEADING_REGULAR)};
      }
    }
  }
  .divider {
    border-left: 1px dashed ${COLORS.GRAY.G6};
    height: calc(100% - 3rem);
    width: 1px;
    align-items: center;
    margin-top: 1.5rem;
  }

  .cta-container {
    padding: 1.5rem;
    button {
      margin-top: 1.5rem;
    }
    .strike-through {
      ${expandFontToken(FONTS.HEADING_REGULAR)};
      color: ${COLORS.GRAY.G3};
    }
  }
`;
