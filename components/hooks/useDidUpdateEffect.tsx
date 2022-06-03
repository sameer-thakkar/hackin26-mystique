import React from 'react';

const useDidUpdateEffect = (
  effectCallback: React.EffectCallback,
  dependencyList: React.DependencyList = [] || null
) => {
  const isMountRun = React.useRef(true);

  React.useEffect(() => {
    if (isMountRun.current) {
      // early return on mount run: true, subsequent effects will fire as expected.
      isMountRun.current = false;
      return;
    }

    return effectCallback();
  }, dependencyList);
};

export default useDidUpdateEffect;
