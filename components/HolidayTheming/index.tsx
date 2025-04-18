import React from 'react';
import HolidayThemeGalleryOverlay from './HolidayThemeGalleryOverlay';
import HolidayThemeHeader from './HolidayThemeHeader';

interface HolidayThemingProps {
  variant: 'header' | 'desktop' | 'mobile';
}

const HolidayTheming: React.FC<HolidayThemingProps> = ({ variant }) => {
  switch (variant) {
    case 'header':
      return <HolidayThemeHeader />;
    case 'desktop':
      return <HolidayThemeGalleryOverlay variant="desktop" />;
    case 'mobile':
      return <HolidayThemeGalleryOverlay variant="mobile" />;
    default:
      return null;
  }
};

export default HolidayTheming;
