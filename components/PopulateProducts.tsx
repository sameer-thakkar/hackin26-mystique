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
  font-weight: 800;
  font-size: 32px;
  line-height: 44px;
  color: ${COLORS.DAVY_GREY};
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
        const inv = tourVariant?.inventoryList.find((inventoryList) => {
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
      .filter((t) => t.tgid && t.tid)
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
          <StyledTourListHeading>
            {strings.TOUR_LIST_HEADING}
          </StyledTourListHeading>
          <StyledTourListSubHeading>
            {strings.TOUR_LIST_SUB_HEADING}
          </StyledTourListSubHeading>
        </div>
      </Conditional>
      <ProductContainer>
        {availableToursList.map((tour, index) => (
          <Fragment key={tour.tgid}>
            <Product
              tgid={tour.tgid}
              earliestAvailability={tour.earliestAvailability}
              showEarliestAvailability={showEarliestAvailability}
              tid={tour.tour_variant_id}
              title={tour.tour_title_override}
              descriptors={tour.marketing_highlights_override}
              highlights={tour.tour_description_override}
              scorpioData={scorpioData?.[tour.tgid]}
              tourPrices={tourPrices}
              uid={uid}
              currentLanguage={currentLanguage}
              bookNowText={bookNowText}
              showLessText={showLessText}
              readMoreText={readMoreText}
              productOffer={productOffer}
              hasOffer={hasOffer}
              togglePopup={togglePopup}
              offerId={tour.offer__free_tour?.id}
              popupState={popupState}
              isMobile={isMobile}
              isAmp={isAmp}
              pageUrl={pageUrl}
              host={host}
              ctaUrlSuffix={tour.cta_url_suffix || ''}
              isScratchPriceEnabled={tour.show_scratch_price === 'Yes'}
              analytics={analytics}
              position={index + 1}
              booster={tour.product_booster}
              defaultOpen={finalToursList.length === 1}
              shortSummary={tour.short_summary}
              boosterTag={tour.tag_booster}
              numberOfTours={tours.length}
              instantCheckout={instantCheckout}
            />
            <Conditional if={mbTheme === THEMES.MIN_BLUE}>
              <HorizontalLine colorProp={COLORS.GREY_G6} />
            </Conditional>
          </Fragment>
        ))}
      </ProductContainer>
    </StyledProductsWrapper>
  );
};

export default PopulateProducts;
