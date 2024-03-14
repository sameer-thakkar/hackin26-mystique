import React from 'react';
import router from 'next/router';
import Conditional from 'components/common/Conditional';
import { BottomSheet } from 'components/common/DraggableBottomSheet';
import { useProductCard } from 'contexts/productCardContext';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS } from 'const/index';
import { SWIPESHEET_STATES } from 'const/productCard';
import DropdownContent from './components/dropdownContent';
import PricingBar from './components/pricingBar';

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
  } = props;

  return (
    <>
      <Conditional if={showPricingBar}>
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
        >
          <DropdownContent
            finalHighlights={finalHighlights}
            images={images}
            isBannerCard={isBannerCard}
            bannerVideo={bannerVideo}
            mediaCarouselImageHeight={mediaCarouselImageHeight}
            mediaCarouselImageWidth={mediaCarouselImageWidth}
            isFirstProduct={isFirstProduct}
            tgid={tgid}
            shouldCropImage={shouldCropImage}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            hasOffers={showScratchPrice && !!discountText.length}
          >
            {children}
          </DropdownContent>
        </BottomSheet>
      </Conditional>
    </>
  );
};

export default DrawerWrapper;
