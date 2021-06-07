import React, { useState } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

import Image from '../UI/Image';
const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });
import { BLACK_CROSS, ALL_PHOTOS } from '../../assets/SvgIcons';

const GalleryWrapper = styled.div`
  display: grid;
  margin-top: 48px;
  position: relative;
  grid-template-columns: calc(70% - 10px) 30%;
  grid-gap: 10px;

  .left-image-wrapper {
    height: 490px;
    padding: 5px 0;
  }

  .right-image-wrapper {
    height: 240px;
    padding: 5px 0;
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    margin-top: 32px;

    .left-image-wrapper {
      height: 140px;
    }
    .right-image-wrapper {
      height: 65px;
    }
    img {
      border-radius: 5px;
    }
  }
`;

const GalleryPopUpWrapper = styled.div(({ isVisibleGalleryPopUp }) => {
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
  
    .swiper-pagination {
      z-index: 2;
    }
  
    .swiper-button-next {
      right: 0px;
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
      left: 0px;
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
      .swiper-slide {
        border: 1px solid #e2e2e2;
        border-radius: 8px;
      }
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
    .carousel-slider .swiper-button-next.swiper-button-disabled {
      opacity: 0;
    }
    .carousel-slider .swiper-button-prev.swiper-button-disabled {
      opacity: 0;
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
    }
  
  `;
  } else {
    return `
      display:none;
    `;
  }
});

const ActiveImageWrapper = styled.div(
  ({ active }) => `
  ${active ? `display:block;` : `display:none;`}
  img{
    height: 622px;
    width: 996px;
    border-radius: 4px;
    cursor: pointer;
    transition: 0.3s ease;
    max-width: 100%;
  }
  @media (max-width: 768px) {
    img{
      width: 375px;
      height: 234px;
      cursor: pointer;
    }
  }
`
);

const ImageWrapper = styled.div(
  ({ active }) =>
    `
  img{
    width: 186px;
    height: 115.73px;
    cursor: pointer;
    ${active && `border: 2px solid #EC1943;`}
    box-sizing: border-box;
    border-radius: 4px;
  }
  @media (max-width: 768px) {
    img{
      max-height: 100px;
      cursor: pointer;
    }
  }
`
);

const CrossWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  cursor: pointer;
`;

const GalleryPopUpContentWrapper = styled.div`
  max-width: 1000px;
  text-align: center;
  margin: auto;
  display: grid;
  align-items: center;
  justify-content: center;
  min-height: 100%;
`;

const AllPhotoWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 15px;
  cursor: pointer;
`;

const Gallery = ({ galleryArray, isMobile }) => {
  const [first, second, third] = galleryArray;
  const [isVisibleGalleryPopUp, setIsVisibleGalleryPopUp] = useState(false);
  const [activeIndexGalleryPopUp, setActiveIndexGalleryPopUp] = useState(0);

  const slidesPerView = isMobile ? 2 : 5;
  const slidesPerGroup = isMobile ? 2 : 5;
  let params = {
    direction: 'horizontal',
    speed: 650,
    slidesPerView: slidesPerView,
    shouldSwiperUpdate: true,
    lazy: true,
    initialSlide: 1,
    spaceBetween: 16,
    slidesPerGroup: slidesPerGroup,
    centeredSlides: isMobile,
    navigation: isMobile
      ? false
      : {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
  };

  return (
    <>
      <GalleryPopUpWrapper isVisibleGalleryPopUp={isVisibleGalleryPopUp}>
        <GalleryPopUpContentWrapper>
          {galleryArray.map((image, index) => {
            return (
              <ActiveImageWrapper
                key={index}
                {...(activeIndexGalleryPopUp === index && { active: true })}
              >
                <Image url={image.url} alt={image.alt || 'Gallery Image'} />
              </ActiveImageWrapper>
            );
          })}
          <Swiper {...params}>
            {galleryArray.map((image, index) => {
              return (
                <ImageWrapper
                  key={index}
                  {...(activeIndexGalleryPopUp === index && { active: true })}
                  onClick={() => setActiveIndexGalleryPopUp(index)}
                >
                  <Image url={image.url} alt={image.alt || 'Gallery Image'} />
                </ImageWrapper>
              );
            })}
          </Swiper>
          <CrossWrapper onClick={() => setIsVisibleGalleryPopUp(false)}>
            {BLACK_CROSS}
          </CrossWrapper>
        </GalleryPopUpContentWrapper>
      </GalleryPopUpWrapper>

      <GalleryWrapper>
        <div
          className="left-image-wrapper"
          onClick={() => {
            setIsVisibleGalleryPopUp(true);
            setActiveIndexGalleryPopUp(0);
          }}
          role="button"
          tabIndex={0}
        >
          {first ? (
            <Image url={first.url} alt={first.alt || 'Gallery Image'} />
          ) : null}
        </div>
        {second && third ? (
          <div>
            <div
              className="right-image-wrapper"
              onClick={() => {
                setIsVisibleGalleryPopUp(true);
                setActiveIndexGalleryPopUp(1);
              }}
              role="button"
              tabIndex={0}
            >
              <Image url={second.url} alt={second.alt || 'Gallery Image'} />
            </div>
            <div
              className="right-image-wrapper"
              onClick={() => {
                setIsVisibleGalleryPopUp(true);
                setActiveIndexGalleryPopUp(2);
              }}
              role="button"
              tabIndex={0}
            >
              <Image url={third.url} alt={third.alt || 'Gallery Image'} />
            </div>
          </div>
        ) : null}
        <AllPhotoWrapper
          onClick={() => {
            setIsVisibleGalleryPopUp(true);
            setActiveIndexGalleryPopUp(0);
          }}
        >
          {ALL_PHOTOS}
        </AllPhotoWrapper>
      </GalleryWrapper>
    </>
  );
};

export default Gallery;
