import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import type { TImageGalleryProps } from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/interface';
import {
  AllPhotosCta,
  GalleryPopup,
  ImageGalleryWrapper,
} from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/style';
import Image from 'UI/Image';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';
import { strings } from 'const/strings';
import AllPhotos from 'assets/allPhotos';
import BackArrow from 'assets/backArrow';
import ChevronLeftCircle from 'assets/chevronLeftCircle';
import SwipesheetCross from 'assets/swipesheetCross';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: true });

const ImageGallery = ({
  imageUploads,
  startFrom = 0,
  onHide,
  showMoreButton = true,
  hideFirstImageInOverlay = false,
  controlBodyOverflow = true,
  navigation = 'cross',
  imageDimensions,
  controller,
}: TImageGalleryProps) => {
  const [isPopupActive, setisPopupActive] = useState(false);
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const swiperParams: SwiperProps = {
    slidesPerView: 1,
    centeredSlides: false,
    initialSlide: startFrom,
    onSwiper: (swiper: any) => setSwiperInstance(swiper),
    direction: 'horizontal',
  };

  const openPopup = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.ALL_PHOTOS,
      [ANALYTICS_PROPERTIES.SECTION]: 'Header',
    });
    setisPopupActive(true);
    if (controlBodyOverflow) document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    setisPopupActive(false);
    if (controlBodyOverflow) document.body.style.overflow = 'auto';
    onHide?.();
  };

  useEffect(() => {
    if (controller) {
      controller.current = {
        open: openPopup,
        close: closePopup,
      };
    }
  }, []);

  useEffect(() => {
    const bannerVideo = document.getElementById(
      'show-page-banner'
    ) as HTMLVideoElement;
    if (!bannerVideo && !controller) return;

    if (isPopupActive) {
      bannerVideo?.pause();
    } else {
      bannerVideo?.play();
    }
  }, [isPopupActive]);

  useEffect(() => {
    const closeCalendarOnEscapePressed = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePopup();
      } else if (event.key === 'ArrowRight') {
        moveNext();
      } else if (event.key === 'ArrowLeft') {
        movePrev();
      }
    };
    window.addEventListener('keydown', closeCalendarOnEscapePressed);

    return () =>
      window.removeEventListener('keydown', closeCalendarOnEscapePressed);
  }, []);

  const onListImageClicked = (index: number) => {
    swiper?.slideTo(index);
  };

  const moveNext = () => {
    swiper?.slideNext();
  };

  const movePrev = () => {
    swiper?.slidePrev();
  };

  useEffect(() => {
    const selectedListImage = document.querySelector(
      `.image-gallery-list-${activeIndex}`
    );

    selectedListImage?.scrollIntoView({
      inline: 'center',
      behavior: 'smooth',
      block: 'center',
    });

    if (isPopupActive) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.IMAGE_GALLERY.IMAGE_VIEWED,
        [ANALYTICS_PROPERTIES.RANKING]: activeIndex + 1,
      });
    }
  }, [activeIndex, isPopupActive]);

  return (
    <ImageGalleryWrapper>
      <Conditional if={showMoreButton}>
        <AllPhotosCta onClick={() => openPopup()}>
          {AllPhotos} {strings.LTT_SHOW_PAGE.ALL_PHOTOS}
        </AllPhotosCta>
      </Conditional>

      <GalleryPopup isPopupActive={isPopupActive}>
        <div
          className="overlay"
          onClick={closePopup}
          role="button"
          tabIndex={0}
        ></div>
        <div className="header">
          <div className="all-photos">
            <Conditional if={navigation === 'arrow'}>
              <div
                className="close-button"
                onClick={closePopup}
                role="button"
                tabIndex={0}
              >
                <BackArrow />
              </div>
            </Conditional>
            {strings.LTT_SHOW_PAGE.ALL_PHOTOS}
          </div>
          <Conditional if={navigation === 'cross'}>
            <div
              className="close-button"
              onClick={closePopup}
              role="button"
              tabIndex={0}
            >
              {SwipesheetCross}
            </div>
          </Conditional>
        </div>
        <div className="main-content">
          <div className="primary-section">
            <div
              onClick={movePrev}
              role="button"
              tabIndex={0}
              className={`chevron chevron-left ${
                (activeIndex ?? 0) <= 0 ? 'inactive' : ''
              }`}
            >
              {ChevronLeftCircle}
            </div>
            <div
              onClick={moveNext}
              role="button"
              tabIndex={0}
              className={`chevron chevron-right ${
                (activeIndex ?? 0) >= imageUploads.length - 1 ? 'inactive' : ''
              }`}
            >
              {ChevronLeftCircle}
            </div>

            <Swiper
              {...swiperParams}
              onSlideChange={({ realIndex }) => setActiveIndex(realIndex)}
            >
              {imageUploads
                .slice(hideFirstImageInOverlay ? 1 : 0)
                .map(({ url, alt }, index) => (
                  <Image
                    url={url}
                    alt={alt}
                    priority
                    autoCrop={true}
                    className={`image-gallery-${index} image-gallery-primary`}
                    fetchPriority="high"
                    fitCrop={true}
                    key={`main-${index}`}
                    {...(imageDimensions?.spotlight && {
                      ...imageDimensions?.spotlight,
                    })}
                  />
                ))}
            </Swiper>
          </div>
          <div className="image-list-section">
            {imageUploads
              .slice(hideFirstImageInOverlay ? 1 : 0)
              .map(({ url, alt }, index) => (
                <Image
                  draggable={false}
                  url={url}
                  alt={alt}
                  priority
                  autoCrop={true}
                  className={`image-gallery-list-${index} gallery-list-image ${
                    activeIndex === index ? 'active' : ''
                  }`}
                  fetchPriority="high"
                  fitCrop={true}
                  key={`tn-${index}`}
                  onClick={() => onListImageClicked(index)}
                  {...(imageDimensions?.thumbnail && {
                    ...imageDimensions?.thumbnail,
                  })}
                />
              ))}
          </div>
        </div>
      </GalleryPopup>
    </ImageGalleryWrapper>
  );
};

export default ImageGallery;
