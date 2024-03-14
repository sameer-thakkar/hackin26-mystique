import React, { useContext, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { asText } from '@prismicio/helpers';
import parse from 'url-parse';
import Conditional from 'components/common/Conditional';
import { BoosterType } from 'components/Product/interface';
import {
  Container,
  PRODUCT_CARD_IMAGE_DIMENSIONS,
} from 'components/Product/styles';
import { MBContext } from 'contexts/MBContext';
import { createBookingURL } from 'utils';
import { getProductCommonProperties, trackEvent } from 'utils/analytics';
import { getEarliestAvailableDate } from 'utils/dateUtils';
import { checkIfGpMotorTicketsMB, isF1SportsExperiment } from 'utils/helper';
import {
  checkForBooster,
  extractCancellationPolicyFromHighlights,
  filterFromHighlights,
  getProductCardLayout,
} from 'utils/productUtils';
import { currencyAtom } from 'store/atoms/currency';
import { metaAtom } from 'store/atoms/meta';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CATEGORY_IDS,
  SUBCATEGORY_IDS,
} from 'const/index';
import { strings } from 'const/strings';
import MobileProductCard from './components/mobileProductCard';
import DrawerWrapper from './drawerWrapper';

const ExperimentalProductCard = (props: any) => {
  const {
    tgid,
    position,
    currentLanguage,
    togglePopup,
    defaultOpen,
    title,
    descriptors,
    highlights: tempHighlights = [],
    tourPrices,
    uid,
    hasOffer: isOfferEnabled,
    productOffer,
    offerId,
    scorpioData,
    host,
    earliestAvailability = {},
    showEarliestAvailability,
    ctaUrlSuffix,
    isScratchPriceEnabled,
    booster,
    boosterTag,
    isMobile,
    instantCheckout,
    showNextAvailable,
    isTicketCard = false,
    indexPosition,
    pageType = '',
    finalPromoCode,
    appliedPromo,
    primaryCategory,
    primaryCollection,
    primarySubCategory,
    flowType,
    bannerVideo,
    isV3Design,
    isCollectionMB,
    isGuidedTour,
    isSpecialGuidedTour,
    isProductCardLoading = false,
    isNonPoi = false,
    isModifiedProductCard = false,
    isSmallComboCard = false,
    isPoiMwebCard = false,
    reviewsDetails,
    showBoosters = false,
    sendBookNowEvent,
    handleShowComboPopup,
    isSportsSubCategory,
  } = props;

  const {
    mbTheme,
    biLink,
    bookSubdomain,
    lang,
    isDev,
    redirectToHeadoutBookingFlow,
  } = useContext(MBContext);

  const isSportsExperiment = isF1SportsExperiment(tgid);
  const pageMetaData = useRecoilValue(metaAtom);
  const currency = useRecoilValue(currencyAtom);
  const [isContentOpen] = useState(defaultOpen);
  const [boosterType, setBoosterType] = useState<
    keyof typeof BoosterType | null
  >(null);
  const priceBlockWrapperRef = useRef<HTMLDivElement>();

  const isGpMotorTicketsMb = checkIfGpMotorTicketsMB(uid);

  const isOpenDated = scorpioData?.allVariantOpenDated;

  const showAvailabilityInTitleMobile =
    isSpecialGuidedTour &&
    getEarliestAvailableDate(
      earliestAvailability?.startDate,
      currentLanguage
    ) === strings.TODAY;

  const {
    combo: isCombo,
    minDuration,
    maxDuration,
    images,
  } = scorpioData || {};

  const descriptorsList = descriptors || scorpioData.descriptors;
  const cardTitle = title || scorpioData.title;
  const { promo_code } = finalPromoCode || {};
  const isFirstProduct = indexPosition === 0;
  const isBannerCard =
    isFirstProduct && isCollectionMB && bannerVideo && !isNonPoi;

  const handlePopup = () => {
    togglePopup();
  };

  const trackCancellationPolicyHover = () => {
    const { listingPrice } = tourPrices[tgid] ?? {};
    const { finalPrice, originalPrice, currencyCode } = listingPrice ?? {};

    trackEvent({
      eventName: ANALYTICS_EVENTS.FREE_CANCELLATION_TOOLTIP_VIEWED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
      [ANALYTICS_PROPERTIES.DISCOUNT]:
        isScratchPriceEnabled && originalPrice > finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currencyCode,
      [ANALYTICS_PROPERTIES.POSITION]: position,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
      [ANALYTICS_PROPERTIES.EXPERIENCE_DATE]: null,
      [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: cardTitle,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.CITY]: (pageMetaData?.city as any)?.cityCode,
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
  };

  const boosterHasIcon =
    booster?.filter((i: any) => i.type === 'image').length > 0;
  let url = host || window.location.host;

  const currentHost = !isDev ? url : parse(uid, true).pathname;
  const hostName = currentHost.includes('stage')
    ? currentHost.replace('stage-', '')
    : currentHost;
  let hostSplit = hostName.split('.');
  hostSplit.shift();
  const bookingUrl = hostSplit.join('.');
  const showScratchPrice = isScratchPriceEnabled;
  const finalHighlights = useMemo(
    () =>
      asText(tempHighlights)?.trim()?.length
        ? tempHighlights
        : filterFromHighlights(scorpioData.highlights),
    [tempHighlights, scorpioData.highlights]
  );

  const [activeTab, setActiveTab] = useState<string>(
    finalHighlights[0]?.heading || ''
  );

  const cancellationPolicy = useMemo(
    () => extractCancellationPolicyFromHighlights(finalHighlights),
    [finalHighlights]
  );

  const boosterTypeIfShown = useMemo(() => {
    const boosterInfo = showBoosters && checkForBooster(uid, tgid);
    if (boosterInfo) setBoosterType(boosterInfo);
    return boosterInfo;
  }, [tgid, showBoosters, uid]);

  const { listingPrice } = tourPrices[tgid];
  const { query } = useRouter();
  if (!listingPrice) return null;
  const finalListingPrice = listingPrice;
  const { tourId } = finalListingPrice || {};
  const hasV1Booster = booster && asText(booster as []).trim().length > 0;
  const hasOffer = isOfferEnabled && offerId;
  const hasBorderedTitle = !hasOffer && !hasV1Booster;

  const layout = ({ isContentExpanded }: { isContentExpanded?: boolean }) =>
    getProductCardLayout({
      hasOffer,
      hasV1Booster,
      mbTheme,
      isTicketCard: isTicketCard,
      hasPromoCode: promo_code,
      isOpenDated,
      showAvailabilityInTitle: showAvailabilityInTitleMobile,
      showGuidesLabel: isSpecialGuidedTour && isMobile,
      showAvailabilityInLanguagesText:
        !isContentExpanded && isSpecialGuidedTour && isMobile,
      isModifiedProductCard,
      isPoiMwebCard,
    });

  const productBookingUrl = createBookingURL({
    nakedDomain: bookingUrl,
    lang: currentLanguage,
    currency,
    tgid,
    promoCode: promo_code === appliedPromo ? appliedPromo : null,
    variantId: tourId,
    biLink,
    date:
      instantCheckout && earliestAvailability
        ? earliestAvailability
        : { startDate: query.selectedDate },
    isMobile,
    bookSubdomain,
    redirectToHeadoutBookingFlow,
    ctaSuffix: ctaUrlSuffix,
    flowType,
  });

  const croppingExcludedSubCats = [
    SUBCATEGORY_IDS['Combo'],
    SUBCATEGORY_IDS['City Cards'],
    SUBCATEGORY_IDS['Airport Transfers'],
    SUBCATEGORY_IDS['Public Transport'],
    SUBCATEGORY_IDS['Wifin & SIM Cards'],
    SUBCATEGORY_IDS['Food Passes'],
    SUBCATEGORY_IDS['Ferry Tickets'],
    SUBCATEGORY_IDS['Train Tickets'],
    SUBCATEGORY_IDS['Train Passes'],
    SUBCATEGORY_IDS['Shared Airport Transfers'],
  ];
  const shouldCropImage =
    !isCombo &&
    ![CATEGORY_IDS['Transportation'], CATEGORY_IDS['Travel Services']].includes(
      String(primaryCategory?.id)
    ) &&
    !croppingExcludedSubCats.includes(String(primarySubCategory?.id));

  const mediaCarouselImageWidth = isMobile
    ? isBannerCard
      ? PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.bannerProductWidth
      : isPoiMwebCard
      ? PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.modified.width
      : PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.width
    : isModifiedProductCard
    ? PRODUCT_CARD_IMAGE_DIMENSIONS.DESKTOP.modified.width
    : undefined;

  const mediaCarouselImageHeight =
    isMobile && !isBannerCard && !isSpecialGuidedTour
      ? undefined
      : isModifiedProductCard
      ? PRODUCT_CARD_IMAGE_DIMENSIONS.DESKTOP.modified.height
      : PRODUCT_CARD_IMAGE_DIMENSIONS.DESKTOP.height;

  const getProductCardElements = (
    expandContent: any,
    isDrawer = false,
    isAsideBarOverlay = false
  ) => {
    return (
      <MobileProductCard
        isPoiMwebCard={isPoiMwebCard}
        layout={layout({ isContentExpanded: expandContent })}
        isTicketCard={isTicketCard}
        isBannerCard={isBannerCard}
        isSpecialGuidedTour={isSpecialGuidedTour}
        isV3Design={isV3Design}
        isModifiedProductCard={isModifiedProductCard}
        expandContent={expandContent}
        hasOffer={hasOffer}
        boosterTypeIfShown={boosterTypeIfShown}
        indexPosition={indexPosition}
        images={images}
        isGuidedTour={isGuidedTour}
        bannerVideo={bannerVideo}
        mediaCarouselImageWidth={mediaCarouselImageWidth}
        mediaCarouselImageHeight={mediaCarouselImageHeight}
        tgid={tgid}
        isFirstProduct={isFirstProduct}
        shouldCropImage={shouldCropImage}
        scorpioData={scorpioData}
        primaryCategory={primaryCategory}
        primarySubCategory={primarySubCategory}
        reviewsDetails={reviewsDetails}
        boosterTag={boosterTag}
        cardTitle={cardTitle}
        hasBorderedTitle={hasBorderedTitle}
        isContentOpen={isContentOpen}
        isOpenDated={isOpenDated}
        mbTheme={mbTheme as any}
        pageType={pageType}
        showAvailabilityInTitleMobile={showAvailabilityInTitleMobile}
        earliestAvailability={earliestAvailability}
        currentLanguage={currentLanguage}
        showNextAvailable={showNextAvailable}
        showEarliestAvailability={showEarliestAvailability}
        isAsideBarOverlay={isAsideBarOverlay}
        descriptorsList={descriptorsList}
        isCombo={isCombo}
        isGpMotorTicketsMb={isGpMotorTicketsMb}
        minDuration={minDuration}
        maxDuration={maxDuration}
        boosterHasIcon={boosterHasIcon}
        booster={booster}
        hasV1Booster={hasV1Booster}
        productOffer={productOffer}
        offerId={offerId}
        handlePopup={handlePopup}
        isSportsExperiment={isSportsExperiment}
        showScratchPrice={showScratchPrice}
        finalListingPrice={finalListingPrice}
        priceBlockWrapperRef={priceBlockWrapperRef}
        promo_code={promo_code}
        uid={uid}
        cancellationPolicy={cancellationPolicy}
        trackCancellationPolicyHover={trackCancellationPolicyHover}
        isDrawer={isDrawer}
        listingPrice={listingPrice}
        isSmallComboCard={isSmallComboCard}
        primaryCollection={primaryCollection}
        boosterType={boosterType}
        activeTab={activeTab}
      />
    );
  };

  return (
    <Container
      isV3Design={isV3Design}
      indexPosition={indexPosition}
      isCardVisible={!isV3Design}
      isSmallComboCard={isSmallComboCard}
    >
      <DrawerWrapper
        {...{
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
        }}
      >
        {getProductCardElements(isContentOpen, true, isProductCardLoading)}
      </DrawerWrapper>
      <Conditional if={isV3Design}>
        <div className="indicator-triangle"></div>
      </Conditional>
      {getProductCardElements(isContentOpen, isProductCardLoading)}
    </Container>
  );
};

export default ExperimentalProductCard;
