import React, { Component } from 'react';
import { Client } from 'config/prismic-config';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import { MinimalHelmet } from 'components/common/NextSeoMeta';
import { ContentContainer } from 'components/UI/ContentContainer';
import { TopHeading } from 'components/UI/Headings';
import Paragraph from 'components/UI/Paragraph';
import { getHeadoutLanguagecode } from 'utils';
import { fetchDomainConfig } from 'utils/apiUtils';
import { getPrismicDocument } from 'utils/prismicUtils';
import { getLogoRedirectionUrl } from 'utils/urlUtils';
import { CUSTOM_TYPES, DROPDOWN_ELEMENT } from 'const/index';

export default class companyDetails extends Component<any, any> {
  state = {
    dropdown: {
      lang: false,
      hamburger: false,
    },
    isMobile: false,
  };

  static async getInitialProps({ req, res, query }: any) {
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
      return { ...props, isDev };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  static async getTermsData({ req, isDev, query }: any) {
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
      uid,
      lang: 'en-us',
      isDev,
    });
    const {
      faviconUrl,
      logo: { logoUrl, showPoweredLogo },
      name: whiteLabelName,
    } = await fetchDomainConfig(uid);
    let response, footerID;
    switch (ContentType) {
      case CUSTOM_TYPES.GLOBAL_HOMEPAGE:
        response = CMSContent;
        footerID = response.data.common_footer.id;
        break;
      case CUSTOM_TYPES.MICROSITE:
        response = CMSContent.data;
        footerID = response.data.footer_ref.id;
    }
    if (footerID) {
      const commonFooter = await Client(req).getByID(footerID);
      response.data.commonFooter = commonFooter;
    }
    response.data.faviconUrl = faviconUrl;
    response.data.logoUrl = logoUrl;
    response.data.logoAltText = whiteLabelName;
    response.data.hasPoweredByHeadoutLogo = showPoweredLogo ?? true;
    return { response, host, uid };
  }

  handleDropdownToggle = (elementIdentifier: any) => {
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
    const { response, host, isDev } = this.props;
    const { uid, data, lang } = response;
    const {
      logoUrl,
      logoAltText,
      hasPoweredByHeadoutLogo,
      faviconUrl,
      commonFooter,
    } = data;
    const logoRedirectionUrl = getLogoRedirectionUrl({
      uid,
      lang: getHeadoutLanguagecode(lang),
      isDev,
      host,
    });

    return (
      <>
        <MinimalHelmet
          title="Company Details"
          faviconUrl={faviconUrl}
          description={`Company Details page for ${host}`}
        />
        <Header
          headerLinks={null}
          logoUrl={logoUrl}
          logoAltText={logoAltText}
          currentLanguage={'en'}
          selectedLanguage={'en'}
          uid={uid}
          isMobile={this.state.isMobile}
          logoRedirectionURL={logoRedirectionUrl}
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
          logoURL={logoUrl}
          logoAlt={logoAltText}
          attraction={commonFooter?.data?.attraction || 'attraction'}
          hasPoweredByHeadoutLogo={hasPoweredByHeadoutLogo}
          disclaimerText={commonFooter?.data?.disclaimer_text}
          slices={[]}
        />
      </>
    );
  }
}
