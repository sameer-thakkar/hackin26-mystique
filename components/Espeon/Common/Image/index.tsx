import React, { forwardRef, useState } from 'react';
import NextImage from 'next/image';
import { cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import { DEFAULT_IMAGE_DENSITY } from 'components/Espeon/constants';
import {
  generateImgixUrl,
  getBlurDataUrl,
} from 'components/Espeon/utils/image';
import { imageWrapper } from './styles';
import { EImagePlaceholder, type TImage } from './types';

const ImageWithoutRef: React.ForwardRefRenderFunction<
  HTMLDivElement,
  TImage
> = (props, ref) => {
  const {
    url,
    mobileUrl = '',
    alt = '',
    width,
    height,
    quality = 75,
    fill = false,
    aspectRatio,
    format = 'auto',
    priority = false,
    className = '',
    autoCrop = true,
    fit,
    cropMode,
    addDarkOverlay = false,
    blurFill = false,
    // fetchPriority = 'auto',
    placeholder = 'empty',
    fallbackImgUrl = '',
    onClick,
    onKeyDown,
    attribution,
    onLoad,
    loading,
    isMobile,
    imageId,
    onLoadingComplete,
    density = DEFAULT_IMAGE_DENSITY,
  } = props;

  const [useFallback, setUseFallback] = useState(false);

  let calculatedWidth = Number(width);
  let calculatedHeight = Number(height);
  if (aspectRatio) {
    const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
    if (width && !height)
      calculatedHeight = Number(width) * (heightRatio / widthRatio);
    if (height && !width)
      calculatedWidth = Number(height) * (widthRatio / heightRatio);
  }

  if (!url) return null;

  const fillImage = fill || (!calculatedHeight && !calculatedWidth);

  const imageUrl = useFallback
    ? fallbackImgUrl
    : isMobile && mobileUrl
    ? mobileUrl
    : url;

  const imgixUrl = generateImgixUrl({
    url: imageUrl,
    format,
    width: calculatedWidth,
    height: calculatedHeight,
    quality,
    ...(aspectRatio && { aspectRatio }),
    autoCrop,
    ...(fit && { fit }),
    ...(cropMode && { cropMode }),
    addDarkOverlay,
    blurFill,
    density,
  });

  return (
    <div
      className={cx(imageWrapper, className)}
      {...((onClick || onKeyDown) && {
        onClick,
        onKeyDown,
        role: 'button',
        tabIndex: 0,
      })}
      ref={ref}
    >
      <NextImage
        data-qa-marker="image"
        id={imageId}
        src={imgixUrl}
        alt={alt}
        width={fillImage ? undefined : calculatedWidth}
        height={fillImage ? undefined : calculatedHeight}
        placeholder={placeholder as any}
        blurDataURL={
          placeholder === EImagePlaceholder.Blur
            ? getBlurDataUrl(calculatedWidth, calculatedHeight)
            : undefined
        }
        priority={priority}
        unoptimized //imgix handles all the optimisations for us. Letting Next process images will add to TTFB.
        // fill={fillImage}
        // fetchPriority={fetchPriority}
        onError={() => {
          if (fallbackImgUrl) setUseFallback(true);
        }}
        onLoad={onLoad}
        onLoadingComplete={onLoadingComplete}
        loading={loading}
      />
      <Conditional if={!!attribution}>{attribution}</Conditional>
    </div>
  );
};

export const Image = forwardRef(ImageWithoutRef);
