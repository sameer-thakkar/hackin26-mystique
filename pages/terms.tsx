import React from "react";
import JSONTree from "react-json-tree";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Client,
  apiEndpoint,
  hrefResolver,
  linkResolver
} from "../prismic-config";

const getPropsFromReq = ({ host, pathname }) => {
  const pathnameWithoutTrailingSlash = pathname =>
    pathname.lastIndexOf("/") === pathname.length - 1
      ? pathname.substr(0, pathname.length - 1)
      : pathname;

  const languages = ["en", "es", "it", "fr", "pt", "de", "nl"];
  const langMap = {
    en: "en-us",
    es: "es-es",
    it: "it-it",
    fr: "fr-fr",
    pt: "pt-pt",
    nl: "nl-nl",
    de: "de-de"
  };

  const pathnameSlugs = pathnameWithoutTrailingSlash(pathname)
    .split("/")
    .filter(item => item);

  let requestedLang = pathnameSlugs[0];

  const isLangValid = languages.includes(requestedLang);
  if (isLangValid) {
    pathnameSlugs.shift();
  } else {
    requestedLang = "en";
  }

  const uid = `${pathnameWithoutTrailingSlash(
    `${host}/${pathnameSlugs.join("/")}`
  )}`
    .replace("microbrand.", "www.")
    .replace(/\//g, ".");

  return {
    uid,
    lang: langMap[requestedLang]
  };
};

export default class terms extends React.Component<any, any> {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      tourPrices: [],
      currencySymbol: "",
      languageDropdown: false,
      popupOpen: false,
      showGroupBookingModal: false
    };
  }
  static async getInitialProps({ req, query }) {
    try {
      const props = await terms.getMicrositeData({
        req,
        query
      });
      if (process.browser) (window as any).prismic.setupEditButton();
      return props;
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  static async getMicrositeData({ req, query }) {
    /**
     * www.tickets-amsterdam.com/madame-tussauds
     * www.tickets-amsterdam.com/es/madame-tussauds
     */

    /**
     * if working locally
     *  - read from query param
     *  ?mystique_uid=www.tickets-amsterdam.com.madame-tussauds&lang=es
     *  Output object: {mystique_uid: '',  lang: ''}
     * if working on prod
     *  - deconstruct host and pathname
     *  to create similar output object
     */

    const { host } = req ? req.headers : window.location;
    const isDev = host.includes("localhost:");

    try {
      let uid, lang, pathname;
      if (req) {
        // server render
        pathname = req.url;
        if (isDev) {
          const { mystique_uid: queryParamUID, lang: queryParamLang } = query;
          uid = queryParamUID;
          lang = queryParamLang;
        } else {
          const { uid: reqUID, lang: reqLang } = getPropsFromReq({
            host: req.headers.host,
            pathname
          });
          uid = reqUID;
          lang = reqLang;
        }
      } else {
        if (isDev) {
          const qsObject: any = window.location.search
            .replace("?", "")
            .split("&")
            .reduce((accum, item) => {
              const qs = item.split("=");
              return {
                ...accum,
                [qs[0]]: qs[1]
              };
            }, {});
          uid = qsObject.mystique_uid;
          lang = qsObject.lang;
          pathname = window.location.pathname;
        } else {
          const { host } = window.location;
          pathname = window.location.pathname;
          const { uid: reqUID, lang: reqLang } = getPropsFromReq({
            host,
            pathname
          });
          uid = reqUID;
          lang = reqLang;
        }
      }

      let uidType = "";
      switch (pathname) {
        case "/plan-your-visit":
          uidType = "plan_your_visit";
          break;
        default:
          uidType = "microsite";
      }

      const response = await Client(req).getByUID(uidType, uid, { lang });

      return {
        response,
        uidType,
        uid,
        lang
      };
    } catch (error) {
      console.log(error);
      return error;
    }
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
    const { response } = this.props;
    const isMobile = () => {
      return document.documentElement.clientWidth < 768;
    };
    const { url: logoUrl } = response.data.link_to_logo_file;
    const { url: uploadedLogoUrl, alt: altText } = response.data.logo;
    const { logo_alt_text: logoAltText } = response.data;
    const { alternate_languages: availableLanguages } = response;
    const {
      localization: languages,
      header_links: headerLinks
    } = response.data;
    const { lang: currentLanguage, uid: currentDomain } = response;
    const {
      url: uploadedFooterLogoUrl,
      alt: footerAltTextUploaded
    } = response.data.footer_logo;
    const { url: footerLogoUrl } = response.data.footer_logo_link;
    const { footer_links: footerLinks } = response.data;
    const { text: disclaimer } = response.data.disclaimer[0] || {
      text: ""
    };
    const { footer_logo_alt_text: footerAltText } = response.data;

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
          currentDomain={currentDomain}
          languageDropdown={this.state.languageDropdown}
          toggleDropdown={this.toggleDropdown}
          openGroupBookingModal={this.openGroupBookingModal}
          isMobile={isMobile}
          parentComponent={"TERMS"}
        />
        <div className="terms-container">
          <div
            className="select-wrapper"
            id="select-tickets"
            style={{ margin: "0px" }}
          >
            <h1 className="select-text">Terms And Conditions</h1>
            <div className="divider"></div>
          </div>
          <div className="sub-heading">Terms of Use</div>
          <div className="text">
            This web page represents a legal document that serves as the terms
            of use for our website (“Terms of Use”), {currentDomain} and any
            associated mobile application (collectively, “Website”). Capitalized
            terms, unless otherwise defined, have the meaning specified within
            the Definitions section below. This Terms of Use,, and other posted
            guidelines within our Website, (collectively “Legal Terms”),
            constitute the entire and only agreement between you and this
            website, and supersede all other agreements, representations,
            warranties and understandings with respect to our Website and the
            subject matter contained herein. We may amend our Legal Terms at any
            time without specific notice to you. The latest copies of our Legal
            Terms will be posted on our Website, and you should review all Legal
            Terms prior to using our Website. After any revisions to our Legal
            Terms are posted, you agree to be bound to any such changes to them.
            Therefore, it is important for you to periodically review our Legal
            Terms to make sure you still agree to them. <br />
            By using our Website, you agree to fully comply with and be bound by
            our Legal Terms. Please review them carefully. If you do not accept
            our Legal Terms, do not access and use our Website. If you do not
            accept our Legal Terms, you should not access our Website. If you
            have already accessed our Website and do not accept our Legal Terms,
            you should immediately discontinue use of our Website.
          </div>
          <div className="sub-heading">Definitions</div>
          <div className="text">
            The terms: “us” or “we” or “our” refers to the owner of the Website.
            <br />
            A “Member” is an individual that has registered with our Website to
            use our Website’s features.
            <br />
            The terms: “us” or “we” or “our” refers to the owner of the Website.
            <br />
            A “Provider” is a Member of our Website that is a business offering
            tours, activities, and other travel-related goods and services to
            the general public and has registered with our Website to offer
            their goods/services. We refer to a Member who purchases
            goods/services from Providers as a “Customer”.
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
            All text, information, graphics, audio, video, and data offered
            through our Website, whether free to all or part of our paid
            features of our Website, are collectively known as our “Content”. We
            may refer to Content provided by our Members, whether as part of
            their Profile or in other postings to our Website, as “Member
            Content.” When we refer to our Website, our Content is included by
            reference.
          </div>
          <div className="sub-heading">Limited License</div>
          <div className="text">
            <span className="limited-license">
              You are granted a non-exclusive, non-transferable, revocable
              license to access and use our Website strictly in accordance with
              our Legal Terms. Your use of our Website is solely for the
              purposes as provided herein.
            </span>
          </div>
          <div className="sub-heading">Our Relationship to You</div>
          <div className="text">
            This website is strictly a venue does NOT enter into any other
            relationship with you, other than that of an independent contractor.
            Our Legal Terms in no way create any agency, partnership, joint
            venture, employee-employer or franchisor-franchisee relationship
            between you and other Users, or our affiliates.
          </div>
          <div className="sub-heading">Legal Compliance</div>
          <div className="text">
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
          </div>
          <div className="sub-heading">
            Eligibility and Registration for Membership
          </div>
          <div className="text">
            <span className="eligibility">
              You certify that you are at least age 18 years of age or older. If
              you are between the ages of 13 and 18, you certify that you have
              your parent’s permission to use our Website and become a Member.
              You may not access this website if you are under the age of 13.
              Any registration or use our our site by any Member in
              contravention of the above limitations is unauthorized, unlicensed
              and in violation of our Legal Terms. You agree to and to abide by
              all of the terms and conditions of our Legal Terms. This website
              has the sole right and discretion to determine whether to accept a
              Member, and may reject a Member’s registration, with or without
              explanation.
            </span>
          </div>
          <div className="sub-heading">Information From Children</div>
          <div className="text">
            We do not knowingly solicit, collect or retain information from any
            individuals under the age of 13.
          </div>
          <div className="sub-heading">
            Digital Millennium Copyright Act Compliance
          </div>
          <div className="text">
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
          </div>
          <br />
          <div className="text">You can contact us at - </div>
          <div className="text">
            By E-mail: support@
            {currentDomain.split(".")[1] + "." + currentDomain.split(".")[2]}
          </div>
          <div className="sub-heading">Intellectual Property</div>
          <div className="text">
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
          </div>
          <div className="sub-heading">Linking to Our Website</div>
          <div className="text">
            You may provide links to our Website, provided (a) that you do not
            remove or obscure, by framing or otherwise, any portion of our
            Website, (b) your Website does not engage in illegal or immoral
            activities, and (c) you discontinue providing links to our Website
            immediately upon request by us.
          </div>
          <div className="sub-heading">Links to Other Websites</div>
          <div className="text">
            Our Website may contain links to third party websites (“Third Party
            Websites”). These links are provided solely as a convenience to you.
            By linking to these Third Party Websites, we do not create or have
            an affiliation with, or sponsor such Third Party Websites. The
            inclusion of links within our Website does not constitute any
            endorsement, guarantee, warranty, or recommendation of such Third
            Party Websites. We have no control over the legal documents and
            privacy practices of third party websites; as such, you access any
            such Third Party Websites at your own risk.
          </div>
          <div className="sub-heading">Warranty Disclaimer</div>
          <div className="text">
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
          </div>
          <div className="sub-heading">Limitation of Liability</div>
          <div className="text">
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
          </div>
          <div className="sub-heading">Arbitration</div>
          <div className="text">
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
            fees. ISSUES, OR FORCE MAJEURE.
          </div>
          <div className="sub-heading">General Terms</div>
          <div className="text">
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
          </div>
        </div>
        <Footer
          logoUrl={uploadedFooterLogoUrl || footerLogoUrl || null}
          footerLinks={footerLinks ? footerLinks : null}
          disclaimer={disclaimer ? disclaimer : null}
          footerAltText={footerAltText || footerAltTextUploaded || null}
          isMobile={isMobile}
        />
      </React.Fragment>
    );
  }
}
