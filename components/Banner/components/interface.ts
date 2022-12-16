import { MouseEventHandler } from 'react';

export interface ITextOverlay {
  bannerHeading: string;
  hideCTA: boolean;
  bannerCtaText: string;
  onClick: MouseEventHandler<'button'>;
  isFirst?: boolean;
}
