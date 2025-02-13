// @ts-nocheck
import React, {
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from 'react';
import { withRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import {
  type Itinerary as TItinerary,
  ItineraryType,
} from 'types/itinerary.type';
import parse from 'url-parse';
import Conditional from 'components/common/Conditional';
import { HorizontalProductCardDweb } from 'components/Espeon/HorizontalProductCard/components/HorizontalProductCardDweb';
import Product from 'components/Product';
import { MBContext } from 'contexts/MBContext';
import { createBookingURL } from 'utils';
import { trackEvent } from 'utils/analytics';
import { isItineraryValid } from 'utils/itinerary';
import { getProductDescriptors } from 'utils/productUtils';
import { currencyAtom } from 'store/atoms/currency';
import { hsidAtom } from 'store/atoms/hsid';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  COLLECTION_PAGE,
  LAYOUT_STYLE,
  PAGE_TYPES,
  TLANGUAGELOCALE,
} from 'const/index';
import { strings } from 'const/strings';

interface Props {
  productCardInfo: any;
  cityInfo: {
    cityCode: string;
    country: {
      displayName: string;
    };
    displayName: string;
    timeZone: string;
  };
  lang: string;
  hsid: any;
  currenciesMap: Record<string, TCurrency>;
  currentCityCode: string;
  productCardPosition: number;
  //ttd pinned card
  userPickPinnedCard?: boolean;
  showMetaLabel?: boolean;
  overrideDescriptors?: boolean;
  lineClampDefault?: number;
  pageType?: typeof PAGE_TYPES;
  collectionsInfo?: any;
  onMoreInfoClick?: () => {};
  isSpecialGuidedTour?: boolean;
}

const FullWidthProductCardComponent = (props: Props) => {
  const currency = useRecoilValue(currencyAtom);
  const [isTrackerInitialized, setIsTrackerInitialized] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showItineraryPopup, setShowItineraryPopup] = useState(false);
  const {
    productCardInfo,
    cityInfo,
    userPickPinnedCard = false,
    productCardPosition,
    showMetaLabel = true,
    overrideDescriptors = false,
    lineClampDefault,
    pageType = PAGE_TYPES.COLLECTION,
    collectionsInfo,
    onMoreInfoClick,
    scorpioData,
    isSpecialGuidedTour,
  } = props;

  const hsid = useRecoilValue(hsidAtom);
  const mbContext = useContext(MBContext);

  useEffect(() => {
    if (!isTrackerInitialized) setIsTrackerInitialized(true);
  }, [isTrackerInitialized]);

  if (!productCardInfo) return null;

  const { id: productId } = productCardInfo;

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
      const { ratings: { value: averageRating } = {} } = productCardInfo;

      const { id: collectionId, name: collectionName } = collectionsInfo || {};

      eventsData = {
        ...eventsData,
        ...{
          [ANALYTICS_PROPERTIES.RANKING]: productCardPosition,
          [ANALYTICS_PROPERTIES.SECTION]: COLLECTION_PAGE.CURATED_EXPERIENCES,
          [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: productCardInfo.name,
          [ANALYTICS_PROPERTIES.CARD_TYPE]: LAYOUT_STYLE.FULL_WIDTH,
          [ANALYTICS_PROPERTIES.COLLECTION_ID]: collectionId,
          [ANALYTICS_PROPERTIES.COLLECTION_NAME]: collectionName,
          [ANALYTICS_PROPERTIES.AVERAGE_RATING]: averageRating,
        },
      };
    }

    trackEvent(eventsData);
  };

  const trackMediaNavClicked = (index: number) => {
    const { cityDisplayName } = productCardInfo;

    trackEvent({
      eventName: 'Product Card Image Carousel Clicked',
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.TGID]: Number(productId),
      [ANALYTICS_PROPERTIES.CITY]: cityDisplayName,
      [ANALYTICS_PROPERTIES.COUNTRY]: cityInfo?.country?.displayName, // TODO: check if this is required, read from city store
      [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
    });
  };

  const { lang, redirectToHeadoutBookingFlow, host, isDev, uid } = mbContext;
  let url = host || window.location.host;
  const hostName =
    !isDev || /(test|dev)-headout/gi.test(url)
      ? url
      : parse(uid, true).pathname;
  let hostSplit = hostName.split('.');
  hostSplit.shift();
  const domain = hostSplit.join('.');

  const bookingURL = createBookingURL({
    nakedDomain: domain,
    lang,
    tgid: productId,
    redirectToHeadoutBookingFlow,
    currency,
    variantId: productCardInfo?.listingPrice?.tourId,
    date: productCardInfo?.earliestAvailability,
    flowType: productCardInfo?.flowType,
    hsid,
  });

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    window.open(bookingURL, '_blank', 'noopener');
  };

  const handleMoreInfoClick = (e: MouseEventHandler) => {
    setShowPopup(true);
    onMoreInfoClick?.(e);
    trackCardContentClicked('More Info');
  };

  const handleItineraryCTAClick: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.stopPropagation();
    event.preventDefault();
    setShowItineraryPopup(true);
  };

  const productScorpioData = scorpioData[productId];
  const {
    name,
    media,
    descriptors,
    microBrandsHighlight,
    reviewsDetails,
    topReviews,
    experienceItineraryIds = [],
  } = productScorpioData;

  const { productImages } = media;

  const images = productImages.reduce((acc: any, image: any) => {
    acc.push({
      ...image,
      alt: image.altText,
    });

    return acc;
  }, []);

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

    tgid: productId,
    scorpioData: {
      ...productScorpioData,
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
    isMobile: false,
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
      <HorizontalProductCardDweb
        lang={lang as TLANGUAGELOCALE}
        tour={productCardInfo}
        city={cityInfo}
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
          more: strings.MORE,
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
            EXTENDED_VALIDITY: strings.PPD_EXTENDED_VALIDITY,
            FLEXIBLE_DURATION: strings.PPD_FLEXIBLE_DURATION_SUBTEXT,
          },
        }}
        onCtaClick={handleClick}
        onSwiperChange={(index) => {
          if (currentMediaIndex !== index) {
            setCurrentMediaIndex(index);
            trackMediaNavClicked(index);
          }
        }}
        productCardPosition={productCardPosition}
        showMetaLabel={showMetaLabel}
        overrideDescriptors={overrideDescriptors}
        lineClampDefault={lineClampDefault}
        onMoreInfoClick={handleMoreInfoClick}
        showItineraryCTA={showItinerary}
        onItineraryCTAClick={handleItineraryCTAClick}
      />

      <Conditional if={showPopup || showItineraryPopup}>
        <Product
          {...childProps}
          isPopUpOnly={true}
          onPopupClosed={() => {
            setShowPopup(false);
            setShowItineraryPopup(false);
          }}
          scrollToIndex={showItineraryPopup ? 2 : -1}
        />
      </Conditional>
    </>
  );
};

const FullWidthProductCard = (props: any) => {
  const { id, scorpioData } = props;
  const productCardInfo = scorpioData[id];

  return (
    <FullWidthProductCardComponent
      productCardInfo={productCardInfo}
      {...props}
    />
  );
};

export default withRouter(FullWidthProductCard);
