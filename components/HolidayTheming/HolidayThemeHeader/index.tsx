import React, { useContext } from 'react';
import { MBContext } from 'contexts/MBContext';
import { HOLIDAY_THEME_HEADER_CONFIG } from '../../../constants/holidayTheming/holidayThemeConfig';
import { validateHolidayTheme } from '../../../utils/holidayThemeUtils';
import HolidayRiveFrame from '../HolidayRiveFrame';
import { IHolidayHeaderConfig } from '../interface';

const HolidayThemeHeader = () => {
  const { primaryCity, uid } = useContext(MBContext);

  if (!primaryCity) return;

  const activeTheme = validateHolidayTheme(
    Object.values(HOLIDAY_THEME_HEADER_CONFIG),
    uid,
    primaryCity.cityCode,
    primaryCity.country?.displayName
  ) as IHolidayHeaderConfig;

  if (!activeTheme || !activeTheme?.assetUrl) return null;

  return <HolidayRiveFrame variant="header" riveSrc={activeTheme.assetUrl} />;
};

export default HolidayThemeHeader;
