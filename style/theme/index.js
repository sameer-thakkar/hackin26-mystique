import dynamic from 'next/dynamic';
import { COLORS, SOLEIL } from 'const/ui-constants';
import { THEMES } from 'const/index';
import { SavedTag } from 'UI/PriceBlock';

const CTAContainer = dynamic(() =>
  import('components/Product').then((mod) => mod.CTAContainer)
);

export default {
  [THEMES.MIN_BLUE]: {
    theme: THEMES.MIN_BLUE,
    primaryColor: COLORS.LINK_BLUE,
    secondaryColor: COLORS.LIGHTER_LINK_BLUE,
    primaryAccent: COLORS.OKAY_GREEN,
    secondaryAccent: COLORS.RHAPSODY,
    cardAccent: COLORS.PURPS,
    borders: COLORS.GREY_G6,
    primaryBackground: COLORS.LINK_BLUE,
    secondaryBackground: COLORS.BFF_BLUE,
    primaryBGHover: COLORS.LINK_BLUE_HOVER,
    primaryBGText: COLORS.WHITE,
    primaryText: COLORS.FOUR_BLACK,
    secondaryBGText: COLORS.LINK_BLUE,
    productCards: {
      overlayBoosterStyles: `
        color: ${COLORS.FOUR_BLACK};
        background: ${COLORS.WHITE};
        left: 8px;
        border-radius: 2px;
      `,
      moreDetailsStyle: `
        color: ${COLORS.LINK_BLUE};
        background: ${COLORS.BFF_BLUE};
        padding: 12px 0;
        display: grid;
        grid-template-columns: auto auto;
        grid-gap: 8px;
        margin-left: 0;
        margin-right: 0;
        font-weight: ${SOLEIL.MEDIUM};
        font-size: 14px;
        line-height: 15px;
        justify-content: center;
        .chevron {
          transform: scale(0.6855);
        }
        .chevron::before,
        .chevron::after {
          height: 0.13em;
          background: ${COLORS.LINK_BLUE};
        }
        @media(max-width: 768px) {
          background: none;
          justify-content: left;
        }
      `,
      padding: {
        desktop: '0',
        mobile: '0',
      },
      border: `none`,
      gap: {
        desktop: '54px',
        mobile: '24px',
      },
      titleFontSettings: {
        desktop: `
          color: ${COLORS.LINK_BLUE};
          font-size: 32px;
          font-weight: ${SOLEIL.SEMIBOLD};
          line-height: 41px;
        `,
        mobile: `
          font-size: 20px;
          font-weight: ${SOLEIL.REGULAR};
          line-height: 24px;
        `,
      },
      regularFontSettings: {
        desktop: `
          font-weight: ${SOLEIL.REGULAR};
          font-size: 16px;
          line-height: 24px;
          & p {
            font-weight: ${SOLEIL.REGULAR};
          }
          ul {
            margin-top: 0;
          }
          strong,
          b {
            font-size: 16px;
            line-height: 24px;
            display: block;
            margin-bottom: 8px;
            margin-top: 32px;
          }
        `,
        mobile: `
          font-weight: ${SOLEIL.REGULAR};
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
            font-weight: ${SOLEIL.REGULAR};
            color: ${COLORS.GREY_G4};
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
            font-weight: ${SOLEIL.BOLD};
            color: ${COLORS.FOUR_BLACK};
          }
        `,
        mobile: ``,
      },
    },
    button: {
      borderRadius: '4px',
      fontSize: '16px',
      fontFamily: SOLEIL.FONT_STACK,
      fontWeight: SOLEIL.BOLD,
    },
    footer: {
      background: COLORS.WHITE,
      color: COLORS.GREY_G3,
      headingColor: COLORS.FOUR_BLACK,
      secondaryBackground: COLORS.GREY.G8,
      secondaryColor: COLORS.RHAPSODY,
    },
  },
  [THEMES.DEF_INTERIM]: {
    theme: THEMES.DEF_INTERIM,
    primaryColor: COLORS.RHAPSODY,
    secondaryColor: COLORS.LIGHTER_LINK_BLUE,
    primaryAccent: COLORS.LIGHTER_LINK_BLUE,
    secondaryAccent: COLORS.RHAPSODY,
    cardAccent: COLORS.PURPS,
    borders: COLORS.GREY_G6,
    primaryBackground: COLORS.WHITE,
    secondaryBackground: COLORS.BFF_BLUE,
    primaryBGHover: COLORS.WHITE,
    primaryBGText: COLORS.GREY_G3,
    primaryText: COLORS.GREY_G3,
    secondaryBGText: COLORS.LINK_BLUE,
    productCards: {
      styles: {
        desktop: `
          grid-column-gap: 75px;
          align-items: start;
          border-radius: 8px;
          ${CTAContainer} {
            margin-right: 40px;
          }
        `,
        mobile: `
        grid-column-gap: unset;
        .more-details {
          margin: -10px 0;
          padding: 10px 0;
        }
        `,
      },
      nextAvailable: {
        desktop: `
          text-transform: uppercase;
          font-weight: 500;
          font-size: 10px;
          margin-top: 0;
          line-height: 10px;
          letter-spacing: 0.6px;
          justify-content: left;
          .available-text {
            color: ${COLORS.GREY_G3};
          }
          .icon {
            display: none;
            letter-spacing: 0.8px;
          }
        `,
        mobile: `
          margin-top: -16px;
        `,
      },
      lineStyles: `
        border: none;
        border-left: 1px dashed ${COLORS.GREY_G6}; 
        margin: 0;
        margin-left: 12px;
        height: 100%;
      `,
      overlayBoosterStyles: `
        color: ${COLORS.FOUR_BLACK};
        background: ${COLORS.WHITE};
        left: 8px;
        border-radius: 2px;
      `,
      moreDetailsStyle: `
        color: ${COLORS.RHAPSODY};
        font-weight: ${SOLEIL.REGULAR};
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
          background: ${COLORS.RHAPSODY};
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
            background: ${COLORS.RHAPSODY};
          }
        }
      `,
      padding: {
        desktop: '24px',
        mobile: ' 22px 16px',
      },
      border: `1px solid ${COLORS.GREY_G6}`,
      gap: {
        desktop: '54px',
        mobile: '24px',
      },
      titleFontSettings: {
        desktop: `
          color: ${COLORS.GREY.G2};
          font-size: 24px;
          line-height: 28px;
          font-weight: ${SOLEIL.REGULAR};
        `,
        mobile: `
            font-weight: ${SOLEIL.SEMIBOLD};
            font-size: 16px;
            line-height: 22px;
        `,
      },
      regularFontSettings: {
        desktop: `
          font-weight: ${SOLEIL.REGULAR};
          font-size: 15px;
          line-height: 23px;
          & p {
            font-weight: ${SOLEIL.REGULAR};
            margin-bottom: 12px;
          }
          ul {
            margin-top: 0;
          }
          strong,
          b {
            font-size: 16px;
            line-height: 24px;
            display: block;
            margin-bottom: 8px;
            margin-top: 0;
          }
        `,
        mobile: `
          font-weight: ${SOLEIL.REGULAR};
          font-size: 14px;
          line-height: 20px;
          h6:first-child {
            margin-top: 0;
          }
          h6 {
            font-size: 24px;
            line-height: 28px;
            font-weight: ${SOLEIL.REGULAR};
            margin: 16px 0;
            margin-top: 32px;
          }
        `,
      },
      priceFontSettings: {
        desktop: `
          justify-self: left;
          .tour-scratch-price {
            font-weight: ${SOLEIL.REGULAR};
            color: ${COLORS.GREY_G4};
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
            font-weight: ${SOLEIL.SEMIBOLD};	
            color: ${COLORS.GREY_G3};
          }
        `,
        mobile: `
          margin-top: -8px;
          .tour-scratch-price {
            font-size: 11px;
            line-height: 14px;
          }
          .tour-price {
            font-size: 18px;
            line-height: 16px;
            font-weight: ${SOLEIL.REGULAR};
          }
          ${SavedTag} {
            padding: 0 4px;
            font-size: 11px;
            color: ${COLORS.OKAY_GREEN};
          }
        `,
      },
    },
    button: {
      borderRadius: '2px',
      fontSize: '16px',
      fontFamily: SOLEIL.FONT_STACK,
      fontWeight: SOLEIL.BOLD,
      expandedPosition: 'fixed',
    },
    footer: {
      background: COLORS.BLACK,
      color: COLORS.WHITE,
      headingColor: COLORS.WHITE,
      secondaryBackground: COLORS.WHITE,
      secondaryColor: COLORS.BEACH,
    },
  },
  get [THEMES.DEFAULT]() {
    return this[THEMES.DEF_INTERIM];
  },
  get [undefined]() {
    return this[THEMES.DEF_INTERIM];
  },
};

export const greenScheme = {
  background: '#F2FDEB',
  color: '#1A4D57',
  accent: '#CDEFD9',
};

export const brownScheme = {
  background: '#FFF8EF',
  color: '#A4563B',
  accent: '#EFE0C2',
};
