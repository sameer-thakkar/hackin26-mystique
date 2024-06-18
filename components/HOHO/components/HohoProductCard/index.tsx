import React, { useContext, useMemo, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { asText } from '@prismicio/helpers';
import parse from 'url-parse';
import Conditional from 'components/common/Conditional';
import { FILTERED_HIGHLIGHTS, SECTION_NAMES } from 'components/HOHO/constants';
import { getObject } from 'components/HOHO/utils';
import { BookNowCta } from 'components/Product/components/BookNowCta';
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
} from 'components/Product/styles';
import HorizontalLine from 'components/slices/HorizontalLine';
import MediaCarousel from 'UI/MediaCarousel';
import PriceBlock from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';
import { createBookingURL } from 'utils';
import { getProductCommonProperties, trackEvent } from 'utils/analytics';
import { truncate } from 'utils/helper';
import {
  extractTabsFromHighlights,
  filterFromHighlights,
  getProductCardLayout,
} from 'utils/productUtils';
import { currencyAtom } from 'store/atoms/currency';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import { IGNORED_HEADINGS } from 'const/descriptors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CTA_TYPE,
  PRODUCT_CARD_REVAMP,
  THEMES,
} from 'const/index';
import { strings } from 'const/strings';
import InfoIconTicketCard from 'assets/infoIconTicketCard';
import RoutesCTA from '../RoutesCTA';

const HohoProductCard = (props: any) => {
  const {
    tgid,
    currentLanguage,
    defaultOpen,
    title,
    highlights: tempHighlights = [],
    tourPrices,
    uid,
    hasOffer: isOfferEnabled,
    offerId,
    scorpioData,
    host,
    earliestAvailability = {},
    ctaUrlSuffix,
    isScratchPriceEnabled,
    booster,
    boosterTag,
    isMobile,
    instantCheckout,
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
    isHOHORevamp,
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
  const currency = useRecoilValue(currencyAtom);
  const [isContentOpen] = useState(defaultOpen);
  const pageMetaData = useRecoilValue(metaAtom);

  const isOpenDated = scorpioData?.allVariantOpenDated;

  const {
    combo: isCombo,
    minDuration,
    maxDuration,
    images,
    experienceItineraryIds,
  } = scorpioData || {};

  const cardTitle = title || scorpioData.title;
  const { promo_code } = finalPromoCode || {};
  const isFirstProduct = indexPosition === 0;
  const isBannerCard =
    isFirstProduct && isCollectionMB && bannerVideo && !isNonPoi;

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

  const { tabs } = isMobile
    ? { tabs: [] }
    : extractTabsFromHighlights(finalHighlights);

  const { detailsObjects = {} } = getObject(
    scorpioData.highlights,
    FILTERED_HIGHLIGHTS()
  );
  const timingsDescriptor = detailsObjects[IGNORED_HEADINGS.OPERATING_HOURS];
  const frequencyDescriptor = detailsObjects[IGNORED_HEADINGS.FREQUENCY];
  const audioGuideDescriptor = detailsObjects[IGNORED_HEADINGS.AUDIO_GUIDE];
  const popularAttractionsDescriptor =
    detailsObjects[IGNORED_HEADINGS.POPULAR_ATTRACTIONS];
  const startingStopDescriptor = detailsObjects[IGNORED_HEADINGS.STARTING_STOP];
  const stringConnector = timingsDescriptor && frequencyDescriptor ? '|' : '';

  const descriptorsList = [
    {
      type: 'DURATION',
      text:
        timingsDescriptor || frequencyDescriptor
          ? `${timingsDescriptor} ${stringConnector} ${frequencyDescriptor}`
          : '',
    },
    {
      type: 'STARTING_STOP',
      text: startingStopDescriptor,
    },
    { type: 'AUDIO_GUIDE', text: audioGuideDescriptor },
    {
      type: 'ATTRACTIONS',
      text: popularAttractionsDescriptor,
    },
  ]?.filter((item) => item.text);

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
    isHOHORevamp: isHOHORevamp,
  });

  const onMoreInfoClick = () => {
    if (isMobile) onMoreDetailsClick();
    else onClick();
    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.MORE_INFORMATION,
      [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAMES.PRODUCT_CARD,
    });
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

  const getHohoProductCard = (
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
          $isAsideBarOverlay={isAsideBarOverlay}
          $isPopup={isPopup}
          ref={productRef}
          $isHOHORevamp={true}
          onClick={() => {
            isMobile
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
            <div className="card-img">
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
                />
              </Conditional>
              <Conditional if={experienceItineraryIds?.length}>
                <RoutesCTA
                  tourGroupName={cardTitle}
                  tgid={tgid}
                  listingPrice={finalListingPrice}
                  bookingUrl={productBookingUrl}
                  isMobile={isMobile}
                />
              </Conditional>
              <Conditional if={isLoading}>
                <Skeleton height="100%" borderRadius={8} />
              </Conditional>
            </div>
          </Conditional>

          <ProductHeader>
            <CategoryAndRatingContainer>
              <Ratings reviewsDetails={reviewsDetails} />
              <Conditional if={isMobile}>
                <button
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
              cardTitle={truncate(cardTitle, 85)}
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
              showInfoIcon={!isMobile}
              onClick={
                !isMobile
                  ? onMoreInfoClick
                  : () => window.open(productBookingUrl, '_self', 'noopener')
              }
            />
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
                <Conditional if={!isLoading && !isMobile}>
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
                </Conditional>
              </CTAContainer>
            </Conditional>
          </ProductHeader>
          <Conditional if={!isMobile && !isAsideBarOverlay && !isPopup}>
            <HorizontalLine colorProp={COLORS.CANDY.LIGHT_TONE_1} />
          </Conditional>
          <ProductDescriptors
            isLoading={isLoading}
            hohoDescriptors={descriptorsList}
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
        </StyledProductCard>
      </>
    );
  };

  return <>{getHohoProductCard(false, false)}</>;
};

export default HohoProductCard;
