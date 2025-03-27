import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { appAtom } from 'store/atoms/app';

/**
 * Options for the useExitIntent hook
 *
 * threshold: threshold for exit intent detection
 * maxDisplayCount: number of times the popup can be displayed
 * eventListenerOptions: options for event listeners
 * cookieExpiration: expiration time in days
 * isSessionBased: if true, expiry is session-based
 * enabled: if false, exit intent detection is disabled
 * onExitIntent: callback function when exit intent is detected
 * inactivityTimeout: time in ms before inactivity triggers exit intent
 * swipeThreshold: distance in pixels for swipe detection
 */
interface IUseExitIntentOptions {
  threshold?: number;
  maxDisplayCount?: number;
  eventListenerOptions?: boolean | AddEventListenerOptions;
  cookieExpiration?: number;
  isSessionBased?: boolean;
  enabled?: boolean;
  onExitIntent?: () => void;
  inactivityTimeout?: number;
  swipeThreshold?: number;
}

const useExitIntent = ({
  threshold = 20,
  maxDisplayCount = -1,
  eventListenerOptions = true,
  cookieExpiration = 1,
  isSessionBased = true,
  enabled = false,
  inactivityTimeout = 20000,
  swipeThreshold = 200,
  onExitIntent,
}: IUseExitIntentOptions = {}) => {
  const [isExitIntentDetected, setIsExitIntentDetected] = useState(false);
  const { isMobile } = useRecoilValue(appAtom);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastScrollTopRef = useRef<number>(0);
  const scrollDirectionChangeCountRef = useRef<number>(0);

  useEffect(() => {
    // If exit intent is disabled, don't set up any listeners
    if (!enabled) return;

    // Check if we've already shown the popup recently
    const getExitIntentDisplayCount = () => {
      const count = localStorage.getItem('exitIntentDisplayCount');
      return count ? parseInt(count, 10) : 0;
    };

    const incrementExitIntentDisplayCount = () => {
      // Don't increment or save count if maxDisplayCount is -1 (infinite)
      if (maxDisplayCount === -1) return;

      const count = getExitIntentDisplayCount();
      localStorage.setItem('exitIntentDisplayCount', (count + 1).toString());
    };

    const shouldShowExitIntent = () => {
      const count = getExitIntentDisplayCount();
      // If maxDisplayCount is -1, allow infinite displays
      return maxDisplayCount === -1 || count < maxDisplayCount;
    };

    const setCookie = () => {
      if (isSessionBased) {
        // For session-based, don't set an expiry date
        document.cookie = 'exitIntentShown=true; path=/';
      } else {
        // For day-based expiry
        const date = new Date();
        date.setTime(date.getTime() + cookieExpiration * 24 * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `exitIntentShown=true; ${expires}; path=/`;
      }
    };

    const checkCookie = () => {
      return document.cookie.includes('exitIntentShown=true');
    };

    const triggerExitIntent = () => {
      if (!checkCookie() && shouldShowExitIntent() && !isExitIntentDetected) {
        setIsExitIntentDetected(true);
        incrementExitIntentDisplayCount();
        setCookie();
        if (onExitIntent) onExitIntent();
      }
    };

    // Desktop exit intent detection
    const desktopExitIntent = (e: MouseEvent) => {
      if (e.clientY <= threshold) {
        triggerExitIntent();
      }
    };

    // Mobile exit intent detection - enhanced with multiple signals
    const mobileExitIntent = () => {
      triggerExitIntent();

      // Prevent the back navigation
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    // Reset inactivity timer
    const resetInactivityTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      inactivityTimerRef.current = setTimeout(() => {
        // Trigger exit intent after inactivity
        triggerExitIntent();
      }, inactivityTimeout);
    };

    // Handle visibility change (tab switching, minimizing)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        triggerExitIntent();
      }
    };

    // Handle touch start
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      resetInactivityTimer();
    };

    // Handle touch end - detect swipe gestures
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };

      const deltaX = touchEnd.x - touchStartRef.current.x;
      const deltaY = touchEnd.y - touchStartRef.current.y;

      // Detect horizontal edge swipes (common for back navigation)
      if (
        Math.abs(deltaX) > swipeThreshold &&
        (touchStartRef.current.x < 20 ||
          touchStartRef.current.x > window.innerWidth - 20)
      ) {
        triggerExitIntent();
      }

      // Detect rapid upward swipe from bottom (common for closing tabs)
      if (
        deltaY < -swipeThreshold &&
        touchStartRef.current.y > window.innerHeight - 100
      ) {
        triggerExitIntent();
      }

      touchStartRef.current = null;
    };

    // Handle scroll - detect rapid scrolling up to top
    const handleScroll = () => {
      resetInactivityTimer();

      if (typeof window !== 'undefined') {
        const currentScrollTop =
          window.scrollY || document.documentElement.scrollTop;

        // Detect rapid scroll to top
        if (
          lastScrollTopRef.current > currentScrollTop &&
          currentScrollTop < 100
        ) {
          triggerExitIntent();
        }

        // Detect erratic scrolling (up and down repeatedly)
        if (
          (lastScrollTopRef.current > currentScrollTop &&
            lastScrollTopRef.current - currentScrollTop > 50) ||
          (currentScrollTop > lastScrollTopRef.current &&
            currentScrollTop - lastScrollTopRef.current > 50)
        ) {
          scrollDirectionChangeCountRef.current += 1;

          if (scrollDirectionChangeCountRef.current > 5) {
            triggerExitIntent();
            scrollDirectionChangeCountRef.current = 0;
          }
        }

        lastScrollTopRef.current = currentScrollTop;
      }
    };

    // Add event listeners based on device type
    if (typeof window !== 'undefined') {
      if (isMobile) {
        // For mobile, use multiple signals to detect exit intent

        // 1. Back button navigation
        window.history.pushState(null, '', window.location.pathname);
        window.addEventListener(
          'popstate',
          mobileExitIntent,
          eventListenerOptions
        );

        // 2. Visibility change (switching tabs, minimizing)
        document.addEventListener(
          'visibilitychange',
          handleVisibilityChange,
          eventListenerOptions
        );

        // 3. Touch events for swipe detection
        document.addEventListener(
          'touchstart',
          handleTouchStart,
          eventListenerOptions
        );
        document.addEventListener(
          'touchend',
          handleTouchEnd,
          eventListenerOptions
        );

        // 4. Scroll behavior
        window.addEventListener('scroll', handleScroll, eventListenerOptions);

        // 5. User activity monitoring
        ['touchmove', 'click', 'keydown'].forEach((eventType) => {
          document.addEventListener(
            eventType,
            resetInactivityTimer,
            eventListenerOptions
          );
        });

        // Initialize inactivity timer
        resetInactivityTimer();
      } else {
        // For desktop, we'll track mouse movement
        document.addEventListener(
          'mouseleave',
          desktopExitIntent,
          eventListenerOptions
        );
      }
    }

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        if (isMobile) {
          window.removeEventListener(
            'popstate',
            mobileExitIntent,
            eventListenerOptions
          );
          document.removeEventListener(
            'visibilitychange',
            handleVisibilityChange,
            eventListenerOptions
          );
          document.removeEventListener(
            'touchstart',
            handleTouchStart,
            eventListenerOptions
          );
          document.removeEventListener(
            'touchend',
            handleTouchEnd,
            eventListenerOptions
          );
          window.removeEventListener(
            'scroll',
            handleScroll,
            eventListenerOptions
          );

          ['touchmove', 'click', 'keydown'].forEach((eventType) => {
            document.removeEventListener(
              eventType,
              resetInactivityTimer,
              eventListenerOptions
            );
          });

          if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
          }
        } else {
          document.removeEventListener(
            'mouseleave',
            desktopExitIntent,
            eventListenerOptions
          );
        }
      }
    };
  }, [
    threshold,
    maxDisplayCount,
    eventListenerOptions,
    cookieExpiration,
    isSessionBased,
    enabled,
    isMobile,
    isExitIntentDetected,
    onExitIntent,
    inactivityTimeout,
    swipeThreshold,
  ]);

  return { isExitIntentDetected, setIsExitIntentDetected };
};

export default useExitIntent;
