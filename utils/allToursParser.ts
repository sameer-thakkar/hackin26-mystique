import { RichText } from 'prismic-reactjs';
import { CURRENCY_SYMBOL_MAP } from 'constants/index';

type ToursData = {
  cardPrices: object;
  isFetched: boolean;
};

const allToursParser = (CMSData, scorpioData, pricingData: ToursData) => {
  const { cardPrices, isFetched } = pricingData;
  const labelIDMap = CMSData?.labels?.reduce((accum, label) => {
    return { ...accum, [label.id]: label.data.label_name };
  }, {});

  const contentOrderLabels = CMSData?.content_order?.reduce((accum, label) => {
    return [
      ...accum,
      {
        labelID: label.label.id,
        globalAlign: label.alignment,
        globalContent: label.default_content,
      },
    ];
  }, []);

  const getOrderedContent = (blocks) => {
    let left = [],
      right = [],
      hidden = [];
    let content = blocks.reduce((accum, block) => {
      return {
        ...accum,
        [block.item_label.id]: {
          content: block.content,
          align: block.alignment,
        },
      };
    }, {});
    contentOrderLabels.forEach((label) => {
      if (!content[label.labelID]) return;
      const useGLOBAL = content[label.labelID].align == 'Global';
      const blockContentLen =
        RichText.asText(content[label.labelID].content).trim().length ||
        content[label.labelID].content.filter((c) => c.type === 'image');
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

  const allTours = CMSData?.all_tours?.reduce((accum, tour) => {
    let tourData = tour.primary;
    const orderedBlocks = getOrderedContent(tour.items);
    const flatBlocks = [].concat(...Object.values(orderedBlocks));
    const theatreBlock = flatBlocks.find((block) => {
      return /theatre|theater/gi.test(block.label);
    });
    if (theatreBlock) {
      tourData.theater_contentblock = RichText.asText(theatreBlock.content);
    }
    const currencySymbol =
      isFetched &&
      CURRENCY_SYMBOL_MAP[
        cardPrices[tourData.tgid]?.listingPrice?.currencyCode
      ];
    return {
      ...accum,
      [tourData.tgid]: {
        title:
          tourData.tour_title_override ||
          scorpioData[tourData.tgid].title ||
          '',
        highlights: scorpioData[tourData.tgid].highlights,
        descriptors:
          tourData.descriptors || scorpioData[tourData.tgid].descriptors || '',
        productHighlights: scorpioData[tourData.tgid].productHighlights || '',
        cardFooter: tourData.card_tags,
        theater: tourData.theater_name,
        content_theater: tourData.theater_contentblock,
        contentBlocks: orderedBlocks,
        productImage:
          tourData.product_image_override.url ||
          (scorpioData[tourData.tgid].images[0]
            ? scorpioData[tourData.tgid].images[0].url
            : ''),
        descriptionImage:
          tourData.description_image_override.url ||
          (scorpioData[tourData.tgid].images[1]
            ? scorpioData[tourData.tgid].images[1].url
            : ''),
        price: isFetched ? cardPrices[tourData.tgid]?.price : '',
        scratchPrice: isFetched ? cardPrices[tourData.tgid]?.scratchPrice : '',
        currencySymbol: isFetched ? currencySymbol : '',
        tgid: parseInt(tourData.tgid),
        images: scorpioData[tourData.tgid].images,
        averageRating: scorpioData[tourData.tgid].averageRating,
        reviewCount: scorpioData[tourData.tgid].reviewCount,
        ctaBooster: scorpioData[tourData.tgid].ctaBooster,
        description: tourData.full_description,
        available: scorpioData[tourData.tgid].available,
        overlayBooster: tourData.overlay_booster,
        vendor: tourData.vendor_name,
        allTags: scorpioData[tourData.tgid]?.allTags || [],
        dfListingPrice: scorpioData[tourData.tgid]?.dfListingPrice || {},
        listingPrice: isFetched ? cardPrices[tourData.tgid]?.listingPrice : {},
        safetyImages: scorpioData[tourData.tgid].safetyImages,
      },
    };
  }, {});

  return allTours;
};

export default allToursParser;
