import React from 'react';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  ATTRACTIONS_PLACEHOLDER,
} from 'const/index';
import en from 'const/localization/en';
import { TAttractionCard } from '../interface';
import { CardContent, CardWrapper, ImageWrapper } from './styles';

const AttractionCard = (props: TAttractionCard) => {
  const {
    name,
    imageUrl,
    stopName,
    isMobile,
    index,
    hideStopName = false,
  } = props;

  const IMAGE_DIMENSIONS = {
    WIDTH: isMobile ? 208 : 133,
    HEIGHT: isMobile ? 126 : 82,
  };

  enum COMPONENT {
    IMAGE = 'Image',
    TEXT = 'Text',
  }

  const trackDeadClick = (component: COMPONENT) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.DEAD_CLICK,
      [ANALYTICS_PROPERTIES.SECTION]: en.HOHO.TOP_ATTRACTIONS,
      [ANALYTICS_PROPERTIES.COMPONENT]: component,
    });
  };
  return (
    <CardWrapper>
      <ImageWrapper onClick={() => trackDeadClick(COMPONENT.IMAGE)}>
        <Image
          key={imageUrl || name}
          url={imageUrl || ATTRACTIONS_PLACEHOLDER}
          alt={name}
          width={IMAGE_DIMENSIONS.WIDTH}
          height={IMAGE_DIMENSIONS.HEIGHT}
          fitCrop={true}
          priority={index < 5}
          fetchPriority={index < 5 ? 'high' : 'auto'}
          placeholder="blur"
          draggable={false}
        />
      </ImageWrapper>

      <CardContent onClick={() => trackDeadClick(COMPONENT.TEXT)}>
        <div className="card-title">{name}</div>
        <Conditional if={!hideStopName}>
          <div className="card-subtitle">{stopName}</div>
        </Conditional>
      </CardContent>
    </CardWrapper>
  );
};

export default AttractionCard;
