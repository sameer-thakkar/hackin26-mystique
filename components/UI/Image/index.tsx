import React, { useState } from 'react';
import FutureImage from 'next/future/image';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import { IImageProps } from 'UI/Image/interface';
import { generateImageImgixUrl } from 'UI/Image/util';
import Tooltip from 'UI/Tooltip';
import { appAtom } from 'store/atoms/app';
import { CARD_SECTION_MARKERS } from 'const/productCard';
import InfoIcon from 'assets/infoIcon';

export const Wrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  .tooltip {
    position: absolute;
    bottom: 8px;
    right: 8px;
    width: 100%;
    display: grid;
    justify-items: right;
    .content {
      position: absolute;
      max-width: 200px;
      top: calc(50% - 4px);
      right: 32px;
      transform: translateY(-50%);
      z-index: 1;
      font-size: 80%;
    }
  }
`;

const Image: React.ForwardRefRenderFunction<HTMLDivElement, IImageProps> = (
  {
    url,
    width,
    height,
    quality = 75,
    imageId = '',
    fill = false,
    aspectRatio,
    format = 'auto',
    priority = false,
    alt = '',
    className = '',
    mobileUrl,
    attribution = '',
    autoCrop = true,
    cropMode = '',
    addDarkOverlay,
    onClick,
    fitCrop = false,
    minFit = false,
    blurFill = false,
    fetchPriority = 'auto',
    fallbackImg = '',
    onLoadingComplete,
    loadHigherQualityImage: loadHigherQualityImageProp = false,
  },
  ref
) => {
  const { isMobile } = useRecoilValue(appAtom);
  // Loading a lower quality image by reducing the dimensions.
  let calculatedWidth = width,
    calculatedHeight = height,
    mobileImageSrc,
    defaultImageSrc,
    fillImageProp = fill;

  if (aspectRatio) {
    const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
    if (width && !height)
      calculatedHeight = Number(width) * (heightRatio / widthRatio);
    if (height && !width)
      calculatedWidth = Number(height) * (widthRatio / heightRatio);
  }

  const multiplier = loadHigherQualityImageProp ? 1.5 : 1;

  calculatedWidth = (calculatedWidth as number) * multiplier;
  calculatedHeight = (calculatedHeight as number) * multiplier;

  mobileImageSrc = generateImageImgixUrl(
    format,
    // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    mobileUrl,
    calculatedWidth,
    calculatedHeight,
    quality,
    aspectRatio,
    autoCrop,
    cropMode,
    addDarkOverlay,
    fitCrop,
    blurFill,
    minFit
  );

  defaultImageSrc = generateImageImgixUrl(
    format,
    url,
    calculatedWidth,
    calculatedHeight,
    quality,
    aspectRatio,
    autoCrop,
    cropMode,
    addDarkOverlay,
    fitCrop,
    blurFill,
    minFit
  );

  const fallbackImgUrl = generateImageImgixUrl(
    format,
    fallbackImg,
    calculatedWidth,
    calculatedHeight,
    quality,
    aspectRatio,
    autoCrop,
    cropMode,
    addDarkOverlay,
    fitCrop,
    blurFill,
    minFit
  );

  const [useFallback, setUseFallback] = useState(false);

  if (!defaultImageSrc?.length) {
    return null;
  }

  if (fill || (!calculatedHeight && !calculatedWidth)) {
    fillImageProp = true;
  }

  const imgSrc = useFallback
    ? fallbackImgUrl
    : isMobile && mobileImageSrc
    ? mobileImageSrc
    : defaultImageSrc;

  return (
    <Wrapper className={`image-wrap ${className}`} onClick={onClick} ref={ref}>
      <FutureImage
        className={imageId}
        src={imgSrc}
        data-card-section={CARD_SECTION_MARKERS.IMAGE}
        width={fillImageProp ? undefined : Number(calculatedWidth)}
        height={fillImageProp ? undefined : Number(calculatedHeight)}
        alt={alt}
        placeholder={'empty'}
        priority={priority}
        unoptimized // We use IMGIX, which does all the optimisation required. Letting Next process images will add to TTFB.
        fill={fillImageProp}
        // @ts-ignore
        fetchpriority={fetchPriority}
        onError={() => {
          if (fallbackImgUrl) {
            setUseFallback(true);
          }
        }}
        onLoadingComplete={onLoadingComplete}
      />
      <Conditional if={!!attribution}>
        <Tooltip content={attribution} trigger={InfoIcon} />
      </Conditional>
    </Wrapper>
  );
};

export default React.forwardRef(Image);
