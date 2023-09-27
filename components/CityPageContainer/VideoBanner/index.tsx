import {
  IBannerParams,
  ICurrentCityData,
  IVideoBanner,
} from 'components/CityPageContainer/interface';
import { getBannerParams } from 'components/CityPageContainer/utils';
import {
  Container,
  TitleWrapper,
} from 'components/CityPageContainer/VideoBanner/styles';
import Video from 'UI/Video';
import { VIDEO_POSITIONS } from 'const/index';
import { strings } from 'const/strings';

const BANNER_DIMENSIONS = {
  WIDTH: 588,
  HEIGHT: 300,
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

  return (
    <Container>
      <Video
        url={bannerVideoUrl}
        imageId={'banner-image'}
        imageWidth={BANNER_DIMENSIONS.WIDTH}
        imageHeight={BANNER_DIMENSIONS.HEIGHT}
        fallbackImage={{
          url: videoFallbackImgUrl,
          altText: imgAltText,
        }}
        dontLazyLoadImage
        shouldVideoPlay
        videoPosition={VIDEO_POSITIONS.BANNER}
      >
        <VideoTitle currentCityData={currentCityData} />
      </Video>
      <div className="gradient-wrapper"></div>
    </Container>
  );
};

export default VideoBanner;
