import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const DiscountTextContainer = styled.div`
  background: #088943;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  height: 1.25rem;
  margin: 0;
  padding-right: 0.3125rem;
  overflow: hidden;

  p.discount-text {
    transform: translateY(0.5px);
    margin: 0;
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    font-weight: 500;
    color: ${COLORS.BRAND.WHITE};
    line-height: inherit;
  }
`;

export const DiscountTagContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height: max-content;
  align-items: center;
  align-self: center;
`;
