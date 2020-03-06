import React, { useState, useEffect } from 'react';
import handleViewport from 'react-in-viewport';

const LazyWrapper = props => {
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
  {},
  { disconnectOnLeave: true }
);

export default LazyComponent;
export const WrapInLazyComponent = children => {
  return <LazyComponent>{children}</LazyComponent>;
};
