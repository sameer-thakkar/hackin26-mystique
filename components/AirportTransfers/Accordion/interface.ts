type ClickableRegionTypes = 'header' | 'whole';

interface IOpenHandler {
  handleSelection: Function;
  currentStep: string;
}

export interface IAccordionProps {
  header: React.ReactNode;
  children: React.ReactNode;
  customIcon?: React.ReactNode;
  clickEvent?: (x: { accordionState: boolean }) => void;
  isAccordionPanelOpen?: boolean;
  ignoredElementsForClickBubbling?: Array<string>;
  clickableRegion?: ClickableRegionTypes;
  addHeaderPadding?: boolean;
  isDisabled?: boolean;
  isDesktop?: boolean;
  openHandler?: IOpenHandler;
  isFirst?: boolean;
  isLast?: boolean;
}
