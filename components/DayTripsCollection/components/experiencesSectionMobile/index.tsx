import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import WhyDayTripsWithHoSection from 'components/DayTripsCollection/components/WhyDayTripsWithHoSection';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  COLLECTION_PAGE,
  LAYOUT_STYLE,
  PAGE_TYPES,
} from 'constants/index';
import { experiencesSectionStylesRecipe } from './styles';

const CollectionProductCard = dynamic(
  () =>
    import(
      /* webpackChunkName: 'CollectionProductCard' */ 'components/collectionProductCard' // TODO: move this component to common instead of mobile
    )
);

const ExperiencesSection = (props: any) => {
  const {
    collection,
    categoryTourListData: { orderedTours = [], scorpioData = {} } = {},
    setShowFloatingActionButton,
    highlightTGID,
    hasValidHighlightedTGID,
  } = props;

  const allProductCardIds = orderedTours.map((tour: any) => tour.id);
  const productIds = allProductCardIds.filter(
    (id: number) => scorpioData[id]?.listingPrice?.finalPrice
  );

  const firstContainerRef = useRef<HTMLDivElement | null>(null);
  const secondContainerRef = useRef<HTMLDivElement | null>(null);

  const isFirstContainerVisible = useOnScreen({
    ref: firstContainerRef,
    unobserve: true,
  });

  const GRID_SLICE_LENGTH = productIds.length === 4 ? 4 : 3;

  const firstBatch = useMemo(
    () => productIds.slice(0, GRID_SLICE_LENGTH),
    [productIds, GRID_SLICE_LENGTH]
  );

  const secondBatch = useMemo(
    () => productIds.slice(GRID_SLICE_LENGTH),
    [productIds, GRID_SLICE_LENGTH]
  );

  useEffect(() => {
    if (!isFirstContainerVisible) return;

    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
      [ANALYTICS_PROPERTIES.SECTION]: COLLECTION_PAGE.CURATED_EXPERIENCES,
      [ANALYTICS_PROPERTIES.LAYOUT_STYLE]: LAYOUT_STYLE.GRID,
    });
  }, [isFirstContainerVisible]);

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
      <div
        ref={firstContainerRef}
        className={cx(styles.productCardsContainer, styles.firstContainer)}
      >
        {firstBatch.map((productId: number, index: number) => (
          <CollectionProductCard
            key={productId}
            id={productId}
            productCardPosition={index + 1}
            showMetaLabel={false}
            isDesktop={false}
            overrideDescriptors={true}
            pageType={PAGE_TYPES.DAY_TRIPS_COLLECTION}
            userPickPinnedCard={
              hasValidHighlightedTGID && productId === highlightTGID
            }
            collectionsInfo={collection}
            scorpioData={scorpioData}
            {...props}
          />
        ))}
      </div>
      <WhyDayTripsWithHoSection isDesktop={false} />
      <Conditional if={secondBatch.length > 0}>
        <div
          ref={secondContainerRef}
          className={cx(styles.productCardsContainer, styles.secondContainer)}
        >
          {secondBatch.map((productId: number, index: number) => (
            <CollectionProductCard
              key={productId}
              id={productId}
              productCardPosition={GRID_SLICE_LENGTH + index + 1}
              showMetaLabel={false}
              isDesktop={false}
              overrideDescriptors={true}
              pageType={PAGE_TYPES.DAY_TRIPS_COLLECTION}
              userPickPinnedCard={
                hasValidHighlightedTGID && productId === highlightTGID
              }
              collectionsInfo={collection}
              scorpioData={scorpioData}
              {...props}
            />
          ))}
        </div>
      </Conditional>
    </section>
  );
};

export default ExperiencesSection;
