import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { scroller } from 'react-scroll';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';
import { useRecoilValue } from 'recoil';
import dayjs from 'dayjs';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import {
  type Itinerary as TItinerary,
  ItineraryType,
} from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import HorizontalLine from 'components/slices/HorizontalLine';
import { Paginator } from 'UI/Paginator';
import { StyledDotsContainer } from 'UI/Paginator/styles';
import { MBContext } from 'contexts/MBContext';
import useOnScreen from 'hooks/useOnScreen';
import useWindowWidth from 'hooks/useWindowWidth';
import { isMBDesign, legacyBooleanCheck } from 'utils';
import {
  getProductCommonProperties,
  sendVariableToDataLayer,
  trackEvent,
} from 'utils/analytics';
import {
  fetchBatchedCalendarInventory,
  fetchBulkInventories,
  fetchInventory,
} from 'utils/apiUtils';
import { addDays, formatDateToString } from 'utils/dateUtils';
import { generateSidenavId, getHostName } from 'utils/helper';
import { isItineraryValid } from 'utils/itinerary';
import { getProductDescriptors } from 'utils/productUtils';
import { appAtom } from 'store/atoms/app';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CRUISE_CATEGORY_ID,
  DESIGN,
  MB_CATEGORISATION,
  THEMES,
} from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import PercentageStamp from 'assets/percentageStamp';
import { trackPageSection } from './CityPageContainer/utils';
import { SECTION_NAMES } from './HOHO/constants';
import { SHOULDER_PAGE_SECTIONS } from './ShoulderPages/const';

const Product = dynamic(
  () => import(/* webpackChunkName: "Product" */ 'components/Product')
);
const TicketCard = dynamic(
  () =>
    import(
      /* webpackChunkName: "TicketCard" */ 'components/slices/ContentPageTicketsCard'
    )
);
const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

const StyledProductsWrapper = styled.div<{
  isLoading: boolean;
  isTicketCard?: boolean;
  isNewVerticalsProductCard?: boolean;
}>`
  margin: 0 auto;
  position: relative;

  .product-card-skeleton-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .product-card-skeleton {
    max-width: 75rem;
    margin: auto;
    height: 21.5rem;
    border-radius: 1rem;
    ${({ isNewVerticalsProductCard }) =>
      isNewVerticalsProductCard && `height: 14.813rem;`}
  }

  #tour-list-heading {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    @media (max-width: 768px) {
      margin: ${({ isTicketCard }) => (isTicketCard ? '0 auto' : '0 1rem')};
      width: auto;
    }
    h2 {
      color: ${COLORS.GRAY.G2};
      ${expandFontToken(FONTS.DISPLAY_SMALL)};
      @media (max-width: 768px) {
        ${expandFontToken(FONTS.HEADING_REGULAR)}
      }
    }
  }
  @media (max-width: 768px) {
    ${({ isLoading }) => (isLoading ? `min-height: 390px;` : '')}
    && {
      ${({ isNewVerticalsProductCard }) =>
        isNewVerticalsProductCard &&
        css`
          .product-card-skeleton {
            height: 28.438rem;
          }
          ::before {
            content: '';
            position: absolute;
            background-color: ${COLORS.BRAND.WHITE};
            top: -0.938rem;
            height: 1rem;
            width: 100%;
            border-radius: 20px 20px 0 0;
          }
        `}
    }

    ${StyledDotsContainer} {
      width: min-content;
      margin: auto;
      padding-top: 1rem;
    }
  }
`;

const ticketCardDesktopDisplay = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ProductContainer = styled.div<{
  isTicketCard: boolean;
  isMobile: boolean;
  isNotVisible?: boolean;
  isNewVerticalsProductCard?: boolean;
  isCruise?: boolean;
  $noPadding?: boolean;
}>`
  ${({ isTicketCard, isMobile }) =>
    isTicketCard && !isMobile
      ? ` ${ticketCardDesktopDisplay} `
      : `display: grid;`}
  grid-row-gap: ${({ theme }) => theme.productCards.gap.desktop};
  margin: ${({ isNotVisible, isCruise }) =>
    isNotVisible ? '0' : isCruise ? '1.5rem 0 2.25rem' : '2.25rem 0'};
  & > ${HorizontalLine} {
    border-bottom-style: dashed;
  }
  & > ${HorizontalLine}:last-child {
    display: none;
  }

  transition: opacity 0.3s;
  overflow: hidden;

  opacity: ${({ isNotVisible }) => (isNotVisible ? '0' : '1')};
  visibility: ${({ isNotVisible }) => (isNotVisible ? 'hidden' : 'visible')};
  height: ${({ isNotVisible }) => (isNotVisible ? '0' : 'auto')};

  @media (max-width: 768px) {
    margin-top: ${({ isNotVisible }) => (isNotVisible ? 0 : 0.5)}rem;
    margin-bottom: ${({ isNotVisible }) => (isNotVisible ? 0 : 1.75)}rem;
    grid-row-gap: ${({ isNewVerticalsProductCard }) =>
      isNewVerticalsProductCard ? '1.5rem' : '2rem'};

    ${({ isNewVerticalsProductCard, $noPadding }) =>
      isNewVerticalsProductCard &&
      `margin: 0;
       padding-bottom: ${$noPadding ? '0' : '2.25rem'};`}

    .product-card-skeleton {
      max-width: auto;
      margin: 0 1.5rem;
      height: 33.75rem;
      border-radius: 0.75rem;
    }
  }
`;

const ProductWrapper = styled.div`
  flex: 0 49%;
`;

const CombosContainer = styled.div`
  background: linear-gradient(115.83deg, #f8f6ff 0%, #fff2f8 81.51%);
  padding-bottom: 1.25rem;
  margin-bottom: 2.25rem;
`;

const SectionTitle = styled.div<{ $noSubtitle?: boolean }>`
  margin: 0 1rem;

  .subtitle {
    display: grid;
    grid-column-gap: 0.25rem;
    grid-template-columns: min-content max-content;
    align-items: center;
    padding: 1.5rem 0 0.25rem;
    ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)}
  }
  h2 {
    margin: 0;
    padding-bottom: 1.25rem;
    ${expandFontToken(FONTS.HEADING_REGULAR)}
    ${($noSubtitle) => $noSubtitle && 'padding-top: 1.5rem'}
  }
`;

const PopulateProducts: any = (props: any) => {
  const {
    uncategorizedTours: tours,
    uid,
    currency,
    currentLanguage,
    bookNowText,
    showLessText,
    readMoreText,
    productOffer,
    hasOffer,
    togglePopup,
    popupState,
    isMobile,
    scorpioData,
    pageUrl,
    mbTheme,
    instantCheckout,
    isTicketCard = false,
    sectionTitle = '',
    pageType = '',
    bannerVideo,
    isCollectionMB = false,
    productsLoading,
    isNonPoi,
    isAirportTransfersMB,
    isModifiedProductCard = false,
    isPoiMwebCard = false,
    productCardsLimit = Infinity,
    showBoosters = false,
    trackProductCardsViewed = false,
    showThumbnailInBanner,
    showPopup = false,
    asHook,
    forceMobile,
    hideHeading,
    isHOHORevamp,
    isNVResolving,
    isRankingExperimentResolving = false,
    showItineraries = false,
    isCruisesRevamp = false,
    isNewVerticalsProductCard = false,
    activeSubCat = 0,
    horizontalProductCard = false,
    verticalProductCard = false,
    subattraction_type,
    isHighlightsExperiment = false,
    showCustomProductCardCTA = false,
    shouldRunCustomCTAExperiment = false,
  } = props;

  const { SUBATTRACTION_TYPE } = MB_CATEGORISATION;
  const clientWidth = useWindowWidth();
  const clientIsMobile = clientWidth ? clientWidth <= 768 : false;

  const productsRef = useRef([]);
  productsRef.current = [];
  const productsWrapperRef = useRef(null);
  const [tourPrices, setTourPrices] = useState(scorpioData);
  const [detialsPopupShown, setDetailsPopupShown] = useState(false);
  const [earliestAvailabilityStore, setEarliestAvailabilityStore] = useState(
    {}
  );
  const [showEarliestAvailability, setShowEarliestAvailability] =
    useState(false);
  const router = useRouter();
  const { isBot } = useRecoilValue(appAtom);

  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const updateIndex = useCallback(() => {
    if (!swiper) return;
    setActiveIndex(swiper.realIndex);
  }, [swiper]);

  const addToRef = (el: any) => {
    // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
    el && productsRef.current.push(el);
  };

  const { isStage, isDev, host, design } = useContext(MBContext);

  const hostname = getHostName(isStage, isDev, host);

  useEffect(() => setTourPrices(scorpioData), [scorpioData]);

  useEffect(() => {
    if (!isCruisesRevamp && productsLoading) {
      scroller.scrollTo('products-container', {
        duration: 600,
        offset: -120,
        smooth: 'easeInOutQuart',
      });
    }
  }, [productsLoading]);

  useEffect(() => {
    let timeInventory: Record<number, any>;
    const fetchEarliestAvailability = async (
      uncategorizedToursList: Array<Record<string, any>>
    ) => {
      const tgids = uncategorizedToursList.reduce(
        (acc: Array<number>, tours) => {
          const { tgid } = tours;
          if (!tgid) return acc;
          return [...acc, tgid];
        },
        []
      );

      const inventory: Record<number, any> =
        (await fetchBatchedCalendarInventory({
          tgids,
          fromDate: formatDateToString(new Date(), 'en', 'YYYY-MM-DD'),
          currency,
          toDate: formatDateToString(
            addDays(new Date(), 60),
            'en',
            'YYYY-MM-DD'
          ),
        })) || {};

      if (isCruisesRevamp) {
        timeInventory =
          (await fetchBulkInventories({
            tgids,
            fromDate: formatDateToString(new Date(), 'en', 'YYYY-MM-DD'),
            currency,
            toDate: formatDateToString(
              addDays(new Date(), 2),
              'en',
              'YYYY-MM-DD'
            ),
          })) || {};
      }

      const earliestAvailabilityData = Object.keys(inventory).reduce(
        (acc: Record<number, any>, tgid) => {
          const tour = inventory?.[Number(tgid) as keyof typeof inventory];
          const { sortedInventoryDates } = tour || {};
          const [firstAvailableDate] = sortedInventoryDates || [];
          const today = dayjs().format('YYYY-MM-DD');
          let startTime;

          if (!firstAvailableDate) return acc;
          if (isCruisesRevamp && firstAvailableDate === today) {
            const tour =
              timeInventory?.[Number(tgid) as keyof typeof inventory];
            startTime = tour?.availabilities?.[0]?.startTime;
          }

          return {
            ...acc,
            [tgid]: {
              startDate: firstAvailableDate,
              ...(isCruisesRevamp && { startTime }),
            },
          };
        },
        {}
      );

      setEarliestAvailabilityStore(earliestAvailabilityData);
      setShowEarliestAvailability(true);
    };
    if (showNextAvailable || instantCheckout) {
      fetchEarliestAvailability(tours);
    }
  }, []);

  useEffect(() => {
    if (!productsWrapperRef?.current) return;
    try {
      const productsEl = productsWrapperRef.current;
      const { height, top } = (productsEl as any).getBoundingClientRect();
      const documentHeight = window.document.body.scrollHeight;
      const percentScrollHeight = ((height + top) / documentHeight) * 100;
      sendVariableToDataLayer({
        name: 'Products Container Height Percentage',
        value: percentScrollHeight,
      });
    } catch (e) {
      //
    }
  }, [productsWrapperRef]);

  const showNextAvailable = isCruisesRevamp;
  useEffect(() => {
    const fetchVariantPrices = async ({ variantTgids, currency }: any) => {
      const fetchVariantPrices: Promise<any>[] = variantTgids.map(
        ({ tgid }: any) =>
          fetchInventory({
            tgid,
            forDays: 2,
            ...(currency && {
              currency: `${currency}`,
            }),
            hostname,
            language: currentLanguage,
          })
      );
      const variants: Array<any> = await Promise.all([...fetchVariantPrices]);
      const mapVariantPrices = variants.map((tourVariant: any, index) => {
        const inv = tourVariant?.inventoryList?.find((inventoryList: any) => {
          return inventoryList.tourId == variantTgids[index].tid;
        });
        return {
          tgid: variantTgids[index].tgid,
          tid: variantTgids[index].tid,
          price: inv ? inv.finalPriceProfile.persons[0].price : '',
        };
      });

      const variantPrices = mapVariantPrices.reduce(
        (accum, res, index) => ({
          ...accum,
          [mapVariantPrices[index].tgid]: {
            price: res.price || '',
          },
        }),
        {}
      );
      const finalPrices = { ...tourPrices };
      for (const tour in variantPrices) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        finalPrices[tour]['price'] = variantPrices[tour]?.price;
      }
      setTourPrices(finalPrices);
    };
    const variantTgids = tours
      ?.filter((t: any) => t.tgid && t.tid)
      .map((t: any) => ({
        tgid: t.tgid,
        tid: t.tid,
      }));

    if (variantTgids?.length) {
      fetchVariantPrices({ variantTgids, currency });
    }
  }, [currency]);

  const uncategorizedTours =
    showEarliestAvailability || instantCheckout
      ? tours.map((tour: any) => ({
          ...tour,
          earliestAvailability:
            earliestAvailabilityStore[
              tour.tgid as keyof typeof earliestAvailabilityStore
            ],
        }))
      : tours;

  let availableToursList = uncategorizedTours
    ?.filter((tour: any) => {
      const checkIfScorpioHighlightsExist =
        scorpioData[tour.tgid]?.isMBHighlightsExist;
      return (
        !!scorpioData[tour.tgid]?.available &&
        (checkIfScorpioHighlightsExist ||
          tour?.tour_description_override?.length)
      );
    })
    .slice(0, productCardsLimit);

  if (isCruisesRevamp && activeSubCat !== 0) {
    availableToursList = availableToursList?.filter(
      (tour: Record<string, any>) =>
        scorpioData[tour.tgid]?.primarySubCategory?.id === activeSubCat
    );
  }

  const nonNewVerticalIndex = availableToursList?.findIndex(
    (tour: Record<string, any>) => {
      if (isCruisesRevamp) {
        return (
          scorpioData[tour.tgid]?.primaryCategory?.id !== CRUISE_CATEGORY_ID
        );
      } else return scorpioData[tour.tgid]?.combo;
    }
  );
  const nonNewVerticalTours = availableToursList?.filter(
    (tour: Record<string, any>) => {
      if (isCruisesRevamp) {
        return (
          scorpioData[tour.tgid]?.primaryCategory?.id !== CRUISE_CATEGORY_ID
        );
      } else return scorpioData[tour.tgid]?.combo;
    }
  );

  const newVerticalTours = availableToursList?.filter(
    (tour: Record<string, any>) => {
      if (isCruisesRevamp) {
        return (
          scorpioData[tour.tgid]?.primaryCategory?.id === CRUISE_CATEGORY_ID
        );
      } else return !scorpioData[tour.tgid]?.combo;
    }
  );

  if (subattraction_type === SUBATTRACTION_TYPE.C) {
    availableToursList = availableToursList.splice(0, 5);
  }
  const finalToursList =
    isNewVerticalsProductCard && isMobile
      ? newVerticalTours
      : availableToursList;
  const selectedDate = router.query.selectedDate;
  useEffect(() => {
    if (!productsRef.current) return;

    try {
      let didTrackProductCardsSliceViewed = false;
      const observerCallback = (entries: any, observer: any) => {
        entries.forEach((entry: any, index: number) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            const { tgid: stringTgid } = entry.target?.dataset;
            const tgid = parseInt(stringTgid);
            if (tgid) {
              if (
                trackProductCardsViewed &&
                !didTrackProductCardsSliceViewed &&
                index == 0
              ) {
                didTrackProductCardsSliceViewed = true;
                trackEvent({
                  eventName: ANALYTICS_EVENTS.SHOULDER_PAGE_SECTION_VIEWED,
                  [ANALYTICS_PROPERTIES.SECTION]:
                    SHOULDER_PAGE_SECTIONS.PRODUCT_CARDS_SLICE,
                });
              }

              const isNonCruiseProductCard =
                scorpioData?.[tgid]?.primaryCategory?.id !== CRUISE_CATEGORY_ID;
              if (isCruisesRevamp && !isNonCruiseProductCard) {
                trackEvent({
                  eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_VISIBLE,
                  [ANALYTICS_PROPERTIES.TGID]: tgid,
                  [ANALYTICS_PROPERTIES.POSITION]:
                    availableToursList?.findIndex((t: any) => t.tgid === tgid) +
                    1,
                  [ANALYTICS_PROPERTIES.IS_TRUNCATED]:
                    !!entry.target?.querySelector?.('.more-details'),
                });
              }

              if (isCruisesRevamp && isNonCruiseProductCard) {
                const {
                  primaryCategory,
                  primaryCollection,
                  primarySubCategory,
                  reviewsDetails,
                } = scorpioData[tgid];
                trackEvent({
                  eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_VIEWED,
                  [ANALYTICS_PROPERTIES.TGID]: tgid,
                  [ANALYTICS_PROPERTIES.SECTION]: 'Non Cruises Product Section',
                  [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]:
                    scorpioData?.[tgid]?.productTitle,
                  [ANALYTICS_PROPERTIES.POSITION]:
                    availableToursList?.findIndex((t: any) => t.tgid === tgid) +
                    1 -
                    nonNewVerticalIndex,
                  ...getProductCommonProperties({
                    primaryCategory,
                    primaryCollection,
                    primarySubCategory,
                    reviewsDetails,
                  }),
                });
              }
            }
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, {
        rootMargin: '0px',
        threshold: 0.3,
      });
      observer.disconnect();
      const timer = setTimeout(() => {
        productsRef.current.forEach((el) => {
          observer.observe(el);
        });
      }, 1000);

      return () => {
        observer.disconnect();
        clearTimeout(timer);
      };
    } catch (e) {
      //
    }
  }, [productsRef, selectedDate, trackProductCardsViewed, availableToursList]);

  const isV1DesignSite = isMBDesign({
    currentDesign: design || '',
    expectedDesign: [DESIGN.V1],
  });

  const shouldShowHeading = isV1DesignSite
    ? !isCollectionMB && !isAirportTransfersMB && !isCruisesRevamp
    : true;

  const showLoader =
    productsLoading || isRankingExperimentResolving || isNVResolving;

  const swiperParams: SwiperProps = {
    onSwiper: (swiper: TSwiper) => setSwiperInstance(swiper),
    onTouchEnd: () => {},
    onSlideChange: () => updateIndex(),
  };

  const getProductCardFromTourAndIndex = (
    tour: Record<string, any>,
    index: number,
    isSmallComboCard = false,
    isSwiperCard = false
  ) => {
    const {
      tgid,
      earliestAvailability,
      tour_variant_id,
      tour_title_override,
      flowType,
      tour_description_override,
      product_booster,
      short_summary,
      tag_booster,
      isSpecialGuidedTour,
      ogIndex,
    } = tour || {};
    const {
      collectionId,
      primaryCategory,
      primaryCollection,
      primarySubCategory,
      reviewsDetails,
      topReviews,
      experienceItineraryIds = [],
    } = scorpioData[tgid];

    const { itineraryData = {} } = scorpioData;
    const { itineraries } = itineraryData;

    const itineraryDataMap: Record<string | number, TItinerary> =
      showItineraries || isCruisesRevamp
        ? itineraries?.reduce(
            (prev: Record<string | number, TItinerary>, curr: TItinerary) => {
              prev[curr.id] = curr;
              return prev;
            },
            {}
          )
        : {};

    const tgidItineraryData =
      showItineraries || isCruisesRevamp
        ? experienceItineraryIds.reduce(
            (acc: Array<TItinerary>, id: string) => {
              const itinerary = itineraryDataMap[id];
              if (itinerary && isItineraryValid(itinerary)) {
                acc.push(itinerary);
              }
              return acc;
            },
            [] as Array<TItinerary>
          )
        : [];

    const showItinerary =
      showItineraries &&
      !!tgidItineraryData?.length &&
      tgidItineraryData.findIndex((itinerary: TItinerary) =>
        isItineraryValid(itinerary)
      ) !== -1;

    const isHohoItinerary =
      showItinerary && tgidItineraryData[0].type === ItineraryType.HOHO;

    const childProps = {
      tgid,
      earliestAvailability,
      showEarliestAvailability:
        earliestAvailability?.startDate && showEarliestAvailability,
      showNextAvailable,
      tid: tour_variant_id,
      title: tour_title_override,
      descriptors: getProductDescriptors({
        descriptors: scorpioData?.[tgid]?.descriptors,
        filterOut: isSpecialGuidedTour ? ['GUIDED_TOUR', 'AUDIO_GUIDE'] : null,
      }),
      highlights: tour_description_override,
      scorpioData: scorpioData?.[tgid],
      tourPrices,
      uid,
      currentLanguage,
      bookNowText,
      showLessText,
      readMoreText,
      productOffer,
      hasOffer,
      togglePopup,
      offerId: tour.offer__free_tour?.id,
      popupState,
      isMobile,
      pageUrl,
      host,
      ctaUrlSuffix: tour.cta_url_suffix || '',
      isScratchPriceEnabled: legacyBooleanCheck(tour.show_scratch_price),
      position: index + 1,
      booster: product_booster,
      defaultOpen: false,
      shortSummary: short_summary,
      boosterTag: tag_booster,
      numberOfTours: tours.length,
      instantCheckout,
      indexPosition: index,
      pageType,
      collectionId: collectionId ?? primaryCollection?.id,
      primaryCategory,
      primaryCollection,
      primarySubCategory,
      flowType,
      bannerVideo,
      isCollectionMB,
      isSpecialGuidedTour,
      detialsPopupShown,
      setDetailsPopupShown,
      isNonPoi,
      isModifiedProductCard:
        isNewVerticalsProductCard &&
        (isCruisesRevamp
          ? primaryCategory?.id !== CRUISE_CATEGORY_ID
          : scorpioData?.[tgid].combo) &&
        !isMobile
          ? true
          : isModifiedProductCard,
      isPoiMwebCard:
        isNewVerticalsProductCard &&
        isMobile &&
        (isCruisesRevamp
          ? primaryCategory?.id !== CRUISE_CATEGORY_ID
          : scorpioData?.[tgid].combo)
          ? true
          : isPoiMwebCard,
      isSmallComboCard,
      reviewsDetails,
      originalRank: ogIndex ? ogIndex + 1 : undefined,
      showBoosters,
      forceMobile,
      hideHeading,
      topReviews,
      showPopup,
      isHOHORevamp,
      isCruisesRevamp,
      isNewVerticalsProductCard,
      isSwiperCard,
      isBot,
      verticalProductCard,
      horizontalProductCard,
      isHighlightsExperiment,
      itineraryInfo: {
        data: tgidItineraryData,
        showData: showItinerary,
        isHOHO: isHohoItinerary,
      },
      showCustomProductCardCTA,
      shouldRunCustomCTAExperiment,
    };

    return isSmallComboCard ? (
      <Product
        {...childProps}
        showThumbnailInBanner={showThumbnailInBanner}
        nonNewVerticalIndex={nonNewVerticalIndex}
      />
    ) : (
      <ProductWrapper ref={addToRef} data-tgid={tour.tgid} key={tour.tgid}>
        {isTicketCard ? (
          <TicketCard {...childProps} />
        ) : (
          <Product
            {...childProps}
            showThumbnailInBanner={showThumbnailInBanner}
            nonNewVerticalIndex={nonNewVerticalIndex}
          />
        )}
        <Conditional if={mbTheme === THEMES.MIN_BLUE}>
          <HorizontalLine colorProp={COLORS.GRAY.G6} />
        </Conditional>
      </ProductWrapper>
    );
  };

  const combosSectionRef = useRef<HTMLDivElement>(null);
  const [isTracked, setIsTracked] = useState(false);

  const isCombosSectionIntersecting = useOnScreen({
    ref: combosSectionRef,
    unobserve: true,
  });
  useEffect(() => {
    if (isCombosSectionIntersecting && !isTracked) {
      trackPageSection({ section: SECTION_NAMES.COMBOS });
      setIsTracked(true);
    }
  }, [isCombosSectionIntersecting]);

  if (asHook) {
    return finalToursList?.map((tour: Record<string, any>, index: number) =>
      getProductCardFromTourAndIndex(tour, index)
    );
  }

  return (
    <StyledProductsWrapper
      isLoading={showLoader}
      isTicketCard={isTicketCard}
      isNewVerticalsProductCard={isNewVerticalsProductCard}
      id="products-container"
      ref={productsWrapperRef}
    >
      <ProductContainer
        isTicketCard={isTicketCard}
        isMobile={isMobile || forceMobile}
        isNotVisible={!showLoader}
      >
        <Skeleton
          className="product-card-skeleton"
          containerClassName="product-card-skeleton-container"
        />
        <Skeleton
          className="product-card-skeleton"
          containerClassName="product-card-skeleton-container"
        />
        <Skeleton
          className="product-card-skeleton"
          containerClassName="product-card-skeleton-container"
        />
      </ProductContainer>

      <Conditional if={mbTheme !== THEMES.MIN_BLUE && shouldShowHeading}>
        <div id="tour-list-heading">
          <Conditional
            if={
              !hideHeading &&
              availableToursList?.length &&
              (sectionTitle || strings.TOUR_LIST_HEADING)
            }
          >
            <h2
              id={generateSidenavId(sectionTitle || strings.TOUR_LIST_HEADING)}
            >
              {isTicketCard ? sectionTitle : strings.TOUR_LIST_HEADING}
            </h2>
          </Conditional>
        </div>
      </Conditional>
      <ProductContainer
        isTicketCard={isTicketCard}
        isMobile={isMobile || forceMobile}
        isNotVisible={showLoader}
        isNewVerticalsProductCard={isNewVerticalsProductCard}
        isCruise={isCruisesRevamp}
        $noPadding={finalToursList?.length < 1}
      >
        <Conditional if={finalToursList?.length > 0}>
          {finalToursList?.map((tour: Record<string, any>, index: number) => {
            return getProductCardFromTourAndIndex(tour, index);
          })}
        </Conditional>
      </ProductContainer>
      <Conditional
        if={
          isNewVerticalsProductCard &&
          (isMobile || clientIsMobile) &&
          nonNewVerticalTours?.length
        }
      >
        <CombosContainer ref={combosSectionRef}>
          <SectionTitle $noSubtitle={isCruisesRevamp}>
            <Conditional if={!isCruisesRevamp}>
              <div className="subtitle">
                <PercentageStamp />
                <span>{strings.HOHO.COMBO_SUBTITLE}</span>
              </div>
            </Conditional>
            <h2>
              {isCruisesRevamp
                ? strings.CRUISES.COMBO_HEADING
                : strings.HOHO.COMBO_TITLE}
            </h2>
          </SectionTitle>
          <Swiper {...swiperParams}>
            {nonNewVerticalTours?.map(
              (tour: Record<string, any>, index: number) => {
                return getProductCardFromTourAndIndex(tour, index, false, true);
              }
            )}
          </Swiper>
          <Paginator
            tabSize={1.5}
            dotSize={0.5}
            totalCount={nonNewVerticalTours?.length}
            activeIndex={activeIndex}
            activeSlideTimer={0.1}
            margin={0.125}
            activeColor={`${COLORS.BLACK}35`}
            inactiveColor={`${COLORS.BLACK}20`}
          />
        </CombosContainer>
      </Conditional>
    </StyledProductsWrapper>
  );
};

export default PopulateProducts;
