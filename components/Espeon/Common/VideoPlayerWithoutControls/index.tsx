/* eslint-disable jsx-a11y/media-has-caption */
import React, { type CSSProperties, useEffect, useRef, useState } from 'react';
import { css, cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import Play from 'components/Espeon/Assets/Play';
// import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'Constants/analytics';
// import { DEFAULT_IMAGE_DENSITY } from 'components/Espeon/constants';
import Image from 'UI/Image';
import useOnScreen from 'hooks/useOnScreen';
import PlayButton from './components/PlayButton';
import { videoPlayerWithoutControlsStyles } from './styles';
import type { TVideoTypeProps } from './types';

// import { PlayButton, StyledVideo, VideoContainer } from './style';

let autoPlayTracked = false;
// let appMountTime = 0;
export const VideoPlayerWithoutControls: React.FC<
  React.PropsWithChildren<TVideoTypeProps>
> = ({
  url,
  fallbackImage,
  isLooped = true,
  isMuted = true,
  shouldAutoPlay = true,
  currentlyPlaying = true /* relevant only when autoplay is false */,
  width,
  height,
  // isBanner,
  responsive,
  eventTracking,
  aria,
  useVideoPoster = false,
  preventVideoClickEventPropagation = true,
  // imageDensity = DEFAULT_IMAGE_DENSITY,
  priortizeImage = false,
  // trackEvent,
}) => {
  // @ts-expect-error TS(2352): Conversion of type 'null' to type 'HTMLVideoElemen... Remove this comment to see the full error message
  const videoRef = useRef(null as HTMLVideoElement);
  const [isAutoplayDisabled, setIsAutoplayDisabled] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const isOnScreen = useOnScreen({
    ref: videoRef,
    options: { threshold: 0.5 },
  });

  // useEffect(() => {
  // 	appMountTime = new Date().getTime();
  // }, []);

  useEffect(() => {
    if (videoLoaded) return;
    if (!videoRef.current) return;
    const videoElement = videoRef.current;
    const videoSource = videoElement.children[0] as HTMLSourceElement;
    // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
    videoSource.src = videoSource.dataset.src;
    videoElement.load();

    const trackAutoPlay = () => {
      if (autoPlayTracked && !isAutoplayDisabled) return;
      autoPlayTracked = true;

      // const videoStartTime = new Date().getTime();
      // const videoAutoPlayTime = videoStartTime - appMountTime;

      // eventTracking &&
      // 	trackEvent?.({
      // 		eventName: ANALYTICS_EVENTS.VIDEO.AUTOPLAY_STARTED,
      // 		[ANALYTICS_PROPERTIES.AUTOPLAY_LOAD_TIME]:
      // 			videoAutoPlayTime / 1000,
      // 	});
    };

    const startVideoAutoPlay = async (e: any) => {
      setVideoLoaded(true);

      try {
        if (currentlyPlaying) {
          await e.target.play();
          setIsPaused(false);
          setIsAutoplayDisabled(false);
          trackAutoPlay();
        }
      } catch (error) {
        setIsAutoplayDisabled(true);
        setIsPaused(true);
        // eventTracking &&
        // trackEvent?.({
        // 	eventName: ANALYTICS_EVENTS.VIDEO.AUTOPLAY_FAILED,
        // });
      }
    };

    videoElement.addEventListener('loadeddata', startVideoAutoPlay);
    return () =>
      videoElement.removeEventListener('loadeddata', startVideoAutoPlay);
  }, [currentlyPlaying, eventTracking, isAutoplayDisabled, videoLoaded]);

  useEffect(() => {
    if (!videoLoaded) return;

    if (currentlyPlaying) {
      videoRef.current
        .play()
        .then(() => {
          setIsPaused(false);
        })
        .catch(() => {
          setIsPaused(true);
        });

      return;
    }

    videoRef.current.pause();
    setIsPaused(true);
  }, [currentlyPlaying, videoLoaded]);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isOnScreen) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isOnScreen]);

  const handleVideoClick = (e: any) => {
    if (preventVideoClickEventPropagation) {
      e.stopPropagation();
    }
    videoRef.current.play();

    if (isPaused) {
      setIsPaused(false);
      // eventTracking &&
      // 	trackEvent?.({
      // 		eventName: ANALYTICS_EVENTS.VIDEO.PLAYED,
      // 		[ANALYTICS_PROPERTIES.POSITION]: isBanner
      // 			? ANALYTICS_PROPERTIES.BANNER
      // 			: ANALYTICS_PROPERTIES.PRODUCT_CARD,
      // 	});
    } else {
      // eventTracking &&
      // 	trackEvent?.({
      // 		eventName: ANALYTICS_EVENTS.VIDEO.DEAD_CLICK,
      // 	});
    }
  };

  const dynamicStyles = {
    '--height': height ? `${height}px` : '100%',
    '--width': !responsive && width ? `${width}px` : '100%',
  } as CSSProperties;

  const styles = videoPlayerWithoutControlsStyles.raw({
    fadeInVideo: videoLoaded,
  });

  return (
    <div
      className={cx('video-container', css(styles.container))}
      style={dynamicStyles}
    >
      <Conditional if={!!fallbackImage && !useVideoPoster}>
        <Image
          url={fallbackImage!.url}
          width={width}
          height={height}
          alt={fallbackImage!.altText || ''}
          onClick={handleVideoClick}
          // layout={responsive ? undefined : 'responsive'}
          priority={priortizeImage}
          loadHigherQualityImage
          // density={imageDensity}
        />
      </Conditional>
      <Conditional if={isAutoplayDisabled && isPaused}>
        <PlayButton onClick={handleVideoClick}>
          <Play />
        </PlayButton>
      </Conditional>
      <Conditional if={!!url}>
        <video
          ref={videoRef}
          className={cx('video', css(styles.video))}
          autoPlay={shouldAutoPlay}
          muted={isMuted}
          playsInline
          disablePictureInPicture
          onClick={handleVideoClick}
          loop={isLooped}
          width={width}
          height={height}
          poster={useVideoPoster ? fallbackImage?.url : undefined}
          aria-label={aria?.label}
          aria-labelledby={aria?.labelledBy}
        >
          <source data-src={url} type={'video/mp4'} />
        </video>
      </Conditional>
    </div>
  );
};
