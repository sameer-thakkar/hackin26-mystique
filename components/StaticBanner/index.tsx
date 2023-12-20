import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import F1BannerTrustBoosters from 'components/F1BannerTrustBooster';
import {
  AverageRatingWrapper,
  BannerSection,
  Container,
  ContentContainer,
  Descriptor,
  DescriptorWrapper,
  DisclaimerText,
  Divider,
  Heading,
  MediaContainer,
  Overlay,
  RatingCountWrapper,
  RatingsWrapper,
} from 'components/StaticBanner/styles';
import { trackEvent } from 'utils/analytics';
import { withShortcodes } from 'utils/helper';
import {
  getF1MBTrustBoosters,
  shouldDisplayCollectionRatings,
  truncateNumber,
} from 'utils/index';
import { gtmAtom } from 'store/atoms/gtm';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, VIDEO_POSITIONS } from 'const/index';
import { strings } from 'const/strings';
import { STAR } from 'assets/SvgIcons';

const Image = dynamic(() => import(/* webpackChunkName: "Image" */ 'UI/Image'));
const Video = dynamic(() => import(/* webpackChunkName: "Video" */ 'UI/Video'));
const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

type StaticBannerProps = {
  bannerHeading: string;
  bannerImages: Array<{ url: string; alt: string }>;
  collectionDetails?: CollectionDetails;
  bannerVideo?: string | null;
  bannerSubText: string | undefined;
  isMobile: boolean;
  shouldDisplayTrustBoosters?: boolean;
  isNonPoiMB?: boolean;
  isNonPoiCollectionMB?: boolean;
  bannerDescriptors: Array<{ icon: string; text: string }>;
  cityName?: string;
  isHOHO?: boolean;
  isHOHORevamp?: boolean;
  ratingsAndReviewsData?: {
    averageRating: number;
    ratingsCount: number;
  };
  city?: string | null;
};

type CollectionVideo = {
  url: string;
  type: 'VIDEO';
  metadata: {
    altText: string | null;
    height: number | null;
    width: number | null;
    videoDuration: number | null;
    uploadDate: string | null;
  };
  info: {
    sourceType: string;
    sourceUrl: string;
    credit: string;
    filename: string;
    fileSize: number;
  };
};

export type CollectionVideos = Array<CollectionVideo>;

export type CollectionDetails = {
  id: number;
  displayName: string;
  metaDescription: string;
  ratingsCount: number;
  averageRating: number;
  listingPrice: number;
  currency: string;
  heroImageUrl?: string;
  cardImageUrl?: string;
  videos: CollectionVideos;
};

const BANNER_DIMENSIONS = {
  DESKTOP: {
    WIDTH: 588,
    HEIGHT: 300,
  },
  MOBILE: {
    WIDTH: 275,
    HEIGHT: 168,
  },
};
const StaticBanner = ({
  bannerHeading: tempBannerHeading,
  bannerImages,
  bannerVideo,
  isMobile,
  collectionDetails,
  bannerSubText,
  shouldDisplayTrustBoosters,
  isNonPoiMB = false,
  isNonPoiCollectionMB = false,
  bannerDescriptors,
  cityName,
  isHOHO,
  isHOHORevamp,
  ratingsAndReviewsData,
  city,
}: StaticBannerProps) => {
  const { eventsReady } = useRecoilValue(gtmAtom);

  const bannerHeadingArray = withShortcodes(tempBannerHeading);
  const bannerHeading =
    isHOHORevamp && cityName
      ? `<span class='bold-city'>${cityName}</span><br/>${strings.HOHO.HOHO}`
      : bannerHeadingArray?.join(' ');
  const bannerImage = bannerImages?.[0];
  const hideBanner = !isHOHO && isNonPoiCollectionMB && !bannerVideo;

  const finalCollectionDetails = isHOHORevamp
    ? { averageRating: 4.3, ratingsCount: 5193 }
    : collectionDetails;

  let { averageRating = 0, ratingsCount = 0 } = finalCollectionDetails ?? {};
  const { WIDTH, HEIGHT } = isMobile
    ? BANNER_DIMENSIONS.MOBILE
    : BANNER_DIMENSIONS.DESKTOP;

  if (ratingsAndReviewsData) {
    averageRating = ratingsAndReviewsData?.averageRating ?? 0;
    ratingsCount = ratingsAndReviewsData?.ratingsCount ?? 0;
  }

  const displayCollectionRating = shouldDisplayCollectionRatings({
    averageRating,
    ratingsCount,
  });
  const displayAirportTransfersRating =
    ratingsAndReviewsData && averageRating > 0 && ratingsCount > 0;

  const showNonPoiDesign = isNonPoiMB && !shouldDisplayTrustBoosters;

  useEffect(() => {
    if (!eventsReady || isMobile) return;

    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.VISIBLE,
    });
  }, [eventsReady, isMobile]);

  const onRatingsClick = () => {
    if (!isHOHORevamp) return;
    const section = document.querySelector('.slice-block.reviews');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const swiperParams: SwiperProps = {
    spaceBetween: 16,
    centeredSlides: true,
    speed: 5000,
    autoplay: {
      delay: 1,
      disableOnInteraction: false,
    },
    loop: true,
    slidesPerView: 'auto',
  };
  const getBannerDescriptors = () => {
    return bannerDescriptors?.map((item: Record<string, any>) => {
      const { icon, text } = item;
      return (
        <Descriptor key={text}>
          <Image url={icon} alt={text} height={20} width={20} />
          <span>{text}</span>
        </Descriptor>
      );
    });
  };
  let bannerHeadingWithCityName = null;

  if (city) {
    bannerHeadingWithCityName = `<span class='airport-transfers'>${city}</span> ${bannerHeading}`;
  }

  return (
    <BannerSection $isNonPoi={showNonPoiDesign}>
      <Conditional if={isMobile && showNonPoiDesign}>
        <Overlay $hideBanner={hideBanner} />
        <MediaContainer $isNonPoi={showNonPoiDesign} $hideBanner={hideBanner}>
          <Conditional if={!bannerVideo}>
            <Image
              url={bannerImage.url}
              width={WIDTH}
              height={HEIGHT}
              imageId={'banner-image'}
              alt={bannerImage.alt}
              priority
              fill
            />
          </Conditional>
          <Conditional if={bannerVideo}>
            <Video
              url={bannerVideo!}
              imageId={'banner-image'}
              imageWidth={WIDTH}
              imageHeight={HEIGHT}
              fallbackImage={bannerImage}
              dontLazyLoadImage
              shouldVideoPlay
              videoPosition={VIDEO_POSITIONS.BANNER}
              showPauseIcon={false}
              showPlayIcon={false}
            />
          </Conditional>
        </MediaContainer>
      </Conditional>
      <Container>
        <ContentContainer>
          <Conditional if={shouldDisplayTrustBoosters}>
            <F1BannerTrustBoosters
              f1TrustBooster={getF1MBTrustBoosters(true)}
            />
          </Conditional>

          <Heading
            dangerouslySetInnerHTML={{
              __html: bannerHeadingWithCityName
                ? bannerHeadingWithCityName
                : bannerHeading,
            }}
            $isNonPoi={showNonPoiDesign}
            $displayRating={
              displayCollectionRating || displayAirportTransfersRating
            }
            $showTrustBooster={shouldDisplayTrustBoosters}
          />
          <Conditional
            if={displayCollectionRating || displayAirportTransfersRating}
          >
            <RatingsWrapper
              $isNonPoi={showNonPoiDesign}
              $showTrustBooster={shouldDisplayTrustBoosters}
              onClick={onRatingsClick}
              $showPointer={isHOHORevamp}
            >
              {STAR(showNonPoiDesign ? COLORS.GRAY.G1 : COLORS.TEXT.CANDY_1)}
              <AverageRatingWrapper $isNonPoi={showNonPoiDesign}>
                {averageRating?.toPrecision(2)}
              </AverageRatingWrapper>
              <RatingCountWrapper $isNonPoi={showNonPoiDesign}>
                (
                {strings.formatString(
                  strings.RATINGS,
                  truncateNumber(ratingsCount).toUpperCase()
                )}
                )
              </RatingCountWrapper>
            </RatingsWrapper>
          </Conditional>
          <Conditional if={showNonPoiDesign}>
            <Divider />
            <DescriptorWrapper>
              {isMobile && bannerDescriptors?.length ? (
                <Swiper {...swiperParams}>{getBannerDescriptors()}</Swiper>
              ) : (
                getBannerDescriptors()
              )}
            </DescriptorWrapper>
          </Conditional>
          <Conditional if={!showNonPoiDesign && !shouldDisplayTrustBoosters}>
            <DisclaimerText>{bannerSubText}</DisclaimerText>
          </Conditional>
        </ContentContainer>

        <Conditional if={!isMobile}>
          <MediaContainer $isNonPoi={showNonPoiDesign}>
            <Conditional if={!bannerVideo}>
              <Image
                url={bannerImage.url}
                width={WIDTH}
                height={HEIGHT}
                imageId={'banner-image'}
                alt={bannerImage.alt}
                priority
                fill
              />
            </Conditional>
            <Conditional if={bannerVideo}>
              <Video
                url={bannerVideo!}
                imageId={'banner-image'}
                imageWidth={WIDTH}
                imageHeight={HEIGHT}
                fallbackImage={bannerImage}
                dontLazyLoadImage
                shouldVideoPlay
                videoPosition={VIDEO_POSITIONS.BANNER}
                showPlayIcon={false}
                showPauseIcon={false}
              />
            </Conditional>
          </MediaContainer>
        </Conditional>
      </Container>
    </BannerSection>
  );
};

export default StaticBanner;
