import { strings } from 'const/strings';
import { ELttOrBroadway } from './MobileBannerV2/interface';

export const getFirstBannerHeading = (
  index: number,
  originalBannerHeading: string,
  lttOrBroadway: ELttOrBroadway | null
) => {
  if (index === 0 && lttOrBroadway) {
    return strings.LTT_BROADWAY_BANNER[lttOrBroadway].BANNER_TITLE;
  }
  return originalBannerHeading;
};
