import React, { useEffect, useState } from 'react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { ThemeProvider } from 'styled-components';
import { getAppTheme } from 'style/theme';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import { MinimalHelmet } from 'components/common/NextSeoMeta';
import TermsContent from 'components/Legal/terms/TermsContent';
import { MBContextProvider } from 'contexts/MBContext';
import { getHeadoutLanguagecode } from 'utils';
import { traceError } from 'utils/logutils';
import getLegalPageData from 'utils/prismicUtils/legalPages';
import { getLogoRedirectionUrl } from 'utils/urlUtils';
import { strings } from 'const/strings';
import {
  DEFAULT_LANGUAGE_CODE,
  DEFAULT_PRISMIC_LANG,
  DESIGN,
  DROPDOWN_ELEMENT,
  THEMES,
} from 'constants/index';

const TERMS_LINK = '/terms';

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

const PriorTermsPage = (
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

  const { uid, CMSContent, lang, host, isDev, localizedStrings } = props || {};
  const {
    logoUrl,
    logoAltText,
    hasPoweredByHeadoutLogo,
    commonFooter,
    theme_override: footerTheme,
    theme: mbTheme,
  } = CMSContent || {};

  strings.setContent({
    default: localizedStrings ?? {},
  });

  const logoRedirectionUrl = getLogoRedirectionUrl({
    uid,
    lang: getHeadoutLanguagecode(lang),
    isDev,
    host,
  });

  const themeOverride = footerTheme === THEMES.INHERIT ? mbTheme : footerTheme;
  const content = strings.PRIOR_TERMS_OF_USE_CONTENT;

  return (
    <ThemeProvider theme={getAppTheme(mbTheme || THEMES.DEFAULT)}>
      <MBContextProvider
        host={host}
        uid={uid}
        lang={DEFAULT_PRISMIC_LANG}
        microsite={{}}
        design={DESIGN.V1}
        mbTheme={mbTheme}
      >
        <MinimalHelmet
          title="Prior Terms"
          description={`Prior Terms and Conditions page for ${host}`}
        />
        <Header
          headerLinks={null}
          logoUrl={logoUrl}
          logoAltText={logoAltText}
          currentLanguage={DEFAULT_LANGUAGE_CODE}
          selectedLanguage={DEFAULT_LANGUAGE_CODE}
          uid={uid}
          isMobile={isMobile}
          logoRedirectionURL={logoRedirectionUrl}
          dropdown={dropdown}
          handleDropdownToggle={handleDropdownToggle}
          hideLangCurrencySelector={true}
          hasPoweredByHeadoutLogo={hasPoweredByHeadoutLogo}
        />
        <TermsContent
          title={content.title}
          lastUpdatedDate={content.lastUpdated}
          introduction={content.introduction}
          sections={content.sections}
          linkText={content.linkText}
          linkHref={TERMS_LINK}
        />
        <Footer
          currentLanguage={DEFAULT_LANGUAGE_CODE}
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

export default PriorTermsPage;
