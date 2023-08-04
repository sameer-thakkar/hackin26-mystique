import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const ReadMoreBox = styled.div<{
  isReadMore: boolean;
  top: number;
}>`
  display: flex;
  justify-content: center;

  ${({ isReadMore, top }) =>
    isReadMore &&
    `position: absolute;
    top: ${top}px;
     left: 35%;
      z-index: 2;
    `};
`;

export const ReadMoreWrapper = styled.div<{
  isReadMore: boolean;
  isSettingsTwo: boolean;
}>`
  display: flex;
  margin: 0 0 1rem;
  :hover {
    cursor: pointer;
  }
`;

export const ReadMoreTextWrapper = styled.div<{
  isReadMore: boolean;
}>`
  color: ${({ isReadMore }) =>
    isReadMore ? `${COLORS.BRAND.CANDY}` : `${COLORS.GRAY.G3}`};
  ${expandFontToken(FONTS.BUTTON_MEDIUM)};
  margin-right: 0.5rem;
`;

export const ReadMoreIconWrapper = styled.div`
  svg {
    height: 13px;
    width: 13px;
  }
`;
