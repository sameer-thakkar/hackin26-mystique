import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import TrustBooster from 'components/MicrositeV2/BannerV2TrustBooster';
import { IBannerImageProps } from 'components/MicrositeV2/DesktopBannerV2/interface';
import {
  IBannerProps,
  IMediaProps,
} from 'components/MicrositeV2/MobileBannerV2/interface';
import {
  Container,
  LinearGradient,
  MediaContainer,
  SlideDescription,
  SwiperWrapper,
} from 'components/MicrositeV2/MobileBannerV2/styles';
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

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

const Media = ({ index, item, fallbackImage }: IMediaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const swiperParentNode = containerRef.current?.parentNode as HTMLDivElement;
  const eventTracking = swiperParentNode?.classList?.contains(
    'swiper-slide-duplicate-active'
  );
  return (
    <MediaContainer ref={containerRef}>
      <Conditional if={index === 0 && item?.mobileVideoLink}>
        <Video
          key={item.mobileVideoLink}
          url={item.mobileVideoLink}
          fallbackImage={{
            url: fallbackImage,
            altText: item.alt,
          }}
          imageAspectRatio={'21:9'}
          imageId="banner-video-fallback-image"
          imageWidth={327}
          imageHeight={200}
          dontLazyLoadImage={true}
          shouldVideoPlay={true}
          videoPosition={VIDEO_POSITIONS.BANNER}
          eventTracking={eventTracking}
          pauseOnclick
          showPauseIcon={false}
          showPlayIcon={false}
        />
        <LinearGradient />
      </Conditional>
      <Conditional if={index !== 0 || (index === 0 && !item?.mobileVideoLink)}>
        <Image
          url={
            item.mobile_url || item.mobile_url?.length
              ? item.mobile_url
              : item.url
          }
          alt={item.alt}
          height={189}
          width={375}
          fetchPriority="high"
          priority
          autoCrop={true}
          className={`banner-image-${index}`}
        />
      </Conditional>
    </MediaContainer>
  );
};

const MobileBannerV2 = ({ allTours, bannerImages }: IBannerProps) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const { lang } = useContext(MBContext);

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

  const swiperParams: SwiperProps = {
    loop: true,
    preventInteractionOnTransition: true,
    slideToClickedSlide: true,
    onSwiper: (swiper: any) => setSwiperInstance(swiper),
    centeredSlides: true,
    slidesPerView: 'auto',
    loopedSlides: bannerImages.length,
    autoplay: {
      delay: swiper?.realIndex === 0 || !swiper?.realIndex ? 12000 : 2400,
      disableOnInteraction: false,
    },
    watchSlidesProgress: true,
  };
  const analyticsParams = {
    [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
    [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
    [ANALYTICS_PROPERTIES.TGIDS]: Object.keys(allTours).map((tgid) => tgid),
  };

  const onBannerClicked = (showPageUrl: string) => {
    if (!showPageUrl) return;

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
        <Swiper {...swiperParams}>
          {bannerImages.map((item: IBannerImageProps, index: number) => {
            return (
              <div
                key={index}
                onClick={() => onBannerClicked(item?.showPageUrl?.url ?? '')}
                role="button"
                tabIndex={0}
              >
                <Media
                  index={index}
                  item={item}
                  fallbackImage={item?.url}
                  hasSubText={!!item.bannerSubText}
                />
                <SlideDescription index={index}>
                  <div className="container">
                    <Conditional if={item?.bannerHeading && index === 0}>
                      <h1
                        className="banner-header"
                        dangerouslySetInnerHTML={{
                          __html: item?.bannerHeading,
                        }}
                      />
                    </Conditional>
                  </div>
                </SlideDescription>
              </div>
            );
          })}
        </Swiper>
        <div className="paginator">
          <Paginator
            tabSize={1.25}
            dotSize={0.375}
            margin={0.125}
            totalCount={bannerImages.length}
            activeIndex={activeSlideIndex}
            activeSlideTimer={swiper?.realIndex === 0 ? 12000 : 2400}
          />
        </div>
      </SwiperWrapper>
      <TrustBooster isMobile={true} />
    </Container>
  );
};

export default MobileBannerV2;
