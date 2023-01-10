import React, { useRef, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useSwiperSlide } from 'swiper/react';
import { appAtom } from 'store/atoms/app';
import { trackEvent } from 'utils/analytics';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import {
  PlayButton,
  StyledVideo,
  VideoContainer,
} from 'components/UI/Video/styles';
import { PlaySvg } from 'assets/SvgIcons';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';

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
}) => {
  const videoAutoplayInterval = useRef(null);
  const videoAutoplayTime = useRef(0);
  const videoRef = useRef(null);
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
        trackEvent({
          eventName: ANALYTICS_EVENTS.MB_BANNER_VIDEO_AUTOPLAY_STARTED,
          [ANALYTICS_PROPERTIES.AUTOPLAY_LOAD_TIME]:
            videoAutoplayTime.current / 1000,
        });
        clearInterval(videoAutoplayInterval.current);
        videoAutoplayInterval.current = null;
      }
    } catch (error) {
      // video autoplay prevented by the browser
      setIsAutoplayDisabled(true);
      setIsVideoPaused(true);
      trackEvent({
        eventName: ANALYTICS_EVENTS.MB_BANNER_VIDEO_AUTOPLAY_FAILED,
      });
    }
  };

  const playVideo = () => {
    if (!videoRef) return;
    videoRef.current.play();
    setIsVideoPaused(false);
    setIsAutoplayDisabled(false);
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_Banner_Video_Played,
    });
  };

  const handleVideoClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.DEAD_CLICK,
      [ANALYTICS_PROPERTIES.TYPE]: 'MB Video Banner Clicked',
    });
  };

  useEffect(() => {
    /* Later we can club with this intersection observer as well */
    if (isPageLoaded && !hasVideoLoaded) {
      /* to calculate the time between page loaded and video autoplay */
      if (!isDuplicateSlide) {
        videoAutoplayInterval.current = setInterval(() => {
          videoAutoplayTime.current += 50;
        }, 50);
      }

      const lazyVideo: HTMLVideoElement = videoRef.current;
      const videoSource = lazyVideo.querySelector('source');
      videoSource.src = videoSource.dataset.src;
      lazyVideo.load();
      setHasVideoLoaded(true);
    }
  }, [hasVideoLoaded, isDuplicateSlide, isPageLoaded]);

  useEffect(() => {
    const videoElement: HTMLVideoElement = videoRef.current;
    if (!hasVideoLoaded) return;
    videoElement.currentTime = 0;

    if (shouldVideoPlay) {
      handleVideoPlay(videoElement);
    } else {
      videoElement.pause();
      setIsVideoPaused(true);
    }
  }, [shouldVideoPlay, hasVideoLoaded]);

  const { url: fallbackImageUrl, altText: imageAltText } = fallbackImage;
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
          alt={imageAltText}
          priority={dontLazyLoadImage}
          fetchPriority={dontLazyLoadImage ? 'high' : 'auto'}
          fill
        />
        <Conditional if={isAutoplayDisabled && isVideoPaused}>
          <PlayButton onClick={playVideo}>
            <PlaySvg />
          </PlayButton>
        </Conditional>
      </Conditional>
      <StyledVideo
        ref={videoRef}
        autoPlay={shouldAutoPlay}
        loop={isLooped}
        muted={isMuted}
        playsInline
        onClick={handleVideoClick}
      >
        <source data-src={url} type={'video/mp4'} />
      </StyledVideo>
    </VideoContainer>
  );
};

export default Video;
