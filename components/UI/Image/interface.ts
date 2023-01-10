import { ImageProps } from 'next/image';

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
  fill?: boolean;
  blurFill?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
}
