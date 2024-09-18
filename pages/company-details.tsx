import React, { useEffect, useState } from 'react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import { MinimalHelmet } from 'components/common/NextSeoMeta';
import { ContentContainer } from 'components/UI/ContentContainer';
import { TopHeading } from 'components/UI/Headings';
import Paragraph from 'components/UI/Paragraph';
import { getHeadoutLanguagecode } from 'utils';
import { traceError } from 'utils/logutils';
import getLegalPageData from 'utils/prismicUtils/legalPages';
import { getLogoRedirectionUrl } from 'utils/urlUtils';
import { DROPDOWN_ELEMENT } from 'const/index';

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

const CompanyDetailsPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { uid, CMSContent, lang, host, isDev } = props;
  const {
    logoUrl,
    logoAltText,
    hasPoweredByHeadoutLogo,
    faviconUrl,
    commonFooter,
  } = CMSContent ?? {};
  const logoRedirectionUrl = getLogoRedirectionUrl({
    uid,
    lang: getHeadoutLanguagecode(lang),
    isDev,
    host,
  });

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
        isMobile={isMobile}
        logoRedirectionURL={logoRedirectionUrl}
        dropdown={dropdown}
        handleDropdownToggle={handleDropdownToggle}
        hideLangCurrencySelector={true}
        hasPoweredByHeadoutLogo={hasPoweredByHeadoutLogo}
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
};

export default CompanyDetailsPage;
