import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { asText } from '@prismicio/helpers';
import parse from 'url-parse';
import Conditional from 'components/common/Conditional';
import { FILTERED_HIGHLIGHTS } from 'components/HOHO/constants';
import { getObject } from 'components/HOHO/utils';
import ImageGallery from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery';
import { TImageGalleryController } from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/interface';
import { TController } from 'components/NewVerticals/RouteDetails/Popup/interface';
import RoutesCTA from 'components/NewVerticals/RoutesCTA';
import { BookNowCta } from 'components/Product/components/BookNowCta';
import { NextAvailable } from 'components/Product/components/NextAvailable';
import { ProductDescriptors } from 'components/Product/components/ProductDescriptors';
import Ratings from 'components/Product/components/Ratings';
import { TourTitle } from 'components/Product/components/TourTitle';
import {
  CategoryAndRatingContainer,
  CTABlock,
  CTAContainer,
  PriceContainer,
  ProductHeader,
  StyledProductCard,
  ViewMoreButton,
} from 'components/Product/styles';
import HorizontalLine from 'components/slices/HorizontalLine';
import MediaCarousel from 'UI/MediaCarousel';
import PriceBlock from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';
import { createBookingURL } from 'utils';
import { getProductCommonProperties, trackEvent } from 'utils/analytics';
import {
  extractTabsFromHighlights,
  filterFromHighlights,
  getProductCardLayout,
} from 'utils/productUtils';
import { currencyAtom } from 'store/atoms/currency';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  MEALS_SUBCAT_IDS,
  PRODUCT_CARD_REVAMP,
  THEMES,
} from 'const/index';
import { strings } from 'const/strings';
import ChevronRight from 'assets/chevronRight';
import InfoIconTicketCard from 'assets/infoIconTicketCard';
import HorizontalDescriptors from './HorizontalDescriptors';
import { getCustomDescriptors } from './utils';

const NewVerticalsProductCard = (props: any) => {
  const {
    tgid,
    currentLanguage,
    defaultOpen,
    title,
    descriptors,
    highlights: tempHighlights = [],
    tourPrices,
    uid,
    hasOffer: isOfferEnabled,
    offerId,
    scorpioData,
    host,
    showEarliestAvailability,
    earliestAvailability = {},
    ctaUrlSuffix,
    isScratchPriceEnabled,
    booster,
    boosterTag,
    isMobile,
    instantCheckout,
    showNextAvailable = false,
    isTicketCard = false,
    indexPosition,
    pageType,
    finalPromoCode,
    appliedPromo,
    flowType,
    bannerVideo,
    isV3Design,
    isCollectionMB,
    isSpecialGuidedTour,
    isNonPoi = false,
    isModifiedProductCard = false,
    isPoiMwebCard = false,
    reviewsDetails,
    primaryCategory,
    primaryCollection,
    primarySubCategory,
    onClick,
    onMoreDetailsClick,
    onRatingsCountClick,
    isHOHORevamp,
    isCruisesRevamp,
    itineraryInfo,
    getMoreDetailsButton,
    setCustomDescriptors,
    shouldRunHohoRevampExperiment,
  } = props;

  const {
    mbTheme,
    biLink,
    bookSubdomain,
    isDev,
    redirectToHeadoutBookingFlow,
    lang,
  } = useContext(MBContext);

  const priceBlockWrapperRef = useRef<HTMLDivElement>();
  const productRef = useRef<HTMLDivElement>(null);
  const imgGalleryController = useRef<TImageGalleryController>();
  const itineraryPopupController = useRef<TController>();
  const currency = useRecoilValue(currencyAtom);
  const [isContentOpen] = useState(defaultOpen);
  const [isItineraryDrawerOpen, setIsItineraryDrawerOpen] = useState(false);
  const [isDescriptorClick, setIsDescriptorClick] = useState(false);

  const pageMetaData = useRecoilValue(metaAtom);

  const isOpenDated = scorpioData?.allVariantOpenDated;
  const defaultDescriptors = descriptors || scorpioData.descriptors;

  const {
    combo: isCombo,
    minDuration,
    maxDuration,
    images,
    experienceItineraryIds,
  } = scorpioData || {};
  const tgidItineraryData = itineraryInfo?.data?.[0];
  const {
    type: itineraryType,
    details: itineraryDetails,
    sections: itinerarySections,
  } = tgidItineraryData ?? [];

  const cardTitle = title || scorpioData.title;
  const { promo_code } = finalPromoCode || {};
  const isFirstProduct = indexPosition === 0;
  const isBannerCard =
    isFirstProduct && isCollectionMB && bannerVideo && !isNonPoi;

  let url = host || window.location.host;
  const hostName = !isDev ? url : parse(uid, true).pathname;
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

  const { tabs } = isMobile
    ? { tabs: [] }
    : extractTabsFromHighlights(finalHighlights);

  const { detailsObjects = {} } = getObject(
    scorpioData.highlights,
    FILTERED_HIGHLIGHTS()
  );

  const descriptorsList = getCustomDescriptors({
    isHOHO: isHOHORevamp,
    isCruises: isCruisesRevamp,
    descriptorsObject: detailsObjects,
    itineraryDetails,
    itinerarySections,
    defaultDescriptors,
    itineraryPopupController,
    setIsItineraryDrawerOpen,
    setIsDescriptorClick,
    itineraryType,
    tgid,
  });

  useEffect(() => {
    setCustomDescriptors(descriptorsList);
  }, []);

  const { listingPrice } = tourPrices[tgid];
  const { query } = useRouter();
  if (!listingPrice) return null;
  const finalListingPrice = listingPrice;
  const { tourId } = finalListingPrice || {};
  const hasV1Booster = booster && asText(booster as []).trim().length > 0;
  const hasOffer = isOfferEnabled && offerId;

  const layout = ({ isContentExpanded }: { isContentExpanded?: boolean }) =>
    getProductCardLayout({
      hasOffer,
      hasV1Booster,
      mbTheme,
      isTicketCard: isTicketCard,
      hasPromoCode: promo_code,
      isOpenDated,
      showAvailabilityInTitle: false,
      showGuidesLabel: isSpecialGuidedTour && isMobile,
      showAvailabilityInLanguagesText:
        !isContentExpanded && isSpecialGuidedTour && isMobile,
      isModifiedProductCard: true,
      isPoiMwebCard: true,
    });

  const productBookingUrl = createBookingURL({
    nakedDomain: bookingUrl,
    lang: currentLanguage,
    currency: finalListingPrice?.currencyCode || currency,
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
    isHOHORevamp: shouldRunHohoRevampExperiment ? isHOHORevamp : undefined,
  });

  const onMoreInfoClick = () => {
    if (isMobile) onMoreDetailsClick();
    else onClick();
  };

  const sendBookNowEvent = (
    placement?: string,
    isMobile?: boolean,
    descriptors?: Record<string, any>
  ) => {
    const placementProperty = placement
      ? {
          [ANALYTICS_PROPERTIES.PLACEMENT]: placement,
        }
      : {};

    const { finalPrice, originalPrice, currencyCode } = listingPrice ?? {};

    trackEvent({
      eventName: !isMobile
        ? ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED
        : ANALYTICS_EVENTS.EXPERIENCE_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
      [ANALYTICS_PROPERTIES.DISCOUNT]:
        isScratchPriceEnabled && originalPrice > finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currencyCode,
      [ANALYTICS_PROPERTIES.POSITION]: indexPosition + 1,
      ...placementProperty,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
      [ANALYTICS_PROPERTIES.EXPERIENCE_DATE]: null,
      [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: title,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.CITY]: (pageMetaData?.city as any)?.cityCode,
      [ANALYTICS_PROPERTIES.DESCRIPTORS]: descriptors,
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
        reviewsDetails,
      }),
    });
  };

  const getNewVerticalsProductCard = (
    expandContent: any,
    isLoading?: boolean,
    isAsideBarOverlay = false,
    isPopup = false
  ) => {
    const mediaCarouselImageWidth = isMobile ? 319 : 330;
    const mediaCarouselImageHeight = isMobile ? 199 : 210;

    return (
      <>
        <StyledProductCard
          layout={layout({ isContentExpanded: expandContent })}
          isContentExpanded={expandContent}
          isTicketCard={isTicketCard}
          isMobile={isMobile}
          $isBannerCard={isBannerCard && !isSpecialGuidedTour && !isLoading}
          isV3Design={isV3Design}
          $isSwipeSheetOpen={expandContent}
          className="product-card"
          collapsed={(!expandContent && !isTicketCard) || isModifiedProductCard}
          defaultOpen={defaultOpen}
          $isModifiedProductCard={isModifiedProductCard || isAsideBarOverlay}
          $isPoiMwebCard={isPoiMwebCard}
          $isPopup={isPopup}
          ref={productRef}
          $isNewVerticalsProductCard={true}
          $isCruise={isCruisesRevamp}
          onClick={() => {
            isHOHORevamp && isMobile
              ? (window.open(productBookingUrl, '_self', 'noopener'),
                sendBookNowEvent(
                  PRODUCT_CARD_REVAMP.PLACEMENT.PRODUCT_CARD,
                  true,
                  descriptorsList
                ))
              : null;
          }}
        >
          <Conditional if={!isTicketCard && images?.length && !isPopup}>
            <div
              className="card-img"
              onClick={() => {
                imgGalleryController.current?.open();
              }}
              role="button"
              tabIndex={0}
            >
              <Conditional if={!isLoading}>
                <MediaCarousel
                  imageList={images?.slice(0, 10)}
                  videoUrl={isMobile && isBannerCard ? bannerVideo : null}
                  imageId="card-img"
                  backgroundColor={COLORS.BRAND.WHITE}
                  imageWidth={mediaCarouselImageWidth}
                  imageHeight={mediaCarouselImageHeight}
                  isFirstProduct={isFirstProduct}
                  tgid={tgid}
                  isMobile={isMobile}
                  shouldCrop={false}
                  showOverlay
                  showPagination={false}
                  showTimedPaginator={true}
                  isTimed={false}
                  hideGrabCursor={true}
                />
              </Conditional>
              <Conditional if={experienceItineraryIds?.length}>
                <RoutesCTA
                  tourGroupName={cardTitle}
                  tgid={tgid}
                  listingPrice={finalListingPrice}
                  bookingUrl={productBookingUrl}
                  isMobile={isMobile}
                  ranking={indexPosition + 1}
                  popupController={itineraryPopupController}
                  isDrawerOpen={isItineraryDrawerOpen}
                  setIsDrawerOpen={setIsItineraryDrawerOpen}
                  isDescriptorClick={isDescriptorClick}
                  setIsDescriptorClick={setIsDescriptorClick}
                  {...(isCruisesRevamp && {
                    cruiseData: {
                      isCruise: isCruisesRevamp,
                      isMealCruise: MEALS_SUBCAT_IDS?.includes(
                        primarySubCategory?.id
                      ),
                      cruisesItineraryData: itineraryInfo?.data,
                    },
                  })}
                />
              </Conditional>
              <Conditional if={isLoading}>
                <Skeleton height="100%" borderRadius={8} />
              </Conditional>
            </div>
          </Conditional>

          <ProductHeader>
            <CategoryAndRatingContainer>
              <Ratings
                reviewsDetails={reviewsDetails}
                onRatingsCountClick={
                  !isMobile ? () => onRatingsCountClick({ isPopup }) : undefined
                }
              />
              <Conditional if={isHOHORevamp && isMobile}>
                <button
                  className="info-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoreInfoClick();
                  }}
                >
                  <InfoIconTicketCard height={16} width={16} />
                </button>
              </Conditional>
            </CategoryAndRatingContainer>
            <TourTitle
              boosterTag={boosterTag}
              cardTitle={cardTitle}
              hasBorderedTitle={!hasOffer && !hasV1Booster}
              isContentOpen={isContentOpen}
              isLoading={isLoading}
              isMobile={isMobile}
              isOpenDated={isOpenDated}
              isTicketCard={isTicketCard}
              mbTheme={mbTheme}
              pageType={pageType}
              showAvailability={false}
              tabs={tabs}
              earliestAvailability={earliestAvailability}
              currentLanguage={currentLanguage}
              showInfoIcon={false}
              onClick={
                !isHOHORevamp && !isMobile
                  ? () => null
                  : () => window.open(productBookingUrl, '_self', 'noopener')
              }
            />
            <Conditional if={isCruisesRevamp}>
              <HorizontalDescriptors
                minDuration={minDuration}
                maxDuration={maxDuration}
                lang={currentLanguage}
                isMobile={isMobile}
                descriptorArray={descriptors}
              />
            </Conditional>
            <Conditional if={!isPopup}>
              <CTAContainer pageType={pageType}>
                <PriceContainer pageType={pageType}>
                  <PriceBlock
                    isMobile={isMobile}
                    isLoading={isLoading}
                    isSportsExperiment={false}
                    showScratchPrice={showScratchPrice}
                    listingPrice={finalListingPrice}
                    lang={currentLanguage}
                    showSavings
                    id={tgid}
                    prefix
                    key={'price-block'}
                    wrapperRef={priceBlockWrapperRef}
                    newDiscountTagDesignProps={true}
                  />
                </PriceContainer>
                <Conditional if={!isLoading && (!isMobile || !isHOHORevamp)}>
                  <CTABlock
                    isSticky={expandContent}
                    shouldOffset={
                      earliestAvailability && mbTheme === THEMES.MIN_BLUE
                    }
                    isTicketCard={isTicketCard}
                  >
                    <Conditional if={!isCombo}>
                      <a
                        target={isMobile ? '_self' : '_blank'}
                        href={productBookingUrl}
                      >
                        <BookNowCta
                          clickHandler={() => {
                            sendBookNowEvent(
                              PRODUCT_CARD_REVAMP.PLACEMENT.PRODUCT_CARD,
                              false,
                              descriptorsList
                            );
                          }}
                          isMobile={isMobile}
                          mbTheme={mbTheme}
                          ctaText={strings.CHECK_AVAIL}
                        />
                      </a>
                    </Conditional>
                  </CTABlock>
                  <Conditional if={showNextAvailable}>
                    <NextAvailable
                      showSkeleton={
                        !showEarliestAvailability &&
                        !earliestAvailability &&
                        !earliestAvailability?.startDate
                      }
                      earliestAvailability={earliestAvailability}
                      currentLanguage={currentLanguage}
                      showTime={isCruisesRevamp}
                    />
                  </Conditional>
                </Conditional>
              </CTAContainer>
            </Conditional>
          </ProductHeader>
          <Conditional if={!isMobile && !isAsideBarOverlay && !isPopup}>
            <HorizontalLine colorProp={COLORS.CANDY.LIGHT_TONE_1} />
          </Conditional>
          <ProductDescriptors
            isLoading={isLoading}
            customDescriptors={descriptorsList}
            allowClick={true}
            pageType={pageType}
            minDuration={minDuration}
            maxDuration={maxDuration}
            lang={currentLanguage}
            isCombo={isCombo}
            isGpMotorTicketsMb={false}
            showLanguages={(!isMobile || expandContent) && isSpecialGuidedTour}
            uid={uid}
            horizontal={isPoiMwebCard}
            showIcons={!isPoiMwebCard}
            cancellationPolicy={'cancellationPolicy'}
            isMobile={isMobile}
            showGuidedTourDescriptor={false}
          />
          <Conditional if={!isMobile}>
            <ViewMoreButton $noMargin={true} onClick={onMoreInfoClick}>
              {strings.MORE_DETAILS}
              <ChevronRight
                fillColor={COLORS.TEXT.CANDY_1}
                height={12}
                width={12}
                strokeWidth={1.5}
              />
            </ViewMoreButton>
          </Conditional>
          <Conditional if={!isHOHORevamp && isMobile}>
            {getMoreDetailsButton()}
          </Conditional>
          <Conditional if={images?.length}>
            <ImageGallery
              imageUploads={images.map(({ url, altText }: Media) => ({
                url,
                alt: altText,
              }))}
              showMoreButton={false}
              hideFirstImageInOverlay={false}
              controlBodyOverflow={true}
              navigation="cross"
              controller={imgGalleryController}
            />
          </Conditional>
        </StyledProductCard>
      </>
    );
  };

  return <>{getNewVerticalsProductCard(false, false)}</>;
};

export default NewVerticalsProductCard;
