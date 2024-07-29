import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { SUB_TYPES } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import Descriptors from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import Image from 'UI/Image';
import { nearbyThingsIcon } from 'const/itinerary';
import { SubStopCardProps } from '../../types';
import {
  HeaderContainer,
  IconContainer,
  InfoContainer,
  ThumbnailContainer,
  Title,
} from './styles';

const SubStopItemHeader = ({ stop }: { stop: SubStopCardProps }) => {
  const { title, imageURL, descriptors, iconType } = stop;

  const iconAvailable =
    iconType && Object.keys(nearbyThingsIcon).includes(iconType as SUB_TYPES);

  const [TypeIcon, setTypeIcon] = useState<React.ComponentType<{}> | null>(
    null
  );

  useEffect(() => {
    if (!iconAvailable) return;

    const icon = dynamic(nearbyThingsIcon[iconType]);
    setTypeIcon(icon);
  }, [iconAvailable, iconType]);

  return (
    <HeaderContainer>
      <Conditional if={imageURL}>
        <ThumbnailContainer>
          <Image
            url={imageURL!}
            alt={title || 'stop-image'}
            height={60}
            width={96}
            priority
            fetchPriority={'high'}
            fill
            aspectRatio="16:10"
            autoCrop={false}
          />
        </ThumbnailContainer>
      </Conditional>
      <Conditional if={!imageURL && iconAvailable && TypeIcon}>
        <IconContainer>{TypeIcon && <TypeIcon />}</IconContainer>
      </Conditional>
      <InfoContainer>
        <Title>{title}</Title>
        <Conditional if={descriptors}>
          <Descriptors
            {...descriptors}
            variant={TimelineViewComponentVariant.REDUCED_WIDTH}
          />
        </Conditional>
      </InfoContainer>
    </HeaderContainer>
  );
};

export default SubStopItemHeader;
