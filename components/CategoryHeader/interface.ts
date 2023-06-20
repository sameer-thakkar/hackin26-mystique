import { TMenu } from 'components/CategoryHeader/components/ExpandedMenu/interface';

export type TMenuItem = {
  label: string;
  mainMenu: boolean;
  menu: Record<string, TMenu | Record<string, TMenu>>;
};

export type CategoryHeaderProps = {
  categoryHeaderMenu: Record<string, TMenuItem>;
  taggedCity: string;
  primaryCity: Record<string, any>;
  isMobile: boolean;
};
