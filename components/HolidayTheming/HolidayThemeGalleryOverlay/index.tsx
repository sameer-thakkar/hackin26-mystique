import React, { useContext } from 'react';
import { MBContext } from 'contexts/MBContext';
import { HOLIDAY_THEME_GALLERY_CONFIG } from '../../../constants/holidayTheming/holidayThemeConfig';
import { validateHolidayTheme } from '../../../utils/holidayThemeUtils';
import HolidayRiveFrame from '../HolidayRiveFrame';
import { IHolidayGalleryConfig } from '../interface';
import ParticleAnimation from '../ParticleEffect';

const HolidayThemeGalleryOverlay = ({
  variant = 'desktop',
}: {
  variant?: 'desktop' | 'mobile';
}) => {
  const { primaryCity } = useContext(MBContext);
  if (!primaryCity) return;

  const activeTheme = validateHolidayTheme(
    Object.values(HOLIDAY_THEME_GALLERY_CONFIG),
    primaryCity.cityCode,
    primaryCity.country?.displayName
  ) as IHolidayGalleryConfig;

  if (!activeTheme) return null;

  const animation =
    variant === 'desktop'
      ? activeTheme.animationConfig.desktop
      : activeTheme.animationConfig.mobile ??
        activeTheme.animationConfig.desktop;

  if (animation.illustrationType === 'animation') {
    return (
      <HolidayRiveFrame
        variant={variant}
        riveSrc={animation.assetUrl}
        anchor={animation.anchor}
      />
    );
  }

  const {
    particleIllustration,
    count,
    origin,
    minAssetSize,
    animationDurationInSeconds,
  } = animation;

  return (
    <ParticleAnimation
      particleIllustration={particleIllustration}
      count={count}
      origin={origin}
      minAssetSize={minAssetSize}
      animationDurationInSeconds={animationDurationInSeconds}
    />
  );
};

export default HolidayThemeGalleryOverlay;
