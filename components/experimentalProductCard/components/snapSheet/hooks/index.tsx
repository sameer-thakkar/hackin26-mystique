import { useCallback, useEffect, useRef, useState } from 'react';
import { trackEvent } from 'utils/analytics';
import { getPercentageScrolled, getScrollPercentage } from 'utils/helper';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { SWIPESHEET_STATES } from 'const/productCard';

export const useDragBehavior = ({
  ref,
  initialPosition,
  drawerState,
  tgid,
  endPosition,
  dragComplete,
}: any) => {
  const [transform, setTransform] = useState(
    `translateY(${initialPosition}px)`
  );

  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startPositionTop: initialPosition,
    initialDragDirection: null,
  }) as any;

  const animationFrameID = useRef<number | null>(null);

  const updatePosition = useCallback((newPositionTop: number) => {
    setTransform(`translate3d(0, ${newPositionTop}px, 0)`);
  }, []);

  const snapSensitivity = 10;

  const finalizeDrag = useCallback(() => {
    if (!dragStateRef.current.isDragging) return;

    dragStateRef.current.isDragging = false;
    dragStateRef.current.initialDragDirection = null;

    if (animationFrameID.current) {
      window.cancelAnimationFrame(animationFrameID.current);
      animationFrameID.current = null;
    }
  }, []);

  const handleDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!dragStateRef.current.isDragging) return;

      const dragDistanceX = clientX - dragStateRef.current.startX;
      const dragDistanceY = clientY - dragStateRef.current.startY;

      // Only proceed if y movement is greater than x movement
      if (Math.abs(dragDistanceY) <= Math.abs(dragDistanceX)) return;

      if (dragStateRef.current.initialDragDirection === null) {
        dragStateRef.current.initialDragDirection =
          dragDistanceY > 0 ? 'down' : 'up';
      }

      let newPositionTop =
        dragStateRef.current.startPositionTop + dragDistanceY;
      newPositionTop = Math.max(
        Math.min(newPositionTop, initialPosition),
        endPosition
      );

      if (Math.abs(dragDistanceY) > snapSensitivity) {
        const snapPosition =
          dragStateRef.current.initialDragDirection === 'down'
            ? initialPosition
            : endPosition;
        newPositionTop = snapPosition;
        dragComplete(snapPosition);
        finalizeDrag();
      }

      if (animationFrameID.current)
        window.cancelAnimationFrame(animationFrameID.current);
      animationFrameID.current = window.requestAnimationFrame(() =>
        updatePosition(newPositionTop)
      );
    },
    [
      initialPosition,
      endPosition,
      updatePosition,
      finalizeDrag,
      snapSensitivity,
    ]
  );

  const startDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (ref.current && ref.current.scrollTop !== 0) return;

      dragStateRef.current = {
        isDragging: true,
        startX: clientX,
        startY: clientY,
        startPositionTop: parseInt(
          transform.match(/translateY\((.*)px\)/)?.[1] ?? '0',
          10
        ),
        initialDragDirection: null,
      };
    },
    [ref, transform]
  );

  useEffect(() => {
    const eventHandler = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      handleDrag(clientX, clientY);
    };

    const setupEvents = () => {
      window.addEventListener('mousemove', eventHandler, { passive: false });
      window.addEventListener('touchmove', eventHandler, { passive: false });
      window.addEventListener('mouseup', finalizeDrag);
      window.addEventListener('touchend', finalizeDrag);
    };

    setupEvents();

    return () => {
      window.removeEventListener('mousemove', eventHandler);
      window.removeEventListener('touchmove', eventHandler);
      window.removeEventListener('mouseup', finalizeDrag);
      window.removeEventListener('touchend', finalizeDrag);
      if (animationFrameID.current)
        window.cancelAnimationFrame(animationFrameID.current);
    };
  }, [handleDrag, finalizeDrag]);

  useEffect(() => {
    if (drawerState === SWIPESHEET_STATES.EXPANDED) {
      trackEvent({
        eventName: 'MORE_DETAILS_SECTION_VIEWED',
        tgid,
        percentageViewed: 0,
      });
    }
  }, [drawerState, tgid]);

  return { startDrag, transform };
};

const SCROLL_THRESHOLD = 100;

export const useContentScroll = ({
  ref,
  isTabClickScroll,
  tgid,
  activeTab,
  setActiveTab,
}: {
  ref: React.RefObject<HTMLDivElement>;
  isTabClickScroll: boolean;
  tgid: string | number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const triggered = useRef(new Set()).current;

  const trackScrollEvent = useCallback(
    (scrollPercentage: any) => {
      if (scrollPercentage) {
        if (!triggered.has(scrollPercentage)) {
          trackEvent({
            eventName: ANALYTICS_EVENTS.MORE_DETAILS_SECTION_VIEWED,
            [ANALYTICS_PROPERTIES.TGID]: tgid,
            [ANALYTICS_PROPERTIES.PERCENTAGE_VIEWED]: scrollPercentage,
          });
          triggered.add(scrollPercentage);
        }
      }
    },
    [tgid, triggered]
  );

  const handleScroll = useCallback(() => {
    const contentElement = ref.current;
    if (!contentElement || isTabClickScroll) return;

    const scrollPercentage = getPercentageScrolled(contentElement);

    const roundedScrollValue = getScrollPercentage(scrollPercentage);
    trackScrollEvent(roundedScrollValue);

    const contentBlocks = document.querySelectorAll('.content-block');
    for (const block of contentBlocks) {
      const blockTop = block.getBoundingClientRect().top;
      if (blockTop <= SCROLL_THRESHOLD && blockTop > 0) {
        const newActiveTab = block.id;
        if (activeTab !== newActiveTab) {
          setActiveTab(newActiveTab);
        }
        break;
      }
    }
  }, [ref, isTabClickScroll, trackScrollEvent, activeTab, setActiveTab]);

  useEffect(() => {
    const contentElement = ref.current;
    if (!contentElement) return;

    contentElement.addEventListener('scroll', handleScroll);

    return () => {
      contentElement.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, ref]);
};
