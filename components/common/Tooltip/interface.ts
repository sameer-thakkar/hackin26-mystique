export type TooltipProps = {
  heading?: string;
  content?: string;
  trigger?: any;
  showClose?: true;
  showCTA?: boolean;
  onHover?: () => void;
  triggerClassName?: string;
  showHeadingForDesktop?: boolean;
};
