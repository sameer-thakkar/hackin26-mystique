import { RichText } from 'prismic-reactjs';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { COLORS, GRAPHIK } from '../../constants/ui-constants';
import {
  CHEVRON_LEFT_CIRCLE,
  CLOSE_WHITE,
} from '../../public/static/svg-icons';
import { stringIdfy } from '../../utils/helper';
import Swiper from '../Swiper';
import Image from '../UI/Image';

const StyledImageGallery = styled.div`
  display: grid;
  grid-row-gap: 32px;
  width: 100vw;
  overflow: hidden;
  .relative-wrapper {
    position: relative;
  }
  .heading {
    font-size: 24px;
    font-family: ${GRAPHIK.FONT_STACK};
    font-weight: ${GRAPHIK.SEMIBOLD};
    max-width: 1200px;
    width: 100%;
    line-height: 26px;
    margin: auto;
  }
  .swiper {
    display: grid;
    margin: auto;
  }
  .swiper-wrapper,
  .swiper-container {
    position: unset;
    overflow: unset;
  }
  .swiper-container {
    max-width: 1200px;
  }
  .swiper-container {
    &:before,
    &:after {
      display: block;
      content: '';
      position: absolute;
      left: -50px;
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) -6.82%,
        rgba(255, 255, 255, 0.92) 42.34%
      );
      z-index: 2;
      width: 137px;
      transform: rotate(180deg);
      top: 0;
    }
    &:after {
      transform: unset;
      left: unset;
      right: -50px;
    }
  }
  .btn {
    z-index: 3;
    position: absolute;
    top: 50%;
    left: 24px;
    display: flex;
    cursor: pointer;
    transform: translateY(-50%);
    svg {
      height: 32px;
      width: 32px;
    }
  }
  .btn-right {
    left: unset;
    right: 24px;
    transform: translateY(-50%) rotate(180deg);
  }
  .btn.swiper-button-disabled {
    display: none;
  }

  @media (max-width: 768px) {
    grid-row-gap: 16px;
    .swiper-container {
      max-width: calc(100vw - 32px);
      &:before,
      &:after {
        display: none;
      }
    }
    .heading {
      max-width: 100%;
      padding: 0 16px;
    }
    .btn {
      display: none;
    }
  }
`;

const StyledImage = styled.div`
  width: 180px !important;
  cursor: zoom-in;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media (max-width: 768px) {
    width: 164px;
  }
`;

const Lightbox = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 100%;
  display: grid;
  align-items: center;
  .lightbox-mask {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
  }
  .swiper-slide {
    visibility: hidden;
  }
  .btn {
    left: -50px;
    svg {
      height: 32px;
      width: 32px;
    }
  }
  .header {
    display: grid;
    grid-auto-flow: column;
  }
  .close {
    justify-self: right;
    display: flex;
    margin-bottom: 22px;
    cursor: pointer;
    svg {
      height: 22px;
      width: 22px;
    }
  }
  .btn-right {
    left: unset;
    right: -50px;
  }
  .nav-indicator {
    font-size: 16px;
    color: ${COLORS.WHITE};
  }
  .swiper {
    position: relative;
  }
  .swiper-slide-active {
    visibility: initial;
  }
  .swiper-container {
    max-width: 49.7vw;
    margin: unset;
    &:before,
    &:after {
      content: unset;
    }
  }
  .swiper-container-autoheight .swiper-wrapper {
    align-items: center;
    transition-property: transform;
  }
  @media (max-width: 768px) {
    .swiper {
      .header {
        padding-left: 16px;
        padding-right: 16px;
      }
      margin: unset;
      height: 100vh;
      grid-template-rows: 60px calc(100vh - 60px);
      align-items: center;
    }
    .lightbox-mask {
      background: ${COLORS.BLACK};
    }
    .swiper-container {
      max-width: 100vw;
    }
  }
`;

const LightboxImage = styled.div`
  background: ${COLORS.WHITE};
  .swiper-slide img {
    padding: 8px;
    padding-bottom: 0;
    width: calc(100% - 16px);
    height: calc(100% - 16px);
    object-fit: cover;
    max-height: 80vh;
  }
  .swiper-container-autoheight .swiper-slide {
    height: 100%;
  }
  @media (max-width: 768px) {
    background: unset;
    img {
      padding: 0;
      width: 100%;
      height: 100%;
    }
  }
`;

const Caption = styled.div`
  font-family: ${GRAPHIK.FONT_STACK};
  padding: 8px;
  padding-bottom: 16px;
  @media (max-width: 768px) {
    color: ${COLORS.WHITE};
  }
`;

/**
 * Image gallery allows you to add 'n' number of images into content framework, all images are clickable and trigger a popup (lightbox) with image expanded according to its aspect ratio.
 *
 *
 * ### Non-repeatable zone
 * - Heading
 *  - Sets the Heading for the Gallery Section
 * - Mobile Layout
 *  - Currently Gallery Supports two layouts on Mobile (grid & scroll)
 *    - Grid: Images will be shown in a grid of 2 columns upto 3 rows (i.e 5 images, 6th block will be a pagination to the lightbox popup)
 *    - Scrollable: Images will be horizontally scrollable.
 *
 * ### Repeatable zone
 * - Upload Image
 *  - If you have the image locally, select this option to set the image
 * - Link to Image
 *  - If you have already uploaded the image elsewhere, provide link to the image here.
 * - Image caption
 *  - You can provide some caption to the image, will be used as alt text & will be shown below the image in the Lightbox mode.
 * - Image Credits (Attribution)
 *  - Allows you to credit the owner of the image.
 */

const ImageGallery = (props) => {
  const { _layout, isMobile, images, heading } = props;
  const [ligtboxOpen, setLightbox] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const [lightboxSwiper, getSwiper] = useState(null);
  const [lightboxIndex, setCurrentLightboxIndex] = useState(0);
  const toggleLightbox = () => setLightbox(!ligtboxOpen);

  const updateIndex = useCallback(
    () => setCurrentLightboxIndex(lightboxSwiper.realIndex),
    [lightboxSwiper]
  );

  useEffect(() => {
    if (lightboxSwiper !== null) {
      lightboxSwiper.on('slideChange', updateIndex);
    }

    return () => {
      if (lightboxSwiper !== null) {
        lightboxSwiper.off('slideChange', updateIndex);
      }
    };
  }, [lightboxSwiper, updateIndex, getSwiper]);

  const swiperOpts = {
    slidesPerView: 'auto',
    spaceBetween: isMobile ? 14 : 24,
    freeMode: isMobile ? true : false,
    shouldSwiperUpdate: true,
    freeModeMomentum: 2,
    navigation: {
      nextEl: '.btn-right',
      prevEl: '.btn-left',
    },
    renderNextButton: function nextButton() {
      return (
        <div role="button" tabIndex={0} className="btn btn-right next-slide">
          {CHEVRON_LEFT_CIRCLE}
        </div>
      );
    },
    renderPrevButton: function prevButton() {
      return (
        <div tabIndex={0} role="button" className="btn btn-left prev-slide">
          {CHEVRON_LEFT_CIRCLE}
        </div>
      );
    },
  };
  const swiperLightBoxOpts = {
    ...swiperOpts,
    init: true,
    slidesPerView: 1,
    rebuildOnUpdate: false,
    shouldSwiperUpdate: false,
    spaceBetween: 0,
    autoHeight: true,
    initialSlide,
    getSwiper,
    freeMode: false,
    freeModeMomentum: 1,
  };
  const openInLightbox = (index) => {
    setInitialSlide(index);
    toggleLightbox();
  };

  return (
    <StyledImageGallery>
      <div className="heading" id={stringIdfy(heading)}>
        {heading}
      </div>
      <div className="relative-wrapper">
        <div className="swiper">
          <Swiper {...swiperOpts}>
            {images.map((image, index) => {
              const caption = RichText.asText(image.image_caption);
              return (
                <StyledImage
                  key={index}
                  title={caption}
                  onClick={() => openInLightbox(index)}
                >
                  <Image
                    url={image.uploaded_image?.url || image.linked_image}
                    width={180}
                    height={112}
                    alt={caption}
                  />
                </StyledImage>
              );
            })}
          </Swiper>
        </div>
      </div>
      {ligtboxOpen ? (
        <Lightbox>
          <div
            className="lightbox-mask"
            onClick={toggleLightbox}
            role="button"
            tabIndex={0}
          />
          <div className="swiper">
            <div className="header">
              {isMobile ? (
                <div className="nav-indicator">
                  {lightboxIndex + 1}/{images.length}
                </div>
              ) : null}
              <div
                className="close"
                onClick={toggleLightbox}
                role="button"
                tabIndex={0}
              >
                {CLOSE_WHITE}
              </div>
            </div>
            <Swiper {...swiperLightBoxOpts}>
              {images.map((image, index) => {
                const caption = RichText.asText(image.image_caption);
                return (
                  <LightboxImage key={index} title={caption}>
                    <Image
                      url={image.uploaded_image?.url || image.linked_image}
                      dontLazyLoad={true}
                      alt={caption}
                    />
                    <Caption>{caption}</Caption>
                  </LightboxImage>
                );
              })}
            </Swiper>
          </div>
        </Lightbox>
      ) : null}
    </StyledImageGallery>
  );
};

export default ImageGallery;
