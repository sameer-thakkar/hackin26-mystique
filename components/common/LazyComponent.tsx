import React, { useState, useEffect } from 'react';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import handleViewport from 'react-in-viewport';

const LazyWrapper = (props: any) => {
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
export const WrapInLazyComponent = (children: any) => {
  return <LazyComponent>{children}</LazyComponent>;
};
