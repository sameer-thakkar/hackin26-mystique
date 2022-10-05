import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';
import { scroller } from 'react-scroll';
import styled from 'styled-components';
import Image from 'UI/Image';
import { SIZES } from 'const/ui-constants';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';
import { stringIdfy, withShortcodes } from 'utils/helper';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PAGE_TYPES,
} from 'const/index';
import { MBContext } from 'contexts/MBContext';
import Conditional from 'components/common/Conditional';

const Swiper = dynamic(() => import('components/Swiper'));

const StyledBanner = styled.div`
  display: grid;
  height: 400px;
  width: 100%;
  margin: 1rem auto;
  position: relative;
  margin-bottom: 12px;

  .single-slide {
    margin: auto;
    position: relative;
    aspect-ratio: 3;
    max-height: 400px;
    max-width: ${SIZES.MAX_WIDTH};
  }

  .single-slide img {
    transform: scale(1.1);
    border-radius: 0.75rem;
    object-fit: cover;
    object-position: 0% 50%;
  }

  .mb-slide {
    aspect-ratio: 3;
    max-height: 400px;
    max-width: ${SIZES.MAX_WIDTH};
    background: rgba(34, 34, 34, 0.6);
    border-radius: 0.75rem;
    position: relative;
  }

  .mb-slide img {
    height: 100%;
    width: 100%;
    border-radius: 0.75rem;
    object-fit: cover;
    object-position: center;
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
  }

  .mb-captions .caption h1 {
    ${expandFontToken('Display/Regular')}
    color: ${COLORS.BRAND.WHITE};
  }

  .mb-captions .mb-caption {
    opacity: 0;
    grid-row: 1;
    grid-column: 1 / 2;
    display: grid;
    align-self: center;
    margin-left: 80px;
  }

  .mb-captions .mb-caption.active {
    opacity: 1;
  }

  .overlay-container {
    z-index: 2;
    pointer-events: none;
    position: absolute;
    width: 50%;
    height: 100%;
    left: 0;
    top: 0;
  }

  @media (max-width: 768px) {
    margin: ${({ bannerImages }) =>
      bannerImages.length === 1 ? '2rem 0' : '1rem 0'};
    height: unset;
    .swiper-slide {
      transform: scale(0.95);
      -webkit-transform: scale(0.95);
    }

    .swiper-slide-active {
      transform: scale(1);
      -webkit-transform: scale(1);
    }

    .single-slide,
    .mb-slide {
      aspect-ratio: 16 / 10;
      width: auto;
      height: auto;
      max-height: 57vw; /** maintaining aspect ratio */
    }

    .mb-captions .mb-caption {
      z-index: 1;
      margin: unset;
      align-self: end;
    }
    
    .mb-captions .caption h1 {
        ${expandFontToken('Heading/Small')}
        margin: auto 24px 24px;
    }

    .overlay-container {
      width: 90%;
      z-index: 2;
    }
  }
`;

const NewBanner = (props) => {
  const {
    bannerImages,
    isMobile,
    ready,
    isEntertainmentMb,
    availableTours,
  } = props;
  const [swiper, updateSwiper] = useState(null);
  const { lang } = useContext(MBContext);

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
    initialSlide: 3,
    loop: true,
    loopedSlides: 3,
  };

  const analyticsParams = {
    [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
    [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
    [ANALYTICS_PROPERTIES.TGIDS]: availableTours,
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
  }, [isSwiperSet]);

  const trackBannerClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.CTA_CLICKED,
      Ranking: swiper.realIndex + 1,
      ...analyticsParams,
    });
  };

  const scrollToSection = (sectionId) => {
    scroller.scrollTo(sectionId, {
      duration: 1000,
      delay: 4000,
      smooth: 'easeInQuad',
      offset: -75,
    });
  };

  const handleInteraction = (interaction) => {
    if (interaction) {
      const [type, target] = interaction.split(':');
      switch (type.toLowerCase().trim()) {
        case 'section':
          scrollToSection(stringIdfy(target));
      }
    }
  };

  const getShowPageUrl = (image) =>
    typeof image?.showPageUrl === 'string'
      ? image?.showPageUrl
      : image?.showPageUrl?.url;

  const BANNER_PARAMS = {
    DESKTOP: {
      ASPECT_RATIO: '3:1',
      WIDTH: '900',
    },
    MOBILE: {
      ASPECT_RATIO: '16:9',
      WIDTH: '400',
    },
  };

  const { ASPECT_RATIO, WIDTH } = isMobile
    ? BANNER_PARAMS.MOBILE
    : BANNER_PARAMS.DESKTOP;

  const textOverLay = (bannerHeading) => {
    const parsedBannerHeading = withShortcodes(bannerHeading).join('');
    return (
      <div className="overlay-container">
        <div className={`mb-captions`}>
          <div className={`mb-caption active`}>
            <div className="caption">
              <h1>{parsedBannerHeading}</h1>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <StyledBanner bannerImages={bannerImages}>
        {bannerImages?.length === 1 ? (
          <div
            className={`swiper-slide single-slide ${
              bannerImages[0].interaction ? 'pointer' : ''
            }`}
            onClick={
              !isEntertainmentMb
                ? () => handleInteraction(bannerImages[0].interaction)
                : undefined
            }
          >
            <Conditional if={isEntertainmentMb}>
              <a
                target={isMobile ? '_self' : '_blank'}
                rel="noopener noreferrer"
                href={getShowPageUrl(bannerImages[0])}
              >
                <Image
                  width={WIDTH}
                  aspectRatio={ASPECT_RATIO}
                  url={
                    ready &&
                    (isMobile && bannerImages[0].mobile_url
                      ? bannerImages[0].mobile_url
                      : bannerImages[0].url)
                  }
                  alt={bannerImages[0]?.alt || 'banner'}
                  dontLazyLoad={true}
                  imageId={stringIdfy(bannerImages[0].alt || '')}
                />
                <Conditional if={bannerImages[0].bannerHeading}>
                  {textOverLay(bannerImages[0].bannerHeading)}
                </Conditional>
              </a>
            </Conditional>
            <Conditional if={!isEntertainmentMb}>
              <Image
                width={WIDTH}
                aspectRatio={ASPECT_RATIO}
                url={
                  ready &&
                  (isMobile && bannerImages[0].mobile_url
                    ? bannerImages[0].mobile_url
                    : bannerImages[0].url)
                }
                onClick={() => {
                  trackEvent({
                    eventName: ANALYTICS_EVENTS.MB_BANNER.CTA_CLICKED,
                    ...analyticsParams,
                  });
                }}
                alt={bannerImages[0]?.alt || 'banner'}
                dontLazyLoad={true}
                imageId={stringIdfy(bannerImages[0].alt || '')}
              />
            </Conditional>
          </div>
        ) : (
          <Swiper {...swiperParams} getSwiper={updateSwiper}>
            {bannerImages?.map((image, index) => {
              return (
                <div
                  key={index}
                  className={`swiper-slide mb-slide ${
                    image.interaction ? 'pointer' : ''
                  }`}
                  onClick={
                    !isEntertainmentMb
                      ? () => handleInteraction(image.interaction)
                      : undefined
                  }
                >
                  <Conditional if={isEntertainmentMb}>
                    <a
                      target={isMobile ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      href={getShowPageUrl(image)}
                      onClick={() => trackBannerClick()}
                    >
                      <Image
                        width={WIDTH}
                        aspectRatio={ASPECT_RATIO}
                        url={
                          ready &&
                          (isMobile && image.mobile_url
                            ? image.mobile_url
                            : image.url)
                        }
                        alt={image?.alt || 'banner'}
                        dontLazyLoad={true}
                        imageId={stringIdfy(image.alt || '') + index}
                      />
                      <Conditional if={image.bannerHeading}>
                        {textOverLay(image.bannerHeading)}
                      </Conditional>
                    </a>
                  </Conditional>
                  <Conditional if={!isEntertainmentMb}>
                    <Image
                      width={WIDTH}
                      aspectRatio={ASPECT_RATIO}
                      url={
                        ready &&
                        (isMobile && image.mobile_url
                          ? image.mobile_url
                          : image.url)
                      }
                      alt={image?.alt || 'banner'}
                      dontLazyLoad={true}
                      imageId={stringIdfy(image.alt || '') + index}
                    />
                  </Conditional>
                </div>
              );
            })}
          </Swiper>
        )}
      </StyledBanner>
    </div>
  );
};

export default NewBanner;
