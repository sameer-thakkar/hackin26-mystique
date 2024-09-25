import { useEffect, useRef } from 'react';
import { trackEvent } from 'utils/analytics';
import useOnScreen from './useOnScreen';

interface TUseTrackElementViewOptions {
  eventName: string;
  properties: Record<string, any>;
  unobserve?: boolean;
}

export const useTrackElementView = ({
  eventName,
  properties,
  unobserve = true,
}: TUseTrackElementViewOptions) => {
  const ref = useRef<HTMLDivElement>(null);

  const isOnScreen = useOnScreen({
    ref,
    unobserve,
  });

  useEffect(() => {
    if (isOnScreen) {
      trackEvent({
        eventName,
        ...properties,
      });
    }
  }, [isOnScreen]); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
};
