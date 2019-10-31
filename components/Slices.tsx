import React from "react";
import ImageGrid from "./ImageGrid";
import ImageTextGrid from "./ImageTextGrid";
import InternalContentCard from "./InternalContentCard";
import Tabs from "./Tabs";
import { RichText } from "prismic-reactjs";
import { shortCodeSerializer } from "../utils/shortCodes";
import FWActionCard from "./FWActionCard";
import RichTextBox from "./RichTextBox";
import FeatureBox from "./FeatureBox";
import TitleLinksCard from "./TitleLinksCard";
import CardCarousel from "./slices/CardCaoursel";

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
