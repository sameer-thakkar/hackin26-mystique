import { useCallback, useEffect, useRef } from 'react';
import { StateMachineInputType, useRiveFile } from '@rive-app/react-canvas';
import useOnScreen from 'hooks/useOnScreen';
import { useRive } from 'hooks/useRive';
import { MOST_LOVED_AND_SPECIAL_DEAL_BOOSTER_LOCATION } from 'const/index';
import { DealPercentIconSVG, HeartIconSVG } from 'assets/boosters';

interface BoosterRiveIconProps {
  artboard: string;
  shouldAnimateBooster?: boolean;
}

export const BoosterRiveIcon = ({
  artboard,
  shouldAnimateBooster,
}: BoosterRiveIconProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const { status, riveFile } = useRiveFile({
    src: MOST_LOVED_AND_SPECIAL_DEAL_BOOSTER_LOCATION,
  });

  const { RiveComponent, rive, isLoading, isError } = useRive({
    riveFile: riveFile || undefined,
    artboard: artboard,
    stateMachines: 'stateMachine',
    autoplay: true,
  });

  const canvasSize = (() => {
    switch (artboard) {
      case 'mostLoved':
        return { height: 29, width: 31 };
      case 'specialDeal':
        return { height: 30, width: 30 };
      default:
        return { height: 32, width: 32 };
    }
  })();

  const isIntersecting = useOnScreen({
    ref: canvasRef,
    options: {
      threshold: 1,
    },
  });

  const playRive = useCallback(() => {
    const inputs = rive?.stateMachineInputs('stateMachine');
    inputs?.forEach((i) => {
      const inputName = i.name;
      const inputType = i.type;
      if (
        inputName === 'hover' &&
        inputType === StateMachineInputType.Boolean
      ) {
        i.value = true;
      }
    });
  }, [rive]);

  const pauseRive = useCallback(() => {
    const inputs = rive?.stateMachineInputs('stateMachine');
    inputs?.forEach((i) => {
      const inputName = i.name;
      const inputType = i.type;
      if (
        inputName === 'hover' &&
        inputType === StateMachineInputType.Boolean
      ) {
        i.value = false;
      }
    });
  }, [rive]);

  useEffect(() => {
    if (shouldAnimateBooster) {
      playRive();
    } else {
      pauseRive();
    }
  }, [shouldAnimateBooster, playRive, pauseRive]);

  useEffect(() => {
    const inputs = rive?.stateMachineInputs('stateMachine');
    inputs?.forEach((i) => {
      const inputName = i.name;
      const inputType = i.type;
      if (
        inputName === 'inView' &&
        inputType === StateMachineInputType.Boolean
      ) {
        i.value = isIntersecting;
      }
    });
  }, [isIntersecting, rive]);

  const showFallback = isLoading || isError || status !== 'success';

  if (showFallback) {
    if (artboard === 'mostLoved') {
      return <HeartIconSVG />;
    } else if (artboard === 'specialDeal') {
      return <DealPercentIconSVG />;
    }
  }

  return (
    <div className="rive-icon-container" ref={canvasRef}>
      <RiveComponent style={{ ...canvasSize }} />
    </div>
  );
};
