import React, { Component } from 'react';
import Prismic from 'prismic-javascript';
import { Client } from '../prismic-config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import parse from 'url-parse';
import CustomFooter from '../components/CustomFooter';
import { DROPDOWN_ELEMENT } from '../constants';
import '../public/static/styles.css';

export default class companyDetails extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      tourPrices: [],
      currencySymbol: '',
      popupOpen: false,
      showGroupBookingModal: false,
      dropdown: {
        lang: false,
        hamburger: false,
      },
    };
  }
  static async getInitialProps({ req, query }) {
    try {
      const isDev = req
        ? !!query.mystique_uid
        : window.location.search.includes('mystique_uid');

      const props = await companyDetails.getTermsData({ req, isDev, query });
      return props;
    } catch (error) {
      console.log(error);
    }
  }

  static async getTermsData({ req, isDev, query }) {
    let superHost;
    if (isDev) {
      superHost = req
        ? query.mystique_uid
        : window.location.search.includes('mystique_uid');
    } else {
      const { host } = req ? req.headers : window.location;
      superHost = host.replace('stage.', '');
    }

    const lang = 'en-us';
    const uidType = 'microsite';
    const response = await Client(req).getByUID(uidType, superHost, { lang });
    const footerID = response.data.footer_ref.id;
    if (footerID) {
      const customFooter = await Client(req).getByID(footerID);
      response.data.customFooter = customFooter;
    }
    return { response, host: superHost };
  }
  handleDropdownToggle = elementIdentifier => {
    switch (elementIdentifier) {
      case DROPDOWN_ELEMENT.HAMBURGER: {
        this.setState({
          ...this.state,
          dropdown: {
            ...this.state.dropdown,
            hamburger: !this.state.dropdown.hamburger,
            lang: false,
          },
        });
        break;
      }
      case DROPDOWN_ELEMENT.LANGUAGE_SELECTOR: {
        this.setState({
          ...this.state,
          dropdown: {
            ...this.state.dropdown,
            lang: !this.state.dropdown.lang,
            hamburger: false,
          },
        });
        break;
      }
      default:
        return;
    }
  };

  render() {
    const { response, host } = this.props;
    const isMobile = () => {
      return document.documentElement.clientWidth < 768;
    };
    const { url: logoUrl } = response.data.link_to_logo_file;
    const { url: uploadedLogoUrl, alt: altText } = response.data.logo;
    const { logo_alt_text: logoAltText } = response.data;
    const { alternate_languages: availableLanguages } = response;
    const {
      localization: languages,
      header_links: headerLinks,
      logo_redirection_url: logoRedirectionURL,
      customFooter,
    } = response.data;

    const { lang: currentLanguage, uid } = response;
    const {
      url: uploadedFooterLogoUrl,
      alt: footerAltTextUploaded,
    } = response.data.footer_logo;
    const { url: footerLogoUrl } = response.data.footer_logo_link;
    const { footer_links: footerLinks } = response.data;
    const { text: disclaimer } = response.data.disclaimer[0] || {
      text: '',
    };
    const { footer_logo_alt_text: footerAltText } = response.data;

    let url = host || window.location.host;
    const isDev = url.includes('localhost');
    const currentHost = !isDev ? url : parse(uid, true).pathname;
    const micrositeUrl = currentHost.includes('stage')
      ? currentHost.replace('stage.', '')
      : currentHost;
    let hostSplit = micrositeUrl.split('.');
    hostSplit.shift();
    const supportURL = hostSplit.join('.');

    return (
      <React.Fragment>
        <Header
          languages={languages ? languages : null}
          headerLinks={headerLinks ? headerLinks : null}
          logoUrl={logoUrl || uploadedLogoUrl || null}
          currentLanguage={currentLanguage ? currentLanguage : null}
          logoAltText={altText || logoAltText}
          availableLanguages={availableLanguages}
          selectedLanguage={currentLanguage}
          uid={uid}
          isMobile={isMobile}
          parentComponent={'TERMS'}
          logoRedirectionURL={logoRedirectionURL.url || '/'}
          dropdown={this.state.dropdown}
          handleDropdownToggle={this.handleDropdownToggle}
        />
        <div className="terms-container">
          <div
            className="select-wrapper"
            id="select-tickets"
            style={{ margin: '0px' }}
          >
            <h1 className="select-text">Company Details</h1>
            <div className="divider"></div>
          </div>
          <div className="super-stuff">
            <div className="text">
              <b>Website operator:</b> <br />
              Headout UK Ltd. <br /> 14 Grays Inn Road, <br /> London, WC1X 8HN,
              <br /> United Kingdom
            </div>
            <div className="text">
              <b>Management:</b>
              <br /> Varun M. Khona, Suren Sultania
            </div>
            <div className="text">
              <b>Contact information</b> <br />
              support@headout.com
            </div>
            <div className="text">
              <b>Company Number:</b> 10497035 (Companies House, UK)
            </div>

            <div className="text">
              <b> VAT Number:</b> 275 5393 71
            </div>

            <div className="text">
              <b> Online Dispute Resolution website of the EU-Commission:</b>
              <br />
              ec.europa.eu/consumers/odr/main
            </div>
          </div>
        </div>
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
            isMobile={isMobile}
          />
        )}
      </React.Fragment>
    );
  }
}
