import { useEffect } from 'react';

export const useCaptureClickOutside = (
  elementRef,
  outsideClickHandler,
  exceptionRefs = []
) => {
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const handleClickOutside = event => {
    let isException = false;
    exceptionRefs.forEach(ref => {
      isException =
        isException || (ref.current && ref.current.contains(event.target));
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
