import type { TJumpLinkItem } from './components/JumpLinkItem/types';

export type TJumpLinksProps = {
  items: TJumpLinkItem[];
  className?: string;
  isDesktop?: boolean;
  trackEvent?: (eventData: any) => void;
};
