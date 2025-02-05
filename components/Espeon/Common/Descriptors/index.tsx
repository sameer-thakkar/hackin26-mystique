import React, { useMemo } from 'react';
import { Text } from '@headout/eevee';
import { css, cx } from '@headout/pixie/css';
import DescriptorItem from './components/DescriptorItem';
import { descriptorListStylesRecipe } from './styles';
import type { TDescriptorsProps } from './types';

export const Descriptors = ({
  descriptors,
  variant,
  layout,
  isMobile = false,
  displayLimit,
  overrideStyles,
  // lang,
  showSpacer = false,
  showMoreLabel = 'Show More',
  showMore = false,
}: TDescriptorsProps) => {
  const limitedDescriptors = useMemo(() => {
    if (displayLimit && !isMobile) {
      return descriptors.slice(0, displayLimit);
    }
    return descriptors;
  }, [descriptors, displayLimit, isMobile]);

  const shouldShowMore =
    showMore && !isMobile && displayLimit && descriptors.length > displayLimit;

  const styles = descriptorListStylesRecipe({
    layout,
    variant,
    isMobile,
  });

  return (
    <div className={cx(styles.root, css(overrideStyles))}>
      {limitedDescriptors.map((descriptor, index) => (
        <>
          <DescriptorItem
            key={descriptor.code + index}
            descriptor={descriptor}
            variant={variant}
            showIcon={variant === 'long'}
          />
          {index < descriptors.length - 1 && showSpacer && layout === 'row' && (
            <span className={styles.spacer}></span>
          )}
        </>
      ))}
      {shouldShowMore && (
        <Text as="span" className="show-more-label">
          {showMoreLabel}
        </Text>
      )}
    </div>
  );
};
