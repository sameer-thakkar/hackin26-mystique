import { TMenuItem } from 'components/CategoryHeader/interface';

export type DeepNestedMenuProps = {
  categoryHeaderMenu: Record<string, TMenuItem>;
  selectedMainMenu?: { label: string };
  selectedNestedMenu?: string;
  mbCity: string;
  isMobile: boolean;
};
