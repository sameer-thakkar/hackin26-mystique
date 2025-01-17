import Conditional from 'components/common/Conditional';
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
  enableActiveColor?: boolean;
  showCounter?: boolean;
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
  enableActiveColor = false,
  showCounter = false,
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
      $showCounter={showCounter}
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
            $enableActiveColor={enableActiveColor}
            tabSize={tabSize}
            dotSize={dotSize}
            isActive={i === activeIndex}
            key={`dot` + i}
            data-num={i}
            data-active={i === activeIndex}
            onClick={(e: any) => onDotClick?.(i, e)}
            activeSlideTimer={activeSlideTimer}
            inactiveColor={inactiveColor}
            activeColor={activeColor}
            margin={margin}
            isCompleted={i < activeIndex}
            enableCompletedColor={enableCompletedColor}
            shouldScaleDown={enableTranslate && !isDotNormalScale}
            $showCount={i === activeIndex && showCounter}
          >
            <span aria-hidden={true} key={'active' + activeIndex} />

            <Conditional if={i === activeIndex && showCounter}>
              <div className="count">
                {activeIndex + 1}/{totalCount}
              </div>
            </Conditional>
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
