import React from 'react';
import { Text } from '@headout/eevee';
import { cx } from '@headout/pixie/css';
import { descriptorItemStyle } from './styles';
import type { TDescriptorItemProps } from './types';

const DescriptorItem = ({
  descriptor,
  variant,
  showIcon,
}: TDescriptorItemProps) => {
  const { iconUrl, displayName, onMouseEnter, onMouseLeave } = descriptor;
  const styles = descriptorItemStyle({ variant });
  return (
    <div
      className={cx(styles.root)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showIcon && iconUrl && (
        <span className={cx(styles.icon)}>
          {/* TODO: replace with Image component */}
          <img src={iconUrl as string} alt={displayName} />
        </span>
      )}
      <Text as="span" className={cx(styles.label)}>
        {displayName}
      </Text>
      {/* {descriptor.description && (
			<Text as='span' className='subtext'>
				{descriptor.description}
			</Text>
		)} */}
    </div>
  );
};

export default DescriptorItem;
