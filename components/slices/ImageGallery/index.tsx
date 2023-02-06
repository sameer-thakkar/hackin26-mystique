// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import type { Swiper as ISwiper } from 'swiper';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import useWindowSize from 'hooks/useWindowSize';
import dynamic from 'next/dynamic';
import Image from 'UI/Image';
import RichContent from 'UI/RichContent';
import Conditional from 'components/common/Conditional';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { strings } from 'const/strings';
import { CHEVRON_LEFT_CIRCLE, CLOSE_WHITE, MapSvg } from 'assets/SvgIcons';
import { stringIdfy, truncate } from 'utils/helper';
import type { SwiperProps } from 'swiper/react';
import GridLayout from 'components/slices/ImageGallery/components/GridLayout';
import type { ImageGalleryProps } from 'components/slices/ImageGallery/interface';
import {
  StyledImageGallery,
  Heading,
  Description,
  StyledImage,
  Lightbox,
  FullImage,
  ContentContainer,
  ThumbnailSwiper,
  GridLayoutContainer,
  Tag,
  DesktopLightBox,
  SwiperControls,
  DesktopStyledImage,
  Content,
  DesktopLightboxHeading,
} from 'components/slices/ImageGallery/style';

const Swiper = dynamic(() =>
  import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

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

const ImageGallery: React.FC<ImageGalleryProps> = (props) => {
  const { images, heading } = props;

  const [isDesktopLightboxOpen, setDesktopLightbox] = useState(false);
  const [isMobileLightboxOpen, setMobileLightbox] = useState(false);
  const [gallerySwiper, updateGallerySwiper] = useState<ISwiper | null>(null);
  const [thumbnailSwiper, updateThumbnailSwiper] = useState<ISwiper | null>(
    null
  );
  const [currentIndex, updateCurrentIndex] = useState(0);
  const modalRef = useRef(null);
  const controlRef = useRef<HTMLDivElement>(null);

  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const isMobile = useWindowSize().width < 768;

  const { SHOW_ALL_PHOTOS, CLOSE } = strings || {};

  const updateGalleryIndex = useCallback(
    () => updateCurrentIndex(gallerySwiper?.realIndex || 0),
    [gallerySwiper]
  );

  useEffect(() => {
    if (!isMobile || !gallerySwiper || gallerySwiper?.destroyed) return;
    gallerySwiper.on('slideChange', () => {
      updateGalleryIndex();
    });

    return () => {
      if (gallerySwiper && !gallerySwiper.destroyed) {
        gallerySwiper.off('slideChange', updateGalleryIndex);
      }
    };
  }, [gallerySwiper, updateGalleryIndex, isMobile]);

  useEffect(() => {
    if (!isMobile || !thumbnailSwiper || thumbnailSwiper?.destroyed) return;
    thumbnailSwiper.on('slideChange', updateGalleryIndex);

    return () => {
      if (thumbnailSwiper && !thumbnailSwiper.destroyed) {
        thumbnailSwiper.off('slideChange', updateGalleryIndex);
      }
    };
  }, [thumbnailSwiper, updateGalleryIndex, isMobile]);

  const gallerySwiperParams: SwiperProps = {
    initialSlide: currentIndex,
    spaceBetween: isMobile ? 10 : undefined,
    touchRatio: isMobile ? 0.6 : 0,
    onSwiper: updateGallerySwiper,
  };

  const thumbnailSwiperParams: SwiperProps = {
    initialSlide: currentIndex,
    spaceBetween: 10,
    slidesPerView: 3.5,
    touchRatio: 0.2,
    onSwiper: updateThumbnailSwiper,
  };

  /* Deep copy the array to destroy references from images */
  const lightboxImages = JSON.parse(JSON.stringify(images));

  /* Truncating the content till 120 characters and separating the reference from 'images' variable */
  lightboxImages?.forEach((image: any) => {
    const isShortSummaryRequired = image.content[0]?.text?.length > 120;
    image.isShortSummaryRequired = isShortSummaryRequired;
    if (isShortSummaryRequired) {
      image.content[0].text = truncate(image.content[0].text, 120);
      if (image.content.length > 1) {
        image.content = image.content.slice(0, 1);
      }
    }
    return image;
  });

  const toggleLightbox = (index: number) => {
    updateCurrentIndex(index);
    if (isMobile) {
      setMobileLightbox(!isMobileLightboxOpen);
    } else {
      setDesktopLightbox(!isDesktopLightboxOpen);
    }
  };

  const slideNext = (swiper: ISwiper | null) => {
    if (swiper !== null) {
      swiper.slideNext();
      updateGalleryIndex();
    }
  };

  const slidePrev = (swiper: ISwiper | null) => {
    if (swiper !== null) {
      swiper.slidePrev();
      updateGalleryIndex();
    }
  };

  // @ts-ignore
  useCaptureClickOutside(modalRef, () => toggleLightbox(0), [controlRef]);

  const activeImage = images[currentIndex];
  const fullImageHeading = RichText.asText(activeImage.heading);

  return (
    <StyledImageGallery>
      <div className="heading" id={stringIdfy(heading)}>
        {heading}
      </div>

      <GridLayoutContainer>
        <GridLayout>
          {images.map((image, index) => {
            const caption = RichText.asText(image.heading);
            return (
              <Image
                key={index}
                url={image.uploaded_image?.url || image.linked_image?.url}
                onClick={() => {
                  toggleLightbox(index);
                }}
                alt={caption}
              />
            );
          })}
        </GridLayout>
        <Conditional if={images.length > 2}>
          <Tag isMobile={isMobile} onClick={() => toggleLightbox(0)}>
            <MapSvg />
            {SHOW_ALL_PHOTOS}
          </Tag>
        </Conditional>
      </GridLayoutContainer>

      <Conditional if={isDesktopLightboxOpen && !isMobile}>
        <DesktopLightBox>
          <Swiper {...gallerySwiperParams}>
            {images.map((image, index) => {
              return (
                <DesktopStyledImage key={index} ref={modalRef}>
                  <Image
                    url={image.uploaded_image?.url || image.linked_image?.url}
                  />
                  <Content>
                    <div className="content-wrapper">
                      <DesktopLightboxHeading>
                        <RichContent render={image.heading} />
                      </DesktopLightboxHeading>
                      <Description width="80%" maxWidth="39.37rem">
                        <RichContent render={image.content} />
                      </Description>
                    </div>
                  </Content>
                </DesktopStyledImage>
              );
            })}
          </Swiper>
          <SwiperControls ref={controlRef}>
            <Conditional if={currentIndex}>
              <div
                className="prev-slide"
                role="button"
                tabIndex={0}
                onClick={() => slidePrev(gallerySwiper)}
              >
                {CHEVRON_LEFT_CIRCLE}
              </div>
            </Conditional>
            <Conditional if={currentIndex < images.length - 1}>
              <div
                className="next-slide"
                role="button"
                tabIndex={0}
                onClick={() => slideNext(gallerySwiper)}
              >
                {CHEVRON_LEFT_CIRCLE}
              </div>
            </Conditional>
          </SwiperControls>

          <div
            className="close"
            role="button"
            tabIndex={0}
            onClick={() => toggleLightbox(0)}
          >
            {CLOSE}
            {CLOSE_WHITE}
          </div>
        </DesktopLightBox>
      </Conditional>

      <Conditional if={isMobileLightboxOpen && isMobile}>
        <Lightbox>
          <div className="lightbox-mask" role="button" tabIndex={0} />
          <div
            className="close"
            role="button"
            tabIndex={0}
            onClick={() => toggleLightbox(0)}
          >
            {CLOSE_WHITE}
          </div>
          <FullImage>
            <Swiper {...gallerySwiperParams}>
              {images.map((image, index) => {
                return (
                  <Image
                    key={index}
                    url={image.uploaded_image?.url || image.linked_image?.url}
                    alt={fullImageHeading}
                  />
                );
              })}
            </Swiper>
            <SwiperControls ref={controlRef}>
              <Conditional if={currentIndex}>
                <div
                  className="prev-slide"
                  role="button"
                  tabIndex={0}
                  onClick={() => slidePrev(gallerySwiper)}
                >
                  {CHEVRON_LEFT_CIRCLE}
                </div>
              </Conditional>
              <Conditional if={currentIndex < images.length - 1}>
                <div
                  className="next-slide"
                  role="button"
                  tabIndex={0}
                  onClick={() => slideNext(gallerySwiper)}
                >
                  {CHEVRON_LEFT_CIRCLE}
                </div>
              </Conditional>
            </SwiperControls>
          </FullImage>
          <ContentContainer>
            <Heading>
              <RichContent render={activeImage.heading} />
            </Heading>
            <Description height="5rem">
              <RichContent render={lightboxImages[currentIndex].content} />
            </Description>
            <ThumbnailSwiper>
              <Swiper {...thumbnailSwiperParams}>
                {images.map((image, index) => {
                  const caption = RichText.asText(image.heading);
                  return (
                    <StyledImage key={index} title={caption}>
                      <Image
                        url={
                          image.uploaded_image?.url || image.linked_image?.url
                        }
                        alt={caption}
                        onClick={() => {
                          updateGalleryIndex();
                          gallerySwiper?.slideTo(index, 200);
                        }}
                        className={
                          index === currentIndex
                            ? 'active-slide'
                            : 'non-active-slide'
                        }
                      />
                    </StyledImage>
                  );
                })}
              </Swiper>
            </ThumbnailSwiper>
          </ContentContainer>
        </Lightbox>
      </Conditional>
    </StyledImageGallery>
  );
};

export default ImageGallery;
