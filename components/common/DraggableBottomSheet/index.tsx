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
    const [dragEnabled, setDragEnabled] = useState(false);
    const lastY = useRef(0);
    const initialX = useRef(0);

    useBodyScrollLock(true);

    useEffect(() => {
      setOverlayOpacity(1);
      setTranslateY(0);
    }, []);

    useEffect(() => {
      if (isOpen) {
        const timer = setTimeout(() => {
          setDragEnabled(true);
        }, 500);
        return () => clearTimeout(timer);
      } else {
        setDragEnabled(false);
      }
    }, [isOpen]);

    const handlePositionUpdate = useCallback((currentY: any) => {
      const diffY = currentY - lastY.current;
      setTranslateY((prevState) => Math.max(0, prevState + diffY));
      lastY.current = currentY;
    }, []);

    const handleDragStart = useCallback(
      (e) => {
        if (!dragEnabled) return;
        setIsDragging(true);
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        lastY.current = clientY;
        initialX.current = clientX;
      },
      [dragEnabled]
    );

    const handleDragMove = useCallback(
      (e) => {
        if (!isDragging || !dragEnabled) return; // Check if dragging is enabled before moving
        const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        if (
          Math.abs(currentY - lastY.current) >
          Math.abs(currentX - initialX.current)
        ) {
          handlePositionUpdate(currentY);
        }
      },
      [isDragging, dragEnabled, handlePositionUpdate]
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
      [onCloseCompletion, onCloseInit]
    );

    const handleDragEnd = useCallback(() => {
      setIsDragging(false);
      if (!dragEnabled) return;
      if (translateY > dragLimit) {
        handleDrawerClose(CLOSE_DRAWER_ACTIONS.SWIPE_DOWN);
      } else {
        setTranslateY(0);
      }
    }, [translateY, handleDrawerClose, dragLimit, dragEnabled]);

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
          {...(isOpen && dragEnabled ? eventHandlers : {})}
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
