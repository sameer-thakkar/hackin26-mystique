import React, { useContext, useEffect, useRef, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useWindowWidth } from '@react-hook/window-size';
import { getAppTheme } from 'style/theme';
import Conditional from 'components/common/Conditional';
import ContactUS, {
  MobileCallUsPanelDrawer,
} from 'components/common/ContactUs';
import sliceHandler from 'components/Slices';
import SocialLinks from 'components/UI/SocialLinks';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import useOnScreen from 'hooks/useOnScreen';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { SIDEBAR_TYPES, THEMES } from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import { POWERED_BY_HEADOUT, WHITE_BLIP } from 'assets/SvgIcons';

const StyledFooter = styled.footer`
  width: 100%;
  display: grid;
  margin-top: 40px;
  border-top: 1px solid ${COLORS.GRAY.G8};
`;

const FooterLinksWrapper = styled.div`
  padding-bottom: 32px;
  &.primary-footer {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .quick-links-title {
    ${expandFontToken(FONTS.HEADING_SMALL)}
    color: ${COLORS.GRAY.G2};
    margin-bottom: 1.5rem;
  }
  &.primary-footer + .secondary-footer .quick-links-title {
    display: none;
  }
  &.primary-footer + .secondary-footer .quick-links-title.has-custom-title {
    display: block;
  }
  &.secondary-footer {
    margin-top: 3.25rem;
    padding-bottom: 0;
    @media (max-width: 768px) {
      margin-top: 1.5rem;
    }
  }
  .quick-links {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
    display: flex;
    flex-wrap: wrap;
    .footer_column {
      display: contents;
    }
  }
`;

const FooterLegalWrapper = styled.div`
  color: ${({ theme }) => theme.footer.color};
  background: ${({ theme }) => theme.footer.background};
  margin: 0 auto;
  width: 100%;
  .footer-chin {
    display: grid;
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    margin-bottom: ${({
      // @ts-expect-error TS(2339): Property 'isEntertainmentMb' does not exist on typ... Remove this comment to see the full error message
      isEntertainmentMb,
    }) => (isEntertainmentMb ? '72px' : '56px')};
    grid-template-columns: auto auto;
    justify-content: space-between;
    grid-template-areas: 'white-line white-line' 'super-brand-logo social-links';
    grid-row-gap: ${({
      // @ts-expect-error TS(2339): Property 'isEntertainmentMb' does not exist on typ... Remove this comment to see the full error message
      isEntertainmentMb,
    }) => (isEntertainmentMb ? '18px' : '24px')};
    .white-line {
      grid-area: white-line;
      width: 100%;
      height: 0;
      border: 0.5px solid
        ${({
          // @ts-expect-error TS(2339): Property 'isEntertainmentMb' does not exist on typ... Remove this comment to see the full error message
          isEntertainmentMb,
        }) => (isEntertainmentMb ? COLORS.GRAY.G4 : COLORS.BRAND.WHITE)};
    }
    .super-brand-logo {
      grid-area: super-brand-logo;
      display: grid;
      grid-template-columns: auto auto;
      grid-column-gap: 12px;
      align-items: center;
      justify-items: left;
      span {
        color: ${({
          theme,
          // @ts-expect-error TS(2339): Property 'isEntertainmentMb' does not exist on typ... Remove this comment to see the full error message
          isEntertainmentMb,
        }) => (isEntertainmentMb ? COLORS.GRAY.G4A : theme.footer.color)};
      }
      svg {
        height: 16px;
      }
    }
    .social-links {
      grid-area: social-links;
    }

    @media (max-width: 768px) {
      .super-brand-logo {
        grid-template-columns: max-content max-content;
        svg {
          height: 12px;
        }
      }
      grid-template-columns: ${({
        // @ts-expect-error TS(2339): Property 'isEntertainmentMb' does not exist on typ... Remove this comment to see the full error message
        isEntertainmentMb,
      }) => (isEntertainmentMb ? `1fr 1fr` : `1fr`)};
      grid-template-areas: ${({
        // @ts-expect-error TS(2339): Property 'isEntertainmentMb' does not exist on typ... Remove this comment to see the full error message
        isEntertainmentMb,
      }) =>
        isEntertainmentMb
          ? `
          'white-line white-line'
          'super-brand-logo social-links'`
          : `
          'social-links'
          'white-line'
          'super-brand-logo'`};
      grid-row-gap: 24px;
      .social-links {
        ${({
          // @ts-expect-error TS(2339): Property 'isEntertainmentMb' does not exist on typ... Remove this comment to see the full error message
          isEntertainmentMb,
        }) => isEntertainmentMb && `justify-content: end;`}
      }
    }
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: calc(100vw - 5.6vw * 2);

  @media (max-width: 768px) {
    width: auto;
    padding: 0 16px;
  }
`;

const LinksWrapper = styled.div<{ isEntertainmentMb: boolean }>`
  display: grid;
  grid-template-rows: repeat(2, max-content);
  row-gap: 16px;
  .header {
    ${expandFontToken(FONTS.HEADING_SMALL)}
    color: ${({ theme, isEntertainmentMb }) =>
      isEntertainmentMb ? COLORS.GRAY.G7 : theme.footer.headingColor};
  }
  .links {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: max-content;
    row-gap: ${({ isEntertainmentMb }) => (isEntertainmentMb ? '8px' : '16px')};
    a, .toggle_panel_button {
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
      display: block;
      text-decoration: none;
      color: ${({ theme, isEntertainmentMb }) =>
        isEntertainmentMb ? COLORS.GRAY.G6 : theme.footer.color};     
    }
    .toggle_panel_button {
      background: ${({ theme }) => theme.footer.background};
      border:none; 
      text-align:start;
      padding:0;
      cursor:pointer;
    }
  }

  @media (max-width: 768px) {
    ${({ isEntertainmentMb }) => isEntertainmentMb && `row-gap: 20px;`}
    .header {
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb && `font-size:15px;line-height:20px;`};
    }
    .links {
      ${({ isEntertainmentMb }) => isEntertainmentMb && `row-gap: 16px;`}
      a, .toggle_panel_button {
        ${({ isEntertainmentMb }) =>
          isEntertainmentMb &&
          `
        font-size: 14px;
        line-height: 16px;`}
      }
    }
  }
`;

const LinkSlicesWrapper = styled.div<{
  isEntertainmentMb: boolean;
  slicesLength: number;
}>`
  display: grid;
  padding: ${({ slicesLength }) => (slicesLength ? '4rem 0' : 'none')};
  background-color: ${COLORS.GRAY.G8};
  margin-bottom: 0;

  @media (max-width: 768px) {
    ${({ isEntertainmentMb }) => isEntertainmentMb && `margin-bottom: 48px;`}
    padding: ${({ slicesLength }) => (slicesLength ? '2.25rem 0' : 'none')};
    margin-bottom: 0;
  }
`;

const FooterLegal = styled.div<{
  isEntertainmentMb: boolean;
  invertLogoColor: boolean;
}>`
  display: grid;
  align-items: start;
  ${({ theme }) => {
    return theme.theme !== THEMES.MIN_BLUE
      ? `
        grid-template-areas: 'logo-disclaimer footer-links';
        grid-template-columns: minmax(400px, max-content) max-content;
        grid-column-gap: 120px;
      `
      : `
        grid-template-areas: 'logo-disclaimer . footer-links';
        grid-template-columns: minmax(400px, max-content) 1fr 1fr;
      `;
  }}
  margin: ${({ isEntertainmentMb }) =>
    isEntertainmentMb ? '72px 0 56px 0' : '40px 0 64px 0'};
  padding-bottom: ${({ isEntertainmentMb }) =>
    isEntertainmentMb ? '0' : '40px'};
  line-height: 20px;
  .logo-disclaimer {
    grid-area: logo-disclaimer;
    .logo-wrapper {
      display: flex;
      .image-wrap {
        width: auto;
        margin-right: 12px;
        
        span {
          position: relative !important;
        }
      }
      img {
        position: relative !important;
        height: 40px !important;
        max-width: 100%;
        width: unset !important;
        ${({ invertLogoColor }) =>
          invertLogoColor ? `filter: brightness(0) invert(1);` : ''}
      }
      svg {
        height: 40px;
        width: 100.5px;
        path {
          fill: ${({ isEntertainmentMb }) =>
            isEntertainmentMb ? COLORS.GRAY.G5 : COLORS.BRAND.WHITE};
        }
      }
    }
  }
  .footer-links {
    grid-area: footer-links;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    column-gap: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '48px' : '120px'};
  }
  .disclaimer-text {
    color: ${({ isEntertainmentMb, theme }) =>
      isEntertainmentMb ? COLORS.GRAY.G6 : theme.footer.color};
    margin-top: 32px;
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
    max-width: 500px;
  }
  @media (min-width: 800px) and (max-width: 1200px) {
    grid-column-gap: 64px;
  }
  @media (max-width: 768px) {
    grid-template-areas: 'logo-disclaimer logo-disclaimer' 'footer-links footer-links';
    grid-template-columns: 1fr 1fr;
    grid-row-gap: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '48px' : '64px'};
    grid-column-gap: unset;
    margin: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '52px 0 48px 0' : '40px 0 64px 0'};
    padding-bottom: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '0' : '24px'};

    .logo-wrapper {
      width: 100%;
      
      .image-wrap {
        width: 100%;
        height: 44px;
      }
    }

    .footer-links {
      column-gap: 0;
      grid-auto-columns: 1fr;
    }

    .disclaimer-text {
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb &&
        `margin-top: 28px;font-size:10px;line-height:16px;`}
    }

    .hide-mobile {
      display: none;
    }
  }
`;

type FooterProps = {
  linksTitle?: string;
  currentLanguage?: string;
  attraction?: string;
  logoURL: string;
  logoAlt: string;
  hasPoweredByHeadoutLogo: boolean;
  disclaimerText: string;
  slices?: Array<any>;
  themeOverride?: string;
  secondarySlices?: Array<any>;
  secondaryHeading?: string;
  primaryHeading?: string;
  isEntertainmentMb?: boolean;
};

const LinkSlices = ({ linksTitle, slices, theme, className = '' }: any) => (
  <FooterLinksWrapper className={className}>
    <Container>
      <Conditional if={theme !== THEMES.MIN_BLUE}>
        <div
          className={`quick-links-title ${
            linksTitle ? 'has-custom-title' : ''
          }`}
        >
          {linksTitle || strings.FOOTER.QUICK_LINKS}
        </div>
      </Conditional>
      <div className="quick-links">
        <Conditional if={theme === THEMES.MIN_BLUE}>
          <div className={`quick-links-heading`}>
            <div className="quick-links-title">
              {linksTitle || strings.FOOTER.QUICK_LINKS}
            </div>
          </div>
        </Conditional>
        {slices.map((slice: any, index: number) => {
          return (
            <div className={`${slice.slice_type}`} key={index}>
              {sliceHandler(slice, { index, sliceLength: slices.length })}
            </div>
          );
        })}
      </div>
    </Container>
  </FooterLinksWrapper>
);

const Footer: React.FC<FooterProps> = ({
  logoURL,
  logoAlt,
  disclaimerText = '',
  hasPoweredByHeadoutLogo,
  slices = [],
  themeOverride = THEMES.DEFAULT,
  secondarySlices = [],
  secondaryHeading = '',
  primaryHeading = '',
  isEntertainmentMb = false,
}) => {
  const { mbTheme = THEMES.DEFAULT, isExperimentalBot } = useContext(MBContext);
  const footerRef = useRef(null);
  const isFooterIntersecting = useOnScreen({ ref: footerRef, unobserve: true });
  const width = useWindowWidth();
  const [isMobile, setIsMobile] = useState(width < 768);
  const [isMobileCallUsDrawer, setIsMobileCallUsDrawer] = useState(false);

  const onToggleMobileCallUsDrawer = () => {
    setIsMobileCallUsDrawer((isMobileCallUsDrawer) => !isMobileCallUsDrawer);
  };

  const finalThemeName =
    themeOverride === THEMES.INHERIT ? mbTheme : themeOverride;

  useEffect(() => {
    setIsMobile(width < 768);
  }, [width]);

  const {
    sidebarModal: { addToAside },
  } = useContext(MBContext);

  const toggleCallUsPanel = () => {
    if (isMobile) {
      onToggleMobileCallUsDrawer();
    } else {
      // @ts-expect-error TS(2721): Cannot invoke an object which is possibly 'null'.
      addToAside({
        children: (
          <div>
            <ContactUS />
          </div>
        ),
        width: '31vw',
        title: strings.FOOTER.CALL_US,
        type: SIDEBAR_TYPES.CONTACT_US_PANEL,
      });
    }
  };

  return (
    // @ts-expect-error TS(2786): 'ThemeProvider' cannot be used as a JSX component.
    <ThemeProvider theme={getAppTheme(finalThemeName)}>
      {/* @ts-expect-error TS(2769): No overload matches this call. */}
      <StyledFooter isEntertainmentMb={isEntertainmentMb} ref={footerRef}>
        <Conditional if={isExperimentalBot || isFooterIntersecting}>
          <>
            <LinkSlicesWrapper
              isEntertainmentMb={isEntertainmentMb}
              slicesLength={slices?.length + secondarySlices?.length}
            >
              <Conditional if={slices?.length}>
                <LinkSlices
                  className={'primary-footer'}
                  linksTitle={primaryHeading}
                  slices={slices}
                  theme={finalThemeName}
                />
              </Conditional>
              <Conditional if={secondarySlices?.length}>
                <LinkSlices
                  className={'secondary-footer'}
                  linksTitle={secondaryHeading}
                  slices={secondarySlices}
                  theme={finalThemeName}
                />
              </Conditional>
            </LinkSlicesWrapper>
            {/* @ts-expect-error TS(2769): No overload matches this call. */}
            <FooterLegalWrapper isEntertainmentMb={isEntertainmentMb}>
              <Container>
                <FooterLegal
                  invertLogoColor={finalThemeName !== THEMES.MIN_BLUE}
                  isEntertainmentMb={isEntertainmentMb}
                >
                  <div className="logo-disclaimer">
                    <div className="logo-wrapper">
                      <Image
                        fill
                        url={logoURL}
                        alt={logoAlt}
                        height="44"
                        width="144"
                      />
                      <Conditional
                        if={
                          hasPoweredByHeadoutLogo &&
                          finalThemeName !== THEMES.MIN_BLUE
                        }
                      >
                        {POWERED_BY_HEADOUT}
                      </Conditional>
                    </div>
                    <Conditional if={finalThemeName !== THEMES.MIN_BLUE}>
                      <div className="disclaimer-text">{disclaimerText}</div>
                    </Conditional>
                    <Conditional
                      if={finalThemeName === THEMES.MIN_BLUE && !isMobile}
                    >
                      <div className={'disclaimer-text copyright'}>
                        {`© Copyright ${new Date().getFullYear()}`}
                      </div>
                    </Conditional>
                  </div>
                  <div className="footer-links">
                    <div className="help">
                      <LinksWrapper isEntertainmentMb={isEntertainmentMb}>
                        <div className="header">{strings.FOOTER.GET_HELP}</div>
                        <div className="links">
                          <Conditional if={finalThemeName !== THEMES.MIN_BLUE}>
                            <a
                              href="https://secure.livechatinc.com/licence/8339531/v2/open_chat.cgi?groups=0"
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              {strings.FOOTER.CHAT_WITH_US}
                            </a>
                          </Conditional>
                          <button
                            className="toggle_panel_button"
                            onClick={toggleCallUsPanel}
                          >
                            {`${strings.FOOTER.CALL_US} `}
                          </button>
                          <a
                            href={`mailto:${
                              finalThemeName !== THEMES.MIN_BLUE
                                ? 'support@headout.com'
                                : 'support@online-tickets.co'
                            }`}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            {strings.FOOTER.EMAIL_US}
                          </a>
                        </div>
                      </LinksWrapper>
                    </div>
                    <div className="legal">
                      <LinksWrapper isEntertainmentMb={isEntertainmentMb}>
                        <div className="header">{strings.FOOTER.LEGAL}</div>
                        <div className="links">
                          <a
                            href="/terms/"
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            {strings.FOOTER.TERMS_AND_CONDITIONS}
                          </a>
                          <a
                            href="/privacy-policy/"
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            {strings.FOOTER.PRIVACY_POLICY}
                          </a>
                          <Conditional if={finalThemeName !== THEMES.MIN_BLUE}>
                            <a
                              href="/company-details/"
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              {strings.FOOTER.COMPANY_DETAILS}
                            </a>
                          </Conditional>
                        </div>
                      </LinksWrapper>
                    </div>
                  </div>

                  <Conditional
                    if={finalThemeName === THEMES.MIN_BLUE && isMobile}
                  >
                    <div className="chin" style={{ marginTop: '-64px' }}>
                      <div className={'disclaimer-text copyright'}>
                        {`© Copyright ${new Date().getFullYear()}`}
                      </div>
                    </div>
                  </Conditional>
                </FooterLegal>
                <Conditional if={finalThemeName !== THEMES.MIN_BLUE}>
                  <div className="footer-chin">
                    <div className="white-line" />
                    <div className="super-brand-logo">
                      <Conditional if={!isEntertainmentMb}>
                        {WHITE_BLIP}
                      </Conditional>
                      <span>
                        {isEntertainmentMb
                          ? `© Headout ${new Date().getFullYear()}`
                          : `© ${new Date().getFullYear()} Headout`}
                      </span>
                    </div>
                    <SocialLinks
                      className="social-links"
                      isEntertainmentMb={isEntertainmentMb}
                    />
                  </div>
                </Conditional>
              </Container>
            </FooterLegalWrapper>
          </>
        </Conditional>
        <Conditional if={isMobileCallUsDrawer}>
          <MobileCallUsPanelDrawer
            onToggleMobileCallUsDrawer={onToggleMobileCallUsDrawer}
          />
        </Conditional>
      </StyledFooter>
    </ThemeProvider>
  );
};

export default Footer;
