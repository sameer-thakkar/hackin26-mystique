import { useContext, useRef, useState } from 'react';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import TrustBooster from 'components/MicrositeV2/BannerV2TrustBooster';
import PinnedCard from 'components/MicrositeV2/LttLandingPageV2/BannerV2PinnedCard';
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
import { BANNERS } from 'const/lttCategories';
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
      <Conditional if={index === 0}>
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
          dontLazyLoadImage={false}
          shouldVideoPlay={true}
          videoPosition={VIDEO_POSITIONS.BANNER}
          eventTracking={eventTracking}
          pauseOnclick
        />
      </Conditional>
      <Conditional if={index !== 0}>
        <Image
          url={item.mobile_url}
          alt={item.alt}
          priority
          height={189}
          width={375}
          autoCrop={true}
          className={`banner-image-${index}`}
          fetchPriority="high"
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

const MobileBannerV2 = ({ allTours, pinnedTgid }: IBannerProps) => {
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
          {BANNERS.map((item: any, index: number) => {
            return (
              <>
                <Media
                  index={index}
                  item={item}
                  fallbackImage={
                    'https://tourlandish.s3.amazonaws.com/assets/images/ltt/banner-first.png'
                  }
                  hasSubText={item.desc}
                />
                <SlideDescription index={index}>
                  <div className="container">
                    <h1 dangerouslySetInnerHTML={{ __html: item.title }} />
                    {index > 0 ? (
                      <>
                        <p>{item.desc}</p>
                        <Button
                          className={`tour-book-now-cta`}
                          fillType="fill"
                          onClick={() =>
                            onGrabTicketsClicked(item.show_page_link)
                          }
                          role="button"
                          tabIndex={0}
                        >
                          {strings.GRAB_YOUR_TICKETS_NOW}
                        </Button>
                      </>
                    ) : null}
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
            totalCount={BANNERS.length}
            activeIndex={activeSlideIndex}
            activeSlideTimer={0.1}
          />
        </div>
      </SwiperWrapper>
      <TrustBooster hasPinnedCard={pinnedTgid} />
      <Conditional if={pinnedTgid}>
        <PinnedCard pinnedTgidData={allTours?.[pinnedTgid]} isMobile={true} />
      </Conditional>
    </Container>
  );
};

export default MobileBannerV2;
