import React, { useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import Conditional from 'components/common/Conditional';
import ImageGallery from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery';
import type { TImageGalleryController } from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/interface';
import { AllPhotosCta } from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/style';
import Image from 'UI/Image';
import Video from 'UI/Video';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PRODUCT_CARD_CHILDREN_POSITIONS,
  VIDEO_POSITIONS,
} from 'const/index';
import { strings } from 'const/strings';
import AllPhotos from 'assets/allPhotos';
import type { TExpandedGalleryProps } from './interface';
import { ExpandedGalleryContainer, GalleryViewContainer } from './styles';

const IMAGE_DIMENSIONS = [
  { height: 320, width: 512 },
  { width: 396, height: 248 },
  { height: 320, width: 512 },
];

const ExpandedGallery = ({ images, videoUrl }: TExpandedGalleryProps) => {
  const [galleryImageIndex, setGalleryImageIndex] = useState(-1);
  const [numberOfImagesLoaded, setNumberOfImagesLoaded] = useState(0);
  const MAX_LEN = Math.min(3, images.length);
  const containerRef = useRef<HTMLDivElement>(null);

  const controller = useRef<TImageGalleryController>();

  const close = () => {
    setGalleryImageIndex(-1);
  };

  const onClickHandler = (index: number) => {
    if (MAX_LEN < 2) return;
    setGalleryImageIndex(index);
    controller.current?.open();
    trackEvent({
      eventName: ANALYTICS_EVENTS.IMAGE_GALLERY.IMAGE_GALLERY_OPENED,
      [ANALYTICS_PROPERTIES.POSITION]:
        PRODUCT_CARD_CHILDREN_POSITIONS.MORE_DETAILS,
    });
  };

  const onImageLoad = () => {
    setNumberOfImagesLoaded(numberOfImagesLoaded + 1);
  };

  if (MAX_LEN === 0) return null;

  const { height, width } = IMAGE_DIMENSIONS[MAX_LEN - 1];

  const imagesLoaded = numberOfImagesLoaded + 1 >= MAX_LEN;

  return (
    <>
      <ExpandedGalleryContainer
        $numberOfImages={MAX_LEN}
        $imagesLoaded={imagesLoaded}
        ref={containerRef}
      >
        {Array.from({ length: MAX_LEN }).map((_, index) => (
          <Skeleton key={index} containerClassName="gallery-children" />
        ))}
        {images.slice(0, MAX_LEN).map((image, index) => {
          return videoUrl && index === 0 ? (
            <Video
              key={videoUrl}
              url={videoUrl}
              fallbackImage={image}
              imageAspectRatio={'16:9'}
              shouldVideoPlay
              videoPosition={VIDEO_POSITIONS.PRODUCT_CARD}
              showPauseIcon={false}
              showPlayIcon={false}
            />
          ) : (
            <Image
              className="gallery-children"
              key={image.url}
              url={image.url}
              alt={image.altText}
              height={height}
              width={width}
              aspectRatio={'16:10'}
              autoCrop={false}
              fitCrop
              cropMode={['faces', 'center']}
              priority
              fetchPriority={'high'}
              fill
              onClick={() => onClickHandler(index)}
              onLoadingComplete={() => onImageLoad()}
            />
          );
        })}
        <Conditional if={imagesLoaded && images.length > 3}>
          <AllPhotosCta onClick={() => onClickHandler(0)}>
            {AllPhotos} {strings.SHOW_PAGE_V2.ALL_PHOTOS}
          </AllPhotosCta>
        </Conditional>
      </ExpandedGalleryContainer>
      <Conditional if={MAX_LEN > 1}>
        <GalleryViewContainer>
          <ImageGallery
            imageUploads={images.map(({ url, altText }) => ({
              url,
              alt: altText,
            }))}
            startFrom={galleryImageIndex}
            onHide={() => {
              close();
              trackEvent({
                eventName: ANALYTICS_EVENTS.IMAGE_GALLERY.IMAGE_GALLERY_CLOSED,
                [ANALYTICS_PROPERTIES.POSITION]: 'More Details',
              });
            }}
            showMoreButton={false}
            hideFirstImageInOverlay={false}
            controlBodyOverflow={false}
            navigation="arrow"
            imageDimensions={{
              spotlight: {
                height: 446,
                width: 728,
              },
              thumbnail: {
                height: 85,
                width: 136,
              },
            }}
            controller={controller}
          />
        </GalleryViewContainer>
      </Conditional>
    </>
  );
};

export default ExpandedGallery;
