import { useContext, useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import Modal, { Styles } from 'react-modal';
import { scroller } from 'react-scroll';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';
import Conditional from 'components/common/Conditional';
import HorizontalLine from 'components/slices/HorizontalLine';
import Image from 'UI/Image';
import Video from 'UI/Video';
import { MBContext } from 'contexts/MBContext';
import useABTesting from 'hooks/useABTesting';
import useOnScreen from 'hooks/useOnScreen';
import { isMBDesign, legacyBooleanCheck } from 'utils';
import { sendVariableToDataLayer, trackEvent } from 'utils/analytics';
import {
  fetchBatchedCalendarInventory,
  fetchInventory,
  fetchTourList,
} from 'utils/apiUtils';
import { addDays, formatDateToString } from 'utils/dateUtils';
import { generateSidenavId, getHostName } from 'utils/helper';
import { getProductDescriptors } from 'utils/productUtils';
import COLORS from 'const/colors';
import { EXPERIMENT_NAMES, VARIANTS } from 'const/experiments';
import { FONTS } from 'const/fonts';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  curatedVideoBannerExpUids,
  DESIGN,
  THEMES,
  VIDEO_POSITIONS,
} from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';
import VideoPlayIcon from 'assets/playIcon';
import IFrame from './shortcodes/IFrame';
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

const StyledProductsWrapper = styled.div<{
  isLoading: boolean;
  isTicketCard?: boolean;
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
}>`
  ${({ isTicketCard, isMobile }) =>
    isTicketCard && !isMobile
      ? ` ${ticketCardDesktopDisplay} `
      : `display: grid;`}
  grid-row-gap: ${({ theme }) => theme.productCards.gap.desktop};
  margin: ${({ isNotVisible }) => (isNotVisible ? '0' : '2.25rem 0')};
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
    grid-row-gap: 2rem;

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

const IFrameWrapper = styled.div`
  width: 100%;
  height: auto;
  overflow: hidden;
  border-radius: 0.75rem;
`;

const YoutubeBannerWrapper = styled.div`
  margin: 0 auto;
  max-width: 75rem;
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 0.4rem 0 0;
  border-radius: 1.5rem 1.5rem 1rem 1rem;
  transition: box-shadow 0.4s;
  box-sizing: border-box;

  &:hover {
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
  }

  @media (max-width: 768px) {
    &:hover {
      box-shadow: none;
    }
  }
`;

const YoutubeBanner = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin: 0 auto;
  width: 100%;
  background: linear-gradient(
    to right,
    ${COLORS.BACKGROUND.FLOATING_PURPS},
    ${COLORS.PURPS.LEVEL_10}
  );
  padding: 1rem 3rem;
  border-radius: 1rem;
  box-sizing: border-box;
  cursor: pointer;

  @media (max-width: 768px) {
    flex-direction: column;
    width: auto;
    margin: 0 1.5rem;
    padding: 0.75rem;
  }
`;

const YoutubeBanneLeft = styled.div`
  width: 60%;

  @media (max-width: 768px) {
    width: 100%;
  }

  h3 {
    margin: 0;
    color: black;
    font-weight: 500;
  }

  p {
    font-size: 0.95rem;
    font-weight: 200;
    margin: 0;
    margin-top: 0.1rem;
  }

  @media (max-width: 768px) {
    p {
      font-size: 1rem;
      margin: 0;
    }
  }
`;

const YoutubeBanneRight = styled.div`
  width: 40%;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-evenly;

  h3,
  p {
    line-height: 0.4rem;
    color: ${COLORS.BRAND.PURPS};
  }

  .label-wrapper {
    display: flex;
    align-items: center;

    svg {
      margin-right: 1rem;
      margin-top: 0.2rem;
      position: relative;
      animation-name: play-icon-animation;
      animation-duration: 1.4s;
      animation-iteration-count: infinite;
      animation-delay: 250ms;
      animation-timing-function: ease-in-out;
    }

    h3 {
      width: max-content;
    }

    @media (max-width: 768px) {
      h3 {
        font-size: 0.85rem;
      }
    }
  }

  .animate-media-preview {
    transition-delay: 250ms;
    transition: transform 1s;
    transform: translateY(0);
    transition-timing-function: ease-in-out;
  }

  .media-preview-not-intersecting-styles {
    opacity: 0;
    bottom: -8rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    flex-direction: row-reverse;
    margin-top: 1.5rem;
  }

  @keyframes play-icon-animation {
    0% {
      left: 0px;
    }
    15% {
      left: 1rem;
      opacity: 0;
    }
    25% {
      left: 0px;
      opacity: 0;
    }
    30% {
      opacity: 1;
    }
    100% {
      left: 0px;
      opacity: 1;
    }
  }

  @keyframes media-preview-animation {
    0% {
      bottom: -8rem;
      opacity: 0rem;
    }
    60% {
      bottom: 0rem;
      opacity: 1;
    }
    100% {
      bottom: 0rem !important;
      opacity: 1 !important;
    }
  }
`;

const MediaPreviewWrapper = styled.div`
  position: relative;
  width: 13rem;
  height: 100%;
  transform: translateY(8rem);

  @media (max-width: 768px) {
    margin-right: 0.25rem;
    width: 10rem;
  }
`;

const MediaPreview = styled.div`
  width: 100%;
  height: 10rem;
  position: absolute;
  background: white;
  transform: rotate(-3deg);
  border-radius: 1rem;
  padding: 0.28rem;
  border: 0.4px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  margin-top: -1.3rem;

  .media-player-wrapper {
    width: 100%;
    height: 100%;

    .media-image,
    img,
    video {
      object-fit: cover;
      border-radius: 1rem 1rem 0 0;
    }
  }

  @media (max-width: 768px) {
    margin-top: -2.3rem;
  }
`;

const modalStyles: Styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 99,
  },
  content: {
    height: 'max-content',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    width: 'calc(100% - 5.46vw * 2)',
    backgroundColor: 'transparent',
    maxWidth: `${SIZES.MAX_WIDTH}`,
    boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    zIndex: 999,
    padding: 0,
    inset: 0,
    border: 0,
  },
};

const BANNER_DIMENSIONS = {
  DESKTOP: {
    WIDTH: 588,
    HEIGHT: 300,
  },
  MOBILE: {
    WIDTH: 275,
    HEIGHT: 168,
  },
};

const PopulateProducts = (props: any) => {
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
    enableEarliestAvailability,
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
    bannerImages,
    isPopupExperimentResolving = false,
    showPopup = false,
  } = props;

  const productsRef = useRef([]);
  const mediaPreviewWrapperRef = useRef(null);
  productsRef.current = [];
  const productsWrapperRef = useRef(null);
  const [tourPrices, setTourPrices] = useState(scorpioData);
  const [productInfo, setproductInfo] = useState({});
  const [detialsPopupShown, setDetailsPopupShown] = useState(false);
  const router = useRouter();
  const [earliestAvailabilityStore, setEarliestAvailabilityStore] = useState(
    {}
  );
  const [showEarliestAvailability, setShowEarliestAvailability] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isIntersecting = useOnScreen({
    ref: mediaPreviewWrapperRef,
    unobserve: true,
  });

  const { isEligible: isVideoBannerEligible, variant: videoBannerExpVariant } =
    useABTesting({
      experimentId: 'VIDEO_BANNER_BTWN_PRODUCT_CARDS_EXP',
      noTrack: true,
      customEligibilityCheckFn: () => {
        return !!curatedVideoBannerExpUids[uid]?.ytEmbedLink;
      },
    });
  const showVideoBanner =
    videoBannerExpVariant === VARIANTS.CONTROL && isVideoBannerEligible;
  const curatedBannerVideoSrc = curatedVideoBannerExpUids[uid]?.ytEmbedLink;

  const bannerImage = bannerImages?.[0];
  const { WIDTH, HEIGHT } = isMobile
    ? BANNER_DIMENSIONS.MOBILE
    : BANNER_DIMENSIONS.DESKTOP;

  const addToRef = (el: any) => {
    // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
    el && productsRef.current.push(el);
  };

  const { isEligible, variant, isExperimentResolving } = useABTesting({
    experimentId: 'POI_CARD_EXPERIMENT',
    noTrack: true,
    customEligibilityCheckFn: () => isPoiMwebCard,
  });

  useEffect(() => {
    if (isEligible && !isExperimentResolving && variant) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.EXPERIMENT_VIEWED,
        [ANALYTICS_PROPERTIES.EXPERIMENT_VARIANT]: variant,
        [ANALYTICS_PROPERTIES.EXPERIMENT_NAME]:
          EXPERIMENT_NAMES.POI_CARD_EXPERIMENT,
      });
    }
  }, [isEligible, isExperimentResolving, variant]);

  const { isStage, isDev, host, design } = useContext(MBContext);

  const hostname = getHostName(isStage, isDev, host);

  const fetchProductInfo = async (tgids: any) => {
    if (!tgids) return;
    const tgidData = await fetchTourList({ tgids }).then((res) => res.json());
    const tourGroupMap = tgidData?.tourGroups?.reduce((acc: any, el: any) => {
      const { id, primaryCollection, cityCode } = el || {};
      return {
        ...acc,
        [id]: {
          ...el,
          tgid: id,
          collectionId: primaryCollection?.id,
          city: cityCode,
        },
      };
    }, {});
    setproductInfo(tourGroupMap);
  };

  useEffect(() => setTourPrices(scorpioData), [scorpioData]);

  useEffect(() => {
    if (productsLoading) {
      scroller.scrollTo('products-container', {
        duration: 600,
        offset: -120,
        smooth: 'easeInOutQuart',
      });
    }
  }, [productsLoading]);

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
  const showNextAvailable = legacyBooleanCheck(enableEarliestAvailability);

  useEffect(() => {
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

      const earliestAvailabilityData = Object.keys(inventory).reduce(
        (acc: Record<number, any>, tgid) => {
          const tour = inventory?.[Number(tgid) as keyof typeof inventory];
          const { sortedInventoryDates } = tour || {};
          const [firstAvailableDate] = sortedInventoryDates || [];

          if (!firstAvailableDate) return acc;

          return {
            ...acc,
            [tgid]: {
              startDate: firstAvailableDate,
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

  const selectedDate = router.query.selectedDate;
  useEffect(() => {
    if (!productsRef.current || isExperimentResolving) return;

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
  }, [
    productsRef,
    selectedDate,
    trackProductCardsViewed,
    isExperimentResolving,
    availableToursList,
  ]);
  const allTgids = availableToursList?.map((el: any) => el?.tgid);

  useEffect(() => {
    fetchProductInfo(allTgids);
  }, []);

  const isV1DesignSite = isMBDesign({
    currentDesign: design || '',
    expectedDesign: [DESIGN.V1],
  });

  const shouldShowHeading = isV1DesignSite
    ? !isCollectionMB && !isAirportTransfersMB
    : true;

  const showLoader =
    isEligible &&
    (productsLoading || isPopupExperimentResolving || isExperimentResolving);

  const getProductCardFromTourAndIndex = (
    tour: Record<string, any>,
    index: number,
    isSmallComboCard = false
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
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    } = productInfo[tgid] ?? {};

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
      collectionId,
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
      isModifiedProductCard,
      isPoiMwebCard,
      isSmallComboCard,
      reviewsDetails,
      originalRank: ogIndex ? ogIndex + 1 : undefined,
      showBoosters,
      topReviews,
      showPopup,
    };

    return isSmallComboCard ? (
      <Product
        {...childProps}
        showNewCard={isEligible && variant === VARIANTS.TREATMENT}
      />
    ) : (
      <ProductWrapper ref={addToRef} data-tgid={tour.tgid} key={tour.tgid}>
        {isTicketCard ? (
          <TicketCard {...childProps} />
        ) : (
          <Product
            {...childProps}
            showNewCard={isEligible && variant === VARIANTS.TREATMENT}
          />
        )}
        <Conditional if={mbTheme === THEMES.MIN_BLUE}>
          <HorizontalLine colorProp={COLORS.GRAY.G6} />
        </Conditional>
      </ProductWrapper>
    );
  };

  const handleCuratedVideoBannerClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.CURATED_VIDEO_BANNER_EXP.CTA_CLICKED,
    });

    openModal();
  };

  const openModal = () => {
    setIsModalOpen(true);
    trackEvent({
      eventName: ANALYTICS_EVENTS.CURATED_VIDEO_BANNER_EXP.VIDEO_PLAYER_OPENED,
    });
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const trackVideoLoadedFn = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.CURATED_VIDEO_BANNER_EXP.VIDEO_READY,
    });
  };

  const trackVideoPlayedFn = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.CURATED_VIDEO_BANNER_EXP.VIDEO_PLAYED,
    });
  };

  const trackVideoProgressFn = (videoProgress: number) => {
    if (
      videoProgress === 10 ||
      videoProgress === 25 ||
      videoProgress === 50 ||
      videoProgress === 75
    ) {
      trackEvent({
        eventName:
          ANALYTICS_EVENTS.CURATED_VIDEO_BANNER_EXP[
            `VIDEO_VIEWED_${videoProgress}`
          ],
      });
    }
  };

  const getYoutubeBanner = ({
    tour,
    bannerKey,
  }: {
    tour: Record<string, any>;
    bannerKey: string | number;
  }) => (
    <>
      <Conditional if={isModalOpen && curatedBannerVideoSrc}>
        <Modal
          style={modalStyles}
          onRequestClose={closeModal}
          isOpen={isModalOpen}
        >
          <IFrameWrapper>
            <IFrame
              trackVideoProgressFn={trackVideoProgressFn}
              trackVideoPlayedFn={trackVideoPlayedFn}
              trackVideoLoadedFn={trackVideoLoadedFn}
              autoplay={true}
              src={curatedBannerVideoSrc}
            />
          </IFrameWrapper>
        </Modal>
      </Conditional>
      <YoutubeBannerWrapper
        onClick={handleCuratedVideoBannerClick}
        key={bannerKey}
        ref={mediaPreviewWrapperRef}
      >
        <YoutubeBanner>
          <YoutubeBanneLeft>
            <h3>{strings.CURATED_VIDEO_BANNER.TITLE1}</h3>
            <p>{strings.CURATED_VIDEO_BANNER.TITLE2}</p>
          </YoutubeBanneLeft>
          <YoutubeBanneRight>
            <MediaPreviewWrapper
              className={
                isIntersecting
                  ? 'animate-media-preview'
                  : 'media-preview-not-intersecting-styles'
              }
            >
              <MediaPreview>
                <div className="media-player-wrapper">
                  <Conditional if={!tour.bannerVideo}>
                    <Image
                      url={tour.bannerImage.url}
                      width={WIDTH}
                      height={HEIGHT}
                      imageId={'media-image'}
                      alt={tour.bannerImage.alt}
                      priority
                      fill
                    />
                  </Conditional>
                  <Conditional if={tour.bannerVideo}>
                    <Video
                      url={tour.bannerVideo!}
                      imageWidth={WIDTH}
                      imageHeight={HEIGHT}
                      fallbackImage={tour.bannerImage}
                      dontLazyLoadImage
                      shouldVideoPlay
                      videoPosition={VIDEO_POSITIONS.BANNER}
                      showPauseIcon={false}
                      showPlayIcon={false}
                    />
                  </Conditional>
                </div>
              </MediaPreview>
            </MediaPreviewWrapper>
            <div className="label-wrapper">
              <VideoPlayIcon />
              <h3>{strings.CURATED_VIDEO_BANNER.WATCH_VIDEO}</h3>
            </div>
          </YoutubeBanneRight>
        </YoutubeBanner>
      </YoutubeBannerWrapper>
    </>
  );

  const isBannerMediaPresent = !!bannerVideo || !!bannerImage;
  if (
    availableToursList?.length > 3 &&
    isBannerMediaPresent &&
    showVideoBanner
  ) {
    availableToursList = [
      ...availableToursList.slice(0, 3),
      // insert item just after 3rd item
      {
        bannerVideo,
        isBannerVideo: !!bannerVideo,
        bannerImage,
        isBannerImage: !!bannerImage,
      },
      // part of the array after the specified index
      ...availableToursList.slice(3),
    ];
  }

  return (
    <StyledProductsWrapper
      isLoading={showLoader}
      isTicketCard={isTicketCard}
      id="products-container"
      ref={productsWrapperRef}
    >
      <ProductContainer
        isTicketCard={isTicketCard}
        isMobile={isMobile}
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
        isMobile={isMobile}
        isNotVisible={showLoader}
      >
        {availableToursList &&
          availableToursList.map((tour: Record<string, any>, index: number) => {
            if (tour.isBannerVideo || tour.isBannerImage) {
              return getYoutubeBanner({ tour, bannerKey: index });
            }

            return getProductCardFromTourAndIndex(tour, index);
          })}
      </ProductContainer>
    </StyledProductsWrapper>
  );
};

export default PopulateProducts;
