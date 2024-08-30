import { defineGlobalStyles } from '@pandacss/dev';

export const globalStyles = defineGlobalStyles({
  '*': {
    outline: 'none',
    MozOsxFontSmoothing: 'grayscale',
    WebkitFontSmoothing: 'antialiased',
  },
  'html, body': {
    margin: 0,
    padding: 0,
    fontFamily: "'halyard-text', sans-serif",
  },
  body: { scrollBehavior: 'smooth' },
  a: { textDecoration: 'none', color: '#e5006e' },
  'b, strong': { fontWeight: 500 },
  '.table-wrapper::-webkit-scrollbar': { height: '5px' },
  '.table-wrapper::-webkit-scrollbar-thumb': {
    backgroundColor: '#c4c4c4',
    borderRadius: '100px',
  },
  'li, span, p, td, div': { color: '#444' },
  'h1 > strong, h2 > strong, h3 > strong, h4 > strong, h5 > strong, h6 > strong':
    {
      fontWeight: 500,
      color: '#444444',
    },
  'h1, h2, h3, h4, h5, h6': { fontWeight: 500, color: '#444444' },
  '.content-page-container': { maxWidth: '1190px', margin: 'auto' },
  '.main-wrapper, .slice-wrapper': {
    maxWidth: '1200px',
    padding: '0 5.46vw',
    margin: 'auto',
    width: 'calc(100% - (5.46vw * 2))',
  },
  '.content-wrapper': { marginTop: '90px' },
  'body.scroll-lock': { overflow: 'hidden !important' },
  '.slice-wrapper.ugc_carousel': {
    overflowX: 'hidden',
    backgroundColor: '#f8f6ff',
    maxWidth: 'calc(100% - 132px) !important',
  },
  '.slice-wrapper.slice-block.table_v3': { overflowX: 'auto' },
  '.slice-wrapper.automated_comparison_table': {
    width: '100%',
    maxWidth: 'unset',
    padding: 0,
  },
  '.scroll-blur': { filter: 'blur(2.5rem)' },
  '@media (max-width: 768px)': {
    '.slice-wrapper.ugc_carousel': {
      maxWidth: 'unset !important',
      overflowX: 'hidden',
      padding: '0 0 0 16px !important',
      width: 'calc(100vw - 16px) !important',
    },
    '.main-wrapper': { padding: '0 16px' },
    'body.scroll-lock-without-overlay': { overflow: 'hidden' },
    'body.scroll-lock-without-overlay #body-wrap::after': {
      content: "''",
      position: 'absolute',
      height: '100%',
      width: '100%',
      top: 0,
      zIndex: 16,
    },
    'body.scroll-lock #body-wrap::after': {
      content: "''",
      position: 'absolute',
      height: '100%',
      width: '100%',
      top: 0,
      opacity: 0.7,
      zIndex: 16,
      backgroundColor: '#222222',
    },
    'body.scroll-lock.no-shadow #body-wrap::after': { content: 'unset' },
    '.slice-wrapper.slice-block': {
      padding: '0 16px',
      width: 'calc(100vw - 32px)',
    },
    '.main-wrapper, .slice-wrapper': { padding: 0, width: '100%' },
    '.slice-wrapper.unspace + .slice-wrapper': { marginTop: '-52px' },
    '.slice-wrapper + .slice-wrapper.unspace + .slice-wrapper': {
      marginTop: '-104px',
    },
    '.swiper-wrapper': { gridTemplateColumns: '1fr' },
  },
  '.slice-wrapper.anchor_point + .slice-wrapper': { marginTop: '-60px' },
  '.slice-wrapper.unspace + .slice-wrapper, .slice-wrapper.unspace + .slice-block':
    {
      marginTop: '-72px',
    },
  '.slice-wrapper + .slice-wrapper.unspace + .slice-wrapper': {
    marginTop: '-144px',
  },
  '.slice-wrapper:empty': { display: 'none' },
  '.swiper-pagination.swiper-pagination-bullets': {
    position: 'absolute',
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: '5px',
    bottom: '18px',
  },
  '.swiper-container': { width: '100%' },
  '.swiper-pagination-custom, .swiper-pagination-fraction': { width: 'unset' },
  'span.swiper-pagination-bullet': {
    background: '#ffffffa1 !important',
    opacity: '1 !important',
  },
  'span.swiper-pagination-bullet-active': {
    background: '#fff !important',
  },
  '.hidden': { display: 'none' },
});
