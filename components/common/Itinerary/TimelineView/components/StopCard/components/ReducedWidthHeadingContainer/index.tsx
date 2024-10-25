import { useRecoilValue } from 'recoil';
import { cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import { appAtom } from 'store/atoms/app';
import { strings } from 'const/strings';
import ChevronRight from 'assets/chevronRight';
import Minus from 'assets/minus';
import Plus from 'assets/plus';
import { HeadingContainer } from '../../styles';
import type { TReducedWidthHeadingContainerProps } from './types';

const ReducedWidthHeadingContainer = ({
  name,
  isStart = false,
  isEnd = false,
  isSubCard,
  variant,
  allowOpen = false,
  isStopSectionClickable = false,
  position,
  hasMultiPoints = false,
  isOpen = false,
  multiPoints,
  endPointIsNotSameAsStart = false,
  hasMultipleSubStops = false,
}: TReducedWidthHeadingContainerProps) => {
  const { isMobile } = useRecoilValue(appAtom);
  const isDesktop = !isMobile;

  return (
    <HeadingContainer
      $isSubCard={isSubCard}
      $variant={variant}
      $isClickable={isStopSectionClickable}
    >
      <div className="stop-heading-container">
        <Conditional if={!hasMultiPoints && (isStart || isEnd)}>
          <p className="stop-title">
            {isStart
              ? strings.ITINERARY.STOP_CARD.TITLE.START
              : strings.ITINERARY.STOP_CARD.TITLE.END}
          </p>
        </Conditional>
        <div className="stop-name-container">
          <p className="stop-name">
            {hasMultiPoints
              ? strings.formatString(
                  isStart
                    ? strings.ITINERARY.STOP_CARD.MULTI_POINTS_AVAILABLE.START
                    : strings.ITINERARY.STOP_CARD.MULTI_POINTS_AVAILABLE.END,
                  multiPoints!.points.length
                )
              : isSubCard && hasMultipleSubStops
              ? `${position}. ${name}`
              : name}
          </p>
        </div>
        <Conditional if={!endPointIsNotSameAsStart && isEnd}>
          <p className="stop-subtext">
            {strings.ITINERARY.START_POINT_SAME_AS_END_POINT}
          </p>
        </Conditional>
      </div>
      <Conditional if={allowOpen && isDesktop}>
        <div className="toggle-icon-container">
          {isOpen ? <Minus /> : <Plus height={20} width={20} />}
        </div>
      </Conditional>
      <Conditional if={allowOpen && !isDesktop}>
        <div
          className={cx(
            'toggle-icon-container',
            'chevron-right-icon-container'
          )}
        >
          <ChevronRight height={12} width={12} />
        </div>
      </Conditional>
    </HeadingContainer>
  );
};

export default ReducedWidthHeadingContainer;
