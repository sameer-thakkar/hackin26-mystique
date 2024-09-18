import React, { useEffect, useState } from 'react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { ThemeProvider } from 'styled-components';
import { getAppTheme } from 'style/theme';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import { MinimalHelmet } from 'components/common/NextSeoMeta';
import TermsAndConditions from 'components/Legal/TermsAndCondition';
import { MBContextProvider } from 'contexts/MBContext';
import { getHeadoutLanguagecode } from 'utils';
import { traceError } from 'utils/logutils';
import getLegalPageData from 'utils/prismicUtils/legalPages';
import { getLogoRedirectionUrl } from 'utils/urlUtils';
import { DESIGN, DROPDOWN_ELEMENT, THEMES } from 'constants/index';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const data = await getLegalPageData(context);
    return data;
  } catch (error) {
    const { req } = context;
    traceError({ error, host: req?.headers?.host, url: req?.url });
    return {
      props: {},
    };
  }
};

const TermsPage = (
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

  const { uid, CMSContent, lang, host, isDev } = props || {};
  const {
    logoUrl,
    logoAltText,
    hasPoweredByHeadoutLogo,
    faviconUrl,
    commonFooter,
    theme_override: footerTheme,
    theme: mbTheme,
  } = CMSContent || {};
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
          title="Terms"
          faviconUrl={faviconUrl}
          description={`Terms and Conditions page for ${host}`}
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
        <TermsAndConditions />

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

export default TermsPage;
