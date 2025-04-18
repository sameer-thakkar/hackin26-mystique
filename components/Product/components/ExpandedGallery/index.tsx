import React, { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import dynamic from 'next/dynamic';
import Conditional from 'components/common/Conditional';
import ImageGallery from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery';
import { AllPhotosCta } from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/style';
import Image from 'UI/Image';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  IMAGE_GALLERY_DIMENSIONS,
  PRODUCT_CARD_CHILDREN_POSITIONS,
} from 'const/index';
import { strings } from 'const/strings';
import AllPhotos from 'assets/allPhotos';
import type { TExpandedGalleryProps } from './interface';
import { ExpandedGalleryContainer, GalleryViewContainer } from './styles';

const VideoPlayer = dynamic(
  import(/* webpackChunkName: "VideoPlayer" */ 'components/common/VideoPlayer')
);

const HolidayTheming = dynamic(
  () =>
    import(
      /* webpackChunkName: 'Holiday Theming' */ 'components/HolidayTheming'
    ),
  { ssr: false }
);

const IMAGE_DIMENSIONS = [
  { height: 320, width: 512 },
  { width: 396, height: 248 },
  { height: 320, width: 512 },
];

const ExpandedGallery = ({
  images,
  videoUrl,
  controller,
  isMobile = false,
  onVideoPlayerReady,
}: TExpandedGalleryProps) => {
  const [galleryImageIndex, setGalleryImageIndex] = useState(-1);
  const [numberOfImagesLoaded, setNumberOfImagesLoaded] = useState(
    Number(!!videoUrl)
  );
  const [loadVideo, setLoadVideo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setGalleryImageIndex(-1);
  };

  const onImageLoad = () => {
    setNumberOfImagesLoaded((prevState) => prevState + 1);
  };

  useEffect(() => {
    if (!videoUrl) return;
    setTimeout(() => {
      setLoadVideo(true);
    }, 200);
  }, []);

  const MAX_LEN = Math.min(3, images.length + Number(!!videoUrl));

  const onClickHandler = (index: number) => {
    if (MAX_LEN < 2) return;
    setGalleryImageIndex(index);
    controller?.current?.open();
    trackEvent({
      eventName: ANALYTICS_EVENTS.IMAGE_GALLERY.IMAGE_GALLERY_OPENED,
      [ANALYTICS_PROPERTIES.POSITION]:
        PRODUCT_CARD_CHILDREN_POSITIONS.MORE_DETAILS,
    });
  };

  if (MAX_LEN === 0) return null;

  const { height, width } = IMAGE_DIMENSIONS[MAX_LEN - 1];

  const imagesLoaded = numberOfImagesLoaded + 1 >= MAX_LEN - Number(!!videoUrl);

  return (
    <>
      <ExpandedGalleryContainer
        $numberOfImages={MAX_LEN}
        $imagesLoaded={imagesLoaded}
        ref={containerRef}
      >
        {Array.from({ length: MAX_LEN - (videoUrl ? 1 : 0) }).map(
          (_, index) => (
            <Skeleton key={index} containerClassName="gallery-children" />
          )
        )}
        <Conditional if={videoUrl}>
          <Skeleton key={2} containerClassName="gallery-children" />
          {loadVideo ? (
            <VideoPlayer
              onPlayerReady={onVideoPlayerReady}
              videoUrl={videoUrl || ''}
              className="gallery-children"
              showMuteControls
              playPauseThreshold={0.3}
            />
          ) : (
            <Skeleton key={3} containerClassName="gallery-children" />
          )}
        </Conditional>
        {images.slice(0, MAX_LEN - (videoUrl ? 1 : 0)).map((image, index) => {
          return (
            <Image
              className="gallery-children"
              key={image.url}
              url={image.url}
              alt={image.alt}
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
              onLoad={() => onImageLoad()}
            />
          );
        })}

        <HolidayTheming variant="desktop" />
        <Conditional if={imagesLoaded && images.length > 3}>
          <AllPhotosCta onClick={() => onClickHandler(0)}>
            {AllPhotos} {strings.SHOW_PAGE_V2.ALL_PHOTOS}
          </AllPhotosCta>
        </Conditional>
      </ExpandedGalleryContainer>
      <Conditional if={MAX_LEN > 1}>
        <GalleryViewContainer>
          <ImageGallery
            imageUploads={images}
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
              spotlight: isMobile
                ? IMAGE_GALLERY_DIMENSIONS.MOBILE.spotlight
                : IMAGE_GALLERY_DIMENSIONS.DESKTOP.spotlight,

              thumbnail: isMobile
                ? IMAGE_GALLERY_DIMENSIONS.MOBILE.thumbnail
                : IMAGE_GALLERY_DIMENSIONS.DESKTOP.thumbnail,
            }}
            controller={controller}
          />
        </GalleryViewContainer>
      </Conditional>
    </>
  );
};

export default ExpandedGallery;
