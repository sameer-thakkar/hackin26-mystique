import { asHTML } from '@prismicio/helpers';
import { captureException } from '@sentry/nextjs';
import { getHeadoutLanguagecode } from 'utils';
import {
  fetchCollectionList,
  fetchProductCardsByCollectionId,
  fetchTourListV6,
} from 'utils/apiUtils';
import mapNewToOldProductCard from 'utils/converters/productCard';
import { sendLog } from 'utils/logger';
import { getScorpioData } from 'utils/productUtils';

function extractHighlights(data: any) {
  const highlights: any = [];
  let isHighlightSection = false;

  data.forEach((item: any) => {
    if (item.type === 'heading6' && item.content.text === 'Highlights') {
      isHighlightSection = true; // Start collecting Highlights
    } else if (item.type === 'heading6') {
      isHighlightSection = false; // Stop collecting when a new heading6 starts
    }

    if (
      isHighlightSection &&
      (item.type === 'list-item' || item.type === 'paragraph')
    ) {
      highlights.push(item);
    }
  });

  return highlights;
}

export const dayTripCollectionParser = async ({
  collectionId,
  lang,
  hostname,
  localizedStrings,
  currency,
  micrositeData,
}: {
  collectionId: string;
  lang: string;
  hostname: string;
  localizedStrings: any;
  currency?: string;
  micrositeData: any;
}) => {
  const langCode = getHeadoutLanguagecode(lang);
  const currentCurrency = currency || 'USD';

  let collectionDetails: any;
  let productCards: any;
  let scorpioData: any;
  let exclusions: any;

  const {
    primary: {
      locale_exclusions: localeExclusions,
      product_cards: { data: { exclusions: commonExclusions } = {} } = {},
    } = {},
  } = micrositeData?.body?.[0] || {};

  exclusions = (localeExclusions ?? commonExclusions ?? '')
    .split(',')
    .map((exclusion: any) => Number(exclusion));

  try {
    const [collectionResponse, productCardsResponse] = await Promise.all([
      fetchCollectionList({
        collectionIds: [Number(collectionId)],
        language: langCode,
        currency: currentCurrency,
      }),
      fetchProductCardsByCollectionId({
        collectionId,
        language: langCode,
        currency: currentCurrency,
      }),
    ]);

    const { collections = [] } = collectionResponse;
    collectionDetails = collections[0];

    const {
      result: { productCards: { items: productCardItems = [] } = {} } = {},
    } = productCardsResponse;
    productCards = productCardItems.map((productCard: any) =>
      mapNewToOldProductCard(productCard, langCode)
    );

    productCards = exclusions.length
      ? productCards.filter(
          (productCard: any) => !exclusions.includes(productCard.id)
        )
      : productCards;

    const tourGroupsResponse: any = await fetchTourListV6({
      tgids: productCards.map((productCard: any) => productCard.id),
      language: langCode,
      currency: currentCurrency,
      hostname,
    });

    scorpioData = await getScorpioData({
      finalTours: tourGroupsResponse.tourGroups,
      language: langCode,
      localizedStrings,
      currency: tourGroupsResponse?.currencies?.[0],
    });

    productCards.forEach((productCard: any) => {
      if (scorpioData[productCard.id]) {
        scorpioData[productCard.id] = {
          ...productCard,
          ...scorpioData[productCard.id],
        };
        productCard.content.highlights = extractHighlights(
          scorpioData[productCard.id].highlights
        );
        productCard.content.highlights = asHTML(productCard.content.highlights);
      }
    });
  } catch (err) {
    captureException(err);
    sendLog({
      err,
      message: `[dayTripCollectionParser] - collectionId - ${collectionId}`,
    });
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return {
    collectionDetails,
    orderedTours: productCards,
    scorpioData,
  };
};
