import {
  IBannerParams,
  ICurrentCityData,
  IVideoBanner,
} from 'components/CityPageContainer/interface';
import { getBannerParams } from 'components/CityPageContainer/utils';
import {
  Container,
  Gradient,
  TitleWrapper,
} from 'components/CityPageContainer/VideoBanner/styles';
import Video from 'UI/Video';
import { VIDEO_POSITIONS } from 'const/index';
import { strings } from 'const/strings';

const BANNER_DIMENSIONS = {
  DESKTOP: {
    WIDTH: 1512,
    HEIGHT: 756,
  },
  MOBILE: {
    WIDTH: 375,
    HEIGHT: 308,
  },
};

const VideoTitle = ({
  currentCityData,
}: {
  currentCityData: ICurrentCityData;
}) => {
  const {
    displayName: cityName,
    country: { displayName: countryName },
  } = currentCityData;
  return (
    <TitleWrapper>
      <div className="promo-text-wrapper">
        {strings.CITY_PAGE.BANNER_TITLE}&nbsp;
      </div>
      <div className="city-wrapper">{cityName.toUpperCase()}&nbsp;</div>
      <div className="country-wrapper">{countryName}</div>
    </TitleWrapper>
  );
};

const VideoBanner = ({
  currentCityData,
  cityPageBannerData,
  prismicBannerImages,
  isMobile,
}: IVideoBanner) => {
  const bannerParams: IBannerParams | undefined = getBannerParams(
    cityPageBannerData
  );

  const { videoUrl = '', videoFallbackUrl = '', altText = '' } =
    bannerParams || {};
  const { url, alt } = prismicBannerImages[0] || {};
  const bannerVideoUrl = videoUrl || '';
  const videoFallbackImgUrl = videoFallbackUrl || url || '';
  const imgAltText = altText || alt || '';

  const { HEIGHT, WIDTH } = isMobile
    ? BANNER_DIMENSIONS.MOBILE
    : BANNER_DIMENSIONS.DESKTOP;

  return (
    <Container>
      <Video
        url={bannerVideoUrl}
        imageId={'banner-image'}
        imageWidth={WIDTH}
        imageHeight={HEIGHT}
        fallbackImage={{
          url: videoFallbackImgUrl,
          altText: imgAltText,
        }}
        dontLazyLoadImage
        shouldVideoPlay
        videoPosition={VIDEO_POSITIONS.BANNER}
        showPauseIcon={false}
        showPlayIcon={false}
      >
        <VideoTitle currentCityData={currentCityData} />
        <Gradient />
      </Video>
    </Container>
  );
};

export default VideoBanner;
