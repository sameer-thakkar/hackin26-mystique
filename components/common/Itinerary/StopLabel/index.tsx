import React from 'react';
import { Text } from '@headout/eevee';
import { stopLabelStylesRecipe } from 'components/common/Itinerary/StopLabel/styles';
import type { TStopLabelProps } from 'components/common/Itinerary/StopLabel/types';

const StopLabel = ({ labelText, type }: TStopLabelProps) => {
  const stopLabelStyles = stopLabelStylesRecipe({ type });

  return (
    <div className={stopLabelStyles.root}>
      <Text
        textStyle={'tags.regular'}
        color={'core.primary.white'}
        className={stopLabelStyles.text}
        as={'h6'}
      >
        {labelText}
      </Text>
    </div>
  );
};

export default StopLabel;
