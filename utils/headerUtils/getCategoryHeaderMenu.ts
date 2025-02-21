import { COOKIE, CUSTOM_TYPES, MB_CATEGORISATION } from 'const/index';
import getA2CatMBMenu from './getA2CatMBMenu';
import getA2SubcatMBMenu from './getA2SubcatMBMenu';
import getCollectionMBMenu from './getCollectionMBMenu';
import getNonCollectionMBMenu from './getNonCollectionMBMenu';

const getCategoryHeaderMenu = async ({
  doc,
  lang,
  ContentType,
  cookies,
}: {
  doc: Record<string, any>;
  lang: string;
  ContentType: string | undefined;
  cookies?: Record<string, any>;
}) => {
  if (!doc || !ContentType) return {};
  const currency = cookies?.[COOKIE.CURRENT_CURRENCY];

  const { data } = doc ?? {};

  let categorisationMetadata: TCategorisationMetadata;

  if (ContentType === CUSTOM_TYPES.MICROSITE) {
    const { baseLangCategorisationMetadata } = data || {};
    categorisationMetadata = baseLangCategorisationMetadata;
  } else {
    const {
      tagged_city,
      tagged_country,
      tagged_collection,
      tagged_category,
      tagged_sub_category,
      tagged_mb_type,
      tagged_page_type,
      primary_tag,
      shoulder_page_type,
      shoulder_page_custom_label,
      tagged_content_type,
    } = data;

    categorisationMetadata = {
      tagged_city,
      tagged_country,
      tagged_collection,
      tagged_category,
      tagged_sub_category,
      tagged_mb_type,
      tagged_page_type,
      primary_tag,
      shoulder_page_type,
      shoulder_page_custom_label,
      tagged_content_type,
    };
  }

  const { tagged_mb_type } = categorisationMetadata;

  let categoryHeaderMenu: Record<string, any>;

  switch (tagged_mb_type) {
    case MB_CATEGORISATION.MB_TYPE.A1_COLLECTION:
    case MB_CATEGORISATION.MB_TYPE.C1_COLLECTION:
      categoryHeaderMenu = await getCollectionMBMenu({
        lang,
        categorisationMetadata,
        currency,
      });
      break;
    case MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE:
    case MB_CATEGORISATION.MB_TYPE.A1_CATEGORY:
    case MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY:
    case MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE:
      categoryHeaderMenu = await getNonCollectionMBMenu({
        lang,
        categorisationMetadata,
        currency,
      });
      break;
    case MB_CATEGORISATION.MB_TYPE.A2_CATEGORY:
      categoryHeaderMenu = await getA2CatMBMenu({
        lang,
        categorisationMetadata,
        currency,
      });
      break;
    case MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY:
      categoryHeaderMenu = await getA2SubcatMBMenu({
        lang,
        categorisationMetadata,
        currency,
      });
      break;
    default:
      categoryHeaderMenu = {};
  }

  return categoryHeaderMenu;
};

export default getCategoryHeaderMenu;
