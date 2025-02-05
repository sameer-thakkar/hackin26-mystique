import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Button, Text } from '@headout/eevee';
import { css, cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import { Descriptors } from 'components/Espeon/Common/Descriptors';
import { SeoContent } from 'components/Espeon/Common/SeoContent';
import HighlightsPanel from 'components/Espeon/HorizontalProductCard/components/HighlightsPanel';
// import YourPickBadge from 'components/Espeon/ProductCard/components/YourPickBadge';
import { COLLECTION_CARD_DESCRIPTOR_RANKING } from 'components/Espeon/ProductCard/constants';
import DescriptorList from 'components/Espeon/ProductCard/DescriptorList';
import Highlights from 'components/Espeon/ProductCard/Highlights';
import { highlightsStyle } from 'components/Espeon/ProductCard/Highlights/styles';
import MediaCarousel from 'components/Espeon/ProductCard/MediaCarousel';
import PriceBlock from 'components/Espeon/ProductCard/PriceBlock';
import ProductLabels from 'components/Espeon/ProductCard/ProductLabels';
import { getDescriptorCodes } from 'components/Espeon/ProductCard/utils';
import { pickByKeys } from 'components/Espeon/utils';
import useWindowWidth from 'hooks/useWindowWidth';
import { currencyListAtom } from 'store/atoms/currencyList';
import type { THorizontalProductCardDweb } from '../../types';
import ItineraryCTA from '../ItineraryCTA';
import { productCardStyles } from './styles';

export const HorizontalProductCardDweb = ({
  tour,
  productUrl,
  lang = 'en',
  labels,
  // isPinnedCard,
  className,
  productCardPosition,
  onCtaClick,
  onDescriptorsHover,
  onSwiperChange,
  showMetaLabel,
  overrideDescriptors = false,
  lineClampDefault = 7,
  onMoreInfoClick,
  onItineraryCTAClick,
  showItineraryCTA = false,
}: THorizontalProductCardDweb) => {
  const [lineClamp, setLineClamp] = useState(lineClampDefault);
  const {
    id,
    name = '',
    reviewsDetails = {},
    primaryCategory,
    primarySubCategory,
    content,
    descriptors,
    media,
    listingPrice,
    minDuration,
    maxDuration,
    standardDescriptors = [],
    inclusionBasedDescriptors = [],
  } = tour ?? {};
  const { highlights } = content ?? {};

  const {
    mainCta,
    pricing: pricingLabels,
    more: moreLabel,
    descriptors: descriptorLabels,
    ratingsNew,
    longDescriptorTexts,
    highlightsMoreDetails,
  } = labels;
  const currencyList = useRecoilValue(currencyListAtom);

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

  const windowWidth = useWindowWidth();

  useEffect(() => {
    let updatedLineClamp = lineClampDefault;

    if (name.length > 98) {
      updatedLineClamp = lineClampDefault - 2;
    } else if (name.length > 49) {
      updatedLineClamp = lineClampDefault - 1;
    }

    if (windowWidth && windowWidth < 1280 && updatedLineClamp > 1) {
      updatedLineClamp -= 1;
    }

    if (inclusionBasedDescriptors.length > 2) {
      updatedLineClamp -= 1;
    }

    if (updatedLineClamp !== lineClamp) {
      setLineClamp(updatedLineClamp);
    }
  }, [
    windowWidth,
    name,
    lineClamp,
    lineClampDefault,
    inclusionBasedDescriptors,
  ]);

  const {
    mainWrapper,
    mediaContent,
    mainContent,
    headerContent,
    descriptorsContent,
    footer,
    cta,
    headerAnchor,
    itineraryCTA,
  } = productCardStyles({ overrideDescriptors });

  return (
    <div data-tgid={id} className={cx(mainWrapper, className)}>
      <div className={mediaContent} data-section="media">
        {/* <Conditional if={isPinnedCard}>
          <YourPickBadge label={labels.yourPick} />
        </Conditional> */}

        <MediaCarousel
          images={media?.productImages ?? []}
          variant={{ consumer: 'horizontalProductCard' }}
          isMobile={false}
          onSwiperChange={onSwiperChange}
          productCardPosition={productCardPosition}
          width={577}
          height={362}
        />
        <Conditional if={showItineraryCTA}>
          <div className={itineraryCTA}>
            <ItineraryCTA
              onItineraryCTAClick={onItineraryCTAClick ?? (() => {})}
            />
          </div>
        </Conditional>
      </div>

      <div className={mainContent}>
        <div data-section="details">
          <div className={headerContent}>
            <ProductLabels
              reviewsDetails={reviewsDetails}
              primaryCategory={formattedPrimaryCategory}
              primarySubCategory={formattedPrimarySubCategory}
              showSeparator={true}
              ratingsNewLabel={ratingsNew}
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
                textStyle="Semantics/Heading/Large"
                color="semantic.text.grey.1"
              >
                {name}
              </Text>
            </a>
          </div>

          <Conditional if={descriptorCodes.length > 0}>
            <div className={descriptorsContent}>
              <Conditional if={!overrideDescriptors}>
                <DescriptorList
                  tour={tour}
                  descriptorCodes={descriptorCodes}
                  descriptorLabels={descriptorLabels}
                  longDescriptorTexts={longDescriptorTexts}
                  moreLabel={moreLabel}
                  totalCount={descriptorCodes.length}
                  showIcon={true}
                  showMoreLabel={true}
                  variant={{ layout: 'row' }}
                  lang={lang}
                  minDuration={minDuration}
                  maxDuration={maxDuration}
                  onDescriptorsHover={onDescriptorsHover}
                />
              </Conditional>

              <Conditional if={overrideDescriptors}>
                <Descriptors
                  descriptors={standardDescriptors as any}
                  variant="short"
                  layout="row"
                  showSpacer={true}
                />
                <Descriptors
                  descriptors={inclusionBasedDescriptors as any}
                  variant="long"
                  layout="row"
                />
              </Conditional>
            </div>
          </Conditional>

          <Conditional if={!!highlights}>
            <HighlightsPanel
              detailsLabel={highlightsMoreDetails}
              onCtaClick={onMoreInfoClick}
            >
              <Highlights
                highlights={highlights!}
                className={cx(
                  css({
                    display: '[-webkit-box]',
                    WebkitLineClamp: lineClamp,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  } as any),
                  highlightsStyle({
                    consumer: 'default',
                  }) as string
                )}
              />
            </HighlightsPanel>

            <SeoContent>
              <Highlights highlights={highlights!} />
            </SeoContent>
          </Conditional>
        </div>

        <div className={footer} data-section="pricing-cta">
          <PriceBlock
            lang={lang}
            labels={pricingLabels}
            currencyList={currencyList}
            listingPrice={listingPrice}
            variant={{
              consumer: 'productCard',
              labelStyle: 'heading',
            }}
            prefix
            showNewDiscountTag
            shouldPointLeft
            showAngledTag
            showScratchPrice
          />

          <div className={cta}>
            <Button
              as="button"
              btnType="primary"
              onClick={onCtaClick}
              primaryText={mainCta}
              size="medium"
              state="default"
              variant="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
