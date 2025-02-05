import React from 'react';
import { cx } from '@headout/pixie/css';
import { highlightsStyle } from './styles';
import type { THighlights } from './types';

const Highlights = ({ highlights, className, variant }: THighlights) => {
  const { root: rootStyle } = highlightsStyle(variant);
  return (
    <div
      className={cx(rootStyle, className)}
      dangerouslySetInnerHTML={{
        __html: highlights as TrustedHTML,
      }}
    ></div>
  );
};

export default Highlights;
