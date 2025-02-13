import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { scroller } from 'react-scroll';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { asText } from '@prismicio/helpers';
import { PrismicRichText } from '@prismicio/react';
import useSWR from 'swr';
import type { Itinerary as TItinerary } from 'types/itinerary.type';
import parse from 'url-parse';
import Button from '@headout/aer/src/atoms/Button';
import { trackPageSection } from 'components/CityPageContainer/utils';
import Conditional from 'components/common/Conditional';
import Emoji from 'components/common/Emoji';
import MWebEntryPoint from 'components/common/Itinerary/MWebEntryPoint';
import ExperimentalProductCard from 'components/experimentalProductCard';
import ItineraryEntryPoint from 'components/HOHO/components/RoutesCTA/EntryPoint';
import { SECTION_NAMES } from 'components/HOHO/constants';
import { TImageGalleryController } from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/interface';
import { TController as TItineraryController } from 'components/NewVerticals/RouteDetails/Popup/interface';
import RoutesCTA from 'components/NewVerticals/RoutesCTA';
import SightsCovered from 'components/NewVerticals/SightsCovered';
import { BookNowCta } from 'components/Product/components/BookNowCta';
import Category from 'components/Product/components/Category';
import { GuidesBanner } from 'components/Product/components/GuidesBanner';
import Highlights from 'components/Product/components/Highlights';
import { NextAvailable } from 'components/Product/components/NextAvailable';
import type { TController } from 'components/Product/components/Popup/interface';
import { ProductDescriptors } from 'components/Product/components/ProductDescriptors';
import { HighlightTabs } from 'components/Product/components/ProductHighlightTabs';
import Ratings from 'components/Product/components/Ratings';
import { SpecialGuidedTour } from 'components/Product/components/SpecialGuidedTour';
import SpecialGuidedTourSummary from 'components/Product/components/SpecialGuidedTourSummary';
import { TourTitle } from 'components/Product/components/TourTitle';
import {
  CategoryAndRatingContainer,
  CloseButtonContainer,
  Container,
  CTABlock,
  CTAContainer,
  GuidedTourLabel,
  LineMoreDetailsButton,
  ModalCardContainer,
  MoreDetailsBtnWrapper,
  OpenDatedDescriptor,
  PopupContainer,
  PopupPricingUnit,
  PriceContainer,
  PRODUCT_CARD_IMAGE_DIMENSIONS,
  ProductBody,
  ProductHeader,
  ProductOfferBlock,
  SlideUpContainer,
  SlideUpTitle,
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
import { ItineraryProvider } from 'contexts/ItineraryContext';
import { MBContext } from 'contexts/MBContext';
import { ProductCardProvider } from 'contexts/productCardContext';
import useABTesting from 'hooks/useABTesting';
import useOnScreen from 'hooks/useOnScreen';
import useWindowWidth from 'hooks/useWindowWidth';
import { createBookingURL, isGuidedTourSubcategory } from 'utils';
import {
  getCommonEventMetaData,
  getProductCommonProperties,
  trackEvent,
} from 'utils/analytics';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { getEarliestAvailableDate } from 'utils/dateUtils';
import { debounce } from 'utils/gen';
import {
  checkIfGpMotorTicketsMB,
  checkIfSportsSubCategory,
  getHostName,
  isF1SportsExperiment,
} from 'utils/helper';
import {
  checkForBooster,
  extractCancellationPolicyFromHighlights,
  extractTabsFromHighlights,
  filterFromHighlights,
  filterHighlights,
  generateVideoExperimentVideoUrl,
  getMaxListItemsToShow,
  getProductCardLayout,
  parseInclusionsExclusions,
} from 'utils/productUtils';
import { shortCodeSerializer } from 'utils/shortCodes';
import { addQueryParams } from 'utils/urlUtils';
import { currencyAtom } from 'store/atoms/currency';
import { hsidAtom } from 'store/atoms/hsid';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import { EXPERIMENT_NAMES, VARIANTS } from 'const/experiments';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CATEGORY_IDS,
  CRUISE_CATEGORY_ID,
  CRUISE_FORMAT_SUBCAT_IDS,
  DESCRIPTORS,
  MEDIA_CAROUSEL_IMAGE_LIMIT,
  PRODUCT_CARD_REVAMP,
  SIDEBAR_TYPES,
  SUBCATEGORY_IDS,
  THEMES,
} from 'const/index';
import { tgidsWithSitesVisited } from 'const/itinerary';
import { CARD_SECTION_MARKERS, SWIPESHEET_STATES } from 'const/productCard';
import {
  MBS_EXTENDED_REVIEWS_V2_ENABLED_DOMAINS,
  MBS_REVIEWS_V2_ENABLED_DOMAINS,
} from 'const/reviews';
import { strings } from 'const/strings';
import ChevronRight from 'assets/chevronRight';
import GuidedTourLabelBackground from 'assets/guidedtourlabelbackground';
import Booster from './components/Booster/Booster';
import NewVerticalsProductCard from './components/NewVerticalsProductCard';
import HorizontalDescriptors from './components/NewVerticalsProductCard/HorizontalDescriptors';
import InclusionsExclusions from './components/NewVerticalsProductCard/InclusionsExclusions';
import { BoosterType } from './interface';
import { trackDeadClick } from './utils';

const SpecialGuidedTourSidePanel = dynamic(
  import(
    /* webpackChunkName: "SpecialGuidedTourSidePanel" */ 'components/Product/components/SpecialGuidedTourSidePanel'
  )
);

const MenuSection = dynamic(
  import(
    /* webpackChunkName: "MenuSection" */ './components/NewVerticalsProductCard/MenuSection'
  )
);

const MediaCarousel = dynamic(
  () => import(/* webpackChunkName: "MediaCarousel" */ 'UI/MediaCarousel')
);

const ExpandedGallery = dynamic(
  import(
    /* webpackChunkName: "ExpandedGallery" */ 'components/Product/components/ExpandedGallery'
  )
);

const NavigationBar = dynamic(
  import(
    /* webpackChunkName: "NavigationBar" */ 'components/Product/components/Popup/NavigationBar'
  )
);

const ReviewSection = dynamic(
  import(
    /* webpackChunkName: "ReviewSection" */ 'components/Product/components/Popup/ReviewSection'
  )
);

const CloseButton = dynamic(
  import(
    /* webpackChunkName: "CloseButtonPopup" */ 'components/Product/components/Popup/CloseButton'
  )
);

const Popup = dynamic(
  import(
    /* webpackChunkName: "PopupContainer" */ 'components/Product/components/Popup'
  )
);
const Itinerary = dynamic(
  import(/* webpackChunkName: "Itinerary" */ 'components/common/Itinerary')
);

const isLengthyArray = (item: any) => Array.isArray(item) && item.length;

const maxProductHeight = 395;
const maxProductBodyHeight = 265;

const Product = (props: any) => {
  const moreDetailsRef = useRef(null);
  const productRef = useRef<HTMLDivElement>(null);
  const popupContainerRef = useRef<HTMLDivElement>(null);
  const collapsibleContentRef = useRef<HTMLDivElement>(null);
  const popupController = useRef<TController>();
  const priceblockTitleContainerRef = useRef<HTMLDivElement>(null);
  const combosSectionRef = useRef<HTMLDivElement>(null);
  const itineraryPopupController = useRef<TItineraryController>();

  const [isTracked, setIsTracked] = useState(false);
  const [boosterType, setBoosterType] = useState<
    keyof typeof BoosterType | null
  >(null);

  const [isItineraryDrawerOpen, setIsItineraryDrawerOpen] = useState(false);
  const isCombosSectionIntersecting = useOnScreen({
    ref: combosSectionRef,
    unobserve: true,
  });

  useEffect(() => {
    if (!isTracked && isCombosSectionIntersecting) {
      trackPageSection({ section: SECTION_NAMES.COMBOS });
      setIsTracked(true);
    }
  }, [isCombosSectionIntersecting]);

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
    isMobile: originalIsMobile,
    instantCheckout,
    showNextAvailable = false,
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
    isPoiMwebCard = false,
    reviewsDetails,
    topReviews,
    showPopup = true,
    showNewCard = false,
    forceMobile = false,
    showThumbnailInBanner = false,
    nonNewVerticalIndex,
    isSwiperCard = false,
    isBot = false,
    itineraryInfo,
    isNewVerticalsProductCard = false,
    showCruisesCombosRevamp = false,
    isCruisesRevamp = false,
    verticalProductCard = false,
    horizontalProductCard = false,
    showVideoOnProductCard = false,
    showCustomProductCardEnglishCTA = false,
    shouldRunHohoRevampExperiment = false,
    isHOHORevamp,
    showBoosters = false,
    isPopUpOnly = false,
    onPopupClosed,
    isFlexiCancellationExperimentTriggered,
    scrollToIndex = -1,
  } = props;

  const imageGalleryController = useRef<TImageGalleryController>(null);

  const {
    data: tgidItineraryData,
    showData: showItinerary,
    isHOHO: isHohoItinerary,
    showSightsCoveredItineraryLayout,
  } = itineraryInfo || {};

  const {
    details,
    sections,
    type: itineraryType,
    map: itineraryMap,
  } = tgidItineraryData?.[0] || {};

  const {
    mbTheme,
    biLink,
    bookSubdomain,
    lang,
    isDev,
    sidebarModal: { addToAside, closeAside },
    redirectToHeadoutBookingFlow,
  } = useContext(MBContext);

  const clientWidth = useWindowWidth();
  const clientIsMobile = clientWidth ? clientWidth <= 768 : false;
  const isMobile = forceMobile || originalIsMobile || clientIsMobile;

  const isSportsExperiment = isF1SportsExperiment(tgid);
  const pageMetaData = useRecoilValue(metaAtom);
  const currency = useRecoilValue(currencyAtom);
  const hostname = getHostName(isDev, host);
  const [isContentOpen, toggleContentOpen] = useState<boolean>(defaultOpen);
  const [showMoreDetailsInTabs, setShowMoreDetails] = useState(
    defaultOpen || false
  );
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [showComboVariant, setShowComboVariant] = useState(false);
  const [showAvailabilityInTitle, setShowAvailabilityInTitle] = useState(false);
  const [currentTabActiveIndexForPopup, setCurrentTabActiveIndexForPopup] =
    useState({
      index: 0,
      isForcedChange: false,
    });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isUnScrolled, setIsUnScrolled] = useState(true);
  const [customDescriptors, setCustomDescriptors] = useState([]);

  const [popupScrollTracker, setPopupScrollTracker] = useState({
    25: false,
    50: false,
    75: false,
    90: false,
  });
  const priceBlockWrapperRef = useRef<HTMLDivElement>();
  const isGpMotorTicketsMb = checkIfGpMotorTicketsMB(uid);
  const isSportsSubCategory = checkIfSportsSubCategory(primarySubCategory?.id);
  const typeOfProductCard = horizontalProductCard
    ? 'Product Card Carousel'
    : verticalProductCard
    ? 'Vertical Product List'
    : '';

  const isOpenDated = scorpioData?.allVariantOpenDated;

  const showAvailabilityInTitleMobile =
    isSpecialGuidedTour &&
    getEarliestAvailableDate({
      date: earliestAvailability?.startDate,
      currentLanguage,
    }) === strings.TODAY;

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
      if (originalIsMobile && isComboWithMultiVariant && !isV3Design) {
        addToAside({
          width: '100vw',
          children: (
            <ComboPopup
              productTitle={cardTitle}
              l1Booster={boosterTag}
              tgid={tgid}
              isMobile={originalIsMobile}
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
      if (!isV3Design) {
        openProductCardAside();
      } else {
        addToAside({
          width: '100vw',
          children: (
            <ModalCardContainer>
              {getProductCardElements({
                expandContent: true,
                isLoading: false,
              })}
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
    }
  }, [isMobile]);

  let {
    combo: isCombo,
    multiVariant: isMultiVariant,
    minDuration,
    maxDuration,
    images,
    imageUrl: productImage,
  } = scorpioData || {};

  if (forceMobile && images?.length > 1 && !originalIsMobile) {
    images = [images[0]];
  }

  const isComboWithSingleVariant = isCombo && !isMultiVariant;
  const isComboWithMultiVariant = isCombo && isMultiVariant;

  const descriptorsList = descriptors || scorpioData?.descriptors || [];
  const cardTitle = title || scorpioData?.title;
  const { promo_code } = finalPromoCode || {};
  const isFirstProduct = indexPosition === 0;
  const isBannerCard =
    isFirstProduct && isCollectionMB && bannerVideo && !isNonPoi;
  const isNonCruiseProduct =
    primaryCategory?.id !== CRUISE_CATEGORY_ID &&
    !CRUISE_FORMAT_SUBCAT_IDS?.includes(primarySubCategory?.id);
  const isNonNewVerticalProductCard = showCruisesCombosRevamp
    ? false
    : isCruisesRevamp
    ? isNonCruiseProduct
    : isCombo;
  const isModifiedPopup = isCruisesRevamp && !isNonNewVerticalProductCard;

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

  useEffect(() => {
    if (!productRef.current) return;
    const element = productRef.current;

    const { listingPrice } = tourPrices[tgid] ?? {};
    const { finalPrice, originalPrice, currencyCode } = listingPrice ?? {};

    const extraProps = {
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
        reviewsDetails,
        boosterType,
      }),
    };

    element.addEventListener(
      'click',
      (e: any) => trackDeadClick(e, extraProps),
      false
    );

    return () =>
      element?.removeEventListener(
        'click',
        (e: any) => trackDeadClick(e, extraProps),
        false
      );
  }, [productRef]);

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
        boosterType,
      }),
    });
    const { listingPrice } = tourPrices[tgid] ?? {};
    const { finalPrice, originalPrice, currencyCode } = listingPrice ?? {};

    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
      ...(showBoosters && {
        [ANALYTICS_PROPERTIES.BOOSTER_NAME]: props.poiBooster
          ? BoosterType[props.poiBooster as keyof typeof BoosterType]
          : null,
      }),
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
        boosterType,
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

  const trackFlexibleCancellationPolicyHover = () => {
    const { listingPrice } = tourPrices[tgid] ?? {};
    const { finalPrice, originalPrice, currencyCode } = listingPrice ?? {};

    trackEvent({
      eventName: ANALYTICS_EVENTS.TOOLTIP_VIEWED,
      [ANALYTICS_PROPERTIES.TOOLTIP_TYPE]: 'Flexible Cancellation',
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

  const trackItineraryEntrypoint = () => {
    const { listingPrice } = tourPrices[tgid] ?? {};
    const { finalPrice, originalPrice, currencyCode } = listingPrice ?? {};

    trackEvent({
      eventName: ANALYTICS_EVENTS.ITINERARY.VIEW_ITINERARY_CLICKED,
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
        reviewsDetails,
      }),
      [ANALYTICS_PROPERTIES.ITINERARY_TYPE]: itineraryType,
      [ANALYTICS_PROPERTIES.HAS_MAP]: itineraryMap?.active,
    });
  };

  const handleCloseComboPopup = () => {
    setShowComboVariant(false);
    if (!originalIsMobile) {
      document.body.style.overflow = 'auto';
    }
    if (isMobile) {
      // @ts-ignore
      closeAside?.();
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
          Device: originalIsMobile ? 'Mweb' : 'Desktop',
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
          originalIsMobile ? '_self' : '_blank',
          'noopener'
        );
        return;
      }
    }
    setShowComboVariant(true);
    if (!originalIsMobile) {
      document.body.style.overflow = 'hidden';
    }
    if (isMobile && isComboWithMultiVariant) {
      addToAside({
        width: '100vw',
        children: (
          <ComboPopup
            productTitle={cardTitle}
            l1Booster={boosterTag}
            tgid={tgid}
            isMobile={originalIsMobile}
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

  const hostName =
    !isDev || /(test|dev)-headout/gi.test(url)
      ? url
      : parse(uid, true).pathname;
  let hostSplit = hostName.split('.');
  hostSplit.shift();
  const bookingUrl = hostSplit.join('.');
  const showScratchPrice = isScratchPriceEnabled;
  const finalHighlights = asText(tempHighlights)?.trim()?.length
    ? tempHighlights
    : filterFromHighlights(scorpioData?.highlights);

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
      getEarliestAvailableDate({
        date: earliestAvailability?.startDate,
        currentLanguage,
      }) === strings.TODAY
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

  const isProductCardVisible = useOnScreen({
    ref: productRef,
    unobserve: true,
  });

  const {
    isEligible: isEligibleForFlexiCancellationExperiment,
    variant: flexiCancellationExperimentVariant,
    isExperimentResolving,
  } = useABTesting({
    experimentId: 'FLEXIBLE_CANCELLATION_EXPERIMENT',
    customEligibilityCheckFn: () => {
      const isFlexiCancellationProduct = descriptorsList?.some(
        (d: string) => d === DESCRIPTORS.FLEXIBLE_CANCELLATION
      );

      const isFreeCancellationProduct = descriptorsList?.some(
        (d: string) => d === DESCRIPTORS.FREE_CANCELLATION
      );

      const isFlexiCancellableNonFreeProduct =
        isFlexiCancellationProduct && !isFreeCancellationProduct;

      return isFlexiCancellableNonFreeProduct && !isMobile;
    },
    noTrack: true,
  });

  const hsid = useRecoilValue(hsidAtom);

  useEffect(() => {
    if (
      isEligibleForFlexiCancellationExperiment &&
      !isFlexiCancellationExperimentTriggered.current &&
      isProductCardVisible &&
      !isExperimentResolving
    ) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.EXPERIMENT_VIEWED,
        [ANALYTICS_PROPERTIES.EXPERIMENT_NAME]:
          EXPERIMENT_NAMES.FLEXIBLE_CANCELLATION_EXPERIMENT,
        [ANALYTICS_PROPERTIES.EXPERIMENT_VARIANT]:
          flexiCancellationExperimentVariant,
      });

      isFlexiCancellationExperimentTriggered.current = true;
    }
  }, [
    flexiCancellationExperimentVariant,
    isEligibleForFlexiCancellationExperiment,
    isFlexiCancellationExperimentTriggered,
    isProductCardVisible,
    isExperimentResolving,
  ]);

  const boosterTypeIfShown = useMemo(() => {
    const boosterInfo =
      showBoosters && (checkForBooster(uid, tgid) || props.poiBooster);

    if (boosterInfo) setBoosterType(boosterInfo);
    return boosterInfo;
  }, [tgid, showBoosters, props.poiBooster, uid]);

  const {
    highlightsAndInclusionsRichText,
    everyRichTextExceptHighlightsAndInclusions,
    inclusionsRichText = [],
    everyRichTextExceptInclusions,
  } = useMemo(
    () =>
      filterHighlights({
        highlights: finalHighlights,
        removeSitesVisited:
          showItinerary && tgidsWithSitesVisited.includes(tgid),
        isModifiedPopup: isModifiedPopup || showSightsCoveredItineraryLayout,
        isModifiedCombo: showCruisesCombosRevamp && isNonCruiseProduct,
      }),
    [finalHighlights]
  );

  let { highlights, tabs } = originalIsMobile
    ? { highlights: finalHighlights, tabs: [] }
    : extractTabsFromHighlights(
        isModifiedPopup && !isNonCruiseProduct
          ? everyRichTextExceptInclusions
          : finalHighlights
      );

  tabs =
    showItinerary && tgidsWithSitesVisited.includes(tgid)
      ? [...tabs.slice(0, 2), ...tabs.slice(3)]
      : tabs;

  if (showSightsCoveredItineraryLayout) {
    tabs = [
      ...tabs.slice(0, 2),
      {
        ...(sections?.length
          ? {
              heading: strings.CRUISES.SIGHTS_COVERED,
              contents: [],
              type: 'nonRichText',
            }
          : null),
      },
      ...tabs.slice(2),
    ]?.filter((el) => Object.keys(el)?.length);
  }

  if (isModifiedPopup) {
    tabs = [
      !isNonCruiseProduct && {
        heading: strings.INCLUSIONS,
        contents: [],
        type: 'nonRichText',
      },
      {
        ...(details?.cruiseMenus?.length
          ? {
              heading: strings.CRUISES.FOOD_MENU,
              contents: [],
              type: 'nonRichText',
            }
          : null),
      },
      {
        ...(sections?.length
          ? {
              heading: strings.CRUISES.SIGHTS_COVERED,
              contents: [],
              type: 'nonRichText',
            }
          : null),
      },
      ...tabs,
    ]?.filter((el) => Object.keys(el)?.length);
  }

  const { inclusionsExclusions } =
    parseInclusionsExclusions(inclusionsRichText);

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
      if (showPopup && !originalIsMobile) {
        setIsUnScrolled(true);
        popupController.current?.open(
          activeTabIndex + (showItinerary && activeTabIndex > 0 ? 1 : 0)
        );
      } else {
        openProductCardAside();
      }
    } else {
      if (showPopup) {
        setIsUnScrolled(true);
        popupController.current?.open(
          activeTabIndex + (showItinerary && activeTabIndex > 0 ? 1 : 0)
        );
        trackedToggleContent(false);
      } else {
        trackedToggleContent(isContentOpen);
        toggleContentOpen(!isContentOpen);
      }
    }
  };

  const openProductCardAside = (
    args: {
      scrollToItinerarySection?: boolean;
    } | void
  ) => {
    const { scrollToItinerarySection = false } = args || {};

    addToAside({
      width: '100vw',
      hideCloseButton: true,
      noBackgroundOverlay: true,
      children: (
        <ProductCardProvider
          drawerDefault={SWIPESHEET_STATES.OPEN}
          onDrawerStateChanged={(drawerState: string) => {
            if (drawerState === SWIPESHEET_STATES.HIDDEN) {
              closeAside();
            }
          }}
        >
          <ItineraryProvider>
            <ExperimentalProductCard
              {...props}
              handleShowComboPopup={handleShowComboPopup}
              sendBookNowEvent={sendBookNowEvent}
              isSportsSubCategory={isSportsSubCategory}
              showThumbnailInBanner={showThumbnailInBanner}
              showJustDrawer={true}
              scrollToItinerarySection={scrollToItinerarySection}
              tgidItineraryData={tgidItineraryData}
              isModifiedPopup={isModifiedPopup}
              isModifiedCombo={showCruisesCombosRevamp && isNonCruiseProduct}
              showCruisesCombosRevamp={showCruisesCombosRevamp}
              customDescriptors={customDescriptors}
              showSightsCoveredItineraryLayout={
                showSightsCoveredItineraryLayout
              }
            />
          </ItineraryProvider>
        </ProductCardProvider>
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
  };

  const layout = ({ isContentExpanded }: { isContentExpanded?: boolean }) =>
    getProductCardLayout({
      hasOffer,
      hasV1Booster,
      mbTheme,
      isTicketCard: isTicketCard,
      hasPromoCode: promo_code,
      isOpenDated: isOpenDated && !forceMobile,
      showAvailabilityInTitle: isMobile
        ? showAvailabilityInTitleMobile
        : showAvailabilityInTitle,
      showGuidesLabel: isSpecialGuidedTour && isMobile,
      showAvailabilityInLanguagesText:
        !isContentExpanded && isSpecialGuidedTour && isMobile,
      isModifiedProductCard,
      hideNextAvailable: !showNextAvailable,
    });

  const trackedToggleContent = (isOpen: any) => {
    if (!isOpen) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.EXPERIENCE_MORE_DETAILS_VIEWED,
        [ANALYTICS_PROPERTIES.TGID]: tgid,
        [ANALYTICS_PROPERTIES.ACTION]: isOpen ? 'Contract' : 'Expand',
        // @ts-ignore
        [ANALYTICS_PROPERTIES.INFO_HEADING]: tabs[activeTabIndex]?.heading,
        [ANALYTICS_PROPERTIES.POSITION]: indexPosition + 1,
        [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Product Card',
        [ANALYTICS_PROPERTIES.SECTION]: 'Product List',
        ...(typeOfProductCard && {
          [ANALYTICS_PROPERTIES.PLACEMENT]: typeOfProductCard,
        }),
        ...getProductCommonProperties({
          primaryCategory,
          primaryCollection,
          primarySubCategory,
          reviewsDetails,
          boosterType,
        }),
      });
    }
  };

  const getMoreDetailsButton = () => {
    const keyPressedOnReadMore = (event: any) => {
      if (event.keyCode == 13 && !isMobile) {
        if (showPopup) {
          setIsUnScrolled(true);
          popupController.current?.open(
            activeTabIndex + (showItinerary && activeTabIndex > 0 ? 1 : 0)
          );

          trackedToggleContent(false);
        } else {
          toggleContentOpen(!isContentOpen);
          trackedToggleContent(isContentOpen);
        }
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
        <MoreDetailsBtnWrapper $forceMobile={forceMobile}>
          <Button
            color="purps"
            size="medium"
            variant="tertiary"
            onClick={onMoreDetailsClick}
            data-open="0"
            tabIndex={0}
            text={strings.MORE_DETAILS}
            data-card-section={CARD_SECTION_MARKERS.ACTION_BTN}
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
        className={`more-details ${showPopup ? 'arrow-right' : ''}`}
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
    cancellationInsuranceVariant: isEligibleForFlexiCancellationExperiment
      ? flexiCancellationExperimentVariant ?? undefined
      : undefined,
    hsid,
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
      case showCustomProductCardEnglishCTA:
        return strings.SELECT_AN_OPTION;
      default:
        return strings.CHECK_AVAIL;
    }
  };

  const highlightTabs = isModifiedProductCard ? (
    <Highlights
      isLoading={isProductCardLoading}
      hasRegularHighlights={hasHighlights}
      tabs={tabs}
      showPopup={false}
      showMoreDetails={isNewVerticalsProductCard}
      onClick={() => {
        trackedToggleContent(false);
        setIsUnScrolled(true);
        popupController.current?.open();
      }}
      productRef={productRef}
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

  const checkForSections = () => {
    return new Promise((resolve, reject) => {
      // Check if all headings are already present
      const checkHeadings = () => {
        if (!popupContainerRef.current) {
          reject();
          return false;
        }

        const headings = Array.from(
          popupContainerRef.current.querySelectorAll<HTMLHeadingElement>(
            '.tour-description > h6'
          )
        );

        headings.forEach((heading, index) => {
          heading.id = `description-heading-pos-${index}`;
        });

        const itinerarySectionLoaded =
          !!popupContainerRef.current.querySelector(
            "[data-itinerary-section-title='true']"
          );

        const reviewSectionLoaded = !!popupContainerRef.current.querySelector(
          "[data-review-section-title='true']"
        );

        const isItinerarySectionConditionSatisfied =
          showItinerary && !isCruisesRevamp ? itinerarySectionLoaded : true;
        const isReviewSectionConditionSatisfied = reviewsDetails?.showRatings
          ? reviewSectionLoaded
          : true;

        if (
          isItinerarySectionConditionSatisfied &&
          isReviewSectionConditionSatisfied
        ) {
          resolve(true);
          return true;
        }

        return false;
      };

      // If headings are already present, resolve the promise
      if (checkHeadings()) return;

      // Create a MutationObserver to watch for changes in the DOM
      const observer = new MutationObserver((_mutations, obs) => {
        if (checkHeadings()) {
          obs.disconnect(); // Stop observing once h6 elements are found
        }
      });

      // Start observing the tour description container for changes
      observer.observe(
        popupContainerRef.current!.querySelector('.tour-description')!,
        {
          childList: true,
        }
      );

      // Reject the promise once it times out
      setTimeout(() => {
        observer.disconnect();
        reject();
      }, 10000);
    });
  };

  const scrollToSection = async (index: number) => {
    if (!popupContainerRef.current) return;

    try {
      await checkForSections();
      const containerId = `product-card-popup-${tgid}`;
      const targetHeadingId = `description-heading-pos-${index}`;

      scroller.scrollTo(targetHeadingId, {
        duration: 300,
        delay: 0,
        smooth: true,
        offset: index === 0 ? -80 : -48,
        containerId,
      });

      setCurrentTabActiveIndexForPopup({
        index: index,
        isForcedChange: true,
      });

      const heading =
        popupContainerRef.current.querySelector<HTMLHeadingElement>(
          `#description-heading-pos-${index}`
        )!.innerText;

      trackEvent({
        eventName: ANALYTICS_EVENTS.INFO_TAB_CLICKED,
        [ANALYTICS_PROPERTIES.TGID]: tgid,
        [ANALYTICS_PROPERTIES.INFO_HEADING]: heading,
        [ANALYTICS_PROPERTIES.POSITION]: index + 1,
        [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Product Card',
        [ANALYTICS_PROPERTIES.SECTION]: 'Product List',
        ...getCommonEventMetaData(pageMetaData),
        ...getProductCommonProperties({
          primaryCategory,
          primaryCollection,
          primarySubCategory,
        }),
      });
    } catch (error) {
      return;
    }
  };

  const trackPopupScroll = debounce((offset: number) => {
    if (!popupContainerRef.current) return;

    const totalSize = popupContainerRef.current.clientHeight;
    const scrollTrack = popupScrollTracker;

    setIsUnScrolled(offset < 100);

    const isElementInScrollableView = (element: HTMLHeadingElement) => {
      if (!popupContainerRef.current) return false;

      const elementRect = element.getBoundingClientRect();
      const containerRect = popupContainerRef.current.getBoundingClientRect();
      return (
        elementRect.top >= containerRect.top &&
        elementRect.left >= containerRect.left &&
        elementRect.bottom <= containerRect.bottom &&
        elementRect.right <= containerRect.right
      );
    };

    let isIndexSet = false;

    Array.from(
      popupContainerRef.current.querySelectorAll<HTMLHeadingElement>(
        '.tour-description > h6'
      )
    ).forEach((heading, index) => {
      if (isIndexSet) return;

      if (isElementInScrollableView(heading)) {
        if (index !== currentTabActiveIndexForPopup.index) {
          setCurrentTabActiveIndexForPopup({
            index,
            isForcedChange: false,
          });
        }
        isIndexSet = true;
      }
    });

    if (
      Array.from(Object.values(popupScrollTracker)).reduce((p, c) => (c &&= p))
    )
      return;

    Object.keys(scrollTrack)
      .map((key) => Number(key))
      .forEach((threshold) => {
        if (scrollTrack[threshold as keyof typeof scrollTrack]) return;

        if ((offset * 100) / totalSize >= threshold) {
          trackEvent({
            eventName: ANALYTICS_EVENTS.MORE_DETAILS_SECTION_VIEWED,
            [ANALYTICS_PROPERTIES.PERCENTAGE_VIEWED]: threshold,
            [ANALYTICS_PROPERTIES.TGID]: tgid,
          });
          scrollTrack[threshold as keyof typeof scrollTrack] = true;
        }
      });
    setPopupScrollTracker(scrollTrack);
  }, 100);

  const primarySubCategoryId = (
    scorpioData?.primarySubCategory ?? primarySubCategory
  )?.id;

  const showGuidedTourDescriptor =
    !isGuidedTourSubcategory(primarySubCategoryId);

  const onRatingsCountClick = ({ isPopup }: { isPopup?: boolean }) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.RATINGS_WIDGET_CLICKED,
      [ANALYTICS_PROPERTIES.PLACEMENT]: isPopup
        ? PRODUCT_CARD_REVAMP.PLACEMENT.MORE_DETAILS
        : PRODUCT_CARD_REVAMP.PLACEMENT.PRODUCT_CARD,
      ...getProductCommonProperties({
        reviewsDetails,
      }),
    });

    const numberOfSections =
      tabs.length + (showItinerary && !isCruisesRevamp ? 1 : 0);

    if (!isPopup) {
      popupController.current?.open(numberOfSections);
      trackedToggleContent(false);
    } else {
      if (!popupContainerRef.current) return;
      scrollToSection(numberOfSections);
    }
  };

  const getProductCardElements = ({
    expandContent = false,
    isLoading = false,
    isPopup = false,
    forcedMobilePopup = false,
    isAsideBarOverlay = false,
  }) => {
    const showItinerarySection = showItinerary && (isPopup || isBot);
    const isEligibleForUGCSplitExperiment =
      MBS_REVIEWS_V2_ENABLED_DOMAINS.includes(uid) ||
      MBS_EXTENDED_REVIEWS_V2_ENABLED_DOMAINS.includes(uid);
    const showReviewSection =
      ((isBot && isEligibleForUGCSplitExperiment) ||
        (originalIsMobile ? expandContent && isPoiMwebCard : isPopup)) &&
      reviewsDetails?.showRatings;
    const mediaCarouselImageWidth = (isPopup ? originalIsMobile : isMobile)
      ? isBannerCard
        ? PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.bannerProductWidth
        : isPoiMwebCard
        ? PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.modified.width
        : PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.width
      : isModifiedProductCard || (isPopup && !originalIsMobile && isPoiMwebCard)
      ? PRODUCT_CARD_IMAGE_DIMENSIONS.DESKTOP.modified.width
      : undefined;

    const mediaCarouselImageHeight =
      (isPopup ? originalIsMobile : isMobile) &&
      !isBannerCard &&
      !isSpecialGuidedTour
        ? undefined
        : isModifiedProductCard ||
          (isPopup && !originalIsMobile && isPoiMwebCard)
        ? PRODUCT_CARD_IMAGE_DIMENSIONS.DESKTOP.modified.height
        : PRODUCT_CARD_IMAGE_DIMENSIONS.DESKTOP.height;

    const trackItineraryViewCTAClick = (activeItineraryData: TItinerary) => {
      const hasMapView = activeItineraryData?.map?.active;

      trackEvent({
        eventName: ANALYTICS_EVENTS.VIEW_ITINERARY_CLICKED,
        [ANALYTICS_PROPERTIES.CTA_TYPE]: 'Itinerary',
        [ANALYTICS_PROPERTIES.ITINERARY_TYPE]: activeItineraryData?.type,
        [ANALYTICS_PROPERTIES.HAS_MAP]: hasMapView,
        [ANALYTICS_PROPERTIES.TGID]: tgid,
      });
    };

    return (
      <>
        <StyledProductCard
          layout={layout({ isContentExpanded: expandContent })}
          isContentExpanded={expandContent}
          $isTicketCard={isTicketCard}
          isMobile={isPopup ? originalIsMobile : isMobile}
          $forceMobile={forceMobile && !isPopup}
          $isBannerCard={isBannerCard && !isSpecialGuidedTour && !isLoading}
          isV3Design={isV3Design}
          $isSwipeSheetOpen={expandContent}
          className="product-card"
          collapsed={
            (!expandContent && !isTicketCard) ||
            isModifiedProductCard ||
            (isPopup && !originalIsMobile && isPoiMwebCard)
          }
          defaultOpen={defaultOpen}
          $isPoiMwebCard={isPoiMwebCard}
          $isPopup={isPopup}
          $isSwiperCard={isSwiperCard}
          forcedMobilePopup={forcedMobilePopup}
          ref={productRef}
          $hasItineraryData={showItinerary}
          $isModifiedPopup={isModifiedPopup}
          $isNewVerticalsProductCard={
            isNewVerticalsProductCard && !isNonNewVerticalProductCard
          }
          $isModifiedProductCard={
            isModifiedProductCard ||
            (isPopup && !originalIsMobile && isPoiMwebCard) ||
            isAsideBarOverlay
          }
        >
          <Conditional if={boosterTypeIfShown && !isPopup}>
            <Booster
              type={BoosterType[boosterTypeIfShown as keyof typeof BoosterType]}
              rank={indexPosition + 1}
              isOverlay={isMobile ? expandContent : isAsideBarOverlay}
            />
          </Conditional>
          <Conditional
            if={
              (isPopup ? originalIsMobile : isMobile) &&
              isV3Design &&
              productImage &&
              !isPopup
            }
          >
            <div
              data-card-section={CARD_SECTION_MARKERS.IMAGE}
              className="card-img"
            >
              <Image
                data-card-section={CARD_SECTION_MARKERS.IMAGE}
                url={productImage}
                imageId="card-img"
                aspectRatio={
                  (isPopup ? originalIsMobile : isMobile) ? '16:10' : '3:4'
                }
                width={
                  (isPopup ? originalIsMobile : isMobile)
                    ? isPoiMwebCard
                      ? PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.modified.width
                      : PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.width
                    : undefined
                }
                height={
                  (isPopup ? originalIsMobile : isMobile)
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
          <Conditional if={!isTicketCard && images?.length && !isPopup}>
            <div className="card-img">
              <Conditional if={isGuidedTour && !isProductCardLoading}>
                <GuidedTourLabel>
                  <GuidedTourLabelBackground
                    isMobile={isPopup ? originalIsMobile : isMobile}
                  />
                  {strings.DESCRIPTORS.GUIDED_TOUR}
                </GuidedTourLabel>
              </Conditional>
              <Conditional if={!isLoading}>
                <MediaCarousel
                  showVideoOnProductCard={showVideoOnProductCard}
                  imageList={images?.slice(0, MEDIA_CAROUSEL_IMAGE_LIMIT)}
                  videoUrl={
                    showVideoOnProductCard
                      ? generateVideoExperimentVideoUrl(String(tgid))
                      : (isPopup ? originalIsMobile : isMobile) &&
                        isBannerCard &&
                        !showThumbnailInBanner
                      ? bannerVideo
                      : null
                  }
                  imageId="card-img"
                  imageAspectRatio={
                    (isPopup ? originalIsMobile : isMobile)
                      ? '16:10'
                      : isModifiedProductCard ||
                        (isPopup && !originalIsMobile && isPoiMwebCard)
                      ? '3:4'
                      : '5:6'
                  }
                  backgroundColor={COLORS.GRAY.G7}
                  imageWidth={mediaCarouselImageWidth}
                  imageHeight={mediaCarouselImageHeight}
                  isFirstProduct={isFirstProduct}
                  tgid={tgid}
                  isMobile={isPopup ? originalIsMobile : isMobile}
                  shouldCrop={shouldCropImage}
                  showOverlay
                  showPagination={!isNewVerticalsProductCard}
                  showTimedPaginator={isNewVerticalsProductCard}
                  isTimed={!isNewVerticalsProductCard}
                  uid={uid}
                  shouldBePlayingVideo={!isPopupOpen}
                  position={position}
                />
              </Conditional>
              <Conditional if={showSightsCoveredItineraryLayout}>
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
                  itineraryInfo={{
                    isSightsCoveredLayout: showSightsCoveredItineraryLayout,
                    itineraryData: tgidItineraryData,
                  }}
                />
              </Conditional>
              <Conditional
                if={
                  showItinerary &&
                  !isMobile &&
                  !showSightsCoveredItineraryLayout
                }
              >
                <ItineraryEntryPoint
                  onClick={async () => {
                    popupController.current?.open(2);
                    trackedToggleContent(false);
                    trackItineraryEntrypoint();
                  }}
                  isHOHOItinerary={isHohoItinerary}
                />
              </Conditional>
              <Conditional
                if={
                  showItinerary && isMobile && !showSightsCoveredItineraryLayout
                }
              >
                <MWebEntryPoint
                  onClick={() => {
                    openProductCardAside({ scrollToItinerarySection: true });
                    trackItineraryViewCTAClick(tgidItineraryData?.[0]);
                  }}
                  isHOHOItinerary={isHohoItinerary}
                />
              </Conditional>
              <Conditional if={isLoading}>
                <Skeleton height="100%" borderRadius={8} />
              </Conditional>
            </div>
          </Conditional>

          <ProductHeader>
            <Conditional if={!isV3Design}>
              <CategoryAndRatingContainer>
                <Conditional if={!isNonPoi}>
                  <Category
                    primaryCategory={
                      scorpioData?.primaryCategory ?? primaryCategory
                    }
                    primarySubCategory={
                      scorpioData?.primarySubCategory ?? primarySubCategory
                    }
                  />
                </Conditional>
                <Ratings
                  reviewsDetails={reviewsDetails}
                  onRatingsCountClick={
                    showPopup &&
                    !originalIsMobile &&
                    reviewsDetails?.showRatings
                      ? () => onRatingsCountClick({ isPopup })
                      : undefined
                  }
                />
              </CategoryAndRatingContainer>
            </Conditional>

            <TourTitle
              boosterTag={boosterTag}
              cardTitle={cardTitle}
              hasBorderedTitle={hasBorderedTitle}
              isContentOpen={isContentOpen}
              isLoading={isLoading}
              isMobile={isPopup ? originalIsMobile : isMobile}
              isOpenDated={isOpenDated}
              isTicketCard={isTicketCard}
              mbTheme={mbTheme}
              pageType={pageType}
              showAvailability={
                (isPopup ? originalIsMobile : isMobile)
                  ? showAvailabilityInTitleMobile
                  : showAvailabilityInTitle
              }
              tabs={tabs}
              earliestAvailability={earliestAvailability}
              currentLanguage={currentLanguage}
              isHOHORevamp={isNewVerticalsProductCard}
              forceMobile={forceMobile}
            />

            <Conditional
              if={
                showNextAvailable &&
                showEarliestAvailability &&
                !isOpenDated &&
                !((isPopup ? originalIsMobile : isMobile)
                  ? showAvailabilityInTitleMobile
                  : showAvailabilityInTitle) &&
                isPopup
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
                forceMobileStyles={forceMobile}
                isPopup={isPopup}
                flexible={isOpenDated}
              />
            </Conditional>
            <Conditional if={isModifiedPopup && isPopup}>
              <HorizontalDescriptors
                minDuration={minDuration}
                maxDuration={maxDuration}
                lang={currentLanguage}
                isMobile={isMobile}
                descriptorArray={descriptors}
                modifyAudioGuideDescriptor={showCruisesCombosRevamp}
              />
            </Conditional>
            <Conditional
              if={!isModifiedPopup && (mbTheme === THEMES.MIN_BLUE || isPopup)}
            >
              <ProductDescriptors
                isLoading={isLoading}
                customDescriptors={isModifiedPopup ? customDescriptors : []}
                allowClick={!isPopup}
                descriptorArray={!isModifiedPopup ? descriptorsList : []}
                pageType={pageType}
                minDuration={minDuration}
                maxDuration={maxDuration}
                lang={currentLanguage}
                isCombo={isCombo}
                isGpMotorTicketsMb={isGpMotorTicketsMb}
                horizontal={isPopup ? true : !isTicketCard && isMobile}
                showIcons={isTicketCard || !isMobile}
                cancellationPolicy={cancellationPolicy}
                cancellationPolicyHoverCallBack={trackCancellationPolicyHover}
                flexibleCancellationHoverCallBack={
                  trackFlexibleCancellationPolicyHover
                }
                showFlexiCancellationDescriptor={
                  flexiCancellationExperimentVariant === VARIANTS.TREATMENT
                }
                showGuidedTourDescriptor={showGuidedTourDescriptor}
                forceMobile={forceMobile}
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
            <Conditional if={!isPopup}>
              <CTAContainer pageType={pageType} $forceMobile={forceMobile}>
                <PriceContainer
                  pageType={pageType}
                  $forceMobile={forceMobile}
                  $isTicketCard={isTicketCard}
                >
                  <PriceBlock
                    isMobile={isPopup ? originalIsMobile : isMobile}
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
                    newDiscountTagDesignProps
                  />
                </PriceContainer>
                <Conditional if={isTicketCard && promo_code}>
                  <PromoCodeBlock
                    {...props}
                    isTicketCardDetailPopup
                    currencyCode={finalListingPrice?.currencyCode ?? ''}
                  />
                </Conditional>
                <Conditional if={!isLoading}>
                  <CTABlock
                    isSticky={expandContent}
                    shouldOffset={
                      earliestAvailability && mbTheme === THEMES.MIN_BLUE
                    }
                    $isTicketCard={isTicketCard}
                    $forceMobile={forceMobile}
                  >
                    <Conditional if={!isCombo}>
                      <a
                        target={originalIsMobile ? '_self' : '_blank'}
                        href={productBookingUrl}
                      >
                        <BookNowCta
                          clickHandler={() =>
                            sendBookNowEvent(
                              horizontalProductCard || verticalProductCard
                                ? typeOfProductCard
                                : expandContent
                                ? PRODUCT_CARD_REVAMP.PLACEMENT.SWIPESHEET
                                : PRODUCT_CARD_REVAMP.PLACEMENT.PRODUCT_CARD
                            )
                          }
                          isMobile={originalIsMobile}
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
                            horizontalProductCard || verticalProductCard
                              ? typeOfProductCard
                              : expandContent
                              ? PRODUCT_CARD_REVAMP.PLACEMENT.SWIPESHEET
                              : PRODUCT_CARD_REVAMP.PLACEMENT.PRODUCT_CARD
                          )
                        }
                        isMobile={isPopup ? originalIsMobile : isMobile}
                        mbTheme={mbTheme}
                        ctaText={getBookNowButtonText()}
                      />
                    </Conditional>
                  </CTABlock>
                </Conditional>
                <Conditional
                  if={
                    showNextAvailable &&
                    showEarliestAvailability &&
                    (!isOpenDated || forceMobile) &&
                    !((isPopup ? originalIsMobile : isMobile)
                      ? showAvailabilityInTitleMobile
                      : showAvailabilityInTitle) &&
                    !isPopup
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
                    forceMobileStyles={forceMobile}
                    flexible={isOpenDated}
                  />
                </Conditional>
                <Conditional
                  if={
                    (isPopup ? originalIsMobile : isMobile) &&
                    isSpecialGuidedTour
                  }
                >
                  <GuidesBanner isInSwipeSheet />
                </Conditional>
                <Conditional
                  if={
                    (isPopup ? originalIsMobile : isMobile) &&
                    !expandContent &&
                    isSpecialGuidedTour
                  }
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
                <Conditional
                  if={
                    isOpenDated &&
                    (isPopup ? originalIsMobile : isMobile) &&
                    !forceMobile
                  }
                >
                  <OpenDatedDescriptor forceMobile={forceMobile}>
                    <Emoji symbol="😇" label="blessed-face" />{' '}
                    {strings.OPEN_DATED_DESCRIPTOR}
                  </OpenDatedDescriptor>
                </Conditional>
                <Conditional if={mbTheme !== THEMES.MIN_BLUE && !isPopup}>
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
                      (!(isPopup ? originalIsMobile : isMobile) ||
                        expandContent) &&
                      isSpecialGuidedTour
                    }
                    uid={uid}
                    horizontal={isPopup ? true : !isTicketCard && isMobile}
                    showIcons={isTicketCard || !isMobile}
                    cancellationPolicy={cancellationPolicy}
                    cancellationPolicyHoverCallBack={
                      trackCancellationPolicyHover
                    }
                    flexibleCancellationHoverCallBack={
                      trackFlexibleCancellationPolicyHover
                    }
                    showFlexiCancellationDescriptor={
                      flexiCancellationExperimentVariant === VARIANTS.TREATMENT
                    }
                    isMobile={isPopup ? originalIsMobile : isMobile}
                    showGuidedTourDescriptor={showGuidedTourDescriptor}
                    forceMobile={forceMobile}
                  />
                </Conditional>
              </CTAContainer>
            </Conditional>
          </ProductHeader>
          <Conditional
            if={!(isPopup ? originalIsMobile : isMobile) && !isPopup}
          >
            <HorizontalLine colorProp={COLORS.GRAY.G6} />
          </Conditional>
          <ProductBody
            hasReadMore={
              showMoreDetailsInTabs &&
              !defaultOpen &&
              !isSpecialGuidedTour &&
              !(
                isModifiedProductCard ||
                (isPopup && !originalIsMobile && isPoiMwebCard)
              )
            }
            collapsed={
              (!expandContent &&
                !isTicketCard &&
                !(
                  isModifiedProductCard ||
                  (isPopup && !originalIsMobile && isPoiMwebCard)
                )) ||
              (!expandContent && isNewVerticalsProductCard)
            }
            defaultOpen={!!isPopUpOnly}
            maxHeight={maxProductBodyHeight}
            ref={collapsibleContentRef}
            $forceMobile={forceMobile}
            $isPopup={isPopup}
            $isV3Design={isV3Design}
          >
            <Conditional
              if={
                !isTicketCard ||
                (isTicketCard && !(isPopup ? originalIsMobile : isMobile)) ||
                (isTicketCard && expandContent)
              }
            >
              <div
                className={'tour-description'}
                id={`tour-description-${position}`}
                // @ts-expect-error TS(2322): Type '((e: MouseEvent<HTMLDivElement, MouseEvent>)... Remove this comment to see the full error message
                onClick={
                  !(isPopup ? originalIsMobile : isMobile) &&
                  !defaultOpen &&
                  !isModifiedProductCard &&
                  !isPopup &&
                  showPopup
                    ? (e: any) => {
                        e.stopPropagation();
                        if (showPopup) {
                          setIsUnScrolled(true);
                          popupController.current?.open(activeTabIndex);
                          trackedToggleContent(false);
                        } else {
                          toggleContentOpen(!isContentOpen);
                          trackedToggleContent(isContentOpen);
                        }
                      }
                    : null
                }
              >
                <Conditional if={isSpecialGuidedTour && !isPopup}>
                  <SpecialGuidedTourSummary
                    moreDetailsCTA={getMoreDetailsButton()}
                  />
                </Conditional>
                <Conditional if={hasHighlights || isPopup || isBot}>
                  <Conditional
                    if={
                      !isModifiedPopup ||
                      (isModifiedPopup &&
                        showCruisesCombosRevamp &&
                        isNonCruiseProduct)
                    }
                  >
                    <PrismicRichText
                      field={
                        isPopup
                          ? highlightsAndInclusionsRichText
                          : highlights || []
                      }
                      components={shortCodeSerializer}
                    />
                  </Conditional>
                  <Conditional if={showItinerarySection && !isCruisesRevamp}>
                    <ItineraryProvider>
                      <Itinerary
                        itineraryData={tgidItineraryData}
                        lang={currentLanguage}
                        isHohoItinerary={isHohoItinerary}
                      />
                    </ItineraryProvider>
                  </Conditional>
                  <Conditional if={showSightsCoveredItineraryLayout && details}>
                    <PrismicRichText
                      field={inclusionsRichText}
                      components={shortCodeSerializer}
                    />
                    <SightsCovered
                      itineraryData={tgidItineraryData!}
                      isCruisesRevamp={isCruisesRevamp}
                    />
                  </Conditional>
                  <Conditional if={isModifiedPopup}>
                    <InclusionsExclusions
                      inclusionsExclusions={inclusionsExclusions}
                    />
                    <Conditional if={details?.cruiseMenus}>
                      <MenuSection
                        menuData={details?.cruiseMenus}
                        tgid={tgid}
                        rank={position}
                      />
                    </Conditional>
                    <Conditional if={details}>
                      <SightsCovered
                        itineraryData={tgidItineraryData!}
                        isCruisesRevamp={isCruisesRevamp}
                      />
                    </Conditional>
                    <PrismicRichText
                      field={
                        isPopup
                          ? everyRichTextExceptInclusions
                          : highlights || []
                      }
                      components={shortCodeSerializer}
                    />
                  </Conditional>
                  <Conditional if={!isModifiedPopup && !originalIsMobile}>
                    <PrismicRichText
                      field={
                        isPopup
                          ? showSightsCoveredItineraryLayout
                            ? everyRichTextExceptInclusions
                            : everyRichTextExceptHighlightsAndInclusions
                          : highlights || []
                      }
                      components={shortCodeSerializer}
                    />
                  </Conditional>
                </Conditional>
                <Conditional
                  if={!isPopup && tabs.length && !isSpecialGuidedTour}
                >
                  {highlightTabs}
                </Conditional>
                <Conditional if={showReviewSection}>
                  <ReviewSection
                    reviewsDetails={reviewsDetails}
                    tgid={tgid}
                    topReviews={topReviews}
                    showExternalButton={
                      !MBS_EXTENDED_REVIEWS_V2_ENABLED_DOMAINS.includes(uid)
                    }
                    isBot={isBot}
                  />
                </Conditional>
              </div>
            </Conditional>
            <Conditional
              if={
                !isMobile &&
                (showMoreDetailsInTabs || showPopup) &&
                !defaultOpen &&
                !isPopup &&
                !isSpecialGuidedTour &&
                !(
                  isModifiedProductCard ||
                  (isPopup && !originalIsMobile && isPoiMwebCard)
                ) &&
                !isLoading
              }
            >
              {getMoreDetailsButton()}
            </Conditional>
          </ProductBody>
          <Conditional
            if={
              !defaultOpen &&
              (isPopup ? originalIsMobile : isMobile) &&
              !expandContent &&
              !(
                isModifiedProductCard ||
                (isPopup && !originalIsMobile && isPoiMwebCard)
              ) &&
              !isLoading
            }
          >
            {getMoreDetailsButton()}
          </Conditional>
        </StyledProductCard>
        <Conditional
          if={
            !isMobile && isComboWithMultiVariant && showComboVariant && !isPopup
          }
        >
          <ComboPopup
            productTitle={cardTitle}
            l1Booster={boosterTag}
            tgid={tgid}
            isMobile={originalIsMobile}
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

  const getProductCardPopup = (defaultOpen = false) => (
    <Popup
      controller={popupController}
      tgid={tgid}
      scrollToSection={scrollToSection}
      onStateChange={(isOpen) => {
        setIsPopupOpen(isOpen);
        if (!isOpen) onPopupClosed?.();
      }}
      slideUp={isNewVerticalsProductCard}
      defaultOpen={defaultOpen}
      scrollToIndex={scrollToIndex}
    >
      <PopupContainer
        onScroll={(e: any) => {
          if (!e.currentTarget) return;
          trackPopupScroll(e.currentTarget.scrollTop);
        }}
        ref={popupContainerRef}
        tabIndex={0}
        id={`product-card-popup-${tgid}`}
      >
        <Conditional if={images}>
          <div className="card-img">
            <ExpandedGallery
              images={images}
              videoUrl={
                showVideoOnProductCard
                  ? generateVideoExperimentVideoUrl(String(tgid))
                  : null
              }
              controller={imageGalleryController}
            />
          </div>
        </Conditional>
        {getProductCardElements({
          expandContent: isContentOpen,
          isLoading: isProductCardLoading,
          isPopup: true,
        })}
      </PopupContainer>
      <NavigationBar
        tabs={tabs}
        currentActiveIndex={currentTabActiveIndexForPopup.index}
        isVisible={!isUnScrolled}
        onItemClick={scrollToSection}
        isReviewsSectionPresent={reviewsDetails?.showRatings}
        isItinerarySectionPresent={!isCruisesRevamp && showItinerary}
        isHohoItinerary={isHohoItinerary}
      />
      <CloseButtonContainer>
        <CloseButton
          isHighlighted={isUnScrolled}
          onClick={() => {
            popupController.current?.close(true);
          }}
        />
      </CloseButtonContainer>

      <PopupPricingUnit>
        <CTAContainer pageType={pageType}>
          <SlideUpContainer
            $isTitleVisible={!isUnScrolled}
            ref={priceblockTitleContainerRef}
          >
            <SlideUpTitle
              $maxWidth={priceblockTitleContainerRef?.current?.clientWidth}
            >
              {cardTitle}
            </SlideUpTitle>
          </SlideUpContainer>
          <PriceContainer pageType={pageType}>
            <PriceBlock
              isMobile={isMobile}
              isLoading={isProductCardLoading}
              isSportsExperiment={isSportsExperiment}
              showScratchPrice={showScratchPrice}
              listingPrice={finalListingPrice}
              lang={currentLanguage}
              showSavings
              id={tgid}
              prefix
              key={'price-block'}
              wrapperRef={priceBlockWrapperRef}
              newDiscountTagDesignProps={{ shouldPointLeft: true }}
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
            isSticky={false}
            shouldOffset={earliestAvailability && mbTheme === THEMES.MIN_BLUE}
            $isTicketCard={isTicketCard}
          >
            <Conditional if={!isCombo}>
              <a
                target={originalIsMobile ? '_self' : '_blank'}
                href={productBookingUrl}
                rel="nofollow noreferrer"
              >
                <BookNowCta
                  clickHandler={() => {
                    sendBookNowEvent(PRODUCT_CARD_REVAMP.PLACEMENT.POPUP);
                  }}
                  isMobile={originalIsMobile}
                  mbTheme={mbTheme}
                  ctaText={getBookNowButtonText()}
                />
              </a>
            </Conditional>
            <Conditional if={isCombo}>
              <BookNowCta
                showLoadingState={false}
                clickHandler={() => {
                  popupController.current?.close();
                  setTimeout(() => {
                    handleShowComboPopup(PRODUCT_CARD_REVAMP.PLACEMENT.POPUP);
                  }, 300);
                }}
                isMobile={isMobile}
                mbTheme={mbTheme}
                ctaText={getBookNowButtonText()}
              />
            </Conditional>
          </CTABlock>
          <Conditional if={isMobile && isSpecialGuidedTour}>
            <GuidesBanner isInSwipeSheet />
          </Conditional>
          <Conditional if={isOpenDated && isMobile}>
            <OpenDatedDescriptor>
              <Emoji symbol="😇" label="blessed-face" />{' '}
              {strings.OPEN_DATED_DESCRIPTOR}
            </OpenDatedDescriptor>
          </Conditional>
        </CTAContainer>
      </PopupPricingUnit>
    </Popup>
  );

  if (isPopUpOnly) return getProductCardPopup(true);

  const ProductCard = (
    <Container
      isV3Design={isV3Design}
      indexPosition={indexPosition}
      isCardVisible={getIsCardVisible()}
      isSwiperCard={isSwiperCard}
    >
      <Conditional if={isV3Design}>
        <div className="indicator-triangle"></div>
      </Conditional>
      <Conditional
        if={
          isNewVerticalsProductCard &&
          isNonNewVerticalProductCard &&
          !isMobile &&
          indexPosition === nonNewVerticalIndex &&
          !showCruisesCombosRevamp
        }
      >
        <h2 className="combo-section-heading" ref={combosSectionRef}>
          {isCruisesRevamp
            ? strings.CRUISES.COMBO_HEADING
            : strings.HOHO.COMBO_DWEB_TITLE}
        </h2>
      </Conditional>
      <Conditional
        if={
          !isNewVerticalsProductCard ||
          (isNewVerticalsProductCard &&
            isNonNewVerticalProductCard &&
            !isMobile &&
            !showCruisesCombosRevamp) ||
          (isNewVerticalsProductCard &&
            isNonNewVerticalProductCard &&
            isMobile &&
            isSwiperCard)
        }
      >
        {getProductCardElements({
          expandContent: isContentOpen,
          isLoading: isProductCardLoading,
        })}
      </Conditional>
      <Conditional
        if={isNewVerticalsProductCard && !isNonNewVerticalProductCard}
      >
        <NewVerticalsProductCard
          {...props}
          isMobile={isMobile}
          onClick={() => {
            trackedToggleContent(false);
            popupController.current?.open();
            setIsUnScrolled(true);
          }}
          onMoreDetailsClick={onMoreDetailsClick}
          onRatingsCountClick={onRatingsCountClick}
          getMoreDetailsButton={getMoreDetailsButton}
          setCustomDescriptors={setCustomDescriptors}
          shouldRunHohoRevampExperiment={shouldRunHohoRevampExperiment}
          handleShowComboPopup={handleShowComboPopup}
          comboPopup={
            <Conditional
              if={!isMobile && isComboWithMultiVariant && showComboVariant}
            >
              <ComboPopup
                productTitle={cardTitle}
                l1Booster={boosterTag}
                tgid={tgid}
                isMobile={originalIsMobile}
                closeHandler={handleCloseComboPopup}
                descriptors={descriptorsList}
                bookingUrl={productBookingUrl}
                minDuration={minDuration}
                maxDuration={maxDuration}
              />
            </Conditional>
          }
        />
      </Conditional>
      <Conditional if={showPopup}>{getProductCardPopup(false)}</Conditional>
    </Container>
  );

  if (showNewCard)
    return (
      <ProductCardProvider>
        <ItineraryProvider>
          <ExperimentalProductCard
            {...props}
            handleShowComboPopup={handleShowComboPopup}
            sendBookNowEvent={sendBookNowEvent}
            isSportsSubCategory={isSportsSubCategory}
            showThumbnailInBanner={showThumbnailInBanner}
            defaultOpen={true}
          />
        </ItineraryProvider>
      </ProductCardProvider>
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
            highlightTabsComponent={highlightTabs}
            descriptorsList={descriptorsList}
            minDuration={minDuration}
            maxDuration={maxDuration}
            lang={currentLanguage}
            showScratchPrice={showScratchPrice}
            listingPrice={finalListingPrice}
            onBookNowClick={sendBookNowEvent}
            showAvailabilityInTitle={
              getEarliestAvailableDate({
                date: earliestAvailability?.startDate,
                currentLanguage,
              }) === strings.TODAY
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
