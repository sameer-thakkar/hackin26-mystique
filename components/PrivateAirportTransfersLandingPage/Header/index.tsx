import { useCallback, useEffect, useState } from 'react';
import { cx } from '@headout/pixie/css';
import Header from 'components/common/Header';
import { TScrollAwareHeaderProps } from './interface';
import { headerStyles } from './style';

export const ScrollAwareCommonHeader = (props: TScrollAwareHeaderProps) => {
  const [useLightTheme, setUseLightTheme] = useState(false);

  const updateTheme = useCallback(() => {
    const currentScrollPos = window.pageYOffset;
    setUseLightTheme(currentScrollPos >= 12);
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        rafId = requestAnimationFrame(function checkScroll() {
          updateTheme();
          rafId = requestAnimationFrame(checkScroll);
        });
      }

      // Clear the timeout if it exists
      if (scrollTimeout) clearTimeout(scrollTimeout);

      // Set a timeout to run after scrolling ends
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      }, 150); // Adjust this value as needed
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [updateTheme]);

  return (
    <Header
      isAirportTransfersLandingPage
      className={cx(headerStyles({ theme: useLightTheme ? 'light' : 'dark' }))}
      {...props}
      isDarkTheme={props.isDarkTheme && !useLightTheme}
    />
  );
};
