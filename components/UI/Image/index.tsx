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
  cropMode = '',
  addDarkOverlay,
  onClick,
  fitCrop = false,
  blurFill = false,
  layout = undefined,
  objectFit,
  fetchPriority = 'auto',
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
    blurFill
  );

  defaultImageSrc = generateImageImgixUrl(
    format,
    url,
    // @ts-expect-error TS(2345): Argument of type 'string | number | undefined' is ... Remove this comment to see the full error message
    calculatedWidth,
    calculatedHeight,
    quality,
    aspectRatio,
    autoCrop,
    cropMode,
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
        // @ts-expect-error TS(2322): Type 'number | null' is not assignable to type 'st... Remove this comment to see the full error message
        width={fillImageProp ? null : Number(calculatedWidth)}
        // @ts-expect-error TS(2322): Type 'number | null' is not assignable to type 'st... Remove this comment to see the full error message
        height={fillImageProp ? null : Number(calculatedHeight)}
        layout={fillImageProp ? 'fill' : layout}
        alt={alt}
        placeholder={'blur'}
        blurDataURL={blurDataUrl}
        priority={priority}
        objectFit={objectFit}
        unoptimized // We use IMGIX, which does all the optimisation required. Letting Next process images will add to TTFB.
        fetchpriority={fetchPriority}
      />
      <Conditional if={!!attribution}>
        <Tooltip content={attribution} trigger={INFO_ICON} />
      </Conditional>
    </Wrapper>
  );
};

export default Image;
