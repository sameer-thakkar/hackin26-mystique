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

const BannerWrapper = styled.div`
  max-width: 100%;
  margin: ${({ isEntertainmentMb }) =>
    isEntertainmentMb ? 'auto auto 24px auto' : 'auto'};
  overflow: hidden;

  .swiper-container {
    overflow: unset;
  }
  .swiper-wrapper {
    height: 400px;
  }
  .carousel {
    max-width: ${SIZES.MAX_WIDTH};
    margin: 0 auto;
  }

  .swiper-slide {
    -webkit-transform-style: preserve-3d;
    -webkit-backface-visibility: hidden;
  }

  .pointer {
    cursor: pointer;
  }

  img {
    border-radius: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '8px' : '10px'};
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    img {
      border-radius: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '8px' : '4px'};
      display: flex;
      ${({ isEntertainmentMb }) => isEntertainmentMb && `height: 100%;`};
    }
    .swiper-wrapper {
      height: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '214px' : '204px'};
    }
    .swiper-container {
      width: 100%;
    }
    .content-wrap {
      padding: 0 20px;
    }
  }
`;

const Banner = (props) => {
  const {
    banners,
    isMobile,
    carouselOptions,
    ready,
    isEntertainmentMb,
    availableTours,
  } = props;
  const [swiper, updateSwiper] = useState(null);
  const { lang } = useContext(MBContext);

  const swiperOptions = {
    ...carouselOptions,
    shouldSwiperUpdate: true,
    getSwiper: updateSwiper,
    ...(isMobile && {
      spaceBetween: 8,
    }),
    ...(banners?.length <= 1 && {
      autoplay: false,
      loop: false,
      noSwiping: true,
    }),
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

  return (
    <BannerWrapper isEntertainmentMb={isEntertainmentMb}>
      <div className="main-wrapper">
        <div className="swiper-container">
          <div className="swiper-wrapper">
            <Swiper {...swiperOptions}>
              {banners.map((image, index) => {
                return (
                  <div
                    key={index}
                    role="button"
                    tabIndex={0}
                    className={`swiper-slide ${
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
                        target="_blank"
                        rel="noopener noreferrer"
                        href={image.showPageUrl}
                      >
                        <Image
                          url={
                            ready &&
                            (isMobile && image.mobile_url
                              ? image.mobile_url
                              : image.url)
                          }
                          height={isMobile ? 408 : 400}
                          width={isMobile ? 686 : 1200}
                          dontLazyLoad={true}
                          alt={image.alt}
                          imageId={stringIdfy(image.alt || '') + index}
                        />
                      </a>
                    </Conditional>
                    <Conditional if={!isEntertainmentMb}>
                      <Image
                        url={
                          ready &&
                          (isMobile && image.mobile_url
                            ? image.mobile_url
                            : image.url)
                        }
                        height={isMobile ? 408 : 400}
                        width={isMobile ? 686 : 1200}
                        dontLazyLoad={true}
                        alt={image.alt}
                        imageId={stringIdfy(image.alt || '') + index}
                      />
                    </Conditional>
                  </div>
                );
              })}
            </Swiper>
          </div>

          <div className="swiper-pagination"></div>
        </div>
      </div>
    </BannerWrapper>
  );
};

export default Banner;

Banner.defaultProps = {
  carouselOptions: {
    direction: 'horizontal',
    speed: 650,
    slidesPerView: 'auto',
    loop: true,
    centeredSlides: true,
    spaceBetween: 24,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
  },
};
