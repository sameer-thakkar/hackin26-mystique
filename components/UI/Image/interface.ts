import { ImageProps } from 'next/future/image';

export type TCropMode =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'faces'
  | 'focalpoint'
  | 'edges'
  | 'entropy'
  | 'center'
  | '';

export interface IImageProps
  extends Omit<ImageProps, 'src' | 'width' | 'height'> {
  url: string;
  mobileUrl?: string;
  aspectRatio?: string;
  format?: string;
  attribution?: string;
  autoCrop?: boolean;
  addDarkOverlay?: boolean;
  width?: number | string;
  height?: number | string;
  imageId?: string;
  fitCrop?: boolean;
  minFit?: boolean;
  cropMode?: TCropMode | Array<TCropMode>;
  fill?: boolean;
  blurFill?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  fallbackImg?: string;
  loadLowerQualityImageFirst?: boolean;
}
