import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import styled from 'styled-components';

export const CashbackWrapper = styled.div<{ isSportsExperiment?: boolean }>`
  display: flex;
  margin: 0.5rem 0 -0.25rem;
  align-items: center;

  @media (max-width: 768px) {
    margin: ${({ isSportsExperiment }) =>
      isSportsExperiment ? '0.5rem 0 -2rem' : ''};
  }
`;

export const CashbackLabel = styled.div`
  margin: 0 0 0.125rem 0.25rem;
  color: ${COLORS.TEXT.JOY_MUSTARD_3};
  display: flex;
  gap: 0.3125rem;
  align-items: center;
  ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
`;
