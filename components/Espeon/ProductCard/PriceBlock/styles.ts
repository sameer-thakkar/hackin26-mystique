import { sva } from '@headout/pixie/css';

export const priceBlockStyles = sva({
  slots: [
    'priceBlockWrapper',
    'scratchPrice',
    'priceContainer',
    'tourPrice',
    'savedTag',
  ],
  base: {
    priceBlockWrapper: {
      display: 'flex',
      flexDir: 'column',
      textTransform: 'camelcase',
      width: 'max-content',
    },
    scratchPrice: {
      color: 'semantic.text.grey.3',
    },
    priceContainer: {
      display: 'flex',
      gap: 'space.4',
    },
    tourPrice: {
      marginRight: 'space.4',
    },
    savedTag: {
      padding: 'token(spacing.space.2) token(spacing.space.4)',
      alignSelf: 'center',
      marginTop: 'space.1',
      whiteSpace: 'nowrap',
      borderRadius: 'radius.2',
      width: 'fit-content',
      textStyle: 'Semantics/Tags/Regular',
    },
  },
  variants: {
    consumer: {
      productCard: {
        priceBlockWrapper: {
          gap: 'space.2',
        },
        scratchPrice: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 'space.4',
          color: 'semantic.text.grey.3',
          textStyle: 'Semantics/UI Label/Small',
        },
        tourPrice: {
          marginRight: 'unset',
        },
        priceContainer: {
          alignItems: 'center',
          '& span': {
            textStyle: 'Semantics/UI Label/Large (Heavy)',
            color: 'semantic.text.grey.1',
          },

          '@media screen and (max-width: 768px)': {
            '& span': {
              textStyle: 'Semantics/UI Label/Large (Heavy)',
            },
          },
        },
        savedTag: {
          textStyle: 'Semantics/UI Label/Small (Heavy)',
        },
      },
      highlightsModal: {
        priceBlockWrapper: {
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridColumnGap: 'unset',
          gridTemplateRows: 'repeat(2, max-content)',
        },
        priceContainer: {
          justifySelf: 'end',
          color: 'semantic.text.grey.2',
        },
        scratchPrice: {
          display: 'flex',
          gap: '4px',
          textStyle: 'Semantics/UI Label/Small',
          color: 'semantic.text.grey.3',
          justifySelf: 'end',
        },
        tourPrice: {
          textStyle: 'Semantics/Heading/Small',
          marginRight: 0,
        },
      },
    },
    labelStyle: {
      heading: {
        priceContainer: {
          '& span > span': {
            textStyle: 'Semantics/Heading/Regular',
            '@media only screen and (min-width: 768px)': {
              textStyle: 'Semantics/Heading/Medium',
            },
          },
        },
      },
    },
    isDummy: {
      true: {
        scratchPrice: {
          visibility: 'hidden',
        },
      },
    },
  },
});
