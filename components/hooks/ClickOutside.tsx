import { RefObject, useEffect } from 'react';

export const useCaptureClickOutside = (
  elementRef: any,
  outsideClickHandler: any,
  exceptionRefs: RefObject<HTMLDivElement>[] = []
) => {
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const handleClickOutside = (event: any) => {
    let isException = false;
    exceptionRefs.forEach((ref) => {
      isException =
        isException ||
        ((ref as any).current && (ref as any).current.contains(event.target));
    });
    if (
      elementRef.current &&
      !elementRef.current.contains(event.target) &&
      !isException
    ) {
      outsideClickHandler();
    }
  };
};
