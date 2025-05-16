import type { PrismicDocumentWithUID } from '@prismicio/types';
import { getHeadoutLanguagecode, legacyBooleanCheck } from 'utils';
import { getStructure } from 'utils/lookerUtils';
import { convertUidToUrl } from 'utils/urlUtils';
import { PAGE_URL_STRUCTURE, SEO_SUBDOMAINS } from 'const/index';

const shouldIncludeinQueries = (
  doc: PrismicDocumentWithUID,
  pageUid: string = ''
) => {
  const { uid, lang, data } = doc || {};

  if (uid === pageUid) return false;

  const { noindex, redirect_url, canonical_link } = data || {};
  const pageUrl = convertUidToUrl({
    uid,
    lang: getHeadoutLanguagecode(lang),
  });
  const isSelfCanonical = !canonical_link || pageUrl === canonical_link;

  if (!pageUrl || !!redirect_url?.url || !isSelfCanonical) return false;

  const url = new URL(pageUrl);
  const isSubdomain =
    getStructure(url) === PAGE_URL_STRUCTURE.SUBDOMAIN ||
    getStructure(url) === PAGE_URL_STRUCTURE.SUBDOMAIN_SUBFOLDER;
  const parentDomainUrl = convertUidToUrl({
    uid: url.hostname,
    lang: getHeadoutLanguagecode(lang),
  });
  const isSeoSubdomain =
    SEO_SUBDOMAINS.includes(pageUrl) ||
    SEO_SUBDOMAINS.includes(parentDomainUrl);

  const finalNoIndex =
    isSubdomain && !isSeoSubdomain ? true : legacyBooleanCheck(noindex);

  return !finalNoIndex;
};

export default shouldIncludeinQueries;
