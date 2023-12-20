import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { fetchTourListV6 } from 'utils/apiUtils';

const getListicleCategories = async ({
  uid,
  lang,
  hostname,
}: {
  uid: string;
  lang: string;
  hostname?: string;
}) => {
  const prismicClient = createClient();
  const prismicDocs = await prismicClient.getAllByType('tour', {
    lang,
    predicates: [predicate.any('document.tags', [uid])],
  });

  const tgids = new Set(
    prismicDocs
      .filter((doc) => doc?.data?.tgid)
      ?.map((d) => String(d.data.tgid))
  );

  const tourGroups = await fetchTourListV6({
    hostname,
    tgids: Array.from(tgids),
  });
  return tourGroups;
};
export default getListicleCategories;
