import type { PrismicDocumentWithUID } from '@prismicio/types';
import { DOCUMENT_PRIORITY } from 'const/header';

const getRankedDocuments = ({
  docs,
  ranking = DOCUMENT_PRIORITY,
}: {
  docs: PrismicDocumentWithUID[];
  ranking?: Array<string>;
}): PrismicDocumentWithUID[] => {
  return docs.sort(
    (docA, docB) =>
      ranking.indexOf(docA?.data?.tagged_mb_type) -
      ranking.indexOf(docB?.data?.tagged_mb_type)
  );
};
export default getRankedDocuments;
