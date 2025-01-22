import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type Swiper from 'swiper';
import { Button, Text } from '@headout/eevee';
import { css, cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import { ICollectionCarousel } from 'components/slices/CollectionCarousel/interface';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { titleCase } from 'utils/stringUtils';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { ArrowCircleRight } from 'assets/airportTransfers';
import { DiscoverMoreDrawer } from './DiscoverMoreDrawer';
import { POICard } from './POICard';
import {
  bottomCirclesStyles,
  cardsContainerStyles,
  carouselArrowsContainerStyles,
  collectionsSectionStyles,
  sectionHeadingStyles,
  topCirclesStyle,
} from './styles';

const SwiperWrapper = dynamic(() => import('components/Swiper'));

const MAX_COLLECTIONS_TO_SHOW = 10;

export const POICollectionsSection = ({
  primaryCity,
  taggedCity,
  allCollectionsData,
  isMobile,
}: ICollectionCarousel) => {
  const { menu: collectionsMap = {} } = allCollectionsData || {};

  const [isDiscoverMoreDrawerOpen, setIsDiscoverMoreDrawerOpen] =
    useState(false);

  const [swiper, setSwiper] = useState<Swiper | null>(null);
  const [isSwiperEnd, setIsSwiperEnd] = useState(false);
  const [isSwiperStart, setIsSwiperStart] = useState(true);

  const handleSlideChange = () => {
    if (!swiper) {
      return;
    }

    setIsSwiperEnd(swiper?.isEnd ?? false);
    setIsSwiperStart(swiper?.isBeginning ?? false);
  };

  const mbCity = titleCase(primaryCity?.displayName || taggedCity || '');

  const collectionsList = Object.values(collectionsMap)
    .filter((c) => c.collectionData.experienceCount > 0)
    .slice(0, MAX_COLLECTIONS_TO_SHOW);

  const ref = useRef<HTMLDivElement>(null);

  const isOnScreen = useOnScreen({
    ref,
    unobserve: true,
  });

  useEffect(() => {
    if (isOnScreen) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,

        [ANALYTICS_PROPERTIES.SECTION]: 'Must See Attractions', // todo: update when copy is finalised
      });
    }
  }, [isOnScreen]);

  if (collectionsList.length < 4) {
    return null;
  }

  const collectionCards = (max?: number) =>
    (max ? collectionsList.slice(0, max) : collectionsList).map(
      (collectionDetails, index) => {
        const {
          url,
          label,
          collectionData: { cardImageUrl, cardMedia },
        } = collectionDetails;

        const { url: mediaImageUrl, metadata: { imageAltText = '' } = {} } =
          cardMedia || {};

        const imageUrl = mediaImageUrl || cardImageUrl;
        const altText = imageAltText || label;

        return (
          <POICard
            key={url}
            url={url}
            label={label}
            collectionData={collectionDetails?.collectionData as any}
            imageUrl={imageUrl}
            altText={altText}
            index={index}
            isOnScreen={isOnScreen}
          />
        );
      }
    );

  return (
    <section className={collectionsSectionStyles} ref={ref}>
      <CirclesSVG isMobile={isMobile} className={topCirclesStyle} />
      <CirclesSVG
        isMobile={isMobile}
        data-is-mobile={isMobile}
        className={bottomCirclesStyles}
      />
      <div
        className={css({
          maxWidth: '75rem',
          margin: '0 auto',
        })}
      >
        <div
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          })}
        >
          <Text className={sectionHeadingStyles} as="h2">
            {strings.formatString(
              strings.POI_COLLECTIONS_SECTION.MAKE_THE_MOST_OF_CITY,
              mbCity
            )}
          </Text>

          <Conditional if={!isMobile && collectionsList?.length > 4}>
            <div className={carouselArrowsContainerStyles}>
              <ArrowCircleRight
                onClick={() => swiper?.slidePrev()}
                className={cx(
                  isSwiperStart ? 'disabled' : '',
                  css({
                    marginRight: '0.5rem',
                    transform: 'rotate(180deg)',
                  })
                )}
              />

              <ArrowCircleRight
                onClick={() => swiper?.slideNext()}
                className={isSwiperEnd ? 'disabled' : ''}
              />
            </div>
          </Conditional>
        </div>

        <div className={cardsContainerStyles}>
          {isMobile || collectionsList?.length === 4 ? (
            collectionCards(4)
          ) : (
            <SwiperWrapper
              slidesPerView={4}
              spaceBetween={24}
              onSwiper={setSwiper}
              onSlideChange={handleSlideChange}
              watchSlidesProgress
            >
              {collectionCards()}
            </SwiperWrapper>
          )}

          <Conditional if={isMobile && collectionsList?.length > 4}>
            <Button
              size="medium"
              primaryText={strings.POI_COLLECTIONS_SECTION.DISCOVER_MORE}
              variant="primary"
              as="button"
              btnType="black"
              className={css({
                gridColumn: 'span 2',
                marginTop: 'space.4',
              })}
              onClick={() => {
                setIsDiscoverMoreDrawerOpen(true);

                trackEvent({
                  eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
                  [ANALYTICS_PROPERTIES.CTA_TYPE]: 'Discover more',
                });
              }}
            />
          </Conditional>
        </div>
      </div>

      <Conditional if={isMobile && isDiscoverMoreDrawerOpen}>
        <DiscoverMoreDrawer
          collectionsList={collectionsList}
          onClose={() => setIsDiscoverMoreDrawerOpen(false)}
          cityName={mbCity}
        />
      </Conditional>
    </section>
  );
};

const CirclesSVG = (props: { className?: string; isMobile: boolean }) => {
  const CIRCLE_RADIUS = props.isMobile ? 5 : 10;
  const CIRCLE_DIAMETER = CIRCLE_RADIUS * 2;
  const CIRCLE_GAP = props.isMobile ? 10 : 12; // In mobile: 20px total spacing - 5px diameter = 15px gap
  const CIRCLE_UNIT = CIRCLE_DIAMETER + CIRCLE_GAP;

  const viewportWidth =
    typeof window !== 'undefined' ? window.innerWidth : 1200;

  // Calculate number of circles needed (+2 to ensure coverage of edges)
  const numberOfCircles = Math.ceil(viewportWidth / CIRCLE_UNIT);

  const totalWidth = numberOfCircles * CIRCLE_UNIT;

  return (
    <svg
      width="100%"
      height={CIRCLE_DIAMETER + 1}
      viewBox={`0 0 ${totalWidth} ${CIRCLE_DIAMETER + 1}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
      data-is-mobile={props.isMobile}
    >
      {Array.from({ length: numberOfCircles }).map((_, index) => (
        <circle
          key={index}
          cx={CIRCLE_RADIUS + index * CIRCLE_UNIT}
          cy={CIRCLE_RADIUS}
          r={CIRCLE_RADIUS}
          fill="white"
        />
      ))}
    </svg>
  );
};
