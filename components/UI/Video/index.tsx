import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useSwiperSlide } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import {
  StyledVideoContainer,
  VideoContainer,
  VideoIcon,
} from 'components/UI/Video/styles';
import Image from 'UI/Image';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { debounce, throttle } from 'utils/gen';
import { appAtom } from 'store/atoms/app';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { PauseSvg, PlaySvg } from 'assets/SvgIcons';

interface VideoTypeProps {
  url: string;
  fallbackImage: { url: string; altText?: string };
  isMuted?: boolean;
  shouldAutoPlay?: boolean;
  isLooped?: boolean;
  imageAspectRatio?: string;
  imageQuality?: number;
  imageId?: string;
  imageWidth?: string | number;
  imageHeight?: string | number;
  shouldVideoPlay?: boolean;
  dontLazyLoadImage?: boolean;
  videoPosition: string;
  showPlayIcon?: boolean;
  pauseOnclick?: boolean;
  eventTracking?: boolean;
  showPauseIcon?: boolean;
  isMobile?: boolean;
  onPause?: () => void;
}

const Video: React.FC<VideoTypeProps> = ({
  url,
  fallbackImage,
  isLooped = true,
  isMuted = true,
  // shouldAutoPlay,
  shouldVideoPlay /* relevant only when autoplay is false */,
  imageId = '',
  imageAspectRatio,
  imageWidth,
  imageHeight,
  imageQuality,
  isMobile,
  dontLazyLoadImage = false,
  videoPosition,
  children,
  showPlayIcon = true,
  showPauseIcon = true,
  pauseOnclick = false,
  eventTracking = true,
  onPause = () => {},
}) => {
  const videoAutoplayInterval = useRef(null);
  const videoAutoplayTime = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isDuplicate: isDuplicateSlide } = useSwiperSlide() ?? {};

  const { isPageLoaded } = useRecoilValue(appAtom);
  const [hasVideoLoaded, setHasVideoLoaded] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const [shouldIconAppear, setIconAppear] = useState(true);
  const isVideoIntersecting = useOnScreen({ ref: videoRef, unobserve: true });
  const debouncedSetIconAppear = useCallback(
    debounce(() => setIconAppear(false), 2000),
    []
  );

  const handleVideoPlay = async (videoElement: HTMLVideoElement) => {
    try {
      await videoElement.play();
      setIsVideoPaused(false);

      if (videoAutoplayInterval.current) {
        eventTracking &&
          trackEvent({
            eventName: ANALYTICS_EVENTS.VIDEO_AUTOPLAY_STARTED,
            [ANALYTICS_PROPERTIES.AUTOPLAY_LOAD_TIME]:
              videoAutoplayTime.current / 1000,
            [ANALYTICS_PROPERTIES.POSITION]: videoPosition,
          });
        clearInterval(videoAutoplayInterval.current);
        videoAutoplayInterval.current = null;
      }
    } catch (error) {
      // video autoplay prevented by the browser
      setIsVideoPaused(true);
      eventTracking &&
        trackEvent({
          eventName: ANALYTICS_EVENTS.VIDEO_AUTOPLAY_FAILED,
          [ANALYTICS_PROPERTIES.POSITION]: videoPosition,
        });
    }
  };

  const playVideo = () => {
    if (!videoRef) return;
    videoRef.current?.play();
    setIsVideoPaused(false);
    if (isMobile) debouncedSetIconAppear();

    eventTracking &&
      trackEvent({
        eventName: ANALYTICS_EVENTS.MB_VIDEO_PLAYED,
        [ANALYTICS_PROPERTIES.POSITION]: videoPosition,
        [ANALYTICS_PROPERTIES.TRIGGERED_BY]: 'User',
      });
  };

  const pauseVideo = () => {
    if (!videoRef) return;
    videoRef.current?.pause();
    setIsVideoPaused(true);
    if (isMobile) debouncedSetIconAppear();
  };

  useEffect(() => {
    if (isPageLoaded && !hasVideoLoaded && isVideoIntersecting) {
      /* to calculate the time between page loaded and video autoplay */
      if (!isDuplicateSlide) {
        // @ts-expect-error TS(2322): Type 'number' is not assignable to type 'null'.
        videoAutoplayInterval.current = setInterval(() => {
          videoAutoplayTime.current += 50;
        }, 50);
      }

      const lazyVideo: HTMLVideoElement = videoRef.current!;
      const videoSource = lazyVideo.querySelector('source')!;
      videoSource.src = videoSource.dataset.src!;
      lazyVideo.load();
      setHasVideoLoaded(true);
    }
  }, [hasVideoLoaded, isDuplicateSlide, isPageLoaded, isVideoIntersecting]);

  useEffect(() => {
    if (shouldVideoPlay) {
      const videoElement: HTMLVideoElement = videoRef.current!;

      const startVideoAutoPlay = () => {
        if (!hasVideoLoaded) return;
        videoElement.currentTime = 0;
        if (videoRef.current) videoRef.current.controls = false;
        if (shouldVideoPlay) {
          handleVideoPlay(videoElement);
        } else {
          pauseVideo();
        }
      };
      videoElement.addEventListener('loadeddata', startVideoAutoPlay);
      return () =>
        videoElement.removeEventListener('loadeddata', startVideoAutoPlay);
    }
  }, [shouldVideoPlay, hasVideoLoaded]);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isMuted) {
      videoRef.current.setAttribute('muted', '');
    } else {
      videoRef.current.removeAttribute('muted');
    }
  }, [isMuted]);

  useEffect(() => {
    videoRef.current?.addEventListener(
      'mousemove',
      throttle(() => setIconAppear(true), 2000)
    );

    videoRef.current?.addEventListener(
      'mouseleave',
      throttle(() => setIconAppear(false), 2000)
    );
    return () => {
      videoRef.current?.removeEventListener(
        'mousemove',
        throttle(() => setIconAppear(true), 2000)
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
      videoRef.current?.removeEventListener(
        'mouseleave',
        throttle(() => setIconAppear(false), 2000)
      );
    };
  }, []);

  const { url: fallbackImageUrl, altText: imageAltText } = fallbackImage;

  const showPlayButton = !!(showPlayIcon && isVideoPaused && url);
  const showPauseButton = !!(showPauseIcon && !isVideoPaused && url);

  const handleOnClick = () => {
    if (!pauseOnclick || !videoRef || !videoRef.current) return;
    setIconAppear(true);
    if (isVideoPaused) {
      playVideo();
    } else {
      onPause();
      pauseVideo();
    }
  };

  return (
    <VideoContainer className={'video-container'} $fadeInVideo={!isVideoPaused}>
      {children}
      <Conditional if={fallbackImage}>
        {/* Using a custom img component instead of video's poster attribute 
        to utilise the benefits of lazy-loading, fallback UI, etc. */}
        <Image
          url={fallbackImageUrl}
          aspectRatio={imageAspectRatio}
          width={imageWidth}
          height={imageHeight}
          quality={imageQuality}
          imageId={imageId}
          autoCrop={false}
          alt={imageAltText || ''}
          priority={dontLazyLoadImage}
          fetchPriority={dontLazyLoadImage ? 'high' : 'auto'}
          onClick={showPlayButton ? playVideo : () => {}}
          fill
        />
        <Conditional if={shouldIconAppear && showPlayButton}>
          <VideoIcon onClick={handleOnClick}>
            <Conditional if={isVideoPaused}>
              <PlaySvg />
            </Conditional>
          </VideoIcon>
        </Conditional>
        {/* Want to show pauseIcon only along with playIcon. */}
        <Conditional if={shouldIconAppear && showPlayIcon && showPauseButton}>
          <VideoIcon onClick={handleOnClick}>
            <Conditional if={!isVideoPaused}>
              <PauseSvg />
            </Conditional>
          </VideoIcon>
        </Conditional>
      </Conditional>
      <StyledVideoContainer
        ref={videoRef}
        // autoPlay={shouldAutoPlay}
        loop={isLooped}
        muted={isMuted}
        playsInline={true}
        onClick={handleOnClick}
        preload="none"
      >
        <source data-src={url} type={'video/mp4'} />
      </StyledVideoContainer>
    </VideoContainer>
  );
};

export default Video;
