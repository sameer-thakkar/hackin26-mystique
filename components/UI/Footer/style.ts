import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledFooter = styled.footer<{
  isEntertainmentMb: boolean;
  $isCatOrSubCatPage: boolean;
}>`
  width: 100%;
  display: grid;
  ${({ $isCatOrSubCatPage }) => !$isCatOrSubCatPage && `margin-top: 72px;`}
  border-top: 1px solid ${COLORS.GRAY.G8};
`;

export const FooterLegalWrapper = styled.div<{
  isEntertainmentMb: boolean;
  isLight: boolean;
  isLTT: boolean;
  isDarkPurps: boolean;
}>`
  color: ${({ theme, isLight }) =>
    isLight ? theme.footer.secondaryColor : theme.footer.primaryColor};
  background: ${({ theme, isLight, isLTT, isDarkPurps }) =>
    isLight
      ? theme.footer.secondaryBackground
      : isLTT || isDarkPurps
      ? theme.footer.lttBackgroundColor
      : theme.footer.primaryBackground};
  margin: 0 auto;
  width: 100%;
  .white-line {
    width: 100%;
    height: 1px;
    opacity: ${({ isLight }) => (isLight ? '1' : '0.5')};
    background: ${({ isLight }) =>
      isLight
        ? 'linear-gradient(90deg, rgba(227, 227, 227, 0.20) 0%, rgba(227, 227, 227, 0.80) 51%, rgba(227, 227, 227, 0.20) 100%)'
        : 'linear-gradient(90deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.60) 47.5%, rgba(255, 255, 255, 0.20) 100%)'};
  }

  .footer-chin {
    display: grid;
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    grid-template-columns: auto auto;
    justify-content: space-between;
    grid-template-areas: 'disclaimer disclaimer' 'white-line white-line' 'super-brand-logo social-links';
    .white-line {
      grid-area: white-line;
    }
    .super-brand-logo {
      grid-area: super-brand-logo;
      display: flex;
      gap: 0.75rem;
      align-items: center;
      justify-items: left;
      span {
        color: ${({ theme, isLight }) =>
          isLight ? theme.footer.secondaryColor : theme.footer.primaryColor};
      }
      svg {
        height: 1rem;
      }
      svg path {
        fill: ${({ theme, isLight }) =>
          isLight ? theme.footer.secondaryColor : theme.footer.primaryColor};
      }
    }
    .social-links {
      grid-area: social-links;
      display: flex;
      justify-content: flex-end;
    }
    .disclaimer-text-area {
      grid-area: disclaimer;
      padding-bottom: 1rem;
      color: ${({ theme, isLight }) =>
        isLight ? theme.footer.secondaryColor : theme.footer.primaryColor};
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      grid-template-areas:
        'social-links'
        'white-line'
        'super-brand-logo'
        'disclaimer';
      grid-row-gap: 1.5rem;
      .super-brand-logo {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 1rem;
        svg {
          height: 1rem;
        }
      }
      .social-links {
        margin: 0;
        justify-content: flex-start;
      }
    }
  }
`;

export const Container = styled.div`
  max-width: 75rem;
  margin: 0 auto;
  width: calc(100vw - 5.6vw * 2);

  @media (max-width: 768px) {
    width: auto;
    padding: 0 1rem;
  }
`;

export const FooterHeading = styled.p<{
  isLight: boolean;
}>`
  position: relative;
  text-transform: uppercase;
  padding-bottom: 0.5rem;
  margin: 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 0.0625rem;
    width: 7.5rem;
    background: linear-gradient(90deg, #666 0%, rgba(255, 255, 255, 0));
  }

  && > span {
    ${expandFontToken(FONTS.SUBHEADING_SMALL)}
    font-weight: 400;
    letter-spacing: 1.2px;
    color: ${({ theme, isLight }) =>
      isLight
        ? theme.footer.secondaryHeadingColor
        : theme.footer.primaryHeadingColor};
  }
`;

export const LinksWrapper = styled.div<{
  isEntertainmentMb: boolean;
  isLight: boolean;
  isLTT: boolean;
  isDarkPurps: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  .links {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 0;
    padding: 0;

    a,
    .toggle_panel_button {
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
      display: block;
      text-decoration: none;
      color: ${({ theme, isLight }) =>
        isLight
          ? theme.footer.secondaryLinkColor
          : theme.footer.primaryLinkColor};
    }
    .toggle_panel_button {
      background: ${({ theme, isLight, isLTT, isDarkPurps }) =>
        isLight
          ? theme.footer.secondaryBackground
          : isLTT || isDarkPurps
          ? theme.footer.lttBackgroundColor
          : theme.footer.primaryBackground};
      border: none;
      text-align: start;
      padding: 0;
      cursor: pointer;
    }
  }

  @media (max-width: 768px) {
    ${({ isEntertainmentMb }) => isEntertainmentMb && `row-gap: 1.25rem;`}
    .header {
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb && `font-size:1rem;line-height:1.25rem;`};
    }
    .links {
      ${({ isEntertainmentMb }) => isEntertainmentMb && `row-gap: 1rem;`}
      a, .toggle_panel_button {
        ${({ isEntertainmentMb }) =>
          isEntertainmentMb &&
          `
        font-size: 0.875rem;
        line-height: 1rem;`}
      }
    }
  }
`;

export const LinkSlicesWrapper = styled.div<{
  isEntertainmentMb: boolean;
  slicesLength: number;
  $isCatOrSubCatPage: boolean;
  showGmapsDisclaimer: boolean;
  $primaryFooterExists: boolean;
}>`
  display: grid;
  padding: ${({ slicesLength, $isCatOrSubCatPage, showGmapsDisclaimer }) => {
    switch (true) {
      case !slicesLength:
        return showGmapsDisclaimer ? '0 0 2.5rem' : 'none';
      case $isCatOrSubCatPage:
        return '3.125rem 0';
      default:
        return '4rem 0';
    }
  }};
  background-color: ${COLORS.GRAY.G8};
  margin-bottom: 0;

  & .secondary-footer {
    margin-top: ${({ $primaryFooterExists, $isCatOrSubCatPage }) => {
      switch (true) {
        case !$primaryFooterExists:
          return '0';
        case !$isCatOrSubCatPage:
          return '3.25rem';
        default:
          return '0';
      }
    }};
  }

  @media (max-width: 768px) {
    ${({ isEntertainmentMb }) => isEntertainmentMb && `margin-bottom: 3rem;`}
    padding: ${({ slicesLength, $isCatOrSubCatPage }) => {
      switch (true) {
        case !slicesLength:
          return 'none';
        case $isCatOrSubCatPage:
          return '1.5rem 0';
        default:
          return '2.25rem 0';
      }
    }};
    margin-bottom: 0;
  }
`;

export const GmapsDisclaimer = styled.div`
  padding: 1rem 1.25rem;
  align-items: flex-start;
  border-radius: 0.5rem;
  border: 1px solid rgba(164, 110, 0, 0.2);
  background: #fff8ef;
  margin-top: 2.5rem;
  ${expandFontToken(FONTS.PARAGRAPH_REGULAR)}

  p {
    margin: 0.5rem 0 0 0;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    p {
      margin: 0;
      ${expandFontToken(FONTS.HEADING_XS)}
    }
  }
`;

export const FooterLegal = styled.div<{
  isEntertainmentMb: boolean;
  invertLogoColor: boolean;
  isLight: boolean;
  isLTT: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 2.25rem;
  margin: 3.25rem 0 0;
  line-height: 1.25rem;
  .logo-disclaimer {
    grid-area: logo-disclaimer;
    .logo-wrapper {
      display: flex;
      .image-wrap {
        width: auto;
        margin-right: 0.75rem;

        span {
          position: relative !important;
        }
      }
      img {
        position: relative !important;
        height: 2.5rem !important;
        max-width: 100%;
        width: unset !important;
        ${({ invertLogoColor }) =>
          invertLogoColor ? `filter: brightness(0) invert(1);` : ''}
      }
      svg {
        height: 2.5rem;
        width: 6.25rem;
        path {
          fill: ${({ isLight }) =>
            isLight ? COLORS.BRAND.PURPS : COLORS.BRAND.WHITE};
        }
      }
    }
  }
  .footer-links {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-bottom: 3.75rem;
    gap: 2.5rem;
    & > div {
      width: 100%;
      max-width: 15rem;
    }
  }

  .download {
    transform: translateY(0.25rem);
  }
  .star-verifier {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    & img {
      height: auto !important;
      width: 10rem !important;
      cursor: pointer;
    }
  }

  @media (max-width: 768px) {
    margin: 2.625rem 0 0;
    gap: 2.5rem;
    padding-bottom: 0;

    .logo-disclaimer {
      .logo-wrapper {
        width: 100%;
        .image-wrap {
          width: auto;
          margin-right: 0.5rem;
        }
        img {
          height: 1.5rem !important;
        }
        svg {
          height: 1.5rem;
          width: auto;
        }
      }
    }

    .footer-links {
      display: grid;
      gap: 2.5rem;
      padding-bottom: 2.5rem;
      grid-template-areas: ${({ isLTT }) =>
        isLTT
          ? `'help-1' 'company' 'star-verifier' 'payment'`
          : `'help-1' 'company' 'payment'`};
    }

    .help {
      grid-area: help-1;
    }
    .company {
      grid-area: company;
    }
    .payment {
      grid-area: payment;
    }
    .star-verifier {
      grid-area: star-verifier;
      padding-bottom: 3.125rem;
    }

    .hide-mobile {
      display: none;
    }
  }
`;

export const FooterListItem = styled.li<{
  isLight: boolean;
}>`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  && > a,
  && > button {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
    color:  ${({ theme, isLight }) =>
      isLight
        ? theme.footer.secondaryLinkColor
        : theme.footer.primaryLinkColor};
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &&:last-child svg {
    margin-top: 0.24rem;
  }

  & path {
    stroke: ${({ theme, isLight }) =>
      isLight
        ? theme.footer.secondaryLinkColor
        : theme.footer.primaryLinkColor};
  }

  & #help-icon {
    & path:first-child {
      fill: ${({ theme, isLight }) =>
        isLight
          ? theme.footer.secondaryLinkColor
          : theme.footer.primaryLinkColor};
      stroke: transparent;
    }
    & path {
      fill: transparent;
      stroke: ${({ theme, isLight }) =>
        isLight
          ? theme.footer.secondaryLinkColor
          : theme.footer.primaryLinkColor};
    }
    & ellipse {
      fill: ${({ theme, isLight }) =>
        isLight
          ? theme.footer.secondaryLinkColor
          : theme.footer.primaryLinkColor};
    }
  }

  &:hover {
    && > a,
    && > button {
      color: ${({ theme, isLight }) =>
        isLight
          ? theme.footer.secondaryLinkHoverColor
          : theme.footer.primaryLinkHoverColor};
    }
    path {
      stroke: ${({ theme, isLight }) =>
        isLight
          ? theme.footer.secondaryLinkHoverColor
          : theme.footer.primaryLinkHoverColor};
    }
    & #help-icon {
      & path:first-child {
        fill: ${({ theme, isLight }) =>
          isLight
            ? theme.footer.secondaryLinkHoverColor
            : theme.footer.primaryLinkHoverColor};
        stroke: transparent;
      }
      & path {
        fill: transparent;
        stroke: ${({ theme, isLight }) =>
          isLight
            ? theme.footer.secondaryLinkHoverColor
            : theme.footer.primaryLinkHoverColor};
      }
      & ellipse {
        fill: ${({ theme, isLight }) =>
          isLight
            ? theme.footer.secondaryLinkHoverColor
            : theme.footer.primaryLinkHoverColor};
      }
    }
  }
`;

export const StoreLinks = styled.div<{
  isLight: boolean;
  isLTT: boolean;
}>`
  display: flex;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  align-items: center;
  gap: 0.7rem;
  border-radius: 0.75rem;
  border: 1px solid
    ${({ theme, isLight }) =>
      isLight ? theme.footer.secondarySeparatorColor : COLORS.GRAY.G3};
  background: ${({ isLight }) => (isLight ? COLORS.GRAY.G8 : 'transparent')};

  span {
    ${expandFontToken(FONTS.SUBHEADING_LARGE)}
    color: ${({ theme, isLight }) =>
      isLight
        ? theme.footer.secondaryHeadingColor
        : theme.footer.primaryHeadingColor};
  }
  & img {
    width: 84px;
    height: 84px;
  }

  & .image-wrap {
    width: auto;
    height: 5.25rem;
  }
`;
