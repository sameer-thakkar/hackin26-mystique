import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { withShortcodes } from 'utils/helper';
import { trackEvent } from 'utils/analytics';
import { shouldDisplayCollectionRatings, truncateNumber } from 'utils/index';
import { gtmAtom } from 'store/atoms/gtm';
import Conditional from 'components/common/Conditional';
import {
  AverageRatingWrapper,
  BannerSection,
  Container,
  ContentContainer,
  DisclaimerText,
  Heading,
  MediaContainer,
  RatingCountWrapper,
  RatingsWrapper,
} from 'components/StaticBanner/styles';
import Video from 'UI/Video';
import Image from 'UI/Image';
import { STAR } from 'assets/SvgIcons';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import { ANALYTICS_EVENTS } from 'const/index';

type StaticBannerProps = {
  bannerHeading: string;
  bannerImages: Array<{ url: string; alt: string }>;
  aggregatedRatingDetails: AggregatedRatingDetails;
  bannerVideo?: string | null;
  showBannerSubtext: boolean;
  isMobile: boolean;
  isExperimentViewedTriggered: boolean;
  isPartnered?: boolean;
};

export interface AggregatedRatingDetails {
  id: number;
  displayName: string;
  metaDescription: string;
  ratingsCount: number;
  averageRating: number;
  listingPrice: number;
  currency: string;
  heroImageUrl?: string;
  cardImageUrl?: string;
}

export interface AggregatedRatingInfo {
  aggregatedRatingInfo: AggregatedRatingDetails;
}

const BANNER_DIMENSIONS = {
  WIDTH: 588,
  HEIGHT: 300,
};

const StaticBanner = ({
  bannerHeading: tempBannerHeading,
  bannerImages,
  bannerVideo,
  showBannerSubtext,
  isMobile,
  aggregatedRatingDetails,
  isExperimentViewedTriggered,
  isPartnered,
}: StaticBannerProps) => {
  const { eventsReady } = useRecoilValue(gtmAtom);

  const bannerHeadingArray = withShortcodes(tempBannerHeading);
  const bannerHeading = bannerHeadingArray?.join(' ');
  const bannerImage = bannerImages?.[0];
  const { averageRating, ratingsCount } = aggregatedRatingDetails ?? {};

  useEffect(() => {
    if (!eventsReady || isMobile || !isExperimentViewedTriggered) return;

    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.VISIBLE,
    });
  }, [eventsReady, isExperimentViewedTriggered, isMobile]);

  return (
    <BannerSection>
      <Container>
        <ContentContainer>
          <Heading>{bannerHeading}</Heading>
          <Conditional
            if={shouldDisplayCollectionRatings(aggregatedRatingDetails)}
          >
            <RatingsWrapper>
              {STAR(COLORS.BRAND.CANDY)}
              <AverageRatingWrapper>
                {averageRating?.toPrecision(2)}
              </AverageRatingWrapper>
              <RatingCountWrapper>
                ({truncateNumber(ratingsCount).toUpperCase()} {strings.RATINGS})
              </RatingCountWrapper>
            </RatingsWrapper>
          </Conditional>

          <Conditional if={showBannerSubtext}>
            <DisclaimerText>
              {isPartnered
                ? strings.PARTNERED_BANNER_SUBTEXT_DISCLAIMER
                : strings.NON_PARTNERED_BANNER_SUBTEXT_DISCLAIMER}
            </DisclaimerText>
          </Conditional>
        </ContentContainer>

        <Conditional if={!isMobile}>
          <MediaContainer>
            <Conditional if={!bannerVideo}>
              <Image
                url={bannerImage.url}
                width={BANNER_DIMENSIONS.WIDTH}
                height={BANNER_DIMENSIONS.HEIGHT}
                imageId={'banner-image'}
                alt={bannerImage.alt}
                priority
                fill
              />
            </Conditional>
            <Conditional if={bannerVideo}>
              <Video
                // @ts-expect-error TS(2322): Type 'string | null | undefined' is not assignable... Remove this comment to see the full error message
                url={bannerVideo}
                imageId={'banner-image'}
                imageWidth={BANNER_DIMENSIONS.WIDTH}
                imageHeight={BANNER_DIMENSIONS.HEIGHT}
                fallbackImage={bannerImage}
                dontLazyLoadImage
                shouldVideoPlay
              />
            </Conditional>
          </MediaContainer>
        </Conditional>
      </Container>
    </BannerSection>
  );
};

export default StaticBanner;
