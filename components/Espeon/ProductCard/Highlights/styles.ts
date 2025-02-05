import { css, sva } from '@headout/pixie/css';

export const highlightsStyle = sva({
  slots: ['root', 'title'],
  base: {
    root: {
      color: 'semantic.text.grey.3',

      '& ul': {
        margin: 0,
        padding: '[0 0 0 1rem]',
      },
      '& li': {
        position: 'relative',
        listStyle: 'none',
        textStyle: 'Semantics/Para/Medium',
        _before: {
          content: '"•"',
          color: 'currentcolor',
          left: '-0.8rem',
          position: 'absolute',
        },
      },
      '& p': {
        textStyle: 'Semantics/Para/Medium',
        margin: 0,
      },
    },
    title: {
      marginBottom: '1rem',
    },
  },
  variants: {
    consumer: {
      default: {
        title: {
          textStyle: 'Semantics/Heading/Small',
        },
      },
    },
  },
  defaultVariants: {
    consumer: 'default',
  },
});

export const highlightsListStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'space.32',
});
