import React, { useMemo } from 'react';
import { Text } from '@headout/eevee';
import { cx } from '@headout/pixie/css';
import { categoryLabelStyles } from './styles';
import type { TMetaLabel } from './types';
import { isValidCategoryToShowLabel } from './utils';

const MetaLabel = ({
  primaryCategory,
  primarySubCategory,
  className,
  metaLabel,
}: TMetaLabel) => {
  const finalLabel = useMemo(() => {
    if (metaLabel) return metaLabel;

    if (!primaryCategory || !primarySubCategory) return null;

    const isCategoryLabel = isValidCategoryToShowLabel({
      primaryCategory,
      primarySubCategory,
    });

    const { displayName } = isCategoryLabel
      ? primaryCategory
      : primarySubCategory;

    return displayName;
  }, [metaLabel, primaryCategory, primarySubCategory]);

  if (!finalLabel) return null;

  const { root: rootStyle, label } = categoryLabelStyles();

  return (
    <div className={cx(rootStyle, className)}>
      <Text
        as="span"
        className={label}
        // @TODO: text component fix awaiting.
        // textStyle='Semantics/UI Label/Medium'
        // color='semantic.text.grey.1'
      >
        {finalLabel}
      </Text>
    </div>
  );
};

export default MetaLabel;
