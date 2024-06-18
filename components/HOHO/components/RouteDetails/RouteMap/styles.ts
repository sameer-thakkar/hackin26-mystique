import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const IconWrapper = styled.div`
  position: relative;
  img {
    width: 2.813rem;
    height: 3.125rem;
  }
`;

export const MarkerText = styled.p`
  position: absolute;
  background: ${COLORS.BACKGROUND.FLOATING_PURPS};
  height: 1.625rem;
  width: 1.625rem;
  top: 0.219rem;
  left: 0.219rem;
  border-radius: 50%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    color: ${COLORS.TEXT.PURPS_3};
    margin-bottom: 0.188rem;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
  }
`;

export const MapContainer = styled.div<{ $isTimelineModal?: boolean }>`
  background: ${COLORS.GRAY.G8};
  height: 25.25rem;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-sizing: border-box;
  z-index: 1;
  margin-top: 1.5rem;
  ${({ $isTimelineModal }) =>
    $isTimelineModal &&
    css`
      margin: 1.5rem 0 3rem;
    `}
  @media (max-width: 768px) {
    height: 13.375rem;
    margin: -0.5rem 0 0;
  }
`;
