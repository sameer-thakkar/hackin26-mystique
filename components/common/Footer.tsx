import React, { useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Image from '../UI/Image';
import SocialLinks from '../UI/SocialLinks';
import sliceHandler from '../Slices';
import * as labels from '../../constants/localization/labels';
import { POWERED_BY_HEADOUT, WHITE_BLIP } from '../../assets/SvgIcons';
import { COLORS, SOLEIL } from '../../constants/ui-constants';
import { MBContext } from 'contexts/MBContext';
import { THEMES } from 'constants/index';
import Conditional from './Conditional';
import theme from 'style/theme';
import useWindowSize from 'hooks/useWindowSize';

const StyledFooter = styled.footer`
  width: 100%;
  background: white;
  color: black;
  display: grid;
  font-family: ${SOLEIL.FONT_STACK};
  font-size: 14px;
  margin-top: 40px;
`;

const FooterLinksWrapper = styled.div`
  padding-top: 32px;
  border-top: 1px solid ${COLORS.GREY.G8};
  border-bottom: 1px solid ${COLORS.GREY.G8};
  background: ${({ theme }) => theme.footer.secondaryBackground};
  padding-bottom: 32px;
  margin-bottom: 40px;
  .quick-links-title {
    font-size: 22px;
    font-family: ${SOLEIL.FONT_STACK};
    margin-bottom: 32px;
    color: ${COLORS.DAVY_GREY};
  }
  .quick-links {
    display: grid;
    justify-content: space-between;
    grid-template-columns: minmax(400px, max-content) 1fr 1fr 1fr;
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      grid-row-gap: 32px;
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
    font-size: 12px;
    margin-bottom: 56px;
    grid-template-columns: auto auto;
    justify-content: space-between;
    grid-template-areas: 'white-line white-line' 'super-brand-logo social-links';
    grid-row-gap: 24px;
    .white-line {
      grid-area: white-line;
      width: 100%;
      height: 0;
      border: 0.5px solid white;
    }
    .super-brand-logo {
      grid-area: super-brand-logo;
      display: grid;
      grid-template-columns: auto auto;
      grid-column-gap: 12px;
      align-items: center;
      justify-items: left;
      span {
        color: ${({ theme }) => theme.footer.color};
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
      grid-template-columns: 1fr;
      grid-template-areas: 'social-links' 'white-line' 'super-brand-logo';
      grid-row-gap: 24px;
    }
  }
`;

const Container = styled.div`
  width: 1200px;
  margin: 0 auto;
  @media (max-width: 768px) {
    width: auto;
    padding: 0 16px;
  }
`;

const FooterLegal = styled.div`
  display: grid;
  align-items: start;
  justify-content: space-between;
  ${({ theme }) => {
    return theme.theme === THEMES.DEFAULT
      ? `
        grid-template-areas: 'logo-disclaimer help legal';
        grid-template-columns: minmax(400px, max-content) max-content max-content;
        grid-column-gap: 120px;
      `
      : `
        grid-template-areas: 'logo-disclaimer . help legal';
        grid-template-columns: minmax(400px, max-content) 1fr 1fr 1fr;
      `;
  }}
  margin: 40px 0;
  margin-bottom: 64px;
  padding-bottom: 40px;
  line-height: 20px;
  .logo-disclaimer {
    grid-area: logo-disclaimer;
    .logo-wrapper {
      display: flex;
      img {
        height: 40px;
        max-width: 100%;
        ${({ invertLogoColor, theme }) =>
          invertLogoColor && theme === THEMES.DEFAULT
            ? `filter: invert(1);`
            : ''}
      }
      svg {
        height: 40px;
        margin-left: 10px;
        width: 100.5px;
        path {
          fill: white;
        }
      }
    }
  }
  .help {
    grid-area: help;
  }
  .legal {
    grid-area: legal;
  }
  .disclaimer-text {
    color: ${({ theme }) => theme.footer.color};
    margin-top: 32px;
    font-family: ${SOLEIL.FONT_STACK};
    line-height: 19px;
  }
  @media (max-width: 768px) {
    grid-template-areas: 'logo-disclaimer logo-disclaimer' 'help legal';
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 64px;
    grid-column-gap: unset;
  }
`;

const LinksHeader = styled.div`
  font-weight: ${SOLEIL.SEMIBOLD};
  color: ${({ theme }) => theme.footer.headingColor};
`;

const Link = styled.a`
  display: block;
  text-decoration: none;
  color: ${({ theme }) => theme.footer.color};
  margin: 16px 0;
  :last-child {
    margin-bottom: 0;
  }
`;

type FooterProps = {
  linksTitle?: string;
  currentLanguage?: string;
  attraction?: string;
  logoURL: string;
  logoAlt: string;
  hasPoweredByHeadoutLogo?: boolean;
  microbrandType: string;
  showDisclaimer: boolean;
  disclaimerText: string;
  invertLogoColor?: boolean;
  slices?: Array<any>;
  themeOverride?: string;
};

const Footer: React.FC<FooterProps> = ({
  linksTitle,
  currentLanguage,
  attraction = '',
  logoURL,
  logoAlt,
  showDisclaimer = false,
  disclaimerText = '',
  hasPoweredByHeadoutLogo = false,
  microbrandType = '',
  invertLogoColor = false,
  slices = [],
  themeOverride = THEMES.DEFAULT,
}) => {
  const { mbTheme = THEMES.DEFAULT } = useContext(MBContext);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const finalThemeName =
    themeOverride === THEMES.INHERIT ? mbTheme : themeOverride;
  return (
    <ThemeProvider theme={theme[finalThemeName]}>
      <StyledFooter>
        {slices.length !== 0 ? (
          <FooterLinksWrapper>
            <Container>
              {finalThemeName === THEMES.DEFAULT ? (
                <div className="quick-links-title">
                  {linksTitle || 'Quick Links'}
                </div>
              ) : null}
              <div className="quick-links">
                <Conditional if={finalThemeName === THEMES.MIN_BLUE}>
                  <div className={`quick-links-heading`}>
                    <div className="quick-links-title">
                      {linksTitle || 'Quick Links'}
                    </div>
                  </div>
                </Conditional>
                {slices.map((slice, index) => {
                  return (
                    <div className={`${slice.slice_type}`} key={index}>
                      {sliceHandler(slice)}
                    </div>
                  );
                })}
              </div>
            </Container>
          </FooterLinksWrapper>
        ) : null}
        <FooterLegalWrapper>
          <Container>
            <FooterLegal invertLogoColor={invertLogoColor}>
              <div className="logo-disclaimer">
                <div className="logo-wrapper">
                  <Image url={logoURL} alt={logoAlt} />
                  {hasPoweredByHeadoutLogo && finalThemeName === THEMES.DEFAULT
                    ? POWERED_BY_HEADOUT
                    : null}
                </div>
                {(microbrandType === 'C1' || showDisclaimer) &&
                finalThemeName === THEMES.DEFAULT ? (
                  <div className="disclaimer-text">
                    {disclaimerText
                      ? disclaimerText
                      : labels[currentLanguage].FOOTER.DISCLAIMER.replace(
                          '<attraction>',
                          attraction
                        )}
                  </div>
                ) : null}
                <Conditional
                  if={finalThemeName === THEMES.MIN_BLUE && !isMobile}
                >
                  <div className={'disclaimer-text copyright'}>
                    {`© Copyright ${new Date().getFullYear()}`}
                  </div>
                </Conditional>
              </div>
              <div className="help">
                <LinksHeader>
                  {labels[currentLanguage].FOOTER.GET_HELP}
                </LinksHeader>
                <Conditional if={finalThemeName === THEMES.DEFAULT}>
                  <Link
                    href="https://secure.livechatinc.com/licence/8339531/v2/open_chat.cgi?groups=0"
                    target="_blank"
                  >
                    {labels[currentLanguage].FOOTER.CHAT_WITH_US}
                  </Link>
                </Conditional>
                <Link
                  href={`tel:${
                    finalThemeName === THEMES.DEFAULT
                      ? '+1 347 897 0100'
                      : '+1 952 856 3128'
                  }`}
                >
                  {' '}
                  {labels[currentLanguage].FOOTER.CALL_US}
                </Link>
                <Link
                  href={`mailto:${
                    finalThemeName === THEMES.DEFAULT
                      ? 'support@headout.com'
                      : 'support@online-tickets.co'
                  }`}
                  target="_blank"
                >
                  {labels[currentLanguage].FOOTER.EMAIL_US}
                </Link>
              </div>
              <div className="legal">
                <LinksHeader>
                  {' '}
                  {labels[currentLanguage].FOOTER.LEGAL}
                </LinksHeader>
                <Link href="/terms" target="_blank">
                  {labels[currentLanguage].FOOTER.TERMS_AND_CONDITIONS}
                </Link>
                <Link href="/privacy-policy" target="_blank">
                  {labels[currentLanguage].FOOTER.PRIVACY_POLICY}
                </Link>
                <Conditional if={finalThemeName === THEMES.DEFAULT}>
                  <Link href="/company-details" target="_blank">
                    {labels[currentLanguage].FOOTER.COMPANY_DETAILS}
                  </Link>
                </Conditional>
              </div>
              <Conditional if={finalThemeName === THEMES.MIN_BLUE && isMobile}>
                <div className="chin" style={{ marginTop: '-64px' }}>
                  <div className={'disclaimer-text copyright'}>
                    {`© Copyright ${new Date().getFullYear()}`}
                  </div>
                </div>
              </Conditional>
            </FooterLegal>
            <Conditional if={finalThemeName === THEMES.DEFAULT}>
              <div className="footer-chin">
                <div className="white-line" />
                <div className="super-brand-logo">
                  {WHITE_BLIP}
                  <span>{`© ${new Date().getFullYear()} Headout`}</span>
                </div>
                <SocialLinks className="social-links" />
              </div>
            </Conditional>
          </Container>
        </FooterLegalWrapper>
      </StyledFooter>
    </ThemeProvider>
  );
};

export default Footer;
