import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, MORE_DETAILS_SWIPESHEET } from 'const/index';
import { TPopupProps } from './interface';

const Popup = ({
  controller,
  children,
  tgid,
  scrollToSection,
  slideUp,
}: TPopupProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [startingIndex, setStartingIndex] = useState(-1);

  const close = (isButton = false) => {
    setIsVisible(false);
    setTimeout(() => {
      setIsActive(false);
    }, 500);
    document.body.style.overflow = 'auto';
    trackEvent({
      eventName: ANALYTICS_EVENTS.MORE_DETAILS_SWIPESHEET_CLOSED,
      action: isButton
        ? MORE_DETAILS_SWIPESHEET.ACTION.CLOSE_BUTTON
        : MORE_DETAILS_SWIPESHEET.ACTION.OVERLAY_CLICKED,
    });
  };
  const open = (startingIndex = -1) => {
    setIsActive(true);
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
    document.body.style.overflow = 'hidden';
    if (startingIndex !== -1 && startingIndex !== 0)
      setStartingIndex(startingIndex);
  };

  const onAfterOpen = () => {
    if (startingIndex !== -1) {
      setTimeout(() => {
        scrollToSection?.(startingIndex);
        setStartingIndex(-1);
      }, 150);
    }
  };

  useEffect(() => {
    if (controller)
      controller.current ??= {
        open,
        close,
      };
  }, []);

  const popupStyles: Modal.Styles = {
    overlay: {
      zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity .5s cubic-bezier(0.7, 0, 0.3, 1)',
    },
    content: {
      maxWidth: 792,
      margin: '32px auto 42px',
      borderRadius: 12,
      overflow: 'hidden',
      padding: 0,
      border: 'none',
      top: '40px',
      ...(slideUp
        ? {
            transform: isVisible ? 'translateY(0vh)' : 'translateY(100vh)',
            transition: 'transform .5s cubic-bezier(0.7, 0, 0.3, 1)',
          }
        : {
            opacity: isVisible ? 1 : 0,
            transform: `scale(${isVisible ? 1 : 0.8})`,
            transition: 'all .5s cubic-bezier(0.7, 0, 0.3, 1)',
          }),
    },
  };

  return (
    <Modal
      isOpen={isActive}
      onRequestClose={() => close()}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      shouldReturnFocusAfterClose
      preventScroll={true}
      style={popupStyles}
      onAfterOpen={onAfterOpen}
      portalClassName={`popup-portal-${tgid}`}
    >
      {children}
    </Modal>
  );
};

export default Popup;
