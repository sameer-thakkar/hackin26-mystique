import React, { useEffect } from 'react';
import { useStateMachineInput } from '@rive-app/react-canvas';
import Conditional from 'components/common/Conditional';
import { StyledRizLogoWrapper } from 'components/common/RiveLogoComponent/styles';
import { useGuestCount } from 'hooks/useGuestCount';
import { useRive } from 'hooks/useRive';
import { RIV_LOGO } from 'const/index';
import PoweredByHeadoutNoBorder from 'assets/poweredByHeadoutNoBorder';

const RiveLogoComponent = ({ hasDarkBg = false }) => {
  const { RiveComponent, rive, isLoading, isError } = useRive({
    src: RIV_LOGO,
    stateMachines: 'stateMachine',
    artboard: 'txt',
    autoplay: true,
  });
  const { data: guestCount } = useGuestCount();

  const totalServedFirstDigit = Math.floor(guestCount?.totalServed / 1e7);
  const totalServedSecondDigit = Math.floor(guestCount?.totalServed / 1e6) % 10;

  useStateMachineInput(
    rive,
    'stateMachine',
    'usersA',
    totalServedFirstDigit ?? 3
  );
  useStateMachineInput(
    rive,
    'stateMachine',
    'usersB',
    totalServedSecondDigit ?? 2
  );
  useStateMachineInput(rive, 'stateMachine', 'citiesA', 1);
  useStateMachineInput(rive, 'stateMachine', 'citiesB', 9);
  useStateMachineInput(rive, 'stateMachine', 'citiesC', 0);
  const isWhiteInput = useStateMachineInput(
    rive,
    'stateMachine',
    'isWhite',
    hasDarkBg
  );

  useEffect(() => {
    if (rive && isWhiteInput) {
      isWhiteInput.value = hasDarkBg;
    }
  }, [isWhiteInput, hasDarkBg, rive]);

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
