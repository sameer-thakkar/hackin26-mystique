import { ReactChild, useEffect, useRef } from 'react';
import {
  ReactZoomPanPinchContentRef,
  TransformComponent,
  TransformWrapper,
  useControls,
} from 'react-zoom-pan-pinch';
import Minus from 'assets/minus';
import Plus2 from 'assets/plus2';
import ResetIcon from 'assets/resetIcon';
import { ControlsButton, ControlsWrapper } from './styles';

const ZoomPanPinch = ({
  children,
  isMobile,
  handleOnWheel,
}: {
  children: ReactChild;
  isMobile: boolean;
  handleOnWheel?: () => void;
}) => {
  const wrapperRef = useRef<ReactZoomPanPinchContentRef>(null);

  useEffect(() => {
    const currentWrapper = wrapperRef.current;

    if (currentWrapper && handleOnWheel instanceof Function) {
      currentWrapper.instance.wrapperComponent?.addEventListener(
        'wheel',
        handleOnWheel
      );
    }

    return () => {
      if (currentWrapper && handleOnWheel instanceof Function) {
        currentWrapper.instance.wrapperComponent?.removeEventListener(
          'wheel',
          handleOnWheel
        );
      }
    };
  }, []);

  return (
    <TransformWrapper
      ref={wrapperRef}
      disabled={isMobile}
      wheel={{ activationKeys: ['Control'] }}
    >
      <Controls />
      <TransformComponent>{children}</TransformComponent>
    </TransformWrapper>
  );
};

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <ControlsWrapper>
      <div className="zoom-container">
        <ControlsButton className="zoom-in" onClick={() => zoomIn()}>
          <Plus2 />
        </ControlsButton>
        <ControlsButton className="zoom-out" onClick={() => zoomOut()}>
          <Minus />
        </ControlsButton>
      </div>
      <ControlsButton className="reset-button" onClick={() => resetTransform()}>
        <ResetIcon />
      </ControlsButton>
    </ControlsWrapper>
  );
};

export default ZoomPanPinch;
