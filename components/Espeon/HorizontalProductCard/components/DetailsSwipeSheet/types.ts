import type { TLanguages } from 'components/Espeon/constants/localisation/types';

export type TDetailsSwipeSheetProps = {
  tour: any;
  labels: {
    pricing: {
      from: string;
      offPercentage: string;
      cashbackText: string;
    };
    highlightsMoreDetails: string;
    mainCta: string;
    close: string;
    discount: string;
  };
  currenciesMap: {
    [key: string]: any;
  };
  lang?: TLanguages;
  onCloseSwipeSheet?: () => void;
  onCtaClick?: () => void;
  onMoreDetailsClick?: () => void;
};
