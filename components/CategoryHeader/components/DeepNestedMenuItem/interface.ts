import { TMenuItem } from 'components/CategoryHeader/interface';

export type DeepNestedMenuItemProps = {
  categoryHeaderMenu: Record<string, TMenuItem>;
  selectedNestedMenu?: string;
  mbCity: string;
};
