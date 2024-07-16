import dynamic from 'next/dynamic';
import GoogleMap from 'components/ShowPages/GoogleMap';
import Background from './Background';
import Breadcrumb from './Breadcrumb';
import ContentTabs from './ContentTabs';
import FooterLinksSection from './FooterLinksSection';
import HorizontalLine from './HorizontalLine';
import PageTabs from './PageTabs';
import RichTextBox from './RichTextBox';
import RichtextWithCTA from './RichTextWithCTA';
import { sliceWrapper } from './SliceWrapper';
import Table from './Table';
import TicketCard from './TicketCardSlice';
import UGCCarousel from './UGCCarousel';

// // Dynamic imports
const CustomLinkedTours = dynamic(() => import('./CustomLinkedTours'));
const ImageGallery = dynamic(() => import('./ImageGallery'));
const CarouselGallery = dynamic(
  () => import(/* webpackChunkName: "CarouselGallery" */ './CarouselGallery')
);
const TicketCards = dynamic(() => import('./TicketCards'));
const ImageLinksCarousel = dynamic(() => import('./ImageLinksCarousel'));
const InteractiveImage = dynamic(() => import('./InteractiveImage'));
const TrustBoosters = dynamic(() => import('./TrustBoosters'));
const TourComparisonTable = dynamic(() => import('./TourComparision'));
const AutomatedComparisonTable = dynamic(
  () => import('./AutomatedComparisonTable')
);
const ImageGrid = dynamic(() => import('./ImageGrid'));
const ImageTextGrid = dynamic(() => import('./ImageTextGrid'));
const InternalContentCard = dynamic(() => import('./InternalContentCard'));
const FWActionCard = dynamic(() => import('./FWActionCard'));
const FeatureBox = dynamic(() => import('./FeatureBox'));
const CardCarousel = dynamic(() => import('./CardCarousel'));
const CategorySection = dynamic(
  () => import('components/MicrositeV2/CategorySection')
);
const CategorySlider = dynamic(
  () => import('components/MicrositeV2/CategorySlider')
);
const MicrobrandCards = dynamic(() => import('./MicrobrandCards'));
const TabWrapper = dynamic(() => import('./TabWrapper'));
const Tab = dynamic(() => import('./Tab'));
const SliderAccordion = dynamic(() => import('./SliderAccordion'));
const CardSection = dynamic(() => import('./CardSection'));
const Card = dynamic(() => import('./Card'));
const TableV2 = dynamic(() => import('./TableV2'));
const TableV3 = dynamic(() => import('./TableV3'));
const AlertPopup = dynamic(() => import('./AlertPopup'));
const AnchorPoint = dynamic(() => import('./AnchorPoint'));
const BlogFeed = dynamic(() => import('./BlogFeed'));
const AccordionGroup = dynamic(() => import('./AccordionGroup'));
const ListicleSection = dynamic(() => import('./ListicleSection'));
const Listicle = dynamic(() => import('./Listicle'));
const ListicleV2 = dynamic(() => import('./ListicleV2/index'));
const ListicleSectionV2 = dynamic(() => import('./ListicleSectionV2/index'));
const ExperienceCarousel = dynamic(
  () => import('components/GlobalMbs/Carousels/ExperienceCarousel')
);
const CollectionCarousel = dynamic(
  () => import('components/GlobalMbs/Carousels/CollectionCarousel')
);
const StructuredCard = dynamic(
  () => import(/* webpackChunkName: "StructuredCard" */ './StructuredCard')
);

const Reviews = dynamic(() => import('./Reviews'));

export const catOrSubCatPageSliceComponents = () => {
  return {
    accordion: (props: any) => {
      const { slice, context } = props || {};
      const { isMobile, isRevampedDesign } = context || {};
      return sliceWrapper(
        <AccordionGroup
          accordions={slice.items}
          heading={slice.primary.heading}
          useSchema={slice.primary.use_faq_schema || false}
          sliceProps={context}
          tabData={slice?.items}
          isRevampedDesign={isRevampedDesign}
          isMobile={isMobile}
        />,
        props
      );
    },
  };
};

export const sliceComponents = () => {
  return {
    rich_text: (props: any) =>
      sliceWrapper(<RichtextWithCTA childSlices={props.slice.items} />, props),
    rich_text_only: (props: any) =>
      sliceWrapper(<RichtextWithCTA childSlices={props.slice.items} />, props),
    image: (props: any) =>
      sliceWrapper(
        <ImageGrid
          cols={props.slice.primary.number_of_columns || 1}
          images={props.slice.items}
        />,
        props
      ),
    image_grid: (props: any) =>
      sliceWrapper(
        <ImageGrid
          cols={props.slice.primary.number_of_columns || 1}
          images={props.slice.items}
        />,
        props
      ),
    image_text_combo_grid: (props: any) =>
      sliceWrapper(
        <ImageTextGrid
          cols={props.slice.primary.number_of_columns || 3}
          cards={props.slice.items}
        />,
        props
      ),
    structured_card: (props: any) => {
      const {
        intro_text,
        outro_text,
        timings,
        frequency,
        duration,
        cta_text: structured_card_cta_text,
        cta_url,
        card_image_url,
        image_alt,
      } = props.slice.primary || {};

      const { isMobile, activeTabIndex, sectionName } = props.context || {};

      return (
        <StructuredCard
          introText={intro_text}
          outroText={outro_text}
          cardImageUrl={card_image_url}
          altText={image_alt}
          timings={timings}
          frequency={frequency}
          duration={duration}
          ctaText={structured_card_cta_text}
          ctaUrl={cta_url}
          isMobile={isMobile}
          activeTabIndex={activeTabIndex}
          sectionName={sectionName}
        />
      );
    },
    breadcrumbs: (props: any) => {
      if (props.context.automatedBreadcrumbsExists) return null;
      else {
        const orderedLinks = props.slice.items.reduce(
          (acc: any, crumb: any) => {
            return [
              ...acc,
              {
                text: crumb.title,
                link: crumb.url,
              },
            ];
          },
          []
        );
        orderedLinks.push({ text: props.slice.primary.current_title, url: {} });
        return sliceWrapper(<Breadcrumb orderedLinks={orderedLinks} />, props);
      }
    },
    background: (props: any) =>
      sliceWrapper(
        <Background
          color={props.slice.primary.color}
          textCenter={props.slice.primary.centered}
          gridCenter={props.slice.primary.grid_center}
          childSlices={props.slice.slices}
          sliceProps={props?.context}
        />,
        props
      ),
    card_section: (props: any) => {
      const {
        card_section_title,
        card_section_type,
        cards_in_a_row,
        description,
        exit_description,
      } = props.slice.primary;

      const { isGlobalCollection, collectionName, sectionName } =
        props.context || {};

      const cardSectionTitle =
        isGlobalCollection &&
        (card_section_title?.trim() === 'Explore' ||
          card_section_title?.trim() === 'Things To Do')
          ? `${card_section_title} ${collectionName}`
          : card_section_title;

      return sliceWrapper(
        <CardSection
          childSlices={props.slice.slices}
          title={cardSectionTitle}
          sectionType={card_section_type}
          cardsInARow={Number(cards_in_a_row) || 1}
          description={description}
          exitDescription={exit_description}
          sectionName={sectionName}
          {...props?.context}
          index={props.index}
        />,
        props
      );
    },
    card: (props: any) => {
      const {
        card_title,
        card_description,
        cta_text,
        cta_link,
        card_link,
        card_link_type,
        cta_type,
      } = props.slice.primary;

      const {
        index,
        cardType,
        cardsInARow,
        isGlobalMb,
        isMobile,
        sectionName,
      } = props?.context || {};

      const images = props.slice.items
        .filter((image: any) => {
          if (image.image_url.url || image.image_source.url) return true;
        })
        .map((image: any) => ({
          url: image.image_url.url || image.image_source.url,
          alt: image.image_alt || image.image_source.alt,
          copyright: image.image_source.copyright,
        }));

      return sliceWrapper(
        <Card
          key={index}
          images={images}
          title={card_title}
          description={card_description}
          cta={{ text: cta_text, link: cta_link, type: cta_type ?? 'Button' }}
          type={cardType}
          cardsInARow={cardsInARow}
          link={card_link}
          linkType={card_link_type}
          isGlobalMb={isGlobalMb}
          isMobile={isMobile}
          sectionName={sectionName}
          isSeatMapExpControlAndEligible={props?.isSeatMapExpControlAndEligible}
        />,
        props
      );
    },
    tab_wrapper: (props: any) =>
      sliceWrapper(
        <TabWrapper
          childSlices={props.slice.slices}
          heading={props.slice.primary.title}
          sliceProps={props?.context}
          description={props.slice.primary.description}
        />,
        props
      ),
    tab: (props: any) =>
      sliceWrapper(
        <Tab
          key={props.index}
          childSlices={props.slice.slices}
          title={props.slice.primary.title}
          isDefault={props.slice.primary.is_default == 'Yes'}
          sliceProps={props?.context}
        />,
        props
      ),
    reviews: (props: any) =>
      sliceWrapper(
        <Reviews
          title={props.slice.primary.title}
          type={props.slice.primary.type}
          reviews={props.slice.items}
          isMobile={props.context.isMobile}
          showNewDesign={props.context.isHOHORevamp}
        />,
        props
      ),
    ticket_card_shoulder_page: (props: any) => {
      return sliceWrapper(
        <TicketCard
          subtext={props.slice?.primary?.subtext}
          title={props.slice?.primary?.title}
          parentLandingPageUrl={props?.context?.parentLandingPageUrl}
          {...props.context}
        />,
        props
      );
    },
    page_tabs: (props: any) =>
      sliceWrapper(
        <PageTabs
          tabs={props.slice.items}
          align={props.slice.primary?.tab_alignment || 'center'}
        />,
        props
      ),
    internal_content_card: (props: any) =>
      sliceWrapper(
        <InternalContentCard
          title={props.slice.primary.title}
          cards={props.slice.items}
        />,
        props
      ),
    full_width_action_card: (props: any) =>
      sliceWrapper(
        <FWActionCard
          title={props.slice.primary.title}
          cards={props.slice.items}
        />,
        props
      ),
    content_box: (props: any) =>
      sliceWrapper(
        <RichTextBox childSlices={props.slice.items} key={props.slice.index} />,
        props
      ),
    feature_box: (props: any) =>
      sliceWrapper(
        <FeatureBox blocks={props.slice.items} lazyLoad={true} />,
        props
      ),
    footer_column: (props: any) =>
      sliceWrapper(
        <FooterLinksSection
          title={props.slice.primary.heading}
          links={props.slice.items}
          sliceLength={props.context.sliceLength}
          sliceIndex={props.context.index}
        />,
        props
      ),
    table: (props: any) =>
      sliceWrapper(
        <Table
          title={props.slice.primary.table_heading}
          numberOfColumns={props.slice.primary.number_of_column}
          columnsData={props.slice.items}
        />,
        props
      ),
    card_carousel: (props: any) =>
      sliceWrapper(
        <CardCarousel
          carouselHeading={props.slice.primary.carousel_heading}
          cards={props.slice.items}
        />,
        props
      ),
    category_carousel: (props: any) => {
      const tgidArray = props.slice?.primary?.csv_tgids
        ?.split(',')
        ?.map((tgid: any) => parseInt(tgid.trim()));
      const { slice, context } = props || {};
      if (props.isMobile) {
        return sliceWrapper(
          <CategorySection
            {...context}
            tgidsArray={tgidArray}
            description={slice?.primary?.carousel_description}
            heading={slice?.primary?.carousel_heading}
            category={slice?.primary?.category_id}
            excludedTgids={slice?.primary?.exclude_tgids}
          />,
          props
        );
      } else {
        return sliceWrapper(
          <CategorySlider
            {...context}
            tgidsArray={tgidArray}
            isFirstTourOpen={slice?.primary?.is_first_tour_open}
            description={slice?.primary?.carousel_description}
            heading={slice?.primary?.carousel_heading}
            category={slice?.primary?.category_id}
            excludedTgids={slice?.primary?.exclude_tgids}
          />,
          props
        );
      }
    },
    trust_boosters: (props: any) => {
      let boosters = props.slice.items.reduce((accum: any, item: any) => {
        let booster = {
          image_url: item.icon_url.url || item.uploaded_icon.url,
          title: item.booster_title,
          description: item.booster_description,
        };
        return [...accum, booster];
      }, []);
      return sliceWrapper(
        <TrustBoosters boosters={boosters} {...props.context} />,
        props
      );
    },
    microbrand_cards: (props: any) =>
      sliceWrapper(
        <MicrobrandCards
          cards={props.slice.items}
          cardsContent={props.slice.primary}
        />,
        props
      ),
    alert: (props: any) =>
      sliceWrapper(
        <AlertPopup
          images={props.slice.items || []}
          title={
            props.slice.primary.alert_title || 'Your safety is our Priority'
          }
          description={props.slice.primary.alert_description || []}
        />,
        props
      ),
    image_gallery: (props: any) =>
      sliceWrapper(
        <ImageGallery
          heading={props.slice.primary.heading}
          images={props.slice.items}
          isMobile={props.context.isMobile}
          $isNewsPage={props.context.isNewsPage}
        />,
        props
      ),
    unspace: (props: any) =>
      sliceWrapper(<div className="unspace-slice" />, props),
    carousel_gallery: (props: any) =>
      sliceWrapper(
        <CarouselGallery
          heading={props.slice.primary.heading}
          images={props.slice.items}
        />,
        props
      ),
    ticket_cards: (props: any) =>
      sliceWrapper(
        <TicketCards
          title={props.slice.primary.title}
          cards={props.slice.items}
          twoColumns={props.slice.primary.show_2_cards_in_a_row}
        />,
        props
      ),
    anchor_point: (props: any) =>
      sliceWrapper(<AnchorPoint id={props.slice.primary.id} />, props),
    blog_feed: (props: any) =>
      sliceWrapper(
        <BlogFeed
          count={props.slice.primary.count}
          feed_url={props.slice.primary.feed_url}
        />,
        props
      ),
    horizontal_line: (props: any) => sliceWrapper(<HorizontalLine />, props),
    comparision_table: (props: any) => {
      const { slice, context } = props || {};
      const orderedLabels = slice.items.reduce((acc: [], label: any) => {
        return [
          ...acc,
          {
            label: label.selected_labels.slug,
            labelId: label.selected_labels.id,
          },
        ];
      }, []);
      const vendor = slice.primary.csv_vendors
        ?.split(',')
        .map((v: any) => v.trim());
      const vendorLinks = slice.primary.csv_vendor_links
        ?.split(',')
        .map((v: any) => v.trim());

      return sliceWrapper(
        <TourComparisonTable
          isMobile={context.isMobile}
          heading={slice.primary.comparision_heading}
          description={slice.primary.comparison_description}
          tgidsCSV={slice.primary.product_tgids}
          vendors={vendor}
          vendorLinks={vendorLinks}
          orderedLabels={orderedLabels}
          slice={slice}
          designType={slice.primary.design_type}
          showImage={slice.primary.show_image}
        />,
        props
      );
    },
    interactive_image: (props: any) => {
      const { primary } = props.slice;
      const url = primary.linked_image.url || primary.uploaded_image.url;
      const alt = primary.uploaded_image.alt || 'Popup Image';

      return sliceWrapper(
        <InteractiveImage
          src={url}
          alt={alt}
          isMobile={props.context.isMobile}
        />,
        props
      );
    },
    image_links_carousel: (props: any) => {
      const { slice, context } = props || {};
      const imagesInfo = slice.items.reduce((acc: any, card: any) => {
        return [
          ...acc,
          {
            image: {
              url: card.linked_image.url || card.uploaded_image.url,
              alt: card.image_alt || card.uploaded_image.alt,
            },
            link: card.card_link,
            card_title: card.card_title,
          },
        ];
      }, []);

      return sliceWrapper(
        <ImageLinksCarousel
          description={slice.primary.carousel_description}
          clickInteraction={slice.primary.click_interaction}
          heading={slice.primary.carousel_heading}
          images={imagesInfo}
          isMobile={context.isMobile}
        />,
        props
      );
    },
    category_section: (props: any) => {
      const { slice, context } = props || {};
      const tgids = slice.primary.csv_tgids
        .split(',')
        .map((tgid: any) => parseInt(tgid.trim()));

      return sliceWrapper(
        <CategorySection
          {...context}
          tgidsArray={tgids}
          isFirstTourOpen={slice.primary.is_first_tour_open}
          description={slice.primary.carousel_description}
          heading={slice.primary.carousel_heading}
        />,
        props
      );
    },
    content_tabs: (props: any) => {
      const { slice, context } = props || {};
      return sliceWrapper(
        <ContentTabs
          tabsArr={slice.primary.tab_list.split(',').map((t: any) => t.trim())}
          contentArr={slice.items}
          sectionName={context?.sectionName}
        />,
        props
      );
    },
    question: (props: any) => {
      const { slice, context } = props || {};
      const faqs = slice.items.reduce((acc: any, slice: any) => {
        const images = slice.items.reduce((acci: any, image: any) => {
          let img = {
            url: image.linked_image || image.upload_image?.url,
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
      return sliceWrapper(
        <SliderAccordion
          key={context.index}
          isMobile={context.isMobile}
          faqs={faqs}
          sliceProps={context}
        />,
        props
      );
    },
    table_v2: (props: any) => {
      const { slice, context } = props || {};
      const rows =
        slice.slices
          .filter((t_slice: any) => t_slice.slice_type === 'table_rows')[0]
          ?.items?.reduce((acc: any, row: any) => {
            return [
              ...acc,
              {
                columns: row.items,
                primary: row.primary,
              },
            ];
          }, []) || [];

      return sliceWrapper(
        <TableV2
          title={slice.primary.title}
          description={slice.primary.description}
          rows={rows}
          isMobile={context.isMobile}
        />,
        props
      );
    },
    table_v3: (props: any) => {
      const { slice } = props || {};
      const { primary, slices } = slice || {};
      const { table_heading, display_serial_number, serial_number_heading } =
        primary || {};

      return sliceWrapper(
        <TableV3
          title={table_heading}
          childSlices={slices}
          displaySerialNum={display_serial_number}
          serialNumHeading={serial_number_heading}
        />,
        props
      );
    },
    custom_linked_tours: (props: any) => {
      const { slice } = props || {};
      const { content, common_page_link } = slice.primary;
      const c_tgids: any = [];
      const tours = slice.items.reduce((acc: any, tour: any) => {
        c_tgids.push(tour.tgid);
        return {
          ...acc,
          [tour.tgid]: { tgid: tour.tgid, ...tour.link_override },
        };
      }, {});
      return sliceWrapper(
        <CustomLinkedTours
          tours={tours}
          tgids={c_tgids}
          content={content}
          commonLink={common_page_link}
        />,
        props
      );
    },
    accordion: (props: any) => {
      const { slice, context } = props || {};
      const { isMobile, isVenuePage } = context || {};
      return sliceWrapper(
        <AccordionGroup
          isMobile={isMobile}
          accordions={slice.items}
          heading={slice.primary.heading}
          useSchema={slice.primary.use_faq_schema || false}
          sliceProps={context}
          headingNeedsSeparator={isVenuePage}
          tabData={slice?.items}
          isVenuePage={isVenuePage}
        />,
        props
      );
    },
    tabbedinfo: (props: any) => {
      const { slice, context } = props || {};
      const { isMobile, isVenuePage, findBestSeatsCallback } = context || {};

      if (isVenuePage && !isMobile) {
        return sliceWrapper(
          <TabWrapper
            heading={slice?.primary?.heading}
            sliceProps={''}
            tabData={slice?.items}
            findBestSeatsCtaCallback={findBestSeatsCallback}
          />,
          props
        );
      } else {
        return sliceWrapper(
          <AccordionGroup
            isMobile={isMobile}
            accordions={slice.items}
            heading={slice.primary.heading}
            useSchema={slice.primary.use_faq_schema || false}
            sliceProps={context}
            headingNeedsSeparator={isVenuePage}
            tabData={slice?.items}
            isVenuePage={context.isVenuePage}
            findBestSeatsCtaCallback={findBestSeatsCallback}
          />,
          props
        );
      }
    },
    listicle_section: (props: any) => {
      const { slice } = props || {};
      const {
        primary: { section_title, listicle_type },
        slices,
      } = slice;
      return sliceWrapper(
        <ListicleSection
          title={section_title}
          type={listicle_type?.toLowerCase()}
          childSlices={slices}
        />,
        props
      );
    },
    listicle: (props: any) => {
      const { slice, context, index } = props || {};
      const { type } = context;

      return sliceWrapper(
        <Listicle key={index} type={type} index={index} data={slice} />,
        props
      );
    },
    listicle_section_v2: (props: any) => {
      const { slice, context } = props || {};
      const {
        primary: { listicle_title, listicle_type, settings_type },
        slices,
      } = slice;
      const { prismicDocsForListicle, collectionsInListicles } = context;

      return sliceWrapper(
        <ListicleSectionV2
          settings={settings_type}
          title={listicle_title}
          type={listicle_type?.toLowerCase()}
          childSlices={slices}
          prismicDocsForListicle={prismicDocsForListicle}
          collectionsInListicles={collectionsInListicles}
        />,
        props
      );
    },
    listicle_v2: (props: any) => {
      const { slice, context, index } = props || {};
      const { type, settings, title } = context;

      return sliceWrapper(
        <ListicleV2
          type={type}
          items={slice?.items}
          index={index}
          settings={settings}
          listicleSectionTitle={title}
        />,
        props
      );
    },
    global_experiences: (props: any) => {
      const { slice, context } = props || {};
      const { cards_in_a_row, experience_type, mb_type, show_see_all, title } =
        slice?.primary;

      const experienceCarouselTitle =
        context?.isGlobalCollection && experience_type === 'Tickets'
          ? `${context?.collectionName} ${title}`
          : title;

      return sliceWrapper(
        <ExperienceCarousel
          cardsInARow={cards_in_a_row}
          experienceType={experience_type}
          mbType={mb_type}
          showSeeAll={show_see_all}
          title={experienceCarouselTitle}
          {...context}
        />,
        props
      );
    },

    collection_carousel: (props: any) => {
      const { slice, context } = props || {};

      return sliceWrapper(
        <CollectionCarousel
          title={slice?.primary?.carousel_title}
          subtext={slice?.primary?.carousel_subtext}
          carouselType={slice?.primary?.carousel_type}
          showSeeAll={slice?.primary?.show_see_all}
          {...context}
        />,
        props
      );
    },
    tours_list: (props: any) => {
      const { context } = props || {};
      return sliceWrapper(context.tourListSection, props);
    },
    automated_comparison_table: (props: any) => {
      const { slice, context } = props || {};
      return sliceWrapper(
        <AutomatedComparisonTable
          isMobile={context.isMobile}
          heading={slice?.primary?.section_title}
          description={slice?.primary?.section_sub_heading}
          collectionId={slice?.primary?.collection_id}
        />,
        props
      );
    },
    ugc_carousel: (props: any) => {
      const { slice, context } = props || {};
      return sliceWrapper(
        <UGCCarousel
          isMobile={context.isMobile}
          heading={slice?.primary?.title}
          subHeading={slice?.primary?.sub_title}
          cards={slice?.items}
        />,
        props
      );
    },
    google_map_iframe: (props: any) => {
      const { slice, context } = props || {};
      return sliceWrapper(
        <GoogleMap
          mapURL={slice.primary.google_map_url.url}
          isVenuePage={context.isVenuePage}
        />,
        props
      );
    },
  };
};
