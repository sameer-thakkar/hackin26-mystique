import { sva } from '@headout/pixie/css';
import { EStopLabelType } from 'components/common/Itinerary/StopLabel/types';

export const stopLabelStylesRecipe = sva({
  slots: ['root', 'text'],
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'radius.6',
      padding:
        'token(spacing.space.4) token(spacing.space.8) token(spacing.space.6)',
      background: 'core.purps.700',
    },
    text: {
      letterSpacing: 'ls.4',
      textTransform: 'uppercase',
    },
  },
  variants: {
    type: {
      [EStopLabelType.Stop]: {
        root: {
          background: 'core.purps.700',
          boxShadow: '[0px -1.5px 1px 0px #FFFFFF4D inset]',
        },
      },
      [EStopLabelType.PassBy]: {
        root: {
          background: 'core.grey.900',
          boxShadow: '[0px -1.5px 1px 0px #FFFFFF33 inset]',
        },
      },
    },
  },
});
