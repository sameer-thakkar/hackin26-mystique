import { useEffect, useState } from 'react';

export const usePageLoaded = () => {
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    const onPageLoad = () => {
      setPageLoaded(true);
    };

    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad, false);
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);
  return [pageLoaded];
};
