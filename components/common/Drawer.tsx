import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import { throttle } from 'utils/gen';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import CloseIcon from 'assets/closeIcon';

const DrawerWrapper = styled.div<{
  $noMargin?: boolean;
  $hasHeading?: boolean;
  $drawerWrapperStyles?: any;
}>`
  background: ${COLORS.BRAND.WHITE};
  border-radius: 20px 20px 0px 0px;
  padding: ${({ $noMargin }) => ($noMargin ? 'unset' : '0 24px')};
  box-shadow: 0px -2px 12px rgba(84, 84, 84, 0.1);
  display: grid;
  margin-top: auto;
  grid-row-gap: ${({ $hasHeading }) => ($hasHeading ? '24px' : '0')};
  ${({ $drawerWrapperStyles }) => $drawerWrapperStyles}

  z-index: 1000;
  height: 100%;
  align-content: flex-start;
  animation: enter 0.3s ease-in-out;
  transform: translateY(0);
  transition: transform 0.3s ease;

  @keyframes enter {
    from {
      transform: translateY(72vh);
    }

    to {
      transform: translateY(0);
    }
  }

  @media (min-width: 768px) {
    position: relative;
    border-radius: 12px;
    margin-top: unset;
    align-self: center;
    justify-self: center;
    height: auto;
    min-width: 432px;
  }
`;

const DrawerContainer = styled.div<{ $drawerStyles: any }>`
  position: fixed;
  z-index: 20;
  bottom: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 72px);
  display: grid;

  .shadow {
    position: fixed;
    height: calc(100% - 56px);
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: -1;
    background: rgba(0, 0, 0, 0.5);
    animation: fade 0.4s ease;
    transition: opacity 0.3s ease;
    opacity: 1;

    &.coverHeader {
      height: 100%;
    }
  }

  ${({ $drawerStyles }) => $drawerStyles}

  @keyframes fade {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @media (min-width: 768px) {
    .shadow {
      height: calc(100% - 80px);
      &.coverHeader {
        height: 100%;
      }
    }
  }

  @media (max-width: 768px) {
    &.animate-out {
      .shadow {
        opacity: 0;
      }

      ${DrawerWrapper} {
        transform: translateY(100%);
      }
    }
  }
`;

export const CoreDrawerText = styled.div`
  position: relative;
  .content-wrapper {
    display: grid;
    grid-row-gap: 2.4rem;
  }
  span,
  p {
    color: ${COLORS.BRAND.BLACK};
    b {
      font-weight: 500;
    }
  }
`;

export const Separator = styled.div`
  border-top: 1px solid ${COLORS.GRAY.G6};
`;

export const HeadingContainer = styled.div<{ $hasHeading?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $hasHeading }) =>
    $hasHeading ? '1fr 1fr' : '1fr'};
  grid-row-gap: 1.2rem;
  align-items: center;
  ${Separator} {
    grid-column: 1 / 3;
  }
  .close-icon {
    margin-left: auto;
    grid-column: 2 / 3;
    grid-row: 1;
  }
`;

export const PanelAnchor = styled.div`
  display: inline-block;
  height: 4px;
  width: 32px;
  background-color: ${COLORS.GRAY.G6};
  border-radius: 100px;
  grid-column: span 2;
  justify-self: center;
  margin: 8px 0;

  @media (min-width: 768px) {
    display: none;
  }
`;

export const HeadingText = styled.div`
  grid-column: 1 / 2;
  ${expandFontToken(FONTS.HEADING_SMALL)}
`;

const SWIPE_DOWN_THRESHOLD_PX = 250;

const Drawer = ({
  closeHandler,
  contents,
  className,
  heading,
  children,
  noMargin = false,
  $drawerStyles,
  $drawerWrapperStyles,
  container = null,
  hideSeparator = false,
  slideOutOnClose = false,
  coverHeaderInShadow = false,
  hideCrossIcon = false,
  showPanelAnchor = false,
  customHeader,
}: {
  closeHandler?: Function;
  contents?: (closeHandler: () => void) => JSX.Element;
  className?: string;
  heading?: string;
  children?: React.ReactNode;
  noMargin?: boolean;
  $drawerStyles?: any;
  $drawerWrapperStyles?: any;
  container?: HTMLElement | null;
  hideSeparator?: boolean;
  slideOutOnClose?: boolean;
  coverHeaderInShadow?: boolean;
  hideCrossIcon?: boolean;
  showPanelAnchor?: boolean;
  customHeader?: (closeHandler: () => void) => JSX.Element;
}) => {
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef(null);
  const [animateOut, setAnimateOut] = useState(false);

  const close = (reason: string) => {
    if (slideOutOnClose) {
      setAnimateOut(true);
      if (drawerRef.current) {
        (drawerRef.current as HTMLElement).style.transform = `translateY(100%)`;
      }
      setTimeout(() => closeHandler?.(reason), 300);
    } else {
      closeHandler?.(reason);
    }
  };

  useEffect(() => {
    const liveChatContainer = document.getElementById('chat-widget-container');
    const liveChatZIndex = liveChatContainer?.style.zIndex;
    if (liveChatZIndex) {
      liveChatContainer.style.zIndex = '19';
    }
    document.body.classList.add('scroll-lock', 'no-shadow');
    setMounted(true);

    return () => {
      document.body.classList.remove('scroll-lock', 'no-shadow');
      if (liveChatZIndex) {
        liveChatContainer.style.zIndex = liveChatZIndex;
      }
    };
  }, []);

  useEffect(() => {
    if (!drawerRef.current) {
      return;
    }
    const drawer = drawerRef.current;
    const onStart = (e: any) => {
      const [touch] = e.changedTouches;
      const currentYTouchPos = touch.clientY;
      (drawer as any).prevDragPos = currentYTouchPos;
    };
    const onMove = throttle((e: any) => {
      const [touch] = e.changedTouches;
      const currentYTouchPos = touch.clientY;
      if ((drawer as any).prevDragPos) {
        const delta = currentYTouchPos - (drawer as any).prevDragPos;
        if (delta > 0) {
          (drawer as any).style.transform = `translateY(${delta}px)`;
        }
      }
    }, 100);
    const onEnd = (e: any) => {
      const [touch] = e.changedTouches;
      const currentYTouchPos = touch.clientY;
      const delta = currentYTouchPos - (drawer as any).prevDragPos;
      if (delta === 0) {
        // if the user just taps the screen, don't close the drawer
        return;
      }
      if (delta > SWIPE_DOWN_THRESHOLD_PX) {
        (drawer as any).style.transform = `translateY(100%)`;
        setTimeout(() => {
          // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
          closeHandler('Swipe');
        }, 200);
      } else {
        (drawer as any).style.transform = `translateY(0px)`;
      }
    };
    try {
      (drawer as any).addEventListener('touchstart', onStart);
      (drawer as any).addEventListener('touchmove', onMove);
      (drawer as any).addEventListener('touchend', onEnd);
    } catch (e: any) {
      //
    }
    return () => {
      (drawer as any).removeEventListener('touchstart', onStart);
      (drawer as any).removeEventListener('touchmove', onMove);
      (drawer as any).removeEventListener('touchend', onEnd);
    };
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return ReactDOM.createPortal(
    <DrawerContainer
      $drawerStyles={$drawerStyles}
      className={animateOut ? 'animate-out' : ''}
      onClick={(e: any) => e.stopPropagation()}
    >
      <div
        className={`shadow ${coverHeaderInShadow ? 'coverHeader' : ''}`}
        role="button"
        tabIndex={0}
        onClick={(e: any) => {
          e.stopPropagation();
          close('Outside');
        }}
      />
      <DrawerWrapper
        // @ts-expect-error TS(2769): No overload matches this call.
        $hasHeading={heading?.length}
        className={`${className || ''}`}
        $noMargin={noMargin}
        $drawerWrapperStyles={$drawerWrapperStyles}
        ref={drawerRef}
      >
        {customHeader ? (
          customHeader(() => close('Close Icon'))
        ) : (
          <HeadingContainer
            className="heading-container"
            $hasHeading={!!heading?.length}
          >
            <Conditional if={!hideCrossIcon || showPanelAnchor}>
              <PanelAnchor />
            </Conditional>
            <Conditional if={heading}>
              <HeadingText>{heading}</HeadingText>

              <Conditional if={!hideSeparator}>
                <Separator />
              </Conditional>
            </Conditional>
            <Conditional if={!hideCrossIcon}>
              <CloseIcon
                onClick={(e: any) => {
                  e.stopPropagation();
                  close('Close Icon');
                }}
                className="close-icon"
              />
            </Conditional>
          </HeadingContainer>
        )}

        <CoreDrawerText>
          {(contents && contents(() => close(''))) || children}
        </CoreDrawerText>
      </DrawerWrapper>
    </DrawerContainer>,
    container ?? document.body
  );
};

export default Drawer;
