import React from 'react';

const EnvironmentContext = React.createContext({
  isDev: null,
  windowUrl: '',
});

export default EnvironmentContext;
