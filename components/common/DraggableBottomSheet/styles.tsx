import styled from 'styled-components';
import COLORS from 'const/colors';

export const Overlay = styled.div<{
  $isDragging: boolean;
  $overlayOpacity: number;
}>`
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background: rgba(17, 17, 17, 0.35);
    opacity: ${({ $overlayOpacity }) => $overlayOpacity};
    transition: all 300ms cubic-bezier(0, 0, 0.3, 1);
  }
  .sheet-content {
    z-index: 0;
  }
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 50;
`;

export const Sheet = styled.div<{ $sheetHeight: string; $translateY: number }>`
  position: fixed;
  top: auto;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateY(${({ $translateY }) => $translateY}px);
  transition: transform 300ms cubic-bezier(0, 0, 0.3, 1);
  max-height: ${({ $sheetHeight }) => $sheetHeight};
  background-color: ${COLORS.BRAND.WHITE};
  border-radius: 1rem 1rem 0 0;
  box-shadow: 0 -0.2rem 1rem rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const GrabBar = styled.div<{
  $isScrolled?: boolean;
  $snapHeight?: string;
}>`
  width: 100%;
  height: 1rem;
  border-radius: 1rem 1rem 0 0;
  cursor: grab;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10001;

  background: ${({ $isScrolled }) =>
    $isScrolled
      ? COLORS.BRAND.WHITE
      : 'linear-gradient(0deg, rgba(0,0,0,0) 10.4%, rgba(0,0,0,0.195) 60.42%, rgba(0,0,0,0.5) 138.66%)'};
`;

export const GrabIndicator = styled.div<{ $isScrolled?: boolean }>`
  height: 0.25rem;
  width: 3.125rem;
  background-color: ${({ $isScrolled }) =>
    $isScrolled ? COLORS.GRAY.G5 : COLORS.BRAND.WHITE};
  border-radius: 0.2rem;
  position: absolute;
  top: 0.375rem;
  left: 50%;
  transform: translateX(-50%);
`;
