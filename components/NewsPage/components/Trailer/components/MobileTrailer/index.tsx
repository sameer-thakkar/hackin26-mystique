import { useContext, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import { Ratings } from 'components/NewsPage/components/Sidebar';
import { TMobileTrailerProps } from 'components/NewsPage/components/Trailer/components/MobileTrailer/interface';
import {
  Container,
  LinearGradient,
  SlideDescription,
  TitleHeader,
  VideoContainer,
  Wrapper,
} from 'components/NewsPage/components/Trailer/components/MobileTrailer/styles';
import Button from 'UI/Button';
import { Paginator } from 'UI/Paginator';
import Video from 'UI/Video';
import { MBContext } from 'contexts/MBContext';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { convertUidToUrl } from 'utils/urlUtils';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CTA_TYPE,
  NEWS_PAGE_SECTIONS,
  VIDEO_POSITIONS,
} from 'const/index';
import { strings } from 'const/strings';
import { RIGHT_TAIL_HEAD_ARROW } from 'assets/SvgIcons';

const Swiper = dynamic(() =>
  import(/* webpackChunkName: "MobileTrailerSwiper" */ 'components/Swiper')
);

const MobileTrailer: React.FC<TMobileTrailerProps> = ({ content }) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const { lang, isDev, host } = useContext(MBContext);
  const trailerRef = useRef(null);
  const isTrailerSectionVisible = useOnScreen({
    ref: trailerRef,
    unobserve: true,
  });

  useEffect(() => {
    if (isTrailerSectionVisible) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.TRAILERS,
      });
    }
  }, [isTrailerSectionVisible]);

  const { NEWS_PAGE, BUY_TICKETS_CTA } = strings;
  const { trailerData, showPageDocuments, videoData } = content;

  const swiperOptions: SwiperProps = {
    onSwiper: (swiper: TSwiper) => setSwiperInstance(swiper),
    onSlideChange: () => setActiveSlideIndex(swiper!.activeIndex),
  };

  // const handleCTAClick = () => {
  //   trackEvent({
  //     eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_CTA_CLICKED,
  //     [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.SEE_ALL,
  //     [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.TRAILERS,
  //   });
  //   return;
  // };

  const handleGetYourTicketsCTAClicked = (showPageUrl: string) => {
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
        <Container>
          <TitleHeader>
            <h2>{NEWS_PAGE.TRAILERS}</h2>
            {/* <Button onClick={handleCTAClick}>{SEE_ALL}</Button> */}
          </TitleHeader>
        </Container>
        <Swiper {...swiperOptions}>
          {trailerData?.map((trailer, index: number) => {
            const shortSummary = trailer.shortSummary
              .replace('<p>', '')
              .replace('</p>', '');

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
              <>
                <VideoContainer key={index}>
                  <LinearGradient position="top" />
                  <Video
                    url={experienceVideoUrl!}
                    fallbackImage={{
                      url: '',
                      altText: '',
                    }}
                    imageAspectRatio={'4:5'}
                    // imageId={String(index)}
                    dontLazyLoadImage={false}
                    videoPosition={VIDEO_POSITIONS.TRAILERS}
                    shouldVideoPlay={false}
                    shouldAutoPlay={false}
                    pauseOnclick={true}
                    showPlayIcon={true}
                    showPauseIcon={true}
                    isMobile={true}
                  />
                  <LinearGradient position="bottom" />
                </VideoContainer>

                <Container>
                  <SlideDescription>
                    <div className="description-header">
                      <span className="subcategory">
                        {trailer.primarySubCategory?.displayName?.toUpperCase?.()}
                      </span>
                      <div className="ratings-and-reviews">
                        <Ratings
                          averageRating={trailer?.averageRating}
                          reviewCount={trailer.reviewCount}
                        />
                      </div>
                    </div>
                    <h3>{trailer.name}</h3>
                    <p className="summary">{shortSummary}</p>
                    <Button
                      className="get-tickets-cta"
                      fillType="whiteBordered"
                      onClick={() =>
                        handleGetYourTicketsCTAClicked(showPageUrl)
                      }
                    >
                      {BUY_TICKETS_CTA}
                      {RIGHT_TAIL_HEAD_ARROW}
                    </Button>
                  </SlideDescription>
                </Container>
              </>
            );
          })}
        </Swiper>
        <div className="paginator">
          <Paginator
            tabSize={0.9375}
            dotSize={0.25}
            totalCount={trailerData?.length}
            activeIndex={activeSlideIndex}
            activeSlideTimer={0}
          />
        </div>
      </Wrapper>
    </Conditional>
  );
};

export default MobileTrailer;
