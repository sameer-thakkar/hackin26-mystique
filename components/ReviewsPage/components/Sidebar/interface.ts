import { TourGroupDataType } from 'components/NewsPage/interface';
import { Chip } from 'components/slices/ReviewChips/interface';

export type TSidebarProps = {
  experienceData: TourGroupDataType;
  verticalImageUrl: string;
  showPageUid: string;
  reviewChipsHeading: string;
  reviewChipsRepeatableContent: Chip[];
  productImageUrl: string;
};
