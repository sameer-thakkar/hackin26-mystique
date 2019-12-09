import React from "react";
import dynamic from "next/dynamic";
import { RichText } from "prismic-reactjs";

import { shortCodeSerializer } from "../utils/shortCodes";

const ImageGrid = dynamic(() => import("./ImageGrid"));
const ImageTextGrid = dynamic(() => import("./ImageTextGrid"));
const InternalContentCard = dynamic(() => import("./InternalContentCard"));
const Tabs = dynamic(() => import("./Tabs"));
const FWActionCard = dynamic(() => import("./FWActionCard"));
const RichTextBox = dynamic(() => import("./RichTextBox"));
const FeatureBox = dynamic(() => import("./FeatureBox"));
const TitleLinksCard = dynamic(() => import("./TitleLinksCard"));
const CardCarousel = dynamic(() => import("./slices/CardCaoursel"));

export const sliceHandler = slice => {
  switch (slice.slice_type) {
    case "rich_text":
    case "rich_text_only":
      return slice.items.map((block, index) => (
        <RichText
          key={index}
          render={block.text}
          htmlSerializer={shortCodeSerializer}
        />
      ));
      break;
    case "image_grid":
      return (
        <ImageGrid
          cols={slice.primary.number_of_columns || 1}
          images={slice.items}
        />
      );
      break;
    case "image_text_combo_grid":
      return (
        <ImageTextGrid
          cols={slice.primary.number_of_columns || 3}
          cards={slice.items}
        />
      );
      break;
    case "page_tabs":
      return <Tabs tabs={slice.items} />;
      break;
    case "internal_content_card":
      return (
        <InternalContentCard title={slice.primary.title} cards={slice.items} />
      );
      break;
    case "full_width_action_card":
      return <FWActionCard title={slice.primary.title} cards={slice.items} />;
      break;
    case "content_box":
      return <RichTextBox slices={slice.items} />;
      break;
    case "feature_box":
      return <FeatureBox slices={slice.items} />;
      break;
    case "footer_column":
      return (
        <TitleLinksCard title={slice.primary.heading} links={slice.items} />
      );
    case "card_carousel":
      return (
        <CardCarousel
          carouselHeading={slice.primary.carousel_heading}
          cards={slice.items}
        />
      );
      break;
    default:
    // ToDo: Add to Error Logs (Slice)
  }
};
