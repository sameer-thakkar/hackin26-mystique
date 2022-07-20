import { RichText } from 'prismic-reactjs';
import dayjs from 'dayjs';
import { getDurationInHours, isDateValid } from 'utils/dateUtils';
import {
  CANCELLATION_POLICY_POSSIBLE_LABELS,
  HIGHLIGHT_TYPES,
  THEMES,
  VALIDITY_TYPES,
} from 'const/index';
import {
  DESCRIPTOR_RANKING_LOGIC,
  MAX_DESCRIPTORS_DISPLAYED,
} from 'const/descriptors';
import getServerStrings from 'const/serverStrings';

export const extractTabsFromHighlights = (highlights) => {
  let tabs = [];
  const nonTabHighlights = highlights.reduce((acc, highlight) => {
    if (highlight.type === HIGHLIGHT_TYPES.H6_HEADING) {
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

const PRODUCT_CARD_DESKTOP_IMG_GRID_AREA = 'card-img ';

export const getProductCardLayout = ({
  mbTheme,
  hasOffer,
  hasV1Booster,
  hasShortSummary,
  hasNextAvailable,
  isTicketCard = false,
  hasPromoCode = false,
}) => {
  let layout = { desktop: [], mobile: [] };
  switch (mbTheme) {
    case THEMES.MIN_BLUE:
      layout = {
        desktop: [
          'title cta-combo',
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
          `${
            isTicketCard ? '' : PRODUCT_CARD_DESKTOP_IMG_GRID_AREA
          }title line cta-combo`,
          hasShortSummary &&
            `${
              isTicketCard ? '' : PRODUCT_CARD_DESKTOP_IMG_GRID_AREA
            } summary line cta-combo`,
          hasOffer &&
            `${
              isTicketCard ? '' : PRODUCT_CARD_DESKTOP_IMG_GRID_AREA
            } offer line cta-combo`,
          hasV1Booster &&
            `${
              isTicketCard ? '' : PRODUCT_CARD_DESKTOP_IMG_GRID_AREA
            } booster line cta-combo`,
          `${
            isTicketCard ? '' : PRODUCT_CARD_DESKTOP_IMG_GRID_AREA
          } body line cta-combo`,
          ((!hasV1Booster && !hasOffer) || !hasShortSummary) &&
            !isTicketCard &&
            'card-img . line cta-combo',
          hasPromoCode && `${!isTicketCard ? '' : '. line cta-combo'}`,
        ],
        mobile: [
          isTicketCard ? null : 'card-img card-img',
          'title title',
          hasNextAvailable && 'next-available next-available',
          'price-block price-block',
          isTicketCard && hasPromoCode && 'promo-block promo-block',
          hasOffer && 'offer offer',
          !isTicketCard && 'summary summary',
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

export const getSingleAriesTag = (arr, tag) =>
  arr.find((ele) => ele.includes(tag));

export const rankDescriptorList = (descriptorList) => {
  const filteredDescriptors = descriptorList?.filter((descriptor) =>
    DESCRIPTOR_RANKING_LOGIC?.includes(descriptor)
  );
  const splitDescriptorListWords = filteredDescriptors?.map((descriptor) =>
    descriptor.split(' ')
  );

  const rankedDescriptorListWords = splitDescriptorListWords.sort(
    (a, b) =>
      DESCRIPTOR_RANKING_LOGIC.indexOf(a[0]) -
      DESCRIPTOR_RANKING_LOGIC.indexOf(b[0])
  );

  const rankedDescriptorList = rankedDescriptorListWords?.map((descriptor) =>
    descriptor.join(' ')
  );

  return rankedDescriptorList;
};

export const generateDescriptor = ({
  descriptors = [],
  v2Descriptors = [],
  minDuration,
  maxDuration,
  isEntertainmentMb = false,
  isShowPage = false,
}: {
  descriptors?: Record<string, string>[];
  v2Descriptors?: string[];
  minDuration: number | null;
  maxDuration: number | null;
  lang: string;
  isEntertainmentMb?: boolean;
  isShowPage?: boolean;
}) => {
  if (isShowPage || isEntertainmentMb) {
    return v2Descriptors;
  }

  if (!isEntertainmentMb && !isShowPage) {
    const headoutDescriptors = descriptors?.map(
      (descriptor) => descriptor?.code
    );

    if (minDuration && maxDuration) {
      headoutDescriptors.push('DURATION');
    }

    return rankDescriptorList(headoutDescriptors).slice(
      0,
      MAX_DESCRIPTORS_DISPLAYED
    );
  }
};

export const getCancellationPolicyString = ({
  cancellationPolicy,
  reschedulePolicy,
  ticketValidity,
  lang,
}) => {
  const strings = getServerStrings(lang);

  const formatString = (currentString, replaceWith) =>
    currentString?.replace('{0}', replaceWith);

  const { cancellable, cancellableUpTo: cancellableUptoMinutes } =
    cancellationPolicy ?? {};
  const { reschedulable, reschedulableUpTo: reschedulableUptoMinutes } =
    reschedulePolicy ?? {};
  const {
    ticketValidityType: validityType,
    ticketValidityUntilDate: validUptoDate,
    ticketValidityUntilDaysFromPurchase: validUptoDays,
  } = ticketValidity ?? {};

  const isValidUptoMonths = validUptoDays >= 60; // show validity in months if n(months) >= 2
  const validUptoMonths = isValidUptoMonths
    ? Math.floor(validUptoDays / 30)
    : 0;
  const cancellableUptoHours = getDurationInHours(cancellableUptoMinutes);
  const reschedulableUptoHours = getDurationInHours(reschedulableUptoMinutes);
  const formattedValidUptoDate = isDateValid(validUptoDate)
    ? dayjs(validUptoDate).locale(lang).format('D MMMM, YYYY')
    : null;

  if (!cancellable && !reschedulable) {
    switch (validityType) {
      case VALIDITY_TYPES.UNTIL_DATE:
        return formatString(
          strings.CANCELLATION_POLICY.VALID_UNTIL_DATE,
          formattedValidUptoDate
        );
      case VALIDITY_TYPES.UNTIL_DAYS_FROM_PURCHASE:
        return isValidUptoMonths
          ? formatString(
              strings.CANCELLATION_POLICY.VALID_WITHIN_NEXT_MONTHS,
              validUptoMonths
            )
          : formatString(
              strings.CANCELLATION_POLICY.VALID_WITHIN_NEXT_DAYS,
              validUptoDays
            );
      case VALIDITY_TYPES.EXTENDABLE_BUT_UNKNOWN:
        return strings.CANCELLATION_POLICY.EXTENDED_BUT_UNKNOWN_VALIDITY;
      default:
        return strings.CANCELLATION_POLICY.NON_CANCELLABLE_NON_RESCHEDULABLE;
    }
  } else if (!cancellable && reschedulable) {
    return formatString(
      strings.CANCELLATION_POLICY.NON_CANCELLABLE_BUT_RESCHEDULABLE,
      reschedulableUptoHours
    );
  } else {
    return formatString(
      strings.CANCELLATION_POLICY.CANCELLABLE,
      cancellableUptoHours
    );
  }
};

const getValidityPolicyString = ({ ticketValidity, lang }) => {
  const strings = getServerStrings(lang);

  const formatString = (currentString, replaceWith) =>
    currentString.replace('{0}', replaceWith);

  const {
    ticketValidityType: validityType,
    ticketValidityUntilDate: validUptoDate,
    ticketValidityUntilDaysFromPurchase: validUptoDays,
  } = ticketValidity ?? {};

  if (!validityType || validityType === VALIDITY_TYPES.NOT_EXTENDABLE)
    return null;

  const isValidUptoMonths = validUptoDays >= 60;
  const validUptoMonths = isValidUptoMonths
    ? Math.floor(validUptoDays / 30)
    : 0;
  const formattedValidUptoDate = isDateValid(validUptoDate)
    ? dayjs(validUptoDate).locale(lang).format('D MMMM, YYYY')
    : null;

  switch (validityType) {
    case VALIDITY_TYPES.UNTIL_DATE:
      return formatString(strings.VALIDITY.UNTIL_DATE, formattedValidUptoDate);
    case VALIDITY_TYPES.UNTIL_DAYS_FROM_PURCHASE:
      return isValidUptoMonths
        ? formatString(
            strings.VALIDITY.UNTIL_MONTHS_FROM_PURCHASE,
            validUptoMonths
          )
        : formatString(
            strings.VALIDITY.UNTIL_DAYS_FROM_PURCHASE,
            validUptoDays
          );
    default:
      return strings.VALIDITY.EXTENDED_BUT_UNKNOWN_VALIDITY;
  }
};

export const standardizeCancellationPolicy = ({
  highlights = [],
  cancellationPolicy = {},
  reschedulePolicy = {},
  ticketValidity = {},
  showValidity = true,
  lang,
}) => {
  if (!highlights.length) return highlights;

  const strings = getServerStrings(lang);
  let updatedHighlights = [...highlights];

  // Removing the existing (hard-coded) cancellation policy from highlights array
  const firstIndex = updatedHighlights.findIndex(
    (item) =>
      item.type === HIGHLIGHT_TYPES.H6_HEADING &&
      (item.text.toLowerCase() ===
        strings.CANCELLATION_POLICY_HEADING.toLowerCase() ||
        CANCELLATION_POLICY_POSSIBLE_LABELS.some(
          (label) => label.toLowerCase() === item.text.toLowerCase().trim()
        ))
  );

  if (firstIndex !== -1) {
    let lastIndex = firstIndex + 1;

    while (lastIndex < updatedHighlights.length) {
      if (updatedHighlights[lastIndex].type.startsWith('heading')) break; // stop iterating when next heading is found
      lastIndex++;
    }

    updatedHighlights = updatedHighlights.filter(
      (_, index) => index < firstIndex || index >= lastIndex
    );
  }

  // Adding the new cancellation and validity policy to highlights array
  const text = strings.CANCELLATION_POLICY_HEADING,
    spans = [],
    cancellationPolicyString = getCancellationPolicyString({
      cancellationPolicy,
      reschedulePolicy,
      ticketValidity,
      lang,
    });

  updatedHighlights = updatedHighlights.concat([
    {
      type: HIGHLIGHT_TYPES.H6_HEADING,
      text,
      spans,
      content: { text, spans },
    },
    {
      type: HIGHLIGHT_TYPES.LIST_ITEM,
      text: cancellationPolicyString,
      spans,
      content: { text: cancellationPolicyString, spans },
    },
  ]);

  if (showValidity) {
    const validityPolicyString = getValidityPolicyString({
      ticketValidity,
      lang,
    });
    updatedHighlights = validityPolicyString
      ? updatedHighlights.concat([
          {
            type: HIGHLIGHT_TYPES.LIST_ITEM,
            text: validityPolicyString,
            spans,
            content: { text: validityPolicyString, spans },
          },
        ])
      : updatedHighlights;
  }

  return updatedHighlights;
};
