import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div<{
  $backgroundImage: string;
}>`
  padding: 1rem;
  border-radius: 8px;
  ${({ $backgroundImage }) => {
    return `
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, 
    rgba(0, 0, 0, 0.50) 100%), url('${$backgroundImage}'), lightgray 50% / cover no-repeat;
    background-size: cover;
    `;
  }}

  h2 {
    width: fit-content;
    max-width: 12.5rem;
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
    color: ${COLORS.BRAND.WHITE};
  }

  @media (max-width: 768px) {
    h2 {
      ${expandFontToken(FONTS.HEADING_REGULAR)};
      max-width: 9.375rem;
    }
  }
`;

export const HeadingWrapper = styled.div`
  margin-bottom: 1rem;
`;

export const ChipsWrapper = styled.div`
  display: flex;
  row-gap: 12px;
  column-gap: 8px;
  flex-wrap: wrap;
`;

export const Chip = styled.span`
  border-radius: 24px;
  background: rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(35px);
  width: fit-content;
  color: ${COLORS.BRAND.WHITE};
  padding: 0.625rem 0.75rem;
  /* ${expandFontToken(FONTS.UI_LABEL_LARGE)}; */

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
  }
`;
