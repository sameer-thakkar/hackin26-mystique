import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useWindowWidth } from '@react-hook/window-size';
import PopulateProducts from 'components/PopulateProducts';
import useOnScreen from 'hooks/useOnScreen';
import { getHeadoutLanguagecode } from 'utils';
import { trackEvent } from 'utils/analytics';
import { fetchTourList } from 'utils/apiUtils';
import { tourListApiParser } from 'utils/dataParsers';
import { csvTgidToArray, getLangObject } from 'utils/helper';
import { convertUidToUrl } from 'utils/urlUtils';
import { currencyAtom } from 'store/atoms/currency';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { Wrapper } from './styles';

const TicketCard = (props: any) => {
  const {
    toursList: uncategorizedToursList,
    categoryTourListData,
    tgidToScroll,
    data: micrositeData,
    scorpioData: scorpioDataUncategorised,
    offerData,
    host,
    mbTheme,
    lang,
    uid,
    title,
    subtext,
    trackProductCardsViewed,
  } = props;

  const { body1: uncategorizedTours } = micrositeData || {};
  const [freeTourPopupOpen, toggleFreeTourPopup] = useState(false);
  const productCarouselRef = useRef(null);
  const currency = useRecoilValue(currencyAtom);
  const {
    productCardsLimit,
    scorpioData: scorpioDataCategorised,
    orderedTours: categorizedToursList,
  } = categoryTourListData || {};

  const isCategorisedTours = categoryTourListData
    ? Object.keys(categoryTourListData)?.length > 0
    : null;

  const isIntersecting = useOnScreen({
    ref: productCarouselRef,
    unobserve: true,
  });

  useEffect(() => {
    if (isIntersecting) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.SHOULDER_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: 'Product Carousel',
      });
    }
  }, [isIntersecting]);

  const sortTours = (
    tgidToScroll: any,
    toursArray: any,
    isCategorisedTours: any
  ) => {
    if (!tgidToScroll) return toursArray;
    if (tgidToScroll) {
      return toursArray?.reduce((accum = [], item: any) => {
        const tgid = isCategorisedTours ? +tgidToScroll : tgidToScroll;
        if (item.tgid === tgid) {
          return [item, ...accum];
        } else {
          return [...accum, item];
        }
      }, []);
    }
  };

  const orderedUncategorizedTours = isCategorisedTours
    ? sortTours(tgidToScroll, categorizedToursList, isCategorisedTours)
    : sortTours(tgidToScroll, uncategorizedToursList, isCategorisedTours);

  const tourRanking = uncategorizedTours?.[0]?.primary?.ranking;

  const orderedTGIDRanking = csvTgidToArray(tourRanking);

  const orderedTours =
    isCategorisedTours || tgidToScroll
      ? orderedUncategorizedTours
      : orderedTGIDRanking?.length
      ? [...orderedUncategorizedTours]?.sort((tourA, tourB) => {
          return (
            orderedTGIDRanking?.indexOf(parseInt(tourA.tgid)) -
            orderedTGIDRanking?.indexOf(parseInt(tourB.tgid))
          );
        })
      : orderedUncategorizedTours;
  const initialScorpioData = isCategorisedTours
    ? scorpioDataCategorised
    : scorpioDataUncategorised;

  const [scorpioData, setScorpioData] = useState(initialScorpioData);
  const [initialCurrency] = useState(currency);
  const orderedTgids = orderedTours?.length
    ? orderedTours?.map((tour: any) => tour.tgid)
    : [];

  useEffect(() => {
    if (initialCurrency !== currency) {
      fetchTourList({
        tgids: orderedTgids,
        language: currentLanguage,
        currency,
      })
        .then((res) => res.json())
        .then((data) => {
          const formattedData = tourListApiParser(data, currentLanguage);
          setScorpioData(formattedData);
        });
    }
  }, [currency]);

  const hasTours = isCategorisedTours
    ? categorizedToursList
    : uncategorizedToursList?.length > 0;
  const uncategorizedToursHeading = hasTours
    ? isCategorisedTours
      ? ''
      : uncategorizedTours[0].primary
    : '';
  const currentLanguage = getLangObject(lang).code;
  const withCommonHeaderOverrides = {
    ...micrositeData,
  };
  const {
    book_now_text: bookNowText,
    read_more_text: readMoreText,
    show_less_text: showLessText,
    instant_checkout: instantCheckout = false,
    enable_earliest_availability: enableEarliestAvailability,
  } = withCommonHeaderOverrides;

  const pageUrl = convertUidToUrl({ uid, lang: getHeadoutLanguagecode(lang) });
  const { results: productOffer } = offerData ? offerData : { results: [] };
  const hasOffer = productOffer.length > 0;
  const onTogglePopup = () => {
    toggleFreeTourPopup(!freeTourPopupOpen);
  };

  const [isMobile, setIsMobile] = useState(props?.isMobile);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    const currentIsMobile = windowWidth < 768;
    if (isMobile !== currentIsMobile) {
      setIsMobile(currentIsMobile);
    }
  }, [windowWidth]);

  const parentProductCards = PopulateProducts({
    asHook: true,
    uncategorizedTours: orderedTgids.map((tgid: any) => ({ tgid })),
    isMobile,
    forceMobile: true,
    productCardsLimit: Infinity,
    scorpioData: scorpioData,
    uid,
    isPoiMwebCard: true,
    isTicketCard: false,
    isCollectionMB: false,
    hasOffer: false,
    currentLanguage: getHeadoutLanguagecode(lang),
    disableShowingNewCard: true,
    sectionId: 'main',
    hasCategoryTourList: false,
    isEntertainmentMb: false,
    isListicle: false,
    isDiscountedPage: true,
    isSubattraction: true,
    showPopup: true,
    currency,
    showNextAvailable: true,
    enableEarliestAvailability: true,
  });

  // @ts-ignore
  if (!parentProductCards?.length && !orderedTours?.length && !scorpioData)
    return null;

  return (
    <Wrapper ref={productCarouselRef}>
      <PopulateProducts
        productCardsLimit={productCardsLimit}
        currency={currency}
        uncategorizedTours={orderedTours}
        scorpioData={scorpioData}
        uncategorizedToursHeading={uncategorizedToursHeading.list_heading}
        uid={uid}
        currentLanguage={currentLanguage}
        bookNowText={bookNowText}
        readMoreText={readMoreText}
        showLessText={showLessText}
        productOffer={productOffer}
        hasOffer={hasOffer}
        togglePopup={onTogglePopup}
        pageUrl={pageUrl}
        isMobile={isMobile}
        host={host}
        mbTheme={mbTheme}
        instantCheckout={instantCheckout}
        enableEarliestAvailability={enableEarliestAvailability}
        isTicketCard
        sectionTitle={title}
        sectionSubtext={subtext}
        trackProductCardsViewed={trackProductCardsViewed}
      />
    </Wrapper>
  );
};

export default TicketCard;
