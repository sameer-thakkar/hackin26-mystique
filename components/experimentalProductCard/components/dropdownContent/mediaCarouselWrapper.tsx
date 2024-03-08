import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import MediaCarousel from 'UI/MediaCarousel';
import COLORS from 'const/colors';
import { MEDIA_CAROUSEL_IMAGE_LIMIT } from 'const/index';
import { ImageContainer } from './styles';

interface MediaCarouselProps {
  images: string[];
  isBannerCard?: boolean;
  bannerVideo?: string;
  mediaCarouselImageWidth?: number;
  mediaCarouselImageHeight?: number;
  isFirstProduct?: boolean;
  tgid: string;
  shouldCropImage?: boolean;
  setImageHeight?: (height: number) => void;
  isOpen?: boolean;
}

const MediaCarouselWrapper: FC<MediaCarouselProps> = (props) => {
  const {
    images,
    isBannerCard,
    bannerVideo,
    mediaCarouselImageWidth,
    mediaCarouselImageHeight,
    isFirstProduct,
    tgid,
    shouldCropImage,
    setImageHeight,
  } = props;

  const imageRef = useRef<HTMLDivElement>(null);

  const limitedImages = useMemo(
    () => images.slice(0, MEDIA_CAROUSEL_IMAGE_LIMIT),
    [images]
  );

  const updateImageHeight = useCallback(() => {
    if (!imageRef.current) return;
    setImageHeight?.(imageRef.current.clientHeight - 10);
  }, [setImageHeight]);

  useEffect(() => {
    updateImageHeight();
  }, [updateImageHeight]);

  return (
    <ImageContainer ref={imageRef}>
      <MediaCarousel
        imageList={limitedImages as any}
        videoUrl={isBannerCard ? bannerVideo : undefined}
        imageId="card-img"
        backgroundColor={COLORS.GRAY.G7}
        imageWidth={mediaCarouselImageWidth}
        imageHeight={mediaCarouselImageHeight}
        isFirstProduct={isFirstProduct}
        tgid={tgid}
        isMobile={true}
        shouldCrop={shouldCropImage}
        showOverlay
        showPagination={false}
        showTimedPaginator={true}
        bottomPosition="12px"
        enableAutoplay={false}
        trackImage={false}
        isTimed={false}
      />
    </ImageContainer>
  );
};

export default React.memo(MediaCarouselWrapper);
