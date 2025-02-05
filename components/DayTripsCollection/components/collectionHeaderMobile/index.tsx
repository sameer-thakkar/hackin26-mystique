import React, { useCallback, useRef } from 'react';
import { Text } from '@headout/eevee';
import { css } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import { getBannerMediaByType } from 'components/DayTripsCollection/utils';
import { JumpLinks } from 'components/Espeon/JumpLinks';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'constants/strings';
import CollectionHeaderBanner from '../collectionHeaderBanner';
import { collectionHeaderMobileRecipe } from './styles';

const CollectionHeaderMobile = (props: any) => {
  const { items, collection, banners } = props;
  const isFirstEvent = useRef(true);

  const onSlideChanged = useCallback(
    (params: { direction: 'next' | 'previous' }) => {
      const { direction } = params;

      if (isFirstEvent.current) {
        isFirstEvent.current = false;
        return;
      }

      trackEvent({
        eventName: ANALYTICS_EVENTS.MB_BANNER.CHEVRON_CLICKED,
        [ANALYTICS_PROPERTIES.SECTION]: 'Banner Media Navigation',
        [ANALYTICS_PROPERTIES.DIRECTION]:
          direction === 'next' ? 'Next' : 'Previous',
        [ANALYTICS_PROPERTIES.TRIGGERED_BY]: 'User',
      });
    },
    []
  );

  const { images: bannerImages = [] } = getBannerMediaByType(banners || []);

  if (!collection) return null;

  const { pageTitle } = collection;

  const hasMediaForCarousel = !!(bannerImages.length > 0);

  const styles = collectionHeaderMobileRecipe.raw();

  return (
    <>
      <div className={css(styles.root)}>
        <Text as="h1" className={css(styles.header)}>
          {pageTitle}
        </Text>
        <Text as="p" className={css(styles.subtext)}>
          {strings.DAY_TRIPS.BANNER.SUBTEXT}
        </Text>
        <Conditional if={hasMediaForCarousel}>
          <div className={css(styles.carouselContainer)}>
            <div className={css(styles.carouselPositioner)}>
              <CollectionHeaderBanner
                onSlideChanged={onSlideChanged}
                images={bannerImages}
                isMobile={true}
              />
            </div>
          </div>
        </Conditional>
        <JumpLinks
          isDesktop={false}
          className={css(styles.jumpLinks)}
          items={items}
          trackEvent={trackEvent}
        />
      </div>
    </>
  );
};

export default CollectionHeaderMobile;
