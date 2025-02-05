import React from 'react';
import { Text } from '@headout/eevee';
import { populateStringTemplate } from 'components/Espeon/utils/string';
import { discountSliverStyleRecipe } from './styles';
import type { TDiscountSliver } from './types';

export const DiscountSliver = ({ bestDiscount, label }: TDiscountSliver) => {
  const discountSliverStyles = discountSliverStyleRecipe();
  return (
    <div className={discountSliverStyles.container}>
      <Text as="p" className={discountSliverStyles.emoji}>
        🤑
      </Text>
      {populateStringTemplate(label, `${bestDiscount}`)}
    </div>
  );
};
