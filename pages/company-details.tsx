import React, { Component } from 'react';
import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import ContentContainer from 'components/UI/ContentContainer';
import Paragraph from 'components/UI/Paragraph';
import { TopHeading } from 'components/UI/Headings';
import { MinimalHelmet } from 'components/common/NextSeoMeta';

import { Client } from '../config/prismic-config';
import { DROPDOWN_ELEMENT } from '../constants';
import 'lazysizes';

export default class companyDetails extends Component<any, any> {
  state = {
    dropdown: {
      lang: false,
      hamburger: false,
    },
    isMobile: false,
  };

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
      superHost = host.replace('stage-', '');
    }

    const lang = 'en-us';
    const uidType = 'microsite';
    const response = await Client(req).getByUID(uidType, superHost, { lang });
    const footerID = response.data.footer_ref.id;
    if (footerID) {
      const commonFooter = await Client(req).getByID(footerID);
      response.data.commonFooter = commonFooter;
    }
    return { response };
  }

  handleDropdownToggle = (elementIdentifier) => {
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

  componentDidMount() {
    this.setState({ isMobile: window.innerWidth < 768 });
  }

  render() {
    const { response, host } = this.props;
    const { uid, data } = response;
    const {
      link_to_logo_file: { url: logoUrl },
      logo: { url: uploadedLogoUrl, alt: altText },
      favicon,
      logo_alt_text: logoAltText,
      logo_redirection_url: logoRedirectionURL,
      commonFooter,
    } = data;
    const footerLogoURL =
      commonFooter?.data?.logo.url ||
      response.data?.footer_logo_link?.url ||
      response.data?.footer_logo?.url;
    const footerLogoAlt =
      commonFooter?.data?.logo.alt ||
      response?.data?.footer_logo_alt ||
      response?.data?.footer_logo?.alt;

    return (
      <>
        <MinimalHelmet
          title="Company Details"
          favicon={favicon}
          description={`Company Details page for ${host}`}
        />
        <Header
          headerLinks={null}
          logoUrl={logoUrl || uploadedLogoUrl || null}
          currentLanguage={'en'}
          logoAltText={altText || logoAltText}
          selectedLanguage={'en'}
          uid={uid}
          isMobile={this.state.isMobile}
          logoRedirectionURL={logoRedirectionURL.url || '/'}
          dropdown={this.state.dropdown}
          handleDropdownToggle={this.handleDropdownToggle}
        />
        <ContentContainer>
          <TopHeading h1>Company Details</TopHeading>
          <Paragraph>
            <b>Website operator:</b> <br />
            Headout UK Ltd. <br /> 14 Grays Inn Road, <br /> London, WC1X 8HN,
            <br /> United Kingdom
          </Paragraph>
          <Paragraph>
            <b>Management:</b>
            <br /> Varun M. Khona, Suren Sultania
          </Paragraph>
          <Paragraph>
            <b>Contact information</b> <br />
            support@headout.com
          </Paragraph>
          <Paragraph>
            <b>Company Number:</b> 10497035 (Companies House, UK)
          </Paragraph>
          <Paragraph>
            <b> VAT Number:</b> 275 5393 71
          </Paragraph>
          <Paragraph>
            <b> Online Dispute Resolution website of the EU-Commission:</b>
            <br />
            ec.europa.eu/consumers/odr/main
          </Paragraph>
        </ContentContainer>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Footer
          currentLanguage={'en'}
          logoURL={footerLogoURL}
          logoAlt={footerLogoAlt}
          attraction={commonFooter?.data?.attraction || 'attraction'}
          microbrandType={commonFooter?.data?.microbrand_type}
          hasPoweredByHeadoutLogo={
            commonFooter?.data?.powered_by_superbrand || false
          }
          showDisclaimer={commonFooter?.data?.show_disclaimer}
          disclaimerText={commonFooter?.data?.disclaimer_text}
          slices={[]}
        />
      </>
    );
  }
}
