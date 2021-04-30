import { getHeadoutLanguagecode } from 'utils';

export const fetchCategory = async (categoryId: string, lang: string) => {
  try {
    const headoutLang = getHeadoutLanguagecode(lang);
    const response = await fetch(
      `https://api.headout.com/api/v1/feed/category/get/${categoryId}?language=${headoutLang}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[fetchCategory]', error);
  }
};
