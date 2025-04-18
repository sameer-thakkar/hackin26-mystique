import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import dynamic from 'next/dynamic';
import Conditional from 'components/common/Conditional';
import MediaCarousel from 'UI/MediaCarousel';
import { useProductCard } from 'contexts/productCardContext';
import COLORS from 'const/colors';
import { MEDIA_CAROUSEL_IMAGE_LIMIT } from 'const/index';
import { SWIPESHEET_STATES } from 'const/productCard';
import CrossiconSvg from 'assets/crossiconSvg';
import { CloseIconWrapper, ImageContainer } from './styles';

const HolidayTheming = dynamic(
  () =>
    import(
      /* webpackChunkName: 'Holiday Theming' */ 'components/HolidayTheming'
    ),
  { ssr: false }
);

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

const MediaCarouselWrapper: FC<React.PropsWithChildren<MediaCarouselProps>> = (
  props
) => {
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
  const { drawerState } = useProductCard();

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
      <Conditional if={drawerState === SWIPESHEET_STATES.OPEN}>
        <CloseIconWrapper
          onClick={() => {
            document.getElementById('bottomsheet-overlay')?.click();
          }}
        >
          <CrossiconSvg
            fill={COLORS.BRAND.WHITE}
            height={'1rem'}
            width={'0.75rem'}
          />
        </CloseIconWrapper>
      </Conditional>
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
        hideBorderRadius={true}
      />
      <HolidayTheming variant="mobile" />
    </ImageContainer>
  );
};

export default memo(MediaCarouselWrapper);
