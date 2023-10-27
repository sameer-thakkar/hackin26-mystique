import { useCallback, useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import VideoPlayer from 'components/common/VideoPlayer';
import { TMediaPlayerProps } from 'components/NewsPage/components/Trailer/components/MediaPlayer/interface';
import {
  BackgroundCircle,
  CardContainer,
  CardInfoHeader,
  Container,
  ImageContainer,
  modalStyles,
  Navigation,
  NavigationButtons,
  Slider,
  TitleBar,
  TrailerCard,
  TrailerName,
} from 'components/NewsPage/components/Trailer/components/MediaPlayer/styles';
import Button from 'UI/Button';
import Image from 'UI/Image';
import { Paginator } from 'UI/Paginator';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import { convertUidToUrl } from 'utils/urlUtils';
import { StarIcon } from 'const/descriptorIcons';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CTA_TYPE,
  NEWS_PAGE_SECTIONS,
} from 'const/index';
import { strings } from 'const/strings';
import {
  LTT_CHEVRON_LEFT,
  LTT_CHEVRON_RIGHT,
  PLAY_ICON_FILLED,
  RIGHT_TAIL_HEAD_ARROW,
} from 'assets/SvgIcons';

const Swiper = dynamic(() =>
  import(/* webpackChunkName: "MediaPlayerSwiper" */ 'components/Swiper')
);

const MediaPlayer: React.FC<TMediaPlayerProps> = ({
  trailerData,
  showPageDocuments,
  videoData,
}) => {
  const [swiper, setSwiper] = useState<TSwiper | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [trailerClickedIndex, setTrailerClickedIndex] = useState(0);
  const [modalIsOpen, setModalOpen] = useState(false);
  const { host, isDev, lang } = useContext(MBContext);
  const updateIndex = useCallback(() => {
    if (swiper !== null) {
      const slideIndex = swiper?.realIndex;
      setActiveSlideIndex(slideIndex);
    }
  }, [swiper]);

  const { NEWS_PAGE, BUY_TICKETS_CTA } = strings;
  const { TRAILERS } = NEWS_PAGE;

  useEffect(() => {
    if (!swiper || swiper?.destroyed) return;

    swiper.on('slideChange', updateIndex);

    return () => {
      if (swiper && !swiper.destroyed) {
        swiper.off('slideChange', updateIndex);
      }
    };
  }, [swiper, updateIndex, activeSlideIndex]);

  const swiperOptions: SwiperProps = {
    spaceBetween: 24,
    loop: true,
    breakpoints: {
      820: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 2.5,
      },
      1400: {
        slidesPerView: 3,
      },
    },
    allowTouchMove: false,
    onSwiper: (swiper) => setSwiper(swiper),
  };

  const onPrev = () => {
    if (swiper !== null) {
      swiper.slidePrev();
      trackEvent({
        eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
        Direction: 'Previous',
        Category: NEWS_PAGE_SECTIONS.TRAILERS,
      });
    }
  };

  const onNext = () => {
    if (swiper !== null) {
      swiper.slideNext();
      trackEvent({
        eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
        [ANALYTICS_PROPERTIES.DIRECTION]: 'Next',
        [ANALYTICS_PROPERTIES.CATEGORY]: NEWS_PAGE_SECTIONS.TRAILERS,
      });
    }
  };

  const openModal = (index: number) => {
    setModalOpen(true);
    setTrailerClickedIndex(index);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handlePlayIconClick = (
    index: number,
    tgid: number,
    expName: string,
    catId: number,
    catName: string
  ) => {
    openModal(index);
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.TRAILER_VIEWED,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: expName,
      [ANALYTICS_PROPERTIES.CATEGORY_ID]: catId,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: catName,
    });
  };

  const handleBuyTicketsCTAClicked = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.BUY_TICKETS,
      [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.TRAILERS,
    });
  };

  // const handleSeeAllCTAClick = () => {
  //   trackEvent({
  //     eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_CTA_CLICKED,
  //     [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.SEE_ALL,
  //     [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.TRAILERS,
  //   });
  // };

  const experienceVideoUrl =
    videoData[String(trailerData[trailerClickedIndex].id)];

  return (
    <>
      <Conditional if={modalIsOpen}>
        <Modal
          style={modalStyles}
          onRequestClose={closeModal}
          isOpen={modalIsOpen}
        >
          <VideoPlayer
            videoUrl={experienceVideoUrl!}
            videoTitle={trailerData[trailerClickedIndex].name}
            closePlayer={closeModal}
          />
        </Modal>
      </Conditional>
      <Container>
        <TitleBar>
          <h2>{TRAILERS}</h2>
          <Navigation>
            {/* <a href="/" target="_blank" onClick={handleSeeAllCTAClick}>
              <u>{SEE_ALL}</u>
            </a> */}
            <NavigationButtons>
              <LTT_CHEVRON_LEFT onClick={onPrev} />
              <LTT_CHEVRON_RIGHT onClick={onNext} />
            </NavigationButtons>
          </Navigation>
        </TitleBar>
        <Slider>
          <Swiper {...swiperOptions}>
            {trailerData?.map((trailer, index: number) => {
              const {
                primarySubCategory,
                averageRating,
                reviewCount,
                name,
                id,
                primaryCategory,
              } = trailer || {};

              const imageUrl = trailer?.media?.productImages[0]?.url;
              const showPageUid = showPageDocuments?.reduce((acc, curr) => {
                return (acc += trailer.id === curr?.data?.tgid ? curr.uid : '');
              }, '');
              const showPageUrl = convertUidToUrl({
                uid: showPageUid,
                lang,
                isDev,
                hostname: host,
              });

              return (
                <TrailerCard key={trailer?.name}>
                  <CardContainer>
                    <ImageContainer>
                      <Image
                        url={imageUrl}
                        height={215}
                        width={330}
                        className="show-image"
                        alt="Show Image"
                      />
                      <PLAY_ICON_FILLED
                        onClick={() =>
                          handlePlayIconClick(
                            index,
                            id,
                            name,
                            primaryCategory?.id,
                            primaryCategory?.name
                          )
                        }
                      />
                    </ImageContainer>
                    <CardInfoHeader>
                      <span className="subcategory-name">
                        {primarySubCategory?.name.toUpperCase()}
                      </span>
                      <span className="separator">|</span>
                      <div className="ratings-and-reviews">
                        <span className="ratings">
                          {averageRating}
                          <StarIcon />
                        </span>
                        <span className="reviews-count">({reviewCount})</span>
                      </div>
                    </CardInfoHeader>
                    <TrailerName>{name}</TrailerName>
                    <a
                      href={showPageUrl}
                      onClick={() => handleBuyTicketsCTAClicked()}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button widthProp="100%">
                        {BUY_TICKETS_CTA}
                        {RIGHT_TAIL_HEAD_ARROW}
                      </Button>
                    </a>
                    <BackgroundCircle
                      position={{
                        left: 130,
                        bottom: 161,
                      }}
                    />
                    <BackgroundCircle
                      position={{
                        left: 12,
                        bottom: 31,
                      }}
                    />
                    <BackgroundCircle
                      position={{
                        right: 36,
                        bottom: 5,
                      }}
                    />
                  </CardContainer>
                </TrailerCard>
              );
            })}
          </Swiper>
        </Slider>
        <div className="paginator">
          <Paginator
            tabSize={0.9375}
            dotSize={0.25}
            totalCount={trailerData?.length}
            activeIndex={activeSlideIndex}
            activeSlideTimer={0}
          />
        </div>
      </Container>
    </>
  );
};

export default MediaPlayer;
