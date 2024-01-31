import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { asText } from '@prismicio/helpers';
import { PrismicRichText } from '@prismicio/react';
import useSWR from 'swr';
import parse from 'url-parse';
import Button from '@headout/aer/src/atoms/Button';
import Conditional from 'components/common/Conditional';
import Emoji from 'components/common/Emoji';
import { BookNowCta } from 'components/Product/components/BookNowCta';
import Category from 'components/Product/components/Category';
import { GuidesBanner } from 'components/Product/components/GuidesBanner';
import Highlights from 'components/Product/components/Highlights';
import { NextAvailable } from 'components/Product/components/NextAvailable';
import { ProductDescriptors } from 'components/Product/components/ProductDescriptors';
import { HighlightTabs } from 'components/Product/components/ProductHighlightTabs';
import Ratings from 'components/Product/components/Ratings';
import { SpecialGuidedTour } from 'components/Product/components/SpecialGuidedTour';
import SpecialGuidedTourSummary from 'components/Product/components/SpecialGuidedTourSummary';
import { TourTitle } from 'components/Product/components/TourTitle';
import {
  CategoryAndRatingContainer,
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
  SCPCarouselContainer,
  SCPContainer,
  SCPPriceContainer,
  SCPTitle,
  SpecialGuidedTourMoreDetailsCTA,
  StyledProductCard,
  TourAvailableInLanguages,
  V1BoosterBlock,
} from 'components/Product/styles';
import HorizontalLine from 'components/slices/HorizontalLine';
import Chevron from 'UI/Chevron';
import ComboPopup from 'UI/ComboPopup';
import Image from 'UI/Image';
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
  extractCancellationPolicyFromHighlights,
  extractTabsFromHighlights,
  filterFromHighlights,
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
  PRODUCT_CARD_REVAMP,
  SIDEBAR_TYPES,
  SUBCATEGORY_IDS,
  THEMES,
} from 'const/index';
import { strings } from 'const/strings';
import ChevronRight from 'assets/chevronRight';
import GuidedTourLabelBackground from 'assets/guidedtourlabelbackground';

const SpecialGuidedTourSidePanel = dynamic(
  import(
    /* webpackChunkName: "SpecialGuidedTourSidePanel" */ 'components/Product/components/SpecialGuidedTourSidePanel'
  )
);

const MediaCarousel = dynamic(
  () => import(/* webpackChunkName: "MediaCarousel" */ 'UI/MediaCarousel')
);

const isLengthyArray = (item: any) => Array.isArray(item) && item.length;

const maxProductHeight = 395;
const maxProductBodyHeight = 265;

const Product = (props: any) => {
  const moreDetailsRef = useRef(null);
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
    isShortcodePopup,
    handleShortcodeDrawer,
    isNonPoi = false,
    isModifiedProductCard = false,
    isSmallComboCard = false,
    isPoiMwebCard = false,
    reviewsDetails,
    showCategoryAndRatingsDweb = false,
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
    if (!setDetailsPopupShown) {
      setDetailsPopupShown?.(true);
    }
    if (popup === 'combo') {
      if (isMobile && isComboWithMultiVariant && !isV3Design) {
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
        onCloseCallback: () => {
          trackedToggleContent(true);
        },
        type: SIDEBAR_TYPES.PRODUCT_CARD,
        tgid: tgid,
        history: {
          enable: true,
          params: {
            pid: tgid,
            popup: 'combo',
          },
        },
      });
    }
  }, [isMobile]);

  const {
    combo: isCombo,
    multiVariant: isMultiVariant,
    minDuration,
    maxDuration,
    images,
    imageUrl: productImage,
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

  const sendBookNowEvent = (placement?: string) => {
    const placementProperty = placement
      ? {
          [ANALYTICS_PROPERTIES.PLACEMENT]: placement,
        }
      : {};

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
        reviewsDetails,
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
      ...placementProperty,
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
        reviewsDetails,
      }),
    });
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

  const handleShowComboPopup = (placement?: string) => {
    const { variants } = tourGroupData || {};
    sendBookNowEvent(placement);
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
  const finalHighlights = asText(tempHighlights)?.trim()?.length
    ? tempHighlights
    : filterFromHighlights(scorpioData.highlights);

  const { highlights, tabs } = isMobile
    ? { highlights: finalHighlights, tabs: [] }
    : extractTabsFromHighlights(finalHighlights);

  const cancellationPolicy = useMemo(
    () => extractCancellationPolicyFromHighlights(finalHighlights),
    [finalHighlights]
  );

  const onTabChange = ({ tab, index, defaultSelection }: any) => {
    const noOfListItems = getMaxListItemsToShow(tab.contents);
    // kept the old truncation logic for mobile view
    const isTruncated = isMobile
      ? tab.contents.length > noOfListItems
      : isTicketCard || isModifiedProductCard
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
    toggleContentOpen(false);
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

  useEffect(() => {
    if (isShortcodePopup && isMobile) {
      onMoreDetailsClick();
    }
  }, [isShortcodePopup]);

  const { listingPrice } = tourPrices[tgid];
  const { query } = useRouter();
  if (!listingPrice) return null;
  const finalListingPrice = listingPrice;
  const { tourId } = finalListingPrice || {};
  const hasV1Booster = booster && asText(booster as []).trim().length > 0;
  const hasOffer = isOfferEnabled && offerId;
  const hasBorderedTitle = !hasOffer && !hasV1Booster;

  const onMoreDetailsClick = (e?: any) => {
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
          if (isShortcodePopup) {
            handleShortcodeDrawer(false);
          }
        },
        tgid: tgid,
        isProductCardTracking: true,
        history: {
          enable: true,
          params: {
            pid: tgid,
            popup: 'details',
          },
        },
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
      isModifiedProductCard,
      isPoiMwebCard,
      showCategoryAndRatingsDweb,
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
      [ANALYTICS_PROPERTIES.SECTION]: isSmallComboCard
        ? 'Combo Slice'
        : 'Product List',
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
        reviewsDetails,
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
          <ChevronRight
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

  const onSidePanelClose = () => {
    trackedToggleContent(true);
    toggleContentOpen(false);
    if (isShortcodePopup) {
      handleShortcodeDrawer(false);
    }
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

  const getHighlightTabs = isModifiedProductCard ? (
    <Highlights
      isLoading={isProductCardLoading}
      hasRegularHighlights={hasHighlights}
      tabs={tabs}
      moreContent={!showCategoryAndRatingsDweb}
      onClick={() => {
        trackedToggleContent(true);
        // @ts-expect-error TS(2721): Cannot invoke an object which is possibly 'null'.
        addToAside({
          width: '540px',
          sidePadding: 20,
          children: getProductCardElements(true, isProductCardLoading, true),
          type: SIDEBAR_TYPES.PRODUCT_CARD_EXP,
          history: {
            enable: false,
          },
        });
      }}
    />
  ) : (
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

  const getProductCardElements = (
    expandContent: any,
    isLoading?: boolean,
    isAsideBarOverlay = false
  ) => {
    if (!expandContent && isSmallComboCard)
      return (
        <SCPContainer
          data-tgid={tgid}
          onClick={(e) => {
            trackEvent({
              eventName: ANALYTICS_EVENTS.COMBO_CARDS_CLICKED,
              [ANALYTICS_PROPERTIES.POSITION]: position,
            });
            onMoreDetailsClick(e);
          }}
        >
          <Conditional if={images && images.length > 0}>
            <SCPCarouselContainer>
              <Image
                key={images[0].url}
                url={images[0].url}
                alt={images[0].altText}
                aspectRatio="21:9"
                autoCrop={false}
                width={PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.width}
                priority
                fetchPriority={'high'}
                fill
              />
            </SCPCarouselContainer>
          </Conditional>
          <SCPTitle>
            {cardTitle.split(':')[cardTitle.split(':').length - 1]}
          </SCPTitle>
          <SCPPriceContainer $isScratchPriceEnabled={showScratchPrice}>
            <PriceBlock
              isMobile
              showScratchPrice={showScratchPrice}
              listingPrice={finalListingPrice}
              lang={currentLanguage}
              showSavings
              id={+tgid}
              prefix
              key={'price-block'}
            />
          </SCPPriceContainer>
        </SCPContainer>
      );

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
          $showCategoryAndRatings={showCategoryAndRatingsDweb}
          // @ts-ignore
          ref={productRef}
        >
          <Conditional if={isMobile && isV3Design && productImage}>
            <div className="card-img">
              <Image
                url={productImage}
                imageId="card-img"
                aspectRatio={isMobile ? '21:9' : '3:4'}
                width={
                  isMobile
                    ? isPoiMwebCard
                      ? PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.modified.width
                      : PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.width
                    : undefined
                }
                height={
                  isMobile
                    ? undefined
                    : PRODUCT_CARD_IMAGE_DIMENSIONS.DESKTOP.height
                }
                fill={true}
                autoCrop={false}
                quality={80}
                alt={cardTitle}
              />
            </div>
          </Conditional>
          <Conditional if={!isTicketCard && images?.length}>
            <div className="card-img">
              <Conditional
                if={isGuidedTour && !isProductCardLoading && !isAsideBarOverlay}
              >
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
                  imageAspectRatio={
                    isMobile ? '21:9' : isAsideBarOverlay ? '16:9' : '3:4'
                  }
                  backgroundColor={COLORS.GRAY.G7}
                  imageWidth={mediaCarouselImageWidth}
                  imageHeight={mediaCarouselImageHeight}
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
            <Conditional
              if={
                isPoiMwebCard ||
                (isModifiedProductCard && showCategoryAndRatingsDweb)
              }
            >
              <CategoryAndRatingContainer>
                <Category
                  primaryCategory={
                    scorpioData.primaryCategory ?? primaryCategory
                  }
                  primarySubCategory={
                    scorpioData.primarySubCategory ?? primarySubCategory
                  }
                />
                <Ratings reviewsDetails={reviewsDetails} />
              </CategoryAndRatingContainer>
            </Conditional>

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
                isMobile
                  ? showAvailabilityInTitleMobile
                  : showAvailabilityInTitle
              }
              tabs={tabs}
              earliestAvailability={earliestAvailability}
              currentLanguage={currentLanguage}
            />

            <Conditional
              if={
                showNextAvailable &&
                showEarliestAvailability &&
                !isOpenDated &&
                !(isMobile
                  ? showAvailabilityInTitleMobile
                  : showAvailabilityInTitle) &&
                isAsideBarOverlay
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

            <Conditional if={mbTheme === THEMES.MIN_BLUE || isAsideBarOverlay}>
              <ProductDescriptors
                isLoading={isLoading}
                descriptorArray={descriptorsList}
                pageType={pageType}
                minDuration={minDuration}
                maxDuration={maxDuration}
                lang={currentLanguage}
                isCombo={isCombo}
                isGpMotorTicketsMb={isGpMotorTicketsMb}
                horizontal={isPoiMwebCard ? isMobile : isAsideBarOverlay}
              />
            </Conditional>
            <Conditional if={hasV1Booster}>
              <V1BoosterBlock boosterHasIcon={boosterHasIcon}>
                <PrismicRichText
                  field={booster}
                  components={shortCodeSerializer}
                />
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
                      <PrismicRichText
                        field={offer.data.offer_title}
                        components={shortCodeSerializer}
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
                shouldOffset={
                  earliestAvailability && mbTheme === THEMES.MIN_BLUE
                }
                isTicketCard={isTicketCard}
              >
                <Conditional if={!isCombo}>
                  <a
                    target={isMobile ? '_self' : '_blank'}
                    href={productBookingUrl}
                    rel="nofollow noreferrer"
                  >
                    <BookNowCta
                      clickHandler={() =>
                        sendBookNowEvent(
                          isAsideBarOverlay
                            ? PRODUCT_CARD_REVAMP.PLACEMENT.SIDE_SHEET
                            : PRODUCT_CARD_REVAMP.PLACEMENT.PRODUCT_CARD
                        )
                      }
                      isMobile={isMobile}
                      mbTheme={mbTheme}
                      ctaText={getBookNowButtonText()}
                    />
                  </a>
                </Conditional>
                <Conditional if={isCombo}>
                  <BookNowCta
                    showLoadingState={false}
                    clickHandler={() =>
                      handleShowComboPopup(
                        isAsideBarOverlay
                          ? PRODUCT_CARD_REVAMP.PLACEMENT.SIDE_SHEET
                          : PRODUCT_CARD_REVAMP.PLACEMENT.PRODUCT_CARD
                      )
                    }
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
                    : showAvailabilityInTitle) &&
                  !isAsideBarOverlay
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
              <Conditional
                if={isMobile && !expandContent && isSpecialGuidedTour}
              >
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
              <Conditional
                if={mbTheme !== THEMES.MIN_BLUE && !isAsideBarOverlay}
              >
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
                  horizontal={isPoiMwebCard}
                  showIcons={!isPoiMwebCard}
                  cancellationPolicy={cancellationPolicy}
                  cancellationPolicyHoverCallBack={trackCancellationPolicyHover}
                  isMobile={isMobile}
                />
              </Conditional>
            </CTAContainer>
          </ProductHeader>
          <Conditional if={!isMobile && !isAsideBarOverlay}>
            <HorizontalLine colorProp={COLORS.GRAY.G6} />
          </Conditional>
          <ProductBody
            hasReadMore={
              showMoreDetailsInTabs &&
              !defaultOpen &&
              !isSpecialGuidedTour &&
              !isModifiedProductCard
            }
            collapsed={
              !expandContent && !isTicketCard && !isModifiedProductCard
            }
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
                  !isMobile && !defaultOpen && !isModifiedProductCard
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
                  <PrismicRichText
                    field={highlights || []}
                    components={shortCodeSerializer}
                  />
                </Conditional>
                <Conditional if={tabs.length && !isSpecialGuidedTour}>
                  {isAsideBarOverlay ? (
                    <HighlightTabs
                      isLoading={isProductCardLoading}
                      onTabChange={onTabChange}
                      hasRegularHighlights={hasHighlights}
                      tabs={tabs}
                      pageType={pageType}
                      activeTabIndex={activeTabIndex}
                      showCard={showCard}
                      controlHeight
                    />
                  ) : (
                    getHighlightTabs
                  )}
                </Conditional>
              </div>
            </Conditional>
            <Conditional
              if={
                showMoreDetailsInTabs &&
                !defaultOpen &&
                !isMobile &&
                !isSpecialGuidedTour &&
                !isModifiedProductCard
              }
            >
              {getMoreDetailsButton()}
            </Conditional>
          </ProductBody>
          <Conditional
            if={
              !defaultOpen &&
              isMobile &&
              !expandContent &&
              !isModifiedProductCard
            }
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
  };

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
      isSmallComboCard={isSmallComboCard}
    >
      <Conditional if={isV3Design}>
        <div className="indicator-triangle"></div>
      </Conditional>
      {getProductCardElements(isContentOpen, isProductCardLoading)}
    </Container>
  );

  if (isSpecialGuidedTour || isShortcodePopup)
    return (
      <>
        <Conditional if={!isMobile && (isContentOpen || isShortcodePopup)}>
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
            isShortcodePopup={isShortcodePopup}
          />
        </Conditional>
        <Conditional if={!isShortcodePopup}>
          <SpecialGuidedTour Product={ProductCard} isMobile={isMobile} />
        </Conditional>
      </>
    );

  return ProductCard;
};

export default Product;
