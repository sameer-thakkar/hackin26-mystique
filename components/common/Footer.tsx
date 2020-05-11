import React from 'react';
import styled from 'styled-components';
import Image from '../UI/Image';
import SocialLinks from '../UI/SocialLinks';
import sliceHandler from '../Slices';
import * as labels from '../../constants/localization/labels';
import { POWERED_BY_HEADOUT, WHITE_BLIP } from '../../assets/SvgIcons';
import { COLORS, GRAPHIK, AVENIR } from '../../constants/ui-constants';

const StyledFooter = styled.footer`
  width: 100%;
  background: white;
  color: black;
  display: grid;
  font-family: ${GRAPHIK.FONT_STACK};
  font-size: 14px;
  margin-top: 40px;
`;

const FooterLinksWrapper = styled.div`
  padding-top: 40px;
  border-top: 1px solid ${COLORS.DADDY};
  margin-bottom: 40px;
  .quick-links-title {
    font-size: 22px;
    font-family: ${AVENIR.FONT_STACK};
    margin-bottom: 32px;
    color: ${COLORS.DAVY_GREY};
  }
  .quick-links {
    display: grid;
    grid-template-columns: 400px 400px 400px;
    grid-columns-gap: 120px;
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      grid-row-gap: 32px;
    }
  }
`;

const FooterLegalWrapper = styled.div`
  color: white;
  background: black;
  margin: 0 auto;
  width: 100%;
  .footer-chin {
    display: grid;
    font-size: 12px;
    margin-bottom: 56px;
    grid-template-columns: auto auto;
    justify-content: space-between;
    grid-template-areas: 'white-line white-line' 'headout-logo social-links';
    grid-row-gap: 24px;
    .white-line {
      grid-area: white-line;
      width: 100%;
      height: 0;
      border: 0.5px solid white;
    }
    .headout-logo {
      grid-area: headout-logo;
      display: grid;
      grid-template-columns: auto auto;
      grid-column-gap: 12px;
      align-items: center;
      justify-items: left;
      span {
        color: white;
      }
      svg {
        height: 16px;
      }
    }
    .social-links {
      grid-area: social-links;
    }

    @media (max-width: 768px) {
      .headout-logo {
        grid-template-columns: max-content max-content;
        svg {
          height: 12px;
        }
      }
      grid-template-columns: 1fr;
      grid-template-areas: 'social-links' 'white-line' 'headout-logo';
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
  grid-template-areas: 'logo-disclaimer help legal';
  align-items: start;
  justify-items: left;
  grid-template-columns: minmax(400px, max-content) max-content max-content;
  grid-column-gap: 120px;
  margin: 40px 0;
  line-height: 20px;
  .logo-disclaimer {
    grid-area: logo-disclaimer;
    .logo-wrapper {
      display: flex;
      img {
        height: 40px;
        max-width: 100%;
        ${(props) => (props.invertLogoColor ? `filter: invert(1);` : '')}
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
    gird-area: legal;
  }
  .disclaimer-text {
    color: white;
    margin-top: 16px;
    font-family: ${AVENIR.FONT_STACK};
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
  font-weight: ${GRAPHIK.SEMIBOLD};
  color: white;
`;

const Link = styled.a`
  display: block;
  text-decoration: none;
  color: white;
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
}) => {
  return (
    <StyledFooter>
      {slices.length !== 0 ? (
        <FooterLinksWrapper>
          <Container>
            <div className="quick-links-title">
              {linksTitle || 'Quick Links'}
            </div>
            <div className="quick-links">
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
                {hasPoweredByHeadoutLogo ? POWERED_BY_HEADOUT : null}
              </div>
              {microbrandType === 'C1' || showDisclaimer ? (
                <div className="disclaimer-text">
                  {disclaimerText
                    ? disclaimerText
                    : labels[currentLanguage].FOOTER.DISCLAIMER.replace(
                        '<attraction>',
                        attraction
                      )}
                </div>
              ) : null}
            </div>
            <div className="help">
              <LinksHeader>
                {labels[currentLanguage].FOOTER.GET_HELP}
              </LinksHeader>
              <Link
                href="https://secure.livechatinc.com/licence/8339531/v2/open_chat.cgi?groups=0"
                target="_blank"
              >
                {labels[currentLanguage].FOOTER.CHAT_WITH_US}
              </Link>
              <Link href="tel:+1 347 897 0100">
                {' '}
                {labels[currentLanguage].FOOTER.CALL_US}
              </Link>
              <Link href="mailto:support@headout.com" target="_blank">
                {labels[currentLanguage].FOOTER.EMAIL_US}
              </Link>
            </div>
            <div className="legal">
              <LinksHeader> {labels[currentLanguage].FOOTER.LEGAL}</LinksHeader>
              <Link href="/terms" target="_blank">
                {labels[currentLanguage].FOOTER.TERMS_AND_CONDITIONS}
              </Link>
              <Link href="/privacy-policy" target="_blank">
                {labels[currentLanguage].FOOTER.PRIVACY_POLICY}
              </Link>
              <Link href="/company-details" target="_blank">
                {labels[currentLanguage].FOOTER.COMPANY_DETAILS}
              </Link>
            </div>
          </FooterLegal>
          <div className="footer-chin">
            <div className="white-line" />
            <div className="headout-logo">
              {WHITE_BLIP}
              <span>© 2020 Headout</span>
            </div>
            <SocialLinks className="social-links" />
          </div>
        </Container>
      </FooterLegalWrapper>
    </StyledFooter>
  );
};

export default Footer;
