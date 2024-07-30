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
  OLYMPICS_BANNER,
  VIDEO_POSITIONS,
} from 'const/index';
import { strings } from 'const/strings';
import VideoPlayIcon from 'assets/playIcon';
import RightChevron from 'assets/rightChevron';
import { BANNER_DIMENSIONS } from './constants';
import {
  H3Heading,
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
  isOlympicsBanner = false,
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
        [ANALYTICS_PROPERTIES.SECTION]: OLYMPICS_BANNER.BLOG_BANNER,
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

  const handleCTAClick = (
    e: React.MouseEvent<HTMLHeadingElement, MouseEvent>,
    label: string
  ) => {
    e.stopPropagation();
    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: OLYMPICS_BANNER.BLOG_BANNER,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: OLYMPICS_BANNER.BLOG_REDIRECTION,
      [ANALYTICS_PROPERTIES.LABEL]: label,
    });
  };

  const bannerContent = isOlympicsBanner
    ? OLYMPICS_BANNER.BANNER_CONTENT
    : strings.CURATED_VIDEO_BANNER.SUB_HEADING;
  const ctaContent = isOlympicsBanner
    ? OLYMPICS_BANNER.CTA_CONTENT
    : strings.CURATED_VIDEO_BANNER.WATCH_VIDEO;

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
        onClick={isOlympicsBanner ? () => {} : handleCuratedVideoBannerClick}
        ref={mediaPreviewWrapperRef}
      >
        <YoutubeBanner>
          <YoutubeBannerLeft>
            <span>
              {isOlympicsBanner
                ? OLYMPICS_BANNER.VIP_ACCESS
                : strings.CURATED_VIDEO_BANNER.HEADING}
            </span>
            <h2
              onClick={(e) =>
                handleCTAClick(e, OLYMPICS_BANNER.HOW_TO_GET_PASS)
              }
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
              role="button"
              tabIndex={0}
              dangerouslySetInnerHTML={{ __html: bannerContent }}
            />
          </YoutubeBannerLeft>
          <YoutubeBannerRight $isOlympicsBanner={isOlympicsBanner}>
            <Conditional if={!isOlympicsBanner}>
              <MediaPreviewWrapper isIntersecting={isIntersecting}>
                <MediaPreview>
                  <div className="media-player-wrapper">
                    <Conditional if={!tour.bannerVideo}>
                      <Image
                        url={tour.bannerImage?.url}
                        width={WIDTH}
                        height={HEIGHT}
                        imageId={'media-image'}
                        alt={tour.bannerImage?.alt}
                        priority
                        fill
                      />
                    </Conditional>
                    <Conditional if={tour.bannerVideo}>
                      <Video
                        url={tour.bannerVideo!}
                        imageWidth={WIDTH}
                        imageHeight={HEIGHT}
                        fallbackImage={tour?.bannerImage}
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
            </Conditional>
            <div className="label-wrapper">
              <Conditional if={!isOlympicsBanner}>
                <VideoPlayIcon />
              </Conditional>
              <H3Heading
                $isOlympicsBanner={isOlympicsBanner}
                onClick={(e) =>
                  handleCTAClick(e, OLYMPICS_BANNER.GET_YOUR_FREE_GUIDE)
                }
                dangerouslySetInnerHTML={{ __html: ctaContent }}
              />
              <RightChevron />
            </div>
          </YoutubeBannerRight>
        </YoutubeBanner>
      </YoutubeBannerWrapper>
    </>
  );
};

export default CuratedVideoBanner;
