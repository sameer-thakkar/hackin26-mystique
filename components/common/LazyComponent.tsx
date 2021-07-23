import React, { useState, useEffect } from 'react';
import handleViewport from 'react-in-viewport';
import { useAmp } from 'next/amp';

const LazyWrapper = (props) => {
  const { inViewport, forwardedRef } = props;
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (inViewport && !loaded) {
      setLoaded(true);
    }
  }, [inViewport]);

  return <span ref={forwardedRef}>{loaded ? props.children : null}</span>;
};

const LazyComponent = handleViewport(
  LazyWrapper,
  { rootMargin: '250px' },
  { disconnectOnLeave: true }
);

export default LazyComponent;
export const WrapInLazyComponent = (children) => {
  const isAmp = useAmp();
  return <>{isAmp ? children : <LazyComponent>{children}</LazyComponent>}</>;
};
