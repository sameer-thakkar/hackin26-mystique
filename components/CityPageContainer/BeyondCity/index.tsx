import { useEffect, useRef } from 'react';
import {
  AllDayTripsLinkContainer,
  BeyondCityContainer,
  MobileContainer,
} from 'components/CityPageContainer/BeyondCity/styles';
import {
  IBeyondCity,
  ICollectionItem,
  IPagelinkProps,
} from 'components/CityPageContainer/interface';
import {
  handleCarouselControlTracking,
  handleCollectionCardTracking,
  trackCTA,
  trackPageSection,
} from 'components/CityPageContainer/utils';
import Conditional from 'components/common/Conditional';
import Carousel from 'components/GlobalMbs/Carousels/Carousel';
import Image from 'components/UI/Image';
import useOnScreen from 'hooks/useOnScreen';
import { getHeadoutLanguagecode } from 'utils';
import { convertUidToUrl } from 'utils/urlUtils';
import { SECTION_NAMES } from 'const/cityPage';
import { CAROUSEL_DIR, CTA_TYPE } from 'const/index';
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

const AllDayTripsBtn = ({ uid, lang, host, isDev }: IPagelinkProps) => {
  const allDayTripPageLink = convertUidToUrl({
    uid: uid,
    lang: getHeadoutLanguagecode(lang),
    hostname: host,
    isDev,
  });

  if (!uid) return null;
  return (
    <AllDayTripsLinkContainer>
      <a
        onClick={(e: any) =>
          trackCTA({
            event: e,
            url: allDayTripPageLink,
            section: SECTION_NAMES.GO_BEYOND,
            ctaType: CTA_TYPE.SEE_ALL_DAY_TRIPS,
          })
        }
        className="alldaytrips-link"
        href={allDayTripPageLink}
        target="_blank"
      >
        {strings.CITY_PAGE.ALL_DAY_TRIPS}
      </a>
    </AllDayTripsLinkContainer>
  );
};

const NearbyCities = ({
  lang,
  host,
  isMobile,
  isDev,
  mbCityDisplayName,
  nearbyTopCollectionsData,
}: IBeyondCity) => {
  const containerRef = useRef(null);
  const isIntersecting = useOnScreen({ ref: containerRef, unobserve: true });

  useEffect(() => {
    if (isIntersecting) {
      trackPageSection({ section: SECTION_NAMES.GO_BEYOND });
    }
  }, [isIntersecting]);

  const { HEIGHT, WIDTH } = isMobile
    ? IMAGE_DIMENSIONS.MOBILE
    : IMAGE_DIMENSIONS.DESKTOP;

  const {
    allDayTripPage: { uid: allDayTripPageUid },
    nearbyTopCollections,
  } = nearbyTopCollectionsData;

  const allDayTripsBtnProps = {
    uid: allDayTripPageUid,
    lang,
    host,
    isDev,
  };

  const collectionCards = nearbyTopCollections?.map(
    (collection: ICollectionItem, index: number) => {
      const { uid, heading, cardImageUrl, id, name, cardMedia } = collection;

      let imageUrl = cardImageUrl;
      let imgAltText = heading;

      if (cardMedia) {
        const {
          url: mediaImageUrl,
          metadata: { altText },
        } = cardMedia;

        imageUrl = mediaImageUrl;
        imgAltText = altText;
      }
      const nearbyCollectionLink = convertUidToUrl({
        uid: uid,
        lang: getHeadoutLanguagecode(lang),
        hostname: host,
        isDev,
      });

      if (isMobile && index > 3) return null;

      return (
        <div className="collection-image-container" key={id}>
          <a
            onClick={(e: any) =>
              handleCollectionCardTracking({
                event: e,
                url: nearbyCollectionLink,
                rank: index + 1,
                name,
                section: SECTION_NAMES.GO_BEYOND,
                id,
              })
            }
            href={nearbyCollectionLink}
            target="_blank"
          >
            <Image
              width={WIDTH}
              height={HEIGHT}
              url={imageUrl}
              alt={imgAltText}
              fitCrop
              loadHigherQualityImage={true}
            />
            <div className="collection-name">{heading}</div>
          </a>
        </div>
      );
    }
  );

  const swiperProps = {
    spaceBetween: 12,
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
    <BeyondCityContainer ref={containerRef}>
      <div className="citycards-container">
        <div className="heading-container">
          <h2 className="beyond-city-title">
            {strings.formatString(
              strings.CITY_PAGE.GO_BEYOND,
              mbCityDisplayName
            )}
          </h2>
          <Conditional if={!isMobile}>
            <AllDayTripsBtn {...allDayTripsBtnProps} />
          </Conditional>
        </div>
        {isMobile ? (
          <MobileContainer>{collectionCards}</MobileContainer>
        ) : (
          <Carousel
            isMobile={isMobile}
            {...swiperProps}
            goNextHandler={() =>
              handleCarouselControlTracking({
                direction: CAROUSEL_DIR.NEXT,
                section: SECTION_NAMES.GO_BEYOND,
              })
            }
            goPrevHandler={() =>
              handleCarouselControlTracking({
                direction: CAROUSEL_DIR.PREV,
                section: SECTION_NAMES.GO_BEYOND,
              })
            }
          >
            {collectionCards}
          </Carousel>
        )}
      </div>
      <Conditional if={isMobile}>
        <AllDayTripsBtn {...allDayTripsBtnProps} />
      </Conditional>
    </BeyondCityContainer>
  );
};

export default NearbyCities;
