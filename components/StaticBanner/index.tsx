import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { withShortcodes } from 'utils/helper';
import { trackEvent } from 'utils/analytics';
import {
  getF1MBTrustBoosters,
  shouldDisplayCollectionRatings,
  truncateNumber,
} from 'utils/index';
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
import { STAR } from 'assets/SvgIcons';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import { ANALYTICS_EVENTS, VIDEO_POSITIONS } from 'const/index';
import F1BannerTrustBoosters from 'components/F1BannerTrustBooster';

const Image = dynamic(() => import(/* webpackChunkName: "Image" */ 'UI/Image'));
const Video = dynamic(() => import(/* webpackChunkName: "Video" */ 'UI/Video'));

type StaticBannerProps = {
  bannerHeading: string;
  bannerImages: Array<{ url: string; alt: string }>;
  collectionDetails: CollectionDetailsTypes;
  bannerVideo?: string | null;
  bannerSubText: string | undefined;
  isMobile: boolean;
  shouldDisplayTrustBoosters?: boolean;
};

export type CollectionDetailsTypes = {
  id: number;
  displayName: string;
  metaDescription: string;
  ratingsCount: number;
  averageRating: number;
  listingPrice: number;
  currency: string;
  heroImageUrl?: string;
  cardImageUrl?: string;
};

const BANNER_DIMENSIONS = {
  WIDTH: 588,
  HEIGHT: 300,
};

const StaticBanner = ({
  bannerHeading: tempBannerHeading,
  bannerImages,
  bannerVideo,
  isMobile,
  collectionDetails,
  bannerSubText,
  shouldDisplayTrustBoosters,
}: StaticBannerProps) => {
  const { eventsReady } = useRecoilValue(gtmAtom);

  const bannerHeadingArray = withShortcodes(tempBannerHeading);
  const bannerHeading = bannerHeadingArray?.join(' ');
  const bannerImage = bannerImages?.[0];
  const { averageRating, ratingsCount } = collectionDetails ?? {};

  useEffect(() => {
    if (!eventsReady || isMobile) return;

    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.VISIBLE,
    });
  }, [eventsReady, isMobile]);

  return (
    <BannerSection>
      <Container>
        <ContentContainer>
          <Conditional if={shouldDisplayTrustBoosters}>
            <F1BannerTrustBoosters
              f1TrustBooster={getF1MBTrustBoosters(true)}
            />
          </Conditional>
          <Heading dangerouslySetInnerHTML={{ __html: bannerHeading }} />
          <Conditional if={shouldDisplayCollectionRatings(collectionDetails)}>
            <RatingsWrapper>
              {STAR(COLORS.BRAND.CANDY)}
              <AverageRatingWrapper>
                {averageRating?.toPrecision(2)}
              </AverageRatingWrapper>
              <RatingCountWrapper>
                {strings.formatString(
                  strings.RATINGS,
                  truncateNumber(ratingsCount).toUpperCase()
                )}
              </RatingCountWrapper>
            </RatingsWrapper>
          </Conditional>

          <DisclaimerText>{bannerSubText}</DisclaimerText>
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
                url={bannerVideo!}
                imageId={'banner-image'}
                imageWidth={BANNER_DIMENSIONS.WIDTH}
                imageHeight={BANNER_DIMENSIONS.HEIGHT}
                fallbackImage={bannerImage}
                dontLazyLoadImage
                shouldVideoPlay
                videoPosition={VIDEO_POSITIONS.BANNER}
              />
            </Conditional>
          </MediaContainer>
        </Conditional>
      </Container>
    </BannerSection>
  );
};

export default StaticBanner;
