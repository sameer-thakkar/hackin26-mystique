import ShieldTick from 'components/Espeon/Assets/ShieldTick';
import { DESCRIPTORS } from 'components/Espeon/ProductCard/constants';
import type { EDescriptorCode } from 'components/Espeon/ProductCard/Descriptor/types';

export const descriptorIcons: Partial<
  Record<EDescriptorCode, React.ComponentType<any>>
> = {
  [DESCRIPTORS.FREE_CANCELLATION]: ShieldTick,
};
