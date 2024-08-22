import { useEffect } from 'react';

const useResizeObserver = ({
  element,
  options,
  observerCallback,
}: {
  element: Element | null;
  options?: ResizeObserverOptions;
  observerCallback: ResizeObserverCallback;
}) => {
  useEffect(() => {
    if (!element) {
      return undefined;
    }
    const observer = new ResizeObserver(observerCallback);
    observer.observe(element, options);
    return () => {
      observer.disconnect();
    };
  }, [element, options, observerCallback]);
};

export default useResizeObserver;
