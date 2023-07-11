import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { scroller } from 'react-scroll';
import dynamic from 'next/dynamic';
import type { SwiperOptions } from 'swiper';
import TextOverlay from 'components/Banner/components/TextOverlay';
import Conditional from 'components/common/Conditional';
import Image from 'components/UI/Image';
import { trackEvent } from 'utils/analytics';
import { withShortcodes } from 'utils/helper';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PAGE_TYPES,
} from 'const/index';
import { BannerSubtext, StyledBanner, StyledPlaceHolder } from './__style';

const Swiper = dynamic(() => import('components/Swiper'), {
  loading: function CarouselLoadingSkeleton() {
    return <StyledPlaceHolder />;
  },
});

const loopedSlides = 3;

const swiperParams: SwiperOptions = {
  slidesPerView: 'auto',
  speed: 600,
  centeredSlides: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  loop: true,
  loopedSlides,
  lazy: true,
  preloadImages: false,
  initialSlide: 0,
  direction: 'horizontal',
};

export const BANNER_PARAMS = {
  DESKTOP: {
    ASPECT_RATIO: '3:1',
    WIDTH: '900',
  },
  MOBILE: {
    ASPECT_RATIO: '16:9',
    WIDTH: '360',
  },
};

interface BannerImageProps {
  url: string;
  alt: string;
  mobileUrl?: string;
}

type TBannerCarouselProps = {
  bannerImages: BannerImageProps[];
  bannerHeading: string;
  bannerCtaText: string;
  bannerSubtext: string;
  currentLanguage: string;
  isMobile: boolean;
  boxed: boolean;
  hideCTA: boolean;
  orderedTgids: string[];
};

/**
 * Microsite V1 Carousel Banner
 */
const Banner = (props: TBannerCarouselProps) => {
  const {
    bannerHeading: tempBannerHeading,
    bannerImages,
    currentLanguage,
    hideCTA,
    bannerSubtext: tempBannerSubtext,
    bannerCtaText = '',
    orderedTgids,
    isMobile: isMobileFromCDNHeader,
  } = props;

  const [isMobile, setIsMobile] = useState(isMobileFromCDNHeader);

  const [swiper, updateSwiper] = useState(null);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    const mobileCheck = window.innerWidth < 768;

    setMounted(true);

    if (mobileCheck) {
      setIsMobile(mobileCheck);
    }
  }, []);

  const bannerHeadingArray = withShortcodes(tempBannerHeading);
  const bannerHeading = bannerHeadingArray?.join(' ');

  const analyticsParams = {
    [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
    [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
    [ANALYTICS_PROPERTIES.TGIDS]: orderedTgids,
    [ANALYTICS_PROPERTIES.MB_NAME]: bannerHeading,
  };

  const isSwiperSet = swiper !== null && !(swiper as any)?.destroyed;

  useEffect(() => {
    if (!isSwiperSet) {
      return;
    }

    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.VISIBLE,
      ...analyticsParams,
    });
  }, [isSwiperSet]);

  const onTouchEnd = useCallback((swiper: any) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.BANNER_SCROLL,
      ...analyticsParams,
      Ranking: swiper.realIndex + 1,
    });
  }, []);

  const scrollTicketSection = useCallback(() => {
    scroller.scrollTo('tour-list-heading', {
      duration: 1200,
      offset: isMobile ? -80 : -100,
      smooth: 'easeInOutQuart',
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.CTA_CLICKED,
      ...analyticsParams,
      Ranking: ((swiper as any)?.realIndex || 0) + 1,
    });
  }, [swiper]);

  const bannerSubtext = withShortcodes(tempBannerSubtext);

  const { ASPECT_RATIO, WIDTH } = isMobile
    ? BANNER_PARAMS.MOBILE
    : BANNER_PARAMS.DESKTOP;

  return (
    <div>
      <StyledBanner
        loopedSlides={loopedSlides}
        isMounted={mounted}
        bannerCount={bannerImages?.length}
      >
        {bannerImages?.length === 1 ? (
          <div className="mb-slide single-slide">
            <Image
              width={WIDTH}
              aspectRatio={ASPECT_RATIO}
              url={bannerImages[0]?.url}
              mobileUrl={bannerImages[0]?.mobileUrl}
              alt={bannerImages[0]?.alt || 'banner'}
              addDarkOverlay
            />
            <TextOverlay
              onClick={scrollTicketSection}
              bannerHeading={bannerHeading}
              bannerCtaText={bannerCtaText}
              hideCTA={hideCTA}
              isFirst
            />
          </div>
        ) : (
          <>
            <Swiper
              {...swiperParams}
              onTouchEnd={onTouchEnd}
              // @ts-expect-error TS(2322): Type 'Dispatch<SetStateAction<null>>' is not assig... Remove this comment to see the full error message
              onSwiper={updateSwiper}
            >
              {bannerImages?.map((image: BannerImageProps, index: number) => {
                const priority =
                  index <= 1 || index === bannerImages?.length - 1;
                return (
                  <div key={index} className="mb-slide">
                    <Image
                      key={index}
                      width={WIDTH}
                      aspectRatio={ASPECT_RATIO}
                      url={image?.url}
                      fill={true}
                      mobileUrl={image?.mobileUrl}
                      alt={image?.alt || 'banner'}
                      addDarkOverlay
                      priority={priority}
                      autoCrop={false}
                    />
                    <TextOverlay
                      onClick={scrollTicketSection}
                      bannerHeading={bannerHeading}
                      bannerCtaText={bannerCtaText}
                      hideCTA={hideCTA}
                      isFirst={(swiper as any)?.realIndex === index}
                    />
                  </div>
                );
              })}
            </Swiper>
          </>
        )}
      </StyledBanner>

      <Conditional if={bannerSubtext?.length}>
        <BannerSubtext>
          <p>{bannerSubtext}</p>
        </BannerSubtext>
      </Conditional>
    </div>
  );
};

export default Banner;
