import { TProductDescriptors } from 'components/Product/interface';

export type THorizontalDescriptors = Pick<
  TProductDescriptors,
  'minDuration' | 'maxDuration' | 'lang' | 'isMobile' | 'descriptorArray'
> & { modifyAudioGuideDescriptor?: boolean };
