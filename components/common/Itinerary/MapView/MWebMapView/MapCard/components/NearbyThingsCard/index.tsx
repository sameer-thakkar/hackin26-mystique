import type { MouseEvent } from 'react';
import React, { useEffect } from 'react';
import { Text } from '@headout/eevee';
import Conditional from 'components/common/Conditional';
import { nearbyThingsCardStylesRecipe } from 'components/common/Itinerary/MapView/MWebMapView/MapCard/components/NearbyThingsCard/styles';
import { TNearbyThingsCardProps } from 'components/common/Itinerary/MapView/MWebMapView/MapCard/components/NearbyThingsCard/types';
import Image from 'UI/Image';
import CheckFilled from 'assets/checkFilled';

const NearbyThingsCard = ({
  subStopsAndPassBy,
  isSelected = false,
  onCardClick,
}: TNearbyThingsCardProps) => {
  const { details, id } = subStopsAndPassBy.subSectionDetails;
  const { name, mediaUrls } = details ?? {};

  const hasImage = mediaUrls?.length ? !!mediaUrls?.[0] : false;
  const nearbyThingsCardStyles = nearbyThingsCardStylesRecipe({
    isSelected,
    hasImage,
  });

  const scrollToCard = () => {
    const cardId = `map-view-nearby-things-card-${id}`;
    document
      .getElementById(cardId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useEffect(() => {
    if (isSelected) {
      scrollToCard();
    }
  }, [isSelected]);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onCardClick?.(id!);
  };

  if (!details) return null;

  return (
    <div
      role={'button'}
      tabIndex={0}
      id={`map-view-nearby-things-card-${id}`}
      className={nearbyThingsCardStyles.root}
      onClick={handleClick}
      onKeyDown={() => {}}
    >
      <Conditional if={isSelected}>
        <div className={nearbyThingsCardStyles.iconContainer}>
          <CheckFilled />
        </div>
      </Conditional>
      <div className={nearbyThingsCardStyles.bgImageOverlay}></div>
      <Text className={nearbyThingsCardStyles.heading}>{name}</Text>
      <Conditional if={hasImage}>
        <div className={nearbyThingsCardStyles.bgImageContainer}>
          <Image
            url={mediaUrls?.[0] as string}
            alt={name!}
            fill
            height={60}
            width={96}
          />
        </div>
      </Conditional>
    </div>
  );
};

export default NearbyThingsCard;
