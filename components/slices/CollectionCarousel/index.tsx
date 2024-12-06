import { useEffect, useRef } from 'react';
import Carousel from 'components/GlobalMbs/Carousels/Carousel';
import {
  ICollectionCarousel,
  IHandleCardClick,
} from 'components/slices/CollectionCarousel/interface';
import {
  Card,
  CardContainer,
  Heading,
  Label,
} from 'components/slices/CollectionCarousel/style';
import Image from 'components/UI/Image';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { titleCase } from 'utils/stringUtils';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  ANALYTICS_SECTION_NAMES,
  CAROUSEL_DIR,
} from 'const/index';
import { strings } from 'const/strings';

const IMAGE_DIMENSIONS = {
  DESKTOP: {
    WIDTH: '200',
    HEIGHT: '267',
  },
  MOBILE: {
    WIDTH: '174',
    HEIGHT: '232',
  },
};

const SECTION_NAME = ANALYTICS_SECTION_NAMES.TOP_THINGS_TODO;

const handleCarouselControlTracking = (direction: string) => {
  trackEvent({
    eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
    [ANALYTICS_PROPERTIES.DIRECTION]: direction,
    [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAME,
  });
};

const handleCardClick = ({ id, name, rank, url }: IHandleCardClick) => {
  trackEvent({
    eventName: ANALYTICS_EVENTS.COLLECTION_CARD_CLICKED,
    [ANALYTICS_PROPERTIES.COLLECTION_NAME]: name,
    [ANALYTICS_PROPERTIES.COLLECTION_ID]: id,
    [ANALYTICS_PROPERTIES.POSITION]: rank,
    [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAME,
  });
  window.open(url, '_blank', 'noopener');
};

const CollectionCarousel: React.FC<ICollectionCarousel> = ({
  allCollectionsData,
  isMobile,
  primaryCity,
  taggedCity,
}) => {
  const { menu: collectionsList } = allCollectionsData;
  const { HEIGHT, WIDTH } = isMobile
    ? IMAGE_DIMENSIONS.MOBILE
    : IMAGE_DIMENSIONS.DESKTOP;

  const swiperProps = {
    spaceBetween: 22,
    breakpoints: {
      768: {
        slidesPerView: 4,
        slidesPerGroup: 4,
      },
      1200: {
        slidesPerView: 6,
        slidesPerGroup: 6,
      },
    },
    mobileMinWidth: 'auto',
  };

  const containerRef = useRef(null);
  const isIntersecting = useOnScreen({ ref: containerRef, unobserve: true });

  useEffect(() => {
    if (isIntersecting) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAME,
      });
    }
  }, [isIntersecting]);

  const mbCity = titleCase(primaryCity?.displayName || taggedCity || '');

  return (
    <CardContainer ref={containerRef}>
      <Heading>
        {strings.formatString(strings.COLLECTION_SLICE_HEADING, mbCity)}
      </Heading>
      <Carousel
        goNextHandler={() => handleCarouselControlTracking(CAROUSEL_DIR.NEXT)}
        goPrevHandler={() => handleCarouselControlTracking(CAROUSEL_DIR.PREV)}
        isMobile={isMobile}
        {...swiperProps}
      >
        {Object.keys(collectionsList).map((key, index) => {
          const collectionDetails = collectionsList[key];
          const {
            url,
            label,
            collectionData: { cardImageUrl, cardMedia, id, name },
          } = collectionDetails;

          const { url: mediaImageUrl, metadata: { imageAltText = '' } = {} } =
            cardMedia || {};

          const imageUrl = mediaImageUrl || cardImageUrl;
          const altText = imageAltText || label;

          return (
            <Card
              role="button"
              onClick={() =>
                handleCardClick({ id, name, rank: index + 1, url })
              }
              key={url}
              tabIndex={0}
            >
              <Image
                width={WIDTH}
                height={HEIGHT}
                url={imageUrl}
                alt={altText}
                className="collection-image"
                fitCrop
                loadHigherQualityImage={true}
              />
              <a onClick={(e) => e.preventDefault()} href={url} target="_blank">
                <Label>{label}</Label>
              </a>
            </Card>
          );
        })}
      </Carousel>
    </CardContainer>
  );
};

export default CollectionCarousel;
