import React, { Key, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { useWindowWidth } from '@react-hook/window-size';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import PopulateProducts from 'components/PopulateProducts';
import {
  Arrows,
  ParentTicketsTitle,
  ProductContainer,
  Row,
} from 'components/ShoulderPages/Subattraction/styles';
import useOnScreen from 'hooks/useOnScreen';
import { getHeadoutLanguagecode } from 'utils';
import { trackEvent } from 'utils/analytics';
import { fetchTourList } from 'utils/apiUtils';
import { tourListApiParser } from 'utils/dataParsers';
import { csvTgidToArray, generateSidenavId, getLangObject } from 'utils/helper';
import { convertUidToUrl } from 'utils/urlUtils';
import { currencyAtom } from 'store/atoms/currency';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import LttChevronLeft from 'assets/lttChevronLeft';
import LttChevronRight from 'assets/lttChevronRight';
import { Navigation, SwiperWrapper, Wrapper } from './styles';

SwiperWrapper;

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

const SWIPER_BREAKPOINTS = {
  500: {
    slidesPerView: 1,
  },
  515: {
    slidesPerView: 1.5,
  },
  650: {
    slidesPerView: 2,
  },
  750: {
    slidesPerView: 2.5,
  },
  1200: {
    slidesPerView: 3,
  },
};

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
    shouldShowShoulderPageProductCardExperiment,
    parentLandingPageUrl,
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
  const [, setActiveSwiperIndex] = useState(0);
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const windowWidth = useWindowWidth();
  const updateIndex = () => {
    if (isMobile || !swiper) return;
    setActiveSwiperIndex(swiper.realIndex);
  };

  useEffect(() => {
    const currentIsMobile = windowWidth < 768;
    if (isMobile !== currentIsMobile) {
      setIsMobile(currentIsMobile);
    }
  }, [windowWidth]);

  const swiperParams: SwiperProps = {
    loop: false,
    freeMode: false,
    grabCursor: true,
    onTouchEnd: () => {},
    draggable: true,
    spaceBetween: 24,
    allowTouchMove: true,
    onSwiper: (swiper: TSwiper) => setSwiperInstance(swiper),
    onSlideChange: () => updateIndex(),
    slidesPerView: isMobile ? 1.05 : 1,
  };

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

  const goNext = () => {
    if (!swiper) return;
    swiper.slideNext();

    trackEvent({
      eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: 'Explore All',
      [ANALYTICS_PROPERTIES.DIRECTION]: 'Forward',
    });
  };

  const goPrev = () => {
    if (!swiper) return;
    swiper.slidePrev();

    trackEvent({
      eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: 'Explore All',
      [ANALYTICS_PROPERTIES.DIRECTION]: 'Backward',
    });
  };

  const handleSeeAllCTAClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.SEE_ALL_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: 'See All',
      [ANALYTICS_PROPERTIES.SECTION]: 'Product Carousel',
    });
  };

  return (
    <Wrapper ref={productCarouselRef}>
      <Conditional if={!shouldShowShoulderPageProductCardExperiment}>
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
      </Conditional>
      <Conditional if={shouldShowShoulderPageProductCardExperiment}>
        <SwiperWrapper
          id={generateSidenavId(title)}
          className="swiper-container"
        >
          <Navigation>
            <ParentTicketsTitle>{title}</ParentTicketsTitle>
            <Row>
              <Conditional if={parentLandingPageUrl}>
                <a href={parentLandingPageUrl} onClick={handleSeeAllCTAClick}>
                  {strings.SEE_ALL}
                </a>
              </Conditional>
              <Conditional if={!isMobile}>
                <Arrows>
                  <LttChevronLeft
                    onClick={goPrev}
                    disabled={swiper?.isBeginning}
                  />
                  <LttChevronRight onClick={goNext} disabled={swiper?.isEnd} />
                </Arrows>
              </Conditional>
            </Row>
          </Navigation>
          <Swiper {...swiperParams} breakpoints={SWIPER_BREAKPOINTS}>
            {parentProductCards.map((Product: any, index: Key) => (
              <ProductContainer key={index}>{Product}</ProductContainer>
            ))}
          </Swiper>
        </SwiperWrapper>
      </Conditional>
    </Wrapper>
  );
};

export default TicketCard;
