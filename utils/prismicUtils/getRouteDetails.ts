import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { sendLog } from 'utils/logger';
import {
  CUSTOM_TYPES,
  DEFAULT_PRISMIC_LANG,
  PRISMIC_DEV_TAG,
} from 'const/index';

const getRouteDetailsDoc = async ({
  tgids,
  lang = DEFAULT_PRISMIC_LANG,
}: {
  tgids: Array<number | string>;
  lang: string;
}): Promise<Record<string, any>> => {
  const uidsArr = tgids?.map((el) => `${el}-route`);
  try {
    const prismicClient = createClient();
    const { results } =
      (await prismicClient.getByType('hoho_routes', {
        pageSize: 100,
        predicates: [
          predicate.not('document.tags', [PRISMIC_DEV_TAG]),
          predicate.any(`my.${CUSTOM_TYPES.HOHO_ROUTES}.uid`, uidsArr),
        ],
        lang,
      })) ?? {};
    const routeData = results?.reduce(
      (acc: Record<string, any>, elem: Record<string, any>) => {
        return {
          ...acc,
          [elem?.uid]: elem?.data,
        };
      },
      {}
    );
    return routeData;
  } catch (error) {
    sendLog({
      err: error,
      message: `getRouteDetailsDoc failed. UID: ${JSON.stringify(uidsArr)}`,
    });
    return [];
  }
};

export default getRouteDetailsDoc;
