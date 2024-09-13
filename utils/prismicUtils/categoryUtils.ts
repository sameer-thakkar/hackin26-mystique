import categoryTourListParserV1 from 'utils/parsers/categoryTourListParserV1';
import { LANGUAGE_MAP } from 'const/index';

export const getCategoryData = async ({
  productCardData,
  hostname,
  lang,
  cookies,
  localizedStrings,
}: {
  productCardData: any;
  hostname: string;
  lang: string;
  cookies: any;
  localizedStrings: any;
}) => {
  const categoryTourListData = await categoryTourListParserV1({
    shoulderPageTicketsCard: productCardData,
    hostname,
    lang: lang ?? LANGUAGE_MAP.en.code,
    cookies,
    localizedStrings,
  });
  const minPrice = categoryTourListData.minPrice;
  const bestDiscount = categoryTourListData.bestDiscount;
  const { activeCurrency, primaryCity, primaryCountry } =
    categoryTourListData || {};

  return {
    categoryTourListData,
    minPrice,
    bestDiscount,
    ...(primaryCity && { primaryCity }),
    ...(primaryCountry && { primaryCountry }),
    ...(activeCurrency && { activeCurrency }),
  };
};
