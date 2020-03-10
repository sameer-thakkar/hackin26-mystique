import { RichText } from 'prismic-reactjs';
type ToursData = {
  cardPrices: object;
  currencySymbol: string;
  isFetched: boolean;
};
const allToursParser = (CMSData, scorpioData, pricingData: ToursData) => {
  const { cardPrices, currencySymbol, isFetched } = pricingData;
  const labelIDMap = CMSData?.labels?.reduce((accum, label) => {
    return { ...accum, [label.id]: label.data.label_name };
  }, {});

  const contentOrderLabels = CMSData?.content_order?.reduce((accum, label) => {
    return [
      ...accum,
      { labelID: label.label.id, globalAlign: label.alignment },
    ];
  }, []);

  const getOrderedContent = blocks => {
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
    contentOrderLabels.forEach(label => {
      if (!content[label.labelID]) return;
      const useGLOBAL = content[label.labelID].align == 'Global';
      let block = {
        label: labelIDMap[label.labelID],
        content: content[label.labelID].content,
        align: useGLOBAL ? label.globalAlign : content[label.labelID].align,
        len: RichText.asText(content[label.labelID].content).length,
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
    return {
      ...accum,
      [tourData.tgid]: {
        title: tourData.tour_title_override || scorpioData[tourData.tgid].title,
        highlights: scorpioData[tourData.tgid].highlights,
        descriptors:
          tourData.descriptors || scorpioData[tourData.tgid].descriptors,
        productHighlights: scorpioData[tourData.tgid].productHighlights,
        cardFooter: tourData.card_tags,
        theater: tourData.theater_name,
        contentBlocks: getOrderedContent(tour.items),
        productImage:
          tourData.product_image_override.url ||
          scorpioData[tourData.tgid].images[0]
            ? scorpioData[tourData.tgid].images[0].url
            : '',
        descriptionImage:
          tourData.description_image_override.url ||
          scorpioData[tourData.tgid].images[1]
            ? scorpioData[tourData.tgid].images[1].url
            : '',
        price: isFetched ? cardPrices[tourData.tgid].price : '',
        scratchPrice: isFetched ? cardPrices[tourData.tgid].scratchPrice : '',
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
      },
    };
  }, {});

  return allTours;
};

export default allToursParser;
