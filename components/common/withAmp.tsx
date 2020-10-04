import React from 'react';
import { useAmp } from 'next/amp';

export const withAmp = (Component) =>
  function WithAmpComponent(props) {
    const isAmp = useAmp();
    return <Component {...props} isAmp={isAmp} />;
  };
