// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

// Refer to: https://github.com/Microsoft/TypeScript/issues/15449
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'amp-img': any;
      'amp-carousel': any;
      'amp-selector': any;
      'amp-accordion': any;
      'amp-analytics': any;
      'amp-youtube': any;
      'amp-iframe': any;
    }
  }
}
