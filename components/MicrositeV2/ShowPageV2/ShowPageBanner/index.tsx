import Conditional from 'components/common/Conditional';
import ImageGallery from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery';
import { TShowPageBannerProps } from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/interface';
import ShowInfoSection from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ShowInfoSection';
import {
  BannerBackground,
  GradientWrapper,
  ShowPageBannerWrapper,
} from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/style';
import Image from 'UI/Image';
import Video from 'UI/Video';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, VIDEO_POSITIONS } from 'const/index';

const ShowPageV2Banner = ({
  tourGroupData,
  isMobile,
  isDev,
  breadcrumbs,
  taggedCity,
}: TShowPageBannerProps) => {
  const { imageUploads, nativeShowTrailer } = tourGroupData ?? {};
  const { url: trailerUrl } = nativeShowTrailer ?? {};
  const bannerImageToShow =
    imageUploads?.[imageUploads?.length > 1 ? 1 : 0] ?? {};
  return (
    <ShowPageBannerWrapper>
      <ShowInfoSection
        tourGroupData={tourGroupData}
        isMobile={isMobile}
        isDev={isDev}
        breadcrumbs={breadcrumbs}
        taggedCity={taggedCity}
      />
      <Conditional if={imageUploads.length || trailerUrl}>
        <BannerBackground
          onClick={() => {
            trackEvent({
              eventName: ANALYTICS_EVENTS.SHOW_PAGE.VIDEO_CLICKED,
            });
          }}
        >
          <GradientWrapper position="top" />
          <GradientWrapper position="right" />
          <Conditional if={!trailerUrl}>
            <Image
              url={bannerImageToShow.url}
              alt={bannerImageToShow.alt}
              priority
              width={isMobile ? 487 : 891}
              aspectRatio={'21:9'}
              fitCrop={true}
              autoCrop={true}
              className="banner-image"
              fetchPriority="high"
            />
          </Conditional>
          <Conditional if={trailerUrl}>
            <Video
              url={trailerUrl}
              fallbackImage={{
                url: bannerImageToShow.url,
              }}
              id="show-page-banner"
              imageAspectRatio={'21:9'}
              imageWidth={isMobile ? 487 : 891}
              imageAutoCrop={true}
              imageFitCrop={true}
              imageFill={false}
              dontLazyLoadImage={true}
              videoPosition={VIDEO_POSITIONS.BANNER}
              eventTracking={true}
              shouldVideoPlay
              shouldAutoPlay
              pauseOnclick
              showPauseIcon={false}
              showPlayIcon={false}
            />
          </Conditional>
          <GradientWrapper position="bottom" />
        </BannerBackground>
      </Conditional>
      <Conditional if={imageUploads?.length > 1}>
        <ImageGallery imageUploads={imageUploads} />
      </Conditional>
    </ShowPageBannerWrapper>
  );
};

export default ShowPageV2Banner;
