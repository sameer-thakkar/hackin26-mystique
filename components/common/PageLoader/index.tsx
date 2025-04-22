import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react';
import Conditional from 'components/common/Conditional';
import { GIF_LOADER_WHITE_BG_URL } from 'const/index';
import { gifContainer, pageLoader } from './styles';
import type { TPageLoaderProps } from './types';

/**
 * keeping this for any more gif based loader changes.
 * @returns gif loader
 */
export const GIFLoader = ({
  gif,
  alt = '',
  isGIFLoaded,
  setIsGIFLoaded,
  ...imgProps
}: {
  gif: string;
  alt?: string;
  isGIFLoaded: boolean;
  setIsGIFLoaded?: Dispatch<SetStateAction<boolean>>;
} & React.ImgHTMLAttributes<HTMLImageElement>) => {
  const onLoadComplete = useCallback(() => {
    setIsGIFLoaded?.(true);
  }, [setIsGIFLoaded]);

  // Preload the image to ensure onLoad fires correctly
  useEffect(() => {
    if (!isGIFLoaded) {
      const img = new Image();
      img.onload = onLoadComplete;
      img.src = gif;
    }
  }, [gif, isGIFLoaded, onLoadComplete]);

  return (
    <div className={gifContainer} data-is-loaded={isGIFLoaded}>
      {/* NextJS image component does not support gif, hence using <img> element */}
      <img src={gif} alt={alt} {...imgProps} />
    </div>
  );
};

/**
 * Use this component if you wish to cover entire screen with a loader. (it will overlay on top of components)
 * for inline usages, use the Named Import `InlineLoader` from this file instead.
 *
 * @returns Markup for Full Page Overlay with a centered Loader Animation.
 */
const PageLoader = ({
  className = '',
  gifSrc,
  imgProps,
  showBouncingLoader = true,
}: TPageLoaderProps) => {
  const [isGIFLoaded, setIsGIFLoaded] = useState(false);

  const styles = pageLoader();

  return (
    <div
      data-qa-marker="page-loader"
      className={`${styles.container} page-loader ${className}`}
    >
      <div className={styles.wrapper}>
        <Conditional if={showBouncingLoader}>
          <GIFLoader
            gif={gifSrc ?? GIF_LOADER_WHITE_BG_URL}
            alt="Loading"
            isGIFLoaded={isGIFLoaded}
            setIsGIFLoaded={setIsGIFLoaded}
            {...imgProps}
          />
        </Conditional>

        <Conditional if={!isGIFLoaded || !showBouncingLoader}>
          <div className={styles.inlineLoader} />
        </Conditional>
      </div>
    </div>
  );
};

export default PageLoader;
