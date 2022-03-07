import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import { scroller } from 'react-scroll';
import Button from 'components/UI/Button';
import Image from 'components/UI/Image';
import Conditional from 'components/common/Conditional';
import { strings } from 'const/strings';
import { SOLEIL, COLORS } from 'const/ui-constants';
import { withShortcodes } from 'utils/helper';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PAGE_TYPES,
} from 'const/index';
import { VARIANTS } from 'const/experiments';


const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const StyledBanner = styled.div`
  display: grid;
  height: 400px;
  width: 100%;
  position: relative;
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.16);
  background: rgba(34, 34, 34, 0.6);
  font-family: ${SOLEIL.FONT_STACK};
  margin-bottom: 24px;

  .mb-slide img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: 20% 10%;
  }

  .single-slide {
    height: 400px;
  }
  .mb-captions {
    z-index: 0;
    height: 100%;
    width: 100%;
    display: grid;
    place-content: center;
    text-align: center;
  }
  .swiper-pagination.swiper-pagination-bullets {
    top: unset;
    display: block;
  }
  .swiper-pagination-bullet {
    width: 10px;
    height: 10px;
    background: transparent;
    border: 2px solid #fff;
  }
  .swiper-pagination-bullet-active {
    background: #fff;
  }

  .absolute-position {
    position: absolute;
  }

  .mb-captions .caption h1,
  .mb-captions .caption .h1 {
    font-size: 24px;
    color: #fff;
    line-height: 1.2;
  }

  .mb-captions {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
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
    z-index: 1;
    pointer-events: none;
    position: absolute;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 768px) {
    .mb-captions .mb-caption {
      justify-items: left;
      margin-bottom: 24px;
      margin-left: 16px;
      max-width: 85%;
      z-index: 1;
    }
    .mb-captions.with-indicators .mb-caption {
      margin-bottom: 56px;
      align-self: end;
    }

    .mb-captions {
      place-content: unset;
      text-align: left;
      align-items: end;
      background: unset;
      .caption h1,
      .caption .h1 {
        font-weight: 500;
        font-size: 20px;
        line-height: 120%;
        margin: 0;
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

    .swiper-pagination.swiper-pagination-bullets {
      grid-template-columns: repeat(auto-fill, 7px);
      display: grid;
      bottom: 24px;
      margin-left: 16px;
    }
    .swiper-pagination-bullet {
      width: 6px;
      height: 6px;
      background: rgba(255, 255, 255, 0.35);
      border: unset;
    }
    .swiper-pagination-bullet-active {
      background: rgba(255, 255, 255);
      transform: scale(1.3);
    }

    .mb-captions .non-opaque {
      opacity: 1;
    }

    .banner-image {
      object-fit: cover;
      img {
        object-fit: cover;
        object-position: 20% 10%;
      }
    }
  }
`;

export const BANNER_PARAMS = {
  DESKTOP: {
    ASPECT_RATIO: '4.5:1',
    WIDTH: '1200',
  },
  MOBILE: {
    ASPECT_RATIO: '1:1.07',
    WIDTH: '500',
  },
};

const ButtonWrapper = styled.div`
  pointer-events: auto;
  @media (max-width: 768px) {
    button {
      font-size: 14px;
      padding: 13px 25px;
    }
  }
`;

const Banner = (props) => {
  const [isMobile, setIsMobile] = useState(null);
  const [swiper, updateSwiper] = useState(null);

  const {
    currentLanguage,
    orderedTgids,
    bannerHeading: tempBannerHeading,
    bannerImages,
    hideCTA,
    isAmp,
    bannerSubtext: tempBannerSubtext,
    bannerCtaText = '',
  } = props;
  const bannerHeading = withShortcodes(tempBannerHeading);
  const bannerSubtext = withShortcodes(tempBannerSubtext);

  const analyticsParams = {
    [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
    [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
    [ANALYTICS_PROPERTIES.TGIDS]: orderedTgids,
    [ANALYTICS_PROPERTIES.MB_NAME]: bannerHeading?.join(' '),
  };
  useEffect(() => {
    const mobileCheck = window.innerWidth < 768;
    if (mobileCheck) {
      setIsMobile(mobileCheck);
    }
  }, []);

  const isSwiperSet = swiper !== null && !swiper?.destroyed;

  useEffect(() => {
    if (!isSwiperSet) {
      return;
    }

    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.VISIBLE,
      ...analyticsParams,
    });

    swiper?.on('click', (e) => {
      const isPaginationBullet = e.target.matches('.swiper-pagination-bullet');
      if (isPaginationBullet) {
        trackEvent({
          eventName: ANALYTICS_EVENTS.MB_BANNER.BANNER_SCROLL,
          ...analyticsParams,
          Ranking: swiper.realIndex + 1,
        });
      }
    });

    swiper?.on('touchEnd', () => {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MB_BANNER.BANNER_SCROLL,
        ...analyticsParams,
        Ranking: swiper.realIndex + 1,
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
      'CTA Type': VARIANTS.DEFAULT_BANNER_CAROUSEL,
      Ranking: swiper.realIndex + 1,
    });
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
      {bannerImages?.map((banner) =>
        renderAmpBanners({ url: banner.url, alt: banner.alt })
      )}
    </amp-carousel>
  );

  let imageView;

  const swiperParams = {
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
    slidesPerView: 1,
    speed: 600,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    shouldSwiperUpdate: true,
    loop: true,
    initialSlide: 0,
    freeMode: false,
    effect: 'fade',
    getSwiper: updateSwiper,
  };

  const captions = (
    <div
      className={`mb-captions ${
        bannerImages.length > 1 ? 'with-indicators' : ''
      }
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
  switch (bannerImages?.length) {
    case 1:
      imageView = (
        <Image
          className="mb-slide single-slide"
          width={WIDTH}
          aspectRatio={ASPECT_RATIO}
          url={bannerImages[0]?.url}
          dontLazyLoad
          mobileUrl={bannerImages[0]?.mobileUrl}
          alt={bannerImages[0]?.alt || 'banner'}
          addDarkOverlay
        />
      );
      break;
    default:
      imageView = (
        <Swiper {...swiperParams}>
          {bannerImages?.map((image, index) => {
            return (
              <Image
                className="swiper-slide mb-slide"
                key={index}
                width={WIDTH}
                aspectRatio={ASPECT_RATIO}
                url={image?.url}
                dontLazyLoad
                mobileUrl={image?.mobileUrl}
                alt={image?.alt || 'banner'}
                addDarkOverlay
              />
            );
          })}
        </Swiper>
      );
      break;
  }
  return (
    <StyledBanner>
      {imageView}
      <div className="overlay-container">
        <div
          className={`mb-captions ${
            bannerImages.length > 1 ? 'with-indicators' : ''
          }`}
        >
          <div className={`mb-caption active`}>
            <div className="caption">
              <h1>{bannerHeading}</h1>
              <Conditional if={bannerSubtext}>
                <p>{bannerSubtext}</p>
              </Conditional>
            </div>
            <Conditional if={!hideCTA}>
              <ButtonWrapper>
                <Button type="whiteBordered" onClick={scrollTicketSection}>
                  {bannerCtaText || strings.BANNER_CTA}
                </Button>
              </ButtonWrapper>
            </Conditional>
          </div>
        </div>
      </div>
    </StyledBanner>
  );
};

export default Banner;
