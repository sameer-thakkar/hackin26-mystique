import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import Conditional from 'components/common/Conditional';
import IFrame from 'components/shortcodes/IFrame';
import Image from 'UI/Image';
import Video from 'UI/Video';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  OLYMPICS_BANNER,
  VIDEO_POSITIONS,
} from 'const/index';
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
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: OLYMPICS_BANNER.BLOG_BANNER,
      });
    }
  }, [isIntersecting]);

  const closeModal = () => {
    setIsModalOpen(false);
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

  const bannerContent = isOlympicsBanner ? OLYMPICS_BANNER.BANNER_CONTENT : '';
  const ctaContent = isOlympicsBanner ? OLYMPICS_BANNER.CTA_CONTENT : '';

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
              shouldTrackVideoLoaded={false}
              autoplay={true}
              src={curatedBannerVideoSrc}
            />
          </IFrameWrapper>
        </Modal>
      </Conditional>
      <YoutubeBannerWrapper ref={mediaPreviewWrapperRef}>
        <YoutubeBanner>
          <YoutubeBannerLeft>
            <Conditional if={isOlympicsBanner}>
              <span>{OLYMPICS_BANNER.VIP_ACCESS}</span>
            </Conditional>

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
