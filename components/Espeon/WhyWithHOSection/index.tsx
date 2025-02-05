import React, { type FC } from 'react';
import { Text } from '@headout/eevee';
import { css } from '@headout/pixie/css';
import { WhyWithHOItem } from './components/WhyWithHOItem';
import { whyWithHORecipe } from './styles';
import type { TWhyWithHoProps } from './types';

export const WhyWithHOSection: FC<TWhyWithHoProps> = ({
  items,
  isDesktop = true,
  title,
  overrideStyles = {},
}) => {
  const styles = whyWithHORecipe.raw({ isDesktop });

  return (
    <div className={css(styles.root, overrideStyles.root)}>
      {title && (
        <Text className={css(styles.title, overrideStyles.title)}>{title}</Text>
      )}
      <div className={css(styles.container, overrideStyles.itemsContainer)}>
        {items.map((item, index) => (
          <WhyWithHOItem key={index} item={item} isDesktop={isDesktop} />
        ))}
      </div>
    </div>
  );
};
