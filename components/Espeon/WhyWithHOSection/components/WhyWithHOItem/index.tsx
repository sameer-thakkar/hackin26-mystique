import React, { type FC } from 'react';
import { Text } from '@headout/eevee';
import { css } from '@headout/pixie/css';
import Image from 'components/UI/Image';
import { whyWithHOItemRecipe } from './styles';
import type { TWhyWithHoItemProps } from './types';

function getImageDimensions(isDesktop: boolean) {
  return isDesktop ? { height: 90, width: 90 } : { height: 72, width: 72 };
}

export const WhyWithHOItem: FC<TWhyWithHoItemProps> = ({ item, isDesktop }) => {
  const { title, description, image } = item;
  const styles = whyWithHOItemRecipe.raw({ isDesktop });

  const imageDimensions = getImageDimensions(isDesktop);

  return (
    <div className={css(styles.root)}>
      <Image
        height={imageDimensions.height}
        width={imageDimensions.width}
        url={image.url}
        alt={image.alt}
        className={css(styles.image)}
      />
      <Text className={css(styles.title)}>{title}</Text>
      <Text className={css(styles.description)}>{description}</Text>
    </div>
  );
};
