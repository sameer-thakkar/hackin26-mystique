import React, { useEffect, useRef, useState, useContext } from 'react';
import styled from 'styled-components';
import Product from 'components/Product';
import Conditional from 'components/common/Conditional';
import HorizontalLine from 'components/slices/HorizontalLine';
import TicketCard from 'components/slices/ContentPageTicketsCard';
import { MBContext } from 'contexts/MBContext';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  THEMES,
  PROMO_CODES,
} from 'const/index';
import { strings } from 'const/strings';
import { fetchInventory, fetchTourList } from 'utils/apiUtils';
import { legacyBooleanCheck } from 'utils';
import { sendVariableToDataLayer, trackEvent } from 'utils/analytics';
import { csvTgidToArray, getHostName } from 'utils/helper';
import { getPromoCodesDocument } from 'utils/prismicUtils';
import { expandFontToken } from 'const/typography';
import COLORS from 'const/colors';

const StyledProductsWrapper = styled.div`
  margin: 0 auto;
  #tour-list-heading {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    @media (max-width: 768px) {
      margin: 0 1rem;
      width: auto;
    }
  }
`;

const ProductContainer = styled.div`
  display: grid;
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
    margin-top: 1.5rem;
    margin-bottom: 60px;
    grid-row-gap: ${({ theme }) => theme.productCards.gap.mobile};
  }
`;

const StyledTourListHeading = styled.div`
  ${expandFontToken('Display/Small')}
  color: ${COLORS.GRAY.G2};
  @media (max-width: 768px) {
    ${expandFontToken('Heading/Regular')}
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

const ProductWrapper = styled.div``;

const PopulateProducts = (props) => {
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
    host,
    mbTheme,
    isAmp,
    instantCheckout,
    enableEarliestAvailability,
    isTicketCard = false,
    sectionTitle = '',
    sectionSubtext = '',
    pageType = '',
    growthExperiment7Variant,
  } = props;
  const isDubaiSafariPark = uid === 'www.dubai-safari-park.com';
  const productsWrapperRef = useRef(null);
  const [tourPrices, setTourPrices] = useState(scorpioData);
  const [clickedPromo, setClickedPromo] = useState();
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [allPromoCodes, setAllPromoCodes] = useState([]);
  const [finalPromoCodes, setFinalPromoCodes] = useState({});
  const [productInfo, setproductInfo] = useState({});
  const [earliestAvailabilityQueue, setEarliestAvailabilityQueue] = useState(
    []
  );
  const [showEarliestAvailability, setShowEarliestAvailability] = useState(
    null
  );
  const productsRef = useRef([]);

  const addToRef = (el) => {
    productsRef.current.push(el);
  };

  const { isStage, isDev } = useContext(MBContext);

  const hostname = getHostName(isStage, isDev, host);

  const getAllPromoCodes = async () => {
    const promoDoc = await getPromoCodesDocument();
    setAllPromoCodes(promoDoc);
  };

  const onPromoClick = async (data) => {
    setAppliedPromo(data);
  };

  const fetchProductInfo = async (tgids) => {
    const tgidData = await fetchTourList({ tgids }).then((res) => res.json());
    const tourGroupMap = tgidData?.tourGroups?.reduce((acc, el) => {
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

  useEffect(() => {
    if (!productsRef.current) return;
    try {
      const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            const { tgid: stringTgid } = entry.target?.dataset;
            const tgid = parseInt(stringTgid);
            if (tgid) {
              trackEvent({
                eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_VISIBLE,
                [ANALYTICS_PROPERTIES.TGID]: tgid,
                [ANALYTICS_PROPERTIES.POSITION]:
                  availableToursList?.findIndex((t) => t.tgid === tgid) + 1,
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

      productsRef.current.forEach((el) => {
        observer.observe(el);
      });

      return () => {
        observer.disconnect();
      };
    } catch (e) {
      //
    }
  }, [productsRef]);

  useEffect(() => setTourPrices(scorpioData), [scorpioData]);

  useEffect(() => {
    if (!productsWrapperRef?.current) return;
    try {
      const productsEl = productsWrapperRef.current;
      const { height, top } = productsEl.getBoundingClientRect();
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

  useEffect(() => {
    const fetchEarliestAvailability = async ({
      uncategorizedToursList,
      currency = null,
    }) => {
      const requestQueue = uncategorizedToursList.map(({ tgid }) => {
        return fetchInventory({
          tgid,
          hostname,
          ...(currency && {
            currency: `${currency}`,
          }),
        });
      });
      const response: Array<any> = await Promise.all(requestQueue).then(
        (res): any => {
          return res.reduce((acc: any, tour: any, index) => {
            const tgid = uncategorizedToursList[index].tgid;
            return {
              ...acc,
              [tgid]: {
                startDate: tour?.inventoryList?.[0]?.startDate || '',
                startTime: tour?.inventoryList?.[0]?.startTime || '',
              },
            };
          }, {});
        }
      );
      setEarliestAvailabilityQueue(response);
      setShowEarliestAvailability(true);
    };
    const showEarliestAvailability = legacyBooleanCheck(
      enableEarliestAvailability
    );

    if (showEarliestAvailability || instantCheckout) {
      fetchEarliestAvailability({
        uncategorizedToursList: tours,
      });
    }
  }, []);

  useEffect(() => {
    const fetchVariantPrices = async ({ variantTgids, currency }) => {
      const fetchVariantPrices: Promise<any>[] = variantTgids.map(({ tgid }) =>
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
        const inv = tourVariant?.inventoryList?.find((inventoryList) => {
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
        finalPrices[tour]['price'] = variantPrices[tour]?.price;
      }
      setTourPrices(finalPrices);
    };
    const variantTgids = tours
      ?.filter((t) => t.tgid && t.tid)
      .map((t) => ({ tgid: t.tgid, tid: t.tid }));

    if (variantTgids?.length) {
      fetchVariantPrices({ variantTgids, currency });
    }
  }, [currency]);

  const uncategorizedTours =
    showEarliestAvailability || instantCheckout
      ? tours.map((tour) => ({
          ...tour,
          earliestAvailability: earliestAvailabilityQueue[tour.tgid],
        }))
      : tours;

  const finalToursList = uncategorizedTours?.filter(
    (t) => !!scorpioData[t.tgid]
  );
  const availableToursList = uncategorizedTours?.filter(
    (tour) =>
      !!scorpioData[tour.tgid]?.available &&
      scorpioData[tour.tgid]?.highlights?.length
  );
  const allTgids = availableToursList?.map((el) => el?.tgid);

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
          (tgids?.includes(tgid) ||
            productInfo[tgid]?.collectionId == collections?.collectionId ||
            productInfo[tgid]?.city === city_name?.cityCode) &&
          !exclusions?.includes(tgid)
        );
      });

      //If any promos found based on above filtering-
      //We find promos specific to TGID -> Collection -> City in the filtered array
      if (promosForProduct?.length) {
        tgidBased = promosForProduct?.find((promo) => {
          const tgids = csvTgidToArray(promo?.tgids);
          return tgids?.includes(tgid);
        });
        if (!tgidBased) {
          collectionBased = promosForProduct?.find(
            (promo) =>
              productInfo[tgid]?.collectionId ==
              promo?.collections?.collectionId
          );

          if (!collectionBased) {
            cityBased = promosForProduct?.find(
              (promo) => productInfo[tgid]?.city === promo?.city_name?.cityCode
            );
          }
        }
        filteredPromoCodes[tgid] = tgidBased || collectionBased || cityBased;
      } else {
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

  return (
    <StyledProductsWrapper ref={productsWrapperRef}>
      <Conditional if={mbTheme !== THEMES.MIN_BLUE}>
        <div id="tour-list-heading">
          <Conditional
            if={
              availableToursList?.length &&
              (sectionTitle || strings.TOUR_LIST_HEADING)
            }
          >
            <StyledTourListHeading isTicketCard={isTicketCard}>
              {isTicketCard ? sectionTitle : strings.TOUR_LIST_HEADING}
            </StyledTourListHeading>
          </Conditional>
          <Conditional
            if={
              !isDubaiSafariPark &&
              (sectionSubtext || strings.TOUR_LIST_SUB_HEADING)
            }
          >
            <StyledTourListSubHeading>
              {isTicketCard ? sectionSubtext : strings.TOUR_LIST_SUB_HEADING}
            </StyledTourListSubHeading>
          </Conditional>
        </div>
      </Conditional>
      <ProductContainer>
        {availableToursList &&
          availableToursList.map((tour, index) => {
            const {
              tgid,
              earliestAvailability,
              tour_variant_id,
              tour_title_override,
              tour_description_override,
              product_booster,
              short_summary,
              tag_booster,
            } = tour || {};

            const {
              collectionId,
              primaryCategory,
              primaryCollection,
              primarySubCategory,
            } = productInfo[tgid] ?? {};

            const childProps = {
              tgid,
              earliestAvailability,
              showEarliestAvailability,
              tid: tour_variant_id,
              title: tour_title_override,
              descriptors: scorpioData?.[tgid]?.descriptors ?? [],
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
              isAmp,
              pageUrl,
              host,
              ctaUrlSuffix: tour.cta_url_suffix || '',
              isScratchPriceEnabled: legacyBooleanCheck(
                tour.show_scratch_price
              ),
              position: index + 1,
              booster: product_booster,
              defaultOpen: finalToursList.length === 1,
              shortSummary: short_summary,
              boosterTag: tag_booster,
              numberOfTours: tours.length,
              instantCheckout,
              indexPosition: index,
              pageType,
              clickedPromo,
              setClickedPromo,
              finalPromoCode: finalPromoCodes[tgid],
              onPromoClick,
              appliedPromo,
              collectionId,
              primaryCategory,
              primaryCollection,
              primarySubCategory,
            };

            return (
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
            );
          })}
      </ProductContainer>
    </StyledProductsWrapper>
  );
};

export default PopulateProducts;
