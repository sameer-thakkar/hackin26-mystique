import React from 'react';
import Conditional from 'components/common/Conditional';
import {
  fallbackStyles,
  StyledRizLogoWrapper,
} from 'components/common/RiveLogoComponent/styles';
import { useRive } from 'hooks/useRive';
import { RIV_LOGO } from 'const/index';
import PoweredByHeadoutNoBorder from 'assets/poweredByHeadoutNoBorder';

const RiveLogoComponent = () => {
  const { RiveComponent, isLoading, isError } = useRive({
    src: RIV_LOGO,
    autoplay: true,
  });

  const showFallback = isLoading || isError;

  return (
    <StyledRizLogoWrapper>
      <Conditional if={!showFallback}>
        <RiveComponent width={'100%'} height={'100%'} />
      </Conditional>
      <Conditional if={showFallback}>
        <PoweredByHeadoutNoBorder style={fallbackStyles} />
      </Conditional>
    </StyledRizLogoWrapper>
  );
};

export default RiveLogoComponent;
