import React from 'react';
import handleViewport from 'react-in-viewport';

const renderOnView = component => {
  const ScrollWrapper = props => {
    const { inViewport, forwardedRef, enterCount } = props;
    const wrappedComponents = React.createElement(
      'span',
      { ref: forwardedRef },
      inViewport || enterCount > 0 ? component : null
    );
    return wrappedComponents;
  };
  const ViewportBlock = handleViewport(ScrollWrapper);

  return <ViewportBlock />;
};

export default renderOnView;
