import { TMenu } from 'components/CategoryHeader/components/ExpandedMenu/interface';

export type NestedMenuItemProps = {
  menuData: Record<string, TMenu | Record<string, TMenu>>;
  handleSettingNestedMenu?: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleUnsettingNestedMenu?: (
    e: React.MouseEvent<HTMLDivElement | HTMLLIElement>
  ) => void;
  mbCity: string;
  isMobile: boolean;
};
