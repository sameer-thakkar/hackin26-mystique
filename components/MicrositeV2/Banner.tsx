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
import type { SwiperProps } from 'swiper/react';

const Swiper = dynamic(() =>
  import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

const loopedSlides = 3;

interface IStyledBanner {
  bannerCount: number;
  isMounted: boolean;
  loopedSlides: number;
}

const StyledBanner = styled.div<IStyledBanner>`
  display: grid;
  height: 400px;
  width: 100%;
  margin: 1rem auto;
  position: relative;
  margin-bottom: 12px;

  .swiper-wrapper {
    max-width: 100vw;
    
    @media (min-width: 768px) {
      ${({ isMounted, loopedSlides }) => {
        const slideWidth = parseInt(SIZES.MAX_WIDTH);

        return isMounted
          ? ``
          : `transform: translate(calc(calc(calc(100vw - ${slideWidth}px)/2) - ${
              loopedSlides * slideWidth
            }px), 0)`;
      }}
    }
  }
  
  .swiper-initialized {
    width: 100%;
  }

  .single-slide {
    margin: auto;
    width: 100%;
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
  
  .swiper-slide {
    max-height: 400px;
    max-width: ${SIZES.MAX_WIDTH};

    aspect-ratio: 3;
    background: rgba(34, 34, 34, 0.6);
    border-radius: 0.75rem;
    position: relative;

    @media (min-width: 768px) {
      background: transparent;
    }
  }

  .mb-slide {
    aspect-ratio: 3;
    background: rgba(34, 34, 34, 0.6);
    border-radius: 0.75rem;
    position: relative;

    @media (min-width: 768px) {
      background: transparent;
    }
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
    margin: ${({ bannerCount }) => (bannerCount === 1 ? '2rem 0' : '1rem 0')};
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

const swiperParams: SwiperProps = {
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
  initialSlide: 1,
  loop: true,
  loopedSlides,
};

const initialSlide = 3;

const NewBanner: React.FC<any> = (props) => {
  const {
    bannerImages,
    isMobile,
    ready,
    isEntertainmentMb,
    availableTours,
  } = props;
  const [swiper, updateSwiper] = useState(null);
  const [isMounted, setMounted] = useState(false);
  const { lang } = useContext(MBContext);

  const analyticsParams = {
    [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
    [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
    [ANALYTICS_PROPERTIES.TGIDS]: availableTours,
  };

  const isSwiperSet = swiper !== null && !(swiper as any)?.destroyed;

  useEffect(() => {
    setMounted(true);
  }, []);

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
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      Ranking: swiper.realIndex + 1,
      ...analyticsParams,
    });
  };

  const scrollToSection = (sectionId: string) => {
    scroller.scrollTo(sectionId, {
      duration: 1000,
      delay: 4000,
      smooth: 'easeInQuad',
      offset: -75,
    });
  };

  const handleInteraction = (interaction: string) => {
    if (interaction) {
      const [type, target] = interaction.split(':');
      switch (type.toLowerCase().trim()) {
        case 'section':
          scrollToSection(stringIdfy(target));
      }
    }
  };

  const getShowPageUrl = (image: any) =>
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

  const textOverLay = (bannerHeading: string) => {
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
      <StyledBanner
        bannerCount={bannerImages?.length}
        loopedSlides={loopedSlides}
        isMounted={isMounted}
      >
        {bannerImages?.length === 1 ? (
          <div
            className={`single-slide ${
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
                  fill
                  url={
                    ready &&
                    (isMobile && bannerImages[0].mobile_url
                      ? bannerImages[0].mobile_url
                      : bannerImages[0].url)
                  }
                  alt={bannerImages[0]?.alt || 'banner'}
                  priority
                  imageId={stringIdfy(bannerImages[0].alt || '')}
                />
                <Conditional if={bannerImages[0].bannerHeading}>
                  {textOverLay(bannerImages[0].bannerHeading)}
                </Conditional>
              </a>
            </Conditional>
            <Conditional if={!isEntertainmentMb}>
              <Image
                aspectRatio={ASPECT_RATIO}
                fill
                autoCrop={!isMobile ? false : true}
                fitCrop={!isMobile ? true : false}
                cropMode={!isMobile ? 'edges' : ''}
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
              />
            </Conditional>
          </div>
        ) : (
          // @ts-expect-error TS(2322): Type 'Dispatch<SetStateAction<null>>' is not assig... Remove this comment to see the full error message
          <Swiper {...swiperParams} onSwiper={updateSwiper}>
            {bannerImages?.map((image: any, index: number) => {
              return (
                <div
                  key={index}
                  className={`mb-slide ${image.interaction ? 'pointer' : ''}`}
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
                        fill
                        url={
                          ready &&
                          (isMobile && image.mobile_url
                            ? image.mobile_url
                            : image.url)
                        }
                        alt={image?.alt || 'banner'}
                        priority={index === initialSlide}
                        imageId={stringIdfy(image.alt || '') + index}
                      />
                      <Conditional if={image.bannerHeading}>
                        {textOverLay(image.bannerHeading)}
                      </Conditional>
                    </a>
                  </Conditional>
                  <Conditional if={!isEntertainmentMb}>
                    <Image
                      fill
                      aspectRatio={ASPECT_RATIO}
                      autoCrop={!isMobile ? false : true}
                      fitCrop={!isMobile ? true : false}
                      cropMode={!isMobile ? 'edges' : ''}
                      url={
                        ready &&
                        (isMobile && image.mobile_url
                          ? image.mobile_url
                          : image.url)
                      }
                      alt={image?.alt || 'banner'}
                      priority
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
