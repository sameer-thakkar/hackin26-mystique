import {
  EImagePlaceholder,
  TCropMode,
  TFit,
} from 'components/Espeon/Common/Image/types';
import { addQueryParams } from 'components/Espeon/utils/url';
import { toBase64 } from './common';

type TGenerateImgixUrl = {
  format: string;
  url: string;
  width: number | string;
  height: number | string;
  quality: number | string;
  fit?: TFit;
  aspectRatio?: string;
  autoCrop: boolean;
  cropMode?: TCropMode | Array<TCropMode>;
  addDarkOverlay: boolean;
  blurFill: boolean;
  density?: number;
};

const getShimmerStringSVGMarkup = (width = 160, height = 100) => `
    <svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#e6e5e5" offset="20%" />
          <stop stop-color="#f9f7f78c" offset="50%" />
          <stop stop-color="#e6e5e5" offset="100%" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="#e6e5e5" />
      <rect id="r" width="${
        width * 0.567375887
      }" height="${height}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `;

export const generateImgixUrl = ({
  format,
  url,
  width,
  height,
  quality,
  fit = 'clip',
  aspectRatio,
  autoCrop,
  cropMode,
  addDarkOverlay,
  blurFill,
  density = 1.2,
}: TGenerateImgixUrl) => {
  if (!url) return '';
  if (format === 'gif') return url;
  if (url.includes('nocompress')) return url.split('?')[0] || '';

  const imigxOptionsQueryParams = new URLSearchParams();
  const extractedRect = /rect=[\d,.]*/.exec(url);

  imigxOptionsQueryParams.set('auto', 'compress');
  imigxOptionsQueryParams.set('auto', 'format');

  if (width) imigxOptionsQueryParams.set('w', `${Number(width) * density}`);
  if (height) imigxOptionsQueryParams.set('h', `${Number(height) * density}`);
  if (quality) imigxOptionsQueryParams.set('q', `${Number(quality) * density}`);

  if (aspectRatio) {
    imigxOptionsQueryParams.set('ar', `${aspectRatio}`);
    fit = 'crop';
  }

  if (autoCrop) {
    imigxOptionsQueryParams.set('crop', 'faces');
    fit = 'crop';
  }

  if (cropMode) {
    imigxOptionsQueryParams.set(
      'crop',
      Array.isArray(cropMode) ? cropMode.join(',') : cropMode
    );
    if (cropMode.includes('focalpoint')) {
      imigxOptionsQueryParams.set('fp-x', '0.5');
      imigxOptionsQueryParams.set('fp-y', '0.5');
    }
    fit = 'crop';
  }

  //TODO - revert after showpage revamp
  if (blurFill) {
    imigxOptionsQueryParams.set('fill', EImagePlaceholder.Blur);
    fit = 'fill';
  }

  if (addDarkOverlay) imigxOptionsQueryParams.set('exp', '-10');

  if (fit) imigxOptionsQueryParams.set('fit', fit);

  return addQueryParams({
    url,
    queryParams: new URLSearchParams(
      `${imigxOptionsQueryParams}${extractedRect ? `&${extractedRect}` : ''}`
    ),
    replaceExistingParams: true,
  });
};

export const getBlurDataUrl = (width: number, height: number) =>
  `data:image/svg+xml;base64,${toBase64(
    getShimmerStringSVGMarkup(width, height)
  )}`;
