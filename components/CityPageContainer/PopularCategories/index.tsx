import { useEffect, useRef } from 'react';
import {
  IPopCatCardClick,
  IPopularCategories,
  IPopularEntity,
} from 'components/CityPageContainer/interface';
import { PopularCategoriesContainer } from 'components/CityPageContainer/PopularCategories/styles';
import {
  getCatSubCatMedia,
  handleCarouselControlTracking,
  trackPageSection,
} from 'components/CityPageContainer/utils';
import Carousel from 'components/GlobalMbs/Carousels/Carousel';
import Image from 'components/UI/Image';
import useOnScreen from 'hooks/useOnScreen';
import { getHeadoutLanguagecode } from 'utils';
import { trackEvent } from 'utils/analytics';
import { convertUidToUrl } from 'utils/urlUtils';
import { SECTION_NAMES } from 'const/cityPage';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CAROUSEL_DIR,
} from 'const/index';
import { strings } from 'const/strings';

export const IMAGE_DIMENSIONS = {
  DESKTOP: {
    WIDTH: '229',
    HEIGHT: '352',
  },
  MOBILE: {
    HEIGHT: '208',
    WIDTH: '156',
  },
};

const handleCardClick = ({ rank, name, mbType, url }: IPopCatCardClick) => {
  trackEvent({
    eventName: ANALYTICS_EVENTS.MB_CARD_CLICKED,
    [ANALYTICS_PROPERTIES.CARD_NAME]: name,
    [ANALYTICS_PROPERTIES.RANKING]: rank,
    [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAMES.POP_CAT,
    [ANALYTICS_PROPERTIES.CARD_MB_TYPE]: mbType,
  });
  window.open(url, '_blank', 'noopener');
};

const PopularCategories = ({
  lang,
  host,
  isDev,
  popularEntities,
  isMobile,
}: IPopularCategories) => {
  const containerRef = useRef(null);
  const isIntersecting = useOnScreen({ ref: containerRef, unobserve: true });

  useEffect(() => {
    if (isIntersecting) {
      trackPageSection({ section: SECTION_NAMES.POP_CAT });
    }
  }, [isIntersecting]);

  const { HEIGHT, WIDTH } = isMobile
    ? IMAGE_DIMENSIONS.MOBILE
    : IMAGE_DIMENSIONS.DESKTOP;

  const swiperProps = {
    spaceBetween: 14,
    breakpoints: {
      768: {
        slidesPerView: 3.5,
        slidesPerGroup: 3,
      },
      1200: {
        slidesPerView: 5,
        slidesPerGroup: 5,
      },
    },
    mobileMinWidth: 'auto',
  };

  return (
    <PopularCategoriesContainer ref={containerRef}>
      <h2 className="popular-categories-title">
        {strings.CITY_PAGE.POPULAR_CATEGORIES}
      </h2>
      <Carousel
        isMobile={isMobile}
        {...swiperProps}
        goNextHandler={() =>
          handleCarouselControlTracking({
            direction: CAROUSEL_DIR.NEXT,
            section: SECTION_NAMES.POP_CAT,
          })
        }
        goPrevHandler={() =>
          handleCarouselControlTracking({
            direction: CAROUSEL_DIR.PREV,
            section: SECTION_NAMES.POP_CAT,
          })
        }
      >
        {popularEntities.map((popularEntity: IPopularEntity, index) => {
          const {
            uid,
            heading = '',
            prismicData: { tagged_mb_type },
          } = popularEntity;
          const { imageUrl, altText } = getCatSubCatMedia(popularEntity);

          const entityUrl = convertUidToUrl({
            uid: uid,
            lang: getHeadoutLanguagecode(lang),
            hostname: host,
            isDev,
          });

          return (
            <div
              role="button"
              onClick={() =>
                handleCardClick({
                  rank: index + 1,
                  name: heading,
                  mbType: tagged_mb_type,
                  url: entityUrl,
                })
              }
              className="entity-image-container"
              key={uid}
              tabIndex={0}
            >
              <Image
                width={WIDTH}
                height={HEIGHT}
                url={imageUrl}
                alt={altText}
                className="entity-image"
                fitCrop
                loadHigherQualityImage={true}
              />
              <a
                onClick={(e) => e.preventDefault()}
                href={entityUrl}
                target="_blank"
              >
                <div className="entity-name">{heading}</div>
              </a>
            </div>
          );
        })}
      </Carousel>
    </PopularCategoriesContainer>
  );
};

export default PopularCategories;
