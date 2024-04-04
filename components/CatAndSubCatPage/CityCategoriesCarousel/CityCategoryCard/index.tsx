import React from 'react';
import { CityCategoryCardProps } from 'components/CatAndSubCatPage/CityCategoriesCarousel/CityCategoryCard/interface';
import {
  CardContainer,
  CardContent,
  ImageWrapper,
} from 'components/CatAndSubCatPage/CityCategoriesCarousel/CityCategoryCard/styles';
import Image from 'UI/Image';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';

const CityCategoryCard: React.FC<CityCategoryCardProps> = (props) => {
  const { id, name, displayName, url, media, ranking, isMobile } = props;
  const { url: imageUrl, metaData: { altText = '' } = {} } = media || {};

  const handleCardClick = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => {
    e.preventDefault();
    trackEvent({
      eventName: ANALYTICS_EVENTS.CAT_SUBCAT_PAGE.CATEGORY_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.CATEGORY_ID]: id,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: name,
      [ANALYTICS_PROPERTIES.POSITION]: ranking + 1,
    });
    window.open(url, '_blank', 'noopener');
  };

  return (
    <CardContainer onClick={handleCardClick} role="link" tabIndex={0}>
      <ImageWrapper aria-labelledby="card-label">
        <Image
          key={imageUrl}
          url={imageUrl}
          alt={altText}
          width={isMobile ? 156 : 229}
          height={isMobile ? 280 : 356}
          fitCrop={true}
          placeholder="blur"
          draggable={false}
        />
      </ImageWrapper>
      <a
        target="_blank"
        rel="noopener"
        href={url}
        onClick={(
          e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
        ) => e.preventDefault()}
      >
        <CardContent id="card-label">{displayName}</CardContent>
      </a>
    </CardContainer>
  );
};

export default CityCategoryCard;
