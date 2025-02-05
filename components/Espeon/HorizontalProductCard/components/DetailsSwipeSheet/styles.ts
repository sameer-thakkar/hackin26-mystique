import { sva } from '@headout/pixie/css';
import type { SystemStyleObject } from '@headout/pixie/types';

const ctaButtonPseudoStyles: SystemStyleObject = {
  content: `' '`,
  display: 'inline-block',
  width: '100%',
  wordBreak: 'break-all',
};

export const swipesheetStylesRecipe = sva({
  slots: [
    'root',
    'header',
    'content',
    'footer',
    'footerBlock',
    'pricingUnit',
    'ctaContainer',
    'ctaButton',
  ],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      width: '[100%]',
      background: 'core.primary.white',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      background: 'core.primary.white',
      padding: 'space.16',
      marginTop: 'space.8',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 10000,
      width: '[100vw]',
      boxSizing: 'border-box',
      borderBottom: '[1px solid token(colors.semantic.dividers.dark)]',
      justifyContent: 'space-between',
      '& button': {
        background: 'transparent',
        border: 'none',
      },
    },
    content: {
      maxHeight: '[calc(90vh - 8.25rem)]',
      marginTop: '[3.8rem]',
      marginBottom: '[5.25rem]',
      padding: 'space.16',
      overflow: 'scroll',
    },
    footer: {
      position: 'fixed',
      width: '[100%]',
      bottom: 0,
      background: 'semantic.surface.light.white',
    },
    footerBlock: {
      padding:
        '[token(spacing.space.12) token(spacing.space.16) token(spacing.space.20)]',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      columnGap: 'space.12',
    },
    pricingUnit: {
      flexGrow: 1,
    },
    ctaContainer: {
      flexGrow: 1,
    },
    ctaButton: {},
  },
  variants: {
    isDiscounted: {
      true: {
        content: {
          marginBottom: '[6.5rem]',
        },
      },
      false: {
        footerBlock: {
          boxShadow: '[0px -2px 12px 0px #0000001A]',
        },
      },
    },
    isExperienceCta: {
      true: {
        ctaButton: {
          padding: '[token(spacing.space.6) token(spacing.space.16)]',

          '& span': {
            fontSize: 'font.size.14',
            lineHeight: 'lh.16',
          },
          _before: ctaButtonPseudoStyles,
          _after: ctaButtonPseudoStyles,
        },
      },
    },
  },
});
