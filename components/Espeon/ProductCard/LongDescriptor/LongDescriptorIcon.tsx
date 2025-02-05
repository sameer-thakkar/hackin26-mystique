import React from 'react';
import { EDescriptorCode } from '../Descriptor/types';
// import type { TDescriptorIcon } from 'components/Espeon/ProductCard/components/Descriptor/types';
import { descriptorIcons } from './constants';

const DescriptorIcon = ({
  descriptorCode,
}: {
  descriptorCode: EDescriptorCode;
}) => {
  const Icon = descriptorCode ? descriptorIcons?.[descriptorCode] : null;
  if (!Icon) return null;
  return <Icon />;
};

export default DescriptorIcon;
