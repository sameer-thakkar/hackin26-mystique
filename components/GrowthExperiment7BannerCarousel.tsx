import React, { useEffect, useLayoutEffect, useState } from 'react';
import { scroller } from 'react-scroll';
import { strings } from 'const/strings';
import { withShortcodes } from 'utils/helper';
import { SOLEIL, COLORS, SIZES } from 'const/ui-constants';
import styled from 'styled-components';
import { VARIANTS } from 'const/experiments';
import { RIGHT_CIRCLE_ARROW } from 'assets/SvgIcons';
import { ANALYTICS_EVENTS } from 'const/index';
import { ANALYTICS_PROPERTIES } from 'const/index';
import { PAGE_TYPES } from 'const/index';
import { trackEvent } from 'utils/analytics';
import Swiper from 'components/Swiper';
import Cookies from 'js-cookie';

import Conditional from './common/Conditional';
import Banner from './Banner';
import Button from './UI/Button';
import Image from './UI/Image';
import { useRecoilValue } from 'recoil';
import { hsidSetFailAtom } from 'store/atoms/hsid';

type TBannerCarouselProps = {
  bannerImages: {
    url: string;
    alt: string;
    mobileUrl?: string;
  }[];
  bannerHeading: string;
  bannerSubtext: string;
  bannerCtaText: string;
  isMobile: boolean;
  boxed: boolean;
  hideCTA: boolean;
  isAmp: boolean;
  orderedTgids: string[];
};

/**
 * Renders a banner carousel depending on the result of A/B/C bucket
 */

function GrowthExperiment7BannerCarousel({
  bannerCarouselProps,
  variant,
}: {
  bannerCarouselProps: TBannerCarouselProps;
  variant: string;
}) {
  const hasHsidSetFailed = useRecoilValue(hsidSetFailAtom);

  useEffect(() => {
    if (hasHsidSetFailed) {
      const bannerHeading = withShortcodes(bannerCarouselProps?.bannerHeading);

      trackEvent({
        eventName: 'Third party cookie blocked',
        [ANALYTICS_PROPERTIES.TGIDS]: bannerCarouselProps?.orderedTgids,
        [ANALYTICS_PROPERTIES.MB_NAME]: bannerHeading?.join(' '),
      });
    }
  }, [hasHsidSetFailed]);

  if (hasHsidSetFailed && bannerCarouselProps.isMobile) {
    return <Banner {...bannerCarouselProps} />;
  }

  if (!variant && !bannerCarouselProps.isAmp) {
    return <StyledPlaceHolder />;
  }

  if (variant === VARIANTS.NEW_BANNER_CAROUSEL_WITHOUT_CTA) {
    return (
      <BannerCarousel {...bannerCarouselProps} showTextCTA variant={variant} />
    );
  }

  if (variant === VARIANTS.NEW_BANNER_CAROUSEL_WITH_CTA) {
    return <BannerCarousel {...bannerCarouselProps} variant={variant} />;
  }

  return <Banner {...bannerCarouselProps} variant={variant} />;
}

export default GrowthExperiment7BannerCarousel;

/**
 * New Banner Carousel
 */

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
  effect: 'card',
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
    WIDTH: '400',
  },
};

const renderAmpBanners = (image) => {
  const { url, alt } = image;
  return (
    <Image
      width="411"
      height="400"
      url={url}
      alt={alt || 'banner'}
      layout={'fill'}
      className="banner-image"
      addDarkOverlay
    />
  );
};

const getAmpBanner = (bannerImages) => (
  <amp-carousel
    width="411"
    height="400"
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

const BannerCarousel = (props) => {
  const {
    bannerHeading: tempBannerHeading,
    bannerImages,
    hideCTA,
    showTextCTA,
    isAmp,
    bannerSubtext: tempBannerSubtext,
    bannerCtaText = '',
    orderedTgids,
    variant,
  } = props;

  const [isMobile, setIsMobile] = useState(null);
  const [swiper, updateSwiper] = useState(null);

  useLayoutEffect(() => {
    const mobileCheck = window.innerWidth < 768;
    if (mobileCheck) {
      setIsMobile(mobileCheck);
    }
  }, []);

  const bannerHeading = withShortcodes(tempBannerHeading);

  const analyticsParams = {
    [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
    [ANALYTICS_PROPERTIES.TGIDS]: orderedTgids,
    [ANALYTICS_PROPERTIES.MB_NAME]: bannerHeading?.join(' '),
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
        Variant: variant,
      });
    });
  }, [isSwiperSet]);

  const scrollTicketSection = () => {
    scroller.scrollTo('tour-list-heading', {
      duration: 1200,
      offset: isMobile ? -80 : -100,
      smooth: 'easeInOutQuart',
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.CTA_CLICKED,
      ...analyticsParams,
      'CTA Type': showTextCTA
        ? VARIANTS.NEW_BANNER_CAROUSEL_WITHOUT_CTA
        : VARIANTS.NEW_BANNER_CAROUSEL_WITH_CTA,
      Ranking: swiper.realIndex + 1,
    });
  };

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
          <h1>{bannerHeading}</h1>
        </div>
        {hideCTA ? null : (
          <ButtonWrapper>
            <Button
              type="whiteBordered"
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
      <StyledBanner>
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
            {isFirst ? <h1>{bannerHeading}</h1> : <p>{bannerHeading}</p>}
          </div>

          <Conditional if={!hideCTA}>
            {showTextCTA ? (
              <TextCTA>
                {bannerCtaText || strings.BANNER_CTA}
                <RIGHT_CIRCLE_ARROW />
              </TextCTA>
            ) : (
              <ButtonWrapper>
                <Button
                  type="whiteBordered"
                  onClick={scrollTicketSection}
                  fontSize={'1.125rem'}
                >
                  {bannerCtaText || strings.BANNER_CTA}
                </Button>
              </ButtonWrapper>
            )}
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
              onClick={showTextCTA ? scrollTicketSection : undefined}
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
                    onClick={showTextCTA ? scrollTicketSection : undefined}
                    key={index}
                    width={WIDTH}
                    aspectRatio={ASPECT_RATIO}
                    url={image?.url}
                    mobileUrl={image?.mobileUrl}
                    alt={image?.alt || 'banner'}
                    addDarkOverlay
                    dontLazyLoad={index === 0}
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
    max-width: 27vw;
    font-weight: 600;
    /* margin: 0 auto; */
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
    z-index: 10;
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
    /* background-color: black; */
    z-index: 10;
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
      transform: scale(0.95);
      -webkit-transform: scale(0.95);
    }

    .swiper-slide-active {
      transform: scale(1);
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
      margin-left: 1.125rem;
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
        max-width: 85vw;
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

const TextCTA = styled.div`
  color: #fff;
  font-weight: 600;
  font-size: 1.5rem;

  display: flex;
  align-items: center;

  svg {
    margin-left: 0.5rem;
    vertical-align: end;
    height: 100%;
    width: 1.2rem;
    margin-top: 0.15rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
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
  height: 380px;
  margin: 1rem auto;
  background-color: rgba(0, 0, 0, 0.15);
  max-width: 1200px;
  border-radius: 0.5rem;
  @media (max-width: 768px) {
    border-radius: initial;
    height: 200px;
  }
`;
