import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { SNAP_SHEET_TRANSITION_DURATION } from './constants';

export const SnapSheetContainer = styled.div<{ $isOpen?: boolean }>`
  position: absolute;
  inset: 0;
  background-color: ${COLORS.BRAND.WHITE};
  border-radius: ${({ $isOpen }) => (!$isOpen ? '0' : '0.75rem 0.75rem 0 0')};
  transition: transform ${SNAP_SHEET_TRANSITION_DURATION}ms
    cubic-bezier(0.7, 0, 0.3, 1);
  transform: translate3d(
    0,
    0,
    0
  ); // Force GPU acceleration, smoother transition
  perspective: 1000;
  -webkit-perspective: 1000;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden; /* Prevent flickering in Safari */
  cursor: grab;
  user-select: none;
  border-radius: 12px 12px 0 0;
  will-change: transform;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
`;

// snapsheet height: bottomsheet height - headerHeight + cardheight
export const Content = styled.div<{
  $isOpen: boolean;
  $sheetHeight: string;
  $headerHeight: number;
  $cardHeight: number;
  $pricingHeight?: number;
  $hasOffers?: boolean;
  $preventTouchEvents?: boolean;
}>`
  max-height: ${({
    $sheetHeight,
    $headerHeight,
    $cardHeight,
    $pricingHeight,
    $hasOffers,
  }) =>
    css`calc(${$sheetHeight} - ${$headerHeight}px + ${$cardHeight}px - ${$pricingHeight}px - ${
      $hasOffers ? '2.75rem' : '1rem'
    } );`};
  pointer-events: ${({ $preventTouchEvents }) =>
    $preventTouchEvents ? 'none' : 'unset'};
  overflow-y: ${({ $isOpen }) => ($isOpen ? 'hidden' : 'auto')};
  overflow-x: hidden;
  overscroll-behavior-y: none;
  -webkit-overflow-scrolling: touch;
`;
