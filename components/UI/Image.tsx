import React from 'react';
import styled from 'styled-components';
import { attachQueryParam } from '../../utils/helper';

const Picture = styled.picture`
  line-height: 0;
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
  alt?: string;
  mobileUrl?: string;
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
  mobileUrl = '',
}) => {
  const makeImageUrl = (fm: string, url): string => {
    if (!url) {
      return null;
    }
    const w = width ? `&w=${Number(width) * 1.5}` : '';
    const h = height ? `&h=${Number(height) * 1.5}` : '';
    const q = quality ? `&q=${Number(quality)}` : '';
    const ar = aspectRatio ? `&ar=${aspectRatio}&fit=crop` : '&fit=min';
    const extractedRect = /rect=[\d,.]*/.exec(url);
    if (format === 'gif') return url;
    return attachQueryParam(
      url,
      `auto=compress,format&fm=${fm}${w}${h}${q}${ar}&crop=faces&${
        extractedRect || ''
      }`,
      true
    );
  };

  if (dontLazyLoad) {
    return (
      <img className={className} src={makeImageUrl(format, url)} alt={alt} />
    );
  } else {
    return (
      <Picture className={className}>
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
        />
      </Picture>
    );
  }
};

export default Image;
