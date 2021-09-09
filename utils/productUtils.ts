import { RichText } from 'prismic-reactjs';
import { THEMES } from 'const/index';

export const extractTabsFromHighlights = (highlights) => {
  let tabs = [];
  const nonTabHighlights = highlights.reduce((acc, highlight) => {
    if (highlight.type === 'heading6') {
      tabs.push({
        type: 'tab',
        heading: RichText.asText([highlight]),
        contents: [],
      });
      return acc;
    }
    if (tabs.length) {
      tabs[tabs.length - 1].contents.push(highlight);
      return acc;
    } else return [...acc, highlight];
  }, []);

  return { highlights: nonTabHighlights, tabs };
};

export const getProductCardLayout = ({
  mbTheme,
  hasTags,
  hasOffer,
  hasV1Booster,
  hasShortSummary,
  hasNextAvailable,
  isTicketCard = false,
}) => {
  let layout = { desktop: [], mobile: [] };
  const hasIconBoosters = hasTags;
  switch (mbTheme) {
    case THEMES.MIN_BLUE:
      layout = {
        desktop: [
          'title cta-combo',
          hasIconBoosters && 'icon-booster cta-combo',
          hasOffer && 'offer cta-combo',
          hasV1Booster && 'booster cta-combo',
          (!hasOffer || !hasV1Booster) && '. cta-combo',
          'line line',
          'tags tags',
          'body body',
        ],
        mobile: [
          'title',
          'tags',
          'price-block',
          hasIconBoosters && 'icon-booster',
          hasOffer && 'offer',
          hasV1Booster && 'booster ',
          'body',
          'cta-block',
          hasNextAvailable && 'next-available',
        ],
      };
      break;
    case THEMES.DEF_INTERIM:
    case THEMES.DEFAULT:
    default:
      layout = layout = {
        desktop: [
          'title line cta-combo',
          hasShortSummary && 'summary line cta-combo',
          hasIconBoosters && 'icon-booster line cta-combo',
          hasOffer && 'offer line cta-combo',
          hasV1Booster && 'booster line cta-combo',
          'body line cta-combo',
          ((!hasV1Booster && !hasOffer) || !hasShortSummary) &&
            !isTicketCard &&
            '. line cta-combo',
        ],
        mobile: [
          'title title',
          hasNextAvailable && 'next-available next-available',
          `price-block ${hasIconBoosters ? 'icon-booster' : 'price-block'}`,
          hasOffer && 'offer offer',
          'summary summary',
          'tags tags',
          hasV1Booster && 'booster booster',
          'body body',
          'cta-block cta-block',
        ],
      };
      break;
  }
  layout = {
    mobile: layout.mobile.filter((row) => row),
    desktop: layout.desktop.filter((row) => row),
  };

  return layout;
};

export const getDescriptorIconURL = (icon, ext = 'svg') =>
  `${'https://cdn-imgix-open.headout.com/mb-icons/'}${icon}.${ext}`;

export const parseDescriptorIcon = (str) => {
  const {
    icon = 'check',
    descriptor,
    ext = 'svg',
  } = /(\{(?<icon>[\S]*)((\s*)?ext=(['"])?(?<ext>[^"'\s]*)?\S*?)?(\s*)?\})?(\s*)(?<descriptor>.*)/g.exec(
    str
  )?.groups;

  return {
    icon: icon ? getDescriptorIconURL(icon, ext) : null,
    descriptor,
  };
};

export const getContentBlocksMidIndex = (array) => {
  let totalWordCount = 0;
  let resultIndex = array.length / 2;
  array.forEach((element) => {
    totalWordCount += RichText.asText(element.contents).length;
  });

  let leftWordCount = 0;
  let flag = true;
  array.forEach((element, index) => {
    leftWordCount += RichText.asText(element.contents).length;
    if (leftWordCount >= totalWordCount / 2 && flag) {
      resultIndex = index;
      flag = false;
    }
  });
  return resultIndex + 1;
};

export const extractContentForProductCard = (markdownBlocks, contentBlocks) => {
  const tabsMarkdown = markdownBlocks
    ? extractTabsFromHighlights(markdownBlocks).tabs
    : [];

  let leftContent = [];
  let rightContent = [];

  if (tabsMarkdown.length > 0) {
    const filteredMarkdown = tabsMarkdown?.filter((md) => {
      const values = [
        'Theatre Name',
        'My Ticket',
        'Your Tickets',
        'Your Ticket',
        'Show Timings',
        'Duration',
        'Cancellation Policy',
        'Cancellation',
        'Age Limit',
      ];
      if (values.indexOf(md.heading) !== -1) {
        return md;
      }
    });
    const sliceValue = Math.floor(filteredMarkdown?.length / 2);
    const [tabsMarkdownLeft, tabsMarkdownRight] = [
      filteredMarkdown.slice(0, sliceValue),
      filteredMarkdown.slice(sliceValue, tabsMarkdown.length),
    ];

    const isLeftBlock = ['Theatre Name', 'Show Timings', 'Duration'];
    const isRightBlock = [
      'Your Tickets',
      'Your Ticket',
      'Cancellation Policy',
      'Cancellation',
      'Age Limit',
    ];
    tabsMarkdownLeft.forEach((highlight) => {
      if (isLeftBlock.includes(highlight?.heading)) {
        leftContent.push({
          heading: highlight.heading,
          contents: highlight.contents,
        });
      }
    });

    tabsMarkdownRight.forEach((highlight) => {
      const isCancellation =
        highlight?.heading === 'Cancellation Policy' ||
        highlight?.heading === 'Cancellation';

      if (isRightBlock.includes(highlight?.heading)) {
        if (isCancellation) {
          rightContent.push({
            heading: highlight.heading,
            contents: highlight.contents?.slice(0, 1),
          });
        } else {
          rightContent.push({
            heading: highlight.heading,
            contents: highlight.contents,
          });
        }
      }
    });
  } else {
    contentBlocks.left.forEach((highlight) => {
      leftContent.push({
        heading: highlight.label,
        contents: highlight.content,
      });
    });

    contentBlocks.right.forEach((highlight) => {
      rightContent.push({
        heading: highlight.label,
        contents: highlight.content,
      });
    });
  }
  return { left: leftContent, right: rightContent };
};

export const addCashbackValueToDescriptor = ({
  descriptor,
  cashbackValue,
}: {
  descriptor: string;
  cashbackValue: number;
}) => {
  if (!descriptor) return '';
  const regex = /({wallet}\s\w+)/g;
  const hasCashbackDescriptor = regex.test(descriptor);
  if (hasCashbackDescriptor) {
    if (cashbackValue) {
      const [cashbackDescriptor] = descriptor.match(regex) || [];
      const updatedDescriptor = `${cashbackDescriptor}: ${cashbackValue}%`;
      const finalString = descriptor.replace(regex, updatedDescriptor);
      return finalString;
    } else {
      const finalString = descriptor.replace(regex, '');
      return finalString;
    }
  } else {
    return descriptor;
  }
};
