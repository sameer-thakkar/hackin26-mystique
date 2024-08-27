import { BANNER_DESCRIPTORS } from 'const/index';
import { strings } from 'const/strings';

type BannerMap = () => Record<string, any>;
export const SUB_CATEGORY_BANNER: BannerMap = () => {
  return {
    '1019': [
      {
        icon: BANNER_DESCRIPTORS.EASY_BEST,
        text: strings.DESCRIPTORS.INSTANT_CONFIRMATION,
      },
      {
        icon: BANNER_DESCRIPTORS.INSTANT_MOBILE,
        text: strings.DESCRIPTORS.MOBILE_TICKET,
      },
      {
        icon: BANNER_DESCRIPTORS.SPARKS,
        text: strings.BANNER_DESCRIPTORS.BEST_PRICES,
      },
    ],
  };
};
