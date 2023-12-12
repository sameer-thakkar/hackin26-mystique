import React, { ComponentPropsWithoutRef } from 'react';
import styled, { keyframes } from 'styled-components';
import COLORS from 'const/colors';

interface Props {
  tabSize: number;
  dotSize: number;
  totalCount: number;
  activeIndex: number;
  rtl?: boolean;
  isOverlay?: boolean;
  bottom?: number;
  currentIndexTime?: number;
  onDotClick?: (index: number) => void;
  activeSlideTimer?: number;
  inactiveColor?: string;
  activeColor?: string;
  margin?: number;
}

const PaginatorWrapper = styled.ul<Pick<Props, 'rtl' | 'isOverlay' | 'bottom'>>`
  display: flex;
  flex-direction: ${(props) => (props.rtl ? 'row-reverse' : 'row')};
  margin: 0;
  padding: 0;
  list-style: none;
`;
interface PaginatorButtonProps extends ComponentPropsWithoutRef<'li'> {
  isActive: boolean;
  dotSize: number;
  tabSize: number;
  activeSlideTimer?: number;
  inactiveColor?: string;
  activeColor?: string;
  margin?: number;
}

const progressAnimation = keyframes`
	0%{
		width: 0%;
	}
	100%{
		width: 100%;
	}
`;
const PaginatorDot = styled.li<PaginatorButtonProps>`
  position: relative;
  overflow: hidden;
  isolation: isolate;
  transition: transform 0.5s;
  width: ${({ isActive, dotSize, tabSize }) =>
    isActive ? tabSize : dotSize}rem;
  height: ${({ dotSize }) => dotSize}rem;
  background-color: ${({ inactiveColor }) =>
    inactiveColor || `${COLORS.BRAND.WHITE}80`};
  transition: width 0.5s ease;
  border-radius: ${({ dotSize }) => dotSize}rem;
  margin: ${({ margin }) => `0 ${margin}`}rem;
  cursor: pointer;
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

export const Paginator = ({
  tabSize = 3.6,
  dotSize = 8,
  totalCount,
  activeIndex,
  onDotClick,
  bottom = 3,
  activeSlideTimer,
  inactiveColor,
  activeColor,
  margin = 0.3,
}: Props) => {
  if (totalCount <= 1) return null;
  return (
    <PaginatorWrapper bottom={bottom}>
      {[...Array(totalCount)].map((_, i) => (
        <PaginatorDot
          tabSize={tabSize}
          dotSize={dotSize}
          isActive={i === activeIndex}
          key={`dot` + i}
          data-num={i}
          data-active={i === activeIndex}
          onClick={() => onDotClick?.(i)}
          activeSlideTimer={activeSlideTimer}
          inactiveColor={inactiveColor}
          activeColor={activeColor}
          margin={margin}
        >
          <span aria-hidden={true} key={'active' + activeIndex} />
        </PaginatorDot>
      ))}
    </PaginatorWrapper>
  );
};
