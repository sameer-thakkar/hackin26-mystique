import dynamic from 'next/dynamic';
import { SavedTag } from 'UI/PriceBlock';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { THEMES } from 'const/index';
import { expandFontToken } from 'const/typography';

const CTAContainer = dynamic(() =>
  import('components/Product').then((mod) => mod.CTAContainer)
);

const themes = {
  [THEMES.MIN_BLUE]: () => ({
    theme: THEMES.MIN_BLUE,
    primaryColor: COLORS.PRIMARY.LINK_BLUE,
    secondaryColor: COLORS.TEXT.LINK_BLUE_1,
    primaryAccent: COLORS.TEXT.OKAY_GREEN_3,
    secondaryAccent: COLORS.BRAND.PURPS,
    cardAccent: COLORS.BRAND.PURPS,
    borders: COLORS.GRAY.G6,
    primaryBackground: COLORS.PRIMARY.LINK_BLUE,
    secondaryBackground: COLORS.GRAY.G8,
    primaryBGHover: COLORS.TEXT.LINK_BLUE_1,
    primaryBGText: COLORS.BRAND.WHITE,
    primaryText: COLORS.GRAY.G2,
    secondaryBGText: COLORS.PRIMARY.LINK_BLUE,
    productCards: {
      overlayBoosterStyles: `
        color: ${COLORS.GRAY.G2};
        background: ${COLORS.BRAND.WHITE};
        left: 8px;
        border-radius: 2px;
      `,
      padding: {
        desktop: '0',
        mobile: '0',
      },
      border: `none`,
      gap: {
        desktop: '2rem',
        mobile: '24px',
      },
      titleFontSettings: {
        desktop: `
          color: ${COLORS.PRIMARY.LINK_BLUE};
          font-size: 32px;
          font-weight: 600;
          line-height: 41px;
        `,
        mobile: `
          font-size: 20px;
          font-weight: 400;
          line-height: 24px;
        `,
      },
      regularFontSettings: {
        desktop: `
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          & p {
            font-weight: 400;
          }
          ul {
            margin-top: 0;
          }
          strong,
          b {
            font-size: 16px;
            line-height: 24px;
            display: inline;
            margin-bottom: 8px;
            margin-top: 32px;
          }
        `,
        mobile: `
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          strong,
          b {
            margin-top: 24px;
          }
        `,
      },
      priceFontSettings: {
        desktop: `
          justify-self: left;
          .tour-scratch-price {
            font-weight: 400;
            color: ${COLORS.GRAY.G3};
            font-size: 12px;
            line-height: 12px;
            span {
              text-decoration: line-through;
              display: block;
            }
          }
          .tour-price {
            font-size: 24px;
            line-height: 24px;
            font-weight: 700;
            color: ${COLORS.GRAY.G2};
          }
        `,
        mobile: ``,
      },
    },
    button: {
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: 600,
    },
    footer: {
      background: COLORS.BRAND.WHITE,
      color: COLORS.GRAY.G3,
      headingColor: COLORS.GRAY.G2,
      secondaryBackground: COLORS.GRAY.G8,
      secondaryColor: COLORS.TEXT.LINK_BLUE_1,
    },
  }),
  [THEMES.DEF_INTERIM]: () => ({
    theme: THEMES.DEF_INTERIM,
    primaryColor: COLORS.BRAND.PURPS,
    secondaryColor: COLORS.TEXT.LINK_BLUE_1,
    primaryAccent: COLORS.TEXT.LINK_BLUE_1,
    secondaryAccent: COLORS.TEXT.PURPS_3,
    cardAccent: COLORS.BRAND.PURPS,
    borders: COLORS.GRAY.G6,
    primaryBackground: COLORS.BRAND.WHITE,
    secondaryBackground: COLORS.GRAY.G8,
    primaryBGHover: COLORS.BACKGROUND.FLOATING_PURPS,
    primaryBGText: COLORS.GRAY.G3,
    primaryText: COLORS.GRAY.G3,
    secondaryBGText: COLORS.PRIMARY.LINK_BLUE_1,
    productCards: {
      styles: {
        desktop: `
          grid-column-gap: 60px;
          align-items: start;
          border-radius: 1rem;
          ${CTAContainer} {
            margin-right: 40px;
          }
        `,
        mobile: `
        grid-column-gap: unset;
        border-radius: 0.75rem;
        .more-details {
          margin: -10px 0;
          padding: 10px 0;
        }
        `,
      },
      nextAvailable: {
        desktop: `
        ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)}
          
          margin-top: 0;
          justify-content: left;
          .available-text {
            color: ${COLORS.GRAY.G3};
          }
          .icon {
            display: none;
            letter-spacing: 0.8px;
          }
        `,
      },
      lineStyles: `
        border: none;
        border-left: 1px dashed ${COLORS.GRAY.G6}; 
        margin: 0;
        margin-left: 12px;
        height: 100%;
      `,
      overlayBoosterStyles: `
        color: ${COLORS.GRAY.G2};
        background: ${COLORS.BRAND.WHITE};
        left: 8px;
        border-radius: 2px;
      `,
      moreDetailsStyle: `
        color: ${COLORS.TEXT.PURPS_3};
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        margin: 0;
        margin-left: 1.2em;
        display: flex;
        align-items: center;
        .chevron {
          vertical-align: middle;
          margin-left: 6px;
          transform-origin: center;
          transform: scale(0.7);
          align-self: flex-end;
        }
        .chevron::before,
        .chevron::after {
          height: 0.13em;
          background: ${COLORS.TEXT.PURPS_3};
        }
        @media(max-width: 768px) {
          .chevron {
            display: inline-block;
            transform: scale(0.6855) rotate(-90deg);
            margin-left: 8px;
            align-self: unset;
          }
          .chevron::before,
          .chevron::after {
            height: 0.13em;
            background: ${COLORS.TEXT.PURPS_3};
          }
        }
      `,
      padding: {
        desktop: '24px',
        mobile: ' 1.375rem 1rem 1rem',
      },
      border: `1px solid ${COLORS.GRAY.G6}`,
      gap: {
        desktop: '2rem',
        mobile: '24px',
      },
      titleFontSettings: {
        desktop: `
          color: ${COLORS.GRAY.G2};
          font-size: 24px;
          line-height: 28px;
          font-weight: 400;
        `,
        mobile: `
            font-weight: 600;
            font-size: 16px;
            line-height: 22px;
        `,
        popupMobile: `
          font-weight: 400;
          font-size: 21px;
          line-height: 27px;
        `,
      },
      regularFontSettings: {
        desktop: `
          font-weight: 400;
          font-size: 15px;
          line-height: 23px;
          & p {
            font-weight: 400;
            margin-bottom: 12px;
          }
          ul {
            margin-top: 0;
          }
          strong,
          b {
            font-size: 16px;
            line-height: 24px;
            display: inline;
            margin-bottom: 8px;
            margin-top: 0;
          }
        `,
        mobile: `
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          h6:first-child {
            margin-top: 0;
          }
          h6 {
            font-size: 24px;
            line-height: 28px;
            font-weight: 400;
            margin: 16px 0;
            margin-top: 32px;
          }
        `,
      },
      priceFontSettings: {
        desktop: `
          justify-self: left;
          .tour-scratch-price {
            font-weight: 400;
            color: ${COLORS.GRAY.G3};
            font-size: 12px;
            line-height: 12px;
            span {
              text-decoration: line-through;
              display: block;
            }
          }
          .tour-price {
            font-size: 24px;
            line-height: 24px;
            font-weight: 600;	
            color: ${COLORS.GRAY.G2};
          }
        `,
        mobile: `
          .tour-scratch-price {
            font-size: 11px;
            line-height: 14px;
          }
          .tour-price {
            font-size: 18px;
          }
          ${SavedTag} {
            padding: 2px 4px;
            font-size: 11px;
          }
        `,
      },
    },
    button: {
      borderRadius: '2px',
      fontSize: '16px',
      fontWeight: 600,
      expandedPosition: 'fixed',
    },
    footer: {
      primaryBackground: COLORS.GRAY.G1,
      primaryColor: COLORS.GRAY.G5,
      primaryHeadingColor: COLORS.BRAND.WHITE,
      primaryLinkColor: COLORS.GRAY.G5,
      primaryLinkHoverColor: COLORS.BRAND.WHITE,
      primarySeparatorColor: COLORS.GRAY.G2,
      secondaryBackground: COLORS.BRAND.WHITE,
      secondaryColor: COLORS.GRAY.G3,
      secondaryHeadingColor: COLORS.GRAY.G2,
      secondaryLinkColor: COLORS.GRAY.G3,
      secondaryLinkHoverColor: COLORS.TEXT.PURPS_3,
      secondarySeparatorColor: COLORS.GRAY.G6,
      lttBackgroundColor: COLORS.BACKGROUND.LTT_INDIGO,
    },
  }),
  get [THEMES.DEFAULT]() {
    return () => this[THEMES.DEF_INTERIM]();
  },
  get [undefined]() {
    return () => this[THEMES.DEF_INTERIM]();
  },
};

export const getAppTheme = (theme = THEMES.DEFAULT) => {
  return themes[theme]();
};

export const greenScheme = ({ colorOverride = '', accentOverride = '' }) => ({
  background: '#F2FDEB',
  color: colorOverride || '#1A4D57',
  accent: accentOverride || '#CDEFD9',
});

export const brownScheme = {
  background: '#FFF8EF',
  color: '#A4563B',
  accent: '#EFE0C2',
};

export const blackScheme = {
  background: '#111111',
  color: '#E2E2E2',
  accent: '#CDEFD9',
};
export const greyScheme = {
  background: COLORS.GRAY.G8,
  color: COLORS.GRAY.G2,
  accent: '#CDEFD9',
};
