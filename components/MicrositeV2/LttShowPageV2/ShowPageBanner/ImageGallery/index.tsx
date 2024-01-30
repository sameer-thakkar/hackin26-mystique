import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import { TImageGalleryProps } from 'components/MicrositeV2/LttShowPageV2/ShowPageBanner/ImageGallery/interface';
import {
  AllPhotosCta,
  GalleryPopup,
  ImageGalleryWrapper,
} from 'components/MicrositeV2/LttShowPageV2/ShowPageBanner/ImageGallery/style';
import Image from 'UI/Image';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';
import { strings } from 'const/strings';
import AllPhotos from 'assets/allPhotos';
import ChevronLeftCircle from 'assets/chevronLeftCircle';
import SweipesheetCross from 'assets/sweipesheetCross';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: true });

const ImageGallery = ({ imageUploads }: TImageGalleryProps) => {
  const [isPopupActive, setisPopupActive] = useState(false);
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const swiperParams: SwiperProps = {
    slidesPerView: 1,
    centeredSlides: false,
    initialSlide: 0,
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
    setActiveIndex(0);
    swiper?.slideTo(0);
    document.body.style.overflow = 'hidden';
  };
  const closePopup = () => {
    setisPopupActive(false);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const bannerVideo = document.getElementById(
      'show-page-banner'
    ) as HTMLVideoElement;
    if (!bannerVideo) return;

    const closeCalendarOnEscapePressed = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePopup();
      }
    };
    if (isPopupActive) {
      bannerVideo.pause();
      window.addEventListener('keydown', closeCalendarOnEscapePressed);
    } else {
      bannerVideo.play();
      window.removeEventListener('keydown', closeCalendarOnEscapePressed);
    }

    return () =>
      window.removeEventListener('keydown', closeCalendarOnEscapePressed);
  }, [isPopupActive]);

  const onListImageClicked = (index: number) => {
    setActiveIndex(index);
    swiper?.slideTo(index);
  };

  const onSlideChange = (swiper: TSwiper) => {
    setActiveIndex(swiper.realIndex);
  };
  const goNext = () => {
    if (swiper !== null) {
      swiper.slideNext();
    }
  };
  const goPrev = () => {
    if (swiper !== null) {
      swiper.slidePrev();
    }
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

    trackEvent({
      eventName: ANALYTICS_EVENTS.IMAGE_GALLERY.IMAGE_VIEWED,
      [ANALYTICS_PROPERTIES.RANKING]: activeIndex + 1,
    });
  }, [activeIndex]);

  return (
    <ImageGalleryWrapper>
      <AllPhotosCta onClick={openPopup}>
        {AllPhotos} {strings.LTT_SHOW_PAGE.ALL_PHOTOS}
      </AllPhotosCta>

      <GalleryPopup isPopupActive={isPopupActive}>
        <div
          className="overlay"
          onClick={closePopup}
          role="button"
          tabIndex={0}
        ></div>
        <div className="header">
          <div className="all-photos">{strings.LTT_SHOW_PAGE.ALL_PHOTOS}</div>
          <div
            className="close-button"
            onClick={closePopup}
            role="button"
            tabIndex={0}
          >
            {SweipesheetCross}
          </div>
        </div>
        <div className="main-content">
          <div className="primary-section">
            <div
              onClick={goPrev}
              role="button"
              tabIndex={0}
              className={`chevron chevron-left ${
                activeIndex <= 0 ? 'inactive' : ''
              }`}
            >
              {ChevronLeftCircle}
            </div>
            <div
              onClick={goNext}
              role="button"
              tabIndex={0}
              className={`chevron chevron-right ${
                activeIndex >= imageUploads.length - 2 ? 'inactive' : ''
              }`}
            >
              {ChevronLeftCircle}
            </div>

            <Swiper {...swiperParams} onSlideChange={onSlideChange}>
              {imageUploads.slice(1).map(({ url, alt }, index) => (
                <Image
                  url={url}
                  alt={alt}
                  priority
                  autoCrop={true}
                  className={`image-gallery-${index} image-gallery-primary`}
                  fetchPriority="high"
                  fitCrop={true}
                  key={index}
                />
              ))}
            </Swiper>
          </div>
          <div className="image-list-section">
            {imageUploads.slice(1).map(({ url, alt }, index) => (
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
                key={index}
                onClick={() => onListImageClicked(index)}
              />
            ))}
          </div>
        </div>
      </GalleryPopup>
    </ImageGalleryWrapper>
  );
};

export default ImageGallery;
