import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledCopyrightContainer = styled.div`
  width: 100%;
  text-align: center;
  ${expandFontToken(FONTS.PARAGRAPH_SMALL)}
  color: ${COLORS.GRAY.G3};
`;
