import { THEMES } from 'const/index';
import React, { useContext, useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { strings } from 'const/strings';
import { MBContext } from 'contexts/MBContext';
import { getAppTheme } from 'style/theme';
import { useWindowWidth } from '@react-hook/window-size';
import { COLORS, SOLEIL } from 'const/ui-constants';

import Image from '../UI/Image';
import SocialLinks from '../UI/SocialLinks';
import sliceHandler from '../Slices';
import { POWERED_BY_HEADOUT, WHITE_BLIP } from '../../assets/SvgIcons';
import Conditional from './Conditional';

const StyledFooter = styled.footer`
  width: 100%;
  background: white;
  color: black;
  display: grid;
  font-family: ${SOLEIL.FONT_STACK};
  font-size: 14px;
  margin-top: 40px;
  border-top: 1px solid ${COLORS.GREY.G8};
`;

const FooterLinksWrapper = styled.div`
  padding-top: 32px;
  background: ${({ theme }) => theme.footer.secondaryBackground};
  padding-bottom: 32px;
  &.primary-footer {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .quick-links-title {
    font-size: 22px;
    font-family: ${SOLEIL.FONT_STACK};
    margin-bottom: 32px;
    color: ${COLORS.DAVY_GREY};
  }
  &.primary-footer + .secondary-footer .quick-links-title {
    display: none;
  }
  &.primary-footer + .secondary-footer .quick-links-title.has-custom-title {
    display: block;
  }

  .quick-links {
    display: grid;
    justify-content: space-between;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-row-gap: 32px;
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
  max-width: 1200px;
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
    return theme.theme !== THEMES.MIN_BLUE
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
      .image-wrap {
        width: auto;
      }
      img {
        height: 40px;
        max-width: 100%;
        ${({ invertLogoColor }) =>
          invertLogoColor ? `filter: brightness(0) invert(1);` : ''}
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
    max-width: 500px;
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

const LinkSlicesWrapper = styled.div`
  display: grid;
  grid-row-gap: 24px;
  margin-bottom: 40px;
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
  secondarySlices?: Array<any>;
  secondaryHeading?: string;
  primaryHeading?: string;
};

const LinkSlices = ({ linksTitle, slices, theme, className = '' }) => (
  <FooterLinksWrapper className={className}>
    <Container>
      {theme !== THEMES.MIN_BLUE ? (
        <div
          className={`quick-links-title ${
            linksTitle ? 'has-custom-title' : ''
          }`}
        >
          {linksTitle || strings.FOOTER.QUICK_LINKS}
        </div>
      ) : null}
      <div className="quick-links">
        <Conditional if={theme === THEMES.MIN_BLUE}>
          <div className={`quick-links-heading`}>
            <div className="quick-links-title">
              {linksTitle || strings.FOOTER.QUICK_LINKS}
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
);

const Footer: React.FC<FooterProps> = ({
  attraction = '',
  logoURL,
  logoAlt,
  showDisclaimer = false,
  disclaimerText = '',
  hasPoweredByHeadoutLogo = false,
  invertLogoColor = false,
  slices = [],
  themeOverride = THEMES.DEFAULT,
  secondarySlices = [],
  secondaryHeading = '',
  primaryHeading = '',
}) => {
  const { mbTheme = THEMES.DEFAULT } = useContext(MBContext);
  const width = useWindowWidth();
  const [isMobile, setIsMobile] = useState(width < 768);
  const finalThemeName =
    themeOverride === THEMES.INHERIT ? mbTheme : themeOverride;

  useEffect(() => {
    setIsMobile(width < 768);
  }, [width]);
  return (
    <ThemeProvider theme={getAppTheme(finalThemeName)}>
      <StyledFooter>
        <LinkSlicesWrapper>
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
        <FooterLegalWrapper>
          <Container>
            <FooterLegal
              invertLogoColor={
                invertLogoColor && finalThemeName !== THEMES.MIN_BLUE
              }
            >
              <div className="logo-disclaimer">
                <div className="logo-wrapper">
                  <Image
                    url={logoURL}
                    alt={logoAlt}
                    isFooterLogo
                    height="44"
                    width="144"
                  />
                  {hasPoweredByHeadoutLogo && finalThemeName !== THEMES.MIN_BLUE
                    ? POWERED_BY_HEADOUT
                    : null}
                </div>
                {showDisclaimer && finalThemeName !== THEMES.MIN_BLUE ? (
                  <div className="disclaimer-text">
                    {disclaimerText
                      ? disclaimerText
                      : strings.FOOTER.DISCLAIMER.replace(
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
                <LinksHeader>{strings.FOOTER.GET_HELP}</LinksHeader>
                <Conditional if={finalThemeName !== THEMES.MIN_BLUE}>
                  <Link
                    href="https://secure.livechatinc.com/licence/8339531/v2/open_chat.cgi?groups=0"
                    target="_blank"
                  >
                    {strings.FOOTER.CHAT_WITH_US}
                  </Link>
                </Conditional>
                <Link href={`tel:${'+1 347 897 0100'}`}>
                  {strings.FOOTER.CALL_US} {!isMobile ? '+1 347 897 0100' : ''}
                </Link>
                <Link
                  href={`mailto:${
                    finalThemeName !== THEMES.MIN_BLUE
                      ? 'support@headout.com'
                      : 'support@online-tickets.co'
                  }`}
                  target="_blank"
                >
                  {strings.FOOTER.EMAIL_US}
                </Link>
              </div>
              <div className="legal">
                <LinksHeader> {strings.FOOTER.LEGAL}</LinksHeader>
                <Link href="/terms" target="_blank">
                  {strings.FOOTER.TERMS_AND_CONDITIONS}
                </Link>
                <Link href="/privacy-policy" target="_blank">
                  {strings.FOOTER.PRIVACY_POLICY}
                </Link>
                <Conditional if={finalThemeName !== THEMES.MIN_BLUE}>
                  <Link href="/company-details" target="_blank">
                    {strings.FOOTER.COMPANY_DETAILS}
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
            <Conditional if={finalThemeName !== THEMES.MIN_BLUE}>
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
