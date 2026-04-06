import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

const withoutTagStyles = css`
  border-radius: 0.25rem;
  padding: 0 0.3125rem;
`;

export const DiscountTextContainer = styled.div<{
  $showAngledTag?: boolean;
}>`
  background: #088943;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  height: 1.25rem;
  margin: 0;
  padding-right: 0.3125rem;
  transform: translateX(-0.0625rem);

  p.discount-text {
    transform: translateY(0.5px);
    margin: 0;
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    font-weight: 500;
    color: ${COLORS.BRAND.WHITE};
    line-height: inherit;
  }

  ${({ $showAngledTag }) => !$showAngledTag && withoutTagStyles}
`;

export const DiscountTagContainer = styled.div<{ $shouldPointLeft?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height: max-content;
  align-items: center;
  align-self: center;

  ${({ $shouldPointLeft }) =>
    $shouldPointLeft &&
    css`
      ${DiscountTextContainer} {
        padding-left: 0.3125rem;
        padding-right: 0;

        border-top-left-radius: 0.25rem;
        border-bottom-left-radius: 0.25rem;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        transform: none;
      }
      svg {
        transform: rotate(180deg);
      }
    `}
`;
