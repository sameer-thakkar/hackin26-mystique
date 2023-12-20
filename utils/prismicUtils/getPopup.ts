import { createClient } from 'prismicio';
import { sendLog } from 'utils/logger';
import { CUSTOM_TYPES, DEFAULT_PRISMIC_LANG } from 'const/index';

const getPopup = async ({ uid }: { uid: string }) => {
  const prismicClient = createClient();
  const popup = await prismicClient.getByUID('popup', uid, {
    lang: DEFAULT_PRISMIC_LANG,
  });

  sendLog({
    message: {
      documentType: CUSTOM_TYPES.POPUP,
      functionality: 'getPopup',
      msg: 'Prismic API call from Canary',
    },
  });
  return popup;
};

export default getPopup;
