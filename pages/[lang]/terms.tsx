import React, { useEffect, useState } from 'react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { ThemeProvider } from 'styled-components';
import { getAppTheme } from 'style/theme';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import { MinimalHelmet } from 'components/common/NextSeoMeta';
import {
  contentContainer,
  heading,
  lastUpdated,
  termsList,
  termsSectionTitle,
} from 'components/Legal/terms/styles';
import { TSection } from 'components/Legal/terms/types';
import { MBContextProvider } from 'contexts/MBContext';
import { getHeadoutLanguagecode } from 'utils';
import { traceError } from 'utils/logutils';
import getLegalPageData from 'utils/prismicUtils/legalPages';
import { getLogoRedirectionUrl } from 'utils/urlUtils';
import { strings } from 'const/strings';
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

  const { uid, CMSContent, lang, host, isDev, localizedStrings } = props || {};
  const {
    logoUrl,
    logoAltText,
    hasPoweredByHeadoutLogo,
    faviconUrl,
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
        <main className={contentContainer} data-qa-marker="terms-container">
          <h1 className={heading} data-qa-marker="terms-heading">
            {strings.TERMS_OF_USE_CONTENT.title}
          </h1>
          <p className={lastUpdated}>
            <b>Last Updated:</b> {strings.TERMS_OF_USE_CONTENT.lastUpdated}
          </p>

          <p>{strings.TERMS_OF_USE_CONTENT.introduction}</p>

          <ol className={termsList} data-qa-marker="terms-content">
            {strings.TERMS_OF_USE_CONTENT.sections.map(
              (section: TSection, sectionIndex: number) => (
                <li key={section.title}>
                  <div className={termsSectionTitle}>{section.title}</div>

                  <ol>
                    {section.items.map((item, itemIndex) => (
                      <li key={`${sectionIndex}-${itemIndex}`}>
                        {typeof item === 'string' ? (
                          item
                        ) : (
                          <>
                            {item.text}
                            <ol>
                              {item.subItems.map(
                                (subItem: string, subIndex: number) => (
                                  <li
                                    key={`${sectionIndex}-${itemIndex}-${subIndex}`}
                                  >
                                    {subItem}
                                  </li>
                                )
                              )}
                            </ol>
                          </>
                        )}
                      </li>
                    ))}
                  </ol>
                </li>
              )
            )}
          </ol>
          {Array.from({ length: 5 }).map((_, index) => {
            return <br key={index} />;
          })}
        </main>
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
