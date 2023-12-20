import { createClient } from 'prismicio';
import { sendLog } from 'utils/logger';
import { CUSTOM_TYPES, DEFAULT_PRISMIC_LANG } from 'const/index';

const getPromoCodesDocument = async () => {
  try {
    const prismicClient = createClient();

    const promoCodesResponse = await prismicClient.getSingle('promo_codes', {
      lang: DEFAULT_PRISMIC_LANG,
    });

    sendLog({
      message: {
        documentType: CUSTOM_TYPES.PROMO_CODES,
        lang: DEFAULT_PRISMIC_LANG,
        functionality: 'promoCodesResponse',
        msg: 'Prismic API call from Canary',
      },
    });
    const { promos } = promoCodesResponse?.data;
    return promos;
  } catch (error) {
    sendLog({
      message: `${CUSTOM_TYPES.PROMO_CODES}`,
      err: error,
    });
    return Promise.reject();
  }
};

export default getPromoCodesDocument;
