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
      trackEvent({
        eventName: ANALYTICS_EVENTS.VIDEO_AUTOPLAY_FAILED,
        [ANALYTICS_PROPERTIES.POSITION]: videoPosition,
      });
    }
  };

  const playVideo = () => {
    if (!videoRef) return;
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    videoRef.current.play();
    setIsVideoPaused(false);
    setIsAutoplayDisabled(false);
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_VIDEO_PLAYED,
      [ANALYTICS_PROPERTIES.POSITION]: videoPosition,
    });
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
  const showPlayButton = isAutoplayDisabled && isVideoPaused && url;
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
        playsInline
      >
        <source data-src={url} type={'video/mp4'} />
      </StyledVideoContainer>
    </VideoContainer>
  );
};

export default Video;
