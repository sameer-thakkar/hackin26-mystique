export type TScrollableTabsProps = {
  tabNames: string[];
  children: JSX.Element[];
  isMobile: boolean;
  onClickCallback?: (tabName: string, index: number) => void;
};
