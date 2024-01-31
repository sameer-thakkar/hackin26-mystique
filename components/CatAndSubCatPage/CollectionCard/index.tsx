import React from 'react';
import { useRecoilValue } from 'recoil';
import Button from '@headout/aer/src/atoms/Button';
import { CollectionCardProps } from 'components/CatAndSubCatPage/CollectionCard/interface';
import {
  CardContainer,
  CardContent,
  CardCTA,
  Counter,
  CTAContentWrapper,
  ImageWrapper,
  RatingsWrapper,
  SubtextWrapper,
  TitleWrapper,
} from 'components/CatAndSubCatPage/CollectionCard/styles';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import LocalisedPrice from 'UI/LPrice';
import {
  getHeadoutLanguagecode,
  shouldDisplayCollectionRatings,
  truncateNumber,
} from 'utils';
import { trackEvent } from 'utils/analytics';
import { appAtom } from 'store/atoms/app';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';
import { strings } from 'const/strings';
import RightArrowPointed from 'assets/rightArrowPointed';
import Star from 'assets/star';

const CollectionCard: React.FC<CollectionCardProps> = (props) => {
  const {
    id,
    cardMedia,
    name,
    displayName,
    ratingsInfo,
    subtext,
    startingPrice,
    url,
    ranking,
    isSubCategoryPage,
    sectionName,
    isMobile,
  } = props;
  const { url: imageUrl, metaData: { altText = '' } = {} } = cardMedia;
  const { listingPrice, currency } = startingPrice;
  const { averageRating, ratingsCount } = ratingsInfo;
  const { language } = useRecoilValue(appAtom);
  const getImageWidth = () => {
    if (isMobile) {
      return isSubCategoryPage ? 343 : 270;
    } else {
      return isSubCategoryPage ? 384 : 282;
    }
  };
  const IMAGE_DIMENSIONS = {
    WIDTH: getImageWidth(),
    HEIGHT: 214,
  };

  const handleCTAClick = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => {
    e.preventDefault();
    trackEvent({
      eventName: ANALYTICS_EVENTS.CAT_SUBCAT_PAGE.COLLECTION_CARD_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.LANDING_PAGE,
      [ANALYTICS_PROPERTIES.COLLECTION_ID]: id,
      [ANALYTICS_PROPERTIES.COLLECTION_NAME]: name,
      [ANALYTICS_PROPERTIES.POSITION]: ranking + 1,
      [ANALYTICS_PROPERTIES.SECTION]: sectionName || null,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const CTAContent = (
    <CTAContentWrapper>
      <span>
        <a target="_blank" rel="noopener noreferrer" href={url}>
          <Conditional if={!!listingPrice}>
            {strings.CAT_SUBCAT_PAGE.TICKETS_FROM}
            <LocalisedPrice
              price={listingPrice}
              currencyCode={currency}
              lang={getHeadoutLanguagecode(language)}
            />
          </Conditional>
          <Conditional if={!listingPrice}>{strings.READ_MORE}</Conditional>
        </a>
      </span>
      <RightArrowPointed fillColor={COLORS.BRAND.WHITE} />
    </CTAContentWrapper>
  );

  return (
    <CardContainer $isSubCategoryPage={isSubCategoryPage}>
      <ImageWrapper aria-labelledby="card-title">
        <Image
          key={imageUrl}
          url={imageUrl}
          alt={altText}
          width={IMAGE_DIMENSIONS.WIDTH}
          height={IMAGE_DIMENSIONS.HEIGHT}
          fitCrop={true}
          placeholder="blur"
          draggable={false}
        />
        <TitleWrapper id="card-title">{displayName}</TitleWrapper>
      </ImageWrapper>
      <Counter>{ranking + 1}</Counter>
      <CardContent>
        <Conditional
          if={shouldDisplayCollectionRatings({
            averageRating,
            ratingsCount,
          })}
        >
          <RatingsWrapper>
            <span className="average-rating">
              <Star color={COLORS.BRAND.CANDY} />
              {averageRating?.toPrecision(2)}
            </span>
            <span className="ratings-count">
              ({truncateNumber(ratingsCount).toUpperCase()})
            </span>
          </RatingsWrapper>
        </Conditional>
        <Conditional if={!!subtext}>
          <SubtextWrapper>
            {subtext}
            <div className="something"></div>
          </SubtextWrapper>
        </Conditional>
      </CardContent>
      <CardCTA>
        <Button
          variant="primary"
          color="purps"
          size="medium"
          text={CTAContent}
          onClick={handleCTAClick}
        />
      </CardCTA>
    </CardContainer>
  );
};

export default CollectionCard;
