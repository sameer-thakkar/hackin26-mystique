import { createClient } from 'prismicio';
import { DEFAULT_PRISMIC_LANG } from 'const/index';

const getPopup = async ({ uid }: { uid: string }) => {
  const prismicClient = createClient();
  const popup = await prismicClient.getByUID('popup', uid, {
    lang: DEFAULT_PRISMIC_LANG,
  });
  return popup;
};

export default getPopup;
