import { MutableRefObject, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, MORE_DETAILS_SWIPESHEET } from 'const/index';
import { TController } from './interface';

const Popup = ({
  controller,
  children,
}: {
  controller?: MutableRefObject<TController | undefined>;
  children: JSX.Element | JSX.Element[];
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
      eventName: ANALYTICS_EVENTS.MORE_DETAILS_SWIPESHEET_CLOSED,
      action: isButton
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
      opacity: isVisible ? 1 : 0,
      top: '40px',
      transform: `scale(${isVisible ? 1 : 0.8})`,
      transition: 'all .5s cubic-bezier(0.7, 0, 0.3, 1)',
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
    >
      {children}
    </Modal>
  );
};

export default Popup;
