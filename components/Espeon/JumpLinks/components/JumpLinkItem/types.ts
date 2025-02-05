type TItemImage = {
  url: string;
  alt: string;
};

export type TJumpLinkItem = {
  title: string;
  subtitle: string;
  images: TItemImage[];
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  scrollToElement?: HTMLElement;
  scrollToId?: string;
  slideShowInterval?: number;
  scrollTopOffset?: number;
  isClickable?: boolean;
  eventData?: any;
};
