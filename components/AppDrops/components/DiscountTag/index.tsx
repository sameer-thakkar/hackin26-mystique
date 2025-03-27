import React from 'react';
import { Text } from '@headout/eevee';
import { DROPS_LOGO_URL } from 'components/AppDrops/constants';
import { TDiscountTagProps } from 'components/AppDrops/types';
import Image from 'UI/Image';
import { strings } from 'const/strings';
import { discountTagRecipe } from './styles';

export const DiscountTag = ({
  isMobile = false,
  variant,
}: TDiscountTagProps) => {
  const styles = discountTagRecipe(variant);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tag}>
        <Text
          as="span"
          textStyle={
            isMobile
              ? 'Semantics/Subheading/Regular'
              : 'Semantics/UI Label/Large (Heavy)'
          }
        >
          {strings.DROPS.DISCOUNT_TAG}
        </Text>
        <div className={styles.logo}>
          <Image url={DROPS_LOGO_URL} alt="drops-logo" />
        </div>
      </div>
    </div>
  );
};
