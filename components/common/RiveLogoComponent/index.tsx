import React, { useState } from 'react';
import { useRive } from '@rive-app/react-canvas';
import Conditional from 'components/common/Conditional';
import { StyledRizLogoWrapper } from 'components/common/RiveLogoComponent/styles';
import { RIV_LOGO } from 'const/index';
import { POWERED_BY_HEADOUT_NO_BORDER } from 'assets/SvgIcons';

const RiveLogoComponent = () => {
  const [useFallbackLogo, setUseFallbackLogo] = useState(false);

  const { RiveComponent } = useRive({
    src: RIV_LOGO,
    stateMachines: 'StateMachine',
    artboard: 'mbLogo',
    autoplay: true,
    onLoadError: () => {
      setUseFallbackLogo(true);
    },
  });

  return (
    <StyledRizLogoWrapper>
      <Conditional if={!useFallbackLogo}>
        <RiveComponent width={'100%'} height={'100%'} />
      </Conditional>
      <Conditional if={useFallbackLogo}>
        <POWERED_BY_HEADOUT_NO_BORDER />
      </Conditional>
    </StyledRizLogoWrapper>
  );
};

export default RiveLogoComponent;
