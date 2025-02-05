import type { TDescriptorItem } from '../../types';

export type TDescriptorItemProps = {
  descriptor: TDescriptorItem;
  variant: 'short' | 'long';
  showIcon: boolean;
};
