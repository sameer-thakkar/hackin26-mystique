import { useState } from 'react';
import Conditional from 'components/common/Conditional';
import {
  IDesktopBannerProps,
  IMediaProps,
} from 'components/MicrositeV2/LttLandingPageV2/BannerV2/interface';
import {
  Container,
  GradientWrapper,
  LinearGradient,
  MediaContainer,
  SlideDescriptionDesktop,
  SlideDescriptionMobile,
  SwiperWrapper,
} from 'components/MicrositeV2/LttLandingPageV2/BannerV2/styles';
import PinnedCard from 'components/MicrositeV2/LttLandingPageV2/BannerV2PinnedCard';
import TrustBooster from 'components/MicrositeV2/LttLandingPageV2/BannerV2TrustBooster';
import Swiper from 'components/Swiper';
import Button from 'UI/Button';
import Image from 'UI/Image';
import { Paginator } from 'UI/Paginator';
import Video from 'UI/Video';
import { VIDEO_POSITIONS } from 'const/index';
import { strings } from 'const/strings';

const Media = ({ index, item, isMobile }: IMediaProps) => {
  return (
    <MediaContainer>
      <Conditional if={isMobile}>
        <LinearGradient height={33} isTopGradient={true} />
      </Conditional>
      <Conditional if={index === 0}>
        <Video
          key={item?.desktopVideoLink}
          url={
            item?.desktopVideoLink ??
            'https://cdn-imgix-open.headout.com/home/video-banner/dWeb.mp4'
          }
          /* TODO: Fallback Image URL */
          fallbackImage={{
            url: '',
            altText: item?.alt,
          }}
          imageAspectRatio={'21:9'}
          imageId={String(index)}
          imageWidth={375}
          imageHeight={232}
          dontLazyLoadImage={false}
          shouldVideoPlay={true}
          videoPosition={VIDEO_POSITIONS.BANNER}
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
          className={`banner-image-${index}`}
          fetchPriority="high"
        />
      </Conditional>
      <Conditional if={isMobile}>
        <LinearGradient height={57} isTopGradient={false} index={index} />
      </Conditional>
    </MediaContainer>
  );
};

const BannerV2 = (props: IDesktopBannerProps) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const { bannerImages, isMobile, directTgid, allTours } = props;
  const directTgidData = allTours[directTgid];

  const handleSlideChange = (swiperInstance: any) => {
    setActiveSlideIndex(swiperInstance.activeIndex);
  };

  const swiperParams = isMobile
    ? {
        preventInteractionOnTransition: true,
        slideToClickedSlide: true,
      }
    : {
        autoplay: {
          delay: 5000,
        },
        shouldSwiperUpdate: true,
      };

  const SlideDescription = isMobile
    ? SlideDescriptionMobile
    : SlideDescriptionDesktop;

  return (
    <Container isMobile={isMobile}>
      <SwiperWrapper isMobile={isMobile}>
        <Conditional if={!isMobile}>
          <GradientWrapper position={'top'} />
        </Conditional>
        <Swiper {...swiperParams} onSlideChange={handleSlideChange}>
          {bannerImages?.map((item: any, index: number) => {
            return (
              <>
                <Media item={item} index={index} isMobile={isMobile} />
                <SlideDescription index={index}>
                  <div className="container">
                    <h2>{index > 0 && 'Closing on 4th April'}</h2>
                    <h1>{item.bannerHeading ?? 'Back to the future'}</h1>
                    {index > 0 ? (
                      <>
                        <p>
                          {item.bannerSubText ??
                            'An award-winning adaptation of the Wizard of Oz. Don’t miss out your chance to view this award winning musical.'}
                        </p>
                        <Button
                          className={`tour-book-now-cta`}
                          fillType="fill"
                          onClick={() => window.open('www.google.com')}
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
        <Conditional if={!isMobile}>
          <GradientWrapper position={'bottom'} />
        </Conditional>

        <div className="paginator">
          <div className="paginator-container">
            <Paginator
              tabSize={1.25}
              dotSize={0.5}
              totalCount={bannerImages.length}
              activeIndex={activeSlideIndex}
              activeSlideTimer={0.1}
            />
          </div>
        </div>
        {/* <SwiperControls>
          <div className="prev-slide" role="button" tabIndex={0}>
            {TRANSLUCENT_LEFT}
          </div>
          <div className="next-slide" role="button" tabIndex={0}>
            {TRANSLUCENT_RIGHT}
          </div>
        </SwiperControls> */}
      </SwiperWrapper>
      <TrustBooster pinnedCardPresent={!!directTgidData} />
      <PinnedCard pinnedTgidData={directTgidData} isMobile={isMobile} />
    </Container>
  );
};

export default BannerV2;
