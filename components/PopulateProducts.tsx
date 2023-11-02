import React, { useContext, useEffect, useRef, useState } from 'react';
import { scroller } from 'react-scroll';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';
import Conditional from 'components/common/Conditional';
import HorizontalLine from 'components/slices/HorizontalLine';
import Spinner from 'UI/Spinner';
import { MBContext } from 'contexts/MBContext';
import { isMBDesign, legacyBooleanCheck } from 'utils';
import { sendVariableToDataLayer, trackEvent } from 'utils/analytics';
import {
  fetchBatchedCalendarInventory,
  fetchInventory,
  fetchTourList,
} from 'utils/apiUtils';
import { addDays, formatDateToString } from 'utils/dateUtils';
import { csvTgidToArray, generateSidenavId, getHostName } from 'utils/helper';
import { getPromoCodesDocument } from 'utils/prismicUtils';
import { getProductDescriptors } from 'utils/productUtils';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  DESIGN,
  PROMO_CODES,
  THEMES,
} from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import LazyComponent from './common/LazyComponent';

const Product = dynamic(() =>
  import(/* webpackChunkName: "Product" */ 'components/Product')
);
const TicketCard = dynamic(() =>
  import(
    /* webpackChunkName: "TicketCard" */ 'components/slices/ContentPageTicketsCard'
  )
);

const StyledProductsWrapper = styled.div<{
  isLoading: boolean;
}>`
  margin: 0 auto;
  position: relative;
  #tour-list-heading {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    @media (max-width: 768px) {
      margin: 0 1rem;
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
}>`
${({ isTicketCard, isMobile }) =>
  isTicketCard && !isMobile
    ? ` ${ticketCardDesktopDisplay} `
    : `display: grid;`}
  grid-row-gap: ${({ theme }) => theme.productCards.gap.desktop};
  margin-top: 2.25rem;
  margin-bottom: 2.25rem;
  & > ${HorizontalLine} {
    border-bottom-style: dashed;
  }
  & > ${HorizontalLine}:last-child {
    display: none;
  }
  @media (max-width: 768px) {
    margin-top: 0.5rem;
    margin-bottom: 60px;
    grid-row-gap: ${({ theme }) => theme.productCards.gap.mobile};
  }
`;

const StyledTourListSubHeading = styled.div`
  margin-top: 8px;
  ${expandFontToken('Paragraph/Large')}
  color: ${COLORS.GRAY.G2};
  @media (max-width: 768px) {
    ${expandFontToken('Paragraph/Medium')}
  }
`;

const ProductWrapper = styled.div`
  flex: 0 49%;
`;

const SpinnerWrapper = styled.div`
  position: absolute;
  left: calc(50% - 23.5px);
  top: calc(50% - 27.5px);
`;

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
    sectionSubtext = '',
    pageType = '',
    growthExperiment7Variant,
    bannerVideo,
    isCollectionMB = false,
    productsLoading,
    isNonPoi,
  } = props;
  const isDubaiSafariPark = uid === 'www.dubai-safari-park.com';
  const productsRef = useRef([]);
  productsRef.current = [];
  const productsWrapperRef = useRef(null);
  const [tourPrices, setTourPrices] = useState(scorpioData);
  const [clickedPromo, setClickedPromo] = useState();
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [allPromoCodes, setAllPromoCodes] = useState([]);
  const [finalPromoCodes, setFinalPromoCodes] = useState({});
  const [productInfo, setproductInfo] = useState({});
  const [detialsPopupShown, setDetailsPopupShown] = useState(false);
  const router = useRouter();
  const [earliestAvailabilityStore, setEarliestAvailabilityStore] = useState(
    {}
  );
  const [showEarliestAvailability, setShowEarliestAvailability] = useState(
    false
  );

  const addToRef = (el: any) => {
    // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
    el && productsRef.current.push(el);
  };

  const { isStage, isDev, host, design } = useContext(MBContext);

  const hostname = getHostName(isStage, isDev, host);

  const getAllPromoCodes = async () => {
    const promoDoc = await getPromoCodesDocument();
    setAllPromoCodes(promoDoc);
  };

  const onPromoClick = async (data: any) => {
    setAppliedPromo(data);
  };

  const fetchProductInfo = async (tgids: any) => {
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

  const availableToursList = uncategorizedTours?.filter((tour: any) => {
    const checkIfScorpioHighlightsExist =
      scorpioData[tour.tgid]?.isMBHighlightsExist;
    return (
      !!scorpioData[tour.tgid]?.available &&
      (checkIfScorpioHighlightsExist || tour?.tour_description_override?.length)
    );
  });
  const selectedDate = router.query.selectedDate;
  useEffect(() => {
    if (!productsRef.current) return;

    try {
      const observerCallback = (entries: any, observer: any) => {
        entries.forEach((entry: any) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            const { tgid: stringTgid } = entry.target?.dataset;
            const tgid = parseInt(stringTgid);
            if (tgid) {
              trackEvent({
                eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_VISIBLE,
                [ANALYTICS_PROPERTIES.TGID]: tgid,
                [ANALYTICS_PROPERTIES.POSITION]:
                  availableToursList?.findIndex((t: any) => t.tgid === tgid) +
                  1,
                [ANALYTICS_PROPERTIES.IS_TRUNCATED]: !!entry.target?.querySelector?.(
                  '.more-details'
                ),
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
  }, [productsRef, selectedDate]);
  const allTgids = availableToursList?.map((el: any) => el?.tgid);
  const filterPromoCodes = () => {
    let filteredPromoCodes = {};
    Object.keys(productInfo ?? {}).forEach((tgid) => {
      let tgidBased, collectionBased, cityBased;
      //For each product, filtering out promocodes based on relevant TGID, Collection, City
      const promosForProduct = allPromoCodes?.filter((promo) => {
        const {
          tgids: tgidsString,
          exclusions: exclusionsString,
          collections,
          city_name,
        } = promo || {};
        const tgids = csvTgidToArray(tgidsString);
        const exclusions = csvTgidToArray(exclusionsString);
        return (
          (tgids?.includes(Number(tgid)) ||
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            productInfo[tgid]?.collectionId ==
              (collections as any)?.collectionId ||
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            productInfo[tgid]?.city === (city_name as any)?.cityCode) &&
          !exclusions?.includes(Number(tgid))
        );
      });
      //If any promos found based on above filtering-
      //We find promos specific to TGID -> Collection -> City in the filtered array
      if (promosForProduct?.length) {
        tgidBased = promosForProduct?.find((promo) => {
          const tgids = csvTgidToArray((promo as any)?.tgids);
          return tgids?.includes(Number(tgid));
        });
        if (!tgidBased) {
          collectionBased = promosForProduct?.find(
            (promo) =>
              // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
              productInfo[tgid]?.collectionId ==
              (promo as any)?.collections?.collectionId
          );
          if (!collectionBased) {
            cityBased = promosForProduct?.find(
              (promo) =>
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                productInfo[tgid]?.city === (promo as any)?.city_name?.cityCode
            );
          }
        }
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        filteredPromoCodes[tgid] = tgidBased || collectionBased || cityBased;
      } else {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        filteredPromoCodes[tgid] = PROMO_CODES.DEFAULT;
      }
    });
    return filteredPromoCodes;
  };

  useEffect(() => {
    getAllPromoCodes();
    fetchProductInfo(allTgids);
  }, []);

  useEffect(() => {
    if (Object.keys(productInfo)?.length && allPromoCodes && finalPromoCodes) {
      const finalPromos = filterPromoCodes();
      setFinalPromoCodes(finalPromos);
    }
  }, [productInfo, allPromoCodes]);

  const isV1DesignSite = isMBDesign({
    currentDesign: design || '',
    expectedDesign: [DESIGN.V1],
  });
  const shouldShowHeading = isV1DesignSite ? !isCollectionMB : true;
  return (
    <StyledProductsWrapper
      isLoading={productsLoading}
      id="products-container"
      ref={productsWrapperRef}
    >
      {productsLoading && (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      )}
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
          <Conditional
            if={
              !isDubaiSafariPark &&
              availableToursList?.length > 1 &&
              (sectionSubtext || strings.TOUR_LIST_SUB_HEADING)
            }
          >
            <StyledTourListSubHeading>
              {isTicketCard ? sectionSubtext : strings.TOUR_LIST_SUB_HEADING}
            </StyledTourListSubHeading>
          </Conditional>
        </div>
      </Conditional>
      <Conditional if={!productsLoading}>
        <ProductContainer isTicketCard={isTicketCard} isMobile={isMobile}>
          {availableToursList &&
            availableToursList.map((tour: any, index: number) => {
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
              } = tour || {};
              const {
                collectionId,
                primaryCategory,
                primaryCollection,
                primarySubCategory,
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
                  filterOut: isSpecialGuidedTour
                    ? ['GUIDED_TOUR', 'AUDIO_GUIDE']
                    : null,
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
                isScratchPriceEnabled: legacyBooleanCheck(
                  tour.show_scratch_price
                ),
                position: index + 1,
                booster: product_booster,
                defaultOpen: false,
                shortSummary: short_summary,
                boosterTag: tag_booster,
                numberOfTours: tours.length,
                instantCheckout,
                indexPosition: index,
                pageType,
                clickedPromo,
                setClickedPromo,
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                finalPromoCode: finalPromoCodes[tgid],
                onPromoClick,
                appliedPromo,
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
              };
              return (
                <LazyComponent
                  key={tour.tgid}
                  target={index === 0 ? 'NONE' : 'USER'}
                >
                  <ProductWrapper
                    ref={addToRef}
                    data-tgid={tour.tgid}
                    key={tour.tgid}
                  >
                    {isTicketCard ? (
                      <TicketCard {...childProps} />
                    ) : (
                      <Product
                        {...childProps}
                        growthExperiment7Variant={growthExperiment7Variant}
                      />
                    )}
                    <Conditional if={mbTheme === THEMES.MIN_BLUE}>
                      <HorizontalLine colorProp={COLORS.GRAY.G6} />
                    </Conditional>
                  </ProductWrapper>
                </LazyComponent>
              );
            })}
        </ProductContainer>
      </Conditional>
    </StyledProductsWrapper>
  );
};

export default PopulateProducts;
