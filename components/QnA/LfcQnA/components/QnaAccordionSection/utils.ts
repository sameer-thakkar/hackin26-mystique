import { ACCORDION_DWEB_SCROLL_THRESHOLD } from '../../constants';
import { scrollToElement } from '../../utils';
import { TScrollWrapperProps } from './types';

export const scrollToElementWrapper = ({
  scrollableWrapperRef,
  dashedQnaType,
  ...props
}: TScrollWrapperProps) => {
  const wrapper = scrollableWrapperRef?.current;

  if (!wrapper) return;

  setTimeout(() => {
    scrollToElement({
      ...props,
      scrollThreshold: ACCORDION_DWEB_SCROLL_THRESHOLD,
      prefixId: dashedQnaType,
      wrapper,
    });
  }, 200);
};
