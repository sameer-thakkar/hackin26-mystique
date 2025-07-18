import React from 'react';
import { Text } from '@headout/eevee';
import { DROPS_IMAGE_URLS } from 'components/AppDrops/constants';
import { TDiscountTagProps } from 'components/AppDrops/types';
import Image from 'UI/Image';
import useWindowWidth from 'hooks/useWindowWidth';
import { strings } from 'const/strings';
import { discountTagRecipe, headerLogoContainer, onText } from './styles';

export const DiscountTag = ({ variant }: TDiscountTagProps) => {
  const styles = discountTagRecipe(variant);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth !== undefined && windowWidth < 768;

  return (
    <div className={styles.wrapper}>
      <div className={styles.tag}>
        <div className={headerLogoContainer}>
          <div className={styles.dropsLogo}>
            <Image
              url={DROPS_IMAGE_URLS.DROPS_LOGO}
              alt="Drops Logo"
              width={isMobile ? 52 : 68}
              height={isMobile ? 15 : 20}
              quality={100}
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
              width={isMobile ? 80 : 120}
              height={isMobile ? 12 : 18}
              quality={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
