import React, { memo } from 'react';
import { Text } from '@headout/eevee';
import NearbyThingsCard from 'components/common/Itinerary/MapView/MWebMapView/MapCard/components/NearbyThingsCard';
import type { TSubSectionProps } from 'components/common/Itinerary/MapView/MWebMapView/MapCard/components/SubSection/types';
import { mapViewCardStylesRecipe } from 'components/common/Itinerary/MapView/MWebMapView/MapCard/styles';
import { useItinerary } from 'contexts/ItineraryContext';

const SubSection = ({
  heading,
  cards,
  childParentSectionMap,
  hasAdditionalContent,
  onCardClick,
}: TSubSectionProps) => {
  const { setActiveItineraryStopId, selectedSubStopId, setSelectedSubStopId } =
    useItinerary();

  const handleNearbyCardClick = (subStopId: number) => {
    const parentSectionId = childParentSectionMap[subStopId];
    setSelectedSubStopId(subStopId);
    setActiveItineraryStopId(parentSectionId);
    onCardClick?.(subStopId);
  };

  const mapViewCardStyles = mapViewCardStylesRecipe({
    hasAdditionalContent,
  });

  return (
    <div className={mapViewCardStyles.nearbyThingsContainer}>
      <Text
        as="h6"
        textStyle="Semantics/Tags/Regular"
        color="core.grey.700"
        className={mapViewCardStyles.nearbyThingsHeading}
      >
        {heading}
      </Text>
      <div className={mapViewCardStyles.nearbyThingsCarousel}>
        {cards?.map((item) => (
          <NearbyThingsCard
            subStopsAndPassBy={item}
            key={`nearby-things-card-${item.subSectionDetails?.id}`}
            isSelected={selectedSubStopId === item.subSectionDetails?.id}
            onCardClick={handleNearbyCardClick}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(SubSection);
