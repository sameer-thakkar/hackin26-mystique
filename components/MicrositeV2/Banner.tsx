import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';
import { scroller } from 'react-scroll';
import styled from 'styled-components';
import Image from 'UI/Image';
import { SIZES } from 'const/ui-constants';
import { stringIdfy } from 'utils/helper';
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
    lazy: true,
    preloadImages: false,
  };

  const analyticsParams = {
    [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
    [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
    [ANALYTICS_PROPERTIES.TGIDS]: availableTours,
    [ANALYTICS_PROPERTIES.MB_NAME]: '',
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
    swiper?.on('touchEnd', () => {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MB_BANNER.BANNER_SCROLL,
        ...analyticsParams,
      });
    });
  }, [isSwiperSet]);

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
