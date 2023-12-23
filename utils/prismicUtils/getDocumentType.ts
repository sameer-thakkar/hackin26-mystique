import type { NextApiRequest } from 'next';
import { createClient } from 'prismicio';
import type { AllDocumentContentTypes, TGetContentType } from './interface';

export const getDocumentType = async ({ req, uid, type }: TGetContentType) => {
  const prismicClient = createClient({
    req,
  });
  // Querying all languages because of localized uids
  const documentType = prismicClient.getByUID(type, uid, {
    lang: '*',
    fetch: `${type}.uid`,
  });
  return documentType;
};

export const generateDocumentTypePromises = ({
  documentTypesArray,
  req,
  uid,
}: {
  documentTypesArray: AllDocumentContentTypes[];
  req: NextApiRequest;
  uid: string;
}) =>
  documentTypesArray.map((type) =>
    getDocumentType({
      req,
      uid,
      type,
    })
  );
