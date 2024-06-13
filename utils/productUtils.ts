import { asText } from '@prismicio/helpers';
import { RTNode } from '@prismicio/types';
import dayjs from 'dayjs';
import { FILTERED_HIGHLIGHTS } from 'components/HOHO/constants';
import { BoosterType } from 'components/Product/interface';
import { createBookingURL, isGuidedTourSubcategory } from 'utils';
import { TCurrencyObj } from 'utils/currency';
import {
  dateToString,
  getDurationInDays,
  getDurationInHours,
  isDateValid,
} from 'utils/dateUtils';
import { appendInclusionExclusion } from 'utils/inclusionExclusionUtils';
import { convertUidToUrl, getFormattedUrlSlug } from 'utils/urlUtils';
import COLORS from 'const/colors';
import {
  DESCRIPTOR_RANKING_LOGIC,
  MAX_DESCRIPTORS_DISPLAYED,
} from 'const/descriptors';
import {
  BOOSTER_EXPERIMENT_UIDS,
  CANCELLATION_POLICY_POSSIBLE_LABELS,
  CASHBACK_TYPES,
  DESCRIPTORS,
  HIGHLIGHT_TYPES,
  LANGUAGE_MAP,
  REOPENING_CATEGORIES,
  THEMES,
  VALIDITY_TYPES,
} from 'const/index';
import { strings } from 'const/strings';
import StarEmptyNew from 'assets/starEmptyNew';
import StarFullNew from 'assets/starFullNew';
import StarHalfNew from 'assets/starHalfNew';

export const extractTabsFromHighlights = (highlights: Record<string, any>) => {
  let tabs: any[] = [];
  const nonTabHighlights = highlights?.reduce(
    (acc: Record<string, any>[], highlight: RTNode & { content: RTNode }) => {
      if (highlight.type === HIGHLIGHT_TYPES.H6_HEADING) {
        tabs.push({
          type: 'tab',
          heading: asText([highlight]),
          contents: [],
        });
        return acc;
      }
      if (tabs.length) {
        tabs[tabs.length - 1].contents.push(highlight);
        return acc;
      } else return [...acc, highlight];
    },
    []
  );

  return { highlights: nonTabHighlights, tabs };
};

export const extractCancellationPolicyFromHighlights = (
  highlights: Array<Record<string, any>>
) => {
  let cancellationPolicy: string | undefined;

  highlights.forEach(({ text, type }, index) => {
    if (
      type === HIGHLIGHT_TYPES.H6_HEADING &&
      text === strings.CANCELLATION_POLICY_HEADING
    ) {
      cancellationPolicy = highlights[index + 1]?.text ?? '';
    }
  });

  return cancellationPolicy;
};

export const filterFromHighlights = (highlights: Record<string, any>[]) => {
  let exclude = false;
  const filteredData: Record<string, any> = [];

  highlights.forEach((item) => {
    if (item.type === 'heading6' && FILTERED_HIGHLIGHTS().includes(item.text)) {
      exclude = true;
    } else if (item.type === 'heading6') {
      exclude = false;
    }

    if (!exclude) {
      filteredData.push(item);
    }
  });

  return filteredData;
};

const PRODUCT_CARD_DESKTOP_IMG_GRID_AREA = 'card-img ';

type TGetProductCardLayout = {
  mbTheme?: string | null;
  hasOffer?: boolean;
  hasV1Booster?: boolean;
  isTicketCard?: boolean;
  hasPromoCode?: boolean;
  isOpenDated?: boolean;
  showAvailabilityInTitle?: boolean;
  showGuidesLabel?: boolean;
  showAvailabilityInLanguagesText?: boolean;
  isModifiedProductCard?: boolean;
  isPoiMwebCard?: boolean;
};

export const getProductCardLayout = ({
  mbTheme,
  hasOffer,
  hasV1Booster,
  isTicketCard = false,
  hasPromoCode = false,
  isOpenDated = false,
  showAvailabilityInTitle = false,
  showGuidesLabel = false,
  showAvailabilityInLanguagesText = false,
  isModifiedProductCard = false,
  isPoiMwebCard = false,
}: TGetProductCardLayout) => {
  let layout: {
    desktop: Array<string | boolean | undefined | null>;
    mobile: Array<string | boolean | undefined | null>;
  } = {
    desktop: [],
    mobile: [],
  };

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
        ],
      };
      break;
    case THEMES.DEF_INTERIM:
    case THEMES.DEFAULT:
    default:
      layout = {
        desktop: [
          `${
            !isTicketCard ? PRODUCT_CARD_DESKTOP_IMG_GRID_AREA : ''
          }category-and-rating line cta-combo`,
          `${
            isTicketCard ? '' : PRODUCT_CARD_DESKTOP_IMG_GRID_AREA
          }title line cta-combo`,
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
          !hasV1Booster &&
            !hasOffer &&
            !isTicketCard &&
            !isModifiedProductCard &&
            'card-img . line cta-combo',
          hasPromoCode && `${!isTicketCard ? '' : '. line cta-combo'}`,
        ],
        mobile: [
          isTicketCard ? null : 'card-img',
          'category-and-rating',
          'title',
          isOpenDated && 'open-dated-descriptor',
          hasOffer && 'offer',
          isPoiMwebCard && 'tags',
          !isTicketCard &&
            !isOpenDated &&
            !showAvailabilityInTitle &&
            'next-available',
          'price-block',
          !isPoiMwebCard && 'tags',
          showGuidesLabel && 'guides-banner-wrapper',
          showAvailabilityInLanguagesText && 'tour-available-in-languages-area',
          isTicketCard && hasPromoCode && 'promo-block',
          hasV1Booster && 'booster',
          'body',
          'cta-block',
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

export const getContentBlocksMidIndex = (array: any) => {
  let totalWordCount = 0;
  let resultIndex = array.length / 2;
  array.forEach((element: any) => {
    totalWordCount += asText(element.contents as []).length;
  });

  let leftWordCount = 0;
  let flag = true;
  array.forEach((element: any, index: any) => {
    leftWordCount += asText(element.contents as []).length;
    if (leftWordCount >= totalWordCount / 2 && flag) {
      resultIndex = index;
      flag = false;
    }
  });
  return resultIndex + 1;
};

export const extractContentForProductCard = (
  markdownBlocks: any,
  contentBlocks: any
) => {
  const tabsMarkdown = markdownBlocks
    ? extractTabsFromHighlights(markdownBlocks).tabs
    : [];

  let leftContent: any = [];
  let rightContent: any = [];

  if (tabsMarkdown.length > 0) {
    const filteredMarkdown = tabsMarkdown?.filter((md) => {
      const values = [
        strings.SHOW_PAGE.THEATRE_NAME,
        'My Ticket',
        strings.SHOW_PAGE.YOUR_TICKETS,
        'Your Ticket',
        strings.SHOW_PAGE.SHOW_TIMINGS,
        strings.SHOW_PAGE.DURATION,
        strings.SHOW_PAGE.CANCELLATION_POLICY,
        'Cancellation',
        strings.SHOW_PAGE.AGE_LIMIT,
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

    const isLeftBlock = [
      strings.SHOW_PAGE.THEATRE_NAME,
      strings.SHOW_PAGE.SHOW_TIMINGS,
      strings.SHOW_PAGE.DURATION,
    ];
    const isRightBlock = [
      strings.SHOW_PAGE.YOUR_TICKETS,
      'Your Ticket',
      strings.SHOW_PAGE.CANCELLATION_POLICY,
      'Cancellation',
      strings.SHOW_PAGE.AGE_LIMIT,
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
        highlight?.heading === strings.SHOW_PAGE.CANCELLATION_POLICY ||
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
    contentBlocks.left.forEach((highlight: any) => {
      leftContent.push({
        heading: highlight.label,
        contents: highlight.content,
      });
    });

    contentBlocks.right.forEach((highlight: any) => {
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
      return descriptor.replace(regex, updatedDescriptor);
    } else {
      return descriptor.replace(regex, '');
    }
  } else {
    return descriptor;
  }
};

export const getSingleAriesTag = (arr: string[], tag: string) =>
  arr.find((ele: any) => ele.includes(tag));

export const rankDescriptorList = (descriptorList: any) => {
  const filteredDescriptors = descriptorList?.filter((descriptor: any) =>
    DESCRIPTOR_RANKING_LOGIC?.includes(descriptor)
  );
  const splitDescriptorListWords = filteredDescriptors?.map((descriptor: any) =>
    descriptor.split(' ')
  );

  const rankedDescriptorListWords = splitDescriptorListWords.sort(
    (a: any, b: any) =>
      DESCRIPTOR_RANKING_LOGIC.indexOf(a[0]) -
      DESCRIPTOR_RANKING_LOGIC.indexOf(b[0])
  );

  return rankedDescriptorListWords?.map((descriptor: any) =>
    descriptor.join(' ')
  );
};

type TGenerateDescriptor = {
  descriptors?: Record<string, string>[];
  v2Descriptors?: string;
  lang: string;
  isEntertainmentMb?: boolean;
  isShowPage?: boolean;
  primarySubCategory?: PrimarySubCategory;
};

export const generateDescriptor = ({
  descriptors = [],
  v2Descriptors = '',
  isEntertainmentMb = false,
  isShowPage = false,
  primarySubCategory,
}: TGenerateDescriptor) => {
  if (isShowPage || isEntertainmentMb) {
    if (!v2Descriptors) return [];

    const regex = isShowPage ? /\r?\n|\r/ : /(?:\r\n|\s\|\s)/g;
    return v2Descriptors?.split(regex).filter(Boolean);
  }

  const headoutDescriptors = descriptors?.map((descriptor) => descriptor?.code);
  const isGuidedTour = isGuidedTourSubcategory(primarySubCategory?.id);

  headoutDescriptors.push(DESCRIPTORS.DURATION);

  const rankedDescriptorList = rankDescriptorList(headoutDescriptors);
  let displayLimit = MAX_DESCRIPTORS_DISPLAYED;

  /**
   * Product cards remove "Guided Tours" descriptors from cta-section
   * and append a tag above title. This reduces the max shown descriptors from 5 to 4
   *
   * Hence, explicitly increasing count by 1
   */
  if (isGuidedTour && rankedDescriptorList.includes(DESCRIPTORS.GUIDED_TOUR)) {
    displayLimit++;
  }

  return rankDescriptorList(headoutDescriptors).slice(0, displayLimit);
};

type TCancellationPolicyObj = Record<string, boolean | number | number>;

type TGetCancellationPolicyString = {
  cancellationPolicy: TCancellationPolicyObj;
  reschedulePolicy: TCancellationPolicyObj;
  ticketValidity: Record<string, any>;
  lang: string;
  localizedStrings: Record<string, any>;
};

export const getCancellationPolicyString = ({
  cancellationPolicy,
  reschedulePolicy,
  ticketValidity,
  lang,
  localizedStrings,
}: TGetCancellationPolicyString) => {
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
  const cancellableUptoHours = getDurationInHours(
    Number(cancellableUptoMinutes)
  );
  const reschedulableUptoHours = getDurationInHours(
    Number(reschedulableUptoMinutes)
  );
  const formattedValidUptoDate = isDateValid(validUptoDate)
    ? dayjs(validUptoDate).locale(lang).format('D MMMM, YYYY')
    : null;

  if (!cancellable && !reschedulable) {
    switch (validityType) {
      case VALIDITY_TYPES.UNTIL_DATE:
        return strings.formatString(
          localizedStrings.CANCELLATION_POLICY.VALID_UNTIL_DATE,
          // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
          formattedValidUptoDate
        );
      case VALIDITY_TYPES.UNTIL_DAYS_FROM_PURCHASE:
        return isValidUptoMonths
          ? strings.formatString(
              localizedStrings.CANCELLATION_POLICY.VALID_WITHIN_NEXT_MONTHS,
              validUptoMonths
            )
          : strings.formatString(
              localizedStrings.CANCELLATION_POLICY.VALID_WITHIN_NEXT_DAYS,
              validUptoDays
            );
      case VALIDITY_TYPES.EXTENDABLE_BUT_UNKNOWN:
        return localizedStrings.CANCELLATION_POLICY
          .EXTENDED_BUT_UNKNOWN_VALIDITY;
      default:
        return localizedStrings.CANCELLATION_POLICY
          .NON_CANCELLABLE_NON_RESCHEDULABLE;
    }
  } else if (!cancellable && reschedulable) {
    return strings.formatString(
      localizedStrings.CANCELLATION_POLICY.NON_CANCELLABLE_BUT_RESCHEDULABLE,
      reschedulableUptoHours
    );
  } else {
    return cancellableUptoHours === 0
      ? localizedStrings.CANCELLATION_POLICY.CANCELLABLE_ANYTIME
      : cancellableUptoHours <= 72
      ? strings.formatString(
          localizedStrings.CANCELLATION_POLICY.CANCELLABLE,
          cancellableUptoHours
        )
      : strings.formatString(
          localizedStrings.CANCELLATION_POLICY.CANCELLABLE_DAYS,
          getDurationInDays(Number(cancellableUptoMinutes))
        );
  }
};

type TGetValidityPolicyString = {
  ticketValidity: Record<string, any>;
  localizedStrings: Record<string, any>;
  lang: string;
};

const getValidityPolicyString = ({
  ticketValidity,
  lang,
  localizedStrings,
}: TGetValidityPolicyString) => {
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
      return strings.formatString(
        localizedStrings.VALIDITY.UNTIL_DATE,
        // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
        formattedValidUptoDate
      );
    case VALIDITY_TYPES.UNTIL_DAYS_FROM_PURCHASE:
      return isValidUptoMonths
        ? strings.formatString(
            localizedStrings.VALIDITY.UNTIL_MONTHS_FROM_PURCHASE,
            validUptoMonths
          )
        : strings.formatString(
            localizedStrings.VALIDITY.UNTIL_DAYS_FROM_PURCHASE,
            validUptoDays
          );
    default:
      return localizedStrings.VALIDITY.EXTENDED_BUT_UNKNOWN_VALIDITY;
  }
};

type TStandardizeCancellationPolicy = {
  highlights: Record<string, any>[];
  cancellationPolicy: Record<string, any>;
  reschedulePolicy: Record<string, any>;
  ticketValidity: Record<string, any>;
  showValidity: boolean;
  lang: string;
  localizedStrings: Record<string, any>;
};

export const standardizeCancellationPolicy = ({
  highlights = [],
  cancellationPolicy = {},
  reschedulePolicy = {},
  ticketValidity = {},
  showValidity = true,
  lang,
  localizedStrings,
}: any) => {
  if (!highlights.length || !localizedStrings) return highlights;

  let updatedHighlights = [...highlights];

  // Removing the existing (hard-coded) cancellation policy from highlights array
  const firstIndex = updatedHighlights.findIndex(
    (item) =>
      item.type === HIGHLIGHT_TYPES.H6_HEADING &&
      (item.text.toLowerCase() ===
        localizedStrings.CANCELLATION_POLICY_HEADING.toLowerCase() ||
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
  const text = localizedStrings.CANCELLATION_POLICY_HEADING,
    spans: any = [],
    cancellationPolicyString = getCancellationPolicyString({
      cancellationPolicy,
      reschedulePolicy,
      ticketValidity,
      lang,
      localizedStrings,
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
      localizedStrings,
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

export const parseDescriptors = (descriptorArr: Record<string, any>[] = []) => {
  const allowedDescriptors = [
    strings.DESCRIPTORS.INSTANT_CONFIRMATION,
    strings.DESCRIPTORS.MOBILE_TICKET,
  ];
  return descriptorArr.filter(({ name }) => allowedDescriptors.includes(name));
};

// Temporarily disables dynamic show pages
export const shouldUseDynamicShowPage = () => false;

export const getOpeningDate = ({
  categoryId,
  lang,
  reopeningDate,
}: {
  categoryId: number;
  lang: string;
  reopeningDate: string;
}) => {
  const openingDate = dateToString(
    reopeningDate,
    LANGUAGE_MAP.en.code,
    'DD MMM, YYYY'
  );
  const localisedOpeningDate = dateToString(
    reopeningDate,
    lang,
    'DD MMM, YYYY'
  );
  let OPENING_ON = '';
  if (openingDate === strings.TODAY || openingDate === strings.TOMORROW) {
    OPENING_ON = REOPENING_CATEGORIES.includes(categoryId)
      ? strings.REOPENS
      : strings.OPENS;
  } else {
    OPENING_ON = REOPENING_CATEGORIES.includes(categoryId)
      ? strings.REOPENING_ON
      : strings.OPENING_ON;
  }

  const isBeforeToday = new Date().getTime() > new Date(openingDate)?.getTime();

  if (!isBeforeToday && openingDate !== 'Invalid Date')
    return { localisedOpeningDate, openingDate, OPENING_ON };
};
export const getBoosterValueFromListingPrice = (listingPrice: any) => {
  const {
    originalPrice,
    finalPrice,
    cashbackType,
    cashbackValue,
    bestDiscount,
  } = listingPrice ?? {};
  const percentageSaved = Math.round(
    ((originalPrice - finalPrice) / originalPrice) * 100
  );
  const shouldShowcashbackElement =
    cashbackValue > 0 && cashbackType === CASHBACK_TYPES.PERCENTAGE;

  return {
    percentageSaved,
    shouldShowcashbackElement,
    cashbackValue,
    bestDiscount,
  };
};

export const getEntertainmentMbProductCardDiscountTagString = ({
  bestDiscount,
  cashbackValue,
  shouldShowcashbackElement,
}: {
  bestDiscount: number;
  cashbackValue: number;
  shouldShowcashbackElement: boolean;
}) => {
  if (bestDiscount > 0) {
    return strings.formatString(
      strings.SAVE_PERCENT,
      `${bestDiscount}`
    ) as string;
  } else if (shouldShowcashbackElement) {
    return strings.formatString(strings.CASHBACK, `${cashbackValue}`) as string;
  }

  return '';
};

export const getProductCardDestination = ({
  nakedDomain,
  lang,
  tgid,
  redirectToHeadoutBookingFlow,
  currency,
  flowType,
  urlSlugs,
  showPageUid,
  isVenuePage = false,
  showPageUidForVenuePage,
  isDev = false,
  host,
}: any) => {
  const bookingURL = createBookingURL({
    nakedDomain,
    lang,
    tgid,
    redirectToHeadoutBookingFlow,
    currency,
    flowType,
  });
  let destinationUrl = bookingURL;
  if (shouldUseDynamicShowPage()) {
    destinationUrl = getFormattedUrlSlug(urlSlugs, lang);
  } else if (showPageUid || isVenuePage) {
    destinationUrl = convertUidToUrl({
      uid: isVenuePage ? showPageUidForVenuePage : showPageUid,
      isDev,
      hostname: host,
      lang,
    });
  }

  const showPageExists = !destinationUrl.includes('/book');

  return { destinationUrl, showPageExists };
};

export const getScorpioData = ({
  finalTours,
  currency,
  language,
  localizedStrings,
  tgidVariantData,
}: {
  finalTours: Record<string, any>;
  currency: TCurrencyObj | undefined;
  language: string;
  localizedStrings?: any;
  tgidVariantData?: any;
}) => {
  let minPrice = finalTours?.[0]?.listingPrice?.finalPrice || Infinity;
  let bestDiscount = finalTours?.[0]?.listingPrice?.bestDiscount || 0;
  const scorpioData = finalTours?.reduce(
    (acc: Record<string, any>, tour: any) => {
      const {
        id,
        allTags,
        averageRating,
        callToAction,
        highlights,
        listingPrice,
        imageUrl,
        media,
        descriptors,
        minDuration,
        maxDuration,
        name,
        reviewCount,
        combo,
        multiVariant,
        primaryCollection,
        primaryCategory,
        primarySubCategory,
        cancellationPolicy,
        cancellationPolicyV2,
        reschedulePolicy,
        ticketValidity,
        flowType,
        allVariantOpenDated,
        inclusionsRichText,
        exclusionsRichText,
        ratingCount,
        reviewsDetails,
        topReviews,
      } = tour ?? {};

      minPrice = Math.min(listingPrice?.finalPrice || Infinity, minPrice);
      bestDiscount = Math.max(listingPrice?.bestDiscount || 0, bestDiscount);

      const { productImages, safetyImages } = media || {};
      const updatedDescriptors = generateDescriptor({
        descriptors,
        lang: language,
        primarySubCategory,
      });
      let {
        microBrandsHighlight,
      }: { microBrandsHighlight: Record<string, any>[] } = tour ?? {};

      const {
        urlSlugs: _primaryCategoryUrlSlugs,
        ...primaryCategoryWithoutSlugs
      } = primaryCategory ?? {};
      const {
        urlSlugs: _primarySubCategoryUrlSlugs,
        ...primarySubCategoryWithoutSlugs
      } = primarySubCategory ?? {};

      microBrandsHighlight = standardizeCancellationPolicy({
        highlights: microBrandsHighlight,
        cancellationPolicy: cancellationPolicyV2 ?? cancellationPolicy,
        reschedulePolicy,
        ticketValidity,
        lang: language,
        localizedStrings,
      });

      const isMBHighlightsExist = microBrandsHighlight?.length > 0;
      const combinedHighlights = appendInclusionExclusion({
        highlightArr: microBrandsHighlight,
        inclusions: inclusionsRichText,
        exclusions: exclusionsRichText,
        localizedStrings: localizedStrings || {},
      });

      const { variants } =
        tgidVariantData?.find((item: any) => item.id === id) || {};
      const [variantId] =
        getSingleAriesTag(allTags, 'DEFAULT_VARIANT')?.match(/\d+/) || [];
      const { listingPrice: variantListingPrice } =
        variants?.find((variant: any) => variant?.id === Number(variantId)) ||
        {};
      const finalListingPrice = variantListingPrice
        ? variantListingPrice
        : listingPrice;
      return {
        ...acc,
        [id]: {
          allTags,
          available: !(listingPrice === null),
          averageRating,
          ctaBooster: callToAction,
          descriptors: updatedDescriptors,
          highlights: combinedHighlights,
          isMBHighlightsExist,
          imageUrl,
          images: productImages,
          listingPrice: {
            ...finalListingPrice,
            ...currency,
          },
          productHighlights: highlights,
          productTitle: name,
          reviewCount,
          safetyImages,
          title: name,
          combo,
          multiVariant,
          minDuration,
          maxDuration,
          primaryCollection,
          primaryCategory: primaryCategoryWithoutSlugs,
          primarySubCategory: primarySubCategoryWithoutSlugs,
          flowType,
          allVariantOpenDated,
          ratingCount,
          reviewsDetails,
          topReviews,
        },
      };
    },
    {}
  );
  if (minPrice == Infinity) minPrice = 0;

  return {
    ...scorpioData,
    minPrice,
    bestDiscount,
  };
};

export const getMaxListItemsToShow = (
  contentsForTab: Record<string, any>[] = []
) => {
  if (contentsForTab.length === 0) {
    return 2;
  }

  const APPROX_WORDS_SPANNING_CARD_IMG_HEIGHT = 42;
  const MAX_LIST_ITEMS = 4;

  let wordCountInListItems = 0;
  let listItemsCount = 0;

  contentsForTab.forEach((content) => {
    if (wordCountInListItems < APPROX_WORDS_SPANNING_CARD_IMG_HEIGHT) {
      wordCountInListItems += content.text.split(' ').length;
      listItemsCount++;
    }
  });

  return Math.min(MAX_LIST_ITEMS, listItemsCount);
};

export const getProductDescriptors = ({
  descriptors,
  filterOut,
}: {
  descriptors?: any[];
  filterOut?: any[] | null;
}) => {
  if (!descriptors || !filterOut || filterOut.length == 0)
    return descriptors ?? [];
  return descriptors.filter((descriptor) => !filterOut.includes(descriptor));
};

export const getUniqueRandomOutputs = ({
  numArraySize = 0,
  outputCount,
  sampleArray,
}: {
  numArraySize?: number;
  outputCount: number;
  sampleArray?: any[];
}) => {
  if (
    sampleArray ? outputCount > sampleArray.length : outputCount > numArraySize
  )
    return;
  let numbers =
    sampleArray ?? Array.from({ length: numArraySize + 1 }, (_, i) => i);
  let selectedOutputs = [];
  while (selectedOutputs.length < outputCount) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    const selectedOutput = numbers.splice(randomIndex, 1)[0];
    selectedOutputs.push(selectedOutput);
  }
  return selectedOutputs;
};

export const getStars = (rating: number) => {
  const stars = [];
  for (let i = 0; i < Math.floor(rating); i++) {
    stars.push(StarFullNew({ fillColor: COLORS.BRAND.CANDY }));
  }
  if (rating % 1 !== 0)
    stars.push(StarHalfNew({ fillColor: COLORS.BRAND.CANDY }));
  for (let i = 0; i < 5 - Math.ceil(rating); i++) {
    stars.push(StarEmptyNew({ fillColor: COLORS.BRAND.CANDY }));
  }
  return stars;
};
export const getCategoryMap = (
  tourGroupMap: {
    id: number;
    primaryCategory: Record<string, any>;
    primarySubCategory: Record<string, any>;
  }[]
) => {
  const mapping: Record<
    number,
    { categoryId?: number; subCategoryId?: number }
  > = {};

  const categoriesAndSubCategories: Record<
    number,
    { name: string; isCategory: boolean; nonLocalizedName: string }
  > = {};

  Object.values(tourGroupMap).forEach(
    (tg: { id: any; primaryCategory: any; primarySubCategory: any }) => {
      const { id, primaryCategory, primarySubCategory } = tg;
      mapping[id] = {};
      if (primaryCategory) {
        const { id: categoryId, displayName, name } = primaryCategory;

        /**
         * All subcategories under Tickets except
         * city cards (1008) are not shown
         */
        if (primarySubCategory?.id !== 1008 && categoryId === 1) {
          mapping[id].categoryId = categoryId;
          categoriesAndSubCategories[categoryId] = {
            name: displayName,
            isCategory: true,
            nonLocalizedName: name,
          };
        }
      }
      if (primarySubCategory) {
        const { id: subCategoryId, displayName, name } = primarySubCategory;

        if (primaryCategory?.id !== 1 || subCategoryId === 1008) {
          mapping[id].subCategoryId = subCategoryId;
          categoriesAndSubCategories[subCategoryId] = {
            name: displayName,
            isCategory: false,
            nonLocalizedName: name,
          };
        }
      }
    }
  );

  return { mapping, categoriesAndSubCategories };
};

type BoosterKeys = keyof typeof BoosterType;

export const getTotalBoosters = (uid: keyof typeof BOOSTER_EXPERIMENT_UIDS) => {
  let total = 0;

  const distribution: Record<BoosterKeys, number> = {
    BESTSELLER: 0,
    SELLING_OUT_FAST: 0,
  };

  if (!Object.keys(BOOSTER_EXPERIMENT_UIDS).includes(uid))
    return { total, distribution };

  Object.keys(BoosterType)
    .filter((key) => isNaN(Number(key)))
    .forEach((type) => {
      if (
        Object.keys(BOOSTER_EXPERIMENT_UIDS[uid]).includes(
          BoosterType[type as BoosterKeys]
        )
      ) {
        distribution[type as BoosterKeys] = (
          BOOSTER_EXPERIMENT_UIDS[uid] as Record<string, Array<number>>
        )[BoosterType[type as BoosterKeys]].length;
      } else {
        distribution[type as BoosterKeys] = 0;
      }
      total += distribution[type as BoosterKeys];
    });

  return { total, distribution };
};

export const checkForBooster = (
  uid: keyof typeof BOOSTER_EXPERIMENT_UIDS,
  tgid: number
) => {
  let finalType = '';

  Object.keys(BoosterType)
    .filter((key) => isNaN(Number(key)))
    .forEach((type) => {
      if (
        (BOOSTER_EXPERIMENT_UIDS[uid] as Record<string, Array<number>>)?.[
          BoosterType[type as BoosterKeys]
        ]?.includes(tgid)
      )
        finalType = type;
    });

  return finalType;
};
