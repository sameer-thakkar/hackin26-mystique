import { MutableRefObject, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import router from 'next/router';
import { Button, Icon, Text } from '@headout/eevee';
import ArrowLeft from '@headout/onix/web/ui/arrow/stroke/ArrowLeft';
import { cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import { BottomSheet } from 'components/common/DraggableBottomSheet';
import ImageGallery from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery';
import { TImageGalleryController } from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/interface';
import { TSnapshotSectionProps } from 'components/Product/components/Popup/ReviewSection/Snapshots/interface';
import TrustOverlay from 'components/Product/components/Popup/ReviewSection/TrustElements/Overlay';
import { useProductCard } from 'contexts/productCardContext';
import useFetchReviewMedia from 'hooks/useFetchReviewMedia';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  IMAGE_GALLERY_DIMENSIONS,
} from 'const/index';
import { SWIPESHEET_STATES } from 'const/productCard';
import { strings } from 'const/strings';
import DropdownContent from './components/dropdownContent';
import PricingBar from './components/pricingBar';
import { ImageGalleryContainer } from './components/styles';
import { swipesheetRecipe } from './styles';

const ReviewSection = dynamic(
  () =>
    import(
      /* webpackChunkName: "ReviewSectionMobile" */ 'components/Product/components/Popup/ReviewSection/mobile'
    ),
  { ssr: false }
);

const DrawerWrapper = (props: any) => {
  const {
    drawerState,
    setDrawerState,
    discountText,
    setShowPricingBar,
    showPricingBar,
    showingAllReviewsBottomSheet,
    setShowingAllReviewsBottomSheet,
  } = useProductCard();

  const {
    showScratchPrice,
    listingPrice,
    lang,
    isCombo,
    mbTheme,
    productBookingUrl,
    sendBookNowEvent,
    handleShowComboPopup,
    tgid,
    rank,
    isV3Design,
    isSportsExperiment,
    isGpMotorTicketsMb,
    isSportsSubCategory,
    finalHighlights,
    images,
    isBannerCard,
    bannerVideo,
    mediaCarouselImageWidth,
    mediaCarouselImageHeight,
    isFirstProduct,
    shouldCropImage,
    activeTab,
    setActiveTab,
    children,
    trackDrawerOpen,
    showThumbnailInBanner,
    tgidItineraryData,
    showItinerary,
    isModifiedPopup,
    isModifiedCombo,
    showSightsCoveredItineraryLayout,
    reviewsDetails,
    topReviews,
    showCustomProductCardCTA,
    showCustomProductCardEnglishCTA,
    pinnedReviews,
    itineraryAdditionalTrackingProperties,
    showPinnedReviews,
  } = props;

  const {
    reviewMedias = [],
    fetchNext: fetchNextReviewMedia,
    canFetch: canFetchReviewMedia,
    getAssociatedReview,
    getReviewMediaGlobalLocation,
  } = useFetchReviewMedia(tgid);

  const imageGalleryController = useRef<TImageGalleryController>(null);
  const swipesheetImageGalleryController =
    useRef<TImageGalleryController>(null);
  const bottomSheetContainerRef = useRef<HTMLDivElement | null>(null);

  const swipesheetStyles = swipesheetRecipe();

  useEffect(() => {
    if (drawerState === SWIPESHEET_STATES.OPEN) {
      setTimeout(() => {
        setShowPricingBar(true);
      }, 300);
    }
  }, [drawerState]);

  const hidePricingBar = () => {
    setShowPricingBar(false);
  };

  const handleBackButton = () => {
    const overlayElement = bottomSheetContainerRef.current?.querySelector(
      '#bottomsheet-overlay'
    ) as HTMLElement;
    overlayElement?.click();
  };

  const snapshotSectionProps: TSnapshotSectionProps = {
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
    isDesktop: false,
  };

  const generateImageGallery = (
    controller?: MutableRefObject<TImageGalleryController | null>
  ) => (
    <ImageGalleryContainer>
      <ImageGallery
        imageUploads={reviewMedias.map((v) => ({ ...v, alt: tgid }))}
        startFrom={0}
        onHide={(reviewInfo) => {
          setShowPricingBar(true);
          trackEvent({
            eventName: ANALYTICS_EVENTS.STORY_MODE_CLOSED,
            [ANALYTICS_PROPERTIES.RATING]: reviewInfo?.rating,
          });
        }}
        onShow={(reviewInfo) => {
          setShowPricingBar(false);
          trackEvent({
            eventName: ANALYTICS_EVENTS.STORY_MODE_OPENED,
            [ANALYTICS_PROPERTIES.RATING]: reviewInfo?.rating,
          });
        }}
        showMoreButton={false}
        hideFirstImageInOverlay={false}
        controlBodyOverflow={false}
        imageDimensions={{
          ...(typeof getAssociatedReview !== 'function' && {
            spotlight: IMAGE_GALLERY_DIMENSIONS.MOBILE.spotlight,
          }),
          thumbnail: IMAGE_GALLERY_DIMENSIONS.MOBILE.thumbnail,
        }}
        controller={controller}
        infiniteList={{
          fetchNext: fetchNextReviewMedia,
          canFetch: canFetchReviewMedia,
        }}
        getAssociatedReview={getAssociatedReview}
        title={strings.SNAPSHOTS_SECTION_HEADER}
      />
    </ImageGalleryContainer>
  );

  return (
    <>
      <Conditional if={showPricingBar && !showingAllReviewsBottomSheet}>
        <PricingBar
          showScratchPrice={showScratchPrice}
          listingPrice={listingPrice}
          lang={lang}
          isAsideBarOverlay={false}
          isCombo={isCombo}
          mbTheme={mbTheme as any}
          productBookingUrl={productBookingUrl}
          sendBookNowEvent={sendBookNowEvent}
          handleShowComboPopup={handleShowComboPopup}
          tgid={tgid}
          isV3Design={isV3Design}
          isSportsExperiment={isSportsExperiment}
          isGpMotorTicketsMb={isGpMotorTicketsMb}
          isSportsSubCategory={isSportsSubCategory}
          isModifiedCTA={isModifiedPopup}
          showCustomProductCardCTA={showCustomProductCardCTA}
          showCustomProductCardEnglishCTA={showCustomProductCardEnglishCTA}
        />
      </Conditional>
      <Conditional if={drawerState !== SWIPESHEET_STATES.HIDDEN}>
        <BottomSheet
          snapHeight={'5rem'}
          onCloseInit={hidePricingBar}
          onCloseCompletion={(action?: string) => {
            if (!router) return;
            const { selection } = router.query;
            if (selection) {
              const { ['selection']: _, ...restParams } = router.query;
              router.replace(
                {
                  pathname: router.pathname,
                  query: restParams,
                },
                undefined,
                { shallow: true }
              );
            }
            setDrawerState(SWIPESHEET_STATES.HIDDEN);
            trackEvent({
              eventName: ANALYTICS_EVENTS.MORE_DETAILS_SWIPESHEET_CLOSED,
              Action: action,
            });
          }}
          sheetHeight={isModifiedPopup ? '85%' : '100%'}
          roundedBorder={isModifiedPopup}
        >
          {reviewMedias.length > 0 &&
            generateImageGallery(imageGalleryController)}
          <DropdownContent
            finalHighlights={finalHighlights}
            images={images}
            isBannerCard={isBannerCard}
            bannerVideo={showThumbnailInBanner ? null : bannerVideo}
            mediaCarouselImageHeight={mediaCarouselImageHeight}
            mediaCarouselImageWidth={mediaCarouselImageWidth}
            isFirstProduct={isFirstProduct}
            tgid={tgid}
            rank={rank}
            shouldCropImage={shouldCropImage}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            trackDrawerOpen={trackDrawerOpen}
            hasOffers={showScratchPrice && !!discountText.length}
            tgidItineraryData={tgidItineraryData}
            showItinerary={showItinerary}
            lang={lang}
            isModifiedPopup={isModifiedPopup}
            isModifiedCombo={isModifiedCombo}
            showSightsCoveredItineraryLayout={showSightsCoveredItineraryLayout}
            reviewsDetails={reviewsDetails}
            topReviews={topReviews}
            imageGalleryController={imageGalleryController}
            getReviewMediaGlobalLocation={getReviewMediaGlobalLocation}
            snapshotSectionProps={snapshotSectionProps}
            hidePricingBar={hidePricingBar}
            showPricingBar={() => {
              setShowPricingBar(true);
            }}
            showPinnedReviews={showPinnedReviews}
            pinnedReviews={pinnedReviews}
            openAllReviewsBottomSheet={() => {
              setDrawerState(SWIPESHEET_STATES.EXPANDED);
              setShowingAllReviewsBottomSheet(true);
            }}
            itineraryAdditionalTrackingProperties={
              itineraryAdditionalTrackingProperties
            }
          >
            {children}
          </DropdownContent>
        </BottomSheet>
      </Conditional>
      <Conditional
        if={reviewsDetails?.showRatings && showingAllReviewsBottomSheet}
      >
        <div ref={bottomSheetContainerRef} className={swipesheetStyles.root}>
          <BottomSheet
            sheetHeight={'100%'}
            dragLimit={1000}
            roundedBorder={false}
            onCloseCompletion={() => {
              setShowingAllReviewsBottomSheet(false);
            }}
          >
            <div className={swipesheetStyles.container}>
              <div className={swipesheetStyles.heading}>
                <Text textStyle={'heading.small'}>
                  {strings.SHOW_PAGE_V2.CONTENT_TABS.Reviews}
                </Text>
                <Button
                  as="button"
                  btnType="transparent"
                  icon={<Icon svg={ArrowLeft} height={24} width={24} />}
                  iconPosition="leading"
                  onClick={handleBackButton}
                  primaryText=""
                  size="medium"
                  state="default"
                  variant="primary"
                  className={swipesheetStyles.back}
                />
              </div>
              <div
                className={cx(
                  swipesheetStyles.contentWrapper,
                  'review-section-overflow-container'
                )}
                onScroll={(e) => e.stopPropagation()}
              >
                <TrustOverlay />
                <ReviewSection
                  reviewsDetails={reviewsDetails!}
                  topReviews={topReviews}
                  tgid={tgid}
                  showTitle={false}
                  imageGalleryController={swipesheetImageGalleryController}
                  getReviewMediaGlobalLocation={getReviewMediaGlobalLocation}
                  snapshotSectionProps={{
                    ...snapshotSectionProps,
                    onImageClick: ({ globalIndex }) => {
                      swipesheetImageGalleryController?.current?.open(
                        globalIndex
                      );
                    },
                  }}
                  isBot={false}
                />
                {generateImageGallery(swipesheetImageGalleryController)}
              </div>
            </div>
          </BottomSheet>
        </div>
      </Conditional>
    </>
  );
};

export default DrawerWrapper;
