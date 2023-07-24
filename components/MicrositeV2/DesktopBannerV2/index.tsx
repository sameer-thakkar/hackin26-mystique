import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import TrustBooster from 'components/MicrositeV2/BannerV2TrustBooster';
import {
  Container,
  GradientWrapper,
  MediaContainer,
  SlideDescription,
  SwiperControls,
  SwiperWrapper,
} from 'components/MicrositeV2/DesktopBannerV2/styles';
import PinnedCard from 'components/MicrositeV2/LttLandingPageV2/BannerV2PinnedCard';
import {
  IBannerProps,
  IMediaProps,
} from 'components/MicrositeV2/MobileBannerV2/interface';
import Swiper from 'components/Swiper';
import Button from 'UI/Button';
import Image from 'UI/Image';
import { Paginator } from 'UI/Paginator';
import Video from 'UI/Video';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PAGE_TYPES,
  VIDEO_POSITIONS,
} from 'const/index';
import { BANNERS } from 'const/lttCategories';
import { strings } from 'const/strings';
import { TRANSLUCENT_LEFT, TRANSLUCENT_RIGHT } from 'assets/SvgIcons';

const Media = ({ index, item, fallbackImage, className }: IMediaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const swiperParentNode = containerRef.current?.parentNode as HTMLDivElement;
  const eventTracking = swiperParentNode?.classList?.contains(
    'swiper-slide-duplicate-active'
  );

  return (
    <MediaContainer ref={containerRef} className="media-container">
      <Conditional if={index === 0}>
        <Video
          key={item?.desktopVideoLink}
          url={item?.desktopVideoLink}
          fallbackImage={{
            url: fallbackImage,
            altText: item?.alt,
          }}
          imageAspectRatio={'21:9'}
          imageId={String(index)}
          imageWidth={375}
          imageHeight={232}
          dontLazyLoadImage={false}
          videoPosition={VIDEO_POSITIONS.BANNER}
          eventTracking={eventTracking}
          shouldVideoPlay
          shouldAutoPlay
          pauseOnclick
        />
      </Conditional>
      <Conditional if={index !== 0}>
        <Image
          url={item.url}
          alt={item.alt}
          priority
          height={843}
          width={1350}
          autoCrop={true}
          className={`banner-image-${index} ${className}`}
          fetchPriority="high"
        />
      </Conditional>
    </MediaContainer>
  );
};

const DesktopBannerV2 = ({ allTours, pinnedTgid }: IBannerProps) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const { lang } = useContext(MBContext);

  const analyticsParams = {
    [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
    [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
    [ANALYTICS_PROPERTIES.TGIDS]: Object.keys(allTours).map((tgid) => tgid),
  };

  const updateIndex = useCallback(() => {
    if (swiper !== null) {
      const slideIndex = swiper.realIndex;
      setActiveSlideIndex(slideIndex);
    }
  }, [swiper]);

  useEffect(() => {
    if (!swiper || swiper?.destroyed) return;

    swiper.on('slideChange', updateIndex);

    return () => {
      if (swiper && !swiper.destroyed) {
        swiper.off('slideChange', updateIndex);
      }
    };
  }, [swiper, updateIndex, activeSlideIndex]);

  const onPrev = () => {
    if (swiper !== null) {
      swiper.slidePrev();
    }
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.CHEVRON_CLICKED,
      Direction: 'Previous',
    });
  };

  const onNext = () => {
    if (swiper !== null) {
      swiper.slideNext();
    }
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.CHEVRON_CLICKED,
      Direction: 'Next',
    });
  };

  const swiperParams: SwiperProps = {
    loop: true,
    preventInteractionOnTransition: true,
    onSwiper: (swiper: any) => setSwiperInstance(swiper),
    cssMode: false,
  };
  const onGrabTicketsClicked = (showPageUrl: string) => {
    if (swiper) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MB_BANNER.CTA_CLICKED,
        Ranking: swiper.realIndex + 1,
        ...analyticsParams,
      });
    }
    window.open(showPageUrl, '_blank');
  };

  return (
    <Container>
      <SwiperWrapper>
        <GradientWrapper position={'top'} />
        <Swiper {...swiperParams} className="swiper-no-swiping">
          {BANNERS?.map((item: any, index: number) => {
            const { title, desc, show_page_link } = item;
            return (
              <>
                <Media
                  fallbackImage={
                    'https://cdn-imgix.headout.com/assets/images/ltt/banner-first.png?auto=compress'
                  }
                  item={item}
                  index={index}
                  className={
                    index > 0 && index === activeSlideIndex
                      ? 'transition-end-state'
                      : ''
                  }
                />
                <SlideDescription index={index}>
                  <div className="container">
                    <h1 dangerouslySetInnerHTML={{ __html: title }} />
                    <Conditional if={index > 0}>
                      <p>{desc}</p>
                      <Conditional if={show_page_link}>
                        <Button
                          className={`banner-cta-button`}
                          fillType="fill"
                          onClick={() => onGrabTicketsClicked(show_page_link)}
                          role="button"
                          tabIndex={0}
                        >
                          {strings.GRAB_YOUR_TICKETS_NOW}
                        </Button>
                      </Conditional>
                    </Conditional>
                  </div>
                </SlideDescription>
              </>
            );
          })}
        </Swiper>

        <GradientWrapper position={'bottom'} />
        <div className="paginator">
          <div className="paginator-container">
            <Paginator
              tabSize={1.25}
              dotSize={0.5}
              totalCount={BANNERS.length}
              activeIndex={activeSlideIndex}
              activeSlideTimer={0.1}
            />
          </div>
        </div>
        <SwiperControls>
          <div className="swiper-controls-container">
            <div
              className="prev-slide"
              role="button"
              tabIndex={0}
              onClick={onPrev}
            >
              {TRANSLUCENT_LEFT}
            </div>
            <div
              className="next-slide"
              role="button"
              tabIndex={0}
              onClick={onNext}
            >
              {TRANSLUCENT_RIGHT}
            </div>
          </div>
        </SwiperControls>
      </SwiperWrapper>
      <TrustBooster hasPinnedCard={pinnedTgid} />
      <Conditional if={pinnedTgid}>
        <PinnedCard pinnedTgidData={allTours?.[pinnedTgid]} />
      </Conditional>
    </Container>
  );
};

export default DesktopBannerV2;
