import Conditional from 'components/common/Conditional';
import { SubStopsContainer } from 'components/common/Itinerary/TimelineView/components/StopCard/components/SubStopSection/styles';
import type { TSubStopSectionProps } from 'components/common/Itinerary/TimelineView/components/StopCard/components/SubStopSection/types';
import SubStopCard from 'components/common/Itinerary/TimelineView/components/SubStopCard';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';

const SubStopSection = ({
  itineraryId,
  subStops,
  passBys,
  variant,
  hasMultiPoints = false,
  isOpen = false,
  isSubCard = false,
  handleSubStopSectionClick,
  isHOHOItinerary = false,
}: TSubStopSectionProps) => {
  const isReducedVariant =
    variant === TimelineViewComponentVariant.REDUCED_WIDTH;

  return (
    <>
      <Conditional
        if={
          subStops?.length &&
          isReducedVariant &&
          !isSubCard &&
          isOpen &&
          !hasMultiPoints
        }
      >
        {subStops?.map(({ subSectionDetails, sectionDetails }) => {
          if (!subSectionDetails && !sectionDetails) return null;

          const { details, id, rank } = subSectionDetails! || sectionDetails!;
          return (
            <SubStopCard
              key={`subStop-card-${id}`}
              details={details}
              rank={rank}
              id={id}
              itineraryId={itineraryId}
              onClick={handleSubStopSectionClick}
            />
          );
        })}
      </Conditional>
      <Conditional
        if={
          (passBys?.length || subStops?.length) &&
          isReducedVariant &&
          !isSubCard &&
          !hasMultiPoints &&
          isHOHOItinerary
        }
      >
        <SubStopsContainer>
          {subStops?.map(({ subSectionDetails, sectionDetails }) => {
            if (!subSectionDetails && !sectionDetails) return null;

            const { details, id, rank } = subSectionDetails! || sectionDetails!;

            return (
              <SubStopCard
                key={`subStop-card-${
                  (subSectionDetails || sectionDetails)?.id
                }`}
                details={details}
                rank={rank}
                id={id}
                itineraryId={itineraryId}
                onClick={handleSubStopSectionClick}
              />
            );
          })}
          {passBys?.map((passBy) => {
            const { id, details, rank } = passBy;

            return (
              <SubStopCard
                key={`subStop-card-${passBy.id}`}
                details={details}
                rank={rank}
                id={id}
                itineraryId={itineraryId}
                onClick={handleSubStopSectionClick}
              />
            );
          })}
        </SubStopsContainer>
      </Conditional>
    </>
  );
};

export default SubStopSection;
