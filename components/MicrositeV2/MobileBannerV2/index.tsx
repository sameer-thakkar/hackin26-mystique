import { useContext, useRef, useState } from 'react';
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
import { strings } from 'const/strings';

const Media = ({ index, item, fallbackImage, hasSubText }: IMediaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const swiperParentNode = containerRef.current?.parentNode as HTMLDivElement;
  const eventTracking = swiperParentNode?.classList?.contains(
    'swiper-slide-duplicate-active'
  );
  return (
    <MediaContainer ref={containerRef}>
      <LinearGradient height={33} isTopGradient={true} />
      <LinearGradient height={33} isTopGradient={true} />
      <Conditional if={index === 0 && item?.mobileVideoLink}>
        <Video
          key={item.mobileVideoLink}
          url={item.mobileVideoLink}
          fallbackImage={{
            url: fallbackImage,
            altText: item.alt,
          }}
          imageAspectRatio={'21:9'}
          imageId={String(index)}
          imageWidth={375}
          imageHeight={232}
          dontLazyLoadImage={true}
          shouldVideoPlay={true}
          videoPosition={VIDEO_POSITIONS.BANNER}
          eventTracking={eventTracking}
          pauseOnclick
          showPauseIcon={false}
          showPlayIcon={false}
        />
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
      <LinearGradient
        height={57}
        isTopGradient={false}
        index={index}
        hasSubText={hasSubText}
      />
    </MediaContainer>
  );
};

const MobileBannerV2 = ({ allTours, bannerImages }: IBannerProps) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const { lang } = useContext(MBContext);

  const swiperParams: SwiperProps = {
    preventInteractionOnTransition: true,
    slideToClickedSlide: true,
    onSwiper: (swiper: any) => setSwiperInstance(swiper),
  };
  const analyticsParams = {
    [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
    [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
    [ANALYTICS_PROPERTIES.TGIDS]: Object.keys(allTours).map((tgid) => tgid),
  };

  const handleSlideChange = (swiperInstance: any) => {
    setActiveSlideIndex(swiperInstance.activeIndex);
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
        <Swiper {...swiperParams} onSlideChange={handleSlideChange}>
          {bannerImages.map((item: IBannerImageProps, index: number) => {
            return (
              <>
                <Media
                  index={index}
                  item={item}
                  fallbackImage={item?.url}
                  hasSubText={!!item.bannerSubText}
                />
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
                    <Conditional if={index > 0}>
                      <p>{item?.bannerSubText}</p>
                      <Conditional if={item?.showPageUrl}>
                        <Button
                          className={`tour-book-now-cta`}
                          fillType="fill"
                          onClick={() =>
                            onGrabTicketsClicked(item?.showPageUrl?.url || '')
                          }
                          role="button"
                          tabIndex={0}
                        >
                          {strings.LTT_LANDING_PAGE.GRAB_YOUR_TICKETS}
                        </Button>
                      </Conditional>
                    </Conditional>
                  </div>
                </SlideDescription>
              </>
            );
          })}
        </Swiper>
        <div className="paginator">
          <Paginator
            tabSize={0.9375}
            dotSize={0.375}
            totalCount={bannerImages.length}
            activeIndex={activeSlideIndex}
            activeSlideTimer={0.1}
          />
        </div>
      </SwiperWrapper>
      <TrustBooster isMobile={true} />
    </Container>
  );
};

export default MobileBannerV2;
