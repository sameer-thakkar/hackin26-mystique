import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import Product from 'components/Product';
import Conditional from 'components/common/Conditional';
import HorizontalLine from 'components/slices/HorizontalLine';
import { COLORS, SOLEIL } from 'const/ui-constants';
import { THEMES } from 'const/index';
import { strings } from 'const/strings';
import { fetchInventory } from 'utils/apiUtils';
import { legacyBooleanCheck } from 'utils';
import TicketCard from 'components/slices/ContentPageTicketsCard';

const StyledProductsWrapper = styled.div`
  margin: 0 auto;
  #tour-list-heading {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    @media (max-width: 768px) {
      margin: 0 16px 24px 16px;
      width: auto;
    }
  }
`;

const ProductContainer = styled.div`
  display: grid;
  grid-row-gap: ${({ theme }) => theme.productCards.gap.desktop};
  margin-top: 48px;
  margin-bottom: 48px;
  & > ${HorizontalLine} {
    border-bottom-style: dashed;
  }
  & > ${HorizontalLine}:last-child {
    display: none;
  }
  @media (max-width: 768px) {
    margin-bottom: 60px;
    grid-row-gap: ${({ theme }) => theme.productCards.gap.mobile};
  }
`;

const StyledTourListHeading = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  font-weight: ${({ isTicketCard }) => (isTicketCard ? 600 : 800)};
  font-size: ${({ isTicketCard }) => (isTicketCard ? '24px' : '32px')};
  line-height: ${({ isTicketCard }) => (isTicketCard ? '1.4' : '44px')};
  color: ${({ isTicketCard }) =>
    isTicketCard ? COLORS.GREY.G2 : COLORS.DAVY_GREY};
  @media (max-width: 768px) {
    font-size: 22px;
    line-height: 30px;
  }
`;

const StyledTourListSubHeading = styled.div`
  margin-top: 8px;
  font-family: ${SOLEIL.FONT_STACK};
  font-size: 18px;
  line-height: 1.33;
  text-align: left;
  color: ${COLORS.DAVY_GREY};
  @media (max-width: 768px) {
    font-size: 14px;
    margin-top: 4px;
  }
`;

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
    analytics,
    mbTheme,
    isAmp,
    instantCheckout,
    enableEarliestAvailability,
    isTicketCard = false,
    sectionTitle = '',
    sectionSubtext = '',
  } = props;
  const [tourPrices, setTourPrices] = useState(scorpioData);
  const [earliestAvailabilityQueue, setEarliestAvailabilityQueue] = useState(
    []
  );
  const [showEarliestAvailability, setShowEarliestAvailability] = useState(
    null
  );

  useEffect(() => setTourPrices(scorpioData), [scorpioData]);

  useEffect(() => {
    const fetchEarliestAvailability = async ({
      uncategorizedToursList,
      currency = null,
    }) => {
      const requestQueue = uncategorizedToursList.map(({ tgid }) =>
        fetchInventory({ tgid, currency })
      );
      const response: Array<any> = await Promise.all(requestQueue).then(
        (res): any =>
          res.reduce((acc: any, tour: any, index) => {
            const tgid = uncategorizedToursList[index].tgid;
            return {
              ...acc,
              [tgid]: {
                startDate: tour?.inventoryList?.[0]?.startDate || '',
                startTime: tour?.inventoryList?.[0]?.startTime || '',
              },
            };
          }, {})
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
        fetchInventory({ tgid, 'for-days': 2, currency })
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

  return (
    <StyledProductsWrapper>
      <Conditional if={mbTheme !== THEMES.MIN_BLUE}>
        <div id="tour-list-heading">
          <Conditional if={sectionTitle || strings.TOUR_LIST_HEADING}>
            <StyledTourListHeading isTicketCard={isTicketCard}>
              {isTicketCard ? sectionTitle : strings.TOUR_LIST_HEADING}
            </StyledTourListHeading>
          </Conditional>
          <Conditional if={sectionSubtext || strings.TOUR_LIST_SUB_HEADING}>
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
              marketing_highlights_override,
              tour_description_override,
              offer__free_tour,
              cta_url_suffix,
              show_scratch_price,
              product_booster,
              short_summary,
              tag_booster,
            } = tour || {};
            const childProps = {
              tgid,
              earliestAvailability,
              showEarliestAvailability,
              tid: tour_variant_id,
              title: tour_title_override,
              descriptors: marketing_highlights_override,
              highlights: tour_description_override,
              scorpioData: scorpioData?.[tgid],
              tourPrices: tourPrices,
              uid: uid,
              currentLanguage: currentLanguage,
              bookNowText,
              showLessText,
              readMoreText,
              productOffer,
              hasOffer,
              togglePopup,
              offerId: offer__free_tour?.id,
              popupState,
              isMobile,
              isAmp,
              pageUrl,
              host,
              ctaUrlSuffix: cta_url_suffix || '',
              isScratchPriceEnabled: show_scratch_price === 'Yes',
              analytics,
              position: index + 1,
              booster: product_booster,
              defaultOpen: finalToursList.length === 1,
              shortSummary: short_summary,
              boosterTag: tag_booster,
              numberOfTours: tours.length,
              instantCheckout,
            };

            return (
              <Fragment key={tgid}>
                {isTicketCard ? (
                  <TicketCard {...childProps} />
                ) : (
                  <Product {...childProps} />
                )}
                <Conditional if={mbTheme === THEMES.MIN_BLUE}>
                  <HorizontalLine colorProp={COLORS.GREY.G6} />
                </Conditional>
              </Fragment>
            );
          })}
      </ProductContainer>
    </StyledProductsWrapper>
  );
};

export default PopulateProducts;
