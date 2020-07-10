import { COLORS, SOLEIL } from '../../constants/ui-constants';
import { THEMES } from 'constants/index';

export default {
  [THEMES.DEFAULT]: {
    theme: THEMES.DEFAULT,
    primaryColor: COLORS.RHAPSODY,
    primaryBackground: COLORS.WHITE,
    cardAccent: COLORS.TEAL,
    productCards: {
      padding: {
        desktop: '32px 24px',
        mobile: ' 24px 16px',
      },
      overlayBoosterStyles: `
        color: ${COLORS.WHITE};
        background: ${COLORS.ETHER};
      `,
      border: `1px solid ${COLORS.GREY_G6}`,
      tittleColor: COLORS.FOUR_BLACK,
      gap: '24px',
      accentColor: COLORS.MED_SLATE_BLUE,
      accentBackground: COLORS.WHITE,
      moreDetailsStyle: `
        color: ${COLORS.MED_SLATE_BLUE};
      `,
      titleFontSettings: {
        desktop: `
          font-weight: ${SOLEIL.MEDIUM};
          font-size: 24px;
          line-height: 41px;
        `,
        mobile: `
        `,
      },
      regularFontSettings: {
        desktop: `
          font-weight: ${SOLEIL.REGULAR};
          font-size: 16px;
          line-height: 24px;
        `,
        mobile: `
          line-height: 22px;
        `,
      },
      priceFontSettings: {
        desktop: `
          .tour-scratch-price {
            font-weight: ${SOLEIL.REGULAR};
            color: ${COLORS.GREY_G4};
            font-size: 11px;
            line-height: 12px;
            span {
              text-decoration: line-through;
              display: block;
            }
          }
          .tour-price {
            font-size: 25px;
            line-height: 32px;
            font-weight: ${SOLEIL.MEDIUM};
            color: ${COLORS.FOUR_BLACK};
          }
        `,
        mobile: `
          .tour-scratch-price {
            font-size: 11px;
            line-height: 12px;
          }
          .tour-price {
            font-size: 20px;
            line-height: 24px;
          }
        `,
      },
    },
    button: {
      borderRadius: '4px',
      fontSize: '16px',
      fontFamily: SOLEIL.FONT_STACK,
      fontWeight: SOLEIL.BOLD,
    },
    footer: {
      background: COLORS.BLACK,
      color: COLORS.WHITE,
      headingColor: COLORS.FOUR_BLACK,
      secondaryBackground: COLORS.WHITE,
      secondaryColor: COLORS.BEACH,
    },
  },
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
      gap: '54px',
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
};

export const greenScheme = {
  background: '#F2FDEB',
  color: '#1A4D57',
};

export const brownScheme = {
  background: '#FFF8EF',
  color: '#A4563B',
};
