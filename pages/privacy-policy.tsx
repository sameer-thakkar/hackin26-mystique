import React, { Component } from 'react';
import styled from 'styled-components';
import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import ContentContainer from 'components/UI/ContentContainer';
import Paragraph from 'components/UI/Paragraph';
import { TopHeading, SubHeading } from 'components/UI/Headings';
import { MinimalHelmet } from 'components/common/meta';
import { ThemeProvider } from 'styled-components';
import { MBContextProvider } from 'contexts/MBContext';
import 'lazysizes';
import '../style/global.css';
import Conditional from 'components/common/Conditional';
import RichContent from 'UI/RichContent';
import { getNakedDomain } from 'utils';
import theme from 'style/theme';

import { DROPDOWN_ELEMENT, CUSTOM_TYPES, THEMES, DESIGN } from '../constants';
import { Client } from '../config/prismic-config';

const Title = styled.div`
  margin: 10px 0px;
  font-size: 18px;
`;

export default class privacy extends Component<any, any> {
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

      const props = await privacy.getData({ req, isDev, query });
      return props;
    } catch (error) {
      console.log(error);
    }
  }

  static async getData({ req, isDev, query }) {
    let uid;
    const { host } = req ? req.headers : window.location;
    if (isDev) {
      uid = req
        ? query.mystique_uid
        : window.location.search.includes('mystique_uid');
    } else {
      uid = host.replace('stage-', '');
    }
    const lang = 'en-us';
    const response = await Client(req).getByUID(CUSTOM_TYPES.MICROSITE, uid, {
      lang,
    });
    const footerID = response.data.footer_ref.id;
    if (footerID) {
      const commonFooter = await Client(req).getByID(footerID);
      response.data.commonFooter = commonFooter;
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
      link_to_logo_file: { url: logoUrl },
      logo: { url: uploadedLogoUrl, alt: altText },
      favicon,
      logo_alt_text: logoAltText,
      localization: languages,
      logo_redirection_url: logoRedirectionURL,
      commonFooter,
      theme_override: footerTheme,
      theme: mbTheme,
      address_line: addressLine,
      organization_name: organization,
      use_domain_email: useDomain,
    } = data;
    const footerLogoURL =
      commonFooter?.data?.logo.url ||
      response.data?.footer_logo_link?.url ||
      response.data?.footer_logo?.url;
    const footerLogoAlt =
      commonFooter?.data?.logo.alt ||
      response?.data?.footer_logo_alt ||
      response?.data?.footer_logo?.alt;
    const abbreviatedOrganization =
      (organization &&
        organization
          .split(' ')
          .map((word) => word[0])
          .join('')) ||
      'Headout';

    const themeOverride =
      footerTheme === THEMES.INHERIT ? mbTheme : footerTheme;
    const nakedDomain = useDomain ? getNakedDomain(host) : 'headout.com';

    return (
      <ThemeProvider theme={theme[mbTheme || THEMES.DEFAULT]}>
        <MBContextProvider
          host={host}
          uid={uid}
          lang={'en-us'}
          microsite={{}}
          design={DESIGN.V1}
          mbTheme={mbTheme}
        >
          <MinimalHelmet
            title="Privacy Policy"
            favicon={favicon}
            description={`Privacy Policy page for ${host}`}
          />
          <Header
            languages={languages ? languages : null}
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
            <TopHeading h1>Privacy Policy</TopHeading>
            <Paragraph>
              This document represents a legal document that serves as our
              privacy policy (“Privacy Policy”). It governs the privacy terms of
              our Website. Our Privacy Policy is part of our Legal Terms.
              Capitalized terms, unless otherwise defined below, have the
              meaning specified within the Definitions section our Terms of Use.{' '}
              <br />
              The last update to our Privacy Policy was posted on {host}
              /privacy-policy
            </Paragraph>
            <SubHeading>Your Privacy</SubHeading>
            <Paragraph>
              {organization} (“{abbreviatedOrganization}
              ”/”We”/”Us”) follows all legal requirements to protect your
              protect your privacy. Our Privacy Policy is a legal statement that
              explains how we may collect information from you, how we may share
              your information, and how you can limit our sharing of your
              information.
            </Paragraph>
            <Paragraph as="div">
              We break up the types of information you share into Non Personal
              Information and Personally Identifiable Information.
              <ul>
                <li>
                  {`"Non Personal Information" is information that is not personally
                  identifiable to you and that we automatically collect when you
                  access our Website with a web browser.`}
                </li>
                <li>
                  {`"Personally Identifiable Information" is non-public information
                  that is personally identifiable to you and obtained in order for
                  us to provide you within access to certain features of our
                  Website. This can include information about your Entity as a
                  Provider or as a User when making purchases from a Provider.
                  Personally Identifiable Information may include information such
                  as your email address, physical location, business name, and
                  other related information that you provide to us or that we
                  obtain about you. It may also include any images that upload
                  when using our Website as well as credit card or other payment
                  information that you may present when making a purchase from a
                  Provider through our Website (please note the important
                  exception below under Online Purchases regarding payment
                  information provided through our Website).`}
                </li>
              </ul>
            </Paragraph>
            <SubHeading>Information We Collect</SubHeading>
            <Paragraph>
              Generally, you control the amount and type of information you
              provide to {abbreviatedOrganization} when using our Website. As a
              Visitor, you can browse our Website to find out more about our
              Website a You are not required to provide us with any Personally
              Identifiable Information as a Visitor.
              <Paragraph>
                However, if registered as a Member or a Customer, you must
                provide Personally Identifiable Information to{' '}
                {abbreviatedOrganization} in order for us to provide you with
                certain features our Website. We collect your Personally
                Identifiable Information in the following ways:
              </Paragraph>
            </Paragraph>
            <Title>At Member Registration</Title>
            <Paragraph>
              When you register for membership, we collect your name and email
              address so that we can communicate with you about our Website.
            </Paragraph>
            <Title>Participation in Our Website</Title>
            <Paragraph>
              You can upload Member Content as part of using our Website. You
              should take great care in what you may upload so as not to
              infringe on your own privacy or that of others. We don’t have a
              duty to review what you upload.
            </Paragraph>
            <Title>Online Purchases</Title>
            <Paragraph>
              Members and Visitors can make purchases of products/services from
              a Provider through our Website. The payment information you
              provide clearly contains Personally Identifiable Information.
              However, any payment information that you give to a Provider
              outside of our Website is not subject to this Privacy Policy.
            </Paragraph>
            <Title>Online Forms</Title>
            <Paragraph>
              There may be online forms used in our Website. The information you
              enter into these online forms may contain Personally Identifiable
              Information.
            </Paragraph>
            <Title>Computer Information Collected</Title>
            <Paragraph>
              When you use our Website, we automatically collect certain
              computer information by the interaction of your mobile phone or
              web browser with our Website. Such information is typically
              considered Non Personal Information. We also collect the
              following:
            </Paragraph>
            <Title>Cookies</Title>
            <Paragraph>
              Our Website uses “Cookies” to identify the areas of our Website
              that you have visited. A Cookie is a small piece of data stored on
              your computer or mobile device by your web browser. We use Cookies
              to personalize the Content that you see on our Website. Most web
              browsers can be set to disable the use of Cookies. However, if you
              disable Cookies, you may not be able to access functionality on
              our Website correctly or at all. We never place Personally
              Identifiable Information in Cookies.
            </Paragraph>
            <Title>Web Beacons</Title>
            <Paragraph>
              We may also use a technology called, web beacons, to collect
              general information about your use of our Website and your use of
              special promotions or newsletters (“Web Beacons”). The information
              we collect by Web Beacons allows us to statistically monitor the
              number of people that open our emails. Web Beacons are not used to
              track your activity outside of our Website. We do not link Non
              Personal Information from the Web Beacons to Personally
              Identifiable Information without your permission.
            </Paragraph>
            <Title>Automatic Information</Title>
            <Paragraph>
              We automatically receive information from your web browser or
              mobile device. This information includes the name of the Website
              from which you entered our Website, if any, as well as the name of
              the Website to which you’re headed when you leave our Website.
              This information also includes the IP address of your
              computer/proxy server that you use to access the Internet, your
              Internet Website provider name, web browser type, type of mobile
              device, and computer operating system. We use all of this
              information to analyze trends among our Users to help improve our
              Website.
            </Paragraph>
            <SubHeading>How We Use Your Information</SubHeading>
            <Paragraph>
              We use the information we receive from you as follows:
            </Paragraph>
            <Title>Providing and Improving Our Website</Title>
            <Paragraph>
              We may use the Personally Identifiable information you provide to
              us along with any computer information we receive to provide our
              Website to you as well as to make improvements to it.
            </Paragraph>
            <SubHeading>Communications and Email Alerts</SubHeading>
            <Paragraph>
              When we communicate with you about our Website, we will use the
              email address you provided when registering as a Member. We may
              also send you Website alerts regarding your use of our Website.
              Finally, we may also send you emails with promotional information
              about us, unless you have opted out of receiving such information.
              You can change contact preferences at any time through your
              account. While you can opt-out of promotional messages, you cannot
              opt-out of receiving Website alerts.
            </Paragraph>
            <Title>
              Sharing Information with Affiliates and Other Third Parties
            </Title>
            <Paragraph>
              We do not sell, rent, or otherwise provide your Personally
              Identifiable Information to third parties for marketing purposes.
              We may provide your Personally Identifiable Information to
              affiliates that provide services to us with regards to our Website
              (i.e. payment processors, webhosting companies, etc.); such
              affiliates will only receive information necessary to provide the
              respective services and will be bound by confidentiality
              agreements limiting the use of such information.
            </Paragraph>
            <SubHeading>Legally Required Releases of Information</SubHeading>
            <Paragraph>
              We may be legally required to disclose your Personally
              Identifiable Information, if such disclosure is (a) required by
              subpoena, law, or other legal process; (b) necessary to assist law
              enforcement officials or government enforcement agencies; (c)
              necessary to investigate violations of or otherwise enforce our
              Legal Terms; (d) necessary to protect us from legal action or
              claims from third parties including you and/or other Members;
              and/or (e) necessary to protect the legal rights, personal/real
              property, or personal safety
              {abbreviatedOrganization}, our Users, employees, and affiliates.
            </Paragraph>
            <SubHeading>Disclosures to Successors</SubHeading>
            <Paragraph>
              If we are acquired or merge, in whole or in part, with another
              business that would become responsible for providing the Website
              to you, we retain the right to transfer your Personally
              Identifiable Information to the new business. The new business
              would retain the right to use your Personally Identifiable
              Information according to the terms of this Privacy Policy as well
              as to any changes to this Privacy Policy as instituted by the new
              business.
            </Paragraph>
            <SubHeading>Protecting Your Child’s Privacy</SubHeading>
            <Paragraph>
              We want to protect your Child’s privacy. Even though our Website
              is not designed for use by a Child, we realize that a Child may
              attempt to access our Website. We do not knowingly collect
              Personally Identifiable Information from a Child. If you are a
              parent or guardian and believe your Child is using our Website,
              please contact us. We may ask for proof of identification before
              we remove any information to prevent malicious removal of account
              information. If we discover on our own that a Child is accessing
              our Website, we will delete the information as soon as we discover
              it, we will not use the information for any purpose, and we will
              not disclose the information to third parties. You acknowledge
              that we do not verify the age of our users nor do we have any
              liability to do so. If you are a Child, please do not access our
              Website.
            </Paragraph>
            <SubHeading>
              Protecting the Privacy Rights of Third Parties
            </SubHeading>
            <Paragraph>
              We believe in everyone’s right to privacy. If any Member Content
              you upload to our Website contain the images of third parties
              (i.e. bystanders), you need to make sure you have permission to
              include them in your image. While we are not legally liable for
              the actions of our Users, we will remove any images for which we
              are notified that such images violate the privacy rights of
              others.
            </Paragraph>
            <SubHeading>Links to Other Websites</SubHeading>
            <Paragraph>
              Our Website may contain links to other websites (“Third Party
              Websites”). You agree that we have no control over such Third
              Party Websites and that such Third Party Websites are NOT subject
              to this Privacy Policy. These Third Party Websites may have their
              own privacy policies and other legal documents. It is your sole
              responsibility to verify the privacy policies and other legal
              documents of such Third Party Websites to see how they treat your
              personal information. You acknowledge that your use and access of
              these Websites is solely at your own risk.
            </Paragraph>
            <SubHeading>Our Email Policy</SubHeading>
            <Paragraph>
              We and our affiliates fully comply with international laws
              regarding SPAM. You can always opt out of receipt of further email
              correspondence from us and/or our affiliates. We agree that we
              will not sell, rent, or trade your email address to any
              unaffiliated third-party without your permission.
            </Paragraph>
            <SubHeading>Our Security Policy</SubHeading>
            <Paragraph>
              We have constructed our Website using industry standard encryption
              and authentication tools to protect your Personally Identifiable
              Information. When we collect your Personally Identifiable
              Information through our Website, we encrypt this information and
              attempt to prevent unauthorized access to it by using industry
              standard technologies, such as encryption software, routers and
              firewalls. Unfortunately, due to the nature of the Internet, we
              cannot completely guarantee that your Personally Identifiable
              Information is completely protected. We strongly urge you to
              protect any password you may have for our Website and to not share
              it with anyone. You should always log out of our Website when not
              in use, especially if you are sharing a computer or mobile device
              with someone else or are using a public computer.
            </Paragraph>
            <SubHeading>Privacy Policy Updates</SubHeading>
            <Paragraph>
              {`We reserves the right to modify this Privacy Policy at any time. You
              should review this Privacy Policy frequently. If we make material
              changes to this policy, we will notify you here, by email, or by
              means of a notice on our home page. We will also change the "Last
              Updated" date at the beginning of this Privacy Policy. Any changes
              we make to our Privacy Policy are effective as of this Last Updated
              date and replace any prior Privacy Policies.`}
            </Paragraph>
            <SubHeading>Changing Your Information</SubHeading>
            <Paragraph>
              You may change your email address or other Personally Identifiable
              Information at any time using the account management features
              found on our Website.
            </Paragraph>
            <SubHeading>
              Questions About Our Privacy Practices or This Privacy Policy
            </SubHeading>
            <Paragraph>
              If you have any questions about our Privacy Practices or this
              Policy, please contact us by email at privacy@{nakedDomain}
            </Paragraph>
            <SubHeading>Your California Privacy Rights</SubHeading>
            <Paragraph>
              Your California Privacy Rights identifies the practices of{' '}
              {abbreviatedOrganization}
              as they relate to the use and sharing of personal information
              California residents collected through this website. Under the law
              of the State of California, California residents who provide
              personal information via a website or other online service, such
              as this website, may request and obtain from us, once each
              calendar year, information about the personal information we have
              shared, if any, with other businesses for their own direct
              marketing uses. Where applicable, this information would include
              the categories of personal information, and the names and
              addresses of those businesses with which we have shared personal
              information for the prior calendar year. To obtain from us the
              information specified by California law, please contact:
              <br />
              <Paragraph>You can contact us at - </Paragraph>
              <Paragraph>By E-mail: support@{nakedDomain}</Paragraph>
              <Paragraph>By Mail: {organization || `Headout Inc.`}</Paragraph>
              <Conditional if={addressLine}>
                <RichContent render={addressLine} />
              </Conditional>
              <Conditional if={!addressLine}>
                <Paragraph>311 W 43d St, Suite 12036</Paragraph>
                <Paragraph>New York, NY 10036</Paragraph>
              </Conditional>
            </Paragraph>
          </ContentContainer>
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
            themeOverride={themeOverride || THEMES.DEFAULT}
          />
        </MBContextProvider>
      </ThemeProvider>
    );
  }
}
