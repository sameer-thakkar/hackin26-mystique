import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import { CardGrid } from 'components/Espeon/CardGridComp';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  COLLECTION_PAGE,
  LAYOUT_STYLE,
  PAGE_TYPES,
} from 'const/index';
import WhyDayTripsWithHoSection from '../WhyDayTripsWithHoSection';
import { experiencesSectionStylesRecipe } from './styles';

const MAX_FULL_WIDTH_PRODUCT_CARDS = 5;

const FullWidthProductCard = dynamic(
  () =>
    import(
      /* webpackChunkName: 'FullWidthProductCard' */ 'components/fullWidthProductCard'
    )
);

const CollectionProductCard = dynamic(
  () =>
    import(
      /* webpackChunkName: 'CollectionProductCard' */ 'components/collectionProductCard'
    )
);

const ExperiencesSection = (props: any) => {
  const {
    collection,
    categoryTourListData: { orderedTours = [], scorpioData = {} } = {},
  } = props;

  const allProductCardIds = orderedTours.map((tour: any) => tour.id);
  const productCardIds = allProductCardIds.filter(
    (id: number) => scorpioData[id]?.listingPrice?.finalPrice
  );

  const { setShowFloatingActionButton } = props;

  const firstContainerRef = useRef<HTMLDivElement | null>(null);
  const secondContainerRef = useRef<HTMLDivElement | null>(null);

  const isFirstContainerVisible = useOnScreen({
    ref: firstContainerRef,
    unobserve: true,
  });

  const shouldShowFullWidthCards =
    productCardIds.length <= MAX_FULL_WIDTH_PRODUCT_CARDS;

  const FULL_WIDTH_SLICE_LENGTH = productCardIds.length > 3 ? 2 : 3;
  const GRID_SLICE_LENGTH = productCardIds.length <= 7 ? 7 : 6;

  const firstFullWidthBatch = useMemo(
    () => productCardIds.slice(0, FULL_WIDTH_SLICE_LENGTH),
    [productCardIds, FULL_WIDTH_SLICE_LENGTH]
  );
  const secondFullWidthBatch = useMemo(
    () => productCardIds.slice(FULL_WIDTH_SLICE_LENGTH),
    [productCardIds, FULL_WIDTH_SLICE_LENGTH]
  );
  const firstGridBatch = useMemo(
    () => productCardIds.slice(0, GRID_SLICE_LENGTH),
    [productCardIds, GRID_SLICE_LENGTH]
  );
  const secondGridBatch = useMemo(
    () => productCardIds.slice(GRID_SLICE_LENGTH),
    [productCardIds, GRID_SLICE_LENGTH]
  );

  const WhyWithHOSection = useMemo(
    () => <WhyDayTripsWithHoSection isDesktop={true} />,
    []
  );

  useEffect(() => {
    if (!isFirstContainerVisible) return;

    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
      [ANALYTICS_PROPERTIES.SECTION]: COLLECTION_PAGE.CURATED_EXPERIENCES,
      [ANALYTICS_PROPERTIES.LAYOUT_STYLE]: shouldShowFullWidthCards
        ? LAYOUT_STYLE.FULL_WIDTH
        : LAYOUT_STYLE.GRID,
    });
  }, [isFirstContainerVisible, shouldShowFullWidthCards]);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.2) {
          setShowFloatingActionButton(false);
        } else if (
          entry.intersectionRatio < 0.2 &&
          window.scrollY > (entry.target as HTMLElement).offsetTop
        ) {
          setShowFloatingActionButton(true);
        }
      });
    },
    [setShowFloatingActionButton]
  );
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.2], // Observe at 0% and 20% visibility
    });

    if (secondContainerRef.current) {
      observer.observe(secondContainerRef.current);
    } else if (firstContainerRef.current) {
      observer.observe(firstContainerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection]);

  const styles = experiencesSectionStylesRecipe();

  return (
    <section className={styles.root}>
      <Conditional if={shouldShowFullWidthCards}>
        <div
          ref={firstContainerRef}
          className={cx(
            styles.fullWidthProductCardsContainer,
            styles.firstContainer
          )}
        >
          {firstFullWidthBatch.map((productId: number, index: number) => (
            <FullWidthProductCard
              key={productId}
              id={productId}
              productCardPosition={index + 1}
              showMetaLabel={false}
              overrideDescriptors={true}
              lineClampDefault={6}
              pageType={PAGE_TYPES.DAY_TRIPS_COLLECTION}
              collectionsInfo={collection}
              scorpioData={scorpioData}
              {...props}
            />
          ))}
        </div>
        {WhyWithHOSection}
        <Conditional if={secondFullWidthBatch.length > 0}>
          <div
            ref={secondContainerRef}
            className={cx(
              styles.fullWidthProductCardsContainer,
              styles.secondContainer
            )}
          >
            {secondFullWidthBatch.map((productId: number, index: number) => (
              <FullWidthProductCard
                key={productId}
                id={productId}
                productCardPosition={FULL_WIDTH_SLICE_LENGTH + index + 1}
                showMetaLabel={false}
                overrideDescriptors={true}
                lineClampDefault={6}
                pageType={PAGE_TYPES.DAY_TRIPS_COLLECTION}
                collectionsInfo={collection}
                scorpioData={scorpioData}
                {...props}
              />
            ))}
          </div>
        </Conditional>
      </Conditional>

      <Conditional if={!shouldShowFullWidthCards}>
        <div
          ref={firstContainerRef}
          className={cx(
            styles.gridProductCardsContainer,
            styles.firstContainer
          )}
        >
          <CardGrid
            cards={firstGridBatch.map((productId: number, index: number) => ({
              id: productId,
              productCardPosition: index + 1,
              isDesktop: true,
              key: productId,
              showMetaLabel: false,
              overrideDescriptors: true,
              pageType: PAGE_TYPES.DAY_TRIPS_COLLECTION,
              collectionsInfo: collection,
              scorpioData,
              showCtas: true,
              ...props,
            }))}
            columns={3}
            CardComponent={CollectionProductCard}
          />
        </div>
        {WhyWithHOSection}

        <Conditional if={secondGridBatch.length > 0}>
          <div
            ref={secondContainerRef}
            className={cx(
              styles.gridProductCardsContainer,
              styles.secondContainer
            )}
          >
            <CardGrid
              cards={secondGridBatch.map(
                (productId: number, index: number) => ({
                  id: productId,
                  productCardPosition: GRID_SLICE_LENGTH + index + 1,
                  isDesktop: true,
                  key: productId,
                  showMetaLabel: false,
                  overrideDescriptors: true,
                  pageType: PAGE_TYPES.DAY_TRIPS_COLLECTION,
                  collectionsInfo: collection,
                  scorpioData,
                  showCtas: true,
                  ...props,
                })
              )}
              columns={3}
              CardComponent={CollectionProductCard}
            />
          </div>
        </Conditional>
      </Conditional>
    </section>
  );
};

export default ExperiencesSection;
