import { createClient } from 'prismicio';
import { sendLog } from 'utils/logger';
import { CUSTOM_TYPES } from 'const/index';

const getSafetyBannerDocument = async ({ lang }: { lang: string }) => {
  try {
    const prismicClient = createClient();
    const safetyBannerResponse = await prismicClient.getSingle(
      'safety_banner',
      {
        lang,
      }
    );
    const { data } = safetyBannerResponse ?? {};
    const { options } = data ?? {};
    return options;
  } catch (error) {
    sendLog({
      message: `${CUSTOM_TYPES.SAFETY_BANNER}`,
      err: error,
    });
  }
};
export default getSafetyBannerDocument;
