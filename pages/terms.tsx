import React, { Component } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ContentContainer from '../components/UI/ContentContainer';
import Paragraph from '../components/UI/Paragraph';
import { DROPDOWN_ELEMENT, CUSTOM_TYPES } from '../constants';
import { Client } from '../config/prismic-config';
import { TopHeading, SubHeading } from '../components/UI/Headings';
import { MinimalHelmet } from '../components/common/meta';
import 'lazysizes';
import '../style/global.css';

export default class TermsPage extends Component<any, any> {
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

      const props = await TermsPage.getData({ req, isDev, query });
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
      uid = host.replace('stage.', '');
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
          title="Terms"
          favicon={favicon}
          description={`Terms and Conditions page for ${host}`}
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
          <TopHeading h1>Terms and Conditions</TopHeading>
          <br />
          <SubHeading>Terms of Use</SubHeading>
          <Paragraph>
            This web page represents a legal document that serves as the terms
            of use for our website (“Terms of Use”), {host} and any associated
            mobile application (collectively, “Website”) as owned and operated
            by Headout Inc (“Headout”). Capitalized terms, unless otherwise
            defined, have the meaning specified within the Definitions section
            below. This Terms of Use,, and other posted guidelines within our
            Website, (collectively “Legal Terms”), constitute the entire and
            only agreement between you and this website, and supersede all other
            agreements, representations, warranties and understandings with
            respect to our Website and the subject matter contained herein. We
            may amend our Legal Terms at any time without specific notice to
            you. The latest copies of our Legal Terms will be posted on our
            Website, and you should review all Legal Terms prior to using our
            Website. After any revisions to our Legal Terms are posted, you
            agree to be bound to any such changes to them. Therefore, it is
            important for you to periodically review our Legal Terms to make
            sure you still agree to them. <br />
            By using our Website, you agree to fully comply with and be bound by
            our Legal Terms. Please review them carefully. If you do not accept
            our Legal Terms, do not access and use our Website. If you do not
            accept our Legal Terms, you should not access our Website. If you
            have already accessed our Website and do not accept our Legal Terms,
            you should immediately discontinue use of our Website.
          </Paragraph>
          <SubHeading>Definitions</SubHeading>
          <Paragraph>
            The terms: “us” or “we” or “our” refers to the owner of the Website.
            <br />
            A “Member” is an individual that has registered with our Website to
            use our Website’s features.
            <br />
            A “Provider” is a Member of our Website that is a business offering
            tours, activities, attractions and other travel-related goods and
            services to the general public and has registered with Headout to
            offer their goods/services.
            <br />
            A “Profile” is an online collection of information provided by a
            Member about their business if a Provider, or generally about
            themselves if a Customer.
            <br />
            A “User” is a collective identifier that refers to either a Visitor
            or a Member.
            <br />
            A “Visitor” is someone who merely browses our Website.
            <br />
            A “Customer” is a user who purchases goods/services through the
            Website
            <br />
            All text, information, graphics, audio, video, and data offered
            through our Website, whether free to all or part of our paid
            features of our Website, are collectively known as our “Content”. We
            may refer to Content provided by our Members, whether as part of
            their Profile or in other postings to our Website, as “Member
            Content.” When we refer to our Website, our Content is included by
            reference.
          </Paragraph>
          <SubHeading>Limited License</SubHeading>
          <Paragraph>
            You are granted a non-exclusive, non-transferable, revocable license
            to access and use our Website strictly in accordance with our Legal
            Terms. Your use of our Website is solely for the purposes as
            provided herein.
          </Paragraph>
          <SubHeading>Our Relationship to You</SubHeading>
          <Paragraph>
            This website is strictly an intermediary service for purchasing
            goods/services and does NOT enter into any other relationship with
            you, other than that of an independent contractor. Our Legal Terms
            in no way create any agency, partnership, joint venture,
            employee-employer or franchisor-franchisee relationship between you
            and other Users, or our affiliates.
          </Paragraph>
          <SubHeading>Legal Compliance</SubHeading>
          <Paragraph>
            You agree to comply with all applicable domestic and international
            laws, statutes, ordinances, and regulations regarding your use of
            our Website. We reserve the right to investigate complaints or
            reported violations of our Legal Terms and to take any action we
            deem appropriate, including but not limited to canceling your Member
            account, reporting any suspected unlawful activity to law
            enforcement officials, regulators, or other third parties and
            disclosing any information necessary or appropriate to such persons
            or entities relating to your profile, email addresses, usage
            history, posted materials, IP addresses and traffic information, as
            allowed under our Privacy Policy.
          </Paragraph>
          <SubHeading>Eligibility and Registration for Membership</SubHeading>
          <Paragraph>
            You certify that you are at least age 18 years of age or older. If
            you are between the ages of 13 and 18, you certify that you have
            your parent’s permission to use our Website and become a Member. You
            may not access this website if you are under the age of 13. Any
            registration or use our our site by any Member in contravention of
            the above limitations is unauthorized, unlicensed and in violation
            of our Legal Terms. You agree to and to abide by all of the terms
            and conditions of our Legal Terms. This website has the sole right
            and discretion to determine whether to accept a Member, and may
            reject a Member’s registration, with or without explanation.
          </Paragraph>
          <SubHeading>Information From Children</SubHeading>
          <Paragraph>
            We do not knowingly solicit, collect or retain information from any
            individuals under the age of 13.
          </Paragraph>
          <SubHeading>Digital Millennium Copyright Act Compliance</SubHeading>
          <Paragraph as="div">
            If you believe that your work has been copied on our Website, or any
            of our other systems or networks in a way that constitutes, please
            provide the following information to Company for receipt of
            notification of claimed infringement (to ensure that your
            notification complies with the requirement of the Digital Millennium
            Copyright Act, please see 17 U.S.C. § 512(c)(3)):
            <ul>
              <li>
                An electronic or physical signature of the person authorized to
                act on behalf of the owner of the copyright interest.
              </li>
              <li>
                A description of the copyrighted work that you claim has been
                infringed.
              </li>
              <li>
                A description of where the material that you claim is infringing
                is located on the site.
              </li>
              <li>Your address, telephone number, and email address.</li>
              <li>
                A statement by you that you have a good faith belief that the
                disputed use is not authorized by the copyright owner, its
                agent, or the law.
              </li>
              <li>
                A statement by you, made under penalty of perjury, that the
                above information in your notification is accurate and that you
                are the copyright owner or authorized to act on the copyright
                owner’s behalf.
              </li>
            </ul>
          </Paragraph>
          <Paragraph>You can contact us at - </Paragraph>
          <Paragraph>By E-mail: support@headout.com</Paragraph>
          <Paragraph>By Mail: Headout Inc.</Paragraph>
          <Paragraph>311 W 43d St, Suite 12036</Paragraph>
          <Paragraph>New York, NY 10036</Paragraph>
          <Paragraph>
            We will only respond to those notices that substantially comply with
            the above requirements. We will investigate your claim and will
            notify you by the method of contact you used to file your notice
            with us.
          </Paragraph>
          <SubHeading>Intellectual Property</SubHeading>
          <Paragraph>
            Our Website may contain our trademarks as well as those of
            Providers, our affiliates, and other companies, in the form of
            words, graphics, and logos. Your use of our Website does not
            constitute any right or license for you to use such trademark,
            without the prior written permission of the corresponding trademark
            owner. Our Website is also protected under international copyrights.
            The copying, redistribution, use or publication by you of any
            portion of our Website is strictly prohibited. Your use of our
            Website does not grant you ownership rights of any kind in our
            Content or Website. As mentioned, we do not claim ownership of your
            Member Content, but by providing it to our Website, you do not
            receive any other rights in our Content other than what belongs to
            you already.
          </Paragraph>
          <SubHeading>Linking to Our Website</SubHeading>
          <Paragraph>
            You may provide links to our Website, provided (a) that you do not
            remove or obscure, by framing or otherwise, any portion of our
            Website, (b) your Website does not engage in illegal or immoral
            activities, and (c) you discontinue providing links to our Website
            immediately upon request by us.
          </Paragraph>
          <SubHeading>Links to Other Websites</SubHeading>
          <Paragraph>
            Our Website may contain links to third party websites (“Third Party
            Websites”). These links are provided solely as a convenience to you.
            By linking to these Third Party Websites, we do not create or have
            an affiliation with, or sponsor such Third Party Websites. The
            inclusion of links within our Website does not constitute any
            endorsement, guarantee, warranty, or recommendation of such Third
            Party Websites. We have no control over the legal documents and
            privacy practices of third party websites; as such, you access any
            such Third Party Websites at your own risk.
          </Paragraph>
          <SubHeading>Data Protection</SubHeading>
          <Paragraph>
            We collect and use personal data of users to the extent that is
            necessary for the creation, design of content or modification of the
            contractual conditions between the user and us. <br /> If we are
            involved in the communication for a service agreement between the
            user and the respective Provider, we shall transfer the data
            required for this agreement to the respective Provider. This
            Provider processes and uses the data to initiate, conclude and
            execute the contract on its own responsibility. <br /> Further
            information can be found in our data protection conditions at
            https://www.headout.com/privacy-policy.
          </Paragraph>
          <SubHeading>Warranty Disclaimer</SubHeading>
          <Paragraph>
            We reserves the right to change any and all Content and features of
            our Website, at any time without notice. Our Website may be
            temporarily unavailable from time to time for maintenance or other
            reasons. We assume no responsibility for any error, omission,
            interruption, deletion, defect, delay in operation or transmission,
            communications line failure, theft or destruction or unauthorized
            access to, or alteration of, Member Content. We are not responsible
            for any technical malfunction or other problems of any telephone
            network or service, computer systems, servers, computer or mobile
            phone equipment, Website, failure of email or players on account of
            technical problems or traffic congestion on the Internet or any
            combination thereof, including injury or damage to anyone’s
            computer, mobile phone, or other hardware or Website, related to or
            resulting from using, uploading, or downloading materials in
            connection with our Website. Under no circumstances will we be
            responsible for any loss or damage, including any loss or damage or
            personal injury or death, resulting from anyone’s use of our
            Website, or for any interactions between Users of our Website,
            whether online or offline.
          </Paragraph>
          <SubHeading>Limitation of Liability</SubHeading>
          <Paragraph>
            <strong>We</strong>, as well as all our affiliates, shall not be
            liable for any loss, injury, claim, liability, or damage of any kind
            resulting in any way from (a) any errors in or omissions from our
            Website; (b) the unavailability or interruption of our Website; (c)
            your use of our Website; or (d) any delay or failure in performance
            of our Website. WE AND OUR AFFILIATES ARE NOT LIABLE FOR THE ACTS,
            ERRORS, OMISSIONS, REPRESENTATIONS, WARRANTIES, BREACHES OR
            NEGLIGENCE OR FOR ANY PERSONAL INJURIES, DEATH, PROPERTY DAMAGE, OR
            OTHER DAMAGES OR EXPENSES RESULTING THEREFROM. WE AND OUR AFFILIATES
            HAVE NO LIABILITY AND WILL MAKE NO WARRANTY, REFUND, OR OTHER
            RESTITUTION TO YOU WITH REGARDS TO OUR WEBSITE, OTHER THAN AS
            SPECIFIED HEREIN, FOR ANY REASON, INCLUDING, BUT NOT LIMITED TO,
            DELAYS, CANCELLATIONS, STRIKES, GOVERNMENTAL ISSUES, OR FORCE
            MAJEURE.
          </Paragraph>
          <SubHeading>Arbitration</SubHeading>
          <Paragraph>
            Any legal controversy or legal claim arising out of or relating to
            our Legal Terms and/or our Website, excluding legal action taken by
            us to collect or recover damages for, or obtain any injunction
            relating to intellectual property infringement, shall be settled
            solely by binding arbitration in accordance with the Commercial
            Arbitration Rules of the American Arbitration Association. Any such
            controversy or claim shall be arbitrated on an individual basis, and
            shall not be consolidated in any arbitration with any claim or
            controversy of any other party. The arbitration shall be conducted
            before an arbitrator selected by the American Arbitration
            Association in New York, NY, USA. The judgment of such arbitrator on
            award may be entered into any court having jurisdiction thereof. We
            may seek any interim or preliminary relief from a court of competent
            jurisdiction within state and federal courts of the State of New
            York as, necessary to protect the rights or property of you and us
            pending the completion of arbitration. Each party shall bear
            one-half of the arbitration fees and costs, but the prevailing party
            may seek return of such arbitration fees and reasonable attorney
            fees.
          </Paragraph>
          <SubHeading>General Terms</SubHeading>
          <Paragraph>
            Our Legal Terms shall be treated as though it were executed and
            performed in New York, NY, USA, and shall be governed by and
            construed in accordance with the laws of the State of New York, USA,
            without regard to conflict of law principles. In addition, you agree
            to submit to the personal jurisdiction and venue of such courts. Any
            cause of action by you with respect to our Website, must be
            instituted within one (1) year after the cause of action arose or be
            forever waived and barred. Should any part of our Legal Terms be
            held invalid or unenforceable, that portion shall be construed
            consistent with applicable law and the remaining portions shall
            remain in full force and effect. To the extent that any Content in
            our Website conflicts or is inconsistent with our Legal Terms, our
            Legal Terms shall take precedence. Our failure to enforce any
            provision of our Legal Terms shall not be deemed a waiver of such
            provision nor of the right to enforce such provision.
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
            commonFooter?.data?.powered_by_headout || false
          }
          showDisclaimer={commonFooter?.data?.show_disclaimer}
          disclaimerText={commonFooter?.data?.disclaimer_text}
          slices={[]}
        />
      </>
    );
  }
}
