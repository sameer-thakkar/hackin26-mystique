import type { SystemStyleObject } from '@headout/pixie/types';
import type { TWhyWithHoItem } from './components/WhyWithHOItem/types';

export type TWhyWithHoProps = {
  items: TWhyWithHoItem[];
  isDesktop?: boolean;
  title?: string;
  overrideStyles?: {
    root?: SystemStyleObject;
    title?: SystemStyleObject;
    itemsContainer?: SystemStyleObject;
  };
};
