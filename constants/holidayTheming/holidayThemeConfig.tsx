import {
  IHolidayBaseProps,
  IHolidayGalleryConfig,
  IHolidayHeaderConfig,
} from '../../components/HolidayTheming/interface';

export const HOLIDAY_THEME_BASE_CONFIG: Record<string, IHolidayBaseProps> = {
  EASTER: {
    regions: ['EUROPE', 'AMERICA', 'OCEANIA', 'APAC'],
    startDate: '2025-04-16',
    endDate: '2025-04-21',
  },
};

export const HOLIDAY_THEME_HEADER_CONFIG: Record<string, IHolidayHeaderConfig> =
  {
    // to be populated when we have header assets
  };

export const HOLIDAY_THEME_GALLERY_CONFIG: Record<
  string,
  IHolidayGalleryConfig
> = {
  EASTER: {
    ...HOLIDAY_THEME_BASE_CONFIG.EASTER,
    animationConfig: {
      desktop: {
        illustrationType: 'animation',
        assetUrl:
          'https://cdn-imgix-open.headout.com/holiday-theming/exp-gallery/desktop-easter.riv',
        anchor: 'bottom',
      },
      mobile: {
        illustrationType: 'animation',
        assetUrl:
          'https://cdn-imgix-open.headout.com/holiday-theming/exp-gallery/mweb-easter.riv',
        anchor: 'bottom',
      },
    },
  },
};
