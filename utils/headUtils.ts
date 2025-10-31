import { MetaTag } from 'next-seo/lib/types';
import { FAVICON_LONDON_THEATRE_TICKETS, HO_FAVICONS } from 'const/seo';

export const createAdditionalMetaTag = ({
  content,
  property,
  name,
  httpEquiv,
}: MetaTag) => ({
  ...(property && { property }),
  content,
  ...(name && { name }),
  ...(httpEquiv && { httpEquiv }),
});

export const createHrefLangObj = ({
  lang,
  href,
}: {
  lang: string;
  href: string;
}) => ({ hrefLang: lang, href });

/**
 * Generates favicon link tags for the head section.
 * Returns multiple favicon sizes for all MB domains except LLT where we use a custom favicon.
 */
export const generateHoFaviconLinkTags = ({
  isLttMb,
  lttFaviconUrl,
}: {
  isLttMb: boolean;
  lttFaviconUrl?: string;
}) => {
  if (!isLttMb) {
    return Object.entries(HO_FAVICONS).map(([size, href]) => ({
      rel: 'icon',
      href,
      sizes: `${size}x${size}`,
      type: 'image/png',
    }));
  }
  return [
    { rel: 'icon', href: lttFaviconUrl || FAVICON_LONDON_THEATRE_TICKETS },
  ];
};
