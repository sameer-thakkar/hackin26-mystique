import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import Conditional from 'components/common/Conditional';
import IFrame from 'components/shortcodes/IFrame';
import Image from 'UI/Image';
import Video from 'UI/Video';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { isMobile } from 'utils/helper';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CUSTOM_BANNER,
  CUSTOM_BANNER_SLICE,
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
  Subtitle,
  YoutubeBanner,
  YoutubeBannerLeft,
  YoutubeBannerRight,
  YoutubeBannerWrapper,
} from './styles';
import { CustomBannerProps } from './types';

const CustomBanner = ({
  variant,
  headingTitle = '',
  mediaLink = '',
  ctaLabel = '',
  ctaUrl = '',
  subtitle = '',
  insideCards,
}: CustomBannerProps) => {
  const mediaPreviewWrapperRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isIntersecting = useOnScreen({
    ref: mediaPreviewWrapperRef,
    unobserve: true,
    options: {
      threshold: 1,
    },
  });
  const { WIDTH, HEIGHT } = isMobile()
    ? BANNER_DIMENSIONS.MOBILE
    : BANNER_DIMENSIONS.DESKTOP;
  const { VARIANTS } = CUSTOM_BANNER;
  useEffect(() => {
    if (isIntersecting) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: CUSTOM_BANNER_SLICE,
        [ANALYTICS_PROPERTIES.BANNER_TYPE]: variant,
        [ANALYTICS_PROPERTIES.HYPERLINK]: ctaUrl,
      });
    }
  }, [isIntersecting, variant, ctaUrl]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCTAClick = (
    e: React.MouseEvent<HTMLHeadingElement, MouseEvent>
  ) => {
    e.stopPropagation();
    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: CUSTOM_BANNER_SLICE,
      [ANALYTICS_PROPERTIES.BANNER_TYPE]: variant,
      [ANALYTICS_PROPERTIES.HYPERLINK]: ctaUrl,
    });
  };

  return (
    <>
      <Conditional
        if={variant == VARIANTS.VIDEO_TEXT && isModalOpen && mediaLink}
      >
        <Modal
          style={modalStyles}
          onRequestClose={closeModal}
          isOpen={isModalOpen}
        >
          <IFrameWrapper>
            <IFrame
              shouldTrackVideoLoaded={false}
              autoplay={true}
              src={mediaLink}
            />
          </IFrameWrapper>
        </Modal>
      </Conditional>
      <YoutubeBannerWrapper ref={mediaPreviewWrapperRef}>
        <YoutubeBanner insideCards={insideCards}>
          <YoutubeBannerLeft>
            <span>{headingTitle}</span>

            <Subtitle
              onClick={handleCTAClick}
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
              role="button"
              tabIndex={0}
            >
              {subtitle}
            </Subtitle>
          </YoutubeBannerLeft>
          <YoutubeBannerRight>
            {/* <Conditional if={variant == VARIANTS.VIDEO_TEXT}> */}
            <MediaPreviewWrapper isIntersecting={isIntersecting}>
              <MediaPreview>
                <div className="media-player-wrapper">
                  <Conditional if={variant == VARIANTS.IMAGE_TEXT}>
                    <Image
                      url={mediaLink}
                      width={WIDTH}
                      height={HEIGHT}
                      imageId={'media-image'}
                      alt={headingTitle}
                      priority
                      fill
                    />
                  </Conditional>
                  <Conditional if={variant == VARIANTS.VIDEO_TEXT}>
                    <Video
                      url={mediaLink}
                      imageWidth={WIDTH}
                      imageHeight={HEIGHT}
                      fallbackImage={{}}
                      shouldVideoPlay
                      dontLazyLoadImage
                      videoPosition={VIDEO_POSITIONS.BANNER}
                      showPauseIcon={false}
                      showPlayIcon={false}
                    />
                  </Conditional>
                </div>
              </MediaPreview>
            </MediaPreviewWrapper>
            {/* </Conditional> */}
            <div className="label-wrapper">
              <Conditional if={variant == VARIANTS.VIDEO_TEXT}>
                <VideoPlayIcon />
              </Conditional>
              <H3Heading
                $isImage={variant == VARIANTS.IMAGE_TEXT}
                onClick={handleCTAClick}
              >
                <a href={ctaUrl} rel="nofollow" target="_blank">
                  {ctaLabel}
                </a>
              </H3Heading>
              <Conditional if={variant == VARIANTS.IMAGE_TEXT}>
                <RightChevron />
              </Conditional>
            </div>
          </YoutubeBannerRight>
        </YoutubeBanner>
      </YoutubeBannerWrapper>
    </>
  );
};

export default CustomBanner;
