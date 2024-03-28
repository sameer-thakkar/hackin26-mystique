import { createClient } from 'prismicio';
import { AlternateLanguage, KeyTextField } from '@prismicio/types';
import { getHeadoutLanguagecode } from 'utils';
import { getUID } from 'utils/helper';
import { sendLog } from 'utils/logger';
import { traceError } from 'utils/logutils';
import { convertUidToUrl, sanitizeURL } from 'utils/urlUtils';
import { DEFAULT_PRISMIC_LANG, MICROBRANDS_URL } from 'const/index';
import { AllDocumentContentTypes } from './interface';

type TGetDocContentType = {
  uid: string;
  lang: string;
  isDev: boolean;
  host?: string;
};

type TGetCanonicalLinkFromBaseLangData = Omit<
  TGetDocContentType,
  'uid' | 'lang'
> & {
  baseLangCanonicalLink: KeyTextField;
  currentPageLang: string;
};

type TFetchCanonicalUids = {
  docType: AllDocumentContentTypes;
  uid: string;
};

const fetchAlternateCanonicalUids = async ({
  uid,
  docType,
}: TFetchCanonicalUids) => {
  try {
    const prismicClient = createClient();
    const data = await prismicClient.getByUID(docType, uid);

    if (!data) return null;
    return data.alternate_languages as AlternateLanguage<
      TFetchCanonicalUids['docType'],
      string
    >[];
  } catch (error) {
    sendLog({
      message: `[fetchCanonicalUids]: ${uid} ${docType}`,
      err: error,
    });
    return null;
  }
};

export const getDocContentType = async ({
  uid,
  lang,
  host,
  isDev,
}: TGetDocContentType) => {
  const domain = isDev ? `http://${host}` : MICROBRANDS_URL;
  const endpoint = `${domain}/api/prismic/get-document-type/${uid}/`;
  let contentTypeResponse: Response;
  try {
    contentTypeResponse = await fetch(endpoint);

    const contentType = await contentTypeResponse.json();
    return contentType;
  } catch (err) {
    traceError({ error: err, uid, lang });

    sendLog({
      message: `[getDocumentType] Error fetching document-type for ${uid} (${lang})`,
      err,
    });

    return '';
  }
};

/**
 * The function `getCanonicalLinkFromBaseLangData` retrieves the canonical link for a specific language based on the base language's canonical url.
 * We are not relying on localised canonical links anymore.
 * Since, we have localised uid, we will have to fetch the canonical page and return the actual url instead of the english url
 * @returns The function `getCanonicalLinkFromBaseLangData` returns either a canonical URL string or `null` based on certain conditions.
 */
const getCanonicalLinkFromBaseLangData = async ({
  baseLangCanonicalLink,
  currentPageLang,
  host,
  isDev,
}: TGetCanonicalLinkFromBaseLangData) => {
  if (!baseLangCanonicalLink) return null;

  if (currentPageLang === DEFAULT_PRISMIC_LANG) {
    return new URL(sanitizeURL(baseLangCanonicalLink)).toString();
  }

  const canonicalUid = getUID(baseLangCanonicalLink);

  const contentType = await getDocContentType({
    uid: canonicalUid,
    isDev,
    host,
    lang: currentPageLang,
  });

  if (!contentType?.type) return null;

  const alternateCanonicalUids = await fetchAlternateCanonicalUids({
    uid: canonicalUid,
    docType: contentType.type,
  });

  if (!alternateCanonicalUids || !alternateCanonicalUids?.length) return null;

  const canonicalUidObj = alternateCanonicalUids.find(
    (altCanonical) => altCanonical.lang === currentPageLang
  );

  if (!canonicalUidObj) return null;
  const url = convertUidToUrl({
    uid: canonicalUidObj.uid,
    lang: getHeadoutLanguagecode(canonicalUidObj.lang),
  });

  return url;
};

export default getCanonicalLinkFromBaseLangData;
