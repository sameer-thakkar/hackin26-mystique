import { useEffect, useRef } from 'react';
import {
  ICityTopAttractions,
  ICityTopCollectionsItem,
} from 'components/CityPageContainer/interface';
import {
  Card,
  CardsContainer,
  Container,
  TextContainer,
} from 'components/CityPageContainer/TopAttractions/styles';
import {
  handleCarouselControlTracking,
  handleCollectionCardTracking,
  trackPageSection,
} from 'components/CityPageContainer/utils';
import Conditional from 'components/common/Conditional';
import Carousel from 'components/GlobalMbs/Carousels/Carousel';
import Image from 'components/UI/Image';
import LocalisedPrice from 'UI/LPrice';
import useOnScreen from 'hooks/useOnScreen';
import { getHeadoutLanguagecode } from 'utils';
import { convertUidToUrl } from 'utils/urlUtils';
import { SECTION_NAMES } from 'const/cityPage';
import { CAROUSEL_DIR } from 'const/index';
import { strings } from 'const/strings';

export const IMAGE_DIMENSIONS = {
  DESKTOP: {
    WIDTH: '229',
    HEIGHT: '356',
  },
  MOBILE: {
    HEIGHT: '234',
    WIDTH: '156',
  },
};

const TopAttractions = ({
  host,
  isDev,
  isMobile,
  lang,
  cityTopCollectionsData,
}: ICityTopAttractions) => {
  const containerRef = useRef(null);
  const isIntersecting = useOnScreen({ ref: containerRef, unobserve: true });

  useEffect(() => {
    if (isIntersecting) {
      trackPageSection({ section: SECTION_NAMES.TOP_ATTRACTIONS });
    }
  }, [isIntersecting]);

  const { HEIGHT, WIDTH } = isMobile
    ? IMAGE_DIMENSIONS.MOBILE
    : IMAGE_DIMENSIONS.DESKTOP;

  const carouselItems = [...cityTopCollectionsData];

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
    <Container ref={containerRef}>
      <div className="content-wrapper">
        <TextContainer>
          <h2 className="heading-wrapper">
            {strings.CITY_PAGE.TOP_ATTRACTIONS}
          </h2>
        </TextContainer>
        <CardsContainer>
          <Carousel
            {...swiperProps}
            isMobile={isMobile}
            goNextHandler={() =>
              handleCarouselControlTracking({
                direction: CAROUSEL_DIR.NEXT,
                section: SECTION_NAMES.TOP_ATTRACTIONS,
              })
            }
            goPrevHandler={() =>
              handleCarouselControlTracking({
                direction: CAROUSEL_DIR.PREV,
                section: SECTION_NAMES.TOP_ATTRACTIONS,
              })
            }
          >
            {carouselItems.map((attraction: ICityTopCollectionsItem, index) => {
              if (!Object.keys(attraction).length) {
                return <Card key={index} width={WIDTH} height={HEIGHT} />;
              }
              const {
                id,
                heading,
                cardImageUrl,
                uid,
                startingPrice: { listingPrice, currency } = {},
                name,
                cardMedia,
              } = attraction;
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

              const headoutLangCode = getHeadoutLanguagecode(lang);
              const attractionLink = convertUidToUrl({
                uid: uid,
                lang: headoutLangCode,
                hostname: host,
                isDev,
              });

              return (
                <Card key={id} width={WIDTH} height={HEIGHT}>
                  <a
                    onClick={(e) =>
                      handleCollectionCardTracking({
                        event: e,
                        url: attractionLink,
                        rank: index + 1,
                        name,
                        section: SECTION_NAMES.TOP_ATTRACTIONS,
                        id,
                      })
                    }
                    href={attractionLink}
                    target="_blank"
                  >
                    <div className="attraction-image-wrapper">
                      <Image
                        width={WIDTH}
                        height={HEIGHT}
                        url={imageUrl}
                        alt={imgAltText}
                        className="attraction-image"
                        fitCrop
                        priority
                        fetchPriority="high"
                        loadHigherQualityImage={true}
                      />
                      <div className="gradient-wrapper"></div>
                      <div className="card-info-wrapper">
                        <div className="attraction-name">{heading}</div>
                        <Conditional if={listingPrice}>
                          <div className="attraction-price">
                            <span>{strings.FROM.toLowerCase()}</span>
                            <LocalisedPrice
                              price={listingPrice}
                              currencyCode={currency}
                              lang={headoutLangCode}
                            />
                          </div>
                        </Conditional>
                      </div>
                    </div>
                  </a>
                </Card>
              );
            })}
          </Carousel>
        </CardsContainer>
      </div>
    </Container>
  );
};

export default TopAttractions;
