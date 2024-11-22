import { MutableRefObject, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  MORE_DETAILS_SWIPESHEET,
} from 'const/index';
import { TController } from './interface';

const Popup = ({
  controller,
  children,
  decreasedHeight,
}: {
  controller?: MutableRefObject<TController | undefined>;
  children: JSX.Element | JSX.Element[];
  decreasedHeight?: boolean;
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const close = (isButton = false) => {
    setIsVisible(false);
    setTimeout(() => {
      setIsActive(false);
    }, 500);
    document.body.style.overflow = 'auto';
    trackEvent({
      eventName: ANALYTICS_EVENTS.ITINERARY_POPUP_CLOSED,
      [ANALYTICS_PROPERTIES.ACTION]: isButton
        ? MORE_DETAILS_SWIPESHEET.ACTION.CLOSE_BUTTON
        : MORE_DETAILS_SWIPESHEET.ACTION.OVERLAY_CLICKED,
    });
  };

  useEffect(() => {
    if (controller)
      controller.current ??= {
        open: () => {
          setIsActive(true);
          setTimeout(() => {
            setIsVisible(true);
          }, 100);
          document.body.style.overflow = 'hidden';
        },
        close,
      };
  }, []);

  const minHeight = decreasedHeight ? '550px' : '630px';
  const popupStyles: Modal.Styles = {
    overlay: {
      zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity .5s cubic-bezier(0.7, 0, 0.3, 1)',
    },
    content: {
      maxWidth: 1016,
      maxHeight: `min(${minHeight}, 80vh)`,
      margin: '32px auto 42px',
      borderRadius: 12,
      overflow: 'hidden',
      padding: '24px 0 0 0',
      border: 'none',
      top: '80px',
      transform: isVisible ? 'translateY(0vh)' : 'translateY(100vh)',
      transition: 'transform .5s cubic-bezier(0.7, 0, 0.3, 1)',
    },
  };

  return (
    <div onClick={(e) => e.stopPropagation()} role={'button'} tabIndex={0}>
      <Modal
        isOpen={isActive}
        onRequestClose={() => close()}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
        shouldReturnFocusAfterClose
        preventScroll={true}
        style={popupStyles}
      >
        {children}
      </Modal>
    </div>
  );
};

export default Popup;
