import { sva } from '@headout/pixie/css';

export const localisedPriceStyles = sva({
  slots: ['localisedPricePrefix', 'localisedPriceStrikeThrough'],
  base: {
    localisedPricePrefix: {
      textStyle: 'Semantics/UI Label/Small',
    },
    localisedPriceStrikeThrough: {
      textStyle: 'Semantics/UI Label/Strike/Small',
      color: 'semantic.text.grey.3',
      display: 'flex',
      alignItems: 'center',
    },
  },
  variants: {
    tourPriceconsumer: {
      customLinkedTour: {
        localisedPriceStrikeThrough: {
          color: 'semantic.text.grey.2',
          textStyle: 'Semantics/Subheading/Large',
          fontWeight: 'font.weight.600',
        },
      },
      shortCode: {
        localisedPriceStrikeThrough: {
          fontSize: 'inherit',
          color: 'inherit',
          fontWeight: 'inherit',
        },
      },
      productCard: {
        localisedPriceStrikeThrough: {
          textStyle: 'Semantics/UI Label/Large (Heavy)',
        },
      },
    },
    tourScratchPriceconsumer: {
      microbrandCard: {
        localisedPriceStrikeThrough: {
          color: 'gray.g2',
        },
      },
    },
  },
});
