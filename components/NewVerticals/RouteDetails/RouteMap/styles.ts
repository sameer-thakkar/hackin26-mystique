import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const MapContainer = styled.div<{
  $isTimelineModal?: boolean;
  $showLegend?: boolean;
  $isOnTop?: boolean;
}>`
  background: ${COLORS.GRAY.G8};
  height: 25.125rem;
  width: 100%;
  border-radius: 12px;
  border: ${({ $showLegend }) =>
    $showLegend ? `1px solid ${COLORS.GRAY.G6}` : 'none'};
  overflow: hidden;
  box-sizing: border-box;
  z-index: 1;
  margin-top: 1.5rem;
  position: relative;
  ${({ $isTimelineModal }) =>
    $isTimelineModal &&
    css`
      margin: 1.5rem 0 3rem;
    `}
  @media (max-width: 768px) {
    height: ${({ $showLegend }) => ($showLegend ? '18.25rem' : '13.375rem')};
    margin: ${({ $isOnTop }) => ($isOnTop ? '0' : '-0.5rem 0 0')};
  }
`;

export const MainContainer = styled.div<{
  $showLegend?: boolean;
  $isOnTop?: boolean;
}>`
  position: relative;
  height: 29.125rem;
  @media (max-width: 768px) {
    height: ${({ $showLegend }) => ($showLegend ? '20.5rem' : '13rem')};
    ${({ $isOnTop }) =>
      $isOnTop &&
      css`
        && {
          border-bottom: none !important;
        }
      `}
  }
`;

export const OverlayContainer = styled.div`
  z-index: 999;
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: ${COLORS.BRAND.WHITE};
  ${expandFontToken(FONTS.PARAGRAPH_LARGE)}
  &:hover {
    opacity: 1;
  }
`;
