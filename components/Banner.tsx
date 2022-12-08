import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import { scroller } from 'react-scroll';
import { withShortcodes } from 'utils/helper';
import { trackEvent } from 'utils/analytics';
import { STAR } from 'assets/SvgIcons';
import { shouldDisplayRatings, truncateNumber } from 'utils/index';
import {
  AverageRatingWrapper,
  BannerSubtext,
  ButtonWrapper,
  OverlayInfoWrapper,
  OverlayWrapper,
  RatingCountWrapper,
  RatingsWrapper,
  StyledBanner,
  StyledPlaceHolder,
} from 'components/BannerStyles';
import Button from 'components/UI/Button';
import Image from 'components/UI/Image';
import Conditional from 'components/common/Conditional';
import { AggregatedRatingDetails } from 'components/common/models/AggregatedRatingDetailsModels';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PAGE_TYPES,
} from 'const/index';
import { strings } from 'const/strings';

const Swiper = dynamic(() => import('components/Swiper'), {
  ssr: false,
  loading: function CarouselLoadingSkeleton() {
    return <StyledPlaceHolder />;
  },
});

const swiperParams = {
  slidesPerView: 'auto',
  speed: 600,
  centeredSlides: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  shouldSwiperUpdate: true,
  loop: true,
  loopedSlides: 3,
  lazy: true,
  preloadImages: false,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    renderBullet: function (_, className) {
      return `<li class=${className}></li>`;
    },
  },
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
  showBannerSubtext: boolean;
  currentLanguage: string;
  isMobile: boolean;
  boxed: boolean;
  hideCTA: boolean;
  orderedTgids: string[];
  aggregatedRatingDetails?: AggregatedRatingDetails;
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
    showBannerSubtext,
    bannerCtaText = '',
    orderedTgids,
    isMobile: isMobileFromCDNHeader,
    aggregatedRatingDetails,
  } = props;

  const [isMobile, setIsMobile] = useState(isMobileFromCDNHeader);

  const [swiper, updateSwiper] = useState(null);

  const bannerHeadingArray = withShortcodes(tempBannerHeading);
  const bannerHeading = bannerHeadingArray?.join(' ');

  const analyticsParams = {
    [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
    [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
    [ANALYTICS_PROPERTIES.TGIDS]: orderedTgids,
    [ANALYTICS_PROPERTIES.MB_NAME]: bannerHeading,
  };

  const isSwiperSet = swiper !== null && !swiper?.destroyed;

  const { ASPECT_RATIO, WIDTH } = isMobile
    ? BANNER_PARAMS.MOBILE
    : BANNER_PARAMS.DESKTOP;

  const bannerSubtext = withShortcodes(tempBannerSubtext);

  useLayoutEffect(() => {
    const mobileCheck = window.innerWidth < 768;
    if (mobileCheck) {
      setIsMobile(mobileCheck);
    }
  }, []);

  useEffect(() => {
    if (!isSwiperSet) {
      return;
    }

    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.VISIBLE,
      ...analyticsParams,
    });

    swiper?.on?.('touchEnd', (touchend) => {
      if (touchend?.srcElement.localName === 'button') {
        return;
      }
      trackEvent({
        eventName: ANALYTICS_EVENTS.MB_BANNER.BANNER_SCROLL,
        ...analyticsParams,
        Ranking: swiper.realIndex + 1,
      });
    });
  }, [isSwiperSet]);

  const scrollTicketSection = useCallback(() => {
    scroller.scrollTo('tour-list-heading', {
      duration: 1200,
      offset: isMobile ? 25 : -90,
      smooth: 'easeInOutQuart',
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.CTA_CLICKED,
      ...analyticsParams,
      Ranking: swiper.realIndex + 1,
    });
  }, [swiper]);

  const textOverLay = () => (
    <OverlayInfoWrapper>
      <h1
        dangerouslySetInnerHTML={{ __html: bannerHeading }}
        className="banner-heading"
      />
      {shouldDisplayRatings(aggregatedRatingDetails) && (
        <RatingsWrapper>
          {STAR(COLORS.BRAND.WHITE)}
          <AverageRatingWrapper>
            {aggregatedRatingDetails.averageRating}
          </AverageRatingWrapper>
          <RatingCountWrapper>{`(${truncateNumber(
            aggregatedRatingDetails.ratingsCount
          )} Ratings)`}</RatingCountWrapper>
        </RatingsWrapper>
      )}
      <Conditional if={!hideCTA}>
        <ButtonWrapper>
          <Button
            fillType="whiteBordered"
            onClick={scrollTicketSection}
            fontSize={'1.125rem'}
          >
            {bannerCtaText || strings.BANNER_CTA}
          </Button>
        </ButtonWrapper>
      </Conditional>
    </OverlayInfoWrapper>
  );

  return (
    <div>
      <StyledBanner>
        {bannerImages?.length === 1 ? (
          <div className="mb-slide single-slide">
            <Image
              width={WIDTH}
              aspectRatio={ASPECT_RATIO}
              url={bannerImages[0]?.url}
              dontLazyLoad
              mobileUrl={bannerImages[0]?.mobileUrl}
              alt={bannerImages[0]?.alt || 'banner'}
              addDarkOverlay
            />
            {textOverLay()}
          </div>
        ) : (
          <>
            <Swiper {...swiperParams} getSwiper={updateSwiper}>
              {bannerImages?.map((image: BannerImageProps, index: number) => {
                const dontLazyLoad =
                  index <= 1 || index === bannerImages?.length - 1;
                return (
                  <div key={index} className="swiper-slide slide-image">
                    <Image
                      key={index}
                      width={WIDTH}
                      aspectRatio={ASPECT_RATIO}
                      url={image?.url}
                      mobileUrl={image?.mobileUrl}
                      alt={image?.alt || 'banner'}
                      addDarkOverlay
                      dontLazyLoad={dontLazyLoad}
                      autoCrop={false}
                    />
                  </div>
                );
              })}
            </Swiper>
            <OverlayWrapper />
            {textOverLay()}
          </>
        )}
      </StyledBanner>

      <Conditional if={bannerSubtext?.length}>
        <BannerSubtext>
          <p dangerouslySetInnerHTML={{ __html: bannerSubtext.join(' ') }}></p>
        </BannerSubtext>
      </Conditional>
      <Conditional if={showBannerSubtext && !bannerSubtext?.length}>
        <BannerSubtext>
          <p>{strings.BANNER_SUBTEXT_DISCLAIMER}</p>
        </BannerSubtext>
      </Conditional>
    </div>
  );
};

export default Banner;
