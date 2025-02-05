import type { CSSProperties, MouseEvent, TouchEvent } from 'react';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import Conditional from 'components/common/Conditional';
import { useBodyScrollLock } from 'hooks/useBodyScrollLock';
import { bottomSheetStylesRecipe } from './styles';
import type { TBottomSheetProps } from './types';

const BottomSheet = ({
  children,
  sheetHeight = '80%',
  dragLimit = 100,
  onCloseInit,
  onCloseCompletion,
  enableDrag,
  header,
  transparentGrabBar,
  hasRoundedCorners = true,
  isOverHeader,
}: TBottomSheetProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [translateY, setTranslateY] = useState(1000);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [dragEnabled, setDragEnabled] = useState(false);
  const lastTouchY = useRef(0);

  useBodyScrollLock(true);

  useEffect(() => {
    setTimeout(() => {
      setOverlayOpacity(1);
      setTranslateY(0);
    }, 0);
  }, []);

  useEffect(() => {
    if (enableDrag) {
      const timer = setTimeout(() => {
        setDragEnabled(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setDragEnabled(false);
    }
  }, [enableDrag]);

  const handleDrawerClose = useCallback(() => {
    setTranslateY(window.innerHeight);
    onCloseInit?.();
    setOverlayOpacity(0);
    setTimeout(() => {
      onCloseCompletion?.();
    }, 350);
  }, [onCloseCompletion]);

  const handleDragStart = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!dragEnabled) return; // Prevent dragging if not enabled
      setIsDragging(true);
      lastTouchY.current =
        (e as MouseEvent).clientY || (e as TouchEvent).touches[0].clientY;
    },
    [dragEnabled]
  );

  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const currentY =
        (e as MouseEvent).clientY || (e as TouchEvent).touches[0].clientY;
      setTranslateY((prevY) =>
        Math.max(0, prevY + (currentY - lastTouchY.current))
      );
      lastTouchY.current = currentY;
    },
    [isDragging]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    if (translateY > dragLimit) {
      handleDrawerClose();
    } else {
      setTranslateY(0);
    }
  }, [translateY, dragLimit, handleDrawerClose]);

  const eventHandlers = {
    onMouseDown: handleDragStart,
    onTouchStart: handleDragStart,
    onMouseMove: handleDragMove,
    onTouchMove: handleDragMove,
    onMouseUp: handleDragEnd,
    onTouchEnd: handleDragEnd,
    onMouseLeave: handleDragEnd,
  };

  const overlayDynamicStyles = {
    '--backdropOpacity': overlayOpacity,
  } as CSSProperties;
  const sheetDynamicStyles = {
    '--sheetHeight': sheetHeight,
    '--transformY': `${translateY}px`,
  } as CSSProperties;

  const bottomSheetStyles = bottomSheetStylesRecipe({
    hasRoundedCorners,
    hasTransparentGrabBar: transparentGrabBar,
    isOverHeader,
  });

  return (
    <div className={bottomSheetStyles.overlay} style={overlayDynamicStyles}>
      <div
        role="button"
        id="bottomsheet-overlay"
        tabIndex={0}
        onClick={handleDrawerClose}
        className={bottomSheetStyles.backdrop}
        onKeyDown={() => {}}
      />
      <div
        className={bottomSheetStyles.sheetWrapper}
        style={sheetDynamicStyles}
        {...(dragEnabled ? eventHandlers : {})}
      >
        <div className={bottomSheetStyles.grabBar}>
          <div className={bottomSheetStyles.grabIndicator} />
        </div>
        <div className={bottomSheetStyles.sheetContent}>
          <Conditional if={!!header}>
            <div
              {...(!dragEnabled ? eventHandlers : {})}
              className="content-header"
            >
              {header}
            </div>
          </Conditional>

          {children}
        </div>
      </div>
    </div>
  );
};

export const DraggableBottomSheet = memo(BottomSheet);
