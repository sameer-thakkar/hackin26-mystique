import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import F1BannerTrustBoosters from 'components/F1BannerTrustBooster';
import TrustBooster from 'components/MicrositeV2/BannerV2TrustBooster';
import {
  AverageRatingWrapper,
  BannerDisclaimerText,
  BannerSection,
  Container,
  ContentContainer,
  DescriptorWrapper,
  DisclaimerText,
  Divider,
  ExtraDivider,
  Gradient,
  Heading,
  HohoDivider,
  HohoSubtext,
  InfoContainer,
  MediaContainer,
  Overlay,
  ParentChip,
  RatingCountWrapper,
  RatingsWrapper,
  Subsection,
} from 'components/StaticBanner/styles';
import { trackEvent } from 'utils/analytics';
import { withShortcodes } from 'utils/helper';
import {
  getF1MBTrustBoosters,
  shouldDisplayCollectionRatings,
} from 'utils/index';
import { getLocalizedCount } from 'utils/localizationUtils';
import { titleCase } from 'utils/stringUtils';
import { appAtom } from 'store/atoms/app';
import { gtmAtom } from 'store/atoms/gtm';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CRUISES_ILLUSTRATION,
  VIDEO_POSITIONS,
} from 'const/index';
import { strings } from 'const/strings';
import ChevronLeftBold from 'assets/chevronLeftBold';
import ChevronRightIcon from 'assets/chevronRight';
import Star from 'assets/star';
import { COMPONENT_NAME, SECTION_NAME } from './const';
import { IllustrationBanner } from './IllustrationBanner';
import { getBannerDescriptorsArray } from './utils';

const Image = dynamic(() => import(/* webpackChunkName: "Image" */ 'UI/Image'));
const Video = dynamic(() => import(/* webpackChunkName: "Video" */ 'UI/Video'));
const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

interface Customer {
  name: string;
  profileImageUrl: string | null;
}

export interface Question {
  id: number;
  content: string;
  tag: string;
}

export interface Answer {
  content: string;
  rating: number;
  customer: Customer;
  timestamp: string;
}

export interface QnAEntry<
  T extends Question = Question,
  U extends Answer = Answer
> {
  question: T;
  answers: U[];
}

export interface QnAContainer<T extends QnAEntry = QnAEntry> {
  type: string;
  qna: T[];
}

type StaticBannerProps = {
  bannerHeading: string;
  bannerImages: Array<{ url: string; alt: string }>;
  collectionDetails?: CollectionDetails;
  bannerVideo?: string | null;
  bannerSubTextIcon?: () => JSX.Element;
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
  subattractionParentChip?: {
    url?: string;
    title?: string;
  };
  extraPairs?: Record<string, any>;
  onTimingsClick?: () => void;
  showThumbnailInBanner?: boolean;
  bannerDisclaimerText?: string;
  id?: string;
  forceMobile?: boolean;
  isCruisesRevamp?: boolean;
  qnaSections?: QnAContainer[];
  showQnaExperiment?: boolean;
  collectionId?: number;
  reducedMwebMarginOnDisclaimer?: boolean;
  isAirportTransfersMB?: boolean;
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

export const STATIC_BANNER_DIMENSIONS = {
  DESKTOP: {
    WIDTH: 588,
    HEIGHT: 300,
  },
  MOBILE: {
    WIDTH: 275,
    HEIGHT: 168,
  },
};

export const swiperParams: SwiperProps = {
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

const StaticBanner = ({
  bannerHeading: tempBannerHeading,
  bannerImages,
  bannerVideo,
  bannerSubTextIcon,
  isMobile,
  collectionDetails,
  bannerSubText,
  shouldDisplayTrustBoosters,
  isNonPoiMB = false,
  bannerDescriptors,
  cityName,
  isHOHO,
  isHOHORevamp,
  ratingsAndReviewsData,
  subattractionParentChip,
  extraPairs = {},
  onTimingsClick,
  showThumbnailInBanner,
  id,
  forceMobile = false,
  bannerDisclaimerText,
  isCruisesRevamp = false,
  showQnaExperiment = false,
  reducedMwebMarginOnDisclaimer = false,
  isAirportTransfersMB = false,
}: StaticBannerProps) => {
  const { eventsReady } = useRecoilValue(gtmAtom);
  const { language } = useRecoilValue(appAtom);

  const bannerHeadingArray = withShortcodes(tempBannerHeading);
  const bannerHeading =
    isHOHORevamp && cityName
      ? `<span class='bold-city'>${cityName}</span><br/>${strings.HOHO.HOHO}`
      : bannerHeadingArray?.join(' ');
  const bannerImage = bannerImages?.[0] || {};
  const hideBanner = !isHOHO && isNonPoiMB && !bannerVideo;

  const finalCollectionDetails = isHOHORevamp
    ? { averageRating: 4.3, ratingsCount: 5193 }
    : collectionDetails;

  let { averageRating = 0, ratingsCount = 0 } = finalCollectionDetails ?? {};
  const { WIDTH, HEIGHT } = isMobile
    ? STATIC_BANNER_DIMENSIONS.MOBILE
    : STATIC_BANNER_DIMENSIONS.DESKTOP;

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
    trackEvent({
      eventName: ANALYTICS_EVENTS.DEAD_CLICK,
      [ANALYTICS_PROPERTIES.COMPONENT]: COMPONENT_NAME,
      [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAME,
      [ANALYTICS_PROPERTIES.NUMBER_OF_RATINGS]: ratingsCount,
      [ANALYTICS_PROPERTIES.AVERAGE_RATING]: averageRating,
    });
    if (!isHOHORevamp) return;
    const section = document.querySelector('.slice-block.reviews');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  let bannerHeadingWithCityName = null;

  if (isAirportTransfersMB && cityName) {
    bannerHeadingWithCityName = `<span class='airport-transfers'>${cityName}</span> ${bannerHeading}`;
  }
  const displayParentChip =
    !!subattractionParentChip?.url && !!subattractionParentChip?.title;
  const hasExtraInfo = !!Object.values(extraPairs).filter((val) => val).length;
  const EXTRA_INFO_TIMINGS_KEY = 'TIMINGS';
  if (isCruisesRevamp)
    return (
      <IllustrationBanner
        isMobile={isMobile}
        cityName={cityName ?? ''}
        bannerDescriptors={bannerDescriptors}
        illustrationUrl={CRUISES_ILLUSTRATION}
      />
    );

  const handleParentChipClick = (label: string) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.SHOULDER_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: 'Back CTA',
      [ANALYTICS_PROPERTIES.SECTION]: 'Banner Section',
      [ANALYTICS_PROPERTIES.LABEL]: label,
    });
  };

  return (
    <BannerSection
      $isNonPoi={showNonPoiDesign}
      $isHOHORevamp={isHOHORevamp}
      id={id}
      hasParentChip={displayParentChip}
    >
      <Conditional if={isHOHORevamp && !isMobile}>
        <Gradient />
        <Gradient $isLeft={true} />
      </Conditional>
      <Conditional if={isMobile && showNonPoiDesign}>
        <Overlay $hideBanner={hideBanner} $isHOHORevamp={isHOHORevamp} />
        <MediaContainer
          $isNonPoi={showNonPoiDesign}
          $hideBanner={hideBanner}
          $isHOHORevamp={isHOHORevamp}
          $hideOnMobile={displayParentChip || hasExtraInfo}
        >
          <Conditional if={!bannerVideo || showThumbnailInBanner}>
            <Image
              url={bannerImage?.url}
              width={WIDTH}
              height={HEIGHT}
              imageId={'banner-image'}
              alt={bannerImage?.alt}
              priority
              fill
              loadHigherQualityImage={true}
            />
          </Conditional>
          <Conditional if={!showThumbnailInBanner && bannerVideo}>
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
        <ContentContainer
          hasParentChip={displayParentChip}
          hasExtraInfo={hasExtraInfo}
        >
          <Conditional if={displayParentChip}>
            <ParentChip
              href={subattractionParentChip?.url}
              onClick={() =>
                handleParentChipClick(subattractionParentChip?.title as string)
              }
            >
              {ChevronLeftBold}
              {titleCase(subattractionParentChip?.title as string)}
            </ParentChip>
          </Conditional>
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
            $isHOHORevamp={isHOHORevamp}
            $hasParentChip={displayParentChip}
          />
          <Conditional if={isHOHORevamp}>
            <Subsection>
              <HohoDivider />
              <Conditional if={!isMobile}>
                <HohoSubtext
                  dangerouslySetInnerHTML={{
                    __html: strings.HOHO.BANNER_SUBTEXT,
                  }}
                />
              </Conditional>
            </Subsection>
          </Conditional>
          <Conditional
            if={
              (displayCollectionRating || displayAirportTransfersRating) &&
              !isHOHORevamp
            }
          >
            <RatingsWrapper
              $isNonPoi={showNonPoiDesign}
              $showTrustBooster={shouldDisplayTrustBoosters}
              $hideComponent={forceMobile && isMobile}
              onClick={onRatingsClick}
              $showPointer={isHOHORevamp}
              $hasParentChip={displayParentChip}
              className="ratings-wrapper"
            >
              <Star color={COLORS.TEXT.CANDY_1} />
              <AverageRatingWrapper $isNonPoi={showNonPoiDesign}>
                {averageRating?.toPrecision(2)}
              </AverageRatingWrapper>
              <RatingCountWrapper $isNonPoi={showNonPoiDesign}>
                (
                {strings.formatString(
                  strings.RATINGS,
                  getLocalizedCount(ratingsCount, language)
                )}
                )
              </RatingCountWrapper>
            </RatingsWrapper>
          </Conditional>
          <Conditional if={showNonPoiDesign && !isHOHORevamp}>
            <Divider isVisible={!isMobile || !!bannerDescriptors?.length} />
            <DescriptorWrapper>
              {isMobile && bannerDescriptors?.length ? (
                <Swiper {...swiperParams}>
                  {getBannerDescriptorsArray(bannerDescriptors)}
                </Swiper>
              ) : (
                getBannerDescriptorsArray(bannerDescriptors)
              )}
            </DescriptorWrapper>
          </Conditional>
          <Conditional if={!showNonPoiDesign && !shouldDisplayTrustBoosters}>
            <DisclaimerText
              hasParentChip={displayParentChip}
              $forceMobile={forceMobile}
              $reducedMargin={reducedMwebMarginOnDisclaimer}
              $showQnaExperiment={showQnaExperiment}
            >
              {bannerSubTextIcon?.()}
              {bannerSubText}
            </DisclaimerText>
          </Conditional>
          <Conditional if={bannerDisclaimerText}>
            <BannerDisclaimerText>{bannerDisclaimerText}</BannerDisclaimerText>
          </Conditional>
          <Conditional if={hasExtraInfo && !isMobile}>
            <ExtraDivider />
            <InfoContainer>
              {Object.entries(extraPairs).map(
                ([key, val]) =>
                  val && (
                    <div key={key}>
                      <p>
                        {
                          strings.CONTENT_PAGE[
                            key as keyof typeof strings.CONTENT_PAGE
                          ]
                        }
                      </p>
                      <Conditional
                        if={key === EXTRA_INFO_TIMINGS_KEY && onTimingsClick}
                      >
                        <button onClick={onTimingsClick}>
                          {String(val)}
                          <ChevronRightIcon
                            strokeColor={COLORS.GRAY.G2}
                            fillColor={COLORS.GRAY.G2}
                          />
                        </button>
                      </Conditional>
                      <Conditional if={key !== EXTRA_INFO_TIMINGS_KEY}>
                        <p>{String(val)}</p>
                      </Conditional>
                    </div>
                  )
              )}
            </InfoContainer>
          </Conditional>
        </ContentContainer>

        <Conditional if={!isMobile}>
          <MediaContainer
            $isNonPoi={showNonPoiDesign}
            $hideOnMobile={displayParentChip || hasExtraInfo}
          >
            <Conditional if={!bannerVideo || showThumbnailInBanner}>
              <Image
                url={bannerImage?.url}
                width={WIDTH}
                height={HEIGHT}
                imageId={'banner-image'}
                alt={bannerImage?.alt}
                priority
                fill
                loadHigherQualityImage={true}
              />
            </Conditional>
            <Conditional if={!showThumbnailInBanner && bannerVideo}>
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
      <Conditional if={isHOHORevamp}>
        <TrustBooster isHOHORevamp={isHOHORevamp} isMobile={isMobile} />
      </Conditional>
    </BannerSection>
  );
};

export default StaticBanner;
