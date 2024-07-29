import { useMemo } from 'react';
import { PassesByCardProps } from 'components/common/Itinerary/TimelineView/components/PassesByCard/types';
import SubStops from '../SubStops';
import { SubStopCardProps } from '../SubStops/types';
import { PassByCardContainer } from './styles';

const PassByCard = ({
  passby: { stops = [] },
  isCurrentStop,
}: {
  passby: PassesByCardProps;
  isCurrentStop: boolean;
}) => {
  const subStops: SubStopCardProps[] = useMemo(() => {
    return stops.map((stop) => {
      const {
        image: imageURL,
        type,
        subType: { label: subTypeLabel } = {},
        ...rest
      } = stop;
      return {
        ...rest,
        imageURL,
        iconType: subTypeLabel || type,
      };
    });
  }, [stops]);

  return (
    <PassByCardContainer $isCurrentStop={isCurrentStop}>
      <SubStops subStops={subStops} shouldExpandFirstItem />
    </PassByCardContainer>
  );
};

export default PassByCard;
