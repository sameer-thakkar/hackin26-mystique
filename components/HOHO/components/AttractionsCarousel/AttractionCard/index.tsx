import React from 'react';
import Image from 'UI/Image';
import { ATTRACTIONS_PLACEHOLDER } from 'const/index';
import { TAttractionCard } from '../interface';
import { CardContent, CardWrapper, ImageWrapper } from './styles';

const AttractionCard = (props: TAttractionCard) => {
  const { name, imageUrl, stopName, isMobile, index } = props;
  const IMAGE_DIMENSIONS = {
    WIDTH: isMobile ? 104 : 133,
    HEIGHT: isMobile ? 63 : 82,
  };

  return (
    <CardWrapper>
      <ImageWrapper>
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

      <CardContent>
        <div className="card-title">{name}</div>
        <div className="card-subtitle">{stopName}</div>
      </CardContent>
    </CardWrapper>
  );
};

export default AttractionCard;
