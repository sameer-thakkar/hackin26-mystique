import type {
  EMediaSourceType,
  EMediaType,
} from 'components/Espeon/constants/media';

export type TClassName = {
  className?: string;
};

export type TMedia<T = null> = {
  url: string;
  type: T extends null ? EMediaType : T;
  metadata?: {
    altText?: string;
    height?: number;
    width?: number;
    videoDuration?: number | null;
    uploadDate: string;
    filename?: string | null;
    fileSize?: number;
  };
  info?: {
    sourceType: EMediaSourceType;
    sourceUrl?: string | null;
    credit?: string | null;
    filename?: string | null;
    fileSize?: number | null;
    title?: string | null;
    videoFallbackUrl?: string | null;
    imageRedirectUrl?: string | null;
  };
};

export type TCookies = {
  cookies?: Partial<{ [key: string]: string }>;
};

export type TMarkdownHighlights = {
  title: string;
  content: string;
};

export type TTourgroupItem = any;
export type TTourgroupItems = TTourgroupItem[];

export type TListingPrice = any;

export type TCurrency = any;
export type TCurrencyCode = any;
