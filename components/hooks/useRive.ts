import { useEffect, useState } from 'react';
// @ts-ignore
import riveWASMResource from '@rive-app/canvas/rive.wasm';
import {
  RuntimeLoader,
  useRive as useRiveHook,
  UseRiveParameters,
} from '@rive-app/react-canvas';

enum RiveState {
  initial = 0,
  error = 1,
  ready = 2,
}

RuntimeLoader.setWasmUrl(riveWASMResource);

export const useRive = (params: UseRiveParameters) => {
  const [riveState, setRiveState] = useState(RiveState.initial);

  const { RiveComponent, rive } = useRiveHook({
    ...params,
    onLoadError: (ev) => {
      setRiveState(RiveState.error);
      if (params?.onLoadError) params.onLoadError(ev);
    },
  });

  useEffect(() => {
    setRiveState((prevState) =>
      prevState !== RiveState.error ? RiveState.ready : RiveState.error
    );
  }, []);

  return {
    RiveComponent,
    rive,
    isLoading: riveState !== RiveState.ready,
    isError: riveState === RiveState.error,
  };
};
