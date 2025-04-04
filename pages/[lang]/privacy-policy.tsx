import { useEffect, useState } from 'react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { ThemeProvider } from 'styled-components';
import { getAppTheme } from 'style/theme';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import { MinimalHelmet } from 'components/common/NextSeoMeta';
import {
  contentContainer,
  lastUpdated,
  pageHeading,
  policyList,
  policySectionStyles,
  sectionHeading,
} from 'components/Legal/privacy-policy/styles';
import { renderContentBlock } from 'components/Legal/privacy-policy/utils';
import { MBContextProvider } from 'contexts/MBContext';
import { getHeadoutLanguagecode } from 'utils';
import { traceError } from 'utils/logutils';
import getLegalPageData from 'utils/prismicUtils/legalPages';
import { getLogoRedirectionUrl } from 'utils/urlUtils';
import { strings } from 'const/strings';
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

const PrivacyPage = (
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

  const { CMSContent, host, uid, isDev, lang, localizedStrings } = props ?? {};
  const {
    logoUrl,
    logoAltText,
    hasPoweredByHeadoutLogo,
    faviconUrl,
    commonFooter,
    theme_override: footerTheme,
    theme: mbTheme,
  } = CMSContent ?? {};

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
          title="Privacy Policy"
          faviconUrl={faviconUrl}
          description={`Privacy Policy page for ${host}`}
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
        <main className={contentContainer}>
          <h1 className={pageHeading} data-qa-marker="pp-heading">
            {strings.PRIVACY_POLICY_CONTENT.title}
          </h1>
          <p className={lastUpdated}>
            <b>Last Updated:</b> {strings.PRIVACY_POLICY_CONTENT.lastUpdated}
          </p>
          <ol className={policyList} data-qa-marker="pp-content">
            {strings.PRIVACY_POLICY_CONTENT.sections.map(
              (section, sectionIndex) => (
                <li key={sectionIndex} className={policySectionStyles}>
                  <h2 className={sectionHeading}>{section.title}</h2>
                  {section.content.map((contentBlock, contentIndex) =>
                    renderContentBlock(contentBlock, contentIndex)
                  )}
                </li>
              )
            )}
          </ol>
        </main>
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

export default PrivacyPage;
