import type { DynamicOptionsLoadingProps } from 'next/dynamic';

export type TPageLoaderProps = {
  className?: string;
  gifSrc?: string;
  showBouncingLoader?: boolean;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
} & DynamicOptionsLoadingProps;
