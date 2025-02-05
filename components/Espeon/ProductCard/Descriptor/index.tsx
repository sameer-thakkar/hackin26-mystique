import React from 'react';
import { Text } from '@headout/eevee';
import { cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import DescriptorIcon from './DescriptorIcon';
import { descriptorWrapperStyle } from './styles';
import type { TDescriptor } from './types';

const Descriptor = ({
  code,
  className,
  label = '',
  variant,
  showIcon = true,
  onMouseEnter,
  onMouseLeave,
}: TDescriptor) => {
  if (!code) return null;
  const showDescriptorIcon = !!(code && showIcon);
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cx(descriptorWrapperStyle({ consumer: variant }), className)}
    >
      <Conditional if={showDescriptorIcon}>
        {showIcon === true ? (
          <DescriptorIcon descriptorCode={code} />
        ) : typeof showIcon === 'string' ? (
          // TODO: Use icons from URL
          <div style={{}} />
        ) : null}
      </Conditional>

      <Text as="span">{label}</Text>
    </div>
  );
};

export default Descriptor;
