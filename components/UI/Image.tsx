import React from 'react';
import styled from 'styled-components';
import { useAmp } from 'next/amp';
import Conditional from 'components/common/Conditional';
import { INFO_ICON } from 'assets/SvgIcons';

import { attachQueryParam } from '../../utils/helper';
import Tooltip from './Tooltip';

const Picture = styled.picture`
  line-height: 0;
`;

const Wrapper = styled.div`
  position: relative;
  display: grid;
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
  mobileUrl?: string;
  layout?: string;
  attribution?: string;
  autoCrop?: boolean;
};

const Image: React.FC<ImageProps> = ({
  url,
  width,
  height,
  quality = 75,
  aspectRatio,
  format = 'pjpg',
  imageId = '',
  dontLazyLoad = false,
  alt = '',
  className = '',
  isLogo,
  isCardSlices,
  mobileUrl,
  isFooterLogo,
  layout,
  attribution = '',
  autoCrop = true,
}) => {
  const isAmp = useAmp();
  const makeImageUrl = (fm: string, url): string => {
    if (!url) {
      return null;
    }
    const imigxOptionsQueryParams = new URLSearchParams();
    if (width) imigxOptionsQueryParams.set('w', `${Number(width) * 1.5}`);
    if (height) imigxOptionsQueryParams.set('h', `${Number(height) * 1.5}`);
    if (quality) imigxOptionsQueryParams.set('q', `${Number(quality)}`);
    imigxOptionsQueryParams.set('fit', 'fit');
    if (aspectRatio) {
      imigxOptionsQueryParams.set('ar', `${Number(aspectRatio)}`);
      imigxOptionsQueryParams.set('fit', 'crop');
    }
    if (autoCrop) {
      imigxOptionsQueryParams.set('crop', 'faces');
      imigxOptionsQueryParams.delete('fit');
    }

    const extractedRect = /rect=[\d,.]*/.exec(url);
    if (format === 'gif') return url;
    return attachQueryParam(
      url,
      `auto=compress,format&${imigxOptionsQueryParams.toString()}${
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
  if (isAmp) {
    if (isCardSlices) {
      calculatedWidth = 377;
    }
    if (isFooterLogo) {
      calculatedHeight = '40';
      calculatedWidth = '130';
    }
    const imageSrc = makeImageUrl(format, url);
    ImageComponent = imageSrc && (
      <amp-img
        width={calculatedWidth || '85'}
        height={calculatedHeight || '26'}
        layout={
          layout ? 'fill' : isLogo || isFooterLogo ? 'fixed' : 'responsive'
        }
        className={className}
        src={imageSrc}
        alt={alt}
      />
    );
  } else if (dontLazyLoad) {
    ImageComponent = (
      <Picture>
        <source
          type="image/webp"
          data-srcset={`${
            mobileUrl ? makeImageUrl('webp', mobileUrl) + ' 768w,' : ''
          }${makeImageUrl('webp', url)}`}
        />
        <img
          className={`image- ${imageId}`}
          data-srcset={`${
            mobileUrl ? makeImageUrl(format, mobileUrl) + ' 768w,' : ''
          }${makeImageUrl(format, url)}`}
          src={makeImageUrl(format, url)}
          alt={alt}
          height={calculatedHeight + 'px'}
          width={calculatedWidth + 'px'}
        />
      </Picture>
    );
  } else {
    ImageComponent = (
      <Picture>
        <source
          type="image/webp"
          data-srcset={`${
            mobileUrl ? makeImageUrl('webp', mobileUrl) + ' 768w,' : ''
          }${makeImageUrl('webp', url)}`}
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
    <Wrapper className={`image-wrap ${className}`}>
      {ImageComponent}
      <Conditional if={!!attribution}>
        <Tooltip content={attribution} trigger={INFO_ICON} />
      </Conditional>
    </Wrapper>
  );
};

export default Image;
