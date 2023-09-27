import { useEffect } from 'react';

type IHistoryTraversalProps = {
  action: Function;
};

// Custom hook that allows us to check if the page is loaded from the cache of the browser and if it is then we run an action
export const useHistoryTraversal = ({ action }: IHistoryTraversalProps) => {
  const eventHandler = (event: PageTransitionEvent) => {
    const isHistoryTraversal =
      event.persisted || window.performance?.navigation?.type === 2;

    if (isHistoryTraversal) {
      action();
    }
  };
  useEffect(() => {
    window.addEventListener('pageshow', eventHandler);
    return () => {
      window.removeEventListener('pageshow', eventHandler);
    };
  }, []);
};
