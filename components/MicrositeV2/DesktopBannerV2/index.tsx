import {
  type MouseEventHandler,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import TrustBooster from 'components/MicrositeV2/BannerV2TrustBooster';
import {
  BannerSlide,
  Container,
  GradientWrapper,
  MediaContainer,
  SlideDescription,
  SlideImageWrapper,
  SwiperControls,
  SwiperWrapper,
} from 'components/MicrositeV2/DesktopBannerV2/styles';
import {
  IBannerProps,
  IMediaProps,
} from 'components/MicrositeV2/MobileBannerV2/interface';
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
import { strings } from 'const/strings';
import ChevronLeft from 'assets/chevronLeft';
import ChevronRight from 'assets/chevronRight';
import { IBannerImageProps } from './interface';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

const FIRST_SLIDE_DURATION = 12000;
const SLIDE_DURATION = 4800;

const Media = ({ index, item, fallbackImage, className }: IMediaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const swiperParentNode = containerRef.current?.parentNode as HTMLDivElement;
  const eventTracking = swiperParentNode?.classList?.contains(
    'swiper-slide-duplicate-active'
  );

  return (
    <MediaContainer ref={containerRef} className="media-container">
      <Conditional if={index === 0 && item?.desktopVideoLink}>
        <Video
          key={item?.desktopVideoLink}
          url={item?.desktopVideoLink}
          fallbackImage={{
            url: fallbackImage,
            altText: item?.alt,
          }}
          imageAspectRatio={'21:9'}
          imageId={String(index)}
          imageWidth={784}
          imageHeight={433}
          imageFill={false}
          dontLazyLoadImage={true}
          videoPosition={VIDEO_POSITIONS.BANNER}
          eventTracking={eventTracking}
          shouldVideoPlay
          shouldAutoPlay
          pauseOnclick
          showPauseIcon={false}
          showPlayIcon={false}
        />
      </Conditional>
      <Conditional if={index !== 0 || (index === 0 && !item?.desktopVideoLink)}>
        <SlideImageWrapper>
          <Image
            url={item.url}
            alt={item.alt}
            fetchPriority="high"
            priority
            height={433}
            width={784}
            autoCrop={false}
            className={`banner-image-${index} ${className}`}
            loadHigherQualityImage={true}
          />
        </SlideImageWrapper>
      </Conditional>
    </MediaContainer>
  );
};

const DesktopBannerV2 = ({
  allTours = {},
  bannerImages,
  trustBoosters,
  isEntertainmentBanner,
}: IBannerProps) => {
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

  const onPrev: MouseEventHandler<HTMLElement> = (e: any) => {
    e.stopPropagation();
    if (swiper !== null) {
      swiper.slidePrev();
    }
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.CHEVRON_CLICKED,
      Direction: 'Previous',
    });
  };

  const onNext: MouseEventHandler<HTMLElement> = (e: any) => {
    e.stopPropagation();
    if (swiper !== null) {
      swiper.slideNext();
    }
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.CHEVRON_CLICKED,
      Direction: 'Next',
    });
  };

  const swiperParams: SwiperProps = {
    loop: bannerImages?.length > 1,
    loopedSlides: bannerImages?.length,
    preventInteractionOnTransition: true,
    onSwiper: (swiper: any) => setSwiperInstance(swiper),
    initialSlide: 0,
    autoplay: {
      delay: !swiper?.realIndex ? FIRST_SLIDE_DURATION : SLIDE_DURATION,
      disableOnInteraction: false,
    },
    watchSlidesProgress: true,
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

  const onSwiperWrapperClicked = () => {
    if (!swiper) return;
    onBannerClicked(bannerImages[swiper.realIndex]?.showPageUrl?.url);
  };

  const onPaginatorClicked = (index: number, event: React.MouseEvent) => {
    if (!swiper) return;
    event.stopPropagation();
    swiper.slideTo(index + 1);
    setActiveSlideIndex(index);
  };

  return (
    <Container>
      <SwiperWrapper
        onClick={onSwiperWrapperClicked}
        className={`${swiper?.realIndex !== 0 ? 'clickable' : ''}`}
      >
        <Swiper {...swiperParams} className="swiper-no-swiping">
          {bannerImages?.map((item: IBannerImageProps, index: number) => {
            return (
              <BannerSlide key={index}>
                <Media fallbackImage={item?.url} item={item} index={index} />

                <SlideDescription index={index}>
                  <div className="container">
                    <Conditional if={item?.bannerHeading}>
                      {index === 0 ? (
                        <h1
                          className="banner-header"
                          dangerouslySetInnerHTML={{
                            __html: item?.bannerHeading,
                          }}
                        />
                      ) : (
                        <h2
                          className="banner-header"
                          dangerouslySetInnerHTML={{
                            __html: item?.bannerHeading,
                          }}
                        />
                      )}
                    </Conditional>
                    <Conditional if={item?.bannerSubText}>
                      <p>{item?.bannerSubText}</p>
                    </Conditional>
                    <Conditional if={item?.showPageUrl?.url && index > 0}>
                      <Button
                        className={`banner-cta-button`}
                        fillType="fill"
                        onClick={() =>
                          onBannerClicked(item?.showPageUrl?.url ?? '')
                        }
                        role="button"
                        tabIndex={0}
                      >
                        {
                          strings.ENTERTAINMENT_MB_LANDING_PAGE
                            .GRAB_YOUR_TICKETS
                        }
                      </Button>
                    </Conditional>
                  </div>
                </SlideDescription>

                <Conditional if={index === 0}>
                  <GradientWrapper position={'top'} />
                  <GradientWrapper position={'bottom'} />
                  <GradientWrapper position={'right'} />
                </Conditional>
              </BannerSlide>
            );
          })}
        </Swiper>

        <div className="paginator">
          <div className="paginator-container">
            <Paginator
              tabSize={2}
              dotSize={0.5}
              totalCount={bannerImages?.length}
              activeIndex={activeSlideIndex}
              activeSlideTimer={
                swiper?.realIndex === 0 ? FIRST_SLIDE_DURATION : SLIDE_DURATION
              }
              margin={0.1875}
              containerWidthOverride={110}
              onDotClick={onPaginatorClicked}
            />
          </div>
        </div>
        <SwiperControls $showControls={bannerImages?.length > 1}>
          <div className="swiper-controls-container">
            <div
              className="prev-slide"
              role="button"
              tabIndex={0}
              onClick={onPrev}
            >
              {ChevronLeft}
            </div>
            <div
              className="next-slide"
              role="button"
              tabIndex={0}
              onClick={onNext}
            >
              <ChevronRight />
            </div>
          </div>
        </SwiperControls>
      </SwiperWrapper>
      <TrustBooster
        trustBoosters={trustBoosters}
        isEntertainmentBanner={isEntertainmentBanner}
      />
    </Container>
  );
};

export default DesktopBannerV2;
