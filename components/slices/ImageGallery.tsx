import { RichText } from 'prismic-reactjs';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';
import { CHEVRON_LEFT_CIRCLE, CLOSE_WHITE } from 'assets/SvgIcons';
import { stringIdfy } from 'utils/helper';
import Image from 'UI/Image';
import RichContent from 'UI/RichContent';
import dynamic from 'next/dynamic';

const Swiper = dynamic(() => import('components/Swiper'));

const StyledImageGallery = styled.div`
  display: grid;
  grid-row-gap: 22px;
  overflow: hidden;
  padding: 0 16px;
  margin: 0 -16px;
  .heading {
    font-size: 24px;
    font-family: ${HALYARD.FONT_STACK};
    font-weight: 600;
    max-width: 1200px;
    width: 100%;
    line-height: 26px;
  }
  .swiper {
    display: grid;
    margin: auto;
  }
  .swiper-container {
    position: unset;
    overflow: hidden;
  }
  .swiper-wrapper {
    position: unset;
    overflow: unset;
  }
  .btn {
    z-index: 3;
    position: absolute;
    top: 50%;
    left: -16px;
    display: flex;
    cursor: pointer;
    transform: translateY(-50%);
    svg {
      height: 32px;
      width: 32px;
    }
  }
  .button-right,
  .button-left {
    position: absolute;
    top: 50%;
    z-index: 2;
    display: flex;
    cursor: pointer;
    transform: translateY(-50%);
  }
  .swiper-button-disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .btn-right,
  .button-right {
    left: unset;
    right: 0;
    transform: translateY(-50%) rotate(180deg);
  }
  .btn.swiper-button-disabled {
    display: none;
  }

  @media (max-width: 768px) {
    grid-row-gap: 16px;
    padding: 0;
    .swiper-container {
      max-width: calc(100vw - 32px);
      overflow: visible;
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

const Heading = styled.div`
  font-family: ${HALYARD.FONT_STACK};
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 30px;
  p {
    color: ${COLORS.BRAND.WHITE};
    margin: 0;
  }
  @media (max-width: 768px) {
    font-size: 20px;
    z-index: 1;
    line-height: 25px;
  }
`;

const Description = styled.div`
  font-family: ${HALYARD.FONT_STACK};
  p {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
  }
  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 20px;
    z-index: 1;
  }
`;

const Content = styled.div`
  font-family: ${HALYARD.FONT_STACK};
  display: grid;
  grid-row-gap: 16px;
  ${Heading}${Heading} {
    * {
      color: ${COLORS.BRAND.WHITE};
      margin-bottom: 0
    }
  }
  ${Description}${Description} {
    * {
      margin-bottom: 0;
      margin-top: 0;
      color: ${COLORS.BRAND.WHITE};
    }
  }
  @media(max-width: 768px) {
    position: absolute;
    bottom: 0;
    :after {
      content: '';
      background: linear-gradient(
        180deg,
        rgba(61, 56, 56, 0) 0%,
        rgba(0, 0, 0, 0.64) 57.29%
      );
      z-index: 0;
      height: 222px;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }
`;

const StyledImage = styled.div`
  width: auto;
  cursor: pointer;
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
  @media (max-width: 768px) {
    width: auto;
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
    color: ${COLORS.BRAND.WHITE};
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
      background: ${COLORS.BRAND.BLACK};
    }
    .swiper-container {
      max-width: 100vw;
      ${({ isZoomed }) =>
        !isZoomed
          ? `
      `
          : `
      overflow: unset;
      `}
    }
  }
`;

const LightboxImage = styled.div`
  background: ${COLORS.BRAND.WHITE};
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
    &.swiper-slide-active.swiper-slide-zoomed {
      width: auto !important;
    }
    img {
      padding: 0;
      width: 100%;
      height: calc(100vh - 60px);
      object-fit: contain;
    }
    ${Content} {
      padding: 20px 16px;
    }
  }
`;

const FullImage = styled.div`
  display: grid;
  .image-wrap {
    grid-row: 1;
    grid-column: 1;
    display: flex;
    picture {
      width: 100%;
      img {
        width: 100%;
        height: 600px;
        object-fit: cover;
      }
    }
  }
  &:after {
    content: '';
    background: linear-gradient(
      180deg,
      rgba(61, 56, 56, 0) 0%,
      rgba(0, 0, 0, 0.64) 57.29%
    );
    z-index: 0;
    height: 222px;
    grid-row: 1;
    grid-column: 1;
    align-self: end;
  }
  ${Content} {
    grid-row: 1;
    grid-column: 1;
    align-self: end;
    z-index: 1;
    line-height: 30px;
    font-size: 24px;
    padding: 40px;
    font-weight: 600;
    color: #fff;
  }
`;

const GallerySwiper = styled.div`
  position: relative;
  ${StyledImage} {
    display: grid;
    grid-row-gap: 8px;
    p {
      margin: 0;
      font-size: 14px;
      line-height: 22px;
    }
  }
  .swiper-initialized {
    width: 100%;
  }
  picture {
    display: flex;
  }
  img {
    border-radius: 4px;
    height: 190px;
  }
  @media (max-width: 768px) {
    .swiper-initialized {
      max-width: calc(100vw - 32px);
      overflow: visible;
    }

    ${StyledImage} {
      p {
        font-size: 14px;
      }
      img {
        height: 104px;
      }
    }
  }
`;

/**
 * Image gallery allows you to add 'n' number of images into content framework, all images are clickable and trigger a popup (lightbox) with image expanded according to its aspect ratio.
 *
 *
 * ### Non-repeatable zone
 * - Heading
 *  - Sets the Heading for the Gallery Section
 *
 * ### Repeatable zone
 * - Upload Image
 *  - If you have the image locally, select this option to set the image
 * - Link to Image
 *  - If you have already uploaded the image elsewhere, provide link to the image here.
 * - Heading
 *  - You can provide some caption to the image, will also be used as alt text & will be shown below the image in the Lightbox mode.
 * - Content
 *  - RichText field for image description.
 * - Image Credits (Attribution)
 *  - Allows you to credit the owner of the image.
 */

const ImageGallery = (props) => {
  const { _layout, isMobile, images, heading } = props;
  const [ligtboxOpen, setLightbox] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const [lightboxSwiper, getSwiper] = useState(null);
  const [lightboxIndex, setCurrentLightboxIndex] = useState(0);
  const [isZoomed, setZoomed] = useState(false);
  const toggleLightbox = () => setLightbox(!ligtboxOpen);

  const updateIndex = useCallback(
    () => setCurrentLightboxIndex(lightboxSwiper?.realIndex),
    [lightboxSwiper]
  );

  const updateZoom = useCallback((scale) => {
    setZoomed(scale != 1);
  }, []);

  useEffect(() => {
    if (lightboxSwiper !== null) {
      lightboxSwiper?.on('slideChange', updateIndex);
      lightboxSwiper?.on('zoomChange', updateZoom);
    }

    return () => {
      if (lightboxSwiper !== null) {
        lightboxSwiper?.off('slideChange', updateIndex);
        lightboxSwiper?.off('zoomChange', updateZoom);
      }
    };
  }, [lightboxSwiper, updateIndex, getSwiper, updateZoom]);

  const swiperOpts = {
    slidesPerView: isMobile ? 2.1 : 4,
    slidesPerGroup: isMobile ? 1 : 3,
    spaceBetween: isMobile ? 8 : 24,
    freeMode: isMobile ? true : false,
    shouldSwiperUpdate: true,
    freeModeMomentum: 2,
  };

  const swiperLightBoxOpts = {
    ...swiperOpts,
    init: true,
    slidesPerView: 1,
    slidesPerGroup: 1,
    noSwiping: isZoomed,
    shouldSwiperUpdate: true,
    spaceBetween: 0,
    autoHeight: true,
    initialSlide,
    onSwiper: getSwiper,
    freeMode: false,
    freeModeMomentum: 1,
    zoom: {
      maxRatio: 2,
      toggle: true,
      minRatio: 0.5,
    },
  };

  const openInLightbox = (index) => {
    setInitialSlide(index);
    if (isMobile) toggleLightbox();
  };

  const activeImage = images[initialSlide];
  const fullImageHeading = RichText.asText(activeImage.heading);

  const galleryOpts = {
    rebuildOnUpdate: true,
    navigation: isMobile
      ? false
      : {
          nextEl: '.button-right',
          prevEl: '.button-left',
        },
  };

  return (
    <StyledImageGallery>
      <div className="heading" id={stringIdfy(heading)}>
        {heading}
      </div>
      {!isMobile ? (
        <FullImage>
          <Image
            url={
              images[initialSlide].uploaded_image?.url ||
              images[initialSlide].linked_image?.url
            }
            priority
            aspectRatio={'16:10'}
            imageId={`image-${initialSlide}`}
            height={'400'}
            alt={fullImageHeading}
          />
          <Content>
            <Heading>
              <RichContent render={activeImage.heading} />{' '}
            </Heading>
            <Description>
              <RichContent render={activeImage.content} />
            </Description>
          </Content>
        </FullImage>
      ) : null}
      <GallerySwiper>
        <div className="swiper">
          <Swiper
            {...swiperOpts}
            {...galleryOpts}
            nextButton={
              <div className="button-right">{CHEVRON_LEFT_CIRCLE}</div>
            }
            previousButton={
              <div className="button-left">{CHEVRON_LEFT_CIRCLE}</div>
            }
          >
            {images.map((image, index) => {
              const caption = RichText.asText(image.heading);
              return (
                <StyledImage
                  key={index}
                  title={caption}
                  onClick={() => openInLightbox(index)}
                >
                  <Image
                    url={image.uploaded_image?.url || image.linked_image?.url}
                    width={180}
                    height={112}
                    alt={caption}
                  />
                  <RichContent render={image.heading} />
                </StyledImage>
              );
            })}
          </Swiper>
        </div>
      </GallerySwiper>
      {ligtboxOpen && isMobile ? (
        <Lightbox isZoomed={lightboxSwiper?.zoom?.enabled}>
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
                const caption = RichText.asText(image.heading);
                return (
                  <LightboxImage key={index} title={caption}>
                    <div className={'swiper-zoom-container'}>
                      <Image
                        url={
                          image.uploaded_image?.url || image.linked_image?.url
                        }
                        className={`swiper-zoom-target`}
                        alt={caption}
                        priority
                      />
                    </div>
                    <Content>
                      <Heading>
                        <RichContent render={image.heading} />
                      </Heading>
                      <Description>
                        <RichContent render={image.content} />
                      </Description>
                    </Content>
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
