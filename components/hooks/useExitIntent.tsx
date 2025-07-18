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
 * horizontalSwipeThreshold: distance in pixels for horizontal swipe detection
 * verticalSwipeThreshold: distance in pixels for vertical swipe detection
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
  horizontalSwipeThreshold?: number;
  verticalSwipeThreshold?: number;
}

export enum EXIT_INTENT_TYPE {
  BackButton = 'Back Button',
  VisibilityChange = 'Visibility Change',
  Inactivity = 'Inactivity',
  Swipe = 'Swipe',
  RapidScrollToTop = 'Rapid Scroll To Top',
  MouseLeave = 'Mouse Leave',
}

const useExitIntent = ({
  threshold = 20,
  maxDisplayCount = -1,
  eventListenerOptions = true,
  cookieExpiration = 1,
  isSessionBased = true,
  enabled = false,
  inactivityTimeout = 18000,
  horizontalSwipeThreshold = 80, // Realistic horizontal swipe distance
  verticalSwipeThreshold = 150, // Realistic vertical swipe distance
  onExitIntent,
}: IUseExitIntentOptions = {}) => {
  const [isExitIntentDetected, setIsExitIntentDetected] = useState(false);
  const { isMobile } = useRecoilValue(appAtom);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [exitIntentType, setExitIntentType] = useState<EXIT_INTENT_TYPE | null>(
    null
  );

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
        setExitIntentType(EXIT_INTENT_TYPE.MouseLeave);
        triggerExitIntent();
      }
    };

    // Mobile exit intent detection - enhanced with multiple signals
    const mobileExitIntent = () => {
      setExitIntentType(EXIT_INTENT_TYPE.BackButton);
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
        setExitIntentType(EXIT_INTENT_TYPE.Inactivity);
        triggerExitIntent();
      }, inactivityTimeout);
    };

    // Handle visibility change (tab switching, minimizing)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setExitIntentType(EXIT_INTENT_TYPE.VisibilityChange);
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
        Math.abs(deltaX) > horizontalSwipeThreshold &&
        (touchStartRef.current.x < 20 ||
          touchStartRef.current.x > window.innerWidth - 20)
      ) {
        setExitIntentType(EXIT_INTENT_TYPE.Swipe);
        triggerExitIntent();
      }

      // Detect rapid upward swipe from bottom (common for closing tabs)
      // Only trigger if user has scrolled more than 70% of the page content
      if (
        deltaY < -verticalSwipeThreshold &&
        touchStartRef.current.y > window.innerHeight - 100
      ) {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollPercentage = scrollTop / (documentHeight - windowHeight);

        // Only trigger if user has scrolled more than 70% of the content
        if (scrollPercentage > 0.7) {
          setExitIntentType(EXIT_INTENT_TYPE.RapidScrollToTop);
          triggerExitIntent();
        }
      }

      touchStartRef.current = null;
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
    horizontalSwipeThreshold,
    verticalSwipeThreshold,
  ]);

  return { isExitIntentDetected, setIsExitIntentDetected, exitIntentType };
};

export default useExitIntent;
