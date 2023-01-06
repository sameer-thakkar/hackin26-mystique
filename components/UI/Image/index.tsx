import React from 'react';
import styled from 'styled-components';
import FutureImage from 'next/image';
import Conditional from 'components/common/Conditional';
import { INFO_ICON } from 'assets/SvgIcons';
import { generateImageImgixUrl, getBlurDataUrl } from 'UI/Image/util';

import { IImageProps } from './interface';
import Tooltip from '../Tooltip';

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

const Image: React.FC<IImageProps> = ({
  url,
  width,
  height,
  quality = 75,
  imageId = '',
  fill = false,
  aspectRatio,
  format = 'webp',
  priority = false,
  alt = '',
  className = '',
  mobileUrl,
  attribution = '',
  autoCrop = true,
  addDarkOverlay,
  onClick,
  fitCrop = false,
  blurFill = false,
  layout = undefined,
  objectFit,
}) => {
  let calculatedWidth = width,
    calculatedHeight = height,
    mobileImageSrc,
    defaultImageSrc,
    blurDataUrl,
    fillImageProp = fill;

  if (aspectRatio) {
    const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
    if (width && !height)
      calculatedHeight = Number(width) * (heightRatio / widthRatio);
    if (height && !width)
      calculatedWidth = Number(height) * (widthRatio / heightRatio);
  }

  mobileImageSrc = generateImageImgixUrl(
    format,
    mobileUrl,
    calculatedWidth,
    calculatedHeight,
    quality,
    aspectRatio,
    autoCrop,
    addDarkOverlay,
    fitCrop,
    blurFill
  );

  defaultImageSrc = generateImageImgixUrl(
    format,
    url,
    calculatedWidth,
    calculatedHeight,
    quality,
    aspectRatio,
    autoCrop,
    addDarkOverlay,
    fitCrop,
    blurFill
  );

  blurDataUrl = getBlurDataUrl(
    Number(calculatedWidth),
    Number(calculatedHeight)
  );

  if (!defaultImageSrc?.length) {
    return null;
  }

  if (fill || (!calculatedHeight && !calculatedWidth)) {
    fillImageProp = true;
  }

  return (
    <Wrapper className={`image-wrap ${className}`} onClick={onClick}>
      <FutureImage
        className={imageId}
        src={defaultImageSrc}
        data-srcset={`${
          mobileUrl ? mobileImageSrc + ' 768w,' : ''
        }${defaultImageSrc}`}
        width={fillImageProp ? null : Number(calculatedWidth)}
        height={fillImageProp ? null : Number(calculatedHeight)}
        layout={fillImageProp ? 'fill' : layout}
        alt={alt}
        placeholder={!priority ? 'blur' : 'empty'}
        blurDataURL={blurDataUrl}
        priority={priority}
        objectFit={objectFit}
        unoptimized // We use IMGIX, which does all the optimisation required. Letting Next process images will add to TTFB.
      />
      <Conditional if={!!attribution}>
        <Tooltip content={attribution} trigger={INFO_ICON} />
      </Conditional>
    </Wrapper>
  );
};

export default Image;
