import { useEffect } from 'react';

export const useBodyScrollLock = (lockScroll: boolean = false) => {
  const toggleBodyOverflow = (disableOverflow: boolean) => {
    if (typeof window !== 'undefined' && window.document) {
      if (disableOverflow) {
        document.body.style.touchAction = 'none';
        document.body.classList.add('scroll-lock-without-overlay');
      } else {
        document.body.style.touchAction = '';
        document.body.style.overflow = '';
        document.body.classList.remove('scroll-lock-without-overlay');
      }
    }
  };

  useEffect(() => {
    toggleBodyOverflow(lockScroll);
    return () => toggleBodyOverflow(false);
  }, [lockScroll]);
};
