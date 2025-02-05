import React from 'react';
import { Text } from '@headout/eevee';
import { cx } from '@headout/pixie/css';
import DescriptorIcon from './LongDescriptorIcon';
import { descriptorIcon, descriptorInfoStyles, longDescriptor } from './styles';
import type { TLongDescriptor } from './types';

const LongDescriptor = ({
  code,
  label,
  subtext = '',
  background,
}: TLongDescriptor) => {
  return (
    <div className={longDescriptor}>
      <div className={cx(descriptorIcon, background)}>
        <DescriptorIcon descriptorCode={code} />
      </div>

      <div className={descriptorInfoStyles}>
        <Text
          as="h3"
          textStyle="Semantics/UI Label/Regular (Heavy)"
          color="semantic.text.grey.2"
        >
          {label}
        </Text>

        <Text textStyle="Semantics/UI Label/Small" color="semantic.text.grey.3">
          {subtext}
        </Text>
      </div>
    </div>
  );
};

export default LongDescriptor;
