import type { CSSProperties } from 'react';
import React, { useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ChildSection } from 'types/itinerary.type';
import { Text } from '@headout/eevee';
import Conditional from 'components/common/Conditional';
import { mapViewCardStylesRecipe } from 'components/common/Itinerary/MapView/MWebMapView/MapCard/styles';
import { TMapViewCardProps } from 'components/common/Itinerary/MapView/MWebMapView/MapCard/types';
import { getNearByThingsAndHighlights } from 'components/common/Itinerary/MapView/MWebMapView/MapCard/utils';
import StopLabel from 'components/common/Itinerary/StopLabel';
import { EStopLabelType } from 'components/common/Itinerary/StopLabel/types';
import { checkIfDescriptorsExist } from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors/utils';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import { useItinerary } from 'contexts/ItineraryContext';
import useOnScreen from 'hooks/useOnScreen';
import { debounce } from 'utils/gen';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import ChevronRight from 'assets/chevronRight';
import SubSection from './components/SubSection';

const Descriptors = dynamic(
  () =>
    import(
      /* webpackChunkName: "Descriptors" */
      'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors'
    )
);

const MapViewCard = ({
  sectionDetails,
  stops,
  descriptors,
  subCards = [],
  isPassBy,
  stopIndex,
  onCardInView,
  stopLabelText,
  childParentSectionMap,
  hideViewDetails = false,
  onNearbyCardClick,
}: TMapViewCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { details, id: stopId } = sectionDetails ?? {};
  const { name } = details ?? {};
  const { title, id: passById } = stops?.[0] ?? {};
  const { highlights, nearbyThings } = useMemo(() => {
    return getNearByThingsAndHighlights(subCards);
  }, [subCards]);

  const isOnScreen = useOnScreen({
    ref: cardRef,
    options: {
      threshold: 1,
    },
  });
  const {
    setActiveStopIndex,
    setActiveItineraryStopId,
    setIsItineraryDetailsSwipeSheetOpen,
  } = useItinerary();

  useEffect(() => {
    if (isOnScreen && cardRef.current) {
      debouncedOnCardInView();
    }
  }, [isOnScreen, cardRef]);

  const debouncedOnCardInView = debounce(() => {
    onCardInView?.(isPassBy ? (stops![0]! as ChildSection) : sectionDetails!);
  }, 500);

  const handleCardClick = () => {
    if (hideViewDetails) return;

    setActiveItineraryStopId(isPassBy ? passById! : stopId!);
    setActiveStopIndex(stopIndex);
    setIsItineraryDetailsSwipeSheetOpen(true);
  };

  const handleNearbyCardClick = (subStopId: number) => {
    onNearbyCardClick?.({
      sectionDetails: sectionDetails!,
      subStopId,
    });
  };

  const hasDescriptors = descriptors
    ? checkIfDescriptorsExist(descriptors)
    : false;

  const hasAdditionalContent =
    !!nearbyThings.length || !!highlights.length || hasDescriptors;

  const mapViewCardStyles = mapViewCardStylesRecipe();

  const mapCardDynamicStyles = {
    filter:
      'drop-shadow(0px 6px 16px 5px #1111111A) drop-shadow(0px 1px 8px 0px #1111110D)',
  } as CSSProperties;

  return (
    <div
      role={'button'}
      tabIndex={0}
      className={mapViewCardStyles.root}
      ref={cardRef}
      onClick={handleCardClick}
      onKeyDown={() => {}}
      id={`map-view-card-${isPassBy ? passById : stopId}`}
    >
      <div className={mapViewCardStyles.card} style={mapCardDynamicStyles}>
        <div className={mapViewCardStyles.headingContainer}>
          <h3 className={mapViewCardStyles.heading}>
            {isPassBy ? title : name}
          </h3>
          <Conditional if={!!stopLabelText}>
            <StopLabel
              labelText={stopLabelText!}
              type={isPassBy ? EStopLabelType.PassBy : EStopLabelType.Stop}
            />
          </Conditional>
        </div>

        <Conditional if={!!descriptors}>
          <Descriptors
            {...descriptors}
            variant={TimelineViewComponentVariant.REDUCED_WIDTH}
            showLocationDescriptor={false}
          />
        </Conditional>
        <Conditional if={!!highlights?.length}>
          <SubSection
            onCardClick={handleNearbyCardClick}
            heading={strings.ITINERARY.SUB_SECTION_HEADING.HIGHLIGHTS}
            cards={highlights}
            childParentSectionMap={childParentSectionMap}
            hasAdditionalContent={hasAdditionalContent}
          />
        </Conditional>
        <Conditional if={!!nearbyThings?.length && !highlights.length}>
          <SubSection
            onCardClick={handleNearbyCardClick}
            heading={strings.ITINERARY.SUB_SECTION_HEADING.NEARBY_THINGS_TO_DO}
            cards={nearbyThings}
            childParentSectionMap={childParentSectionMap}
            hasAdditionalContent={hasAdditionalContent}
          />
        </Conditional>
      </div>
      <Conditional if={!hideViewDetails}>
        <div className={mapViewCardStyles.ctaContainer}>
          <div className={mapViewCardStyles.cta}>
            <Text
              textStyle={'ui.label.small.heavy'}
              color={'semantic.text.grey.1'}
            >
              {strings.ITINERARY.VIEW_DETAILS}
            </Text>
            <ChevronRight height={16} width={12} fillColor={COLORS.GRAY.G2} />
          </div>
        </div>
      </Conditional>
    </div>
  );
};

export default MapViewCard;
