import { scroller } from 'react-scroll';
import Conditional from 'components/common/Conditional';
import { Sidecard } from 'components/NewsPage/components/Sidebar';
import { getVerticalImageUrl } from 'components/NewsPage/utils';
import { TMainContentProps } from 'components/ReviewsPage/components/MainContent/interface';
import {
  Aside,
  Section,
  Wrapper,
} from 'components/ReviewsPage/components/MainContent/styles';
import ReviewCount from 'components/ReviewsPage/components/ReviewCount';
import Sidebar from 'components/ReviewsPage/components/Sidebar';
import {
  getSlicesUsedInReviewsPage,
  getTrackingObject,
} from 'components/ReviewsPage/utils';
import DetailedReview from 'components/slices/DetailedReview';
import ReviewChips from 'components/slices/ReviewChips';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CTA_TYPE,
  REVIEW_CHIPS_BACKGROUND_ILLUSTRATION,
  REVIEWS_PAGE_SECTIONS,
} from 'const/index';
import ReviewsSection from '../ReviewsSection';

const MainContent: React.FC<React.PropsWithChildren<TMainContentProps>> = ({
  tgidData,
  isMobile,
  showPageData,
  mediaData,
  reviewsData,
  contentFramework,
}) => {
  const { reviewsDetails, media, id } = tgidData ?? {};
  const { averageRating, ratingsCount, reviewsCount, ratingsSplit } =
    reviewsDetails ?? {};
  const {
    detailedReviewSlice,
    reviewChipsSlice,
    criticsReviewSlice,
    contributorsReviewSlice,
  } = getSlicesUsedInReviewsPage(contentFramework);

  const {
    primary: detailedReviewPrimary,
    items: detailedReviewRepeatableContent,
  } = detailedReviewSlice;
  const { primary: reviewChipsPrimary, items: reviewChipsRepeatableContent } =
    reviewChipsSlice;
  const { items: criticsReviewsRepeatableContent } = criticsReviewSlice;
  const { primary: contributorsReviewPrimary } = contributorsReviewSlice;

  const { heading: detailedReviewHeading } = detailedReviewPrimary ?? {};
  const {
    heading: contributorsReviewHeading,
    redirection_link: redirectionLink,
    content: contributorsReviewContent,
    author_name: contributorsReviewAuthorName,
    author_image: contributorsReviewAuthorImage,
    date,
  } = contributorsReviewPrimary ?? {};
  const { description: detailedReviewDescription } =
    detailedReviewPrimary ?? {};
  const { heading: reviewChipsheading } = reviewChipsPrimary ?? {};
  const sidebarShowPageData = showPageData[0];
  const verticalImageUrl = getVerticalImageUrl(
    mediaData?.resourceEntityMedias,
    id
  );
  const productImageUrl =
    media?.productImages.length > 1
      ? media.productImages[1]?.url
      : REVIEW_CHIPS_BACKGROUND_ILLUSTRATION;

  const handleReadMoreCtaClick = (section: string) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.REVIEWS_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.READ_MORE,
      [ANALYTICS_PROPERTIES.SECTION]: section,
    });
  };

  const handleReviewCountClick = () => {
    scroller.scrollTo('reviews-section', {
      duration: 500,
      offset: -90,
      smooth: 'easeInQuad',
    });
    trackEvent({
      eventName: ANALYTICS_EVENTS.RATING_WIDGET_CLICKED,
      [ANALYTICS_PROPERTIES.NUMBER_OF_RATINGS]: ratingsCount,
      [ANALYTICS_PROPERTIES.AVERAGE_RATING]: averageRating,
    });
  };

  const detailedReviewTrackingObject = getTrackingObject(
    REVIEWS_PAGE_SECTIONS.DETAILED_REVIEW
  );

  return (
    <Wrapper>
      <Conditional if={!isMobile}>
        <Section>
          <ReviewCount
            averageRating={averageRating}
            ratingsCount={ratingsCount}
            reviewsCount={reviewsCount}
            ratingsSplit={ratingsSplit}
            isMobile={isMobile}
            handleReviewCountClick={handleReviewCountClick}
          />
          <DetailedReview
            heading={detailedReviewHeading}
            description={detailedReviewDescription}
            repeatableContent={detailedReviewRepeatableContent}
            handleReadMoreClick={handleReadMoreCtaClick}
            trackingObject={detailedReviewTrackingObject}
          />
          <ReviewsSection
            criticsReviewsRepeatableContent={criticsReviewsRepeatableContent}
            reviewsData={reviewsData}
            tgidData={tgidData}
            isMobile={isMobile}
            contributorsReviewHeading={contributorsReviewHeading}
            contributorsReviewContent={contributorsReviewContent}
            redirectionLink={redirectionLink}
            contributorsReviewAuthorImage={contributorsReviewAuthorImage}
            contributorsReviewAuthorName={contributorsReviewAuthorName}
            date={date}
            handleReadMoreCtaClick={handleReadMoreCtaClick}
          />
        </Section>
        <Aside>
          <Sidebar
            experienceData={tgidData}
            verticalImageUrl={verticalImageUrl}
            showPageUid={sidebarShowPageData?.uid}
            reviewChipsHeading={reviewChipsheading}
            reviewChipsRepeatableContent={reviewChipsRepeatableContent}
            productImageUrl={productImageUrl}
          />
        </Aside>
      </Conditional>
      <Conditional if={isMobile}>
        <ReviewCount
          averageRating={averageRating}
          ratingsCount={ratingsCount}
          reviewsCount={reviewsCount}
          ratingsSplit={ratingsSplit}
          isMobile={isMobile}
          handleReviewCountClick={handleReviewCountClick}
        />
        <ReviewChips
          backgroundImage={productImageUrl}
          heading={reviewChipsheading}
          repeatableContent={reviewChipsRepeatableContent}
        />
        <DetailedReview
          heading={detailedReviewHeading}
          description={detailedReviewDescription}
          repeatableContent={detailedReviewRepeatableContent}
          handleReadMoreClick={handleReadMoreCtaClick}
          trackingObject={detailedReviewTrackingObject}
        />
        <Sidecard
          showData={tgidData}
          showPageUid={sidebarShowPageData?.uid}
          verticalPoster={verticalImageUrl}
          showBookNowHeading={false}
        />
        <ReviewsSection
          criticsReviewsRepeatableContent={criticsReviewsRepeatableContent}
          reviewsData={reviewsData}
          tgidData={tgidData}
          isMobile={isMobile}
          contributorsReviewHeading={contributorsReviewHeading}
          contributorsReviewContent={contributorsReviewContent}
          redirectionLink={redirectionLink}
          contributorsReviewAuthorImage={contributorsReviewAuthorImage}
          contributorsReviewAuthorName={contributorsReviewAuthorName}
          date={date}
          handleReadMoreCtaClick={handleReadMoreCtaClick}
        />
      </Conditional>
    </Wrapper>
  );
};

export default MainContent;
