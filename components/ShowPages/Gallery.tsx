import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import type { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import Image, { Wrapper } from 'UI/Image';
import { trackEvent } from 'utils/analytics';
import COLORS from 'const/colors';
import { ANALYTICS_PROPERTIES } from 'const/index';
import AllPhotos from 'assets/allPhotos';
import BlackCross from 'assets/blackCross';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const GalleryWrapper = styled.div`
  display: grid;
  margin-top: 48px;
  position: relative;
  grid-gap: 16px;
  grid-template-columns: min-content min-content;
  justify-content: center;

  .left-image-wrapper {
    height: 490px;
    width: 792px;
  }

  .right-image-wrapper {
    height: 237px;
    width: 392px;
  }

  .right-image-bottom {
    padding-top: 16px;
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    margin-top: 32px;
    grid-gap: 6px;

    .left-image-wrapper {
      height: 140px;
      width: 223px;
    }
    .right-image-wrapper {
      height: 67px;
      width: 114px;
    }
    img {
      border-radius: 5px;
    }
    .right-image-bottom {
      padding-top: 6px;
    }
  }
`;

const GalleryPopUpWrapper = styled.div<{ isVisibleGalleryPopUp: boolean }>(
  ({ isVisibleGalleryPopUp }) => {
    if (isVisibleGalleryPopUp) {
      return `
    position: fixed;
    z-index: 10;
    left: 0;
    top: 0;
    text-align:center;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: #F8F8F8;
  
    ${Wrapper}{
      height: auto;
    }

    .swiper-pagination {
      z-index: 2;
    }
  
    .swiper-button-next {
      right: 2px;
      color: black;
      background: #ffffff;
      box-shadow: 0px 0px 1px rgb(0 0 0 / 10%), 0px 2px 8px rgb(0 0 0 / 10%);
      border-radius: 50%;
      width: 36px;
      z-index: 2;
      height: 36px;
      :after {
        font-size: 12px;
      }
    }
  
    .swiper-button-prev {
      left: 2px;
      color: black;
      background: #ffffff;
      box-shadow: 0px 0px 1px rgb(0 0 0 / 10%), 0px 2px 8px rgb(0 0 0 / 10%);
      border-radius: 50%;
      z-index: 2;
      width: 36px;
      height: 36px;
      :after {
        font-size: 12px;
      }
    }
    .carousel-slider {
      margin: 30px auto 100px;
      position: relative;
    }
    
    .swiper-slide {
      border-radius: 4px;
      width: 186px !important;
    }
    
    .carousel-slider .swiper-container {
      overflow: hidden;
      padding-top: 16px;
    }
    .carousel-slider .swiper-pagination-bullet-active {
      background: #666666 !important;
      opacity: 1 !important;
    }
    .carousel-slider .swiper-pagination-bullet {
      width: 8px;
      height: 8px;
      display: inline-block;
      border-radius: 100%;
      background: #444444;
      opacity: 0.1;
    }
    .carousel-slider .swiper-container {
      margin: 0;
      width: auto;
      position: static;
    }
    .carousel-slider .swiper-pagination.swiper-pagination-bullets {
      width: 100%;
      justify-content: center;
      bottom: -30px;
    }
    .swiper-button-disabled {
      opacity: 0 !important;
    }
    @media (max-width: 768px) {
      max-width: 100vw;

      .carousel-slider .swiper-container {
        margin: 0;
      }
      .carousel-slider .swiper-container {
        padding: 0;
      }
      .card-carousel-heading {
        margin: 0 12px;
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin: 0;
          margin-bottom: 10px;
        }
      }
      .swiper-slide {
        width: 163px !important;
      }
    }
  
  `;
    } else {
      return `
      display:none;
    `;
    }
  }
);

const ActiveImageWrapper = styled.div<{ active: boolean }>(
  ({ active }) => `
  ${active ? `display:flex;` : `display:none;`}
  height: 100%;
  margin-bottom: 0;
  align-items: flex-end;
  
  .image-wrap > span {
    height: 622px;
    width: 996px;
    transition: 0.3s ease;
  }

  img{
    border-radius: 4px;
    cursor: pointer;
    object-fit: cover;

    max-width: 100%;
  }

  @media (max-width: 768px) {
    span {
      width: 375px !important;
      height: 234px !important;
      cursor: pointer;
    }
  }
`
);

const ImageWrapper = styled.div<{ active: boolean }>(
  ({ active }) =>
    `
  .image-wrap {
    span {
      min-width: 100%;
    }
  }

  img{
    width: 186px;
    height: 115.73px;
    cursor: pointer;
    ${active && `border: 2px solid ${COLORS.BRAND.PURPS} !important;`}
    box-sizing: border-box;
    border-radius: 4px;
  }
  @media (max-width: 768px) {
    img{
      max-height: 100px;
      width: 163px;
      cursor: pointer;
    }
  }
`
);

const CrossWrapper = styled.div`
  position: absolute;
  top: 32px;
  right: 32px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  svg {
    width: 40px;
    height: 40px;
  }
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    top: 16px;
    right: 16px;
    svg {
      width: 32px;
      height: 32px;
    }
  }
`;

const GalleryPopUpContentWrapper = styled.div`
  max-width: 1000px;
  text-align: center;
  margin: auto;
  display: grid;
  justify-content: center;
  min-height: 100%;
  grid-gap: 16px;
  align-items: baseline;

  @media (max-width: 768px) {
    grid-gap: 24px;

    .swiper-initialized {
      max-width: 90vw;
      overflow: hidden;
    }
  }

  .swiper-wrapper {
    max-width: 1000px;
  }
`;

const AllPhotoWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 15px;
  cursor: pointer;
  @media (max-width: 768px) {
    right: 4px;
    top: 4px;
  }
`;

const Gallery = ({ galleryArray, isMobile }: any) => {
  const [first, second, third] = galleryArray;
  const [isVisibleGalleryPopUp, setIsVisibleGalleryPopUp] = useState(false);
  const [activeIndexGalleryPopUp, setActiveIndexGalleryPopUp] = useState(0);

  const slidesPerView = isMobile ? 2 : 5;
  const slidesPerGroup = isMobile ? 2 : 5;
  let params: SwiperProps = {
    direction: 'horizontal',
    speed: 650,
    slidesPerView: slidesPerView,
    lazy: true,
    initialSlide: 1,
    spaceBetween: isMobile ? 8 : 16,
    slidesPerGroup: slidesPerGroup,
    centeredSlides: false,
    navigation: !isMobile,
  };

  const popupOpener = (index: number) => {
    setIsVisibleGalleryPopUp(true);
    setActiveIndexGalleryPopUp(index);
    document.body.style.overflow = 'hidden';

    trackEvent({
      eventName: 'Product Card Image Clicked',
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
    });
  };
  const popupCloser = () => {
    setIsVisibleGalleryPopUp(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <GalleryPopUpWrapper isVisibleGalleryPopUp={isVisibleGalleryPopUp}>
        <GalleryPopUpContentWrapper>
          {galleryArray.map((image: any, index: number) => {
            return (
              // @ts-expect-error TS(2769): No overload matches this call.
              <ActiveImageWrapper
                key={index}
                {...(activeIndexGalleryPopUp === index && { active: true })}
              >
                <Image
                  url={image.url}
                  alt={image.alt || 'Gallery Image'}
                  height={600}
                  width={900}
                  // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | nu... Remove this comment to see the full error message
                  quality={null}
                  loadHigherQualityImage={true}
                />
              </ActiveImageWrapper>
            );
          })}
          <Swiper {...params}>
            {galleryArray.map((image: any, index: number) => {
              return (
                // @ts-expect-error TS(2769): No overload matches this call.
                <ImageWrapper
                  key={index}
                  {...(activeIndexGalleryPopUp === index && { active: true })}
                  onClick={() => setActiveIndexGalleryPopUp(index)}
                >
                  <Image
                    url={image.url}
                    alt={image.alt || 'Gallery Image'}
                    height={150}
                    width={200}
                    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | nu... Remove this comment to see the full error message
                    quality={null}
                    loadHigherQualityImage={true}
                  />
                </ImageWrapper>
              );
            })}
          </Swiper>
          <CrossWrapper onClick={() => popupCloser()}>
            {BlackCross}
          </CrossWrapper>
        </GalleryPopUpContentWrapper>
      </GalleryPopUpWrapper>

      <GalleryWrapper>
        <div
          className="left-image-wrapper"
          onClick={() => popupOpener(0)}
          role="button"
          tabIndex={0}
        >
          <Conditional if={first}>
            <Image
              url={first.url}
              alt={first.alt || 'Gallery Image'}
              height={500}
              width={800}
              // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | nu... Remove this comment to see the full error message
              quality={null}
              loadHigherQualityImage={true}
            />
          </Conditional>
        </div>
        <Conditional if={second && third}>
          <div>
            <div
              className="right-image-wrapper"
              onClick={() => popupOpener(1)}
              role="button"
              tabIndex={0}
            >
              <Image
                url={second.url}
                alt={second.alt || 'Gallery Image'}
                height={250}
                width={400}
                // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | nu... Remove this comment to see the full error message
                quality={null}
                loadHigherQualityImage={true}
              />
            </div>
            <div
              className="right-image-wrapper right-image-bottom"
              onClick={() => popupOpener(2)}
              role="button"
              tabIndex={0}
            >
              <Image
                url={third.url}
                alt={third.alt || 'Gallery Image'}
                height={250}
                width={400}
                // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | nu... Remove this comment to see the full error message
                quality={null}
                loadHigherQualityImage={true}
              />
            </div>
          </div>
        </Conditional>
        <AllPhotoWrapper
          onClick={() => {
            setIsVisibleGalleryPopUp(true);
            setActiveIndexGalleryPopUp(0);
          }}
        >
          {AllPhotos}
        </AllPhotoWrapper>
      </GalleryWrapper>
    </>
  );
};

export default Gallery;
