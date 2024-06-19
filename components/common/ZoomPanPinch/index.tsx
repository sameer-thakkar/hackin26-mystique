import { ReactChild } from 'react';
import {
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
}: {
  children: ReactChild;
  isMobile: boolean;
}) => {
  return (
    <TransformWrapper
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
