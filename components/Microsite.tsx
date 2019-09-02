import React, { Component } from "react";
import "lazysizes";
import Header from "./Header";
import Banner from "./Banner";
import PopulateUncategorizedProducts from "./PopulateUncategorizedProducts";
import Footer from "./Footer";
import LongForm from "./LongForm";
import FreeTourPopup from "./FreeTourPopup";
import GroupBooking from "./GroupBooking";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";
import Head from "next/head";

function getSchemaJson(props) {
  const url = props.data.data.domain_name;
  const langCode = props.data.lang.substring(0, 2);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `https://${props.data.uid}#website`,
        url: `https://${props.data.uid}/`,
        name: `${props.data.data.title}`,
        potentialAction: {
          "@type": "SearchAction",
          target: `https://${props.data.uid}/?s={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "ImageObject",
        "@id": `https://${props.data.uid}/#primaryimage`,
        url: `${props.data.data.favicon.url}`,
        width: 1727,
        height: 453
      },
      {
        "@type": "WebPage",
        "@id": `${url}/#webpage`,
        url: `${url}`,
        inLanguage: `${langCode}`,
        name: `${props.data.data.title}`,
        isPartOf: { "@id": `https://${props.data.uid}/#website` },
        primaryImageOfPage: {
          "@id": `https://${url}/#primaryimage`
        },
        description: `${props.data.data.description}`
      }
    ]
  };
}

export const populateHead = props => {
  const { data } = props;
  const otherMetaTags = data.data.other_meta_tags;
  const headerScripts = data.data.header_scripts;
  const dynamicMeta = (
    <React.Fragment>
      <title>{data.data.title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="icon" href={`${data.data.favicon.url}`} />
      <script type="application/ld+json">
        {JSON.stringify(getSchemaJson(props))}
      </script>
    </React.Fragment>
  );

  const metaTags = otherMetaTags.map(meta => ReactHtmlParser(meta.meta_tag));
  const scriptTags = headerScripts
    .map(script => script.script_tag)
    .map(str => str.replace("<script>", "").replace("</script>", ""))
    .map((item, index) => (
      <script key={index} dangerouslySetInnerHTML={{ __html: item }} />
    ));

  return (
    <Head>
      {dynamicMeta}
      {metaTags}
      {scriptTags}
    </Head>
  );
};

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
      has_terms_page: hasTermsPage,
      enable_localization_menu: hasLanguageSelector
    } = this.props.data.data;
    const { results: productOffer } = this.props.offerData;
    const productOfferIds = uncategorizedToursList.map(
      offerId => offerId.offer__free_tour.id
    );
    const slug = this.props.data.data.slug;
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
          {populateHead(this.props)}
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
            slug={slug}
            hasLanguageSelector={hasLanguageSelector}
          />
          <Banner
            bannerImages={bannerImages ? bannerImages : null}
            bannerHeading={bannerHeading ? bannerHeading : null}
            bannerCtaText={bannerCtaText ? bannerCtaText : null}
            isMobile={isMobile}
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
