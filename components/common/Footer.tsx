import React, { useContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { useWindowWidth } from '@react-hook/window-size';
import { getAppTheme } from 'style/theme';
import Conditional from 'components/common/Conditional';
import ContactUS, {
  MobileCallUsPanelDrawer,
} from 'components/common/ContactUs';
import LazyComponent from 'components/common/LazyComponent';
import { FooterProps } from 'UI/Footer/interface';
import { LinkSlices } from 'UI/Footer/LinkSlices';
import { PaymentMethods } from 'UI/Footer/PaymentMethods';
import SocialLinks from 'UI/Footer/SocialLinks';
import {
  Container,
  FooterBottomLinks,
  FooterHeading,
  FooterLegal,
  FooterLegalWrapper,
  FooterListItem,
  GmapsDisclaimer,
  LinkSlicesWrapper,
  LinksWrapper,
  StoreLinks,
  StyledFooter,
} from 'UI/Footer/style';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import {
  CITY_LINKS,
  COMPANY_LINKS,
  CONTACT_LINKS,
  DOWNLOAD_APP_QR,
  DOWNLOAD_APP_QR_DIM,
  FOOTER_LOGO_HEIGHT,
  FOOTER_LOGO_WIDTH,
  HEADOUT_ADDRESS,
  STAR_LOGO_DARK,
  STAR_LOGO_LIGHT,
  STAR_VERIFICATION_LINK,
} from 'const/footer';
import { SIDEBAR_TYPES, THEMES } from 'const/index';
import { strings } from 'const/strings';
import PhoneIcon from 'assets/footerPhone';
import OutlinedInfoIcon from 'assets/outlinedInfoIcon';
import PoweredByHeadout from 'assets/poweredByHeadout';
import WhiteBlip from 'assets/whiteBlip';

const Footer: React.FC<FooterProps> = ({
  logoURL,
  logoAlt,
  disclaimerText = '',
  hasPoweredByHeadoutLogo = true,
  slices = [],
  themeOverride = THEMES.DEFAULT,
  secondarySlices = [],
  secondaryHeading = '',
  primaryHeading = '',
  isEntertainmentMb = false,
  isCatOrSubCatPage = false,
  showGmapsDisclaimer = false,
  isDark = false,
  isLTT = false,
}) => {
  const { mbTheme = THEMES.DEFAULT } = useContext(MBContext);
  const width = useWindowWidth();
  const [isMobile, setIsMobile] = useState(width < 768);
  const [isMobileCallUsDrawer, setIsMobileCallUsDrawer] = useState(false);
  let isLight = !isLTT;

  if (!isLTT && isDark) isLight = false;

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

  const verifyStar = () => {
    window.open(
      STAR_VERIFICATION_LINK,
      '_blank',
      'toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=560,height=490'
    );
  };

  return (
    // @ts-expect-error TS(2786): 'ThemeProvider' cannot be used as a JSX component.
    <ThemeProvider theme={getAppTheme(finalThemeName)}>
      <StyledFooter
        isEntertainmentMb={isEntertainmentMb}
        $isCatOrSubCatPage={isCatOrSubCatPage}
      >
        <LazyComponent>
          <>
            <LinkSlicesWrapper
              isEntertainmentMb={isEntertainmentMb}
              slicesLength={slices?.length + secondarySlices?.length}
              $isCatOrSubCatPage={isCatOrSubCatPage}
            >
              <Conditional if={slices?.length}>
                <LinkSlices
                  className={'primary-footer'}
                  linksTitle={primaryHeading}
                  slices={slices}
                  theme={finalThemeName}
                  isCatOrSubCatPage={isCatOrSubCatPage}
                />
              </Conditional>
              <Conditional if={secondarySlices?.length}>
                <LinkSlices
                  className={'secondary-footer'}
                  linksTitle={secondaryHeading}
                  slices={secondarySlices}
                  theme={finalThemeName}
                  isCatOrSubCatPage={isCatOrSubCatPage}
                />
              </Conditional>
              <Container>
                <Conditional if={showGmapsDisclaimer}>
                  <GmapsDisclaimer>
                    <div className="row">
                      {OutlinedInfoIcon}
                      <p>{strings.FOOTER.INFORMATION}</p>
                    </div>
                    <p>{strings.FOOTER.GMAPS_DISCLAIMER}</p>
                  </GmapsDisclaimer>
                </Conditional>
              </Container>
            </LinkSlicesWrapper>
            <FooterLegalWrapper
              isEntertainmentMb={isEntertainmentMb}
              isLight={isLight}
              isLTT={isLTT}
            >
              <Container>
                <FooterLegal
                  invertLogoColor={
                    !isLight && finalThemeName !== THEMES.MIN_BLUE
                  }
                  isEntertainmentMb={isEntertainmentMb}
                  isLight={isLight}
                  isLTT={isLTT}
                >
                  <div className="logo-disclaimer">
                    <div className="logo-wrapper">
                      <Image
                        fill
                        url={logoURL}
                        alt={logoAlt}
                        height={FOOTER_LOGO_HEIGHT}
                        width={FOOTER_LOGO_WIDTH}
                      />
                      <Conditional
                        if={
                          hasPoweredByHeadoutLogo &&
                          finalThemeName !== THEMES.MIN_BLUE
                        }
                      >
                        <PoweredByHeadout />
                      </Conditional>
                    </div>
                  </div>
                  <div className="footer-links">
                    <div className="help">
                      <LinksWrapper
                        isEntertainmentMb={isEntertainmentMb}
                        isLight={isLight}
                        isLTT={isLTT}
                      >
                        <FooterHeading isLight={isLight}>
                          <span>{strings.FOOTER.GET_HELP_24_7}</span>
                        </FooterHeading>
                        <ul className="links">
                          {CONTACT_LINKS.slice(0, 2)?.map((link, index) => (
                            <FooterListItem key={index} isLight={isLight}>
                              {link.icon}
                              <a
                                href={link.href}
                                rel="noreferrer noopener"
                                target="_blank"
                              >
                                {link.label}
                              </a>
                            </FooterListItem>
                          ))}
                          <FooterListItem key={2} isLight={isLight}>
                            {PhoneIcon}
                            <button
                              className="toggle_panel_button"
                              onClick={toggleCallUsPanel}
                            >
                              {strings.FOOTER.CALL_US}
                            </button>
                          </FooterListItem>
                          {CONTACT_LINKS.slice(-1)?.map((link, index) => (
                            <FooterListItem key={index} isLight={isLight}>
                              {link.icon}
                              <a
                                href={link.href}
                                rel="noreferrer noopener"
                                target="_blank"
                              >
                                {link.label}
                              </a>
                            </FooterListItem>
                          ))}
                        </ul>
                      </LinksWrapper>
                    </div>
                    <div className="download hide-mobile">
                      <StoreLinks isLight={isLight} isLTT={isLTT}>
                        <Image
                          url={DOWNLOAD_APP_QR}
                          width={DOWNLOAD_APP_QR_DIM}
                          height={DOWNLOAD_APP_QR_DIM}
                          alt={strings.FOOTER.SCAN_CODES}
                        />{' '}
                        <span>{strings.FOOTER.DOWNLOAD_HEADOUT}</span>
                      </StoreLinks>
                    </div>
                    <div className="cities">
                      <LinksWrapper
                        isEntertainmentMb={isEntertainmentMb}
                        isLight={isLight}
                        isLTT={isLTT}
                      >
                        <FooterHeading isLight={isLight}>
                          <span>{strings.FOOTER.CITIES}</span>
                        </FooterHeading>
                        <ul className="links">
                          {CITY_LINKS.map((link, index) => (
                            <FooterListItem key={index} isLight={isLight}>
                              <a
                                href={link.href}
                                rel="noreferrer noopener"
                                target="_blank"
                              >
                                {link.label}
                              </a>
                            </FooterListItem>
                          ))}
                        </ul>
                      </LinksWrapper>
                    </div>
                    <div className="company">
                      <LinksWrapper
                        isEntertainmentMb={isEntertainmentMb}
                        isLight={isLight}
                        isLTT={isLTT}
                      >
                        <FooterHeading isLight={isLight}>
                          <span>{strings.FOOTER.COMPANY}</span>
                        </FooterHeading>
                        <ul className="links">
                          {COMPANY_LINKS.map((link, index) => (
                            <FooterListItem key={index} isLight={isLight}>
                              <a
                                href={link.href}
                                rel="noreferrer noopener"
                                target="_blank"
                              >
                                {link.label}
                              </a>
                            </FooterListItem>
                          ))}
                        </ul>
                      </LinksWrapper>
                    </div>
                    <div className="payment">
                      <LinksWrapper
                        isEntertainmentMb={isEntertainmentMb}
                        isLight={isLight}
                        isLTT={isLTT}
                      >
                        <FooterHeading isLight={isLight}>
                          <span>{strings.FOOTER.WE_ACCEPT}</span>
                        </FooterHeading>
                        <PaymentMethods />
                      </LinksWrapper>
                    </div>
                    <Conditional if={isLTT}>
                      <div className="star-verifier">
                        <FooterHeading isLight={isLight}>
                          <span>{strings.FOOTER.OFFICIAL_TICKET_RETAILER}</span>
                        </FooterHeading>
                        <Image
                          url={isLight ? STAR_LOGO_LIGHT : STAR_LOGO_DARK}
                          alt={strings.FOOTER.STAR_VERIFIED}
                          onClick={verifyStar}
                        />
                      </div>
                    </Conditional>
                  </div>

                  <Conditional
                    if={finalThemeName === THEMES.MIN_BLUE && isMobile}
                  >
                    <div className="chin" style={{ marginTop: '-4.267rem' }}>
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
                      {WhiteBlip}
                      <FooterBottomLinks
                        className="FooterBottomLinks"
                        isLight={isLight}
                      >
                        <a
                          href={'/privacy-policy/'}
                          rel="noreferrer noopener"
                          target="_blank"
                        >
                          {strings.FOOTER.PRIVACY_POLICY}
                        </a>
                        <span className="dot-2" aria-hidden="true">
                          •
                        </span>

                        <a
                          href={'/terms/'}
                          rel="noreferrer noopener"
                          target="_blank"
                        >
                          {strings.FOOTER.TERMS_OF_USAGE}
                        </a>

                        <span className="dot-1" aria-hidden="true">
                          •
                        </span>
                        <span className="address">{HEADOUT_ADDRESS}</span>
                      </FooterBottomLinks>
                    </div>
                    <SocialLinks
                      className="social-links"
                      isEntertainmentMb={isEntertainmentMb}
                      isLight={isLight}
                    />
                    <div className="disclaimer-text-area">{disclaimerText}</div>
                  </div>
                </Conditional>
              </Container>
            </FooterLegalWrapper>
          </>
        </LazyComponent>
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
