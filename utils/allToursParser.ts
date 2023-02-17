// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import { CURRENCY_SYMBOL_MAP } from 'const/index';

type ToursData = {
  cardPrices: object;
  isFetched: boolean;
};

const allToursParser = (
  CMSData: any,
  scorpioData: any,
  pricingData: ToursData
) => {
  const { cardPrices, isFetched } = pricingData;
  const labelIDMap = CMSData?.labels?.reduce((accum: any, label: any) => {
    return { ...accum, [label.id]: label.data.label_name };
  }, {});

  const contentOrderLabels = CMSData?.content_order?.reduce(
    (accum: any, label: any) => {
      return [
        ...accum,
        {
          labelID: label.label.id,
          globalAlign: label.alignment,
          globalContent: label.default_content,
        },
      ];
    },
    []
  );

  const getOrderedContent = (blocks: any) => {
    let left: any = [],
      right: any = [],
      hidden: any = [];
    let content = blocks.reduce((accum: any, block: any) => {
      return {
        ...accum,
        [block.item_label.id]: {
          content: block.content,
          align: block.alignment,
        },
      };
    }, {});
    contentOrderLabels.forEach((label: any) => {
      if (!content[label.labelID]) return;
      const useGLOBAL = content[label.labelID].align == 'Global';
      const blockContentLen =
        RichText.asText(content[label.labelID].content).trim().length ||
        content[label.labelID].content.filter((c: any) => c.type === 'image');
      const finalContent =
        blockContentLen === 0
          ? label.globalContent
          : content[label.labelID].content;
      let block = {
        label: labelIDMap[label.labelID],
        content: finalContent,
        align: useGLOBAL ? label.globalAlign : content[label.labelID].align,
        len: RichText.asText(finalContent).length,
        labelId: label.labelID,
      };
      if (block.align == 'Right') right.push(block);
      else if (block.align == 'Left') left.push(block);
      else hidden.push(block);
    });
    return {
      left,
      right,
      hidden,
    };
  };

  const allTours = CMSData?.all_tours?.reduce((accum: any, tour: any) => {
    let tourData = tour.primary;
    const orderedBlocks = getOrderedContent(tour.items);
    const flatBlocks = [].concat(...Object.values(orderedBlocks));
    const theatreBlock = flatBlocks.find((block) => {
      return /theatre|theater/gi.test((block as any).label);
    });
    if (theatreBlock) {
      tourData.theater_contentblock = RichText.asText(
        (theatreBlock as any).content
      );
    }
    const currencySymbol =
      isFetched &&
      cardPrices &&
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      CURRENCY_SYMBOL_MAP[
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        cardPrices[tourData.tgid]?.listingPrice?.currencyCode
      ];
    let listingPrice =
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      isFetched && cardPrices ? cardPrices[tourData.tgid]?.listingPrice : {};
    const scorpioTour = scorpioData?.[tourData.tgid] || {};

    return {
      ...accum,
      [tourData.tgid]: {
        title: tourData.tour_title_override || scorpioTour?.title || '',
        highlights: scorpioTour?.highlights,
        descriptors: tourData.descriptors || scorpioTour?.descriptors || '',
        productHighlights: scorpioTour?.productHighlights || '',
        cardFooter: tourData.card_tags,
        theater: tourData.theater_name,
        content_theater: tourData.theater_contentblock,
        contentBlocks: orderedBlocks,
        productImage:
          tourData.product_image_url.url ||
          tourData.product_image_override.url ||
          (scorpioTour?.images?.[0] ? scorpioTour?.images?.[0].url : ''),
        descriptionImage:
          tourData.description_image_url.url ||
          tourData.description_image_override.url ||
          (scorpioTour?.images?.[1] ? scorpioTour?.images?.[1].url : ''),
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        price: isFetched && cardPrices ? cardPrices[tourData.tgid]?.price : '',
        scratchPrice:
          isFetched && cardPrices
            ? // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
              cardPrices[tourData.tgid]?.scratchPrice
            : '',
        currencySymbol: isFetched ? currencySymbol : '',
        tgid: parseInt(tourData.tgid),
        imageUrl: scorpioTour?.imageUrl,
        images: scorpioTour?.images,
        averageRating: scorpioTour?.averageRating,
        reviewCount: scorpioTour?.reviewCount,
        ctaBooster: scorpioTour?.ctaBooster,
        description: tourData.full_description,
        available: scorpioTour?.available,
        overlayBooster: tourData.overlay_booster,
        vendor: tourData.vendor_name,
        allTags: scorpioTour?.allTags || [],
        listingPrice: listingPrice,
        safetyImages: scorpioTour?.safetyImages,
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        collectionId: cardPrices?.[tourData.tgid]?.primaryCollection?.id,
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        primaryCollection: cardPrices?.[tourData.tgid]?.primaryCollection,
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        primaryCategory: cardPrices?.[tourData.tgid]?.primaryCategory,
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        primarySubCategory: cardPrices?.[tourData.tgid]?.primarySubCategory,
        flowType: scorpioTour?.flowType,
      },
    };
  }, {});

  return allTours;
};

export default allToursParser;
