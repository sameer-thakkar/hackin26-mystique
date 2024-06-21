import styled, { css } from 'styled-components';
import COLORS from 'const/colors';

export const MapContainer = styled.div<{ $isTimelineModal?: boolean }>`
  background: ${COLORS.GRAY.G8};
  height: 25.25rem;
  width: 100%;
  border-radius: 12px;
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
    height: 13.375rem;
    margin: -0.5rem 0 0;
  }
`;
