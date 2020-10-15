import React, { Component } from 'react';
import Product from './Product';
import * as labels from 'constants/localization/labels';
import styled from 'styled-components';
import { COLORS, SOLEIL } from 'constants/ui-constants';
import { csvTgidToArray } from 'utils/helper';
import Conditional from './common/Conditional';
import { THEMES } from 'constants/index';
import HorizontalLine from './slices/HorizontalLine';

const StyledUncategorizedContainer = styled.div`
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
  grid-row-gap: ${({ theme }) => theme.productCards.gap};
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
export default class PopulateUncategorizedProducts extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isClient: false,
    };
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.setState({
        isClient: true,
      });
    });
  }

  render() {
    const {
      uncategorizedTours: tours,
      tourPrices,
      uid,
      currentLanguage,
      bookNowText,
      showLessText,
      readMoreText,
      productOffer,
      hasOffer,
      togglePopup,
      popupState,
      isFetched,
      isMobile,
      scorpioData,
      pageUrl,
      host,
      analytics,
      ranking,
      mbTheme,
      allToursTabContent,
      isAmp,
    } = this.props;
    const orderedTGIDRanking = csvTgidToArray(ranking);
    const orderedTours = orderedTGIDRanking
      ? tours.sort((tourA, tourB) => {
          return (
            orderedTGIDRanking.indexOf(parseInt(tourA.tgid)) -
            orderedTGIDRanking.indexOf(parseInt(tourB.tgid))
          );
        })
      : tours;
    return (
      <StyledUncategorizedContainer>
        <Conditional if={mbTheme !== THEMES.MIN_BLUE}>
          <div id="tour-list-heading">
            <StyledTourListHeading>
              {labels[currentLanguage].TOUR_LIST_HEADING}
            </StyledTourListHeading>
            <StyledTourListSubHeading>
              {labels[currentLanguage].TOUR_LIST_SUB_HEADING}
            </StyledTourListSubHeading>
          </div>
        </Conditional>
        <ProductContainer>
          {orderedTours
            .filter((t) => !!scorpioData[t.tgid])
            .map((tour, index) => (
              <>
                <Product
                  key={index}
                  tgid={tour.tgid}
                  earliestAvailability={tour.earliestAvailability}
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
                  isFetched={isFetched}
                  isAmp={isAmp}
                  pageUrl={pageUrl}
                  host={host}
                  ctaUrlSuffix={tour.cta_url_suffix || ''}
                  isScratchPriceEnabled={tour.show_scratch_price === 'Yes'}
                  analytics={analytics}
                  position={index + 1}
                  booster={tour.product_booster}
                  defaultOpen={orderedTours.length === 1}
                  allToursTabContent={allToursTabContent?.[tour.tgid] || {}}
                  shortSummary={tour.short_summary}
                  boosterTag={tour.tag_booster}
                  numberOfTours={orderedTours.length}
                />
                <Conditional if={mbTheme === THEMES.MIN_BLUE}>
                  <HorizontalLine colorProp={COLORS.GREY_G6} />
                </Conditional>
              </>
            ))}
        </ProductContainer>
      </StyledUncategorizedContainer>
    );
  }
}
