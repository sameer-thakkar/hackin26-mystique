import { FLAGS_FOLDER_URL } from 'const/index';

export const getCountryFlagUrl = (countryCode?: string) =>
  FLAGS_FOLDER_URL + '/' + countryCode?.toLowerCase() + '.svg';
