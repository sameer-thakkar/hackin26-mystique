import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import { scroller } from 'react-scroll';
import Button from 'components/UI/Button';
import Image from 'components/UI/Image';
import Conditional from 'components/common/Conditional';
import { strings } from 'const/strings';
import { SOLEIL, COLORS, SIZES } from 'const/ui-constants';
import { withShortcodes } from 'utils/helper';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PAGE_TYPES,
} from 'const/index';

const Swiper = dynamic(() => import('components/Swiper'), {
  ssr: false,
  loading: function CarouselLoadingSkeleton() {
    return <StyledPlaceHolder />;
  },
});

const swiperParams = {
  breakpoints: {
    320: {
      slidesPerView: 1.1,
    },
    480: {
      slidesPerView: 'auto',
    },
  },
  speed: 600,
  centeredSlides: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  shouldSwiperUpdate: true,
  loop: true,
  loopedSlides: 3,
  lazy: true,
  preloadImages: false,
};

export const BANNER_PARAMS = {
  DESKTOP: {
    ASPECT_RATIO: '3:1',
    WIDTH: '900',
  },
  MOBILE: {
    ASPECT_RATIO: '16:9',
    WIDTH: '360',
  },
};

const renderAmpBanners = (image) => {
  const { url, alt } = image;
  return (
    <Image
      aspectRatio="16:9"
      width="411"
      height="163"
      url={url}
      alt={alt || 'banner'}
      layout={'fill'}
      className="banner-image"
      addDarkOverlay
      autoCrop={false}
    />
  );
};

const getAmpBanner = (bannerImages) => (
  <amp-carousel
    width="411"
    height="200"
    layout="responsive"
    type="slides"
    autoplay=""
    delay="4000"
  >
    {bannerImages.map((banner) =>
      renderAmpBanners({ url: banner.url, alt: banner.alt })
    )}
  </amp-carousel>
);

type TBannerCarouselProps = {
  bannerImages: {
    url: string;
    alt: string;
    mobileUrl?: string;
  }[];
  bannerHeading: string;
  bannerSubtext: string;
  bannerCtaText: string;
  currentLanguage: string;
  isMobile: boolean;
  boxed: boolean;
  hideCTA: boolean;
  isAmp: boolean;
  orderedTgids: string[];
};

/**
 * Microsite V1 Carousel Banner
 */
const Banner = (props: TBannerCarouselProps) => {
  const {
    bannerHeading: tempBannerHeading,
    bannerImages,
    currentLanguage,
    hideCTA,
    isAmp,
    bannerSubtext: tempBannerSubtext,
    bannerCtaText = '',
    orderedTgids,
    isMobile: isMobileFromCDNHeader,
  } = props;

  const [isMobile, setIsMobile] = useState(isMobileFromCDNHeader);

  const [swiper, updateSwiper] = useState(null);

  useLayoutEffect(() => {
    const mobileCheck = window.innerWidth < 768;
    if (mobileCheck) {
      setIsMobile(mobileCheck);
    }
  }, []);

  const bannerHeadingArray = withShortcodes(tempBannerHeading);
  const bannerHeading = bannerHeadingArray?.join(' ');

  const analyticsParams = {
    [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
    [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
    [ANALYTICS_PROPERTIES.TGIDS]: orderedTgids,
    [ANALYTICS_PROPERTIES.MB_NAME]: bannerHeading,
  };

  const isSwiperSet = swiper !== null && !swiper?.destroyed;

  useEffect(() => {
    if (!isSwiperSet) {
      return;
    }

    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.VISIBLE,
      ...analyticsParams,
    });

    swiper?.on?.('touchEnd', (touchend) => {
      if (touchend?.srcElement.localName === 'button') {
        return;
      }
      trackEvent({
        eventName: ANALYTICS_EVENTS.MB_BANNER.BANNER_SCROLL,
        ...analyticsParams,
        Ranking: swiper.realIndex + 1,
      });
    });
  }, [isSwiperSet]);

  const scrollTicketSection = useCallback(() => {
    scroller.scrollTo('tour-list-heading', {
      duration: 1200,
      offset: isMobile ? -80 : -100,
      smooth: 'easeInOutQuart',
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.CTA_CLICKED,
      ...analyticsParams,
      Ranking: swiper.realIndex + 1,
    });
  }, [swiper]);

  const bannerSubtext = withShortcodes(tempBannerSubtext);

  const captions = (
    <div
      className={`mb-captions
         ${isAmp ? 'absolute-position' : ''}
         `}
    >
      <div
        className={`${isAmp ? 'non-opaque' : ''} mb-caption
         `}
      >
        <div className="caption">
          <h1 dangerouslySetInnerHTML={{ __html: bannerHeading }}></h1>
        </div>

        {hideCTA ? null : (
          <ButtonWrapper>
            <Button
              fillType="whiteBordered"
              onClick={scrollTicketSection}
              on="tap:tour-list-heading.scrollTo(duration='1200', position='top')"
            >
              {bannerCtaText || strings.BANNER_CTA}
            </Button>
          </ButtonWrapper>
        )}
      </div>
    </div>
  );

  if (isAmp)
    return (
      <StyledBanner isAmp>
        {getAmpBanner(bannerImages)}
        {captions}
      </StyledBanner>
    );

  const { ASPECT_RATIO, WIDTH } =
    isMobile || isAmp ? BANNER_PARAMS.MOBILE : BANNER_PARAMS.DESKTOP;

  const textOverLay = (isFirst = false) => (
    <div className="overlay-container">
      <div className={`mb-captions`}>
        <div className={`mb-caption active`}>
          <div className="caption">
            {isFirst ? (
              <h1 dangerouslySetInnerHTML={{ __html: bannerHeading }}></h1>
            ) : (
              <p dangerouslySetInnerHTML={{ __html: bannerHeading }}></p>
            )}
          </div>

          <Conditional if={!hideCTA}>
            <ButtonWrapper>
              <Button
                fillType="whiteBordered"
                onClick={scrollTicketSection}
                fontSize={'1.125rem'}
              >
                {bannerCtaText || strings.BANNER_CTA}
              </Button>
            </ButtonWrapper>
          </Conditional>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <StyledBanner>
        {bannerImages?.length === 1 ? (
          <div className="mb-slide single-slide">
            <Image
              width={WIDTH}
              aspectRatio={ASPECT_RATIO}
              url={bannerImages[0]?.url}
              dontLazyLoad
              mobileUrl={bannerImages[0]?.mobileUrl}
              alt={bannerImages[0]?.alt || 'banner'}
              addDarkOverlay
            />
            {textOverLay(true)}
          </div>
        ) : (
          <Swiper {...swiperParams} getSwiper={updateSwiper}>
            {bannerImages?.map((image, index) => {
              return (
                <div key={index} className="swiper-slide mb-slide">
                  <Image
                    key={index}
                    width={WIDTH}
                    aspectRatio={ASPECT_RATIO}
                    url={image?.url}
                    mobileUrl={image?.mobileUrl}
                    alt={image?.alt || 'banner'}
                    addDarkOverlay
                    dontLazyLoad={index === 0}
                    autoCrop={false}
                  />
                  {textOverLay(swiper?.realIndex === index)}
                </div>
              );
            })}
          </Swiper>
        )}
      </StyledBanner>

      {bannerSubtext?.length ? (
        <BannerSubtext>{bannerSubtext}</BannerSubtext>
      ) : null}
    </div>
  );
};

export default Banner;

/**
 * Styled components
 */
const StyledBanner = styled.div`
  display: grid;
  height: 400px;
  width: 100%;
  margin: 1rem auto;

  position: relative;
  font-family: ${SOLEIL.FONT_STACK};
  margin-bottom: 12px;

  .single-slide {
    margin: 0 auto;
  }

  .image-wrapper {
    background: rgba(34, 34, 34, 0.6);
    z-index: 0;
  }
  .mb-slide {
    aspect-ratio: 3;
    max-height: 400px;
    max-width: ${SIZES.MAX_WIDTH};
    background: rgba(34, 34, 34, 0.6);
    border-radius: 0.75rem;
    cursor: pointer;
    position: relative;
  }

  .mb-slide img {
    height: 100%;
    width: 100%;
    border-radius: 0.75rem;
    object-fit: cover;
    object-position: 0% 25%;
  }

  .swiper-slide {
    transform: scale(0.9);
    transition: all 0.7s ease-in-out;
  }

  .swiper-slide-active {
    transform: scale(1);
  }

  .mb-captions {
    z-index: 1;
    height: 100%;
    width: 100%;
    display: grid;
    place-content: center;
    text-align: center;
  }

  .absolute-position {
    position: absolute;
  }

  .mb-captions .caption h1,
  .mb-captions .caption p {
    font-size: 2.25rem;
    color: #fff;
    line-height: 122%;
    letter-spacing: -0.5px;
    max-width: 30vw;
    font-weight: 600;
  }

  .mb-captions .mb-caption {
    opacity: 0;
    grid-row: 1;
    grid-column: 1 / 2;
    display: grid;
    align-self: center;
    grid-gap: 14px;
    justify-items: center;
    transition: opacity 0.3s ease-in-out;
    .tag {
      justify-self: center;
    }
  }
  p {
    color: ${COLORS.WHITE};
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    margin-top: 0;
    margin-bottom: 12px;
  }
  .mb-captions .df-caption {
    grid-row-gap: 12px;
    h1,
    .h1 {
      margin-top: 0;
      margin-bottom: 16px;
    }
  }

  .mb-captions .df-caption {
    grid-row-gap: 12px;
    h1,
    .h1 {
      margin-top: 0;
      margin-bottom: 16px;
    }
  }

  .mb-captions .mb-caption.active {
    opacity: 1;
  }

  .mb-captions .mb-cta {
    background-color: rgba(0, 0, 0, 0.35);
    border: solid white 1px;
    text-transform: uppercase;
    font-weight: 400;
    letter-spacing: 1.2px;
    cursor: pointer;
    padding: 15px 40px;
    justify-self: center;
    color: #fff;
    font-size: 16px;
  }
  .mb-captions .mb-cta:hover {
    background: rgba(0, 0, 0, 0.5);
  }

  .mb-caption a {
    text-decoration: none;
  }

  .overlay-container {
    z-index: 2;
    transform: translateZ(1000);
    pointer-events: none;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0%;
    top: 0;
  }

  @media (max-width: 768px) {
    margin: 1rem 0;
    max-height: 200px;

    .swiper-slide {
      transform: scale(0.95) !important;
      -webkit-transform: scale(0.95);
    }

    .swiper-slide-active {
      transform: scale(1) !important;
      -webkit-transform: scale(1);
    }

    .mb-slide {
      aspect-ratio: 16/9;
      height: 100%;
    }

    .mb-captions .mb-caption {
      justify-items: left;
      max-width: 85%;
      z-index: 1;
      margin-top: 2.5rem;
      margin-left: ${({ isAmp }) => (isAmp ? '3.4rem' : '1.125rem')};
    }

    .mb-captions {
      text-align: left;
      align-items: end;
      background: unset;
      place-content: center;
      width: max-content;

      .caption h1,
      .caption p {
        font-weight: 600;
        font-size: 21px;
        line-height: 133%;
        margin: 0;
        max-width: ${({ isAmp }) => (isAmp ? '70vw' : '85vw')};
      }
    }
    .mb-captions .df-caption {
      .tag {
        justify-self: left;
      }
      h1,
      .h1 {
        margin-bottom: 12px;
      }
      p {
        margin: 0;
      }
    }

    .mb-captions .non-opaque {
      opacity: 1;
    }

    .overlay-container {
      height: auto;
      bottom: 0;
      z-index: 2;
    }
  }
`;

const ButtonWrapper = styled.div`
  pointer-events: auto;
  @media (max-width: 768px) {
    button {
      font-size: 14px;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      font-weight: normal;
    }
  }
`;

const BannerSubtext = styled.em`
  display: block;
  text-align: center;
  font-style: italic;
  font-size: 0.875rem;
  color: ${COLORS.GREY_G4};
  margin: 0 1rem 1rem;

  @media (max-width: 768px) {
    font-size: 0.6875rem;
    text-align: left;
    margin: 0 1rem 0.75rem;
  }
`;

const StyledPlaceHolder = styled.div`
  height: 400px;
  margin: 1rem auto 12px;
  background-color: rgba(0, 0, 0, 0.15);
  max-width: 1200px;
  border-radius: 0.5rem;
  @media (max-width: 768px) {
    border-radius: initial;
    max-height: 200px;
    margin: 1rem 0;
  }
`;
