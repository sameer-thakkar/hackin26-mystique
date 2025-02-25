import React from 'react';
import { Text } from '@headout/eevee';
import { css } from '@headout/pixie/css';
import { strings } from 'constants/strings';
import { collectionHeaderMobileRecipe } from './styles';

const CollectionHeaderMobile = (props: any) => {
  const { collection } = props;
  if (!collection) return null;

  const { pageTitle } = collection;

  const styles = collectionHeaderMobileRecipe.raw();

  return (
    <>
      <div className={css(styles.root)}>
        <Text as="h1" className={css(styles.header)}>
          {pageTitle}
        </Text>
        <Text as="p" className={css(styles.subtext)}>
          {strings.DAY_TRIPS.BANNER.SUBTEXT}
        </Text>
      </div>
    </>
  );
};

export default CollectionHeaderMobile;
