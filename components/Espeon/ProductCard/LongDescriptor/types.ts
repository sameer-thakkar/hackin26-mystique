import type { EDescriptorCode } from 'components/Espeon/ProductCard/Descriptor/types';
import type { TClassName } from 'components/Espeon/types';

export type TLongDescriptor = TClassName & {
  code: EDescriptorCode;
  label: string;
  subtext?: string;
  background?: string;
};
