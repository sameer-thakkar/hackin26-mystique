import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const BodyContainer = styled.div`
  padding-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Description = styled.div`
  ${expandFontToken(FONTS.PARAGRAPH_SMALL)}
  color: ${COLORS.GRAY.G3};
`;
