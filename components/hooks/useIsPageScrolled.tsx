import { useEffect, useState } from 'react';

const useIsPageScrolled = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const handleScroll = () => {
    const yOffset = window.pageYOffset;
    if (yOffset === 0) {
      setIsScrolled(false);
    }
    if (yOffset > 0) {
      setIsScrolled(true);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return isScrolled;
};

export default useIsPageScrolled;
