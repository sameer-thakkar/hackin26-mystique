import React from 'react';
import dynamic from 'next/dynamic';
import { csvTgidToArray } from 'utils/helper';

import HorizontalLine from './slices/HorizontalLine';
import ContentTabs from './slices/ContentTabs';
import PageTabs from './slices/PageTabs';
import RichTextBox from './slices/RichTextBox';
import Table from './slices/Table';
import Breadcrumb from './slices/Breadcrumb';
import Background from './slices/Background';
import FooterLinksSection from './slices/FooterLinksSection';
import TicketCard from './slices/TickerCardSlice';
import UGCCarousel from './slices/UGCCarousel';
import RichtextWithCTA from './slices/RichTextWithCTA';

// Dynamic imports
const CustomLinkedTours = dynamic(() => import('./slices/CustomLinkedTours'));
const ImageGallery = dynamic(() => import('./slices/ImageGallery'));
const TicketCards = dynamic(() => import('./slices/TicketCards'));
const ImageLinksCarousel = dynamic(() => import('./slices/ImageLinksCarousel'));
const InteractiveImage = dynamic(() => import('./slices/InteractiveImage'));
const TrustBoosters = dynamic(() => import('./slices/TrustBoosters'));
const TourComparisonTable = dynamic(() => import('./slices/TourComparision'));
const AutomatedComparisonTable = dynamic(() =>
  import('./slices/AutomatedComparisonTable')
);
const ImageGrid = dynamic(() => import('./slices/ImageGrid'));
const ImageTextGrid = dynamic(() => import('./slices/ImageTextGrid'));
const InternalContentCard = dynamic(() =>
  import('./slices/InternalContentCard')
);
const FWActionCard = dynamic(() => import('./slices/FWActionCard'));
const FeatureBox = dynamic(() => import('./slices/FeatureBox'));
const CardCarousel = dynamic(() => import('./slices/CardCarousel'));
const CategorySection = dynamic(() => import('./MicrositeV2/CategorySection'));
const CategorySlider = dynamic(() => import('./MicrositeV2/CategorySlider'));
const MicrobrandCards = dynamic(() => import('./slices/MicrobrandCards'));
const TabWrapper = dynamic(() => import('./slices/TabWrapper'));
const Tab = dynamic(() => import('./slices/Tab'));
const SliderAccordion = dynamic(() => import('./slices/SliderAccordion'));
const CardSection = dynamic(() => import('./slices/CardSection'));
const Card = dynamic(() => import('./slices/Card'));
const TableV2 = dynamic(() => import('./slices/TableV2'));
const AlertPopup = dynamic(() => import('./slices/AlertPopup'));
const AnchorPoint = dynamic(() => import('./slices/AnchorPoint'));
const BlogFeed = dynamic(() => import('./slices/BlogFeed'));
const AccordionGroup = dynamic(() => import('./slices/AccordionGroup'));
const ListicleSection = dynamic(() => import('./slices/ListicleSection'));
const Listicle = dynamic(() => import('./slices/Listicle'));
const Reviews = dynamic(() => import('./slices/Reviews'));
const ExperienceCarousel = dynamic(() =>
  import('./GlobalMbs/Carousels/ExperienceCarousel')
);
const CollectionCarousel = dynamic(() =>
  import('./GlobalMbs/Carousels/CollectionCarousel')
);

const sliceHandler = (slice, props: any = {}) => {
  if (slice?.primary?.hide_slice) return null;
  switch (slice.slice_type) {
    case 'rich_text':
    case 'rich_text_only':
      return <RichtextWithCTA slices={slice.items} />;
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
      return (
        <PageTabs
          tabs={slice.items}
          align={slice.primary?.tab_alignment || 'center'}
        />
      );
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
        <FooterLinksSection
          title={slice.primary.heading}
          links={slice.items}
          sliceLength={props.sliceLength}
          sliceIndex={props.index}
        />
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
      const tgidArray = slice?.primary?.csv_tgids
        ?.split(',')
        ?.map((tgid) => parseInt(tgid.trim()));
      if (props.isMobile)
        return (
          <CategorySection
            {...props}
            tgidsArray={tgidArray}
            description={slice?.primary?.carousel_description}
            heading={slice?.primary?.carousel_heading}
            category={slice?.primary?.category_id}
            excludedTgids={slice?.primary?.exclude_tgids}
          />
        );
      else
        return (
          <CategorySlider
            {...props}
            tgidsArray={tgidArray}
            isFirstTourOpen={slice?.primary?.is_first_tour_open}
            description={slice?.primary?.carousel_description}
            heading={slice?.primary?.carousel_heading}
            category={slice?.primary?.category_id}
            excludedTgids={slice?.primary?.exclude_tgids}
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
      const vendor = slice.primary.csv_vendors?.split(',').map((v) => v.trim());
      const vendorLinks = slice.primary.csv_vendor_links
        ?.split(',')
        .map((v) => v.trim());
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
          designType={slice.primary.design_type}
          showImage={slice.primary.show_image}
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
          clickInteraction={slice.primary.click_interaction}
          heading={slice.primary.carousel_heading}
          cards={cards}
          isMobile={props.isMobile}
        />
      );
    case 'category_section':
      const tgids = slice.primary.csv_tgids
        .split(',')
        .map((tgid) => parseInt(tgid.trim()));
      return (
        <CategorySection
          {...props}
          tgidsArray={tgids}
          isFirstTourOpen={slice.primary.is_first_tour_open}
          description={slice.primary.carousel_description}
          heading={slice.primary.carousel_heading}
        />
      );
    case 'content_tabs':
      return (
        <ContentTabs
          tabsArr={slice.primary.tab_list.split(',').map((t) => t.trim())}
          contentArr={slice.items}
        />
      );

    case 'tab_wrapper':
      return (
        <TabWrapper
          slices={slice.slices}
          heading={slice.primary.title}
          sliceProps={props}
          description={slice.primary.description}
        />
      );
    case 'tab':
      return (
        <Tab
          key={props.index}
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
        <SliderAccordion
          key={props.index}
          isMobile={props.isMobile}
          faqs={faqs}
          sliceProps={props}
        />
      );
    case 'table_v2':
      const rows =
        slice.slices
          .filter((t_slice) => t_slice.slice_type === 'table_rows')[0]
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
          description={slice.primary.description}
          rows={rows}
          isMobile={props.isMobile}
        />
      );

    case 'card_section':
      const {
        card_section_title,
        card_section_type,
        cards_in_a_row,
        description,
        exit_description,
      } = slice.primary;

      const cardSectionTitle =
        props?.isGlobalCollection &&
        (card_section_title?.trim() === 'Explore' ||
          card_section_title?.trim() === 'Things To Do')
          ? `${card_section_title} ${props?.collectionName}`
          : card_section_title;

      return (
        <CardSection
          slices={slice.slices}
          title={cardSectionTitle}
          sectionType={card_section_type}
          cardsInARow={Number(cards_in_a_row) || 1}
          description={description}
          exitDescription={exit_description}
          {...props}
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
        cta_type,
      } = slice.primary;
      const images = slice.items
        .filter((image) => {
          if (image.image_source.url || image.image_url.url) return true;
        })
        .map((image) => ({
          url: image.image_source.url || image.image_url.url,
          alt: image.image_source.alt || image.image_alt,
          copyright: image.image_source.copyright,
        }));

      return (
        <Card
          key={props.index}
          images={images}
          title={card_title}
          description={card_description}
          cta={{ text: cta_text, link: cta_link, type: cta_type ?? 'Button' }}
          type={props.cardType}
          cardsInARow={props.cardsInARow}
          link={card_link}
          linkType={card_link_type}
          isGlobalMb={props.isGlobalMb}
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
    case 'alert':
      return (
        <AlertPopup
          images={slice.items || []}
          title={slice.primary.alert_title || 'Your safety is our Priority'}
          description={slice.primary.alert_description || []}
        />
      );
    case 'image_gallery':
      return (
        <ImageGallery
          heading={slice.primary.heading}
          images={slice.items}
          mobileLayout={slice.primary.mobile_layout}
          isMobile={props.isMobile}
        />
      );
    case 'ticket_cards':
      return (
        <TicketCards
          title={slice.primary.title}
          cards={slice.items}
          twoColumns={slice.primary.show_2_cards_in_a_row}
        />
      );
    case 'anchor_point':
      return <AnchorPoint id={slice.primary.id} />;
    case 'blog_feed':
      return (
        <BlogFeed
          count={slice.primary.count}
          feed_url={slice.primary.feed_url}
        />
      );
    case 'custom_linked_tours':
      const { content, common_page_link } = slice.primary;
      const c_tgids = [];
      const tours = slice.items.reduce((acc, tour) => {
        c_tgids.push(tour.tgid);
        return {
          ...acc,
          [tour.tgid]: { tgid: tour.tgid, ...tour.link_override },
        };
      }, {});
      return (
        <CustomLinkedTours
          tours={tours}
          tgids={c_tgids}
          content={content}
          commonLink={common_page_link}
        />
      );
    case 'accordion':
      return (
        <AccordionGroup
          accordions={slice.items}
          heading={slice.primary.heading}
          useSchema={slice.primary.use_faq_schema || false}
          sliceProps={props}
        />
      );
    case 'unspace':
      return <div className="unspace-slice" />;
    case 'listicle_section':
      const {
        primary: { section_title, listicle_type },
        slices,
      } = slice;
      return (
        <ListicleSection
          title={section_title}
          type={listicle_type.toLowerCase()}
          slices={slices}
        />
      );
    case 'listicle':
      const { type, index } = props;
      return <Listicle key={index} type={type} index={index} data={slice} />;
    case 'reviews':
      return (
        <Reviews
          title={slice.primary.title}
          type={slice.primary.type}
          reviews={slice.items}
        />
      );
    case 'global_experiences':
      const experienceCarouselTitle =
        props?.isGlobalCollection &&
        slice?.primary?.experience_type === 'Tickets'
          ? `${props?.collectionName} ${slice?.primary?.title}`
          : slice?.primary?.title;
      return (
        <ExperienceCarousel
          cardsInARow={slice?.primary?.cards_in_a_row}
          experienceType={slice?.primary?.experience_type}
          mbType={slice?.primary?.mb_type}
          showSeeAll={slice?.primary?.show_see_all}
          title={experienceCarouselTitle}
          {...props}
        />
      );
    case 'collection_carousel':
      return (
        <CollectionCarousel
          title={slice?.primary?.carousel_title}
          subtext={slice?.primary?.carousel_subtext}
          carouselType={slice?.primary?.carousel_type}
          showSeeAll={slice?.primary?.show_see_all}
          {...props}
        />
      );
    case 'tours_list':
      return props.tourListSection;
    case 'ticket_card_shoulder_page':
      return (
        <TicketCard
          subtext={slice?.primary?.subtext}
          title={slice?.primary?.title}
          {...props}
        />
      );
    case 'automated_comparison_table':
      return (
        <AutomatedComparisonTable
          isMobile={props.isMobile}
          heading={slice?.primary?.section_title}
          description={slice?.primary?.section_sub_heading}
          collectionId={slice?.primary?.collection_id}
        />
      );
    case 'ugc_carousel':
      return (
        <UGCCarousel
          isMobile={props.isMobile}
          heading={slice?.primary?.title}
          subHeading={slice?.primary?.sub_title}
          cards={slice?.items}
        />
      );
    default:
    // ToDo: Add to Error Logs (Slice)
  }
};

export default sliceHandler;

export const toursTabSliceHandler = async (slice) => {
  switch (slice.slice_type) {
    case 'tour_list':
      return slice.items;
    case 'category':
      const limit = slice.primary.tour_count;
      const prismicTourDataOverrides = slice.items.reduce((acc, tour) => {
        return {
          ...acc,
          [tour.tgid]: {
            ...tour,
          },
        };
      }, {});
      const categoryLevelFreetour = {
        offer__free_tour: slice.primary.offer__free_tour,
      };
      const excludedTgids = csvTgidToArray(slice.primary.excluded_tgids);
      const category: any = await fetch(
        `/api/tours/v1/feed/category/get/${slice.primary.category_id}/`
      ).then((res) => res.json());
      const tours = category?.products.reduce((acc, tour) => {
        return [
          ...acc,
          {
            tgid: tour.id,
            ...categoryLevelFreetour,
            ...prismicTourDataOverrides[tour.id],
          },
        ];
      }, []);
      return tours
        .filter((t) => excludedTgids.indexOf(t.tgid) === -1)
        .slice(0, limit || tours.length);
    default:
    //
  }
};