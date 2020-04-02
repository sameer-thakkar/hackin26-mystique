import React from 'react';
import { attachQueryParam } from '../../utils/helper';

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
};

const Image: React.FC<ImageProps> = ({
  url,
  width,
  height,
  quality = 100,
  aspectRatio,
  format = 'pjgp',
  imageId = '',
  dontLazyLoad = false,
  alt = '',
  className = '',
}) => {
  const makeImageUrl = (fm: string): string => {
    if (!url) {
      return null;
    }
    const w = width ? `&w=${Number(width) * 1.5}` : '';
    const h = height ? `&h=${Number(height) * 1.5}` : '';
    const q = quality ? `&q=${Number(quality)}` : '';
    const ar = aspectRatio ? `&ar=${aspectRatio}&fit=crop` : '&fit=min';
    const extractedRect = /rect=[\d,.]*/.exec(url);
    return attachQueryParam(
      url,
      `auto=compress,format&fm=${fm}${w}${h}${q}${ar}&crop=faces&${
        extractedRect || ''
      }`,
      true
    );
  };

  if (dontLazyLoad) {
    return <img className={className} src={makeImageUrl(format)} alt={alt} />;
  } else {
    return (
      <picture className={className}>
        <source type="image/webp" data-srcset={makeImageUrl('webp')} />
        <img
          className={`lazyload ${imageId}`}
          data-src={makeImageUrl(format)}
          alt={alt}
        />
      </picture>
    );
  }
};

export default Image;
