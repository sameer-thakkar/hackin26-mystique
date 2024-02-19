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
  ${({ $isCatOrSubCatPage }) => !$isCatOrSubCatPage && `margin-top: 2.5rem;`}
  border-top: 1px solid ${COLORS.GRAY.G8};
`;

export const FooterLegalWrapper = styled.div<{
  isEntertainmentMb: boolean;
  isLight: boolean;
  isLTT: boolean;
}>`
  color: ${({ theme, isLight }) =>
    isLight ? theme.footer.secondaryColor : theme.footer.primaryColor};
  background: ${({ theme, isLight, isLTT }) =>
    isLight
      ? theme.footer.secondaryBackground
      : isLTT
      ? theme.footer.lttBackgroundColor
      : theme.footer.primaryBackground};
  margin: 0 auto;
  width: 100%;
  .footer-chin {
    display: grid;
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    margin-bottom: 0.75rem;
    grid-template-columns: auto auto;
    justify-content: space-between;
    grid-template-areas: 'white-line white-line' 'super-brand-logo social-links' 'disclaimer disclaimer';
    .white-line {
      grid-area: white-line;
      width: 100%;
      height: 0;
      border-top: 1px solid
        ${({ theme, isLight }) =>
          isLight
            ? theme.footer.secondarySeparatorColor
            : theme.footer.primarySeparatorColor};
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
      color: ${({ theme, isLight }) =>
        isLight
          ? theme.footer.secondaryLinkColor
          : theme.footer.primaryLinkColor};
      font-size: 0.625rem;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      grid-template-areas:
        'social-links'
        'white-line'
        'super-brand-logo'
        'disclaimer';
      grid-row-gap: 1.5rem;
      margin-bottom: 1.5rem;
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

export const FooterHeading = styled.h2<{
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
    ${expandFontToken(FONTS.MISC_OVERLINE_LARGE)}
    color:  ${({ theme, isLight }) =>
      isLight
        ? theme.footer.secondaryHeadingColor
        : theme.footer.primaryHeadingColor};
  }
`;

export const LinksWrapper = styled.div<{
  isEntertainmentMb: boolean;
  isLight: boolean;
  isLTT: boolean;
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
      background: ${({ theme, isLight, isLTT }) =>
        isLight
          ? theme.footer.secondaryBackground
          : isLTT
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
}>`
  display: grid;
  padding: ${({ slicesLength, $isCatOrSubCatPage }) => {
    switch (true) {
      case !slicesLength:
        return 'none';
      case $isCatOrSubCatPage:
        return '3.125rem 0';
      default:
        return '4rem 0';
    }
  }};
  background-color: ${COLORS.GRAY.G8};
  margin-bottom: 0;

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
  gap: 2.5rem;
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
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    column-gap: 3rem;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: auto 2.75rem;
    grid-template-areas:
      'help-1 cities company payment'
      'download hide-6 hide-7 star-verifier';
  }

  .help {
    grid-area: help-1;
  }
  .cities {
    grid-area: cities;
  }
  .company {
    grid-area: company;
  }
  .payment {
    grid-area: payment;
  }
  .download {
    grid-area: download;
    transform: translateY(-6.5rem);
    width: 15rem;
  }
  .star-verifier {
    grid-area: star-verifier;
    transform: translateY(-10rem);
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
    margin: ${({ isLTT }) => (isLTT ? '2.625rem 0 5rem 0' : '2.625rem 0 0')};
    gap: 2.0625rem;
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
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: auto auto auto auto;
      grid-template-areas:
        'help-1 help-1'
        'cities company'
        'partner partner'
        'payment payment'
        'star-verifier star-verifier';
      row-gap: 2.75rem;
    }

    .payment {
      transform: translateY(-2.5rem);
    }

    .hide-mobile {
      display: none;
    }
    .star-verifier {
      transform: translateY(-2rem);
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

export const FooterBottomLinks = styled.div<{
  isLight: boolean;
}>`
  display: flex;
  flex-direction: row-reverse;
  && > a,
  && > span {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    color: ${({ theme, isLight }) =>
      isLight
        ? theme.footer.secondaryLinkColor
        : theme.footer.primaryLinkColor};
  }

  && > a {
    &:hover {
      color: ${({ theme, isLight }) =>
        isLight
          ? theme.footer.secondaryLinkHoverColor
          : theme.footer.primaryLinkHoverColor};
    }
  }

  @media (min-width: 768px) {
    column-gap: 0.5rem;
    justify-content: space-between;
  }

  @media (max-width: 768px) {
    flex-wrap: wrap-reverse;
    align-items: flex-end;
    justify-content: flex-end;

    .dot-1 {
      display: none;
    }

    a,
    span {
      margin-right: 0.5rem;
    }

    .address {
      margin-bottom: 1rem;
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

  & .image-wrap {
    width: auto;
    height: 5.25rem;
  }
`;
