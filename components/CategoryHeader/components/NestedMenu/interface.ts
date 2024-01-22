import { TMenuItem } from 'components/CategoryHeader/interface';

export type NestedMenuProps = {
  categoryHeaderMenu: Record<string, TMenuItem>;
  selectedMenu: string;
  currentMenu?: string;
  handleSettingNestedMenu?: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleUnsettingNestedMenu?: (
    e: React.MouseEvent<HTMLDivElement | HTMLLIElement>
  ) => void;
  mbCity: string;
  isMobile: boolean;
};
