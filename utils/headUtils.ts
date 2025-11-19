import { MetaTag } from 'next-seo/lib/types';
import { HO_FAVICONS } from 'const/seo';

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
 * Returns multiple favicon sizes for all MB domains.
 */
export const generateHoFaviconLinkTags = () => {
  return Object.entries(HO_FAVICONS).map(([size, href]) => ({
    rel: 'icon',
    href,
    sizes: `${size}x${size}`,
    type: 'image/png',
  }));
};
