import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRecoilValue } from 'recoil';
import {
  type Itinerary as TItinerary,
  ItineraryType,
} from 'types/itinerary.type';
import { HorizontalProductCardMweb } from 'components/Espeon/HorizontalProductCard/components/HorizontalProductCardMweb';
import Product from 'components/Product';
import { ItineraryProvider } from 'contexts/ItineraryContext';
import { MBContext } from 'contexts/MBContext';
import { ProductCardProvider } from 'contexts/productCardContext';
import { trackEvent } from 'utils/analytics';
import { isItineraryValid } from 'utils/itinerary';
import { getProductDescriptors } from 'utils/productUtils';
import { currencyListAtom } from 'store/atoms/currencyList';
import { SWIPESHEET_STATES } from 'const/productCard';
import { strings } from 'const/strings';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  COLLECTION_PAGE,
  LAYOUT_STYLE,
  PAGE_TYPES,
  SIDEBAR_TYPES,
} from 'constants/index';
import Conditional from './common/Conditional';
import ExperimentalProductCard from './experimentalProductCard';

interface Props {
  id: number;
  productCardInfo: any;
  cityInfo: {
    cityCode: string;
    country: {
      displayName: string;
    };
    displayName: string;
    timeZone: string;
  };
  lang: any;
  hsid: any;
  currentCityCode: string;
  currenciesMap: Record<string, any>;
  productCardPosition: number;
  // TTD pinned card
  userPickPinnedCard?: boolean;
  isDesktop?: boolean;
  showMetaLabel?: boolean;
  overrideDescriptors?: boolean;
  pageType?: typeof PAGE_TYPES;
  onInfoClick?: (productId: number) => void;
  scorpioData: Record<string, any>;
  collectionsInfo?: any;
  isSpecialGuidedTour?: boolean;
}

interface Currency {
  code: string;
}

const CollectionProductCardComponent = (props: Props) => {
  const [isTrackerInitialized, setIsTrackerInitialized] = useState(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [showItineraryPopup, setShowItineraryPopup] = useState(false);

  const carouselImageTrackState = useRef(
    Array(props?.productCardInfo?.media?.productImages?.length ?? 0).map(
      () => false
    )
  );

  const {
    productCardInfo: productCardInfoProps,
    lang,
    cityInfo,
    currentCityCode,
    userPickPinnedCard = false,
    productCardPosition,
    onInfoClick,
    isDesktop = false,
    showMetaLabel = true,
    overrideDescriptors = false,
    pageType = PAGE_TYPES.COLLECTION,
    scorpioData,
    id,
    isSpecialGuidedTour,
  } = props;

  let productCardInfo = productCardInfoProps;

  useEffect(() => {
    if (!isTrackerInitialized) setIsTrackerInitialized(true);
  }, []);

  const currencyList = useRecoilValue(currencyListAtom);
  const currenciesMap: Record<string, Currency> = currencyList.reduce(
    (acc, curr) => {
      acc[curr.code] = curr;
      return acc;
    },
    {} as Record<string, Currency>
  );

  const mbContext = useContext(MBContext);
  const {
    isDev,
    sidebarModal: { addToAside, closeAside },
  } = mbContext;

  const trackCardContentClicked = (section?: string) => {
    let eventsData = {
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: Number(productId),
      [ANALYTICS_PROPERTIES.POSITION]: productCardPosition,
    };

    if (section) {
      eventsData['Card Area Clicked'] = section;
    }

    if (pageType === PAGE_TYPES.DAY_TRIPS_COLLECTION) {
      const {
        primaryCollection: {
          id: collectionId = '',
          displayName: collectionName = '',
        } = { id: '', displayName: '' },
        ratings: { value: averageRating = 0 } = {},
      } = productCardInfo;

      eventsData = {
        ...eventsData,
        ...{
          [ANALYTICS_PROPERTIES.RANKING]: productCardPosition,
          [ANALYTICS_PROPERTIES.SECTION]: COLLECTION_PAGE.CURATED_EXPERIENCES,
          [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: productCardInfo.name,
          [ANALYTICS_PROPERTIES.CARD_TYPE]: LAYOUT_STYLE.GRID,
          [ANALYTICS_PROPERTIES.COLLECTION_ID]: collectionId,
          [ANALYTICS_PROPERTIES.COLLECTION_NAME]: collectionName,
          [ANALYTICS_PROPERTIES.AVERAGE_RATING]: averageRating,
        },
      };
    }

    trackEvent(eventsData);
  };

  const trackMediaSwiper = useCallback((index: number) => {
    if (carouselImageTrackState.current[index]) return;
    const { cityDisplayName } = productCardInfo;

    trackEvent({
      eventName: 'Product Card Image Carousel Clicked',
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.TGID]: Number(productId),
      [ANALYTICS_PROPERTIES.CITY]: cityDisplayName,
      [ANALYTICS_PROPERTIES.COUNTRY]: cityInfo?.country?.displayName,
      [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
    });
    carouselImageTrackState.current[index] = true;
  }, []);

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (isDesktop) {
      setIsPopUpOpen(true);
    } else {
      openProductCardAside({ scrollToItinerarySection: false });
    }

    trackCardContentClicked();
  };

  const handleItineraryCTAClick: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.stopPropagation();
    event.preventDefault();
    if (isDesktop) {
      setIsPopUpOpen(true);
      setShowItineraryPopup(true);
    } else {
      openProductCardAside({ scrollToItinerarySection: true });
    }
  };

  const handleMoreInfo: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.stopPropagation();
    event.preventDefault();
    trackEvent({
      eventName: 'Product Card More Info Clicked',
    });
    onInfoClick?.(productId);
  };

  const sendBookNowEvent = (placement?: string) => {
    const placementProperty = placement
      ? {
          [ANALYTICS_PROPERTIES.PLACEMENT]: placement,
        }
      : {};
    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: Number(productId),
      [ANALYTICS_PROPERTIES.POSITION]: productCardPosition,
      ...placementProperty,
    });
  };

  if (!productCardInfo) return null;

  const {
    id: productId,
    primaryCollection,
    primaryCategory,
    primarySubCategory,
    name,
    descriptors,
    microBrandsHighlight,
    reviewsDetails,
    topReviews,
    experienceItineraryIds = [],
    media,
    productUrl,
  } = productCardInfo;
  const { productImages } = media;
  const images = productImages.reduce((acc: any, image: any) => {
    acc.push({
      ...image,
      alt: image.altText,
    });

    return acc;
  }, []);

  const sheetProps = {
    tgid: id,
    tourPrices: scorpioData,
    scorpioData: {
      ...productCardInfo,
      images,
    },
    primaryCollection,
    primaryCategory,
    primarySubCategory,
    lang,
    cityInfo,
    currentCityCode,
    userPickPinnedCard,
    isDesktop,
    showMetaLabel,
    overrideDescriptors,
    isDev,
    reviewsDetails,
    topReviews,
    pageType,
    isPoiMwebCard: true,
    flowType: productCardInfo?.flowType,
    earliestAvailability: productCardInfo?.earliestAvailability,
    ...mbContext,
  };

  const openProductCardAside = (
    args: {
      scrollToItinerarySection?: boolean;
    } | void
  ) => {
    const { scrollToItinerarySection = false } = args || {};
    const { itineraryData = {} } = scorpioData;
    const { itineraries } = itineraryData;

    const itineraryDataMap: Record<string | number, TItinerary> =
      itineraries?.reduce(
        (prev: Record<string | number, TItinerary>, curr: TItinerary) => {
          prev[curr.id] = curr;
          return prev;
        },
        {}
      );

    const tgidItineraryData = experienceItineraryIds.reduce(
      (acc: Array<TItinerary>, id: string) => {
        const itinerary = itineraryDataMap[id];
        if (itinerary && isItineraryValid(itinerary)) {
          acc.push(itinerary);
        }
        return acc;
      },
      [] as Array<TItinerary>
    );

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
              {...sheetProps}
              showJustDrawer={true}
              scrollToItinerarySection={scrollToItinerarySection}
              tgidItineraryData={tgidItineraryData}
              sendBookNowEvent={sendBookNowEvent}
            />
          </ItineraryProvider>
        </ProductCardProvider>
      ),
      type: SIDEBAR_TYPES.PRODUCT_CARD,
      onCloseCallback: () => {
        setIsPopUpOpen(false);
        setShowItineraryPopup(false);
      },
      tgid: id,
      isProductCardTracking: true,
      history: {
        enable: true,
        params: {
          pid: id,
          popup: 'details',
        },
      },
    });
  };

  const { itineraryData = {} } = scorpioData;
  const { itineraries } = itineraryData;

  const itineraryDataMap: Record<string | number, TItinerary> =
    itineraries?.reduce(
      (prev: Record<string | number, TItinerary>, curr: TItinerary) => {
        prev[curr.id] = curr;
        return prev;
      },
      {}
    );

  const tgidItineraryData = experienceItineraryIds.reduce(
    (acc: Array<TItinerary>, id: string) => {
      const itinerary = itineraryDataMap[id];
      if (itinerary && isItineraryValid(itinerary)) {
        acc.push(itinerary);
      }
      return acc;
    },
    [] as Array<TItinerary>
  );

  const showItinerary =
    !!tgidItineraryData?.length &&
    tgidItineraryData.findIndex((itinerary: TItinerary) =>
      isItineraryValid(itinerary)
    ) !== -1;

  const isHohoItinerary =
    showItinerary && tgidItineraryData[0].type === ItineraryType.HOHO;

  const showSightsCoveredItineraryLayout = false;

  const childProps = {
    ...props,
    ...mbContext,
    tgid: id,
    scorpioData: {
      ...productCardInfo,
      images,
    },
    tourPrices: scorpioData,
    descriptors: getProductDescriptors({
      descriptors,
      filterOut: isSpecialGuidedTour ? ['GUIDED_TOUR', 'AUDIO_GUIDE'] : null,
    }),
    productTitle: name,
    title: name,
    highlights: microBrandsHighlight,
    reviewsDetails,
    topReviews,
    isMobile: !isDesktop,
    flowType: productCardInfo?.flowType,
    earliestAvailability: productCardInfo?.earliestAvailability,
    itineraryInfo: {
      data: tgidItineraryData,
      showData: showItinerary && !showSightsCoveredItineraryLayout,
      isHOHO: isHohoItinerary,
      showSightsCoveredItineraryLayout:
        showSightsCoveredItineraryLayout &&
        !!tgidItineraryData?.length &&
        tgidItineraryData.findIndex((itinerary: TItinerary) =>
          isItineraryValid(itinerary)
        ) !== -1,
    },
  };

  return (
    <>
      <HorizontalProductCardMweb
        isDesktop={isDesktop}
        productUrl={productUrl}
        lang={lang}
        tour={productCardInfo}
        currenciesMap={currenciesMap}
        isPinnedCard={userPickPinnedCard}
        labels={{
          mainCta: strings.CHECK_AVAIL,
          highlightsMoreDetails: strings.MORE_DETAILS,
          ratingsNew: strings.NEW,
          pricing: {
            from: strings.FROM,
            offPercentage: strings.OFF_PERCENT,
            cashbackText: strings.GET_CASHBACK,
          },
          more: '',
          yourPick: strings.ENTERTAINMENT_MB_LANDING_PAGE.YOUR_PICK,
          descriptors: {
            FREE_CANCELLATION: strings.DESCRIPTORS.FREE_CANCELLATION,
            EXTENDED_VALIDITY: strings.DESCRIPTORS.EXTENDED_VALIDITY,
            INSTANT_CONFIRMATION: strings.DESCRIPTORS.INSTANT_CONFIRMATION,
            MOBILE_TICKET: strings.DESCRIPTORS.MOBILE_TICKET,
            DURATION: strings.DESCRIPTORS.DURATION,
            FLEXIBLE_DURATION: strings.DESCRIPTORS.FLEXIBLE_DURATION,
            FLEXIBLE_DURATION_LABEL: strings.DESCRIPTORS.FLEXIBLE_DURATION,
            AUDIO_GUIDE: strings.DESCRIPTORS.AUDIO_GUIDE,
            GUIDED_TOUR: strings.DESCRIPTORS.GUIDED_TOUR,
            TRANSFERS: strings.DESCRIPTORS.TRANSFERS,
            HOTEL_PICKUP: strings.DESCRIPTORS.HOTEL_PICKUP,
            MEALS_INCLUDED: strings.DESCRIPTORS.MEALS_INCLUDED,
          },
          longDescriptorTexts: {
            FREE_CANCELLATION_HOURS: strings.CANCELLATION_POLICY.CANCELLABLE,
            FREE_CANCELLATION_DAYS:
              strings.CANCELLATION_POLICY.CANCELLABLE_DAYS,
          },
        }}
        productCardPosition={productCardPosition}
        onCardClick={handleClick}
        onSwiperChange={trackMediaSwiper}
        showMetaLabel={showMetaLabel}
        overrideDescriptors={overrideDescriptors}
        onMoreInfoClick={onInfoClick ? handleMoreInfo : undefined}
        showItineraryCTA={showItinerary}
        onItineraryCTAClick={handleItineraryCTAClick}
      />

      <Conditional if={isDesktop && (isPopUpOpen || showItineraryPopup)}>
        <Product
          {...childProps}
          isPopUpOnly={true}
          onPopupClosed={() => {
            setIsPopUpOpen(false);
            setShowItineraryPopup(false);
          }}
          scrollToIndex={showItineraryPopup ? 2 : -1}
        />
      </Conditional>
    </>
  );
};

const CollectionProductCard = (props: any) => {
  const { id, scorpioData } = props;
  const productCardInfo = scorpioData[id];

  return (
    <CollectionProductCardComponent
      productCardInfo={productCardInfo}
      {...props}
    />
  );
};

export default CollectionProductCard;
