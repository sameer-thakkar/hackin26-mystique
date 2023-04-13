import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { useSwiperSlide } from 'swiper/react';
import { appAtom } from 'store/atoms/app';
import { trackEvent } from 'utils/analytics';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import {
  PlayButton,
  StyledVideoContainer,
  VideoContainer,
} from 'components/UI/Video/styles';
import { PlaySvg } from 'assets/SvgIcons';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import useOnScreen from 'hooks/useOnScreen';
import { gtmAtom } from 'store/atoms/gtm';
import { VARIANTS } from 'const/experiments';
import { highResVideoExperimentAtom } from 'store/atoms/highResVideoExperiment';
import { hsidSetFailAtom } from 'store/atoms/hsid';
import { HIGH_RES_VIDEOS } from 'const/highResVideos';

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
  isMobile?: boolean;
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
  isMobile,
}) => {
  const videoAutoplayInterval = useRef(null);
  const videoAutoplayTime = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isOnScreen = useOnScreen({
    ref: videoRef,
    options: { threshold: 0.5 },
  });
  const [videoUrl, setVideoUrl] = useState('');
  const { isDuplicate: isDuplicateSlide } = useSwiperSlide() ?? {};

  const { isPageLoaded } = useRecoilValue(appAtom);
  const [hasVideoLoaded, setHasVideoLoaded] = useState(false);
  const [isAutoplayDisabled, setIsAutoplayDisabled] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const { eventsReady } = useRecoilValue(gtmAtom);
  const { uid } = useRecoilValue(appAtom);
  const hsidFailed = useRecoilValue(hsidSetFailAtom);
  const { variant } = useRecoilValue(highResVideoExperimentAtom);
  const [showHighResVideo, setShowHighResVideo] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timer | null>();
  const [lastDurationTracked, setLastDurationTracked] = useState(0);

  useEffect(() => {
    if (!eventsReady || videoUrl || !url) return;
    if (hsidFailed || !Object.keys(HIGH_RES_VIDEOS).includes(uid)) {
      setVideoUrl(url);
    }
    if (!variant) return;
    const showHighResVideo = variant === VARIANTS.IMGIX_TREATMENT;
    setShowHighResVideo(showHighResVideo);
    const finalVideo = showHighResVideo
      ? // @ts-ignore
        HIGH_RES_VIDEOS[uid]
      : url;
    setVideoUrl(finalVideo);
  }, [eventsReady, videoUrl, variant, uid, hsidFailed, url]);

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
    if (!videoRef.current) return;
    if (!timer && isOnScreen && !document.hidden && !isVideoPaused) {
      setTimer(() => {
        let durationTracked = lastDurationTracked;
        return setInterval(() => {
          if (isOnScreen && !document.hidden && !isVideoPaused) {
            durationTracked += 5;
            trackEvent({
              eventName: ANALYTICS_EVENTS.MB_VIDEO_VIEWED,
              [ANALYTICS_PROPERTIES.TIME_WATCHED]: durationTracked,
            });
          }
          setLastDurationTracked(durationTracked);
        }, 5000);
      });
    }
    return () => {
      if (timer && (!isOnScreen || document.hidden || isVideoPaused)) {
        clearInterval(timer);
        setTimer(null);
      }
    };
  }, [timer, isOnScreen, document, isVideoPaused, lastDurationTracked]);

  const loadVideo = useCallback(async () => {
    const lazyVideo = videoRef.current!;
    const videoSource = lazyVideo.querySelector('source');
    const source = videoSource!.dataset.src!;
    let shouldLoadVideo = true;
    if (!showHighResVideo) {
      videoSource!.src = source;
    } else {
      const Hls = (await import('hls.js')).default;
      if (lazyVideo.canPlayType('application/vnd.apple.mpegurl')) {
        // This will run in safari, where HLS is supported natively
        lazyVideo.src = source;
      } else if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });
        hls.loadSource(source);
        hls.attachMedia(lazyVideo);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (isMobile) {
            hls.removeLevel(4);
            hls.removeLevel(3);
          }
        });
        hls.on(Hls.Events.MANIFEST_LOADED, () => {
          setHasVideoLoaded(true);
        });
        shouldLoadVideo = false;
      } else {
        videoSource!.src = source;
      }
    }
    if (shouldLoadVideo) {
      lazyVideo.load();
      setHasVideoLoaded(true);
    }
  }, [videoRef, isMobile, showHighResVideo]);

  useEffect(() => {
    /* Later we can club with this intersection observer as well */
    if (isPageLoaded && !hasVideoLoaded && videoUrl) {
      /* to calculate the time between page loaded and video autoplay */
      if (!isDuplicateSlide) {
        // @ts-expect-error TS(2322): Type 'number' is not assignable to type 'null'.
        videoAutoplayInterval.current = setInterval(() => {
          videoAutoplayTime.current += 50;
        }, 50);
      }
      loadVideo();
    }
  }, [videoUrl, hasVideoLoaded, isDuplicateSlide, isPageLoaded, loadVideo]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!hasVideoLoaded || !videoElement) return;
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
          alt={imageAltText}
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
      <Conditional if={videoUrl}>
        <StyledVideoContainer
          ref={videoRef}
          autoPlay={shouldAutoPlay}
          loop={isLooped}
          muted={isMuted}
          playsInline
        >
          <source data-src={videoUrl} type={'video/mp4'} />
        </StyledVideoContainer>
      </Conditional>
    </VideoContainer>
  );
};

export default Video;
