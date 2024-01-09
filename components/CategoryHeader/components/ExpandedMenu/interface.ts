import { TMenuItem } from 'components/CategoryHeader/interface';

export type ExpandedMenuProps = {
  categoryHeaderMenu: Record<string, TMenuItem>;
  isExpanded: boolean;
  selectedMainMenu: Record<string, string>;
  mbCity: string;
  isMobile: boolean;
};

export type TMenu = {
  label: string;
  url: string;
  collectionId?: number;
};
