import { sva } from '@headout/pixie/css';

export const groupBookingCtaRecipe = sva({
  slots: ['root', 'title', 'subtext', 'link', 'svg', 'gradient'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'core.primary.white',
      border: '1px solid token(colors.core.grey.200)',
      borderRadius: 'radius.16',
      padding: 'space.16',
      marginTop: 'space.16',
      position: 'relative',
      overflow: 'hidden',
    },
    title: {
      textStyle: 'heading.regular',
      color: 'core.grey.800',
      textAlign: 'left',
      marginBottom: 'space.4',
    },
    subtext: {
      textStyle: 'para.regular',
      color: 'core.grey.700',
      textAlign: 'left',
      marginBottom: 'space.6',
    },
    link: {
      color: 'core.grey.800',
      '& span': {
        textStyle: 'cta.small',
      },
    },
    svg: { position: 'absolute', bottom: 0, right: ['7.4px'], zIndex: 1 },
    gradient: {
      position: 'absolute',
      width: '[169px]',
      height: ['169px'],
      background: 'rgba(180, 255, 198, 0.16)',
      filter: 'blur(114px)',
      borderRadius: 'radius.50p',
      bottom: '[-130px]',
      right: '[-23px]',
    },
  },
});
