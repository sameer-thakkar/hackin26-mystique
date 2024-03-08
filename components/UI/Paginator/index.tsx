import { PaginatorDot, PaginatorWrapper, StyledDotsContainer } from './styles';
import { calcTranslateX, isNormalScale } from './utils';

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
  enableCompletedColor?: boolean;
  marginOverride?: any;
}

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
  margin = 0.25,
  size = 1,
  limit = 5,
  containerWidthOverride = 100,
  enableTranslate = true,
  marginOverride,
  enableCompletedColor = false,
}: Props) => {
  const sizeInPx = size * 5;
  const dotsMargin = marginOverride ?? 4;
  const containerWidth =
    containerWidthOverride ?? (sizeInPx + dotsMargin) * limit;

  const translateX = calcTranslateX(
    activeIndex,
    limit,
    totalCount,
    sizeInPx,
    dotsMargin
  );

  if (totalCount <= 1) return null;

  const PaginatorContent = (
    <PaginatorWrapper
      enableTranslate={enableTranslate}
      translateX={translateX}
      bottom={bottom}
    >
      {[...Array(totalCount)].map((_, i) => {
        const isDotNormalScale = isNormalScale(
          i,
          activeIndex,
          limit,
          totalCount
        );
        return (
          <PaginatorDot
            tabSize={tabSize}
            dotSize={dotSize}
            isActive={i === activeIndex}
            key={`dot` + i}
            data-num={i}
            data-active={i === activeIndex}
            onClick={(e) => onDotClick?.(i, e)}
            activeSlideTimer={activeSlideTimer}
            inactiveColor={inactiveColor}
            activeColor={activeColor}
            margin={margin}
            isCompleted={i < activeIndex}
            enableCompletedColor={enableCompletedColor}
            shouldScaleDown={enableTranslate && !isDotNormalScale}
          >
            <span aria-hidden={true} key={'active' + activeIndex} />
          </PaginatorDot>
        );
      })}
    </PaginatorWrapper>
  );

  return enableTranslate ? (
    <StyledDotsContainer $maxWidth={containerWidth}>
      {PaginatorContent}
    </StyledDotsContainer>
  ) : (
    PaginatorContent
  );
};
