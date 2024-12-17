import { useCallback, useEffect, useState } from 'react';

type Params<T> = {
  // should always be provided if the canFetch is true
  callback?: () => void;
  identifier: (data: T) => string;
  itemBuffer?: number;
  canFetch?: boolean;
  items: Array<T>;
};

/**
 * This hook allows you to do call a function
 * until an attached component exists. Should be used
 * in cases where we need to lazy load and render
 * unknown number of components
 */
const useInfiniteList = <T = Record<string, any>>({
  callback,
  identifier,
  itemBuffer = 8,
  canFetch = false,
  items,
}: Params<T>) => {
  const [lastObserved, setLastObserved] = useState(-1);

  const [observer, updateObserver] = useState<IntersectionObserver | null>(
    null
  );

  const attachObserver = useCallback(() => {
    const watchIndex = Math.max(items.length - itemBuffer, 0);
    if (lastObserved >= watchIndex) return;
    if (lastObserved !== -1 && observer) {
      observer?.disconnect();
    }

    const data = items[watchIndex];

    if (data) {
      const watchElement = document.querySelector(identifier(data));

      if (watchElement) {
        const currentObserver =
          observer ??
          new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) callback?.();
            },
            { threshold: 0.1 }
          );
        currentObserver?.disconnect();
        currentObserver?.observe(watchElement);
        updateObserver(currentObserver);
        setLastObserved(watchIndex);
      }
    }
  }, [items, canFetch, callback]);

  useEffect(() => {
    if (!canFetch) return;
    attachObserver();
  }, [attachObserver, canFetch]);

  useEffect(() => {
    return () => {
      if (!observer || lastObserved === -1) return;
      observer.disconnect();
    };
  }, []);
};

export default useInfiniteList;
