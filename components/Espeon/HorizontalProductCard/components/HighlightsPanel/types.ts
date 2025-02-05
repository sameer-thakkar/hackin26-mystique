import type { PropsWithChildren } from 'react';
import type { TClassName } from 'components/Espeon/types';

export type THighlightsPanel = PropsWithChildren<
  TClassName & {
    detailsLabel: string;
    onCtaClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    panelHeight?: number;
  }
>;
