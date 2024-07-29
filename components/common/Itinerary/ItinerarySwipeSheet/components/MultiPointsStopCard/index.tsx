import { useMemo } from 'react';
import { SECTION_TYPE } from 'types/itinerary.type';
import Accordion from 'components/common/Accordion';
import { StopCardProps } from 'components/common/Itinerary/TimelineView/components/StopCard/types';
import { strings } from 'const/strings';
import SinglePointStopCard from '../SinglePointStopCard';
import {
  MultiPointsStopCardContainer,
  StopHeader,
  StopSubTitle,
  StopTitle,
} from './styles';

const MultiPointsStopCardHeader = (props: {
  stop: StopCardProps;
  index: number;
}) => {
  const { index, stop } = props;
  const {
    details: { name },
    type,
  } = stop!.sectionDetails!;

  return (
    <StopHeader>
      <StopSubTitle>{`${
        type === SECTION_TYPE.START_LOCATION
          ? strings.ITINERARY.STOP_CARD.TITLE.STARTING_POINT
          : strings.ITINERARY.STOP_CARD.TITLE.ENDING_POINT
      } ${index + 1}`}</StopSubTitle>
      <StopTitle>{name}</StopTitle>
    </StopHeader>
  );
};

const MultiPointsStopCard = ({
  stops,
  isCurrentStop = false,
}: {
  stops: StopCardProps[];
  isCurrentStop: boolean;
}) => {
  const items = useMemo(() => {
    return stops.map((stop, index) => {
      return {
        header: <MultiPointsStopCardHeader stop={stop} index={index} />,
        body: (
          <SinglePointStopCard
            isCurrentStop={true}
            showTitle={false}
            stop={stop}
          />
        ),
        defaultExpanded: index === 0 || stops.length <= 3,
        isExpandable: true,
        isCollapsible: stops.length > 3,
      };
    });
  }, [stops]);

  return (
    <MultiPointsStopCardContainer $isCurrentStop={isCurrentStop}>
      <Accordion
        items={items}
        itemStyles={{ borderRadius: '0.75rem' }}
        containerClassName="multi-stops-accordion-container"
        itemClassName="multi-stops-accordion-item"
      />
    </MultiPointsStopCardContainer>
  );
};

export default MultiPointsStopCard;
