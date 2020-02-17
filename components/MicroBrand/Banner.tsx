import React from 'react';
import Image from '../UI/Image';
import Swiper from '../../components/Swiper';
import { SIZES } from '../../constants/ui-constants';
import { scroller } from 'react-scroll';

export const Banner = props => {
  const { banners, isMobile, carouselOptions } = props;
  if (isMobile) {
    carouselOptions.spaceBetween = 8;
  }
  const scrollToSection = sectionId => {
    scroller.scrollTo(sectionId, {
      duration: 750,
      delay: 100,
      smooth: 'easeInQuad',
      offset: -75,
    });
  };

  const handleInteraction = interaction => {
    if (interaction) {
      const [type, target] = interaction.split(':');
      switch (type.toLowerCase().trim()) {
        case 'section':
          scrollToSection(
            target
              .trim()
              .replace(' ', '-')
              .toLowerCase()
          );
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
                    className={`swiper-slide ${
                      image.interaction ? 'pointer' : ''
                    }`}
                    onClick={() => handleInteraction(image.interaction)}
                  >
                    <Image
                      url={
                        isMobile && image.mobile_url
                          ? image.mobile_url
                          : image.url
                      }
                      dontLazyLoad={index == 0}
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
            fmargin: 0 auto;
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
