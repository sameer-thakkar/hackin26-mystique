import React from 'react';
import { descriptorIcons } from './constants';
import type { TDescriptorIcon } from './types';

const DescriptorIcon = ({ descriptorCode }: TDescriptorIcon) => {
  const Icon = descriptorCode ? descriptorIcons?.[descriptorCode] : null;
  if (!Icon) return null;
  return <Icon />;
};

export default DescriptorIcon;
