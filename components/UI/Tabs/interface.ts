export type TTabsProps = {
  activeTab?: string;
  onChangeTab?: (tab: TTabListItemProps) => void;
  tabListItems?: TTabListItemProps[];
};

export type TTabPanelProps = {
  value: string;
};

export type TTabActiveMarker = {
  left: string;
  width: string;
};

export type TTabListItemProps = {
  label: string;
  id: string;
};
