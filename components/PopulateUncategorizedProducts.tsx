import React, { Component } from 'react';
import Product from './Product';
import * as labels from '../public/static/localization/labels';
import styled from 'styled-components';
import { COLORS } from '../constants/ui-constants';

const StyledUncategorizedContainer = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  #tour-list-heading {
    @media (max-width: 768px) {
      margin: 0 16px 24px 16px;
    }
  }
`;

const StyledTourListHeading = styled.div`
  font-family: Avenir;
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
  font-family: Graphik;
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
      currencySymbol,
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
    } = this.props;
    const [firstTour, ...otherTours] = tours;

    return (
      <StyledUncategorizedContainer>
        <div id="tour-list-heading">
          <StyledTourListHeading>
            {labels[currentLanguage].TOUR_LIST_HEADING}
          </StyledTourListHeading>
          <StyledTourListSubHeading>
            {labels[currentLanguage].TOUR_LIST_SUB_HEADING}
          </StyledTourListSubHeading>
        </div>
        <div className="products-container">
          <Product
            key={0}
            tgid={firstTour.tgid}
            earliestAvailability={firstTour.earliestAvailability}
            tid={firstTour.tour_variant_id}
            title={firstTour.tour_title_override}
            descriptors={firstTour.marketing_highlights_override}
            highlights={firstTour.tour_description_override}
            scorpioData={scorpioData[firstTour.tgid]}
            tourPrices={tourPrices}
            currencySymbol={currencySymbol}
            uid={uid}
            currentLanguage={currentLanguage}
            bookNowText={bookNowText}
            showLessText={showLessText}
            readMoreText={readMoreText}
            productOffer={productOffer}
            hasOffer={hasOffer}
            togglePopup={togglePopup}
            offerId={firstTour.offer__free_tour.id}
            popupState={popupState}
            isMobile={isMobile}
            isFetched={isFetched}
            pageUrl={pageUrl}
            host={host}
            ctaUrlSuffix={firstTour.cta_url_suffix || ''}
            isScratchPriceEnabled={firstTour.show_scratch_price === 'Yes'}
            analytics={analytics}
            position={1}
            booster={firstTour.product_booster}
          />

          {this.state.isClient
            ? otherTours.map((tour, index) => (
                <Product
                  key={index + 1}
                  tgid={tour.tgid}
                  earliestAvailability={tour.earliestAvailability}
                  tid={tour.tour_variant_id}
                  title={tour.tour_title_override}
                  descriptors={tour.marketing_highlights_override}
                  highlights={tour.tour_description_override}
                  scorpioData={scorpioData[tour.tgid]}
                  tourPrices={tourPrices}
                  currencySymbol={currencySymbol}
                  uid={uid}
                  currentLanguage={currentLanguage}
                  bookNowText={bookNowText}
                  showLessText={showLessText}
                  readMoreText={readMoreText}
                  productOffer={productOffer}
                  hasOffer={hasOffer}
                  togglePopup={togglePopup}
                  offerId={tour.offer__free_tour.id}
                  popupState={popupState}
                  isMobile={isMobile}
                  isFetched={isFetched}
                  pageUrl={pageUrl}
                  host={host}
                  ctaUrlSuffix={tour.cta_url_suffix || ''}
                  isScratchPriceEnabled={tour.show_scratch_price === 'Yes'}
                  analytics={analytics}
                  position={index + 2}
                  booster={tour.product_booster}
                />
              ))
            : null}
        </div>
      </StyledUncategorizedContainer>
    );
  }
}
