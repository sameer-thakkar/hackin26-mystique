import type { DescriptorSize } from '../../types';

export type DescriptorProps = {
  icon?: JSX.Element | null;
  text?: string;
  size?: DescriptorSize;
  color?: string;
  bold?: boolean;
  url?: string;
  dataQAMarker?: string;
};
