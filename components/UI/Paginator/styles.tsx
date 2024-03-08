import { ComponentPropsWithoutRef } from 'react';
import styled, { keyframes } from 'styled-components';
import COLORS from 'const/colors';

interface PaginatorButtonProps extends ComponentPropsWithoutRef<'li'> {
  isActive: boolean;
  dotSize: number;
  tabSize: number;
  activeSlideTimer?: number;
  inactiveColor?: string;
  activeColor?: string;
  margin?: number;
  index?: number;
  shouldScaleDown?: boolean;
  enableCompletedColor?: boolean;
  isCompleted?: boolean;
}

interface Props {
  tabSize: number;
  dotSize: number;
  totalCount: number;
  activeIndex: number;
  rtl?: boolean;
  isOverlay?: boolean;
  bottom?: number;
  currentIndexTime?: number;
  onDotClick?: (index: number, e: React.MouseEvent) => void;
  activeSlideTimer?: number;
  inactiveColor?: string;
  activeColor?: string;
  margin?: number;
  size?: number;
  limit?: number;
  containerWidthOverride?: number;
  enableTranslate?: boolean;
  translateX?: number;
}

export const StyledDotsContainer = styled.div<{ $maxWidth: number }>`
  display: flex;
  overflow-x: clip;
  overflow-x: hidden;
  padding: 0.5rem 0;
  max-width: ${({ $maxWidth }) => `${$maxWidth}px`};
`;

const progressAnimation = keyframes`
	0%{
		width: 0%;
	}
	100%{
		width: 100%;
	}
`;

export const PaginatorDot = styled.li<PaginatorButtonProps>`
  position: relative;
  overflow: hidden;
  isolation: isolate;
  transition: transform 0.5s;
  width: ${({ isActive, dotSize, tabSize }) =>
    isActive ? tabSize : dotSize}rem;
  height: ${({ dotSize }) => dotSize}rem;
  background-color: ${({
    inactiveColor,
    enableCompletedColor,
    isCompleted,
    activeColor,
  }) => {
    if (enableCompletedColor && isCompleted)
      return activeColor || COLORS.BRAND.WHITE;
    return inactiveColor || `${COLORS.BRAND.WHITE}80`;
  }};
  transition: width 0.5s ease;
  border-radius: ${({ dotSize }) => dotSize}rem;
  margin: ${({ margin }) => `0 ${margin}`}rem;
  cursor: pointer;
  ${({ shouldScaleDown }) => shouldScaleDown && `transform: scale(0.8);`}
  will-change: width, transform;
  transition: width 0.5s ease, transform 0.5s ease;

  span {
    display: ${(props) =>
      props.activeSlideTimer && props.isActive ? 'inline-block' : 'none'};
    background-color: ${({ activeColor }) => activeColor || COLORS.BRAND.WHITE};
    position: absolute;
    left: 0;
    top: 0;
    width: 0%;
    height: 100%;
    border-radius: ${({ dotSize }) => dotSize}rem;
    z-index: 10;
    opacity: 1;
    animation: ${progressAnimation}
      ${({ activeSlideTimer }) => activeSlideTimer}ms ease-in forwards;
  }
`;

export const PaginatorWrapper = styled.ul<
  Pick<Props, 'rtl' | 'isOverlay' | 'bottom' | 'translateX' | 'enableTranslate'>
>`
  display: flex;
  flex-direction: ${(props) => (props.rtl ? 'row-reverse' : 'row')};
  margin: 0;
  padding: 0;
  list-style: none;
  ${({ enableTranslate, translateX }) =>
    enableTranslate &&
    ` 
    justify-content: center;
    align-items: flex-end;
    transition: transform 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s;
    transform: translateX(-${translateX}px);
  `}
`;
