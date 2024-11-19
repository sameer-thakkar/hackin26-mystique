import React, { useContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { useWindowWidth } from '@react-hook/window-size';
import { getAppTheme } from 'style/theme';
import Conditional from 'components/common/Conditional';
import ContactUS, {
  MobileCallUsPanelDrawer,
} from 'components/common/ContactUs';
import { FooterProps } from 'UI/Footer/interface';
import { LinkSlices } from 'UI/Footer/LinkSlices';
import { PaymentMethods } from 'UI/Footer/PaymentMethods';
import SocialLinks from 'UI/Footer/SocialLinks';
import {
  Container,
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
import { showAndOpenZendeskChat } from 'utils/zenchatUtils';
import {
  CANCELLATION_POLICY_LINK,
  COMPANY_DETAILS_LINK,
  DOWNLOAD_APP_QR,
  DOWNLOAD_APP_QR_DIM,
  FOOTER_LOGO_HEIGHT,
  FOOTER_LOGO_WIDTH,
  HEADOUT_ADDRESS,
  HEADOUT_MAIL_REDIRECT,
  PRIVACY_POLICY_LINK,
  STAR_LOGO_DARK,
  STAR_LOGO_LIGHT,
  STAR_VERIFICATION_LINK,
  TERMS_LINK,
} from 'const/footer';
import { SIDEBAR_TYPES, THEMES } from 'const/index';
import { strings } from 'const/strings';
import MailIcon from 'assets/footerMail';
import MessageIcon from 'assets/footerMessage';
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
  isDarkPurps = false,
}) => {
  const { mbTheme = THEMES.DEFAULT } = useContext(MBContext);
  const width = useWindowWidth();
  const [isMobile, setIsMobile] = useState(width < 768);
  const [isMobileCallUsDrawer, setIsMobileCallUsDrawer] = useState(false);
  let isLight = !isLTT;

  if (!isLTT && (isDark || isDarkPurps)) isLight = false;

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
    <ThemeProvider theme={getAppTheme(finalThemeName)}>
      <StyledFooter
        isEntertainmentMb={isEntertainmentMb}
        $isCatOrSubCatPage={isCatOrSubCatPage}
      >
        <>
          <LinkSlicesWrapper
            isEntertainmentMb={isEntertainmentMb}
            slicesLength={slices?.length + secondarySlices?.length}
            showGmapsDisclaimer={showGmapsDisclaimer}
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
            isDarkPurps={isDarkPurps}
          >
            <Container>
              <FooterLegal
                invertLogoColor={!isLight && finalThemeName !== THEMES.MIN_BLUE}
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
                  <Conditional if={!isLTT}>
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
                  </Conditional>
                  <div className="help">
                    <LinksWrapper
                      isEntertainmentMb={isEntertainmentMb}
                      isLight={isLight}
                      isLTT={isLTT}
                      isDarkPurps={isDarkPurps}
                    >
                      <FooterHeading isLight={isLight}>
                        <span>{strings.FOOTER.GET_HELP_24_7}</span>
                      </FooterHeading>
                      <ul className="links">
                        <FooterListItem isLight={isLight}>
                          {MessageIcon}
                          <button
                            className="toggle_panel_button"
                            onClick={showAndOpenZendeskChat}
                          >
                            {strings.FOOTER.CHAT_WITH_US}
                          </button>
                        </FooterListItem>
                        <FooterListItem isLight={isLight}>
                          {PhoneIcon}
                          <button
                            className="toggle_panel_button"
                            onClick={toggleCallUsPanel}
                          >
                            {strings.FOOTER.CALL_US}
                          </button>
                        </FooterListItem>
                        <FooterListItem isLight={isLight}>
                          {MailIcon}
                          <a
                            href={HEADOUT_MAIL_REDIRECT}
                            rel="noopener"
                            target="_blank"
                          >
                            {strings.FOOTER.EMAIL_US}
                          </a>
                        </FooterListItem>
                      </ul>
                    </LinksWrapper>
                  </div>
                  <div className="company">
                    <LinksWrapper
                      isEntertainmentMb={isEntertainmentMb}
                      isLight={isLight}
                      isLTT={isLTT}
                      isDarkPurps={isDarkPurps}
                    >
                      <FooterHeading isLight={isLight}>
                        <span>{strings.HEADOUT}</span>
                      </FooterHeading>
                      <ul className="links">
                        <FooterListItem isLight={isLight}>
                          <a
                            href={COMPANY_DETAILS_LINK}
                            rel="noopener"
                            target="_blank"
                          >
                            {strings.FOOTER.ABOUT_US}
                          </a>
                        </FooterListItem>
                        <FooterListItem isLight={isLight}>
                          <a
                            href={PRIVACY_POLICY_LINK}
                            rel="noopener"
                            target="_blank"
                          >
                            {strings.FOOTER.PRIVACY_POLICY}
                          </a>
                        </FooterListItem>
                        <FooterListItem isLight={isLight}>
                          <a href={TERMS_LINK} rel="noopener" target="_blank">
                            {strings.FOOTER.TERMS_OF_USAGE}
                          </a>
                        </FooterListItem>
                        <FooterListItem isLight={isLight}>
                          <a
                            href={CANCELLATION_POLICY_LINK}
                            rel="noopener"
                            target="_blank"
                          >
                            {strings.CANCELLATION_POLICY_HEADING}
                          </a>
                        </FooterListItem>
                      </ul>
                    </LinksWrapper>
                  </div>
                  <div className="payment">
                    <LinksWrapper
                      isEntertainmentMb={isEntertainmentMb}
                      isLight={isLight}
                      isLTT={isLTT}
                      isDarkPurps={isDarkPurps}
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
                    <span className="address">{HEADOUT_ADDRESS}</span>
                  </div>
                  <SocialLinks
                    className="social-links"
                    isEntertainmentMb={isEntertainmentMb}
                    isLight={isLight}
                  />
                  <Conditional if={disclaimerText}>
                    <div className="disclaimer-text-area">{disclaimerText}</div>
                  </Conditional>
                </div>
              </Conditional>
            </Container>
          </FooterLegalWrapper>
        </>
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
