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
      onClick={(e) => handleInteraction(e)}
      onTouchStart={(e) => handleInteraction(e)}
    >
      {strings.CRUISES.MAP_OVERLAY}
    </OverlayContainer>
  );
};

export default Overlay;
