import React, {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import { useRecoilValue } from 'recoil';
import type { Swiper as ISwiper } from 'swiper';
import type { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import GridLayout from 'components/slices/ImageGallery/components/GridLayout';
import type { ImageGalleryProps } from 'components/slices/ImageGallery/interface';
import {
  CaptionedImageWrapper,
  Content,
  ContentContainer,
  Description,
  DesktopLightBox,
  DesktopLightboxHeading,
  DesktopStyledImage,
  FullImage,
  GridLayoutContainer,
  Heading,
  Lightbox,
  StyledImage,
  StyledImageGallery,
  SwiperControls,
  Tag,
  TagContainer,
  ThumbnailSwiper,
} from 'components/slices/ImageGallery/style';
import Image from 'UI/Image';
import RichContent from 'UI/RichContent';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { generateSidenavId, truncate } from 'utils/helper';
import { gtmAtom } from 'store/atoms/gtm';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { CHEVRON_LEFT_CIRCLE, CLOSE_WHITE, GRID_ICON } from 'assets/SvgIcons';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
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
  const { images, heading, $isNewsPage, isMobile } = props;

  const [isDesktopLightboxOpen, setDesktopLightbox] = useState(false);
  const [isMobileLightboxOpen, setMobileLightbox] = useState(false);
  const [gallerySwiper, updateGallerySwiper] = useState<ISwiper | null>(null);
  const [thumbnailSwiper, updateThumbnailSwiper] = useState<ISwiper | null>(
    null
  );
  const [currentIndex, updateCurrentIndex] = useState(0);
  const [ctaContainerWidth, setCtaContainerWidth] = useState(0);
  const [ctaContainerHeight, setCtaContainerHeight] = useState(0);
  const modalRef = useRef(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const imageGalleryRef = useRef(null);
  const lastVisibleImageRef = useRef<HTMLDivElement>(null);
  const { eventsReady } = useRecoilValue(gtmAtom);
  const isImageGalleryVisible = useOnScreen({
    ref: imageGalleryRef,
    unobserve: true,
    options: { threshold: 0.5 },
  });
  const {
    IMAGE_GALLERY_CLOSED,
    IMAGE_GALLERY_OPENED,
    IMAGE_GALLERY_SECTION_VIEWED,
    IMAGE_VIEWED,
    IMAGE_GALLERY_PRESENT,
  } = ANALYTICS_EVENTS.IMAGE_GALLERY;
  const { RANKING } = ANALYTICS_PROPERTIES;

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

  useEffect(() => {
    if (!eventsReady) return;

    trackEvent({
      eventName: IMAGE_GALLERY_PRESENT,
    });
  }, [eventsReady]);

  useEffect(() => {
    if (isImageGalleryVisible) {
      trackEvent({
        eventName: IMAGE_GALLERY_SECTION_VIEWED,
      });
    }
  }, [isImageGalleryVisible]);

  useLayoutEffect(() => {
    if (!lastVisibleImageRef.current) return;
    setCtaContainerWidth(lastVisibleImageRef.current.offsetWidth);
    setCtaContainerHeight(lastVisibleImageRef.current.offsetHeight);
  }, []);

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

  const handleTrackingEvents = (eventName: any, properties: any) => {
    trackEvent({
      eventName,
      ...properties,
    });
  };

  const handleImageClickOnDesktop = (index: number) => {
    toggleLightbox(index);
    handleTrackingEvents(IMAGE_GALLERY_OPENED, {
      [RANKING]: index + 1,
    });
    handleTrackingEvents(IMAGE_VIEWED, {
      [RANKING]: index + 1,
    });
  };

  const handleTagClick = () => {
    toggleLightbox(0);
    handleTrackingEvents(IMAGE_GALLERY_OPENED, {
      [RANKING]: null,
    });
  };

  const handleSlideClick = (direction: 'prev' | 'next') => {
    if (direction === 'prev') slidePrev(gallerySwiper);
    else slideNext(gallerySwiper);

    handleTrackingEvents(IMAGE_VIEWED, {
      [RANKING]: direction === 'prev' ? currentIndex : currentIndex + 2,
    });
  };

  const handleGalleryClose = () => {
    toggleLightbox(0);
    handleTrackingEvents(IMAGE_GALLERY_CLOSED, {
      [RANKING]: currentIndex + 1,
    });
  };

  const handleClickOnThumbnailSwiper = (index: number) => {
    updateGalleryIndex();
    gallerySwiper?.slideTo(index, 200);
    handleTrackingEvents(IMAGE_VIEWED, {
      [RANKING]: index + 1,
    });
  };

  useCaptureClickOutside(
    modalRef,
    () => {
      toggleLightbox(0);
      handleTrackingEvents(IMAGE_GALLERY_CLOSED, {
        [RANKING]: currentIndex + 1,
      });
    },
    [controlRef]
  );

  const activeImage = images[currentIndex];
  const fullImageHeading = RichText.asText(activeImage.heading);

  return (
    <StyledImageGallery ref={imageGalleryRef} $isNewsPage={$isNewsPage}>
      <Conditional if={heading}>
        <h2 className="heading" id={generateSidenavId(heading)}>
          {heading}
        </h2>
      </Conditional>

      <GridLayoutContainer>
        <GridLayout $isNewspage={$isNewsPage}>
          {images.map((image, index) => {
            const caption = RichText.asText(image.heading);
            const description = RichText.asText(image.content);
            const showCaptionOverlay =
              index === 0 && images.length > 2 && !isMobile;
            const isImageUnderCta =
              images.length < 5 ? index + 1 === 3 : index + 1 === 5;

            return (
              <React.Fragment key={index}>
                <Conditional if={showCaptionOverlay}>
                  <CaptionedImageWrapper
                    role="figure"
                    aria-labelledby="title"
                    aria-describedby="description"
                  >
                    <Image
                      url={image.linked_image?.url || image.uploaded_image?.url}
                      onClick={() => handleImageClickOnDesktop(index)}
                      alt={image.image_alt || caption}
                      className="captioned-image"
                    />
                    <div className="image-overlay">
                      <h4 id="title">{caption}</h4>
                      <p id="description">{description}</p>
                    </div>
                  </CaptionedImageWrapper>
                </Conditional>
                <Conditional if={!showCaptionOverlay}>
                  <Image
                    url={image.linked_image?.url || image.uploaded_image?.url}
                    onClick={() => handleImageClickOnDesktop(index)}
                    alt={image.image_alt || caption}
                    addDarkOverlay={isImageUnderCta}
                    {...(isImageUnderCta && { ref: lastVisibleImageRef })}
                  />
                </Conditional>
              </React.Fragment>
            );
          })}
        </GridLayout>
        <Conditional if={images.length > 2 && !$isNewsPage}>
          <TagContainer
            $ctaContainerWidth={ctaContainerWidth}
            $ctaContainerHeight={ctaContainerHeight}
          >
            <Tag onClick={handleTagClick}>
              <GRID_ICON />
              {strings.SEE_ALL_PHOTOS}
            </Tag>
          </TagContainer>
        </Conditional>
      </GridLayoutContainer>

      <Conditional if={isDesktopLightboxOpen && !isMobile && !$isNewsPage}>
        <DesktopLightBox>
          <Swiper {...gallerySwiperParams}>
            {images.map((image, index) => {
              return (
                <DesktopStyledImage key={index} ref={modalRef}>
                  <Image
                    url={image.linked_image?.url || image.uploaded_image?.url}
                    alt={RichText.asText(image.heading) || ''}
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
          <SwiperControls ref={controlRef as RefObject<HTMLDivElement>}>
            <Conditional if={currentIndex}>
              <div
                className="prev-slide"
                role="button"
                tabIndex={0}
                onClick={() => handleSlideClick('prev')}
              >
                {CHEVRON_LEFT_CIRCLE}
              </div>
            </Conditional>
            <Conditional if={currentIndex < images.length - 1}>
              <div
                className="next-slide"
                role="button"
                tabIndex={0}
                onClick={() => handleSlideClick('next')}
              >
                {CHEVRON_LEFT_CIRCLE}
              </div>
            </Conditional>
          </SwiperControls>

          <div
            className="close"
            role="button"
            tabIndex={0}
            onClick={() => handleGalleryClose}
          >
            {strings.CLOSE}
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
            onClick={handleGalleryClose}
          >
            {CLOSE_WHITE}
          </div>
          <FullImage>
            <Swiper {...gallerySwiperParams}>
              {images.map((image, index) => {
                return (
                  <Image
                    key={index}
                    url={image.linked_image?.url || image.uploaded_image?.url}
                    alt={image.image_alt || fullImageHeading}
                  />
                );
              })}
            </Swiper>
            <SwiperControls ref={controlRef as RefObject<HTMLDivElement>}>
              <Conditional if={currentIndex}>
                <div
                  className="prev-slide"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSlideClick('prev')}
                >
                  {CHEVRON_LEFT_CIRCLE}
                </div>
              </Conditional>
              <Conditional if={currentIndex < images.length - 1}>
                <div
                  className="next-slide"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSlideClick('next')}
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
                        alt={image.image_alt || caption}
                        onClick={() => handleClickOnThumbnailSwiper(index)}
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
