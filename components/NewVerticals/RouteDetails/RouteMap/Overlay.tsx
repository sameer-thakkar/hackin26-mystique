import React from 'react';
import { strings } from 'const/strings';
import { OverlayContainer } from './styles';

const Overlay = ({
  interactionEnabler,
}: {
  interactionEnabler: () => void;
}) => {
  const handleInteraction = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    interactionEnabler();
  };

  return (
    <OverlayContainer
      onClick={(e: any) => handleInteraction(e)}
      onTouchStart={(e: any) => handleInteraction(e)}
    >
      {strings.CRUISES.MAP_OVERLAY}
    </OverlayContainer>
  );
};

export default Overlay;
