import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import Conditional from 'components/common/Conditional';
import IFrame from 'components/shortcodes/IFrame';
import Image from 'UI/Image';
import Video from 'UI/Video';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { EXPERIMENT_NAMES } from 'const/experiments';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  VIDEO_POSITIONS,
} from 'const/index';
import { strings } from 'const/strings';
import VideoPlayIcon from 'assets/playIcon';
import { BANNER_DIMENSIONS } from './constants';
import {
  IFrameWrapper,
  MediaPreview,
  MediaPreviewWrapper,
  modalStyles,
  YoutubeBanner,
  YoutubeBannerLeft,
  YoutubeBannerRight,
  YoutubeBannerWrapper,
} from './styles';
import { CuratedVideoBannerProp } from './types';

const CuratedVideoBanner = ({
  tour,
  curatedBannerVideoSrc,
  isMobile,
}: CuratedVideoBannerProp) => {
  const mediaPreviewWrapperRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isIntersecting = useOnScreen({
    ref: mediaPreviewWrapperRef,
    unobserve: true,
    options: {
      threshold: 1,
    },
  });
  const { WIDTH, HEIGHT } = isMobile
    ? BANNER_DIMENSIONS.MOBILE
    : BANNER_DIMENSIONS.DESKTOP;

  useEffect(() => {
    if (isIntersecting) {
      trackEvent({
        eventName:
          ANALYTICS_EVENTS.CURATED_VIDEO_BANNER_EXP
            .MICROSITE_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: EXPERIMENT_NAMES.CURATED_VIDEO_BANNER,
      });
    }
  }, [isIntersecting]);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const trackVideoPlayedFn = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.CURATED_VIDEO_BANNER_EXP.VIDEO_PLAYED,
      [ANALYTICS_PROPERTIES.SECTION]: EXPERIMENT_NAMES.CURATED_VIDEO_BANNER,
    });
  };

  const trackVideoProgressFn = (videoProgress: number) => {
    if (
      videoProgress === 10 ||
      videoProgress === 25 ||
      videoProgress === 50 ||
      videoProgress === 75
    ) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.CURATED_VIDEO_BANNER_EXP.VIDEO_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: EXPERIMENT_NAMES.CURATED_VIDEO_BANNER,
        [ANALYTICS_PROPERTIES.PERCENT_VIEWED]: videoProgress,
      });
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
    trackEvent({
      eventName: ANALYTICS_EVENTS.CURATED_VIDEO_BANNER_EXP.VIDEO_PLAYER_OPENED,
      [ANALYTICS_PROPERTIES.SECTION]: EXPERIMENT_NAMES.CURATED_VIDEO_BANNER,
    });
  };
  const handleCuratedVideoBannerClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.CURATED_VIDEO_BANNER_EXP.CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: ANALYTICS_PROPERTIES.WATCH_VIDEO,
      [ANALYTICS_PROPERTIES.SECTION]: EXPERIMENT_NAMES.CURATED_VIDEO_BANNER,
    });

    openModal();
  };
  return (
    <>
      <Conditional if={isModalOpen && curatedBannerVideoSrc}>
        <Modal
          style={modalStyles}
          onRequestClose={closeModal}
          isOpen={isModalOpen}
        >
          <IFrameWrapper>
            <IFrame
              trackVideoProgressFn={trackVideoProgressFn}
              trackVideoPlayedFn={trackVideoPlayedFn}
              shouldTrackVideoLoaded={false}
              autoplay={true}
              src={curatedBannerVideoSrc}
            />
          </IFrameWrapper>
        </Modal>
      </Conditional>
      <YoutubeBannerWrapper
        onClick={handleCuratedVideoBannerClick}
        ref={mediaPreviewWrapperRef}
      >
        <YoutubeBanner>
          <YoutubeBannerLeft>
            <h3>{strings.CURATED_VIDEO_BANNER.HEADING}</h3>
            <p>{strings.CURATED_VIDEO_BANNER.SUB_HEADING}</p>
          </YoutubeBannerLeft>
          <YoutubeBannerRight>
            <MediaPreviewWrapper isIntersecting={isIntersecting}>
              <MediaPreview>
                <div className="media-player-wrapper">
                  <Conditional if={!tour.bannerVideo}>
                    <Image
                      url={tour.bannerImage.url}
                      width={WIDTH}
                      height={HEIGHT}
                      imageId={'media-image'}
                      alt={tour.bannerImage.alt}
                      priority
                      fill
                    />
                  </Conditional>
                  <Conditional if={tour.bannerVideo}>
                    <Video
                      url={tour.bannerVideo!}
                      imageWidth={WIDTH}
                      imageHeight={HEIGHT}
                      fallbackImage={tour.bannerImage}
                      dontLazyLoadImage
                      shouldVideoPlay
                      videoPosition={VIDEO_POSITIONS.BANNER}
                      showPauseIcon={false}
                      showPlayIcon={false}
                    />
                  </Conditional>
                </div>
              </MediaPreview>
            </MediaPreviewWrapper>
            <div className="label-wrapper">
              <VideoPlayIcon />
              <h3>{strings.CURATED_VIDEO_BANNER.WATCH_VIDEO}</h3>
            </div>
          </YoutubeBannerRight>
        </YoutubeBanner>
      </YoutubeBannerWrapper>
    </>
  );
};

export default CuratedVideoBanner;
