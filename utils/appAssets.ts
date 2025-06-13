import { DOWNLOAD_APP_SECTION_ASSETS_BY_LANG } from 'constants/apps';

interface DownloadAppAssets {
  PLAY_STORE_IMAGE_URL: string;
  APP_STORE_IMAGE_URL: string;
  PLAY_STORE_IMAGE_URL_LIGHT: string;
  APP_STORE_IMAGE_URL_LIGHT: string;
  PLAY_STORE_LINK: string;
  APP_STORE_LINK: string;
}

export const getDownloadAppAssets = (
  languageCode: string = 'en'
): DownloadAppAssets => {
  const langAssets =
    DOWNLOAD_APP_SECTION_ASSETS_BY_LANG[
      languageCode as keyof typeof DOWNLOAD_APP_SECTION_ASSETS_BY_LANG
    ] || DOWNLOAD_APP_SECTION_ASSETS_BY_LANG['en'];

  return {
    ...langAssets,
  };
};
