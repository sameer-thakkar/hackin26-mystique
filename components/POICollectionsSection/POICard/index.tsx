import { useContext, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { useWindowWidth } from '@react-hook/window-size';
import { useSwiperSlide } from 'swiper/react';
import { Text } from '@headout/eevee';
import { css, cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import { truncateNumber } from 'utils';
import { trackEvent } from 'utils/analytics';
import { getLocalisedPrice } from 'utils/currency';
import { currencyListAtom } from 'store/atoms/currencyList';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import Star from 'assets/star';
import { TPOICardProps } from './interface';
import {
  cardImageStyles,
  descriptionTextStyles,
  dummyInnerFirstCardStyles,
  dummyInnerSecondCardStyles,
  fromTextStyles,
  mainCardStyles,
  poiCardStyles,
  priceSectionStyles,
  ratingsContainerStyles,
  removeHoverStylesWhenNoDescription,
  textContainerStyles,
} from './styles';

const IMAGE_DIMENSIONS = {
  DESKTOP: {
    WIDTH: '282',
    HEIGHT: '356',
  },
  MOBILE: {
    WIDTH: '156',
    HEIGHT: '208',
  },
};

export const POICard = ({
  url,
  label,
  collectionData,
  imageUrl,
  altText,
  index,
  isOnScreen,
}: TPOICardProps) => {
  const { startingPrice, subtext, ratingsInfo, experienceCount } =
    collectionData;

  const { lang } = useContext(MBContext);

  const isMobile = useWindowWidth() < 768;

  const { listingPrice, currency } = startingPrice;

  const currencyList = useRecoilValue(currencyListAtom);

  const formattedPrice = getLocalisedPrice({
    price: listingPrice,
    currencyCode: currency,
    lang,
    currencyList,
  });

  const isViewTracked = useRef(false);

  const { isVisible } = useSwiperSlide() ?? {
    isVisible: isMobile,
  };

  useEffect(() => {
    if (isViewTracked.current || !isVisible || !isOnScreen) {
      return;
    }

    isViewTracked.current = true;

    trackEvent({
      eventName: 'Collection Card Viewed',
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
    });
  }, [isVisible, isOnScreen]);

  return (
    <a
      className={cx(
        poiCardStyles,
        subtext ? '' : removeHoverStylesWhenNoDescription
      )}
      href={url}
      target="_blank"
      onClick={() => {
        trackEvent({
          eventName: ANALYTICS_EVENTS.COLLECTION_CARD_CLICKED,
          [ANALYTICS_PROPERTIES.RANKING]: index + 1,
        });
      }}
    >
      <div className={cx('inner-card-first', dummyInnerFirstCardStyles)}></div>
      <div
        className={cx('inner-card-second', dummyInnerSecondCardStyles)}
      ></div>

      <div className={mainCardStyles}>
        <Image
          width={IMAGE_DIMENSIONS[isMobile ? 'MOBILE' : 'DESKTOP'].WIDTH}
          height={IMAGE_DIMENSIONS[isMobile ? 'MOBILE' : 'DESKTOP'].HEIGHT}
          url={imageUrl}
          alt={altText}
          aspectRatio={isMobile ? '156/208' : '282/356'}
          fitCrop
          quality={60}
          loadHigherQualityImage
          className={cardImageStyles}
        />

        <div className={cx('text-container', textContainerStyles)}>
          <Conditional if={!isMobile}>
            <div className={ratingsContainerStyles}>
              <Star color="white" />
              <Text
                textStyle={'Semantics/Subheading/Regular'}
                as="span"
                className={css({
                  color: 'semantic.surface.light.grey.1',
                  marginLeft: 'space.2',
                })}
              >
                {ratingsInfo.averageRating?.toFixed(1) === '0.0'
                  ? strings.NEW
                  : ratingsInfo.averageRating?.toFixed(1)}
              </Text>
              <Text
                textStyle={'Semantics/Para/Small'}
                as="span"
                className={css({
                  color: 'semantic.surface.light.grey.1',
                })}
              >
                ({truncateNumber(ratingsInfo.ratingsCount).toUpperCase()})
              </Text>
            </div>
          </Conditional>

          <Text
            textStyle={
              isMobile
                ? 'Semantics/Subheading/Large'
                : 'Semantics/Heading/Regular'
            }
            className={css({
              color: 'semantic.surface.light.white',
            })}
          >
            {label}
          </Text>

          <Text
            textStyle={'Semantics/UI Label/Small'}
            className={css({
              color: 'semantic.surface.light.white',
              marginTop: 'space.2',
            })}
          >
            {strings.formatString(
              strings.POI_COLLECTIONS_SECTION.EXPERIENCES,
              experienceCount
            )}
          </Text>

          <Conditional if={!isMobile}>
            <Text className={cx('description', descriptionTextStyles)}>
              {subtext}
            </Text>
          </Conditional>

          <div className={priceSectionStyles}>
            <Text as="span" className={fromTextStyles}>
              {strings.FROM.toLocaleLowerCase()}
            </Text>
            <Text textStyle={'Semantics/UI Label/Regular (Heavy)'} as="span">
              {formattedPrice}
            </Text>
          </div>
        </div>
      </div>
    </a>
  );
};
