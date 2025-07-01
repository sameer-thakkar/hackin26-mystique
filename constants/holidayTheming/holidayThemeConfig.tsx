import {
  IHolidayBaseProps,
  IHolidayGalleryConfig,
  IHolidayHeaderConfig,
} from '../../components/HolidayTheming/interface';

export const HOLIDAY_THEME_BASE_CONFIG: Record<string, IHolidayBaseProps> = {
  US_INDEPENDENCE: {
    regions: ['AMERICA'],
    startDate: '2025-06-28',
    endDate: '2025-07-05',
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
  US_INDEPENDENCE: {
    ...HOLIDAY_THEME_BASE_CONFIG.US_INDEPENDENCE,
    animationConfig: {
      desktop: {
        illustrationType: 'animation',
        assetUrl:
          'https://cdn-imgix-open.headout.com/holiday-theming/exp-gallery/us-independence-common.riv',
        artboard: 'MB dWeb Fireworks',
        anchor: 'bottom',
      },
      mobile: {
        illustrationType: 'animation',
        assetUrl:
          'https://cdn-imgix-open.headout.com/holiday-theming/exp-gallery/us-independence-common.riv',
        artboard: 'mWeb and app Fireworks',
        anchor: 'bottom',
      },
    },
  },
};
