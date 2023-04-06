import styled from 'styled-components';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';
import { FONTS } from 'const/fonts';

export const CashbackWrapper = styled.div`
  display: flex;
  margin: 0.5rem 0 -0.25rem;
  align-items: center;

  @media (max-width: 768px) {
    margin: 0.5rem 0 -2rem;
  }
`;

export const CashbackTextWrapper = styled.div`
  margin: 0 0 0.125rem 0.25rem;
  color: ${COLORS.TEXT.JOY_MUSTARD_3};
  ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
`;
