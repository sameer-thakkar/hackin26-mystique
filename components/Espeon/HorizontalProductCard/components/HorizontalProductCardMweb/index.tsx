/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
// import YourPickBadge from 'components/Espeon/ProductCard/YourPickBadge';
import { Text } from '@headout/eevee';
import { cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import { Descriptors } from 'components/Espeon/Common/Descriptors';
import { productCardStyles } from 'components/Espeon/HorizontalProductCard/components/HorizontalProductCardMweb/styles';
import type { THorizontalProductCardMweb } from 'components/Espeon/HorizontalProductCard/types';
import { COLLECTION_CARD_DESCRIPTOR_RANKING } from 'components/Espeon/ProductCard/constants';
// import { EntryPoint } from 'components/Espeon/Itinerary/components/EntryPoint';
import DescriptorList from 'components/Espeon/ProductCard/DescriptorList';
import Highlights from 'components/Espeon/ProductCard/Highlights';
import MediaCarousel from 'components/Espeon/ProductCard/MediaCarousel';
import PriceBlock from 'components/Espeon/ProductCard/PriceBlock';
import ProductLabels from 'components/Espeon/ProductCard/ProductLabels';
import { getDescriptorCodes } from 'components/Espeon/ProductCard/utils';
import type { TListingPrice } from 'components/Espeon/types';
import { pickByKeys } from 'components/Espeon/utils';
import ItineraryCTA from '../ItineraryCTA';

export const HorizontalProductCardMweb = ({
  tour,
  lang = 'en',
  productUrl,
  labels,
  currenciesMap,
  isPinnedCard,
  productCardPosition,
  onCardClick,
  onSwiperChange,
  metaLabel,
  isDesktop = false,
  showMetaLabel = true,
  overrideDescriptors = false,
  onMoreInfoClick,
  onItineraryCTAClick,
  showItineraryCTA = false,
  isCardClickable = true,
  ctas = [],
}: THorizontalProductCardMweb) => {
  const [cardShrinked, setCardShrinked] = useState(false);

  const {
    id,
    name = '',
    reviewsDetails,
    primaryCategory,
    primarySubCategory,
    highlights,
    descriptors,
    media,
    listingPrice,
    minDuration,
    maxDuration,
    // itineraries,
    standardDescriptors = [],
    inclusionBasedDescriptors = [],
  } = tour;

  const {
    pricing: pricingLabels,
    more: moreLabel,
    descriptors: descriptorLabels,
    ratingsNew,
    longDescriptorTexts,
  } = labels;

  const formattedPrimaryCategory = pickByKeys(primaryCategory ?? {}, [
    'id',
    'displayName',
  ]);

  const formattedPrimarySubCategory = pickByKeys(primarySubCategory ?? {}, [
    'id',
    'displayName',
  ]);

  const descriptorCodes = getDescriptorCodes(
    descriptors,
    COLLECTION_CARD_DESCRIPTOR_RANKING
  );

  const currencyList = Object.keys(currenciesMap).map(
    (key) => currenciesMap[key]
  );
  const handleSwiperTouch = (event: React.TouchEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const {
    mainWrapper,
    mediaContent,
    info,
    mainContent,
    descriptorsContent,
    // itineraryEntryPoint,
    pricingSection,
    descriptorsList,
    highlights: highlightsStyle,
    headerAnchor,
    itineraryCTA,
    ctaContainer,
  } = productCardStyles({ isDesktop, overrideDescriptors, isCardClickable });

  // const hasItineraries = !!itineraries?.length;

  return (
    <div
      data-tgid={id}
      className={cx(mainWrapper, cardShrinked && 'shrinked')}
      role="link"
      tabIndex={0}
      {...(isCardClickable
        ? {
            onClick: onCardClick,
            onTouchStart: () => setCardShrinked(true),
            onTouchEnd: () => setCardShrinked(false),
          }
        : {})}
      // onMouseDown={() => setCardShrinked(true)}
      // onMouseUp={() => setCardShrinked(false)}
      aria-label={`View ${name} details`}
    >
      <div
        className={mediaContent}
        onTouchStart={handleSwiperTouch}
        onTouchEnd={handleSwiperTouch}
        data-section="media"
      >
        <Conditional if={isPinnedCard}>
          {/* <YourPickBadge label={labels.yourPick} /> */}
        </Conditional>

        <MediaCarousel
          images={media?.productImages}
          variant={{
            consumer: isDesktop
              ? 'verticalProductCardDweb'
              : 'horizontalProductCard',
          }}
          isMobile={!isDesktop}
          onSwiperChange={onSwiperChange}
          productCardPosition={productCardPosition}
          width={358}
          height={229}
        />

        <Conditional if={showItineraryCTA}>
          <div className={itineraryCTA}>
            <ItineraryCTA
              onItineraryCTAClick={onItineraryCTAClick ?? (() => {})}
            />
          </div>
        </Conditional>

        {/* <Conditional if={hasItineraries}>
					<EntryPoint
						className={itineraryEntryPoint}
						onClick={() => {}}
						isHOHOItinerary={itineraries?.[0]?.type === 'HOHO'}
						strings={{
							HOHO: { ROUTES: 'routes' },
							ITINERARY: { TAB: 'View Itinerary' },
						}}
					/>
				</Conditional> */}
      </div>

      <div className={mainContent}>
        <div className={info} data-section="details">
          <ProductLabels
            reviewsDetails={reviewsDetails}
            primaryCategory={formattedPrimaryCategory}
            primarySubCategory={formattedPrimarySubCategory}
            metaLabel={metaLabel}
            showSeparator={
              !!(metaLabel || primaryCategory?.id || primarySubCategory?.id)
            }
            ratingsNewLabel={ratingsNew}
            isMobile={true}
            onMoreInfoClick={onMoreInfoClick}
            showMetaLabel={showMetaLabel}
          />

          <a
            href={productUrl}
            className={headerAnchor}
            tabIndex={-1}
            aria-hidden="true"
            onClick={(e) => e.preventDefault()}
          >
            <Text
              as="h2"
              textStyle="Semantics/Heading/Regular"
              color="semantic.text.grey.1"
            >
              {name}
            </Text>
          </a>

          <Conditional if={descriptors.length > 0}>
            <div className={descriptorsContent}>
              <Conditional if={!overrideDescriptors}>
                <DescriptorList
                  className={descriptorsList}
                  tour={tour}
                  descriptorCodes={descriptorCodes}
                  descriptorLabels={descriptorLabels}
                  longDescriptorTexts={longDescriptorTexts}
                  moreLabel={moreLabel}
                  totalCount={descriptorCodes.length}
                  showIcon={false}
                  showSpacer={true}
                  variant={{ layout: 'row' }}
                  lang={lang}
                  minDuration={minDuration}
                  maxDuration={maxDuration}
                  isMobile={true}
                />
              </Conditional>
              <Conditional if={overrideDescriptors}>
                <Descriptors
                  descriptors={standardDescriptors as any}
                  variant="short"
                  layout="row"
                  // lang={lang}
                  showSpacer={true}
                />
                <Descriptors
                  descriptors={inclusionBasedDescriptors as any}
                  variant="long"
                  layout="column"
                  // lang={lang}
                  showSpacer={true}
                />
              </Conditional>
            </div>
          </Conditional>
        </div>

        <Conditional if={highlights}>
          <div
            className={highlightsStyle}
            id={`tour-description-${productCardPosition}`}
          >
            <Highlights highlights={highlights!} />
          </div>
        </Conditional>

        <PriceBlock
          lang={lang}
          labels={pricingLabels}
          currencyList={currencyList}
          listingPrice={listingPrice as TListingPrice}
          variant={{ consumer: 'productCard' }}
          prefix
          showNewDiscountTag
          shouldPointLeft
          showAngledTag
          showScratchPrice
          className={pricingSection}
        />
      </div>

      <Conditional if={ctas?.length}>
        <div className={ctaContainer}>
          {ctas?.map((CtaComponent) => CtaComponent)}
        </div>
      </Conditional>
    </div>
  );
};
