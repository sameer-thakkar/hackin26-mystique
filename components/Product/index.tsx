import React, { useContext, useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import parse from 'url-parse';
import { Button } from '@headout/aer';
import Conditional from 'components/common/Conditional';
import Emoji from 'components/common/Emoji';
import { BookNowCta } from 'components/Product/components/BookNowCta';
import { GuidesBanner } from 'components/Product/components/GuidesBanner';
import { NextAvailable } from 'components/Product/components/NextAvailable';
import { ProductDescriptors } from 'components/Product/components/ProductDescriptors';
import { HighlightTabs } from 'components/Product/components/ProductHighlightTabs';
import { SpecialGuidedTour } from 'components/Product/components/SpecialGuidedTour';
import SpecialGuidedTourSummary from 'components/Product/components/SpecialGuidedTourSummary';
import { TourTitle } from 'components/Product/components/TourTitle';
import {
  Container,
  CTABlock,
  CTAContainer,
  GuidedTourLabel,
  LineMoreDetailsButton,
  ModalCardContainer,
  MoreDetailsBtnWrapper,
  OpenDatedDescriptor,
  PriceContainer,
  PRODUCT_CARD_IMAGE_DIMENSIONS,
  ProductBody,
  ProductHeader,
  ProductOfferBlock,
  richtextElements,
  SpecialGuidedTourMoreDetailsCTA,
  StyledProductCard,
  TourAvailableInLanguages,
  V1BoosterBlock,
} from 'components/Product/styles';
import HorizontalLine from 'components/slices/HorizontalLine';
import Chevron from 'UI/Chevron';
import ComboPopup from 'UI/ComboPopup';
import PriceBlock from 'UI/PriceBlock';
import PromoCodeBlock from 'UI/PromoCodeBlock';
import { MBContext } from 'contexts/MBContext';
import { createBookingURL } from 'utils';
import {
  getCommonEventMetaData,
  getProductCommonProperties,
  trackEvent,
} from 'utils/analytics';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { getEarliestAvailableDate } from 'utils/dateUtils';
import {
  checkIfGpMotorTicketsMB,
  checkIfSportsSubCategory,
  getHostName,
  isF1SportsExperiment,
} from 'utils/helper';
import {
  extractTabsFromHighlights,
  getMaxListItemsToShow,
  getProductCardLayout,
} from 'utils/productUtils';
import { shortCodeSerializer } from 'utils/shortCodes';
import { addQueryParams } from 'utils/urlUtils';
import { currencyAtom } from 'store/atoms/currency';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CATEGORY_IDS,
  MEDIA_CAROUSEL_IMAGE_LIMIT,
  SIDEBAR_TYPES,
  THEMES,
} from 'const/index';
import { strings } from 'const/strings';
import { CHEVRON_RIGHT, GuidedTourLabelBackground } from 'assets/SvgIcons';

const SpecialGuidedTourSidePanel = dynamic(
  import(
    /* webpackChunkName: "SpecialGuidedTourSidePanel" */ 'components/Product/components/SpecialGuidedTourSidePanel'
  )
);

const MediaCarousel = dynamic(() =>
  import(/* webpackChunkName: "MediaCarousel" */ 'UI/MediaCarousel')
);

const isLengthyArray = (item: any) => Array.isArray(item) && item.length;

const maxProductHeight = 395;
const maxProductBodyHeight = 265;

const Product = (props: any) => {
  const moreDetailsRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>();
  const collapsibleContentRef = useRef<HTMLDivElement>();

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
    showCard = true,
    flowType,
    bannerVideo,
    isV3Design,
    isCollectionMB,
    isGuidedTour,
    isSpecialGuidedTour,
    isProductCardLoading = false,
    setDetailsPopupShown = undefined,
    detialsPopupShown = false,
    isNonPoi = false,
  } = props;
  const {
    mbTheme,
    biLink,
    bookSubdomain,
    lang,
    isStage,
    isDev,
    sidebarModal: { addToAside },
    redirectToHeadoutBookingFlow,
  } = useContext(MBContext);
  const isSportsExperiment = isF1SportsExperiment(tgid);
  const pageMetaData = useRecoilValue(metaAtom);
  const currency = useRecoilValue(currencyAtom);
  const hostname = getHostName(isStage, isDev, host);
  const [isContentOpen, toggleContentOpen] = useState(defaultOpen);
  const [showMoreDetailsInTabs, setShowMoreDetails] = useState(
    defaultOpen || false
  );
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [showComboVariant, setShowComboVariant] = useState(false);
  const [showAvailabilityInTitle, setShowAvailabilityInTitle] = useState(false);
  const priceBlockWrapperRef = useRef<HTMLDivElement>();

  const isGpMotorTicketsMb = checkIfGpMotorTicketsMB(uid);
  const isSportsSubCategory = checkIfSportsSubCategory(primarySubCategory?.id);

  const isOpenDated = scorpioData?.allVariantOpenDated;

  const showAvailabilityInTitleMobile =
    isSpecialGuidedTour &&
    getEarliestAvailableDate(
      earliestAvailability?.startDate,
      currentLanguage
    ) === strings.TODAY;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pid = urlParams.get('pid');
    const popup = urlParams.get('popup');
    if (pid != tgid) return;
    if (detialsPopupShown) return;
    setDetailsPopupShown?.(true);
    if (popup === 'combo') {
      if (isMobile && isComboWithMultiVariant) {
        // @ts-expect-error TS(2721): Cannot invoke an object which is possibly 'null'.
        addToAside({
          width: '100vw',
          children: (
            <ComboPopup
              productTitle={cardTitle}
              l1Booster={boosterTag}
              tgid={tgid}
              isMobile={isMobile}
              closeHandler={handleCloseComboPopup}
              descriptors={descriptorsList}
              bookingUrl={productBookingUrl}
              minDuration={minDuration}
              maxDuration={maxDuration}
            />
          ),
          type: SIDEBAR_TYPES.COMBO_VARIANT,
          onCloseCallback: () => handleCloseComboPopup(),
          history: {
            enable: true,
            params: {
              pid: tgid,
              popup: 'combo',
            },
            isQueryRestore: true,
          },
        });
      }
    }
    if (popup === 'details') {
      // @ts-expect-error TS(2721): Cannot invoke an object which is possibly 'null'.
      addToAside({
        width: '100vw',
        children: (
          <ModalCardContainer>
            {getProductCardElements(true, false)}
          </ModalCardContainer>
        ),
        type: SIDEBAR_TYPES.PRODUCT_CARD,
        onCloseCallback: () => trackedToggleContent(true),
        history: {
          enable: true,
          params: {
            pid: tgid,
            popup: 'combo',
          },
          isQueryRestore: true,
        },
      });
    }
  }, [isMobile, showCard]);

  const {
    combo: isCombo,
    multiVariant: isMultiVariant,
    minDuration,
    maxDuration,
    images,
  } = scorpioData || {};

  const isComboWithSingleVariant = isCombo && !isMultiVariant;
  const isComboWithMultiVariant = isCombo && isMultiVariant;

  const descriptorsList = descriptors || scorpioData.descriptors;
  const cardTitle = title || scorpioData.title;
  const { promo_code } = finalPromoCode || {};
  const isFirstProduct = indexPosition === 0;
  const isBannerCard =
    isFirstProduct && isCollectionMB && bannerVideo && !isNonPoi;

  const params = {
    ...(lang && {
      language: lang,
    }),
  };
  const tourGroupEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupsV6,
    id: tgid,
    hostname,
    params,
  });

  const { data: tourGroupData } = useSWR(
    isComboWithSingleVariant ? tourGroupEndpoint : null,
    { fetcher: swrFetcher }
  );

  const handlePopup = () => {
    togglePopup();
  };

  const sendBookNowEvent = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.POSITION]: position,
      [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Product Card',
      'Div Type': 'product-list',
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
    const { listingPrice } = tourPrices[tgid] ?? {};
    const { finalPrice, originalPrice, currencyCode } = listingPrice ?? {};

    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
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

  const handleCloseComboPopup = () => {
    setShowComboVariant(false);
    if (!isMobile) {
      document.body.style.overflow = 'auto';
    }
    trackEvent({
      eventName: ANALYTICS_EVENTS.COMBO_VARIANT.POPUP_CLOSED,
      [ANALYTICS_PROPERTIES.MB_NAME]: hostname,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageType,
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
  };

  const handleShowComboPopup = () => {
    const { variants } = tourGroupData || {};
    sendBookNowEvent();
    if (tourGroupData && isComboWithSingleVariant) {
      if (typeof window !== 'undefined') {
        const { id: variantId } = variants[0];
        trackEvent({
          eventName: ANALYTICS_EVENTS.COMBO_VARIANT.VARIANT_CLICKED,
          'MB name': hostname,
          'Variant ID': variantId,
          TGID: tgid,
          Device: isMobile ? 'Mweb' : 'Desktop',
          ...getProductCommonProperties({
            primaryCategory,
            primaryCollection,
            primarySubCategory,
          }),
        });
        window.open(
          addQueryParams(productBookingUrl, {
            variantId,
          }),
          '_blank',
          'noopener noreferrer'
        );
        return;
      }
    }
    setShowComboVariant(true);
    if (!isMobile) {
      document.body.style.overflow = 'hidden';
    }
    if (isMobile && isComboWithMultiVariant) {
      // @ts-expect-error TS(2721): Cannot invoke an object which is possibly 'null'.
      addToAside({
        width: '100vw',
        children: (
          <ComboPopup
            productTitle={cardTitle}
            l1Booster={boosterTag}
            tgid={tgid}
            isMobile={isMobile}
            closeHandler={handleCloseComboPopup}
            descriptors={descriptorsList}
            bookingUrl={productBookingUrl}
            minDuration={minDuration}
            maxDuration={maxDuration}
          />
        ),
        type: SIDEBAR_TYPES.COMBO_VARIANT,
        onCloseCallback: () => handleCloseComboPopup(),
        history: {
          enable: true,
          params: {
            pid: tgid,
            popup: 'combo',
          },
        },
      });
    }
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
  const finalHighlights = RichText.asText(tempHighlights)?.trim()?.length
    ? tempHighlights
    : scorpioData.highlights;

  const { highlights, tabs } = isMobile
    ? { highlights: finalHighlights, tabs: [] }
    : extractTabsFromHighlights(finalHighlights);

  const onTabChange = ({ tab, index, defaultSelection }: any) => {
    const noOfListItems = getMaxListItemsToShow(tab.contents);
    // kept the old truncation logic for mobile view
    const isTruncated = isMobile
      ? tab.contents.length > noOfListItems
      : isTicketCard
      ? false
      : (collapsibleContentRef.current?.offsetHeight ?? 0) >=
          maxProductBodyHeight ||
        (productRef.current?.offsetHeight ?? 0) >= maxProductHeight;
    if (isMobile) setShowMoreDetails(isTruncated);

    setActiveTabIndex(index);

    if (!defaultSelection)
      trackEvent({
        eventName: ANALYTICS_EVENTS.INFO_TAB_CLICKED,
        [ANALYTICS_PROPERTIES.TGID]: tgid,
        [ANALYTICS_PROPERTIES.INFO_HEADING]: tab.heading,
        [ANALYTICS_PROPERTIES.POSITION]: index + 1,
        [ANALYTICS_PROPERTIES.IS_TRUNCATED]: isTruncated,
        [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Product Card',
        [ANALYTICS_PROPERTIES.SECTION]: 'Product List',
        ...getCommonEventMetaData(pageMetaData),
        ...getProductCommonProperties({
          primaryCategory,
          primaryCollection,
          primarySubCategory,
        }),
      });
  };

  // This is used to determine whether the tab should have a showMoreDetails CTA,
  // It runs only when the tab changes, to check if, before collapsing, the content overflows
  useEffect(() => {
    if (isMobile) return;
    // @ts-ignore
    const isTruncated = isTicketCard
      ? false
      : (collapsibleContentRef.current?.offsetHeight ?? 0) >=
          maxProductBodyHeight ||
        (productRef.current?.offsetHeight ?? 0) >= maxProductHeight;
    setShowMoreDetails(isTruncated);
  }, [isMobile, activeTabIndex, isTicketCard]);

  useEffect(() => {
    if (
      !isSpecialGuidedTour ||
      isProductCardLoading ||
      !priceBlockWrapperRef ||
      !priceBlockWrapperRef.current
    )
      return;
    if (priceBlockWrapperRef.current.clientHeight > 50) {
      setShowAvailabilityInTitle(true);
    } else if (
      isSpecialGuidedTour &&
      getEarliestAvailableDate(
        earliestAvailability?.startDate,
        currentLanguage
      ) === strings.TODAY
    )
      setShowAvailabilityInTitle(true);
  }, [
    isProductCardLoading,
    earliestAvailability,
    earliestAvailability?.startDate,
  ]);

  const { listingPrice } = tourPrices[tgid];
  const { query } = useRouter();
  if (!listingPrice) return null;
  const finalListingPrice = listingPrice;
  const { tourId } = finalListingPrice || {};
  const hasV1Booster = booster && RichText.asText(booster).trim().length > 0;
  const hasOffer = isOfferEnabled && offerId;
  const hasBorderedTitle = !hasOffer && !hasV1Booster;

  const onMoreDetailsClick = (e: any) => {
    e?.stopPropagation();
    if (mbTheme !== THEMES.MIN_BLUE && isMobile) {
      trackedToggleContent(false);
      // @ts-expect-error TS(2721): Cannot invoke an object which is possibly 'null'.
      addToAside({
        width: '100vw',
        children: (
          <ModalCardContainer>
            {getProductCardElements(true)}
          </ModalCardContainer>
        ),
        type: SIDEBAR_TYPES.PRODUCT_CARD,
        onCloseCallback: () => {
          trackedToggleContent(true);
        },
        history: {
          enable: true,
          params: {
            pid: tgid,
            popup: 'details',
          },
        },
        tgid: tgid,
        isProductCardTracking: true,
      });
    } else {
      trackedToggleContent(isContentOpen);
      toggleContentOpen(!isContentOpen);
    }
  };

  const layout = ({ isContentExpanded }: { isContentExpanded?: boolean }) =>
    getProductCardLayout({
      hasOffer,
      hasV1Booster,
      mbTheme,
      isTicketCard: isTicketCard,
      hasPromoCode: promo_code,
      isOpenDated,
      showAvailabilityInTitle: isMobile
        ? showAvailabilityInTitleMobile
        : showAvailabilityInTitle,
      showGuidesLabel: isSpecialGuidedTour && isMobile,
      showAvailabilityInLanguagesText:
        !isContentExpanded && isSpecialGuidedTour && isMobile,
    });
  const trackedToggleContent = (isOpen: any) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_MORE_DETAILS_VIEWED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.ACTION]: isOpen ? 'Contract' : 'Expand',
      // @ts-ignore
      [ANALYTICS_PROPERTIES.INFO_HEADING]: tabs[activeTabIndex]?.heading,
      [ANALYTICS_PROPERTIES.POSITION]: indexPosition + 1,
      [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Product Card',
      [ANALYTICS_PROPERTIES.SECTION]: 'Product List',
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
  };

  const getMoreDetailsButton = () => {
    const keyPressedOnReadMore = (event: any) => {
      if (event.keyCode == 13 && !isMobile) {
        toggleContentOpen(!isContentOpen);
        trackedToggleContent(isContentOpen);
      }
    };
    const innerContent = (
      <>
        {isContentOpen ? strings.SHOW_LESS_TEXT : strings.MORE_DETAILS}
        <Chevron isActive={isContentOpen} className="chevron" />
      </>
    );
    if (isMobile) {
      if (isSpecialGuidedTour)
        return (
          <LineMoreDetailsButton role="button" onClick={onMoreDetailsClick}>
            {strings.MORE_DETAILS}
          </LineMoreDetailsButton>
        );
      return (
        <MoreDetailsBtnWrapper>
          <Button
            color="purps"
            size="medium"
            variant="tertiary"
            onClick={onMoreDetailsClick}
            data-open="0"
            tabIndex={0}
            text={strings.MORE_DETAILS}
          />
        </MoreDetailsBtnWrapper>
      );
    }
    if (isSpecialGuidedTour)
      return (
        <SpecialGuidedTourMoreDetailsCTA
          data-open="0"
          onClick={onMoreDetailsClick}
          onKeyDown={keyPressedOnReadMore}
          role="button"
          tabIndex={0}
        >
          <span>{strings.MORE_DETAILS}</span>
          <CHEVRON_RIGHT
            fillColor={COLORS.TEXT.CANDY_1}
            width={12}
            height={12}
            strokeWidth={1.84615}
          />
        </SpecialGuidedTourMoreDetailsCTA>
      );
    return (
      <div
        ref={moreDetailsRef}
        className="more-details"
        data-open="0"
        onClick={onMoreDetailsClick}
        onKeyDown={keyPressedOnReadMore}
        role="button"
        tabIndex={0}
      >
        {innerContent}
      </div>
    );
  };

  const hasHighlights =
    isLengthyArray(highlights) &&
    highlights.filter((item: any) => item.text).length;

  const productBookingUrl = createBookingURL({
    nakedDomain: bookingUrl,
    lang: currentLanguage,
    currency,
    tgid,
    promoCode: promo_code === appliedPromo ? appliedPromo : null,
    tourId,
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

  const onSidePanelClose = () => {
    trackedToggleContent(true);
    toggleContentOpen(false);
  };

  const getBookNowButtonText = (): string => {
    switch (true) {
      case isV3Design: // This is just for the experiment. Will revert this at a later time or figure a better to do this
        return strings.BOOK_NOW_CTA;
      case isSportsExperiment:
        return strings.SELECT_SECTION;
      case isGpMotorTicketsMb && isSportsSubCategory:
        return strings.BUY_TICKETS_CTA;
      default:
        return strings.CHECK_AVAIL;
    }
  };

  const getHighlightTabs = (
    <HighlightTabs
      isLoading={isProductCardLoading}
      onTabChange={onTabChange}
      hasRegularHighlights={hasHighlights}
      tabs={tabs}
      pageType={pageType}
      activeTabIndex={activeTabIndex}
      showCard={showCard}
    />
  );

  const COMBO_SUBCATEGORY_ID = 1080;
  const shouldCropImage =
    !isCombo &&
    ![CATEGORY_IDS['Transportation'], CATEGORY_IDS['Travel Services']].includes(
      String(primaryCategory?.id)
    ) &&
    primarySubCategory?.id !== COMBO_SUBCATEGORY_ID;

  const getProductCardElements = (expandContent: any, isLoading?: boolean) => (
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
        collapsed={!expandContent && !isTicketCard}
        defaultOpen={defaultOpen}
        // @ts-ignore
        ref={productRef}
      >
        <Conditional if={!isTicketCard && images?.length}>
          <div className="card-img">
            <Conditional if={isGuidedTour && !isProductCardLoading}>
              <GuidedTourLabel>
                <GuidedTourLabelBackground isMobile={isMobile} />
                {strings.DESCRIPTORS.GUIDED_TOUR}
              </GuidedTourLabel>
            </Conditional>
            <Conditional if={!isLoading}>
              <MediaCarousel
                imageList={images?.slice(0, MEDIA_CAROUSEL_IMAGE_LIMIT)}
                videoUrl={isMobile && isBannerCard ? bannerVideo : null}
                imageId="card-img"
                imageAspectRatio={isMobile ? '21:9' : '3:4'}
                backgroundColor={COLORS.GRAY.G7}
                imageWidth={
                  isMobile
                    ? isBannerCard
                      ? PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.bannerProductWidth
                      : PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.width
                    : undefined
                }
                imageHeight={
                  isMobile && !isBannerCard && !isSpecialGuidedTour
                    ? undefined
                    : PRODUCT_CARD_IMAGE_DIMENSIONS.DESKTOP.height
                }
                isFirstProduct={isFirstProduct}
                tgid={tgid}
                isMobile={isMobile}
                shouldCrop={shouldCropImage}
              />
            </Conditional>
            <Conditional if={isLoading}>
              <Skeleton height="100%" borderRadius={8} />
            </Conditional>
          </div>
        </Conditional>

        <ProductHeader>
          <TourTitle
            boosterTag={boosterTag}
            cardTitle={cardTitle}
            hasBorderedTitle={hasBorderedTitle}
            isContentOpen={isContentOpen}
            isLoading={isLoading}
            isMobile={isMobile}
            isOpenDated={isOpenDated}
            isTicketCard={isTicketCard}
            mbTheme={mbTheme}
            pageType={pageType}
            showAvailability={
              isMobile ? showAvailabilityInTitleMobile : showAvailabilityInTitle
            }
            tabs={tabs}
            earliestAvailability={earliestAvailability}
            currentLanguage={currentLanguage}
          />
          <Conditional if={mbTheme === THEMES.MIN_BLUE}>
            <ProductDescriptors
              isLoading={isLoading}
              descriptorArray={descriptorsList}
              pageType={pageType}
              minDuration={minDuration}
              maxDuration={maxDuration}
              lang={currentLanguage}
              isCombo={isCombo}
              isGpMotorTicketsMb={isGpMotorTicketsMb}
            />
          </Conditional>
          <Conditional if={hasV1Booster}>
            <V1BoosterBlock boosterHasIcon={boosterHasIcon}>
              <RichText render={booster} htmlSerializer={shortCodeSerializer} />
            </V1BoosterBlock>
          </Conditional>
          {hasOffer &&
            offerId &&
            productOffer.map((offer: any, index: number) => {
              if (offer.id === offerId) {
                return (
                  <ProductOfferBlock
                    key={index}
                    onClick={handlePopup}
                    className="tour-offer"
                  >
                    <RichText
                      render={offer.data.offer_title}
                      htmlSerializer={shortCodeSerializer}
                    />
                  </ProductOfferBlock>
                );
              }
            })}
          <CTAContainer pageType={pageType}>
            <PriceContainer pageType={pageType}>
              <PriceBlock
                isMobile={isMobile}
                isLoading={isLoading}
                isSportsExperiment={isSportsExperiment}
                showScratchPrice={showScratchPrice}
                listingPrice={finalListingPrice}
                lang={currentLanguage}
                showSavings
                id={tgid}
                prefix
                key={'price-block'}
                wrapperRef={priceBlockWrapperRef}
              />
            </PriceContainer>
            <Conditional if={isTicketCard && promo_code}>
              <PromoCodeBlock
                {...props}
                isTicketCardDetailPopup
                currencyCode={finalListingPrice?.currencyCode ?? ''}
              />
            </Conditional>

            <CTABlock
              isSticky={expandContent}
              shouldOffset={earliestAvailability && mbTheme === THEMES.MIN_BLUE}
              isTicketCard={isTicketCard}
            >
              <Conditional if={!isCombo}>
                <a
                  target={isMobile ? '_self' : '_blank'}
                  href={productBookingUrl}
                  rel="nofollow noreferrer"
                >
                  <BookNowCta
                    clickHandler={sendBookNowEvent}
                    isMobile={isMobile}
                    mbTheme={mbTheme}
                    ctaText={getBookNowButtonText()}
                  />
                </a>
              </Conditional>
              <Conditional if={isCombo}>
                <BookNowCta
                  showLoadingState={false}
                  clickHandler={handleShowComboPopup}
                  isMobile={isMobile}
                  mbTheme={mbTheme}
                  ctaText={getBookNowButtonText()}
                />
              </Conditional>
            </CTABlock>
            <Conditional
              if={
                showNextAvailable &&
                showEarliestAvailability &&
                !isOpenDated &&
                !(isMobile
                  ? showAvailabilityInTitleMobile
                  : showAvailabilityInTitle)
              }
            >
              <NextAvailable
                showSkeleton={
                  !showEarliestAvailability &&
                  !earliestAvailability &&
                  !earliestAvailability?.startDate
                }
                earliestAvailability={earliestAvailability}
                currentLanguage={currentLanguage}
              />
            </Conditional>
            <Conditional if={isMobile && isSpecialGuidedTour}>
              <GuidesBanner isInSwipeSheet />
            </Conditional>
            <Conditional if={isMobile && !expandContent && isSpecialGuidedTour}>
              <TourAvailableInLanguages>
                {/*
                TODO: import language labels from scorpio and prismic here
                {isSpecialGuidedTour &&
                  strings.formatString(
                    strings.TOUR_AVAILABLE_LANGUAGES,
                    GUIDED_TOUR_PRODUCT_CARD_REVAMP_EXPERIMENT[
                      uid ?? ''
                    ]?.languageLabels
                      .map((label) => strings.LANGUAGES[label])
                      .join(', ')
                  )} */}
              </TourAvailableInLanguages>
            </Conditional>
            <Conditional if={isOpenDated && isMobile}>
              <OpenDatedDescriptor>
                <Emoji symbol="😇" label="blessed-face" />{' '}
                {strings.OPEN_DATED_DESCRIPTOR}
              </OpenDatedDescriptor>
            </Conditional>
            <Conditional if={mbTheme !== THEMES.MIN_BLUE}>
              <ProductDescriptors
                isLoading={isLoading}
                descriptorArray={descriptorsList}
                pageType={pageType}
                minDuration={minDuration}
                maxDuration={maxDuration}
                lang={currentLanguage}
                isCombo={isCombo}
                isGpMotorTicketsMb={isGpMotorTicketsMb}
                showLanguages={
                  (!isMobile || expandContent) && isSpecialGuidedTour
                }
                uid={uid}
              />
            </Conditional>
          </CTAContainer>
        </ProductHeader>
        <Conditional if={!isMobile}>
          <HorizontalLine colorProp={COLORS.GRAY.G6} />
        </Conditional>
        <ProductBody
          hasReadMore={
            showMoreDetailsInTabs && !defaultOpen && !isSpecialGuidedTour
          }
          collapsed={!expandContent && !isTicketCard}
          defaultOpen={defaultOpen}
          maxHeight={maxProductBodyHeight}
          // @ts-ignore
          ref={collapsibleContentRef}
        >
          <Conditional
            if={
              !isTicketCard ||
              (isTicketCard && !isMobile) ||
              (isTicketCard && expandContent)
            }
          >
            <div
              className={'tour-description'}
              id={`tour-description-${position}`}
              // @ts-expect-error TS(2322): Type '((e: MouseEvent<HTMLDivElement, MouseEvent>)... Remove this comment to see the full error message
              onClick={
                !isMobile && !defaultOpen
                  ? (e) => {
                      e.stopPropagation();
                      toggleContentOpen(!isContentOpen);
                      trackedToggleContent(isContentOpen);
                    }
                  : null
              }
            >
              <Conditional if={isSpecialGuidedTour && !isMobile}>
                <SpecialGuidedTourSummary
                  moreDetailsCTA={getMoreDetailsButton()}
                />
              </Conditional>
              <Conditional if={hasHighlights}>
                <RichText
                  render={highlights || []}
                  htmlSerializer={shortCodeSerializer}
                  elements={richtextElements}
                />
              </Conditional>
              <Conditional if={tabs.length && !isSpecialGuidedTour}>
                {getHighlightTabs}
              </Conditional>
            </div>
          </Conditional>
          <Conditional
            if={
              showMoreDetailsInTabs &&
              !defaultOpen &&
              !isMobile &&
              !isSpecialGuidedTour
            }
          >
            {getMoreDetailsButton()}
          </Conditional>
        </ProductBody>
        <Conditional
          if={!defaultOpen && isMobile && !expandContent && !isTicketCard}
        >
          {getMoreDetailsButton()}
        </Conditional>
      </StyledProductCard>
      <Conditional
        if={!isMobile && isComboWithMultiVariant && showComboVariant}
      >
        <ComboPopup
          productTitle={cardTitle}
          l1Booster={boosterTag}
          tgid={tgid}
          isMobile={isMobile}
          closeHandler={handleCloseComboPopup}
          descriptors={descriptorsList}
          bookingUrl={productBookingUrl}
          minDuration={minDuration}
          maxDuration={maxDuration}
        />
      </Conditional>
    </>
  );

  const getIsCardVisible = () => {
    if (isMobile) {
      return !isV3Design;
    } else {
      return showCard;
    }
  };

  const ProductCard = (
    <Container
      isV3Design={isV3Design}
      indexPosition={indexPosition}
      isCardVisible={getIsCardVisible()}
    >
      <Conditional if={isV3Design}>
        <div className="indicator-triangle"></div>
      </Conditional>
      {getProductCardElements(isContentOpen, isProductCardLoading)}
    </Container>
  );

  if (isSpecialGuidedTour)
    return (
      <>
        <Conditional if={!isMobile && isContentOpen}>
          <SpecialGuidedTourSidePanel
            images={images}
            tgid={tgid}
            tourTitle={cardTitle}
            onSidePanelClose={onSidePanelClose}
            highlightTabsComponent={getHighlightTabs}
            descriptorsList={descriptorsList}
            minDuration={minDuration}
            maxDuration={maxDuration}
            lang={currentLanguage}
            showScratchPrice={showScratchPrice}
            listingPrice={finalListingPrice}
            onBookNowClick={sendBookNowEvent}
            showAvailabilityInTitle={
              getEarliestAvailableDate(
                earliestAvailability?.startDate,
                currentLanguage
              ) === strings.TODAY
            }
            earliestAvailability={earliestAvailability}
            productBookingUrl={productBookingUrl}
            ctaText={getBookNowButtonText()}
            uid={uid}
          />
        </Conditional>
        <SpecialGuidedTour Product={ProductCard} isMobile={isMobile} />
      </>
    );

  return ProductCard;
};

export default Product;
