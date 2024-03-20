import { useEffect, useState } from 'react';

const useWindowWidth = () => {
  const isClient = typeof window === 'object';

  const [windowWidth, setWindowWidth] = useState(
    isClient ? window.innerWidth : undefined
  );

  useEffect(() => {
    if (!isClient) {
      return;
    }

    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
};

export default useWindowWidth;
