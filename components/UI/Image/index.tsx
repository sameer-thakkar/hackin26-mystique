import React from 'react';
import FutureImage from 'next/future/image';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import { IImageProps } from 'UI/Image/interface';
import { generateImageImgixUrl } from 'UI/Image/util';
import Tooltip from 'UI/Tooltip';
import { isUaeBannedUrl } from 'utils/urlUtils';
import { appAtom } from 'store/atoms/app';
import { INFO_ICON } from 'assets/SvgIcons';

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
  fetchPriority = 'auto',
}) => {
  const { uid, isMobile } = useRecoilValue(appAtom);
  let calculatedWidth = width,
    calculatedHeight = height,
    mobileImageSrc,
    defaultImageSrc,
    fillImageProp = fill;

  let updatedUrl = url;
  let updatedMobileUrl = mobileUrl;

  if (isUaeBannedUrl(uid)) {
    updatedUrl = updatedUrl?.replace(
      'cdn-imgix.headout.com',
      'headout-images.imgix.net'
    );
    updatedUrl = updatedUrl?.replace(
      'cdn-imgix-open.headout.com',
      'headout-open.imgix.net'
    );

    updatedMobileUrl = updatedMobileUrl?.replace(
      'cdn-imgix.headout.com',
      'headout-images.imgix.net'
    );
    updatedMobileUrl = updatedMobileUrl?.replace(
      'cdn-imgix-open.headout.com',
      'headout-open.imgix.net'
    );
  }

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
    updatedMobileUrl,
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
    updatedUrl,
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
        src={isMobile && mobileImageSrc ? mobileImageSrc : defaultImageSrc}
        width={fillImageProp ? undefined : Number(calculatedWidth)}
        height={fillImageProp ? undefined : Number(calculatedHeight)}
        alt={alt}
        placeholder={'empty'}
        priority={priority}
        unoptimized // We use IMGIX, which does all the optimisation required. Letting Next process images will add to TTFB.
        fill={fillImageProp}
        // @ts-ignore
        fetchpriority={fetchPriority}
      />
      <Conditional if={!!attribution}>
        <Tooltip content={attribution} trigger={INFO_ICON} />
      </Conditional>
    </Wrapper>
  );
};

export default Image;
