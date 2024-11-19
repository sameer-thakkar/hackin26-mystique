import React, { useEffect, useState } from 'react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { ThemeProvider } from 'styled-components';
import { getAppTheme } from 'style/theme';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import { MinimalHelmet } from 'components/common/NextSeoMeta';
import { CancellationPolicyContentContainer } from 'components/UI/ContentContainer';
import { TopHeading } from 'components/UI/Headings';
import Paragraph from 'components/UI/Paragraph';
import { MBContextProvider } from 'contexts/MBContext';
import { getHeadoutLanguagecode } from 'utils';
import { traceError } from 'utils/logutils';
import getLegalPageData from 'utils/prismicUtils/legalPages';
import { getLogoRedirectionUrl } from 'utils/urlUtils';
import { DESIGN, DROPDOWN_ELEMENT, THEMES } from 'constants/index';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const data = getLegalPageData(context);

    return data;
  } catch (error) {
    const { req } = context;
    traceError({ error, host: req?.headers?.host, url: req?.url });
    return {
      props: {},
    };
  }
};

const CancellationPolicyPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [dropdown, setDropdown] = useState({
    lang: false,
    hamburger: false,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window?.innerWidth < 768);
  }, []);

  const handleDropdownToggle = (elementIdentifier: any) => {
    switch (elementIdentifier) {
      case DROPDOWN_ELEMENT.HAMBURGER: {
        setDropdown((prevState) => {
          return {
            ...prevState,
            hamburger: !dropdown.hamburger,
            lang: false,
          };
        });

        break;
      }
      case DROPDOWN_ELEMENT.LANGUAGE_SELECTOR: {
        setDropdown((prevState) => {
          return {
            ...prevState,
            hamburger: false,
            lang: !dropdown.lang,
          };
        });
        break;
      }
      default:
        return;
    }
  };

  const { CMSContent, host, uid, isDev, lang } = props ?? {};
  const {
    logoUrl,
    logoAltText,
    hasPoweredByHeadoutLogo,
    faviconUrl,
    commonFooter,
    theme_override: footerTheme,
    theme: mbTheme,
  } = CMSContent ?? {};
  const logoRedirectionUrl = getLogoRedirectionUrl({
    uid,
    lang: getHeadoutLanguagecode(lang),
    isDev,
    host,
  });

  const themeOverride = footerTheme === THEMES.INHERIT ? mbTheme : footerTheme;

  return (
    <ThemeProvider theme={getAppTheme(mbTheme || THEMES.DEFAULT)}>
      <MBContextProvider
        host={host}
        uid={uid}
        lang={'en-us'}
        microsite={{}}
        design={DESIGN.V1}
        mbTheme={mbTheme}
      >
        <MinimalHelmet
          title="Cancellation Policy"
          faviconUrl={faviconUrl}
          description={`Cancellation Policy page for ${host}`}
        />
        <Header
          headerLinks={null}
          logoUrl={logoUrl}
          logoAltText={logoAltText}
          currentLanguage={'en'}
          selectedLanguage={'en'}
          uid={uid}
          isMobile={isMobile}
          logoRedirectionURL={logoRedirectionUrl}
          dropdown={dropdown}
          handleDropdownToggle={handleDropdownToggle}
          hideLangCurrencySelector={true}
          hasPoweredByHeadoutLogo={hasPoweredByHeadoutLogo}
        />
        <CancellationPolicyContentContainer>
          <TopHeading h1>
            Headout&apos;s Cancellations and Booking Modifications
          </TopHeading>
          <p>
            <b>Last Updated:</b> 19th November 2024
          </p>
          <ol>
            <li>
              All capitalised terms used here draw the reference from the Terms
              of Use applicable to all Users of Headout. For detailed terms
              around the usage of the Headout platform please refer to our{' '}
              <a href="/terms">Terms of Use</a>.
            </li>
            <li>
              Each Experience visible on the Platform may have a different
              cancellation/refund policy. As a practice, Headout displays such
              terms on the Experience landing page itself.
            </li>

            <li>
              Once a Booking is completed, it cannot be changed or cancelled
              with a refund, unless otherwise stated in the Listing or the
              Supplier Terms applicable to such Listing.
            </li>
            <li>
              All matters concerning cancellation and modifications of Bookings
              are decided and/or determined by the Supplier. Given that the
              purchase of the Experience is a contract between the User and the
              Supplier, Headout does not frame the terms of
              cancellation/modification of the Bookings or take any decision
              regarding cancellation/modification of the Bookings, unless agreed
              to the contrary between Headout and the concerned Supplier.
            </li>
            <li>
              Subject to the terms of cancellation/modification set out in the
              Listing or Supplier Terms, User may:
              <Paragraph>
                <ol>
                  <li>opt to either cancel or modify a Booking; or</li>
                  <li>
                    reach out to Headout at the contact details specified in the
                    Booking Confirmation to inquire about the options available
                    for cancellation/modification of a Booking. Headout may, on
                    receiving such a request, if required, contact the concerned
                    Supplier and obtain information or seek confirmation before
                    cancellation/modification of a Booking.
                  </li>
                </ol>
              </Paragraph>
            </li>
            <li>
              If a Booking has been cancelled/modified by User as per the terms
              mentioned herein and as per the cancellation terms of the
              Supplier, Headout will, subject to receipt of the Refund Amount
              from the Supplier, refund the applicable amount to You. Headout
              clarifies that under no circumstances will Headout pay User the
              Refund Amount until Headout receives it from the Supplier. Once
              Headout receives the Refund Amount from the Supplier, Headout will
              endeavour to initiate the refund within seven (7) days of receipt
              from the Supplier. As a default practice, Headout processes the
              Refund Amount to the original source of payment. However, In case
              the original source of payment is unavailable, the User can choose
              to receive the refund in the form of Headout Credits to the
              Headout Account of the User. These Headout Credits are neither
              transferable nor can be refunded or redeemed in the form of cash.
              As referred previously, currently, Headout Credits cannot be used
              partially for a booking. Headout reserves the right to make
              changes to the usage terms of Headout Credits, including but not
              limited to, value, usage, and validity without prior notice or
              intimation.
            </li>
            <li>
              If the User makes a Booking using a promotion code, or if the User
              accepts a discount or special-offer price during the check-out
              process, it may invalidate the discount or special-offer price by
              cancelling/modifying the Booking. Headout will process any refund
              to User after adjusting such discount or special offer availed by
              the User at the time of Booking.
            </li>
            <li>
              No refunds are available once an Experience has commenced, or in
              respect of any Experience&apos;s package, accommodation, meals or
              any other Services that You have started to utilize.
            </li>
            <li>
              A Supplier may make a change to a Booking after Your purchase,
              changes including but not limited to the date, price, inclusions,
              coverage, age requirements, and/or any other features and/or
              requirements of the Experience. Headout will endeavour to
              communicate to the User any such changes at the earliest possible
              opportunity, as soon as Headout becomes aware of the same. User
              rights, concerning such changes, vis-à-vis the Supplier, shall be
              governed by the Supplier Terms. Headout shall not be liable to the
              User or any other person for any losses, expenses, costs, damages
              or injuries arising on account of or about such changes made to
              the booking.
            </li>
            <li>
              Pursuant to such change(s), if the Supplier cancels the Booking or
              allows the User to cancel the Booking, then Headout will endeavour
              to process the Refund Amount received from the Supplier within
              seven (7) days of receipt of the same from the Supplier. If the
              Supplier permits the User to modify the Booking pursuant to the
              changes, any information that We receive on this matter will be
              communicated to the User as soon as We become aware. Headout will
              not be liable to the User or any other person for any losses,
              expenses, costs or damages arising on account of or concerning
              <Paragraph>
                <ol>
                  <li>The user’s inability to modify the Booking,</li>
                  <li>
                    The Supplier’s failure to communicate regarding the
                    modification of the Booking with either us or the User, or{' '}
                  </li>
                  <li>
                    The Services availed pursuant to modification of the
                    Booking.
                  </li>
                </ol>
              </Paragraph>
            </li>
            <li>
              We may decide, in our sole discretion, that it is necessary or
              desirable for the protection of our interests, the Supplier&apos;s
              interests and/or the User&apos;s interests, to withdraw our
              services resulting in an override of the Supplier’s cancellation
              policy. We may also determine, in our sole discretion, to arrange
              for the User a refund of a part or all of the amounts charged to
              the User. Users agree that We will have no liability for such
              cancellations or refunds.
            </li>
            <li>
              In any scenario of cancellation of any Booking, the User agrees
              and understands that Headout shall be only liable to process the
              refund of the Booking amount upon receiving the same from the
              Supplier. The User also agrees that all liabilities against any
              Booking are attributable to the Supplier. Headout will not
              undertake any other liability of any sort including but not
              limited to any incidental losses incurred by the User.
            </li>
          </ol>
        </CancellationPolicyContentContainer>
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
          themeOverride={themeOverride || THEMES.DEFAULT}
        />
      </MBContextProvider>
    </ThemeProvider>
  );
};

export default CancellationPolicyPage;
