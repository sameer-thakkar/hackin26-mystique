import { useEffect, useRef } from 'react';
import {
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
import { convertUidToUrl } from 'utils/urlUtils';
import { SECTION_NAMES } from 'const/cityPage';
import { CAROUSEL_DIR } from 'const/index';
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
        {popularEntities.map((popularEntity: IPopularEntity) => {
          const { uid, heading = '' } = popularEntity;
          const { imageUrl, altText } = getCatSubCatMedia(popularEntity);

          const entityUrl = convertUidToUrl({
            uid: uid,
            lang: getHeadoutLanguagecode(lang),
            hostname: host,
            isDev,
          });

          return (
            <>
              <div className="entity-image-container" key={uid}>
                <a href={entityUrl} target="_blank" rel="noreferrer">
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
            </>
          );
        })}
      </Carousel>
    </PopularCategoriesContainer>
  );
};

export default PopularCategories;
