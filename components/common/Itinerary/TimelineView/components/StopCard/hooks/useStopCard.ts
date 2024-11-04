import { useMemo } from 'react';
import type { ChildSection, Section } from 'types/itinerary.type';
import type { MultiplePointsProps } from 'components/common/Itinerary/TimelineView/components/StopCard/components/MultiplePoints/types';
import { MAX_LEN_DESCRIPTION_STOP_CARD } from 'components/common/Itinerary/TimelineView/components/StopCard/constants';
import type { StopCardProps } from 'components/common/Itinerary/TimelineView/components/StopCard/types';
import { getSubStopsAndPassBys } from 'components/common/Itinerary/TimelineView/components/StopCard/utils';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';

type TUseStopCardProps = {
  subCards: Omit<
    StopCardProps,
    'position' | 'subCards' | 'multiPointDetails'
  >[];
  isStart?: boolean;
  isEnd?: boolean;
  setMultiPointDefaultOpen: (value: React.SetStateAction<number>) => void;
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
  onStopSectionClick?: (
    sectionDetails: Omit<Section, 'childSections'> | Section | ChildSection
  ) => void;
  isDesktop?: boolean;
  variant: TimelineViewComponentVariant;
  isHOHOItinerary?: boolean;
  itineraryId: number;
  endPointIsNotSameAsStart?: boolean;
  isSubSection?: boolean;
  sectionDetails?: Omit<Section, 'childSections'>;
  subSectionDetails?: ChildSection | Section;
  isSubCard?: boolean;
  hasImage?: boolean;
  isForcedEnd?: boolean;
};

const useStopCard = ({
  subCards,
  isStart,
  isEnd,
  setMultiPointDefaultOpen,
  onStopSectionClick,
  isDesktop,
  variant,
  isHOHOItinerary,
  itineraryId,
  setIsOpen,
  endPointIsNotSameAsStart,
  isSubSection,
  subSectionDetails,
  sectionDetails,
  isSubCard,
  isForcedEnd,
}: TUseStopCardProps) => {
  const { details } = isSubSection ? subSectionDetails! : sectionDetails!;
  const {
    mediaUrls,
    description,
    timeForNextSection,
    modeOfTravel,
    distanceForNextSection,
  } = details;
  const hasImage = !!mediaUrls?.length;
  const isReducedVariant =
    variant === TimelineViewComponentVariant.REDUCED_WIDTH;

  const { subStops, passBys } = useMemo(
    () => getSubStopsAndPassBys(subCards),
    []
  );

  const multiPoints: MultiplePointsProps = {
    itineraryId,
    points:
      isStart || isEnd
        ? subCards.map(({ sectionDetails }) => ({
            image: sectionDetails?.details?.mediaUrls?.[0],
            title: sectionDetails?.details?.name!,
            timeForNextSection: sectionDetails?.details?.timeForNextSection,
          }))
        : [],
    isStartPoint: isStart,
    onItemClick: (index) => {
      if (variant === TimelineViewComponentVariant.DEFAULT) {
        if (index < 3) {
          setMultiPointDefaultOpen(index);
        }
        setIsOpen(true);
      } else {
        if (index < 3) {
          onStopSectionClick?.(subCards[index].sectionDetails!);
        }
      }
    },
  };

  const hasMultiPoints = Boolean(multiPoints?.points?.length > 1);

  const allowOpen = useMemo(() => {
    if (!isReducedVariant) {
      if (!endPointIsNotSameAsStart && isEnd) return false;
      if ((isStart || isEnd) && hasMultiPoints) return false;
      if (isSubCard && !hasImage && !description) return false;
      if (
        !isSubCard &&
        !isSubSection &&
        !hasImage &&
        (!description || description.length - 7 < MAX_LEN_DESCRIPTION_STOP_CARD)
      )
        return false;
      return true;
    } else {
      if (isDesktop) {
        return (
          (!isStart &&
            !isEnd &&
            !isHOHOItinerary &&
            (!!subStops?.length || !!passBys?.length)) ||
          ((isStart || isEnd) &&
            !hasMultiPoints &&
            !!(passBys?.length || subStops?.length))
        );
      } else {
        return !(isEnd && !endPointIsNotSameAsStart);
      }
    }
  }, []);

  const shouldShowNextDestinationTravel = useMemo(() => {
    if (!(isEnd || isForcedEnd) && !isSubCard) {
      if (isHOHOItinerary) {
        return timeForNextSection && (modeOfTravel || distanceForNextSection);
      } else {
        return timeForNextSection || modeOfTravel || distanceForNextSection;
      }
    }
  }, []);

  const isStopSectionClickable =
    (isDesktop && !hasMultiPoints) ||
    (!isDesktop && endPointIsNotSameAsStart && !hasMultiPoints);

  const handleStopSectionClick = () => {
    if (isStopSectionClickable) {
      onStopSectionClick?.(isSubSection ? subSectionDetails! : sectionDetails!);
    }
  };

  const handleSubStopSectionClick = (
    sectionDetails: Section | ChildSection | Omit<Section, 'childSections'>
  ) => {
    if (isHOHOItinerary && isReducedVariant) {
      onStopSectionClick?.(sectionDetails);
    }
  };

  return {
    subStops,
    passBys,
    multiPoints,
    allowOpen,
    hasMultiPoints,
    shouldShowNextDestinationTravel,
    isStopSectionClickable,
    handleStopSectionClick,
    handleSubStopSectionClick,
  };
};

export default useStopCard;
