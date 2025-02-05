import type { MouseEventHandler, ReactEventHandler } from 'react';
// import type { OnLoadingComplete } from 'next/dist/shared/lib/get-img-props';
import type { TClassName } from 'components/Espeon/types';

export type TFit =
  | 'clamp'
  | 'clip'
  | 'crop'
  | 'facearea'
  | 'fill'
  | 'fillmax'
  | 'max'
  | 'min'
  | 'scale';

export type TCropMode =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'faces'
  | 'focalpoint'
  | 'edges'
  | 'entropy';

export enum EImageFetchPriority {
  High = 'high',
  Low = 'low',
  Auto = 'auto',
}

export enum EImagePlaceholder {
  Blur = 'blur',
  Empty = 'empty',
}

export enum EImageLoading {
  Eager = 'eager',
  Lazy = 'lazy',
}

export type TImage = TClassName & {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: EImageLoading;
  mobileUrl?: string;
  aspectRatio?: string;
  quality?: number;
  format?: string;
  autoCrop?: boolean;
  addDarkOverlay?: boolean;
  imageId?: string;
  fit?: TFit;
  cropMode?: TCropMode | Array<TCropMode>;
  fill?: boolean;
  blurFill?: boolean;
  priority?: boolean;
  fetchPriority?: EImageFetchPriority;
  placeholder?: EImagePlaceholder | string;
  fallbackImgUrl?: string;
  attribution?: React.ReactNode;
  isMobile?: boolean;
  onClick?: MouseEventHandler;
  onKeyDown?: ReactEventHandler;
  onLoad?: ReactEventHandler;
  onLoadingComplete?: any;
  density?: number;
};
