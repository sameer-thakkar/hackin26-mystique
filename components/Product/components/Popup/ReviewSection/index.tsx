import { useRef } from 'react';
import Conditional from 'components/common/Conditional';
import ReviewsSection from 'components/MicrositeV2/ShowPageV2/ReviewSection';
import { TImageGalleryController } from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/interface';
import useFetchReviewMedia from 'hooks/useFetchReviewMedia';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import TrustOverlay from './TrustElements/Overlay';
import { MAX_REVIEW_COUNT } from './constants';
import Gallery from './Gallery';
import {
  StyledReviewSectionContainer,
  StyledReviewSectionTitle,
} from './styles';
import type { TReviewSectionProps } from './types';

const ReviewSection = ({
  reviewsDetails,
  tgid,
  topReviews = [],
  showTitle = true,
  isBot = false,
}: TReviewSectionProps) => {
  const {
    reviewMedias = [],
    fetchNext: fetchNextReviewMedia,
    canFetch: canFetchReviewMedia,
    getAssociatedReview,
    getReviewMediaGlobalLocation,
  } = useFetchReviewMedia(tgid);

  const imageGalleryController = useRef<TImageGalleryController>(null);

  return (
    <>
      <Conditional if={showTitle}>
        <StyledReviewSectionTitle
          data-review-section-title="true"
          id="review-section-title"
        >
          {strings.SHOW_PAGE_V2.CONTENT_TABS.Reviews}
        </StyledReviewSectionTitle>
      </Conditional>
      <TrustOverlay isDesktop />
      <Gallery
        images={reviewMedias.map((reviewMedia) => ({
          ...reviewMedia,
          alt: String(tgid),
        }))}
        infiniteList={
          canFetchReviewMedia
            ? {
                fetchNext: fetchNextReviewMedia,
                canFetch: canFetchReviewMedia,
              }
            : undefined
        }
        getAssociatedReview={getAssociatedReview}
        controller={imageGalleryController}
      />
      <StyledReviewSectionContainer>
        <ReviewsSection
          reviewsDetails={reviewsDetails}
          tgid={tgid}
          initialReviews={topReviews}
          numberOfReviewsToFetchAtOnce={isBot ? MAX_REVIEW_COUNT : 5}
          maximumNumberOfReviews={isBot ? MAX_REVIEW_COUNT : null}
          showFetchMoreButton
          controlledSwiperParams={{
            slidesPerView: 5,
            spaceBetween: 16,
          }}
          showSkeleton
          showReviews={topReviews && topReviews.length > 0}
          onImageClick={(reviewId, localIndex) => {
            const globalIndex = getReviewMediaGlobalLocation?.(
              Number(reviewId),
              localIndex
            );
            imageGalleryController?.current?.open(globalIndex);
            if (typeof globalIndex !== 'undefined')
              trackEvent({
                eventName: ANALYTICS_EVENTS.GUEST_SNAPSHOT_CLICKED,
                [ANALYTICS_PROPERTIES.RANKING]: localIndex + 1,
                [ANALYTICS_PROPERTIES.POSITION]: 'Reviews Section',
              });
          }}
          snapshotSectionProps={{
            reviewMedias,
            onImageClick: ({ globalIndex }) => {
              imageGalleryController?.current?.open(globalIndex);
            },
            infiniteList: canFetchReviewMedia
              ? {
                  fetchNext: fetchNextReviewMedia,
                  canFetch: canFetchReviewMedia,
                }
              : undefined,
          }}
          numberOfReviewsToShow={isBot ? MAX_REVIEW_COUNT : 5}
          showCountriesSection
        />
      </StyledReviewSectionContainer>
    </>
  );
};

export default ReviewSection;
