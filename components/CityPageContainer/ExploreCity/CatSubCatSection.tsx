import { useEffect, useRef } from 'react';
import { EntityContainer } from 'components/CityPageContainer/ExploreCity/styles';
import {
  ICarouselChild,
  ICatSubCatSectionProps,
  IExploreCityCardClick,
} from 'components/CityPageContainer/interface';
import {
  getCatSubCatMedia,
  handleCarouselControlTracking,
  handleCollectionCardTracking,
  handleSubCatCardTracking,
  trackPageSection,
} from 'components/CityPageContainer/utils';
import Carousel from 'components/GlobalMbs/Carousels/Carousel';
import Image from 'components/UI/Image';
import useOnScreen from 'hooks/useOnScreen';
import { getHeadoutLanguagecode } from 'utils';
import { convertUidToUrl } from 'utils/urlUtils';
import { CAT, SUBCAT } from 'const/cityPage';
import { CAROUSEL_DIR } from 'const/index';

const IMAGE_DIMENSIONS = {
  DESKTOP: {
    WIDTH: '180',
    HEIGHT: '240',
  },
  MOBILE: {
    HEIGHT: '208',
    WIDTH: '156',
  },
};

const handleCardClick = ({
  event,
  url,
  rank,
  name,
  id,
  categoryId,
  type,
  sectionName,
}: IExploreCityCardClick) => {
  if (type === CAT && categoryId) {
    handleSubCatCardTracking({
      event,
      url,
      rank,
      name,
      id,
      section: sectionName,
      categoryId,
    });
  } else if (type === SUBCAT) {
    handleCollectionCardTracking({
      event,
      url,
      rank,
      name,
      id,
      section: sectionName,
    });
  }
};

const getAssetsData = (item: ICarouselChild, type: string) => {
  let imageUrl = '';
  let altText = '';
  if (type === CAT) {
    const { imageUrl: url, altText: text } = getCatSubCatMedia(item);
    imageUrl = url;
    altText = text;
  }
  if (type === SUBCAT) {
    const { cardImageUrl, heading, cardMedia } = item;
    imageUrl = cardImageUrl;
    altText = heading;
    if (cardMedia) {
      const {
        url: mediaImageUrl,
        metadata: { imageAltText },
      } = cardMedia;

      imageUrl = mediaImageUrl;
      altText = imageAltText;
    }
  }

  return { imageUrl, altText };
};

const CatSubCatSection = (props: ICatSubCatSectionProps) => {
  const {
    parentData: { heading, name: sectionName },
    children,
    type,
    lang,
    host,
    isDev,
    isMobile,
  } = props;

  const containerRef = useRef(null);
  const isIntersecting = useOnScreen({ ref: containerRef, unobserve: true });

  useEffect(() => {
    if (isIntersecting) {
      trackPageSection({ section: sectionName });
    }
  }, [isIntersecting]);

  if (children.length < 3) {
    return null;
  }

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

  return (
    <EntityContainer ref={containerRef}>
      <h3 className="entity-header">{heading}</h3>
      <Carousel
        isMobile={isMobile}
        {...swiperProps}
        goNextHandler={() =>
          handleCarouselControlTracking({
            direction: CAROUSEL_DIR.NEXT,
            section: sectionName,
          })
        }
        goPrevHandler={() =>
          handleCarouselControlTracking({
            direction: CAROUSEL_DIR.PREV,
            section: sectionName,
          })
        }
      >
        {children.map((item: ICarouselChild, index) => {
          const { uid, heading, name, id, categoryId } = item;
          const { imageUrl, altText } = getAssetsData(item, type);
          const entityUrl = convertUidToUrl({
            uid: uid,
            lang: getHeadoutLanguagecode(lang),
            hostname: host,
            isDev,
          });

          return (
            <div className="entity-image-container" key={uid}>
              <a
                onClick={(e) =>
                  handleCardClick({
                    event: e,
                    url: entityUrl,
                    rank: index + 1,
                    name,
                    id,
                    categoryId,
                    type,
                    sectionName,
                  })
                }
                href={entityUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  width={WIDTH}
                  height={HEIGHT}
                  url={imageUrl}
                  alt={altText}
                  className="entity-image"
                  fitCrop
                />
                <div className="entity-name">{heading}</div>
              </a>
            </div>
          );
        })}
      </Carousel>
    </EntityContainer>
  );
};

export default CatSubCatSection;
