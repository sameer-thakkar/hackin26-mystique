import { TMenu } from 'components/CategoryHeader/components/ExpandedMenu/interface';

export type TMenuItem = {
  label: string;
  mainMenu: boolean;
  menu: Record<string, TMenu | Record<string, TMenu>>;
};

export type CategoryHeaderProps = {
  categoryHeaderMenu: Record<string, TMenuItem>;
  taggedCity: string | null;
  primaryCity: Record<string, any>;
  languages?: Array<Record<string, any>>;
  currentLanguage?: string;
  isMobile: boolean;
};
