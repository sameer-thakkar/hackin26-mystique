import React from 'react';
import Highlights from 'components/Espeon/ProductCard/Highlights';
import { highlightsListStyle } from 'components/Espeon/ProductCard/Highlights/styles';
import type { THighlightsList } from 'components/Espeon/ProductCard/Highlights/types';

const HighlightsList = ({ highlights, variant }: THighlightsList) => {
  if (!highlights.length) return null;
  return (
    <div className={highlightsListStyle}>
      {highlights.map((highlight, index) => {
        return (
          <Highlights key={index} highlights={highlight} variant={variant} />
        );
      })}
    </div>
  );
};

export default HighlightsList;
