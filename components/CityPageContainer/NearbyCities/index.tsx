import { useEffect, useRef } from 'react';
import {
  ICardTrackingEvent,
  ICity,
  INearbyCities,
} from 'components/CityPageContainer/interface';
import {
  Card,
  NeabyCitiesContainer,
} from 'components/CityPageContainer/NearbyCities/styles';
import {
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
  FALLBACK_IMAGES,
} from 'const/index';
import { strings } from 'const/strings';

export const IMAGE_DIMENSIONS = {
  DESKTOP: {
    WIDTH: '229',
    HEIGHT: '352',
  },
  MOBILE: {
    HEIGHT: '280',
    WIDTH: '156',
  },
};

const handleItemClick = ({ e, link, rank, name }: ICardTrackingEvent): void => {
  e.preventDefault();
  trackEvent({
    eventName: ANALYTICS_EVENTS.CITY_CARD_CLICKED,
    [ANALYTICS_PROPERTIES.CITY_NAME]: name,
    [ANALYTICS_PROPERTIES.POSITION]: rank,
    [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAMES.NEARBY,
  });
  window.open(link, '_blank');
};

const NearbyCities = ({
  lang,
  host,
  isDev,
  cities,
  isMobile,
}: INearbyCities) => {
  const containerRef = useRef(null);
  const isIntersecting = useOnScreen({ ref: containerRef, unobserve: true });

  useEffect(() => {
    if (isIntersecting) {
      trackPageSection({ section: SECTION_NAMES.NEARBY });
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
    <NeabyCitiesContainer ref={containerRef}>
      <h2 className="cities-nearby-title">{strings.CITY_PAGE.CITIES_NEARBY}</h2>
      <Carousel
        isMobile={isMobile}
        {...swiperProps}
        goNextHandler={() =>
          handleCarouselControlTracking({
            direction: CAROUSEL_DIR.NEXT,
            section: SECTION_NAMES.NEARBY,
          })
        }
        goPrevHandler={() =>
          handleCarouselControlTracking({
            direction: CAROUSEL_DIR.PREV,
            section: SECTION_NAMES.NEARBY,
          })
        }
      >
        {cities.map((city: ICity, index) => {
          const {
            uid,
            prismicData: { bannerImages },
            cityHOData: { imageURL, displayName, cityCode } = {},
          } = city;

          const cityLink = convertUidToUrl({
            uid: uid,
            lang: getHeadoutLanguagecode(lang),
            hostname: host,
            isDev,
          });

          const { HEADOUT: headoutFallbackImgUrl } = FALLBACK_IMAGES;
          const fallbackImgUrl = bannerImages?.[0]?.url;
          const cardImageUrl =
            !imageURL || imageURL === headoutFallbackImgUrl
              ? fallbackImgUrl
              : imageURL;

          return (
            <Card height={HEIGHT} width={WIDTH} key={uid}>
              <a
                onClick={(e) =>
                  handleItemClick({
                    e,
                    link: cityLink,
                    rank: index + 1,
                    name: cityCode,
                  })
                }
                href={cityLink}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  width={WIDTH}
                  height={HEIGHT}
                  url={cardImageUrl}
                  alt={displayName}
                  className="city-image"
                  fallbackImg={fallbackImgUrl}
                  fitCrop
                />
                <div className="city-name">{displayName}</div>
              </a>
            </Card>
          );
        })}
      </Carousel>
    </NeabyCitiesContainer>
  );
};

export default NearbyCities;
