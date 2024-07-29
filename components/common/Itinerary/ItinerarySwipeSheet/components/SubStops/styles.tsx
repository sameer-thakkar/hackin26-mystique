import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const SubStopsContainer = styled.div<{ $hasTitle: boolean }>`
  padding: 0;
  ${({ $hasTitle }) =>
    $hasTitle &&
    css`
      padding: 1rem;
      background-color: ${COLORS.GRAY.G8};
    `}
`;

export const SubStopsTitle = styled.div`
  ${expandFontToken(FONTS.SUBHEADING_REGULAR)}
  color: ${COLORS.TEXT.PURPS_3};
  margin-bottom: 1rem;
`;
