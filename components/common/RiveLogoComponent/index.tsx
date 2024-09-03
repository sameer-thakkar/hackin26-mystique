import React from 'react';
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

  useStateMachineInput(rive, 'stateMachine', 'usersA', 3);
  useStateMachineInput(rive, 'stateMachine', 'usersB', 0);
  useStateMachineInput(rive, 'stateMachine', 'citiesA', 1);
  useStateMachineInput(rive, 'stateMachine', 'citiesB', 9);
  useStateMachineInput(rive, 'stateMachine', 'citiesC', 0);

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
