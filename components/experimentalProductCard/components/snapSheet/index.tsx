import React, { forwardRef, memo, RefObject } from 'react';
import { useContentScroll, useDragBehavior } from './hooks';
import { Content, SnapSheetContainer } from './styles';

interface SnapSheetProps {
  children: React.ReactNode;
  dragComplete: (position: number) => void;
  initialPosition: number;
  endPosition: number;
  dragOffset?: number;
  enableDrag?: boolean;
  isOpen?: boolean;
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
}

const SnapSheet = forwardRef<HTMLDivElement, SnapSheetProps>(
  (
    {
      children,
      dragComplete,
      initialPosition,
      endPosition,
      isOpen,
      cardHeight,
      headerHeight,
      pricingHeight,
      sheetHeight = '100%',
      hasOffers,
      tgid,
      setActiveTab,
      activeTab,
      isTabClickScroll,
    },
    ref: any
  ) => {
    const { startDrag, transform } = useDragBehavior({
      ref,
      initialPosition,
      isOpen,
      tgid,
      endPosition,
      dragComplete,
    });

    useContentScroll({
      ref,
      isTabClickScroll,
      tgid,
      activeTab,
      setActiveTab,
    });

    return (
      <SnapSheetContainer
        onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
        onTouchStart={(e) =>
          startDrag(e.touches[0].clientX, e.touches[0].clientY)
        }
        style={{ transform }}
        $isOpen={isOpen}
      >
        <Content
          $cardHeight={cardHeight}
          $headerHeight={headerHeight}
          $pricingHeight={pricingHeight}
          $sheetHeight={sheetHeight}
          $isOpen={!!isOpen}
          ref={ref}
          $hasOffers={hasOffers}
        >
          {children}
        </Content>
      </SnapSheetContainer>
    );
  }
);

SnapSheet.displayName = 'Snap Sheet';

export default memo(SnapSheet);
