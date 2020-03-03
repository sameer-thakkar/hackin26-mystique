import React, { Component } from 'react';
import Prismic from 'prismic-javascript';
import { Client } from '../prismic-config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import parse from 'url-parse';
import CustomFooter from '../components/CustomFooter';
import { DROPDOWN_ELEMENT } from '../constants';
import '../public/static/styles.css';

export default class privacy extends Component<any, any> {
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

      const props = await privacy.getTermsData({ req, isDev, query });
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
            <h1 className="select-text">Privacy Policy</h1>
            <div className="divider"></div>
          </div>
          <div className="text">
            This document represents a legal document that serves as our privacy
            policy (“Privacy Policy”). It governs the privacy terms of our
            Website. Our Privacy Policy is part of our Legal Terms. Capitalized
            terms, unless otherwise defined below, have the meaning specified
            within the Definitions section our Terms of Use. <br />
            The last update to our Privacy Policy was posted on {micrositeUrl}
            /privacy-policy
          </div>
          <div className="sub-heading">Your Privacy</div>
          <div className="text">
            Headout Inc. (“Headout”/”We”/”Us”) follows all legal requirements to
            protect your privacy. Our Privacy Policy is a legal statement that
            explains how we may collect information from you, how we may share
            your information, and how you can limit our sharing of your
            information.
          </div>
          <div className="text">
            We break up the types of information you share into Non Personal
            Information and Personally Identifiable Information.
            <ul>
              <li>
                "Non Personal Information" is information that is not personally
                identifiable to you and that we automatically collect when you
                access our Website with a web browser.
              </li>
              <li>
                "Personally Identifiable Information" is non-public information
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
                information provided through our Website).
              </li>
            </ul>
          </div>
          <div className="sub-heading">Information We Collect</div>
          <div className="text">
            Generally, you control the amount and type of information you
            provide to Headout when using our Website. As a Visitor, you can
            browse our Website to find out more about our Website a You are not
            required to provide us with any Personally Identifiable Information
            as a Visitor.
            <div className="text">
              However, if registered as a Member or a Customer, you must provide
              Personally Identifiable Information to Headout in order for us to
              provide you with certain features our Website. We collect your
              Personally Identifiable Information in the following ways:
            </div>
          </div>
          <div className="text-sub">At Member Registration</div>
          <div>
            When you register for membership, we collect your name and email
            address so that we can communicate with you about our Website.
          </div>
          <div className="text-sub">Participation in Our Website</div>
          <div className="text">
            You can upload Member Content as part of using our Website. You
            should take great care in what you may upload so as not to infringe
            on your own privacy or that of others. We don’t have a duty to
            review what you upload.
          </div>
          <div className="text-sub">Online Purchases</div>
          <div className="text">
            Members and Visitors can make purchases of products/services from a
            Provider through our Website. The payment information you provide
            clearly contains Personally Identifiable Information. However, any
            payment information that you give to a Provider outside of our
            Website is not subject to this Privacy Policy.
          </div>
          <div className="text-sub">Online Forms</div>
          <div className="text">
            There may be online forms used in our Website. The information you
            enter into these online forms may contain Personally Identifiable
            Information.
          </div>
          <div className="sub-heading">Computer Information Collected</div>
          <div className="text">
            When you use our Website, we automatically collect certain computer
            information by the interaction of your mobile phone or web browser
            with our Website. Such information is typically considered Non
            Personal Information. We also collect the following:
          </div>
          <div className="text-sub">Cookies</div>
          <div className="text">
            Our Website uses “Cookies” to identify the areas of our Website that
            you have visited. A Cookie is a small piece of data stored on your
            computer or mobile device by your web browser. We use Cookies to
            personalize the Content that you see on our Website. Most web
            browsers can be set to disable the use of Cookies. However, if you
            disable Cookies, you may not be able to access functionality on our
            Website correctly or at all. We never place Personally Identifiable
            Information in Cookies.
          </div>
          <div className="text-sub">Web Beacons</div>
          <div className="text">
            We may also use a technology called, web beacons, to collect general
            information about your use of our Website and your use of special
            promotions or newsletters (“Web Beacons”). The information we
            collect by Web Beacons allows us to statistically monitor the number
            of people that open our emails. Web Beacons are not used to track
            your activity outside of our Website. We do not link Non Personal
            Information from the Web Beacons to Personally Identifiable
            Information without your permission.
          </div>
          <div className="text-sub">Automatic Information</div>
          <div className="text">
            We automatically receive information from your web browser or mobile
            device. This information includes the name of the Website from which
            you entered our Website, if any, as well as the name of the Website
            to which you’re headed when you leave our Website. This information
            also includes the IP address of your computer/proxy server that you
            use to access the Internet, your Internet Website provider name, web
            browser type, type of mobile device, and computer operating system.
            We use all of this information to analyze trends among our Users to
            help improve our Website.
          </div>
          <div className="sub-heading">How We Use Your Information</div>
          <div className="text">
            We use the information we receive from you as follows:
          </div>
          <div className="text-sub">Providing and Improving Our Website</div>
          <div className="text">
            We may use the Personally Identifiable information you provide to us
            along with any computer information we receive to provide our
            Website to you as well as to make improvements to it.
          </div>
          <div className="sub-heading">Communications and Email Alerts</div>
          <div className="text">
            When we communicate with you about our Website, we will use the
            email address you provided when registering as a Member. We may also
            send you Website alerts regarding your use of our Website. Finally,
            we may also send you emails with promotional information about us,
            unless you have opted out of receiving such information. You can
            change contact preferences at any time through your account. While
            you can opt-out of promotional messages, you cannot opt-out of
            receiving Website alerts.
          </div>
          <div className="text-sub">
            Sharing Information with Affiliates and Other Third Parties
          </div>
          <div className="text">
            We do not sell, rent, or otherwise provide your Personally
            Identifiable Information to third parties for marketing purposes. We
            may provide your Personally Identifiable Information to affiliates
            that provide services to us with regards to our Website (i.e.
            payment processors, webhosting companies, etc.); such affiliates
            will only receive information necessary to provide the respective
            services and will be bound by confidentiality agreements limiting
            the use of such information.
          </div>
          <div className="sub-heading">
            Legally Required Releases of Information
          </div>
          <div className="text">
            We may be legally required to disclose your Personally Identifiable
            Information, if such disclosure is (a) required by subpoena, law, or
            other legal process; (b) necessary to assist law enforcement
            officials or government enforcement agencies; (c) necessary to
            investigate violations of or otherwise enforce our Legal Terms; (d)
            necessary to protect us from legal action or claims from third
            parties including you and/or other Members; and/or (e) necessary to
            protect the legal rights, personal/real property, or personal safety
            of Headout, our Users, employees, and affiliates.
          </div>
          <div className="text-sub">Disclosures to Successors</div>
          <div className="text">
            If we are acquired or merge, in whole or in part, with another
            business that would become responsible for providing the Website to
            you, we retain the right to transfer your Personally Identifiable
            Information to the new business. The new business would retain the
            right to use your Personally Identifiable Information according to
            the terms of this Privacy Policy as well as to any changes to this
            Privacy Policy as instituted by the new business.
          </div>
          <div className="sub-heading">Protecting Your Child’s Privacy</div>
          <div className="text">
            We want to protect your Child’s privacy. Even though our Website is
            not designed for use by a Child, we realize that a Child may attempt
            to access our Website. We do not knowingly collect Personally
            Identifiable Information from a Child. If you are a parent or
            guardian and believe your Child is using our Website, please contact
            us. We may ask for proof of identification before we remove any
            information to prevent malicious removal of account information. If
            we discover on our own that a Child is accessing our Website, we
            will delete the information as soon as we discover it, we will not
            use the information for any purpose, and we will not disclose the
            information to third parties. You acknowledge that we do not verify
            the age of our users nor do we have any liability to do so. If you
            are a Child, please do not access our Website.
          </div>
          <div className="sub-heading">
            Protecting the Privacy Rights of Third Parties
          </div>
          <div className="text">
            We believe in everyone’s right to privacy. If any Member Content you
            upload to our Website contain the images of third parties (i.e.
            bystanders), you need to make sure you have permission to include
            them in your image. While we are not legally liable for the actions
            of our Users, we will remove any images for which we are notified
            that such images violate the privacy rights of others.
          </div>
          <div className="sub-heading">Links to Other Websites</div>
          <div className="text">
            Our Website may contain links to other websites (“Third Party
            Websites”). You agree that we have no control over such Third Party
            Websites and that such Third Party Websites are NOT subject to this
            Privacy Policy. These Third Party Websites may have their own
            privacy policies and other legal documents. It is your sole
            responsibility to verify the privacy policies and other legal
            documents of such Third Party Websites to see how they treat your
            personal information. You acknowledge that your use and access of
            these Websites is solely at your own risk.
          </div>
          <div className="sub-heading">Our Email Policy</div>
          <div className="text">
            We and our affiliates fully comply with international laws regarding
            SPAM. You can always opt out of receipt of further email
            correspondence from us and/or our affiliates. We agree that we will
            not sell, rent, or trade your email address to any unaffiliated
            third-party without your permission.
          </div>
          <div className="sub-heading">Our Security Policy</div>
          <div className="text">
            We have constructed our Website using industry standard encryption
            and authentication tools to protect your Personally Identifiable
            Information. When we collect your Personally Identifiable
            Information through our Website, we encrypt this information and
            attempt to prevent unauthorized access to it by using industry
            standard technologies, such as encryption software, routers and
            firewalls. Unfortunately, due to the nature of the Internet, we
            cannot completely guarantee that your Personally Identifiable
            Information is completely protected. We strongly urge you to protect
            any password you may have for our Website and to not share it with
            anyone. You should always log out of our Website when not in use,
            especially if you are sharing a computer or mobile device with
            someone else or are using a public computer.
          </div>
          <div className="sub-heading">Privacy Policy Updates</div>
          <div className="text">
            We reserves the right to modify this Privacy Policy at any time. You
            should review this Privacy Policy frequently. If we make material
            changes to this policy, we will notify you here, by email, or by
            means of a notice on our home page. We will also change the "Last
            Updated" date at the beginning of this Privacy Policy. Any changes
            we make to our Privacy Policy are effective as of this Last Updated
            date and replace any prior Privacy Policies.
          </div>
          <div className="sub-heading">Changing Your Information</div>
          <div className="text">
            You may change your email address or other Personally Identifiable
            Information at any time using the account management features found
            on our Website.
          </div>
          <div className="sub-heading">
            Questions About Our Privacy Practices or This Privacy Policy
          </div>
          <div className="text">
            If you have any questions about our Privacy Practices or this
            Policy, please contact us by email at privacy@headout.com
          </div>
          <div className="sub-heading">Your California Privacy Rights</div>
          <div className="text">
            Your California Privacy Rights identifies the practices of Headout
            as they relate to the use and sharing of personal information about
            California residents collected through this website. Under the law
            of the State of California, California residents who provide
            personal information via a website or other online service, such as
            this website, may request and obtain from us, once each calendar
            year, information about the personal information we have shared, if
            any, with other businesses for their own direct marketing uses.
            Where applicable, this information would include the categories of
            personal information, and the names and addresses of those
            businesses with which we have shared personal information for the
            prior calendar year. To obtain from us the information specified by
            California law, please contact:
            <br />
            <div className="text">You can contact us at - </div>
            <div className="text">By E-mail: support@headout.com</div>
            <div className="text">By Mail: Headout Inc.</div>
            <div className="text">311 W 43d St, Suite 12036</div>
            <div className="text">New York, NY 10036</div>
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
