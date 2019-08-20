import React, { Component } from "react";
import Header from "./Header";
import Banner from "./Banner";
import PopulateUncategorizedProducts from "./PopulateUncategorizedProducts";
import Footer from "./Footer";

export default class Microsite extends Component<any, any> {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      tourPrices: [],
      currencySymbol: "",
      languageDropdown: false
    };
  }

  async componentDidMount() {
    const all_tgids = [];
    const tgidsWithPrices = [];
    const { data } = this.props.data;
    const uncategorizedTours = data.body1;
    uncategorizedTours[0].items.map(tour => all_tgids.push(tour.tgid));
    const fetchPrices = await fetch(`https://api.headout.com/api/v5/tour-group/list?ids[]=${all_tgids}`);
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
    (this.state.languageDropdown) ? this.setState({languageDropdown: false}) : this.setState({languageDropdown: true})
  }

  render() {
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
    const { url: uploadedFooterLogoUrl } = this.props.data.data.footer_logo;
    const { url: footerLogoUrl } = this.props.data.data.footer_logo_link;
    const {
      footer_links: footerLinks,
      book_now_text: bookNowText,
      read_more_text: readMoreText,
      show_less_text: showLessText
    } = this.props.data.data;
    const { text: disclaimer } = this.props.data.data.disclaimer[0];
    return (
      <div className="microsite-container">
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
          />
        )}
        <Footer
          logoUrl={uploadedFooterLogoUrl || footerLogoUrl || null}
          footerLinks={footerLinks ? footerLinks : null}
          disclaimer={disclaimer ? disclaimer : null}
        />
      </div>
    );
  }
}
