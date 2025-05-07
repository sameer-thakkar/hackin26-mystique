import React from 'react';
import Modal from 'react-modal';
import dynamic from 'next/dynamic';
import { DayTripsVideoPlayerViewType } from 'components/DayTripsVideoPlayer/types';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { modalStyles } from './styles';
import { TDayTripsVideoPlayerModalProps } from './types';

const VideoPlayer = dynamic(
  import(/* webpackChunkName: "VideoPlayer" */ 'components/common/VideoPlayer')
);

const DayTripsVideoPlayerModal: React.FC<TDayTripsVideoPlayerModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  onPlayerReady,
  playPauseThreshold = 1,
  muted = false,
  isMobile = false,
  section,
  playType,
  hostname,
  collectionId,
}) => {
  const handlePlayerReady = (plyr: Plyr) => {
    onPlayerReady?.(plyr);
    trackEvent({
      eventName: ANALYTICS_EVENTS.DT_VIDEO_PLAYED,
      [ANALYTICS_PROPERTIES.SECTION]: section,
      [ANALYTICS_PROPERTIES.PLAY_TYPE]: playType,
      [ANALYTICS_PROPERTIES.VIEW_TYPE]: DayTripsVideoPlayerViewType.MODAL,
      [ANALYTICS_PROPERTIES.MB_NAME]: hostname,
      [ANALYTICS_PROPERTIES.COLLECTION_ID]: collectionId,
    });
  };
  return (
    <Modal
      style={modalStyles}
      onRequestClose={onClose}
      isOpen={isOpen}
      shouldCloseOnEsc
      shouldReturnFocusAfterClose
      preventScroll={true}
    >
      <VideoPlayer
        videoUrl={videoUrl}
        closePlayer={onClose}
        onPlayerReady={handlePlayerReady}
        className="video-in-modal"
        showMuteControls
        playPauseThreshold={playPauseThreshold}
        isHls={true}
        playsinline={true}
        playerProps={{
          ...(isMobile && {
            fullscreen: {
              enabled: false,
              fallback: false,
              iosNative: true,
            },
          }),
          loop: {
            active: false,
          },
          muted,
        }}
      />
    </Modal>
  );
};

export default DayTripsVideoPlayerModal;
