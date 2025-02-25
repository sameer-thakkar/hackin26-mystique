import styled, { css } from 'styled-components';
import COLORS from 'const/colors';

export const SlideInTimelineViewContainer = styled.div<{ $isHidden?: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  height: calc(100% - 2rem);
  width: 16.25rem;
  overflow-y: auto;
  z-index: 1;
  background-color: white;
  padding: 1rem 0.75rem;
  transition: transform 0.3s;
  transform: translateX(${({ $isHidden }) => ($isHidden ? -100 : 0)}%);
`;

export const TimelineViewOpener = styled.button<{ $isExpanded?: boolean }>`
  height: 2rem;
  width: 2rem;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  border: none;
  box-shadow: 0 0.25rem 0.75rem 0 #0000001a;
  top: 0.75rem;
  left: ${({ $isExpanded }) => ($isExpanded ? 18.5 : 0.75)}rem;
  background-color: ${COLORS.BRAND.WHITE};
  border-radius: 4px;
  transition: left 0.3s;
  z-index: 1;
  cursor: pointer;

  .timeline-icon {
    height: 1rem;
    width: 1rem;
    transition: transform 0.3s;

    transform: rotate(${({ $isExpanded }) => ($isExpanded ? 180 : 0)}deg);

    path {
      stroke: ${COLORS.GRAY.G2};
    }
  }
`;

export const MapViewContainer = styled.div`
  position: relative;
  border: 1px solid ${COLORS.GRAY.G6};
  overflow: hidden;
  border-radius: 12px;
`;

export const MapContainer = styled.div<{ $isTimelineModal?: boolean }>`
  height: calc(100vh - 20.125rem);
  max-height: 30.75rem;
  z-index: 0;
  position: relative;

  ${({ $isTimelineModal }) =>
    $isTimelineModal &&
    css`
      width: calc(100% - 17.75rem);
      left: 17.75rem;
    `}
`;
