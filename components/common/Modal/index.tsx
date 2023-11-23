import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useWindowSize from 'hooks/useWindowSize';
import { CoreModalContainer, CoreModalContent } from './styles';

const Modal = ({
  active,
  closeModal,
  children,
  onCloseCallback = null,
}: any) => {
  const container = useRef(null);
  if (typeof window !== 'undefined') {
    // @ts-expect-error TS(2322): Type 'HTMLElement' is not assignable to type 'null... Remove this comment to see the full error message
    if (!container.current) container.current = document?.body;
  }

  const { width: windowWidth } = useWindowSize();
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const isMobile = windowWidth < 768;

  useEffect(() => {
    const onPopState = () => {
      onClose();
    };
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    if (active) container.current.classList.add('scroll-lock');

    return () => window.removeEventListener('popstate', onPopState);
  }, [active, isMobile]);

  const onClose = (e = null) => {
    if ((e as any)?.target) {
      (e as any).stopPropagation();
    }
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    container.current.classList.remove('scroll-lock');
    if (onCloseCallback) onCloseCallback();
    closeModal();
  };

  return container.current && active
    ? createPortal(
        <CoreModalContainer onClick={() => onClose()}>
          <CoreModalContent onClick={(e) => e.stopPropagation()}>
            {children}
          </CoreModalContent>
        </CoreModalContainer>,
        container.current
      )
    : null;
};
export default Modal;
