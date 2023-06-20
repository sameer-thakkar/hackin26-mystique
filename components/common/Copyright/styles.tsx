import styled from 'styled-components';
import { expandFontToken } from 'const/typography';
import { FONTS } from 'const/fonts';
import COLORS from 'const/colors';

export const StyledCopyrightContainer = styled.div`
  width: 100%;
  text-align: center;
  ${expandFontToken(FONTS.PARAGRAPH_SMALL)}
  color: ${COLORS.GRAY.G4};
`;
