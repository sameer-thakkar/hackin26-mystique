import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {
  IHolidayGalleryConfig,
  IHolidayHeaderConfig,
} from '../components/HolidayTheming/interface';
import { MARKET_WISE_COUNTRIES } from '../constants/holidayTheming';
import { checkIf911MemorialMBPage } from './helper';

dayjs.extend(isBetween);

type ThemeConfig = IHolidayHeaderConfig | IHolidayGalleryConfig;

export const validateHolidayTheme = (
  themeConfig: ThemeConfig[],
  uid: string,
  currentCity?: string,
  currentCountry?: string
): IHolidayHeaderConfig | IHolidayGalleryConfig | null => {
  if (
    !currentCity ||
    !currentCountry ||
    currentCity.toUpperCase() === 'KRAKOW' ||
    checkIf911MemorialMBPage(uid)
  )
    return null;

  const currentDate = dayjs();
  return (
    themeConfig.find((theme) => {
      const startDate = new Date(theme.startDate);
      const endDate = new Date(theme.endDate);
      const isWithinDateRange = currentDate.isBetween(
        dayjs(startDate),
        dayjs(endDate),
        'day',
        '[]'
      );

      return (
        theme.regions.some((region) =>
          MARKET_WISE_COUNTRIES[region]?.includes(currentCountry)
        ) &&
        isWithinDateRange &&
        !theme.disabledCities?.includes(currentCity)
      );
    }) || null
  );
};
