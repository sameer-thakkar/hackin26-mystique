import React from 'react';

type ImageProps = {
  url: string;
  width?: number | string;
  height?: number | string;
  format?: string;
  imageId?: string;
  dontLazyLoad?: boolean;
  alt?: string;
};

const Image: React.FC<ImageProps> = ({
  url,
  width,
  height,
  format,
  imageId = '',
  dontLazyLoad = false,
  alt = '',
}) => {
  const getRenderedImage = () => {
    const makeUrl = (density = 1.5, fm = 'pjpg') => {
      const w = width ? `&w=${Number(width) * density}` : '';
      const h = height ? `&h=${Number(height) * density}` : '';
      if (!url) {
        return null;
      }
      return `${url.replace(
        /\s/g,
        '%20'
      )}?auto=compress&fm=${fm}${w}${h}&crop=faces&fit=min`;
    };
    if (!dontLazyLoad)
      return (
        <picture>
          <source type="image/webp" data-srcset={makeUrl(1, 'webp')} />
          {/* a non-static className (imageId) is required for lazyloading specific classNames to be reset to original on re-render,
        fixes cards continue showing previous render images */}
          <img
            className={`lazyload ${imageId}`}
            data-src={makeUrl(1, format)}
            alt={alt}
          />
        </picture>
      );
    else return <img src={makeUrl(1, format)} alt={alt} />;
  };

  return <React.Fragment>{getRenderedImage()}</React.Fragment>;
};

export default Image;
