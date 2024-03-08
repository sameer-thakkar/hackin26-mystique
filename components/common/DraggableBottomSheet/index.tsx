import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useBodyScrollLock } from 'hooks/useBodyScrollLock';
import { CLOSE_DRAWER_ACTIONS } from 'const/productCard';
import { GrabBar, GrabIndicator, Overlay, Sheet } from './styles';

export const BottomSheet = memo(
  ({
    children,
    onCloseCompletion,
    onCloseInit,
    isScrolled,
    sheetHeight = '90%',
    snapHeight,
    isOpen,
    dragLimit = 100,
  }: {
    children: React.ReactNode;
    onCloseCompletion?: (type: string) => void;
    onCloseInit?: () => void;
    isScrolled: boolean;
    isOpen: boolean;
    sheetHeight?: string;
    snapHeight?: string;
    dragLimit?: number;
  }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [translateY, setTranslateY] = useState(1000);
    const [overlayOpacity, setOverlayOpacity] = useState(0);
    const lastY = useRef(0);
    const initialX = useRef(0);

    useBodyScrollLock(true);

    useEffect(() => {
      if (isOpen) {
        setOverlayOpacity(1);
        setTranslateY(0);
      }
    }, [isOpen]);

    const handlePositionUpdate = (currentY: any) => {
      const diffY = currentY - lastY.current;
      setTranslateY((prevState) => Math.max(0, prevState + diffY));
      lastY.current = currentY;
    };

    const handleDragStart = useCallback((e) => {
      setIsDragging(true);
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      lastY.current = clientY;
      initialX.current = clientX;
    }, []);

    const handleDragMove = useCallback(
      (e) => {
        if (!isDragging) return;
        const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        if (
          Math.abs(currentY - lastY.current) >
          Math.abs(currentX - initialX.current)
        ) {
          handlePositionUpdate(currentY);
        }
      },
      [isDragging]
    );

    const handleDrawerClose = useCallback(
      (type) => {
        setTranslateY(window.innerHeight);
        onCloseInit?.();
        setOverlayOpacity(0);
        setTimeout(() => {
          onCloseCompletion?.(type);
        }, 300);
      },
      [onCloseCompletion]
    );

    const handleDragEnd = useCallback(() => {
      setIsDragging(false);
      if (translateY > dragLimit) {
        handleDrawerClose(CLOSE_DRAWER_ACTIONS.SWIPE_DOWN);
      } else {
        setTranslateY(0);
      }
    }, [translateY, handleDrawerClose, dragLimit]);

    const eventHandlers = {
      onMouseDown: handleDragStart,
      onTouchStart: handleDragStart,
      onMouseMove: handleDragMove,
      onTouchMove: handleDragMove,
      onMouseUp: handleDragEnd,
      onTouchEnd: handleDragEnd,
      onMouseLeave: handleDragEnd,
    };

    return (
      <Overlay $overlayOpacity={overlayOpacity} $isDragging={isDragging}>
        <div
          role="button"
          tabIndex={0}
          onClick={() =>
            handleDrawerClose(CLOSE_DRAWER_ACTIONS.OVERLAY_CLICKED)
          }
          className="backdrop"
        />
        <Sheet
          {...(isOpen ? eventHandlers : {})}
          $sheetHeight={sheetHeight}
          $translateY={translateY}
        >
          <GrabBar
            {...(!isOpen ? eventHandlers : {})}
            $isScrolled={isScrolled}
            $snapHeight={snapHeight}
          >
            <GrabIndicator $isScrolled={isScrolled} />
          </GrabBar>

          <div className="sheet-content">{children}</div>
        </Sheet>
      </Overlay>
    );
  }
);

BottomSheet.displayName = 'Bottom Sheet';
