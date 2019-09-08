import React, { Component } from "react";
import "lazysizes";
import Header from "./Header";
import Banner from "./Banner";
import PopulateUncategorizedProducts from "./PopulateUncategorizedProducts";
import Footer from "./Footer";
import LongForm from "./LongForm";
import FreeTourPopup from "./FreeTourPopup";
import GroupBooking from "./GroupBooking";
import populateHead from "./common/meta";

export default class Microsite extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      tourPrices: [],
      currencySymbol: "",
      languageDropdown: false,
      popupOpen: false,
      showGroupBookingModal: false
    };
  }

  trackEvent = ({ eventName, ...labelProps }) => {
    if (window && (window as any).dataLayer) {
      const allProps = {
        event: eventName,
        url: window.location.href,
        ...labelProps
      };
      (window as any).dataLayer.push(allProps);
    }
  };

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
    // console.log(JSON.stringify(this.props, null, 4));
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
    const { lang: currentLanguage, uid: currentDomain } = this.props.data;
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
      has_terms_page: hasTermsPage,
      enable_localization_menu: hasLanguageSelector,
      enable_group_booking: enableGroupBooking,
      enable_buy_tickets_shortcut: enableBuyTickets
    } = this.props.data.data;
    const showGroupBooking = enableGroupBooking === "Yes";
    const { results: productOffer } = this.props.offerData
      ? this.props.offerData
      : { results: [] };
    const hasOffer = productOffer.length > 0;
    const offerPopup = hasOffer ? productOffer[0] : null;
    const {
      group_booking_excluded_tgids: groupBookingExcludedTgids
    } = this.props.data.data;

    let groupBookingTourTitles = [];

    if (showGroupBooking) {
      uncategorizedToursList
        .filter(function(tour) {
          return !groupBookingExcludedTgids.find(function(excludedTour) {
            return tour.tgid === excludedTour.tgid;
          });
        })
        .forEach(tour => {
          groupBookingTourTitles.push({
            value:
              tour.tour_title_override ||
              this.props.scorpioData[tour.tgid].title,
            label:
              tour.tour_title_override ||
              this.props.scorpioData[tour.tgid].title
          });
        });
    }

    const {
      first_publication_date: datePublished,
      last_publication_date: dateModified,
      lang
    } = this.props;

    return (
      <div>
        <div className="microsite-container">
          {this.state.showGroupBookingModal && (
            <GroupBooking
              closeGroupBookingModal={() => this.closeGroupBookingModal}
              groupBookingTourTitles={groupBookingTourTitles}
            />
          )}
          {populateHead({
            ...this.props.data.data,
            datePublished,
            dateModified,
            lang
          })}
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
            isMobile={isMobile}
            hasLanguageSelector={hasLanguageSelector}
            showGroupBooking={showGroupBooking}
            enableBuyTickets={enableBuyTickets}
          />
          <Banner
            bannerImages={bannerImages ? bannerImages : null}
            bannerHeading={bannerHeading ? bannerHeading : null}
            bannerCtaText={bannerCtaText ? bannerCtaText : null}
            isMobile={isMobile}
            boxed={true}
          />
          {uncategorizedToursList.length > 0 && (
            <PopulateUncategorizedProducts
              uncategorizedTours={uncategorizedToursList}
              scorpioData={this.props.scorpioData}
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
              trackEvent={({ eventName, ...labelProps }) =>
                this.trackEvent({ eventName, ...labelProps })
              }
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
              scorpioData={this.props.scorpioData}
              isMobile={isMobile}
              trackEvent={({ eventName, ...labelProps }) =>
                this.trackEvent({ eventName, ...labelProps })
              }
            />
          )}
        </div>
      </div>
    );
  }
}
