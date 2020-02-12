import React from 'react';
import dynamic from 'next/dynamic';
import { RichText } from 'prismic-reactjs';

import { shortCodeSerializer } from '../utils/shortCodes';
import { TrustBoosters } from './MicroBrand/TrustBoosters';
import { TourComparisonTable } from './slices/TourComparision';
import InteractiveImage from './slices/InteractiveImage';
import ImageLinksSlider from './slices/ImageLinksSlider';
import { ContentTabs } from './slices/ContentTabs';

const ImageGrid = dynamic(() => import('./ImageGrid'));
const ImageTextGrid = dynamic(() => import('./ImageTextGrid'));
const InternalContentCard = dynamic(() => import('./InternalContentCard'));
const Tabs = dynamic(() => import('./Tabs'));
const FWActionCard = dynamic(() => import('./FWActionCard'));
const RichTextBox = dynamic(() => import('./RichTextBox'));
const FeatureBox = dynamic(() => import('./FeatureBox'));
const TitleLinksCard = dynamic(() => import('./TitleLinksCard'));
const CardCarousel = dynamic(() => import('./slices/CardCaoursel'));
const CategorySection = dynamic(() => import('./MicroBrand/CategorySection'));
const CategorySlider = dynamic(() => import('./MicroBrand/CategorySlider'));
const Table = dynamic(() => import('./slices/Table'));
const MicrobrandCards = dynamic(() => import('./slices/MicrobrandCards'));

export const sliceHandler = (slice, props: any = {}) => {
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
            break;
        case 'image':
        case 'image_grid':
            return (
                <ImageGrid
                    cols={slice.primary.number_of_columns || 1}
                    images={slice.items}
                />
            );
            break;
        case 'image_text_combo_grid':
            return (
                <ImageTextGrid
                    cols={slice.primary.number_of_columns || 3}
                    cards={slice.items}
                />
            );
            break;
        case 'page_tabs':
            return <Tabs tabs={slice.items} />;
            break;
        case 'internal_content_card':
            return (
                <InternalContentCard
                    title={slice.primary.title}
                    cards={slice.items}
                />
            );
            break;
        case 'full_width_action_card':
            return (
                <FWActionCard title={slice.primary.title} cards={slice.items} />
            );
            break;
        case 'content_box':
            return <RichTextBox slices={slice.items} />;
            break;
        case 'feature_box':
            return <FeatureBox slices={slice.items} />;
            break;
        case 'footer_column':
            return (
                <TitleLinksCard
                    title={slice.primary.heading}
                    links={slice.items}
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
            break;
        case 'trust_boosters':
            let boosters = slice.items.reduce((accum, item) => {
                let booster = {
                    image_url: item.uploaded_icon.url || item.icon_link.url,
                    title: item.booster_title,
                    description: item.booster_description,
                };
                return [...accum, booster];
            }, []);

            return <TrustBoosters boosters={boosters} />;
            break;
        case 'microbrand_cards':
            return (
                <MicrobrandCards
                    cards={slice.items}
                    cardsContent={slice.primary}
                />
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
            return (
                <TourComparisonTable
                    isMobile={props.isMobile}
                    heading={slice.primary.comparision_heading}
                    description={slice.primary.comparison_description}
                    tgidsCSV={slice.primary.product_tgids}
                    orderedLabels={orderedLabels}
                />
            );
        case 'interactive_image':
            const { primary } = slice;
            const url = primary.linked_image.url || primary.uploaded_image.url;
            const alt = primary.uploaded_image.alt || 'Popup Image';
            return <InteractiveImage src={url} alt={alt} />;
        case 'image_links_carousel':
            const cards = slice.items.reduce((acc, card) => {
                return [
                    ...acc,
                    {
                        image: {
                            url:
                                card.uploaded_image.url ||
                                card.linked_image.url,
                            alt: card.uploaded_image.alt || card.card_link.url,
                        },
                        link: card.card_link,
                        card_title: card.card_title,
                    },
                ];
            }, []);
            return (
                <ImageLinksSlider
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
                    tabsArr={slice.primary.tab_list
                        .split(',')
                        .map(t => t.trim())}
                    contentArr={slice.items}
                />
            );
        default:
        // ToDo: Add to Error Logs (Slice)
    }
};
