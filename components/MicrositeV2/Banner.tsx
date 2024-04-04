import React, { useContext, useEffect, useState } from 'react';
import { scroller } from 'react-scroll';
import dynamic from 'next/dynamic';
import styled, { css } from 'styled-components';
import { useRecoilValue } from 'recoil';
import type { SwiperProps } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import {
  checkIfLTTMBLandingPage,
  stringIdfy,
  withShortcodes,
} from 'utils/helper';
import { appAtom } from 'store/atoms/app';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PAGE_TYPES,
} from 'const/index';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

const swiperDuplicateSlideCount = 3;
const BANNER_PARAMS = {
  DESKTOP: {
    ASPECT_RATIO: '3:1',
    WIDTH: '1200',
    HEIGHT: '400',
  },
  MOBILE: {
    ASPECT_RATIO: '16:9',
    WIDTH: '400',
    HEIGHT: '225',
  },
};
interface IStyledBanner {
  bannerCount: number;
  isMounted: boolean;
  isMobile: boolean;
  duplicateSlideCount: number;
  initialSlide: number;
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
    ${({ isMounted, duplicateSlideCount, initialSlide, isMobile }) => {
      // Handles before mount position of active slide. can be removed if loopSlides is off.
      // Added since it takes few seconds for Swiper to bootup.
      let slideWidth = '0',
        partialSlideWidth = '0';
      if (isMobile) {
        slideWidth = `(100vw / 1.1)`; // 1.1 => slidesPerView
        partialSlideWidth = `((100vw - ${slideWidth}))`;
      } else {
        slideWidth = `${BANNER_PARAMS.DESKTOP.WIDTH}px`;
        partialSlideWidth = `(100vw - (100vw - 100%) - ${slideWidth})`; // screenWidth - (scrollbar width) - slide width
      }

      return isMounted
        ? ``
        : css`
            transform: translate3d(
              calc(
                /*((width of one partial slide) - (offset position px from duplicate slides to active slide)) */
                  (${partialSlideWidth} / 2) -
                  (${duplicateSlideCount + initialSlide} * ${slideWidth})
              ),
              0,
              0
            ) !important;
          `;
    }}
  }

  .swiper-android .swiper-slide,
  .swiper-wrapper {
    transform: none;
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
    border-radius: 0.75rem;
    object-fit: cover;
    object-position: 0% 50%;
  }

  .swiper-slide {
    max-height: 400px;
    max-width: ${SIZES.MAX_WIDTH};
    .image-wrap {
      position: unset;
    }

    aspect-ratio: 3;
    background: rgba(34, 34, 34, 0.6);
    border-radius: 0.75rem;
    position: relative;
    height: max-content;

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
    transform: scale(0.9) !important;
    transition: all 0.7s ease-in-out;
  }

  .swiper-slide-active {
    transform: scale(1) !important;
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

  a {
    display: flex;
    height: ${BANNER_PARAMS.DESKTOP.HEIGHT}px;
  }

  @media (max-width: 768px) {
    margin: ${({ bannerCount }) => (bannerCount === 1 ? '2rem 0' : '1rem 0')};
    height: 13.75rem;
    .swiper-slide {
      transform: scale(0.95) !important;
      -webkit-transform: scale(0.95) !important;
      width: calc(100vw / 1.1);
    }

    .swiper-slide-active {
      transform: scale(1) !important;
      -webkit-transform: scale(1) !important;
    }

    .single-slide,
    .mb-slide {
      aspect-ratio: 16 / 10;
      width: 100%;
      height: 13.75rem;
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
    a {
      height: ${BANNER_PARAMS.MOBILE.HEIGHT}px;
    }
  }
`;

const initialSlide = 1;

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
    delay: 6000,
    disableOnInteraction: false,
  },
  initialSlide,
  loop: true,
  loopedSlides: swiperDuplicateSlideCount,
};

const NewBanner: React.FC<any> = (props) => {
  const { bannerImages, ready, isEntertainmentMb, availableTours } = props;
  const [swiper, updateSwiper] = useState<SwiperClass>();
  const [isMounted, setMounted] = useState(false);
  const { lang, uid } = useContext(MBContext);
  const { isMobile } = useRecoilValue(appAtom);

  const isLtt = checkIfLTTMBLandingPage(uid);

  const analyticsParams = {
    [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
    [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
    [ANALYTICS_PROPERTIES.TGIDS]: availableTours,
  };

  const isSwiperSet = swiper && !swiper?.destroyed;

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
              <h1 dangerouslySetInnerHTML={{ __html: parsedBannerHeading }} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getBannerImageUrl = (image: Record<string, any>, index: number) => {
    const LTT_CONTROL_HARDCODED_BANNER_IMAGES_IN_ORDER = [
      `https://cdn-imgix-open.headout.com/ltt-control-banners/${
        isMobile ? 'mobile' : 'desktop'
      }/lion-king.png`,
      `https://cdn-imgix-open.headout.com/ltt-control-banners/${
        isMobile ? 'mobile' : 'desktop'
      }/frozen.jpg`,
      `https://cdn-imgix-open.headout.com/ltt-control-banners/${
        isMobile ? 'mobile' : 'desktop'
      }/phantom-of-the-opera.jpg`,
      `https://cdn-imgix-open.headout.com/ltt-control-banners/${
        isMobile ? 'mobile' : 'desktop'
      }/les-miserables.jpg`,
      `https://cdn-imgix-open.headout.com/ltt-control-banners/${
        isMobile ? 'mobile' : 'desktop'
      }/mamma-mia.jpg`,
      `https://cdn-imgix-open.headout.com/ltt-control-banners/${
        isMobile ? 'mobile' : 'desktop'
      }/abba.jpg`,
    ];
    if (isLtt && index !== 0) {
      return (
        LTT_CONTROL_HARDCODED_BANNER_IMAGES_IN_ORDER[index - 1] ||
        (isMobile && image.mobile_url ? image.mobile_url : image.url)
      );
    }
    return isMobile && image.mobile_url ? image.mobile_url : image.url;
  };

  return (
    <div>
      <StyledBanner
        bannerCount={bannerImages?.length}
        duplicateSlideCount={swiperDuplicateSlideCount}
        initialSlide={initialSlide}
        isMounted={isMounted}
        isMobile={isMobile}
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
                rel="noopener"
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
              <Conditional if={bannerImages[0].bannerHeading}>
                {textOverLay(bannerImages[0].bannerHeading)}
              </Conditional>
            </Conditional>
          </div>
        ) : (
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
                      rel="noopener"
                      href={getShowPageUrl(image)}
                      onClick={() => trackBannerClick()}
                    >
                      <Image
                        width={WIDTH}
                        aspectRatio={ASPECT_RATIO}
                        fill
                        url={ready && getBannerImageUrl(image, index)}
                        alt={image?.alt || 'banner'}
                        priority={[
                          initialSlide,
                          bannerImages.length - swiperDuplicateSlideCount,
                        ].includes(index)}
                        imageId={stringIdfy(image.alt || '') + index}
                      />
                      <Conditional
                        if={image.bannerHeading && !(isLtt && index !== 0)}
                      >
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
                    <Conditional if={image.bannerHeading}>
                      {textOverLay(image.bannerHeading)}
                    </Conditional>
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
