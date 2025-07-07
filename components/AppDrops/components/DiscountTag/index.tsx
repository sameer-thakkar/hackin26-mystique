import React from 'react';
import { Text } from '@headout/eevee';
import { DROPS_IMAGE_URLS } from 'components/AppDrops/constants';
import { TDiscountTagProps } from 'components/AppDrops/types';
import Image from 'UI/Image';
import { strings } from 'const/strings';
import { discountTagRecipe, headerLogoContainer, onText } from './styles';

export const DiscountTag = ({ variant }: TDiscountTagProps) => {
  const styles = discountTagRecipe(variant);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tag}>
        <div className={headerLogoContainer}>
          <div>
            <Image
              url={DROPS_IMAGE_URLS.DROPS_LOGO}
              alt="Drops Logo"
              width={68}
              height={20}
            />
          </div>
          <div>
            <Text className={onText} color="semantic.text.grey.1">
              {strings.DROPS.ON}
            </Text>
          </div>
          <div>
            <Image
              url={DROPS_IMAGE_URLS.HEADOUT_LOGO}
              alt="Headout Logo"
              width={120}
              height={18}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
