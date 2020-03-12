import React from 'react';
import dynamic from 'next/dynamic';
import { RichText } from 'prismic-reactjs';
import { shortCodeSerializer } from '../utils/shortCodes';
import HorizontalLine from './slices/HorizontalLine';

const ImageLinksCarousel = dynamic(() => import('./slices/ImageLinksCarousel'));
const InteractiveImage = dynamic(() => import('./slices/InteractiveImage'));
const TrustBoosters = dynamic(() => import('./slices/TrustBoosters'));
const TourComparisonTable = dynamic(() => import('./slices/TourComparision'));
const ContentTabs = dynamic(() => import('./slices/ContentTabs'));
const ImageGrid = dynamic(() => import('./slices/ImageGrid'));
const ImageTextGrid = dynamic(() => import('./slices/ImageTextGrid'));
const InternalContentCard = dynamic(() =>
  import('./slices/InternalContentCard')
);
const Tabs = dynamic(() => import('./slices/Tabs'));
const FWActionCard = dynamic(() => import('./slices/FWActionCard'));
const RichTextBox = dynamic(() => import('./slices/RichTextBox'));
const FeatureBox = dynamic(() => import('./slices/FeatureBox'));
const TitleLinksCard = dynamic(() => import('./slices/TitleLinksCard'));
const CardCarousel = dynamic(() => import('./slices/CardCaoursel'));
const CategorySection = dynamic(() => import('./MicrositeV2/CategorySection'));
const CategorySlider = dynamic(() => import('./MicrositeV2/CategorySlider'));
const Table = dynamic(() => import('./slices/Table'));
const MicrobrandCards = dynamic(() => import('./slices/MicrobrandCards'));
const TabWrapper = dynamic(() => import('./slices/TabWrapper'));
const Tab = dynamic(() => import('./slices/Tab'));
const FAQSlider = dynamic(() => import('./slices/FAQSlider'));
const CardSection = dynamic(() => import('./slices/CardSection'));
const Card = dynamic(() => import('./slices/Card'));
const TableV2 = dynamic(() => import('./slices/TableV2'));
const Background = dynamic(() => import('./slices/Background'));
const Breadcrumb = dynamic(() => import('./slices/Breadcrumb'));

const sliceHandler = (slice, props: any = {}) => {
  switch (slice.slice_type) {
    case 'rich_text':
    case 'rich_text_only':
      return slice.items.map((block, index) => (
        <RichText
          key={index}
          render={block.text}
          htmlSerializer={shortCodeSerializer}
        />
      ));
    case 'image':
    case 'image_grid':
      return (
        <ImageGrid
          cols={slice.primary.number_of_columns || 1}
          images={slice.items}
        />
      );
    case 'image_text_combo_grid':
      return (
        <ImageTextGrid
          cols={slice.primary.number_of_columns || 3}
          cards={slice.items}
        />
      );
    case 'page_tabs':
      return <Tabs tabs={slice.items} />;
    case 'internal_content_card':
      return (
        <InternalContentCard title={slice.primary.title} cards={slice.items} />
      );
    case 'full_width_action_card':
      return <FWActionCard title={slice.primary.title} cards={slice.items} />;
    case 'content_box':
      return <RichTextBox slices={slice.items} />;
    case 'feature_box':
      return <FeatureBox blocks={slice.items} lazyLoad={true} />;
    case 'footer_column':
      return (
        <TitleLinksCard title={slice.primary.heading} links={slice.items} />
      );
    case 'table':
      return (
        <Table
          title={slice.primary.table_heading}
          numberOfColumns={slice.primary.number_of_column}
          columnsData={slice.items}
        />
      );
    case 'card_carousel':
      if (slice.items.length)
        return (
          <CardCarousel
            carouselHeading={slice.primary.carousel_heading}
            cards={slice.items}
          />
        );
      break;
    case 'category_carousel':
      const tgidArray = slice.primary.csv_tgids
        .split(',')
        .map(tgid => parseInt(tgid.trim()));
      if (props.isMobile)
        return (
          <CategorySection
            {...props}
            tgidsArray={tgidArray}
            description={slice.primary.carousel_description}
            heading={slice.primary.carousel_heading}
          />
        );
      else
        return (
          <CategorySlider
            tgidsArray={tgidArray}
            description={slice.primary.carousel_description}
            heading={slice.primary.carousel_heading}
          />
        );
    case 'trust_boosters':
      let boosters = slice.items.reduce((accum, item) => {
        let booster = {
          image_url: item.uploaded_icon.url || item.icon_link.url,
          title: item.booster_title,
          description: item.booster_description,
        };
        return [...accum, booster];
      }, []);
      return <TrustBoosters boosters={boosters} {...props} />;
    case 'microbrand_cards':
      return (
        <MicrobrandCards cards={slice.items} cardsContent={slice.primary} />
      );
    case 'comparision_table':
      const orderedLabels = slice.items.reduce((acc: [], label) => {
        return [
          ...acc,
          {
            label: label.selected_labels.slug,
            labelId: label.selected_labels.id,
          },
        ];
      }, []);
      const vendor = slice.primary.csv_vendors?.split(',').map(v => v.trim());
      const vendorLinks = slice.primary.csv_vendor_links
        ?.split(',')
        .map(v => v.trim());
      return (
        <TourComparisonTable
          isMobile={props.isMobile}
          heading={slice.primary.comparision_heading}
          description={slice.primary.comparison_description}
          tgidsCSV={slice.primary.product_tgids}
          vendors={vendor}
          vendorLinks={vendorLinks}
          orderedLabels={orderedLabels}
          slice={slice}
        />
      );
    case 'interactive_image':
      const { primary } = slice;
      const url = primary.linked_image.url || primary.uploaded_image.url;
      const alt = primary.uploaded_image.alt || 'Popup Image';
      return <InteractiveImage src={url} alt={alt} isMobile={props.isMobile} />;
    case 'image_links_carousel':
      const cards = slice.items.reduce((acc, card) => {
        return [
          ...acc,
          {
            image: {
              url: card.uploaded_image.url || card.linked_image.url,
              alt: card.uploaded_image.alt || card.image_alt,
            },
            link: card.card_link,
            card_title: card.card_title,
          },
        ];
      }, []);
      return (
        <ImageLinksCarousel
          description={slice.primary.carousel_description}
          heading={slice.primary.carousel_heading}
          cards={cards}
          isMobile={props.isMobile}
        />
      );
    case 'category_section':
      const tgids = slice.primary.csv_tgids
        .split(',')
        .map(tgid => parseInt(tgid.trim()));
      return (
        <CategorySection
          {...props}
          tgidsArray={tgids}
          description={slice.primary.carousel_description}
          heading={slice.primary.carousel_heading}
        />
      );
    case 'content_tabs':
      return (
        <ContentTabs
          tabsArr={slice.primary.tab_list.split(',').map(t => t.trim())}
          contentArr={slice.items}
        />
      );

    case 'tab_wrapper':
      return (
        <TabWrapper
          slices={slice.slices}
          heading={slice.primary.title}
          sliceProps={props}
        />
      );
    case 'tab':
      return (
        <Tab
          slices={slice.slices}
          title={slice.primary.title}
          isDefault={slice.primary.is_default == 'Yes'}
          sliceProps={props}
        />
      );
    case 'question':
      const faqs = slice.items.reduce((acc, slice) => {
        const images = slice.items.reduce((acci, image) => {
          let img = {
            url: image.upload_image?.url || image.linked_image,
            caption: image.upload_image?.alt || image.image_caption,
            alt: image.alt_text,
          };
          return [...acci, img];
        }, []);
        return [
          ...acc,
          {
            question: slice.primary.question,
            answer: slice.primary.answer,
            images,
          },
        ];
      }, []);
      return (
        <FAQSlider isMobile={props.isMobile} faqs={faqs} sliceProps={props} />
      );
    case 'table_v2':
      const rows =
        slice.slices
          .filter(t_slice => t_slice.slice_type === 'table_rows')[0]
          ?.items?.reduce((acc, row) => {
            return [
              ...acc,
              {
                columns: row.items,
                primary: row.primary,
              },
            ];
          }, []) || [];
      return (
        <TableV2
          title={slice.primary.title}
          rows={rows}
          isMobile={props.isMobile}
        />
      );

    case 'card_section':
      const {
        card_section_title,
        card_section_type,
        card_type,
      } = slice.primary;

      let type;
      switch (card_type) {
        case 'Desktop Card':
          type = 'desktop';
          break;
        case 'Column Card':
          type = 'column';
          break;
        case 'Mobile Card':
          type = 'mobile';
          break;
      }

      return (
        <CardSection
          slices={slice.slices}
          title={card_section_title}
          sectionType={card_section_type}
          cardType={type}
        />
      );
    case 'card':
      const {
        card_title,
        card_description,
        cta_text,
        cta_link,
        card_link,
        card_link_type,
      } = slice.primary;
      const images = slice.items
        .filter(image => {
          if (image.image_source.url || image.image_url.url) return true;
        })
        .map(image => ({
          url: image.image_source.url || image.image_url.url,
          alt: image.image_source.alt || image.image_alt,
        }));

      return (
        <Card
          key={props.index}
          images={images}
          title={card_title}
          description={card_description}
          cta={{ text: cta_text, link: cta_link }}
          type={props.cardType}
          link={card_link}
          linkType={card_link_type}
        />
      );
    case 'background':
      return (
        <Background
          color={slice.primary.color}
          textCenter={slice.primary.centered}
          gridCenter={slice.primary.grid_center}
          slices={slice.slices}
          sliceProps={props}
        />
      );
    case 'horizontal_line':
      return <HorizontalLine />;
    case 'breadcrumbs':
      const orderedLinks = slice.items.reduce((acc, crumb) => {
        return [
          ...acc,
          {
            text: crumb.title,
            link: crumb.url,
          },
        ];
      }, []);
      orderedLinks.push({ text: slice.primary.current_title, url: {} });
      return <Breadcrumb orderedLinks={orderedLinks} />;
    default:
    // ToDo: Add to Error Logs (Slice)
  }
};

export default sliceHandler;
