import React, { useEffect } from 'react';
import { useStateMachineInput } from '@rive-app/react-canvas';
import Conditional from 'components/common/Conditional';
import { StyledRizLogoWrapper } from 'components/common/RiveLogoComponent/styles';
import { useRive } from 'hooks/useRive';
import { RIV_LOGO } from 'const/index';
import PoweredByHeadoutNoBorder from 'assets/poweredByHeadoutNoBorder';

const RiveLogoComponent = () => {
  const { RiveComponent, rive, isLoading, isError } = useRive({
    src: RIV_LOGO,
    stateMachines: 'stateMachine',
    artboard: 'txt',
    autoplay: true,
  });

  useStateMachineInput(rive, 'stateMachine', 'usersA', 2);
  const usersB = useStateMachineInput(rive, 'stateMachine', 'usersB', 5);
  useStateMachineInput(rive, 'stateMachine', 'citiesA', 1);
  useStateMachineInput(rive, 'stateMachine', 'citiesB', 9);
  useStateMachineInput(rive, 'stateMachine', 'citiesC', 0);

  useEffect(() => {
    if (rive && usersB) {
      // we can dynamically fetch from looker for these, for now we are using static values
      usersB.value = 5;
    }
  }, [rive, usersB]);

  const showFallback = isLoading || isError;

  return (
    <StyledRizLogoWrapper>
      <Conditional if={!showFallback}>
        <RiveComponent width={'100%'} height={'100%'} />
      </Conditional>
      <Conditional if={showFallback}>
        <PoweredByHeadoutNoBorder />
      </Conditional>
    </StyledRizLogoWrapper>
  );
};

export default RiveLogoComponent;
