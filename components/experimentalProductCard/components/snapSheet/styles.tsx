import styled from 'styled-components';
import COLORS from 'const/colors';

export const SnapSheetContainer = styled.div<{ $isOpen?: boolean }>`
  position: absolute;
  inset: 0;
  background-color: ${COLORS.BRAND.WHITE};
  border-radius: ${({ $isOpen }) => (!$isOpen ? '0' : '0.75rem 0.75rem 0 0')};
  transition: transform 300ms cubic-bezier(0.7, 0, 0.3, 1);
  cursor: grab;
  user-select: none;
  border-radius: 12px 12px 0 0;
  will-change: transform;
`;

// snapsheet height: bottomsheet height - headerHeight + cardheight
export const Content = styled.div<{
  $isOpen: boolean;
  $sheetHeight: string;
  $headerHeight: number;
  $cardHeight: number;
  $pricingHeight?: number;
  $hasOffers?: boolean;
}>`
  max-height: ${({
    $sheetHeight,
    $headerHeight,
    $cardHeight,
    $pricingHeight,
    $hasOffers,
  }) =>
    `calc(${$sheetHeight} - ${$headerHeight}px + ${$cardHeight}px - ${$pricingHeight}px - ${
      $hasOffers ? '2.75rem' : '1rem'
    } );`}
  overflow-y: ${({ $isOpen }) => ($isOpen ? 'hidden' : 'auto')};
  overflow-x: hidden;
  overscroll-behavior-y: none;
  -webkit-overflow-scrolling: touch;
  
`;
