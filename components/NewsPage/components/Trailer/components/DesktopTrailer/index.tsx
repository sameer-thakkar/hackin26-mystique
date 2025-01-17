import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import { EffectFade } from 'swiper';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import { Ratings } from 'components/NewsPage/components/Sidebar';
import type { TDesktopTrailerProps } from 'components/NewsPage/components/Trailer/components/DesktopTrailer/interface';
import {
  Container,
  LinearGradient,
  Overlay,
  Slider,
  SwiperControls,
  TrailerHeading,
  Wrapper,
} from 'components/NewsPage/components/Trailer/components/DesktopTrailer/styles';
import Swiper from 'components/Swiper';
import Button from 'UI/Button';
import Image from 'UI/Image';
import Video from 'UI/Video';
import { MBContext } from 'contexts/MBContext';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { truncate } from 'utils/helper';
import { convertUidToUrl } from 'utils/urlUtils';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CTA_TYPE,
  NEWS_PAGE_SECTIONS,
  TRAILER_BG_ILLUSTRATION,
  VIDEO_POSITIONS,
} from 'const/index';
import { strings } from 'const/strings';
import RightTailHeadArrow from 'assets/rightTailHeadArrow';
import TranslucentLeft from 'assets/translucentLeft';
import TranslucentRight from 'assets/translucentRight';

const MediaPlayer = dynamic(
  () => import('components/NewsPage/components/Trailer/components/MediaPlayer'),
  { ssr: false }
);

const Media: React.FC<
  React.PropsWithChildren<{ videoUrl: string | undefined }>
> = ({ videoUrl }) => {
  return (
    <>
      <Conditional if={videoUrl}>
        <LinearGradient position="top" />
        <Video
          key={videoUrl}
          url={videoUrl!}
          fallbackImage={{
            url: '',
            altText: '',
          }}
          imageAspectRatio={'4:5'}
          dontLazyLoadImage={false}
          videoPosition={VIDEO_POSITIONS.TRAILERS}
          shouldAutoPlay={false}
          pauseOnclick
          showPlayIcon
          showPauseIcon
        />
        <LinearGradient position="bottom" />
        <LinearGradient position="left" />
      </Conditional>
    </>
  );
};

const DesktopTrailer: React.FC<
  React.PropsWithChildren<TDesktopTrailerProps>
> = ({ content }) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [mainSwiper, setMainSwiperInstance] = useState<TSwiper | null>(null);
  const [thumbnailSwiper, setThumbnailSwiperInstance] =
    useState<TSwiper | null>(null);
  const { host, isDev, lang } = useContext(MBContext);
  const trailerRef = useRef(null);
  const isTrailerSectionVisible = useOnScreen({
    ref: trailerRef,
    unobserve: true,
  });
  const updateIndex = useCallback(() => {
    if (thumbnailSwiper !== null) {
      const slideIndex = thumbnailSwiper?.realIndex;
      setActiveSlideIndex(slideIndex);
    }
  }, [thumbnailSwiper]);

  const { trailerData, showPageDocuments, tgid, videoData } = content;
  const { NEWS_PAGE, BUY_TICKETS_CTA } = strings;
  const { TRAILERS } = NEWS_PAGE;
  const isVideoPresentForTgid = useMemo(() => tgid! in videoData, []);

  useEffect(() => {
    if (!thumbnailSwiper || thumbnailSwiper?.destroyed) return;
    thumbnailSwiper.on('slideChange', updateIndex);
    mainSwiper?.slideTo(activeSlideIndex);

    return () => {
      if (thumbnailSwiper && !thumbnailSwiper.destroyed) {
        thumbnailSwiper.off('slideChange', updateIndex);
      }
    };
  }, [thumbnailSwiper, updateIndex, activeSlideIndex, mainSwiper]);

  useEffect(() => {
    if (isTrailerSectionVisible) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.TRAILERS,
      });
    }
  }, [isTrailerSectionVisible]);

  const thumbnailSwiperOptions: SwiperProps = {
    slidesPerView: 3,
    loop: true,
    spaceBetween: 24,
    onSwiper: (thumnailSwiper: TSwiper) =>
      setThumbnailSwiperInstance(thumnailSwiper),
    lazy: true,
    allowTouchMove: false,
    slideToClickedSlide: true,
  };

  const mainSwiperOptions: SwiperProps = {
    onSwiper: (mainSwiper: TSwiper) => setMainSwiperInstance(mainSwiper),
    allowTouchMove: false,
    modules: [EffectFade],
    autoplay: false,
    lazy: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
  };

  const onPrev = () => {
    if (thumbnailSwiper !== null) {
      thumbnailSwiper.slidePrev();
    }
    return;
  };

  const onNext = () => {
    if (thumbnailSwiper !== null) {
      thumbnailSwiper.slideNext();
    }
    return;
  };

  const allTrailersCTAClicked = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.ALL_TRAILERS,
      [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.TRAILERS,
    });
  };
  const getYourTicketsCTAClicked = (showPageUrl: string) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.BUY_TICKETS,
      [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.TRAILERS,
    });
    window.open(showPageUrl, '_blank');
  };

  return (
    <Conditional if={trailerData?.length > 0}>
      <Wrapper ref={trailerRef}>
        <Conditional if={!isVideoPresentForTgid}>
          <Image
            url={TRAILER_BG_ILLUSTRATION}
            alt="Illustration"
            height="283"
            width="798"
            className="bg-illustration"
            loading="lazy"
          />
          <MediaPlayer
            trailerData={trailerData}
            showPageDocuments={showPageDocuments}
            videoData={videoData}
          />
        </Conditional>
        <Conditional if={isVideoPresentForTgid}>
          <Container>
            <TrailerHeading>{TRAILERS}</TrailerHeading>
          </Container>
          <Swiper className="no-swiping" {...mainSwiperOptions}>
            {trailerData.map((trailer, index: number) => {
              const shortSummary = trailer?.shortSummary
                ?.replace('<p>', '')
                ?.replace('</p>', '');

              const showPageUid = showPageDocuments?.reduce((acc, curr) => {
                return (acc += trailer.id === curr?.data?.tgid ? curr.uid : '');
              }, '');

              const showPageUrl = convertUidToUrl({
                uid: showPageUid,
                lang,
                isDev,
                hostname: host,
              });

              const experienceVideoUrl = videoData[String(trailer.id)];

              return (
                <Container key={index}>
                  <Media videoUrl={experienceVideoUrl} />
                  <div className="trailer-info">
                    <div className="ratings-and-reviews">
                      <Ratings
                        averageRating={trailer?.averageRating}
                        reviewCount={trailer?.reviewCount}
                      />
                    </div>
                    <h3>{trailer.name}</h3>
                    <Conditional if={shortSummary}>
                      <p className="summary">{truncate(shortSummary, 90)}</p>
                    </Conditional>
                    <Button
                      fillType="fill"
                      paddingSides="16px 12px"
                      onClick={() => getYourTicketsCTAClicked(showPageUrl)}
                    >
                      {BUY_TICKETS_CTA}
                      {RightTailHeadArrow}
                    </Button>
                  </div>
                </Container>
              );
            })}
          </Swiper>
          <Container>
            <a
              href="/"
              className="all-trailers-cta"
              onClick={allTrailersCTAClicked}
            >
              {/* <u>{SEE_ALL}</u> */}
            </a>
            <Slider $noOfSlides={trailerData?.length}>
              <Swiper className="no-swiping" {...thumbnailSwiperOptions}>
                {trailerData.map((trailer, index: number) => {
                  const imageUrl = trailer?.media?.productImages[0];
                  return (
                    <>
                      <Image
                        url={imageUrl.url}
                        height={90}
                        width={160}
                        fill
                        alt={imageUrl.altText}
                        key={index}
                        loading="lazy"
                        loadHigherQualityImage={true}
                      />
                      <Overlay />
                    </>
                  );
                })}
              </Swiper>
              <Conditional if={trailerData?.length > 3}>
                <SwiperControls>
                  <div
                    className="prev-slide"
                    role="button"
                    tabIndex={0}
                    onClick={onPrev}
                  >
                    {TranslucentLeft}
                  </div>
                  <div
                    className="next-slide"
                    role="button"
                    tabIndex={0}
                    onClick={onNext}
                  >
                    {TranslucentRight}
                  </div>
                </SwiperControls>
              </Conditional>
            </Slider>
          </Container>
        </Conditional>
      </Wrapper>
    </Conditional>
  );
};

export default DesktopTrailer;
