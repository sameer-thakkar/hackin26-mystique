import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const TitleContainer = styled.h5<{
  $isClickable?: boolean;
}>`
  ${expandFontToken(FONTS.MISC_OVERLINE_LARGE)}
  color: ${COLORS.GRAY.G2};
  z-index: 1;
  margin: 0 0 -0.25rem;
  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'auto')};
`;

export const ToggleContainer = styled.div`
  position: absolute;
  top: 0.375rem;
  right: 0.375rem;
  height: 1.25rem;
  width: 1.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;

  svg {
    path {
      stroke: ${COLORS.GRAY.G2};
    }
  }
`;
