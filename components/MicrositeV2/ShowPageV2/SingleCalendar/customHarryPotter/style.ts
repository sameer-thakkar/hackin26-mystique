/* eslint-disable-next-line no-restricted-imports */
import styled from 'styled-components';
import colors from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const TwoPartTimeSlot = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-top: 0.75rem;
  .time {
    display: flex;
    gap: 0.75rem;
    .time-index {
      ${expandFontToken(FONTS.HEADING_XS)}
      width: 1.375rem;
      color: ${colors.BRAND.WHITE};
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: ${colors.TEXT.PEACHY_ORANGE_3};
      border-radius: 0.125rem;
    }
    .show-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      color: ${colors.TEXT.PEACHY_ORANGE_3};
      ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)}
      @media (max-width: 768px) {
        ${expandFontToken(FONTS.HEADING_XS)}
      }
      .duration {
        display: flex;
        gap: 0.2969rem;
        align-items: baseline;
        p {
          ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
          margin: 0;
          @media (max-width: 768px) {
            ${expandFontToken(FONTS.UI_LABEL_SMALL)}
          }
        }
        svg {
          path {
            fill: ${colors.TEXT.PEACHY_ORANGE_3};
          }
          line {
            stroke: ${colors.TEXT.PEACHY_ORANGE_3};
          }
        }
      }
    }
  }
  .gap {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    color: ${colors.TEXT.PEACHY_ORANGE_3};
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
    .spacer {
      width: 1.375rem;
      height: 3rem;
      background-color: ${colors.BACKGROUND.FADED_PALE};
    }
    @media (max-width: 768px) {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    }
  }
`;
