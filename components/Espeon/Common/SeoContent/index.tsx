import React from 'react';
import { seoContentStyle } from './styles';
import type { TSeoContent } from './types';

export const SeoContent = ({ children }: TSeoContent) => {
  return (
    <div className={seoContentStyle} data-section="seo-content">
      {children}
    </div>
  );
};
