import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const ReadMoreWrapper = styled.div`
  color: ${COLORS.TEXT.CANDY_1};
  ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  margin: 0 0 0.625rem 0.625rem;

  &:hover {
    cursor: pointer;
  }
`;
