import Conditional from 'components/common/Conditional';
import {
  TitleContainer,
  ToggleContainer,
} from 'components/common/Itinerary/TimelineView/components/StopCard/components/DefaultHeadingContainer/styles';
import type { TDefaultHeadingContainerProps } from 'components/common/Itinerary/TimelineView/components/StopCard/components/DefaultHeadingContainer/types';
import { HeadingContainer } from 'components/common/Itinerary/TimelineView/components/StopCard/styles';
import { strings } from 'const/strings';
import Minus from 'assets/minus';
import Plus from 'assets/plus';

const DefaultHeadingContainer = ({
  name,
  position,
  isStart = false,
  isEnd = false,
  isOpen = false,
  hasMultiPoints = false,
  multiPoints,
  isSubCard = false,
  hasMultipleSubStops = false,
  allowOpen = false,
  isStopSectionClickable = false,
}: TDefaultHeadingContainerProps) => {
  return (
    <>
      <Conditional if={allowOpen}>
        <ToggleContainer>
          {isOpen ? <Minus /> : <Plus height={20} width={20} />}
        </ToggleContainer>
      </Conditional>
      <Conditional if={(isEnd || isStart) && !isSubCard}>
        <TitleContainer $isClickable={isStopSectionClickable}>
          {isStart
            ? strings.ITINERARY.STOP_CARD.TITLE.START
            : strings.ITINERARY.STOP_CARD.TITLE.END}
        </TitleContainer>
      </Conditional>
      <HeadingContainer $isSubCard={isSubCard}>
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
      </HeadingContainer>
    </>
  );
};

export default DefaultHeadingContainer;
