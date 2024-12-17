import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Conditional from 'components/common/Conditional';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { strings } from 'const/strings';
import CrossiconSvg from 'assets/crossiconSvg';
import InfoIconDefault from 'assets/InfoIconDefault';
import { PORTAL_ID } from './constants';
import {
  StyledBackdrop,
  StyledOverlayContainer,
  StyledOverlayHeading,
} from './styles';
import { TTrustOverlayProps } from './types';

const OverlayContents = ({
  isDesktop = false,
  changeRenderOverlayState,
}: {
  isDesktop?: boolean;
  changeRenderOverlayState: (p: boolean) => void;
}) => {
  const [showOverlay, changeOverlayState] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      changeOverlayState(true);
    }, 10);
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  const close = () => {
    if (!showOverlay) return;
    changeOverlayState(false);
    setTimeout(() => {
      changeRenderOverlayState(false);
    }, 350);
  };

  useCaptureClickOutside(ref, close);

  return (
    <>
      <Conditional if={!isDesktop}>
        <StyledBackdrop $isOpen={showOverlay} onClick={close} />
      </Conditional>
      <StyledOverlayContainer $isOpen={showOverlay} ref={ref}>
        <div className="overlay-heading">
          {strings.TRUST_TOOLTIP_HEADER}
          <Conditional if={!isDesktop}>
            <button className="overlay-cross" onClick={close}>
              <CrossiconSvg />
            </button>
          </Conditional>
        </div>
        <div className="overlay-contents">{strings.TRUST_TOOLTIP_CONTENT}</div>
      </StyledOverlayContainer>
    </>
  );
};

const Overlay = ({ isDesktop = false }: TTrustOverlayProps) => {
  const [renderOverlay, changeRenderOverlayState] = useState(false);
  const overlayPortal = useRef<Element | null>(null);

  useEffect(() => {
    if (isDesktop || overlayPortal.current) return;
    const hasPortal = !!document.body.querySelector(`#${PORTAL_ID}`);
    if (!hasPortal) {
      const portalDiv = document.createElement('div');
      portalDiv.id = PORTAL_ID;
      portalDiv.style.zIndex = '10001';
      portalDiv.style.position = 'fixed';
      document.body.appendChild(portalDiv);
    }
    overlayPortal.current = document.body.querySelector(`#${PORTAL_ID}`);
  }, []);

  const openOverlay = () => {
    changeRenderOverlayState(true);
  };

  const closeOverlay = () => {
    changeRenderOverlayState(false);
  };
  return (
    <StyledOverlayHeading
      onMouseEnter={openOverlay}
      onMouseLeave={closeOverlay}
      onClick={openOverlay}
    >
      <span className="title">{strings.TRUST_TOOLTIP_HEADER}</span>
      <span className="info-icon">
        <InfoIconDefault />
      </span>
      <Conditional if={renderOverlay}>
        {isDesktop ? (
          <OverlayContents
            isDesktop
            changeRenderOverlayState={changeRenderOverlayState}
          />
        ) : (
          overlayPortal.current &&
          createPortal(
            <OverlayContents
              isDesktop={false}
              changeRenderOverlayState={changeRenderOverlayState}
            />,
            overlayPortal.current
          )
        )}
      </Conditional>
    </StyledOverlayHeading>
  );
};

export default Overlay;
