import React from 'react';
import { SIZES } from 'const/ui-constants';
import { scroller } from 'react-scroll';

import Image from '../UI/Image';
import Swiper from '../Swiper';
import { stringIdfy } from '../../utils/helper';

const Banner = (props) => {
  const { banners, isMobile, carouselOptions, ready } = props;

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
    <div className="banner-wrapper">
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
      <style jsx>
        {`
          .banner-wrapper {
            max-width: 100%;
            margin: auto;
            overflow: hidden;
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

          @media (max-width: 768px) {
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
        `}
      </style>
      <style jsx global>
        {`
          .banner-wrapper .swiper-container {
            overflow: unset;
          }
          .pointer {
            cursor: pointer;
          }
          .banner-wrapper img {
            border-radius: 10px;
            height: 100%;
            width: 100%;
            object-fit: cover;
          }
          @media (max-width: 768px) {
            .banner-wrapper img {
              border-radius: 4px;
            }
          }
        `}
      </style>
    </div>
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
