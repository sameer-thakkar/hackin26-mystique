import { MetaTag } from 'next-seo/lib/types';

export const createAdditionalMetaTag = (
  property: string,
  content: string
): MetaTag => ({
  property,
  content,
});

export const createHrefLangObj = ({
  lang,
  href,
}: {
  lang: string;
  href: string;
}) => ({ hrefLang: lang, href });
