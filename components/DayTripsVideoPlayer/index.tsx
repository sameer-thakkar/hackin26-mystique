/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import { Text } from '@headout/eevee';
import Conditional from 'components/common/Conditional';
import { MBContext } from 'contexts/MBContext';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import ChatBubble from './assets/ChatBubble';
import PlayVideoIcon from './assets/PlayVideoIcon';
import DayTripsVideoPlayerModal from './components/Modal';
import { videoPlayerStyles } from './styles';
import {
  DayTripsVideoPlayerPlayType,
  DayTripsVideoPlayerViewType,
  TDayTripsVideoPlayerProps,
} from './types';

const VideoPlayer = dynamic(
  import(/* webpackChunkName: "VideoPlayer" */ 'components/common/VideoPlayer')
);
const Image = dynamic(() => import(/* webpackChunkName: "Image" */ 'UI/Image'));

export type TDayTripsVideoPlayerRef = {
  handleVideoClick: (playType: DayTripsVideoPlayerPlayType) => void;
};

const DayTripsVideoPlayer = forwardRef<
  TDayTripsVideoPlayerRef,
  TDayTripsVideoPlayerProps
>(
  (
    {
      videoUrl,
      previewVideoUrl,
      onPlayerReady,
      thumbnailUrl,
      playPauseOnHover = false,
      autoplay = false,
      height = 300,
      playPauseThreshold = 1,
      showChatBubble = false,
      chatBubbleText = '',
      showPlayButton = false,
      isMobile = false,
      muted = false,
      delay = 2000,
      section,
      collectionId,
    },
    ref
  ) => {
    const [loadVideo, setLoadVideo] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [modalIsOpen, setModalOpen] = useState(false);
    const mainPlyrRef = useRef<Plyr | null>(null);
    const modalPlyrRef = useRef<Plyr | null>(null);
    const videoWrapperRef = useRef<HTMLDivElement>(null);
    const playTypeRef = useRef<DayTripsVideoPlayerPlayType>();
    const isVideoWrapperVisible = useOnScreen({
      ref: videoWrapperRef,
      unobserve: true,
    });
    const { uid } = useContext(MBContext);

    const handleVideoClick = (playType: DayTripsVideoPlayerPlayType) => {
      document.body.style.overflow = 'hidden';
      setModalOpen(true);
      playTypeRef.current = playType;
      mainPlyrRef.current?.pause();
      trackEvent({
        eventName: ANALYTICS_EVENTS.DT_VIDEO_PLAYER_OPENED,
        [ANALYTICS_PROPERTIES.SECTION]: section,
        [ANALYTICS_PROPERTIES.MB_NAME]: uid,
        [ANALYTICS_PROPERTIES.COLLECTION_ID]: collectionId,
      });
    };

    useImperativeHandle(ref, () => ({
      handleVideoClick,
    }));

    const handleMainPlayerReady = (plyr: Plyr) => {
      mainPlyrRef.current = plyr;
      plyr.muted = muted;
      onPlayerReady?.(plyr);
    };

    const handleModalPlayerReady = (plyr: Plyr) => {
      modalPlyrRef.current = plyr;
    };

    useEffect(() => {
      setTimeout(() => {
        setLoadVideo(true);
      }, 200);
    }, []);

    const toggleVideo = (show: boolean) => {
      if (show) {
        setShowVideo(true);
        mainPlyrRef.current?.play();

        trackEvent({
          eventName: ANALYTICS_EVENTS.DT_VIDEO_PLAYED,
          [ANALYTICS_PROPERTIES.SECTION]: section,
          [ANALYTICS_PROPERTIES.PLAY_TYPE]: playTypeRef.current,
          [ANALYTICS_PROPERTIES.VIEW_TYPE]: DayTripsVideoPlayerViewType.INLINE,
          [ANALYTICS_PROPERTIES.MB_NAME]: uid,
          [ANALYTICS_PROPERTIES.COLLECTION_ID]: collectionId,
        });
      } else {
        setShowVideo(false);
        mainPlyrRef.current?.pause();
      }
    };

    const handleMouseEnter = () => {
      if (!playPauseOnHover) return;
      playTypeRef.current = DayTripsVideoPlayerPlayType.HOVER;
      toggleVideo(true);
    };

    const handleMouseLeave = () => {
      if (!playPauseOnHover) return;
      playTypeRef.current = DayTripsVideoPlayerPlayType.HOVER;
      toggleVideo(false);
    };

    useEffect(() => {
      if (playPauseOnHover || !isVideoWrapperVisible) return;

      setTimeout(() => {
        playTypeRef.current = DayTripsVideoPlayerPlayType.AUTO;
        toggleVideo(true);
      }, delay);
    }, [delay, playPauseOnHover, isVideoWrapperVisible]);

    const closeModal = () => {
      document.body.style.overflow = 'auto';
      setModalOpen(false);
      // Ensure the modal player is paused when closing
      if (modalPlyrRef.current) {
        modalPlyrRef.current.pause();
      }
      if (showVideo) {
        mainPlyrRef.current?.play();
      }
      trackEvent({
        eventName: ANALYTICS_EVENTS.DT_VIDEO_PLAYER_CLOSED,
        [ANALYTICS_PROPERTIES.SECTION]: section,
        [ANALYTICS_PROPERTIES.MB_NAME]: uid,
        [ANALYTICS_PROPERTIES.COLLECTION_ID]: collectionId,
      });
    };

    const styles = videoPlayerStyles({ showVideo, playPauseOnHover, isMobile });
    const dynamicStyles = {
      '--height': height ? `${height}px` : '300px',
    } as React.CSSProperties;

    return (
      <>
        <DayTripsVideoPlayerModal
          isOpen={modalIsOpen}
          onClose={closeModal}
          videoUrl={videoUrl || previewVideoUrl}
          onPlayerReady={handleModalPlayerReady}
          playPauseThreshold={playPauseThreshold}
          isMobile={isMobile}
          playType={playTypeRef.current}
          hostname={uid}
          section={section}
          collectionId={collectionId}
        />
        <Conditional if={videoUrl}>
          <div
            className={styles.container}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={dynamicStyles}
            ref={videoWrapperRef}
          >
            <Conditional if={thumbnailUrl}>
              <div className={styles.thumbnailWrapper}>
                <Image
                  url={thumbnailUrl || ''}
                  height={height}
                  imageId={'banner-image'}
                  alt={thumbnailUrl || ''}
                  priority
                  fill
                  loadHigherQualityImage={true}
                  aspectRatio="16 / 9"
                />
                <Conditional if={showChatBubble}>
                  <div
                    className={styles.chatBubbleWrapper}
                    onClick={() =>
                      handleVideoClick(DayTripsVideoPlayerPlayType.PLAYER_CLICK)
                    }
                  >
                    <div className={styles.chatBubble}>
                      <ChatBubble />
                      <Text as="span" className={styles.chatBubbleContent}>
                        {chatBubbleText}
                      </Text>
                    </div>
                  </div>
                </Conditional>
              </div>
            </Conditional>
            <Conditional if={loadVideo}>
              <div className={styles.videoWrapper}>
                <div className={styles.playerContainer}>
                  <VideoPlayer
                    onPlayerReady={handleMainPlayerReady}
                    videoUrl={previewVideoUrl || videoUrl}
                    className="chat-bubble-video"
                    showMuteControls
                    playPauseThreshold={playPauseThreshold}
                    isHls={true}
                    playsinline={true}
                    playerProps={{
                      controls: [],
                      clickToPlay: false,
                      autoplay,
                      muted,
                      fullscreen: {
                        enabled: false,
                        fallback: false,
                        iosNative: true,
                      },
                      loop: {
                        active: true,
                      },
                    }}
                  />
                </div>
                <div
                  onClick={() =>
                    handleVideoClick(DayTripsVideoPlayerPlayType.PLAYER_CLICK)
                  }
                  className={styles.clickOverlay}
                />
              </div>
            </Conditional>
            <Conditional if={showPlayButton}>
              <div
                onClick={() =>
                  handleVideoClick(DayTripsVideoPlayerPlayType.PLAYER_CLICK)
                }
                className={styles.playButtonWrapper}
              >
                <div className={styles.playButton}>
                  <PlayVideoIcon />
                </div>
              </div>
            </Conditional>
          </div>
        </Conditional>
      </>
    );
  }
);

DayTripsVideoPlayer.displayName = 'DayTripsVideoPlayer';

export default DayTripsVideoPlayer;
