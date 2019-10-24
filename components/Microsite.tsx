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
import CustomFooter from "./CustomFooter";
import { docCookies } from "../utils/helper";
import { DROPDOWN_ELEMENT } from "../constants";
export default class Microsite extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      tourPrices: [],
      currencySymbol: "",
      dropdown: {
        lang: false,
        hamburger: false
      },
      popupOpen: false,
      showGroupBookingModal: false,
      isFetched: false
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

  sendVariableToDataLayer = JSONObject => {
    if (window && (window as any).dataLayer) {
      (window as any).dataLayer.push(JSONObject);
    }
  };

  async componentDidMount() {
    const { data } = this.props.data;
    const uncategorizedTours = data.body1;
    const [variantTgids, tourGroupTgids] = uncategorizedTours[0].items.reduce(
      (accum, elem) => {
        if (elem.tour_variant_id) {
          return [
            [...accum[0], { tgid: elem.tgid, tid: elem.tour_variant_id }],
            [...accum[1]]
          ];
        } else {
          return [[...accum[0]], [...accum[1], elem.tgid]];
        }
      },
      [[], []]
    );

    const fetchTourGroupPrices = fetch(
      `https://api.headout.com/api/v5/tour-group/list?ids[]=${tourGroupTgids}`
    ).then(res => {
      const HSID = res.headers.get("x-h-sid");
      if (!docCookies.hasItem("h-sid")) {
        const nakedDomain = window.location.host
          .replace("stage.", "")
          .split(".")
          .slice(1)
          .join(".");
        docCookies.setItem(
          "h-sid",
          HSID,
          (new Date().getTime() / 1000) * 2,
          "/",
          nakedDomain,
          false
        );
      }
      this.sendVariableToDataLayer({ "h-sid": HSID });
      return res.json();
    });
    const fetchVariantPrices = variantTgids.map(tourVariant =>
      fetch(
        `https://api.headout.com/api/v5/tour-group/inventory/get/${tourVariant.tgid}`
      ).then(res => res.json())
    );
    const response = await Promise.all([
      fetchTourGroupPrices,
      ...fetchVariantPrices
    ]).then(res => res);
    const tourGroup = response[0];
    const variants = response.slice(1);
    const currencySymbol = tourGroup.currencies.length
      ? tourGroup.currencies[0].localSymbol
      : variants[0].currency.localSymbol;
    const tourGroupPrices = tourGroup.tourGroups.reduce(
      (accum, res, index) => ({
        ...accum,
        [tourGroup.tourGroups[index].id]: {
          price: res.listingPrice ? res.listingPrice.finalPrice : "",
          scratchPrice:
            res.listingPrice &&
            res.listingPrice.finalPrice < res.listingPrice.originalPrice
              ? res.listingPrice.originalPrice
              : ""
        }
      }),
      {}
    );

    const mapVariantPrices = variants.map((tourVariant: any, index) => {
      const inv = tourVariant.inventoryList.find(
        inventoryList => inventoryList.tourId == variantTgids[index].tid
      );
      return {
        tgid: variantTgids[index].tgid,
        tid: variantTgids[index].tid,
        price: inv ? inv.finalPriceProfile.persons[0].price : ""
      };
    });

    const variantPrices = mapVariantPrices.reduce(
      (accum, res, index) => ({
        ...accum,
        [mapVariantPrices[index].tgid]: {
          price: res.price
        }
      }),
      {}
    );

    const tourPrices = Object.assign(tourGroupPrices, variantPrices);

    this.setState({
      tourPrices: tourPrices,
      currencySymbol: currencySymbol,
      isFetched: true
    });
  }

  handleDropdownToggle = elementIdentifier => {
    switch (elementIdentifier) {
      case DROPDOWN_ELEMENT.HAMBURGER: {
        this.setState({
          ...this.state,
          dropdown: {
            ...this.state.dropdown,
            hamburger: !this.state.dropdown.hamburger,
            lang: false
          }
        });
        break;
      }
      case DROPDOWN_ELEMENT.LANGUAGE_SELECTOR: {
        this.setState({
          ...this.state,
          dropdown: {
            ...this.state.dropdown,
            lang: !this.state.dropdown.lang,
            hamburger: false
          }
        });
        break;
      }
      default:
        return;
    }
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
      cta_text: bannerCtaText,
      page_url: pageUrl
    } = this.props.data.data;
    const { uid: currentDomain } = this.props.data;
    const currentLanguage = this.props.data.lang.substring(0, 2);
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
      show_less_text: showLessText,
      enable_powered_by_headout_logo: hasPoweredByHeadoutLogo
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
      enable_buy_tickets_shortcut: enableBuyTickets,
      logo_redirection_url: logoRedirectionURL,
      blackout_start_date: blackoutStartDate,
      blackout_end_date: blackoutEndDate
    } = this.props.data.data;
    const showGroupBooking = enableGroupBooking === "Yes";
    const { results: productOffer } = this.props.offerData
      ? this.props.offerData
      : { results: [] };
    const hasOffer = productOffer.length > 0;
    const offerPopup = hasOffer ? productOffer[0] : null;
    const {
      group_booking_excluded_tgids: groupBookingExcludedTgids,
      customFooter
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
      lang,
      host,
      isDev
    } = this.props;

    return (
      <div>
        <div className="microsite-container">
          {this.state.showGroupBookingModal && (
            <GroupBooking
              closeGroupBookingModal={() => this.closeGroupBookingModal}
              groupBookingTourTitles={groupBookingTourTitles}
              blackoutStartDate={blackoutStartDate}
              blackoutEndDate={blackoutEndDate}
            />
          )}
          {populateHead({
            ...this.props.data.data,
            datePublished,
            dateModified,
            lang,
            isDev
          })}
          <Header
            languages={languages ? languages : null}
            headerLinks={headerLinks ? headerLinks : null}
            logoUrl={logoUrl || uploadedLogoUrl || null}
            currentLanguage={currentLanguage ? currentLanguage : null}
            logoAltText={altText || logoAltText}
            availableLanguages={availableLanguages}
            currentDomain={currentDomain}
            dropdown={this.state.dropdown}
            handleDropdownToggle={this.handleDropdownToggle}
            openGroupBookingModal={this.openGroupBookingModal}
            isMobile={isMobile}
            hasLanguageSelector={hasLanguageSelector}
            showGroupBooking={showGroupBooking}
            enableBuyTickets={enableBuyTickets}
            logoRedirectionURL={logoRedirectionURL.url || "/"}
            host={host}
            hasPoweredByHeadoutLogo={hasPoweredByHeadoutLogo}
          />
          <Banner
            bannerImages={bannerImages ? bannerImages : null}
            bannerHeading={bannerHeading ? bannerHeading : null}
            bannerCtaText={bannerCtaText ? bannerCtaText : null}
            currentLanguage={currentLanguage ? currentLanguage : null}
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
              pageUrl={pageUrl}
              isMobile={isMobile}
              trackEvent={({ eventName, ...labelProps }) =>
                this.trackEvent({ eventName, ...labelProps })
              }
              host={host}
            />
          )}
          {longFormContent ? <LongForm content={longFormContent} /> : null}
          {customFooter ? (
            <footer>
              <CustomFooter {...customFooter.data} />
            </footer>
          ) : (
            <Footer
              logoUrl={uploadedFooterLogoUrl || footerLogoUrl || null}
              footerLinks={footerLinks ? footerLinks : null}
              disclaimer={disclaimer ? disclaimer : null}
              footerAltText={footerAltText || footerAltTextUploaded || null}
              hasTermsPage={hasTermsPage}
              isMobile={isMobile}
            />
          )}
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
