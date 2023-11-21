import React from 'react';
import { useRecoilValue } from 'recoil';
import { TopCollectionCardProps } from 'components/CatAndSubCatPage/TopCollectionsCarousel/TopCollectionCard/interface';
import {
  CardContainer,
  CardContent,
  Counter,
  ImageWrapper,
} from 'components/CatAndSubCatPage/TopCollectionsCarousel/TopCollectionCard/styles';
import Image from 'UI/Image';
import LocalisedPrice from 'UI/LPrice';
import { getHeadoutLanguagecode } from 'utils';
import { trackEvent } from 'utils/analytics';
import { appAtom } from 'store/atoms/app';
import { SECTIONS } from 'const/catAndSubcatPage';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';

const TopCollectionCard: React.FC<TopCollectionCardProps> = (props) => {
  const {
    id,
    name,
    displayName,
    url,
    cardMedia,
    startingPrice,
    ranking,
    isMobile,
  } = props;
  const { url: imageUrl, metaData: { altText = '' } = {} } = cardMedia;
  const { listingPrice, currency } = startingPrice;
  const { language } = useRecoilValue(appAtom);
  const IMAGE_DIMENSIONS = {
    WIDTH: isMobile ? 156 : 227,
    HEIGHT: isMobile ? 234 : 333,
  };

  const handleCardClick = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => {
    e.preventDefault();
    trackEvent({
      eventName: ANALYTICS_EVENTS.COLLECTION_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.COLLECTION_ID]: id,
      [ANALYTICS_PROPERTIES.COLLECTION_NAME]: name,
      [ANALYTICS_PROPERTIES.POSITION]: ranking + 1,
      [ANALYTICS_PROPERTIES.SECTION]: SECTIONS.TOP_CATEGORY,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <CardContainer onClick={handleCardClick} role="link" tabIndex={0}>
      <ImageWrapper aria-labelledby="card-title">
        <Image
          key={imageUrl}
          url={imageUrl}
          alt={altText}
          width={IMAGE_DIMENSIONS.WIDTH}
          height={IMAGE_DIMENSIONS.HEIGHT}
          fitCrop={true}
          priority={ranking < 5}
          fetchPriority={ranking < 5 ? 'high' : 'auto'}
          placeholder="blur"
          draggable={false}
        />
      </ImageWrapper>
      <Counter>{ranking + 1}</Counter>
      <CardContent>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={url}
          onClick={(
            e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
          ) => e.preventDefault()}
        >
          <div id="card-title">{displayName}</div>
          <div className="card-description">
            {strings.FROM.toLowerCase()}
            <LocalisedPrice
              price={listingPrice}
              currencyCode={currency}
              lang={getHeadoutLanguagecode(language)}
            />
          </div>
        </a>
      </CardContent>
    </CardContainer>
  );
};

export default TopCollectionCard;
