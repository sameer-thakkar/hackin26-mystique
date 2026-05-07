import TurndownService from 'turndown';
import { sendLog } from 'utils/logger';
import { LOG_LEVELS } from 'const/logs';

const markdownToRichtext = require('@ueno/markdown-to-prismic-richtext');

const COMMON_HTML_ENTITIES = ['quot', 'amp', 'lt', 'gt', 'apos', 'nbsp'];
const ENTITY_FIX_REGEX = new RegExp(
  `&(${COMMON_HTML_ENTITIES.join('|')})(?=[^\\w;])`,
  'g'
);
const turndownService = new TurndownService();

export const sanitizeMarkdownForRichText = (value = '') => {
  if (!value) return '';

  return value.replace(ENTITY_FIX_REGEX, '&$1;');
};

export const flattenRichTextContent = (items?: THighlight[]) =>
  items?.map((item: THighlight) => ({
    ...item,
    ...item.content,
  }));

export const safeMarkdownToRichtext = ({
  value = '',
  context,
}: {
  value?: string;
  context: string;
}) => {
  try {
    return markdownToRichtext(sanitizeMarkdownForRichText(value || ''));
  } catch (error) {
    sendLog({
      level: LOG_LEVELS.WARNING,
      err: error,
      message: `[tourGroups/richText] Richtext parse failed - ${context}`,
    });

    return [];
  }
};

const createTourTransformer = () => {
  const htmlRichTextCache = new Map<
    string,
    ReturnType<typeof flattenRichTextContent> | string
  >();
  const markdownRichTextCache = new Map<
    string,
    ReturnType<typeof flattenRichTextContent>
  >();

  const getRichTextFromHtmlContent = (
    properties = '',
    context = 'unknown html content'
  ) => {
    if (!properties) return '';

    if (htmlRichTextCache.has(properties)) {
      return htmlRichTextCache.get(properties);
    }

    const markedProperties = turndownService.turndown(properties);
    const richText = flattenRichTextContent(
      safeMarkdownToRichtext({
        value: markedProperties,
        context,
      })
    );
    htmlRichTextCache.set(properties, richText);

    return richText;
  };

  const getRichTextFromMarkdown = (
    properties = '',
    context = 'unknown markdown content'
  ) => {
    if (markdownRichTextCache.has(properties)) {
      return markdownRichTextCache.get(properties);
    }

    const richText = flattenRichTextContent(
      safeMarkdownToRichtext({
        value: properties || '',
        context,
      })
    );
    markdownRichTextCache.set(properties, richText);

    return richText;
  };

  return (tour: any) => ({
    ...tour,
    microBrandsHighlight: getRichTextFromMarkdown(
      tour.microBrandsHighlight,
      `tourGroupId=${tour?.id}, field=microBrandsHighlight`
    ),
    inclusionsRichText: getRichTextFromHtmlContent(
      tour.inclusions,
      `tourGroupId=${tour?.id}, field=inclusions`
    ),
    exclusionsRichText: getRichTextFromHtmlContent(
      tour.exclusions,
      `tourGroupId=${tour?.id}, field=exclusions`
    ),
  });
};

export const createSafeTourTransformer = () => {
  const transformTour = createTourTransformer();

  return (tour: Record<string, unknown>) => {
    try {
      return transformTour(tour);
    } catch (error) {
      sendLog({
        level: LOG_LEVELS.WARNING,
        err: error,
        message: `[tourGroups/richText] Tour transform failed - tourGroupId=${tour?.id}`,
      });

      return tour;
    }
  };
};
