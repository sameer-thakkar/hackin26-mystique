import dynamic from 'next/dynamic';
import React from 'react';
import { scroller } from 'react-scroll';
import styled from 'styled-components';
import Image from 'UI/Image';
import { SIZES } from 'const/ui-constants';
import { stringIdfy } from 'utils/helper';

const Swiper = dynamic(() => import('components/Swiper'));

const BannerWrapper = styled.div`
  max-width: 100%;
  margin: ${({ isEntertainmentMb }) =>
    isEntertainmentMb ? 'auto auto 32px auto' : 'auto'};
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
    border-radius: 10px;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    img {
      border-radius: 4px;
      display: flex;
    }
    .swiper-wrapper {
      height: 204px;
    }
    .swiper-container {
      width: 100%;
    }
    .content-wrap {
      padding: 0 20px;
    }
    .swiper-wrapper img {
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
  } = props;

  if (isMobile) {
    carouselOptions.spaceBetween = 8;
  }
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
            <Swiper {...carouselOptions}>
              {banners.map((image, index) => {
                return (
                  <div
                    key={index}
                    role="button"
                    tabIndex={0}
                    className={`swiper-slide ${
                      image.interaction ? 'pointer' : ''
                    }`}
                    onClick={() => handleInteraction(image.interaction)}
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
    centered: true,
    spaceBetween: 24,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    rebuildOnUpdate: true,
  },
};
