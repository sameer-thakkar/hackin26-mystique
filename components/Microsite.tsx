import React, { Component } from "react";
import Header from "./Header";
import Banner from "./Banner";
import PopulateUncategorizedProducts from "./PopulateUncategorizedProducts";
import Footer from "./Footer";
import LongForm from "./LongForm";
import Prismic from "prismic-javascript";
import { apiEndpoint } from "../prismic-config";
import FreeTourPopup from "./FreeTourPopup";
import GroupBooking from "./GroupBooking";

export default class Microsite extends Component<any, any> {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      tourPrices: [],
      currencySymbol: "",
      languageDropdown: false,
      popupOpen: false
      showGroupBookingModal: false
    };
  }

  async componentDidMount() {
    const all_tgids = [];
    const tgidsWithPrices = [];
    const { data } = this.props.data;
    const uncategorizedTours = data.body1;
    uncategorizedTours[0].items.map(tour => all_tgids.push(tour.tgid));
    const fetchPrices = await fetch(
      `https://api.headout.com/api/v5/tour-group/list?ids[]=${all_tgids}`
    );
    const response = await fetchPrices.json();
    const currencySymbol = response.currencies[0].localSymbol;
    response.tourGroups.map(tour => {
      const tgidAndPrice = {
        tgid: tour.id,
        price: tour.listingPrice.finalPrice
      };
      tgidsWithPrices.push(tgidAndPrice);
    });
    this.setState({
      tourPrices: tgidsWithPrices,
      currencySymbol: currencySymbol
    });
  }

  toggleDropdown = () => {
    this.state.languageDropdown
      ? this.setState({ languageDropdown: false })
      : this.setState({ languageDropdown: true });
  };

  togglePopup = () => {
    this.state.popupOpen
      ? this.setState({ popupOpen: false })
      : this.setState({ popupOpen: true });
  };
  openGroupBookingModal = () => this.setState({ showGroupBookingModal: true });
  closeGroupBookingModal = () =>
    this.setState({ showGroupBookingModal: false });

  render() {
    const isMobile = () => {
      return document.documentElement.clientWidth < 768;
    };
    const { url: logoUrl } = this.props.data.data.link_to_logo_file;
    const { url: uploadedLogoUrl, alt: altText } = this.props.data.data.logo;
    const { logo_alt_text: logoAltText } = this.props.data.data;
    const { alternate_languages: availableLanguages } = this.props.data;
    const {
      localization: languages,
      header_links: headerLinks,
      images: bannerImages,
      heading: bannerHeading,
      cta_text: bannerCtaText
    } = this.props.data.data;
    const { lang: currentLanguage, uid: currentDomain } = this.props;
    const {
      items: uncategorizedToursList,
      primary: uncategorizedToursHeading
    } = this.props.data.data.body1[0];
    const {
      url: uploadedFooterLogoUrl,
      alt: footerAltTextUploaded
    } = this.props.data.data.footer_logo;
    const { url: footerLogoUrl } = this.props.data.data.footer_logo_link;
    const {
      footer_links: footerLinks,
      book_now_text: bookNowText,
      read_more_text: readMoreText,
      show_less_text: showLessText
    } = this.props.data.data;
    const { text: disclaimer } = this.props.data.data.disclaimer[0] || {
      text: ""
    };
    const longFormContent = this.props.data.data.body2;
    const {
      footer_logo_alt_text: footerAltText,
      has_terms_page: hasTermsPage
    } = this.props.data.data;
    const { results: productOffer } = this.props.offerData;
    const productOfferIds = uncategorizedToursList.map(
      offerId => offerId.offer__free_tour.id
    );
    const offerId = productOfferIds[0];
    const hasOffer = offerId ? true : false;
    const filterOfferPopup = productOffer.filter(popup => popup.id === offerId);
    const offerPopup = filterOfferPopup[0];

    return (
      <div>
        <div className="microsite-container">
          {this.state.showGroupBookingModal && (
          <GroupBooking
            closeGroupBookingModal={() => this.closeGroupBookingModal}
          />
        )}
          <Header
            languages={languages ? languages : null}
            headerLinks={headerLinks ? headerLinks : null}
            logoUrl={logoUrl || uploadedLogoUrl || null}
            currentLanguage={currentLanguage ? currentLanguage : null}
            logoAltText={altText || logoAltText}
            availableLanguages={availableLanguages}
            selectedLanguage={currentLanguage}
            currentDomain={currentDomain}
          languageDropdown={this.state.languageDropdown}
          toggleDropdown={this.toggleDropdown}
          openGroupBookingModal={this.openGroupBookingModal}
        />
        <Banner
          bannerImages={bannerImages ? bannerImages : null}
          bannerHeading={bannerHeading ? bannerHeading : null}
          bannerCtaText={bannerCtaText ? bannerCtaText : null}
        />
          {uncategorizedToursList.length > 0 && (
            <PopulateUncategorizedProducts
              uncategorizedTours={uncategorizedToursList}
              uncategorizedToursHeading={uncategorizedToursHeading.list_heading}
              tourPrices={this.state.tourPrices}
              currencySymbol={this.state.currencySymbol}
              currentDomain={currentDomain}
              currentLanguage={currentLanguage}
              bookNowText={bookNowText}
              readMoreText={readMoreText}
              showLessText={showLessText}
              productOffer={productOffer}
              hasOffer={hasOffer}
              isFetched={this.state.isFetched}
              togglePopup={this.togglePopup}
              isMobile={isMobile}
            />
          )}
          {longFormContent ? <LongForm content={longFormContent} /> : null}
          <Footer
            logoUrl={uploadedFooterLogoUrl || footerLogoUrl || null}
            footerLinks={footerLinks ? footerLinks : null}
            disclaimer={disclaimer ? disclaimer : null}
            footerAltText={footerAltText || footerAltTextUploaded || null}
            hasTermsPage={hasTermsPage}
            isMobile={isMobile}
          />
          {hasOffer && (
            <FreeTourPopup
              popupState={this.state.popupOpen}
              togglePopup={this.togglePopup}
              productOffer={offerPopup}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>
    );
  }
}
