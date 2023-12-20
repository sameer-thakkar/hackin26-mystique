import { createClient } from 'prismicio';
import { sendLog } from 'utils/logger';

export const getTopAttractionsDoc = async ({
  cityName,
  subcategoryId,
  lang = 'en',
}: {
  cityName: string;
  subcategoryId: number | string;
  lang: string | undefined | null;
}) => {
  const prismicClient = createClient();
  const uid = `${cityName?.toLowerCase()}-${subcategoryId}`;
  try {
    const topAttractionsDoc = await prismicClient.getByUID(
      'top_attractions',
      uid,
      {
        ...(lang && { lang }),
      }
    );
    const { data } = topAttractionsDoc || {};
    return data;
  } catch (error) {
    sendLog({
      err: error,
      message: `getTopAttractionsDoc failed. UID: ${uid}`,
    });
  }
};
