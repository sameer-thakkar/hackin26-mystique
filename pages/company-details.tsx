import { CUSTOM_TYPES, DROPDOWN_ELEMENT } from 'constants/index';

import React, { Component } from 'react';
import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import ContentContainer from 'components/UI/ContentContainer';
import Paragraph from 'components/UI/Paragraph';
import { TopHeading } from 'components/UI/Headings';
import { MinimalHelmet } from 'components/common/NextSeoMeta';
import { getPrismicDocument } from 'utils/prismicUtils';
import { Client } from 'config/prismic-config';
import 'lazysizes';

export default class companyDetails extends Component<any, any> {
  state = {
    dropdown: {
      lang: false,
      hamburger: false,
    },
    isMobile: false,
  };

  static async getInitialProps({ req, res, query }) {
    try {
      const isDev = req
        ? !!query.mystique_uid
        : window.location.search.includes('mystique_uid');

      const props = await companyDetails.getTermsData({
        req,
        res,
        isDev,
        query,
      });
      return props;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  static async getTermsData({ req, res, isDev, query }) {
    let uid;
    const { host } = req ? req.headers : window.location;
    if (isDev) {
      uid = req
        ? query.mystique_uid
        : window.location.search.includes('mystique_uid');
    } else {
      const { host } = req ? req.headers : window.location;
      uid = host.replace('stage-', '');
    }

    const { ContentType, CMSContent } = await getPrismicDocument({
      req,
      serverResponse: res,
      query,
      isDev,
      useHostAsUid: true,
    });
    let response, footerID, headerID;
    switch (ContentType) {
      case CUSTOM_TYPES.GLOBAL_HOMEPAGE:
        response = CMSContent;
        footerID = response.data.common_footer.id;
        headerID = response.data.common_header.id;
        break;
      case CUSTOM_TYPES.MICROSITE:
        response = CMSContent.completeMicrosite.data;
        footerID = response.data.footer_ref.id;
        headerID = response.data.common_header_ref.id;
    }
    if (footerID) {
      const commonFooter = await Client(req).getByID(footerID);
      response.data.commonFooter = commonFooter;
    }
    if (headerID) {
      const commonHeader = await Client(req).getByID(headerID);
      response.data.commonHeader = commonHeader;
    }
    return { response, host, uid };
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
      link_to_logo_file,
      logo,
      favicon,
      logo_redirection_url: logoRedirectionURL,
      commonFooter,
      commonHeader,
    } = data;
    const headerLogoAltText =
      logo?.alt || data?.logo_alt_text || commonHeader?.data?.logo_alt_text;
    const headerLogoUrl =
      link_to_logo_file?.url?.logoUrl ||
      logo?.uploadedLogoUrl ||
      commonHeader?.data?.logo?.url;
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
          logoUrl={headerLogoUrl || '/'}
          currentLanguage={'en'}
          logoAltText={headerLogoAltText}
          selectedLanguage={'en'}
          uid={uid}
          isMobile={this.state.isMobile}
          logoRedirectionURL={logoRedirectionURL?.url || '/'}
          dropdown={this.state.dropdown}
          handleDropdownToggle={this.handleDropdownToggle}
        />
        <ContentContainer>
          <TopHeading h1>Company Details</TopHeading>
          <Paragraph>
            <b>Company Name:</b> <br />
            Headout Inc.
          </Paragraph>
          <Paragraph>
            <b>Mailing Address:</b>
            <br /> 82 Nassau St #60351 New York, NY 10038
          </Paragraph>
          <Paragraph>
            <b>Contact Information:</b> <br />
            <a href="mailto:support@headout.com">support@headout.com</a>
          </Paragraph>
        </ContentContainer>
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
