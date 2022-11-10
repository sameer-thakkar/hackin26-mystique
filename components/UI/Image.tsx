import React from 'react';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import { INFO_ICON } from 'assets/SvgIcons';

import { attachQueryParam } from '../../utils/helper';
import Tooltip from './Tooltip';

const Picture = styled.picture`
  line-height: 0;
  img {
    object-fit: ${({ objectFit }) => (objectFit ? objectFit : 'fill')};
    width: 100%;
    height: 100%;
  }
`;

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
      z-index: 1;
    }
  }
`;

type ImageProps = {
  className?: string;
  url: string;
  width?: number | string;
  height?: number | string;
  format?: string;
  quality?: string | number;
  aspectRatio?: string;
  imageId?: string;
  dontLazyLoad?: boolean;
  isLogo?: boolean;
  alt?: string;
  isCardSlices?: boolean;
  isFooterLogo?: boolean;
  isHeaderLogo?: boolean;
  mobileUrl?: string;
  layout?: string;
  attribution?: string;
  autoCrop?: boolean;
  objectFit?: string;
  addDarkOverlay?: boolean;
  onClick?: () => void;
};

const Image: React.FC<ImageProps> = ({
  url,
  width,
  height,
  quality = 75,
  aspectRatio,
  format = 'webp',
  imageId = '',
  dontLazyLoad = false,
  alt = '',
  className = '',
  mobileUrl,
  attribution = '',
  autoCrop = true,
  objectFit,
  addDarkOverlay,
  onClick,
}) => {
  const makeImageUrl = (fm: string, url): string => {
    if (!url) {
      return null;
    }
    if (url?.includes('nocompress')) {
      return url?.split('?')?.[0];
    }
    if (format === 'gif') return url;
    const imigxOptionsQueryParams = new URLSearchParams();
    imigxOptionsQueryParams.set('auto', 'compress,format');
    if (width) imigxOptionsQueryParams.set('w', `${Number(width) * 1.5}`);
    if (height) imigxOptionsQueryParams.set('h', `${Number(height) * 1.5}`);
    if (quality) imigxOptionsQueryParams.set('q', `${Number(quality)}`);
    imigxOptionsQueryParams.set('fit', 'fit');
    if (aspectRatio) {
      imigxOptionsQueryParams.set('ar', `${aspectRatio}`);
      imigxOptionsQueryParams.set('fit', 'crop');
    }
    if (autoCrop) {
      imigxOptionsQueryParams.set('crop', 'faces');
      imigxOptionsQueryParams.delete('fit');
    }
    imigxOptionsQueryParams.set('fm', fm);
    if (addDarkOverlay) {
      imigxOptionsQueryParams.set('exp', '-10');
    }
    const extractedRect = /rect=[\d,.]*/.exec(url);
    return attachQueryParam(
      url,
      `${imigxOptionsQueryParams.toString()}${
        extractedRect ? `&${extractedRect}` : ''
      }`,
      true
    );
  };
  let calculatedWidth = width;
  let calculatedHeight = height;
  let ImageComponent = null;

  if (aspectRatio) {
    const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
    if (width && !height)
      calculatedHeight = Number(width) * (heightRatio / widthRatio);
    if (height && !width)
      calculatedWidth = Number(height) * (widthRatio / heightRatio);
  }
  if (dontLazyLoad) {
    ImageComponent = (
      <Picture objectFit={objectFit} key={imageId}>
        <source
          type="image/webp"
          data-srcset={`${
            mobileUrl ? makeImageUrl('webp', mobileUrl) + ' 768w,' : ''
          }${makeImageUrl('webp', url)}`}
        />
        <source
          type="image/jpeg"
          data-srcset={`${
            mobileUrl ? makeImageUrl('pjpg', mobileUrl) + ' 768w,' : ''
          }${makeImageUrl('pjpg', url)}`}
        />
        <img
          className={`image- ${imageId}`}
          data-srcset={`${
            mobileUrl ? makeImageUrl(format, mobileUrl) + ' 768w,' : ''
          }${makeImageUrl(format, url)}`}
          src={makeImageUrl(format, url)}
          alt={alt}
          key={imageId}
          height={calculatedHeight + 'px'}
          width={calculatedWidth + 'px'}
        />
      </Picture>
    );
  } else {
    ImageComponent = (
      <Picture objectFit={objectFit}>
        <source
          type="image/webp"
          data-srcset={`${
            mobileUrl ? makeImageUrl('webp', mobileUrl) + ' 768w,' : ''
          }${makeImageUrl('webp', url)}`}
        />
        <source
          type="image/jpeg"
          data-srcset={`${
            mobileUrl ? makeImageUrl('pjpg', mobileUrl) + ' 768w,' : ''
          }${makeImageUrl('pjpg', url)}`}
        />
        <img
          className={`lazyload ${imageId}`}
          data-srcset={`${
            mobileUrl ? makeImageUrl(format, mobileUrl) + ' 768w,' : ''
          }${makeImageUrl(format, url)}`}
          data-src={makeImageUrl(format, url)}
          alt={alt}
          height={calculatedHeight + 'px'}
          width={calculatedWidth + 'px'}
        />
      </Picture>
    );
  }

  return (
    <Wrapper className={`image-wrap ${className}`} onClick={onClick}>
      {ImageComponent}
      <Conditional if={!!attribution}>
        <Tooltip content={attribution} trigger={INFO_ICON} />
      </Conditional>
    </Wrapper>
  );
};

export default Image;
