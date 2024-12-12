import React from 'react';
import { Alignment, Fit, Layout } from '@rive-app/react-canvas';
import Conditional from 'components/common/Conditional';
import { useRive } from 'hooks/useRive';
import { RIV_CTA_LTT } from 'const/index';
import { TRiveCTAProps } from './interface';
import { riveComponentStyles, RiveCtaWrapper } from './style';

const RiveCTA = ({ onClick, primaryText }: TRiveCTAProps) => {
  const { RiveComponent, rive, isLoading, isError } = useRive({
    src: RIV_CTA_LTT,
    stateMachines: 'State Machine 1',
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  const showFallback = isLoading || isError;
  rive?.setTextRunValue('CTA Text', primaryText);

  return (
    <RiveCtaWrapper>
      <Conditional if={!showFallback}>
        <RiveComponent onClick={onClick} style={riveComponentStyles} />
      </Conditional>
    </RiveCtaWrapper>
  );
};

export default RiveCTA;
