import { MetaTag } from 'next-seo/lib/types';

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
