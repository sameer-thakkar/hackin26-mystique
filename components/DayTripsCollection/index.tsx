import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@headout/eevee';
import LazyComponent from 'components/common/LazyComponent';
import ChevronUp from 'components/Espeon/Assets/ChevronUp';
import { useGuestCount } from 'hooks/useGuestCount';
import { trackEvent } from 'utils/analytics';
import { dayTripCollectionParser } from 'utils/parsers/dayTripCollectionParser';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  COLLECTION_PAGE,
} from 'const/index';
import { strings } from 'constants/strings';
import Conditional from '../common/Conditional';
import { dayTripsCollectionPageRecipe } from './styles';
import { getJumpLinkItems } from './utils';

const CollectionHeaderDesktop = dynamic(
  () =>
    import(
      /* webpackChunkName: "CollectionHeaderDesktop" */ './components/collectionHeaderDesktop'
    )
);

const CollectionHeaderMobile = dynamic(
  () =>
    import(
      /* webpackChunkName: "CollectionHeaderMobile" */ './components/collectionHeaderMobile'
    )
);

const ExperiencesSectionDesktop = dynamic(
  () =>
    import(
      /* webpackChunkName: "ExperiencesSectionDesktop" */ './components/experiencesSectionDesktop'
    )
);

const ExperiencesSectionMobile = dynamic(
  () =>
    import(
      /* webpackChunkName: "ExperiencesSectionMobile" */ './components/experiencesSectionMobile'
    )
);

const ReviewsV2 = dynamic(
  () =>
    import(/* webpackChunkName: "ReviewsV2" */ 'components/common/ReviewsV2')
);

const DayTripsCollectionPage = (props: any) => {
  const {
    isMobile,
    collectionReviews,
    collection,
    lang,
    currency,
    micrositeData,
  } = props;
  const isDesktop = !isMobile;
  const collectionReviewItems = collectionReviews?.result?.reviews?.items || [];

  const [showFloatingActionButton, setShowFloatingActionButton] =
    useState(false);
  const [dayTripCollectionData, setDayTripCollectionData] = useState<any>(null);
  const { data: guestCount } = useGuestCount();

  const experiencesSectionRef = useRef<HTMLDivElement>(null);
  const fabViewedEventTriggered = useRef(false);

  const scrollToTop = useCallback(() => {
    if (experiencesSectionRef.current) {
      const scrollTopOffset = isDesktop ? 45 : 32;
      const elementPosition =
        experiencesSectionRef.current.getBoundingClientRect().top +
        window.scrollY;
      const offsetPosition = elementPosition - scrollTopOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, [isDesktop]);

  const fetchData = useCallback(async () => {
    const { collectionDetails, orderedTours, scorpioData } =
      await dayTripCollectionParser({
        collectionId: collection?.id,
        lang,
        hostname: window.location.origin,
        localizedStrings: strings,
        currency,
        micrositeData,
      });
    setDayTripCollectionData({
      collection: collectionDetails,
      categoryTourListData: {
        orderedTours,
        scorpioData,
      },
      scorpioData,
    });
  }, [collection?.id, lang, currency]);

  useEffect(() => {
    if (showFloatingActionButton && !fabViewedEventTriggered.current) {
      fabViewedEventTriggered.current = true;
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: COLLECTION_PAGE.FLOATING_ACTION_BUTTON,
      });
    }
  }, [showFloatingActionButton, fabViewedEventTriggered]);

  useEffect(() => {
    if (!collection?.id) return;
    fetchData();
  }, [collection, fetchData]);

  if (
    !collection?.id ||
    !dayTripCollectionData ||
    !dayTripCollectionData?.collection
  )
    return null;

  const hasReviews = collectionReviewItems.length > 0;

  const childProps = {
    ...props,
    ...dayTripCollectionData,
  };

  const experiencesSectionProps = {
    ...childProps,
    setShowFloatingActionButton,
  };

  const styles = dayTripsCollectionPageRecipe({
    isDesktop,
    showFloatingActionButton,
  });

  return (
    <div className={styles.root}>
      <div className={styles.floatingActionButtonContainer}>
        <Button
          as="button"
          variant="primary"
          size={isDesktop ? 'medium' : 'small'}
          btnType="black"
          state="default"
          icon={
            <ChevronUp
              strokeColor="semantic.cta.white"
              height={isDesktop ? '16' : '12'}
              width={isDesktop ? '16' : '12'}
            />
          }
          iconPosition="trailing"
          onClick={(event) => {
            trackEvent({
              eventName: ANALYTICS_EVENTS.STICKY_ACTION_BUTTON_CLICKED,
            });
            event.stopPropagation();
            scrollToTop();
          }}
          primaryText={strings.VIEW_ALL_EXPERIENCES}
          className={styles.floatingActionButton}
        />
      </div>

      <Conditional if={isDesktop}>
        <CollectionHeaderDesktop
          {...childProps}
          hasReviews={hasReviews}
          items={getJumpLinkItems(
            hasReviews,
            isDesktop,
            `${Math.floor(guestCount?.totalServed / 1e6)}`
          )}
        />
        <div ref={experiencesSectionRef}>
          <ExperiencesSectionDesktop {...experiencesSectionProps} />
        </div>
      </Conditional>
      <Conditional if={!isDesktop}>
        <CollectionHeaderMobile
          {...childProps}
          hasReviews={hasReviews}
          items={getJumpLinkItems(
            hasReviews,
            isDesktop,
            `${Math.floor(guestCount?.totalServed / 1e6)}`
          )}
        />
        <div ref={experiencesSectionRef}>
          <ExperiencesSectionMobile {...experiencesSectionProps} />
        </div>
      </Conditional>
      <div id="reviews-section" className={styles.reviewSectionContainer}>
        <LazyComponent>
          <ReviewsV2
            reviews={collectionReviewItems}
            collectionDetails={collection}
            shouldFocusProductCardOnCTAClick={false}
          />
        </LazyComponent>
      </div>
    </div>
  );
};

export default DayTripsCollectionPage;
