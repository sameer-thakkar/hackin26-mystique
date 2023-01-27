import { attachQueryParam } from '../../../utils/helper';

export const generateImageImgixUrl = (
  format: string,
  url: string,
  width: number | string,
  height: number | string,
  quality: number | string,
  aspectRatio: string,
  autoCrop: boolean,
  addDarkOverlay: boolean,
  fitCrop: boolean,
  blurFill: boolean
): string => {
  if (!url) {
    return null;
  }

  if (url?.includes('nocompress')) {
    return url?.split('?')?.[0];
  }

  if (format === 'gif') return url;

  const imigxOptionsQueryParams = new URLSearchParams(),
    extractedRect = /rect=[\d,.]*/.exec(url);

  imigxOptionsQueryParams.set('auto', 'compress');
  imigxOptionsQueryParams.set('auto', 'format');

  if (width) imigxOptionsQueryParams.set('w', `${Number(width) * 1.5}`);
  if (height) imigxOptionsQueryParams.set('h', `${Number(height) * 1.5}`);
  if (quality) imigxOptionsQueryParams.set('q', `${Number(quality)}`);

  imigxOptionsQueryParams.set('fit', 'fit');

  if (aspectRatio) {
    imigxOptionsQueryParams.set('ar', `${aspectRatio}`);
    imigxOptionsQueryParams.set('fit', 'crop');
  }

  if (autoCrop) {
    imigxOptionsQueryParams.set('crop', 'faces');
    imigxOptionsQueryParams.delete('fit');
  }

  if (fitCrop) {
    imigxOptionsQueryParams.set('fit', 'crop');
  }

  //TODO - revert after showpage revamp
  if (blurFill) {
    imigxOptionsQueryParams.set('fill', 'blur');
    imigxOptionsQueryParams.set('fit', 'fill');
  }

  if (addDarkOverlay) {
    imigxOptionsQueryParams.set('exp', '-10');
  }

  return attachQueryParam(
    url,
    `${imigxOptionsQueryParams.toString()}${
      extractedRect ? `&${extractedRect}` : ''
    }`,
    true
  );
};

const getShimmerStringSVGMarkup = (w = 160, h = 100) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#e6e5e5" offset="20%" />
        <stop stop-color="#f9f7f78c" offset="50%" />
        <stop stop-color="#e6e5e5" offset="100%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#e6e5e5" />
    <rect id="r" width="${w * 0.567375887}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>
`;

const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export const getBlurDataUrl = (width: number, height: number) => {
  return `data:image/svg+xml;base64,${toBase64(
    getShimmerStringSVGMarkup(width, height)
  )}`;
};
