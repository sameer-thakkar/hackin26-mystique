import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import router from 'next/router';
import { useRecoilValue } from 'recoil';
import { Itinerary } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import { BottomSheet } from 'components/common/DraggableBottomSheet';
import ItinerarySwipeSheet from 'components/common/Itinerary/ItinerarySwipeSheet';
import { ItineraryViewMode } from 'components/common/Itinerary/ItineraryViewSwitch/interface';
import { TTabListItemProps } from 'UI/Tabs/interface';
import { useItinerary } from 'contexts/ItineraryContext';
import { useProductCard } from 'contexts/productCardContext';
import { trackEvent } from 'utils/analytics';
import { appAtom } from 'store/atoms/app';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { SWIPESHEET_STATES } from 'const/productCard';
import DropdownContent from './components/dropdownContent';
import PricingBar from './components/pricingBar';

const MWebMapView = dynamic(
  () =>
    import(
      /* webpackChunkName: "MWebMapView" */ 'components/common/Itinerary/MapView/MWebMapView'
    )
);
const DrawerWrapper = (props: any) => {
  const {
    drawerState,
    setDrawerState,
    discountText,
    setShowPricingBar,
    showPricingBar,
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
    isModifiedPopup,
    reviewsDetails,
    topReviews,
    showCustomProductCardCTA,
  } = props;

  const [activeItinerary, setActiveItinerary] = useState<Itinerary>(
    tgidItineraryData?.[0]
  );
  const {
    setActiveItineraryStopId,
    setActiveStopIndex,
    isItineraryDetailsSwipeSheetOpen,
    setIsItineraryDetailsSwipeSheetOpen,
    itineraryViewMode,
    setItineraryViewMode,
  } = useItinerary();
  const { isMobile } = useRecoilValue(appAtom);
  const isDesktop = !isMobile;

  useEffect(() => {
    if (drawerState === SWIPESHEET_STATES.OPEN) {
      setTimeout(() => {
        setShowPricingBar(true);
      }, 300);
    }
  }, [drawerState]);

  const handleCloseItinerarySwipeSheet = () => {
    setActiveItineraryStopId(null);
    setActiveStopIndex(null);
    setIsItineraryDetailsSwipeSheetOpen(false);
  };

  const handleActiveItineraryTabChange = (tab: TTabListItemProps) => {
    const activeItineraryData = (
      tgidItineraryData as Array<Itinerary | null>
    ).reduce(
      (acc, item) => (item?.id.toString() === tab.id ? item : acc),
      null
    );
    if (activeItineraryData) {
      setActiveItinerary(activeItineraryData);
    }
  };

  const handleItineraryMapBottomSheetClose = () => {
    setItineraryViewMode(ItineraryViewMode.TIMELINE);
    trackItineraryViewModeChange(ItineraryViewMode.TIMELINE);
  };

  const trackItineraryViewModeChange = (activeView: ItineraryViewMode) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.ITINERARY.ITINERARY_TOGGLE_CLICKED,
      [ANALYTICS_PROPERTIES.ITINERARY_VIEW]: activeView,
    });
  };

  return (
    <>
      <Conditional
        if={
          showPricingBar &&
          !isItineraryDetailsSwipeSheetOpen &&
          itineraryViewMode === ItineraryViewMode.TIMELINE
        }
      >
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
        />
      </Conditional>
      <Conditional if={drawerState !== SWIPESHEET_STATES.HIDDEN}>
        <BottomSheet
          snapHeight={'5rem'}
          onCloseInit={() => {
            setShowPricingBar(false);
          }}
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
            lang={lang}
            onActiveItineraryTabChange={handleActiveItineraryTabChange}
            preventTouchEvents={isItineraryDetailsSwipeSheetOpen}
            isModifiedPopup={isModifiedPopup}
            reviewsDetails={reviewsDetails}
            topReviews={topReviews}
          >
            {children}
          </DropdownContent>
        </BottomSheet>
      </Conditional>
      <Conditional if={activeItinerary}>
        <ItinerarySwipeSheet
          visible={isItineraryDetailsSwipeSheetOpen}
          currentLanguage={lang}
          itinerary={activeItinerary}
          onCloseSwipeSheet={handleCloseItinerarySwipeSheet}
        />
      </Conditional>
      <Conditional
        if={
          activeItinerary &&
          itineraryViewMode === ItineraryViewMode.MAP &&
          !isDesktop
        }
      >
        <MWebMapView
          itinerary={activeItinerary}
          onCloseInitBottomSheet={handleItineraryMapBottomSheetClose}
        />
      </Conditional>
    </>
  );
};

export default DrawerWrapper;
