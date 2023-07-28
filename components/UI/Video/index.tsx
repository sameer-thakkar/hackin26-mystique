import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useSwiperSlide } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import {
  PlayButton,
  StyledVideoContainer,
  VideoContainer,
} from 'components/UI/Video/styles';
import Image from 'UI/Image';
import { trackEvent } from 'utils/analytics';
import { appAtom } from 'store/atoms/app';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { PlaySvg } from 'assets/SvgIcons';

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
}

const Video: React.FC<VideoTypeProps> = ({
  url,
  fallbackImage,
  isLooped = true,
  isMuted = true,
  shouldAutoPlay,
  shouldVideoPlay /* relevant only when autoplay is false */,
  imageId = '',
  imageAspectRatio,
  imageWidth,
  imageHeight,
  imageQuality,
  dontLazyLoadImage = false,
  videoPosition,
  showPlayIcon = true,
  pauseOnclick = false,
  eventTracking = true,
}) => {
  const videoAutoplayInterval = useRef(null);
  const videoAutoplayTime = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isDuplicate: isDuplicateSlide } = useSwiperSlide() ?? {};

  const { isPageLoaded } = useRecoilValue(appAtom);
  const [hasVideoLoaded, setHasVideoLoaded] = useState(false);
  const [isAutoplayDisabled, setIsAutoplayDisabled] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(true);

  const handleVideoPlay = async (videoElement: HTMLVideoElement) => {
    try {
      await videoElement.play();
      setIsVideoPaused(false);
      setIsAutoplayDisabled(false);

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
      setIsAutoplayDisabled(true);
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
    setIsAutoplayDisabled(false);
    eventTracking &&
      trackEvent({
        eventName: ANALYTICS_EVENTS.MB_VIDEO_PLAYED,
        [ANALYTICS_PROPERTIES.POSITION]: videoPosition,
      });
  };

  const pauseVideo = () => {
    if (!videoRef) return;
    videoRef.current?.pause();
    setIsVideoPaused(true);
  };

  useEffect(() => {
    /* Later we can club with this intersection observer as well */
    if (isPageLoaded && !hasVideoLoaded) {
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
  }, [hasVideoLoaded, isDuplicateSlide, isPageLoaded]);

  useEffect(() => {
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
  }, [shouldVideoPlay, hasVideoLoaded]);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isMuted) {
      videoRef.current.setAttribute('muted', '');
    } else {
      videoRef.current.removeAttribute('muted');
    }
  }, [isMuted]);

  const { url: fallbackImageUrl, altText: imageAltText } = fallbackImage;

  const showPlayButton =
    showPlayIcon && isAutoplayDisabled && isVideoPaused && url;

  const handleOnClick = () => {
    if (!pauseOnclick || !videoRef || !videoRef.current) return;
    if (isVideoPaused) {
      playVideo();
    } else {
      pauseVideo();
    }
  };

  return (
    <VideoContainer className={'video-container'} $fadeInVideo={!isVideoPaused}>
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
        <Conditional if={showPlayButton}>
          <PlayButton onClick={playVideo}>
            <PlaySvg />
          </PlayButton>
        </Conditional>
      </Conditional>
      <StyledVideoContainer
        ref={videoRef}
        autoPlay={shouldAutoPlay}
        loop={isLooped}
        muted={isMuted}
        playsInline={true}
        onClick={handleOnClick}
      >
        <source data-src={url} type={'video/mp4'} />
      </StyledVideoContainer>
    </VideoContainer>
  );
};

export default Video;
