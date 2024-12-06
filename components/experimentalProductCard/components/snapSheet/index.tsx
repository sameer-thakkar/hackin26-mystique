import React, { forwardRef, memo, RefObject, useEffect, useState } from 'react';
import { useProductCard } from 'contexts/productCardContext';
import { SWIPESHEET_STATES } from 'const/productCard';
import { useContentScroll, useDragBehavior } from './hooks';
import { Content, SnapSheetContainer } from './styles';

interface SnapSheetProps {
  children: React.ReactNode;
  dragComplete: (position: number) => void;
  initialPosition: number;
  endPosition: number;
  dragOffset?: number;
  enableDrag?: boolean;
  cardHeight: number;
  headerHeight: number;
  pricingHeight: number;
  sheetHeight?: string;
  hasOffers?: boolean;
  ref: RefObject<HTMLDivElement>;
  tgid: number | string;
  setActiveTab: (tab: string) => void;
  activeTab: string;
  isTabClickScroll: boolean;
  preventTouchEvents?: boolean;
}

const SnapSheet = forwardRef<HTMLDivElement, SnapSheetProps>(
  (
    {
      children,
      dragComplete,
      initialPosition,
      endPosition,
      cardHeight,
      headerHeight,
      pricingHeight,
      sheetHeight = '100%',
      hasOffers,
      tgid,
      setActiveTab,
      activeTab,
      isTabClickScroll,
      preventTouchEvents,
    },
    ref: any
  ) => {
    const { drawerState, snapDrawerConfig } = useProductCard();
    const {
      isMountedOnTop: isSnapDrawerMountedToTop,
      transform: snapDrawerTranslate,
      isCompleted: isSnapDrawerMountingComplete,
    } = snapDrawerConfig;
    const [enableProgation, togglePropgation] = useState(false);
    const { startDrag, transform } = useDragBehavior({
      ref,
      initialPosition,
      tgid,
      endPosition,
      dragComplete,
      drawerState,
    });
    const [finalSnapSheetTransform, setFinalSnapSheetTransform] =
      useState(transform);

    useContentScroll({
      ref,
      isTabClickScroll,
      tgid,
      activeTab,
      setActiveTab,
    });
    useEffect(() => {
      if (isSnapDrawerMountingComplete || !isSnapDrawerMountedToTop) {
        setFinalSnapSheetTransform(transform);
      }
    }, [transform, drawerState]);

    useEffect(() => {
      if (isSnapDrawerMountedToTop && snapDrawerTranslate) {
        setFinalSnapSheetTransform(snapDrawerTranslate);
      }
    }, [isSnapDrawerMountedToTop, snapDrawerTranslate]);

    return (
      <SnapSheetContainer
        onMouseDown={(e) => {
          togglePropgation(true);
          startDrag(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          enableProgation && e.stopPropagation();
          startDrag(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTransitionEnd={() => {
          togglePropgation(false);
        }}
        style={{
          transform: finalSnapSheetTransform,
        }}
        $isOpen={drawerState === SWIPESHEET_STATES.OPEN}
      >
        <Content
          $cardHeight={cardHeight}
          $headerHeight={headerHeight}
          $pricingHeight={pricingHeight}
          $sheetHeight={sheetHeight}
          $isOpen={!!(drawerState === SWIPESHEET_STATES.OPEN)}
          ref={ref}
          $hasOffers={hasOffers}
          $preventTouchEvents={preventTouchEvents}
          id="snapsheet-content-container"
        >
          {children}
        </Content>
      </SnapSheetContainer>
    );
  }
);

SnapSheet.displayName = 'Snap Sheet';

export default memo(SnapSheet);
