import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Image from 'UI/Image';
import {
  BLACK_COLOR_CLOSE,
  CHEVRON_LEFT_CIRCLE,
  CHEVRON_RIGHT_CIRCLE,
  INSTAGRAM,
  PLAY_BUTTON,
  VIDEO_ICON,
} from 'assets/SvgIcons';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  HEADOUT_PURPS_LOGO,
} from 'const/index';
import Button from 'UI/Button';
import { FONTS } from 'const/fonts';
import { trackEvent } from 'utils/analytics';
import COLORS from 'const/colors';
import Conditional from 'components/common/Conditional';
import { parseCaption } from 'utils/stringUtils';
import { modulus } from 'utils/integerUtils';
import { expandFontToken } from 'const/typography';
import { strings } from 'const/strings';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const StyledWrapper = styled.div`
  max-width: 1200px;
  margin: auto;
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 1.25rem;
  padding: 4rem 0;

  @media (max-width: 768px) {
    grid-row-gap: 1.5rem;
    padding: 2rem 0;
  }
`;

const StyledHeading = styled.div`
  ${expandFontToken(FONTS.HEADING_LARGE)}

  .sub-heading {
    ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}
    margin-top: 0.375rem;
  }

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.HEADING_REGULAR)}
    width: 90vw;
  }
`;
const SliderContainer = styled.div`
  position: relative;
  height: calc(100% - 0.75rem);
`;

const StyledSlider = styled.div`
  .swiper-initialized {
    width: 90vw;
    padding-top: 0.75rem;
    max-width: 1200px;

    @media (max-width: 768px) {
      width: 100%;
      ${({
        // @ts-expect-error TS(2339): Property 'cardCount' does not exist on type 'Pick<... Remove this comment to see the full error message
        cardCount,
      }) =>
        `max-width: calc(((${cardCount} * 11.35rem) / ${
          cardCount / 2
        }) + 1rem)`};
    }
  }
`;

const StyledSlide = styled.div`
  cursor: pointer;

  .image-wrapper {
    min-height: 15rem;
  }

  img {
    width: 11.25rem;
    height: 15rem;
    border-radius: 0.25rem;
    object-fit: cover;
  }
  &:after {
    box-shadow: inset 0 3.25rem 2rem -0.75rem rgba(34, 34, 34, 0.6),
      inset 0 -3.25rem 2em -0.75rem rgba(34, 34, 34, 0.6);
    content: '';
    height: 15rem;
    width: 100%;
    border-radius: 0.25rem;
    position: absolute;
    top: 0;
  }
  .img-icon {
    position: absolute;
    top: 0.875rem;
    left: 0.875rem;
    color: ${COLORS.BRAND.WHITE};
    ${expandFontToken(FONTS.SUBHEADING_SMALL)}
    z-index: 1;
    svg {
      height: 1.25rem;
      width: 1.25rem;
    }
  }
  .img-icon.right {
    left: unset;
    right: 1rem;
  }
  .img-icon.bottom {
    top: unset;
    bottom: 1rem;
  }

  @media (max-width: 768px) {
    width: 9.875rem !important;

    .image-wrapper {
      min-height: 13rem;
    }

    img,
    &:after {
      height: 13rem;
    }
    .img-icon {
      top: 0.75rem;
      left: 0.75rem;
      svg {
        height: 1.25rem;
        width: 1.25rem;
      }
    }
    .img-icon.right {
      right: 0.75rem;
    }
  }
`;

const PopupWrapper = styled.div`
  display: grid;
  z-index: 20;
  width: 100%;
  height: 100%;
  position: fixed;
  place-content: center;
  background: rgb(17, 17, 17, 0.6);
  top: 0;
  left: 0;
`;

const PopupContentWrapper = styled.div`
  width: 80%;
  margin: auto;
  @media (max-width: 768px) {
    width: 100%;
    height: 1000px;
    position: absolute;
  }
`;

const PopupCard = styled.div`
  border-radius: 0.5rem;
  display: grid;
  grid-template-columns: 6fr repeat(2, 0) 4fr 0;
  grid-template-rows: min-content 4fr repeat(3, 0);
  max-width: 65vw;
  max-height: 46.25rem;
  height: 80vh;
  overflow: hidden;
  background: ${COLORS.BRAND.WHITE};

  img {
    cursor: pointer;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    border-radius: 1.25em 1.25rem 0 0;
    position: fixed;
    max-width: 100vw;
    max-height: 95%;
    bottom: 0;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    overflow: scroll;
    .image-wrap {
      grid-area: 2 / 1 / 3 / 2;
      height: 70vh;
    }
  }
`;

const PlayButton = styled.div`
  margin: 0 auto;
  position: absolute;
  z-index: 1;

  a {
    display: block;
  }

  @media (max-width: 768px) {
    top: 50%;
    left: 50%;
    transform: translate(-50%, 0);
  }
`;

const MediaWrapper = styled.div`
  display: grid;
  grid-area: 2 / 1 / 6 / 3;
  place-items: center;
  @media (max-width: 768px) {
    position: relative;
    grid-area: unset;
  }
`;

const WrapperHeader = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  height: 2.25em;
  grid-area: 1 / 1 / 2 / 5;
  padding: 1rem 1.5rem;

  .divider {
    display: inline-block;
    width: 0.0625em;
    background-color: ${COLORS.GRAY.G6};
    margin: 0 1.5em;
    height: 2.5em;
  }
  .user-logo {
    border-radius: 50%;
    height: 2.25rem;
    width: 2.25rem;
    display: inline-block;
    margin-right: 0.75rem;
  }
  .username {
    top: 0.5rem;
    position: relative;
  }
  a,
  button {
    vertical-align: top;
    color: ${COLORS.GRAY.G2} !important;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    position: sticky;
    top: 0;
    background: ${COLORS.BRAND.WHITE};
    z-index: 2;
    border-radius: 1.25rem 1.25rem 0 0;
    border-bottom: 1px solid ${COLORS.GRAY.G6};
    .divider,
    button {
      display: none;
    }
  }
`;

const Description = styled.div`
  grid-area: 2 / 3 / 6 / 5;
  padding: 0.75rem 1rem;
  white-space: pre-line;
  border-top: 1px solid ${COLORS.GRAY.G6};
  font-weight: 200;
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }

  a {
    display: inline-block;
    color: ${COLORS.BRAND.PURPS};
  }
  .username {
    font-weight: 500;
    margin-right: 0.5em;
  }
  .caption {
    display: inline;
    word-break: break-word;
  }

  @media (max-width: 768px) {
    grid-area: 3 / 1 / 4 / 2;
    height: calc(100% - 3vh);
    overflow-y: unset;
  }
`;

const CloseIconWrapper = styled.div`
  cursor: pointer;
  align-self: center;
`;

const SwiperControls = styled.div`
  display: flex;
  align-items: center;

  .prev-slide,
  .next-slide {
    position: absolute;
    pointer-events: none;
    cursor: pointer;
    z-index: 2;
    height: 2rem;
    svg {
      circle {
        pointer-events: auto;
      }
      rect {
        display: none;
      }
    }
  }
  .prev-slide {
    left: 2%;
    top: 50%;
    svg {
      transform: scaleX(-1);
    }
  }
  .next-slide {
    right: 2%;
    top: 50%;
  }

  @media (min-width: 1200px) {
    .prev-slide {
      left: 15%;
    }
    .next-slide {
      right: 15%;
    }
  }
`;

const Controls = styled.div`
  height: 0;

  .prev-slide,
  .next-slide {
    display: inline;
    position: absolute;
    top: 50%;
    z-index: 2;
    left: -2%;
    cursor: pointer;
  }
  .next-slide {
    left: 98.5%;
    svg {
      transform: scaleX(-1);
      margin-bottom: 0.219rem;
    }
  }
`;

const BottomCTA = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  background: ${COLORS.BRAND.WHITE};
  padding: 1rem 1.5rem;
  grid-area: 4 / 1 / 5 / 2;
  -webkit-box-shadow: 0 -0.75rem 1rem -0.25rem rgba(84, 84, 84, 0.1);
  box-shadow: 0 -0.75rem 1rem -0 25rem rgba(84, 84, 84, 0.1);

  button {
    ${expandFontToken(FONTS.BUTTON_BIG)}
    padding: 0.6rem 1.2rem;
    width: 100%;
  }
`;

type UGCCarouselProps = {
  isMobile: boolean;
  cards: any[];
  heading: string;
  subHeading: string;
};

const UGCCarousel: React.FC<UGCCarouselProps> = (props) => {
  const { cards, heading, isMobile, subHeading } = props;
  const [swiper, updateSwiper] = useState(null);
  const [isOpened, setIsOpened] = useState(false);
  const [openedIndex, setOpenedIndex] = useState(null);
  const [_currentIndex, updateCurrentIndex] = useState(0);
  const myRef = useRef();

  const updateIndex = useCallback(() => {
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    updateCurrentIndex(swiper.realIndex);
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    if (swiper.swipeDirection === 'next') mWebSwipeTrack(swiper.activeIndex);
  }, [swiper]);

  const mWebSwipeTrack = (activeIndex: number) => {
    if ((swiper as any)?.isEnd) {
      for (let i = cards?.length - 1; i <= cards?.length; i++) {
        trackEvent({
          eventName: ANALYTICS_EVENTS.UGC.CARD_VISIBLE,
          [ANALYTICS_PROPERTIES.RANKING]: i,
        });
      }
    } else {
      for (let i = activeIndex; i < activeIndex + 2; i++) {
        trackEvent({
          eventName: ANALYTICS_EVENTS.UGC.CARD_VISIBLE,
          [ANALYTICS_PROPERTIES.RANKING]: i + 1,
        });
      }
    }
  };

  useEffect(() => {
    if (isMobile && isOpened) {
      window.onpopstate = () => {
        popupCloser(openedIndex, true);
      };
    }
  }, [openedIndex, isOpened, isMobile]);

  useEffect(() => {
    if (swiper !== null) {
      (swiper as any).on('slideChange', updateIndex);
    }
    return () => {
      if (swiper !== null) {
        (swiper as any).off('slideChange', updateIndex);
      }
    };
  }, [isMobile, swiper, updateIndex]);

  useEffect(() => {
    if (!myRef.current) return;
    const observerCallback = (entries: any, observer: any) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        trackEvent({
          eventName: ANALYTICS_EVENTS.UGC.VIEWED,
        });
        const visibleSlides = isMobile ? 2 : Math.min(cards?.length, 6);
        for (let i = 0; i < (swiper as any)?.activeIndex + visibleSlides; i++) {
          trackEvent({
            eventName: ANALYTICS_EVENTS.UGC.CARD_VISIBLE,
            [ANALYTICS_PROPERTIES.RANKING]: i + 1,
          });
        }
      }
    };
    const observer = new IntersectionObserver(observerCallback);
    observer.observe(myRef.current);
    return () => {
      observer.disconnect();
    };
  }, [swiper]);

  const changePopup = (e: any, direction: any) => {
    e.stopPropagation();
    const changeIndex = direction === 'next' ? 1 : -1;
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    const cardIndex = modulus(openedIndex + changeIndex, cards?.length);
    // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
    setOpenedIndex(cardIndex);
    trackEvent({
      eventName: ANALYTICS_EVENTS.UGC.POPUP_VIEWED,
      [ANALYTICS_PROPERTIES.RANKING]: cardIndex + 1,
      [ANALYTICS_PROPERTIES.UGC.CONTENT_TYPE]:
        cards[cardIndex]?.instagram_posts?.postType,
    });
  };

  const slideNext = () => {
    if (swiper !== null) {
      (swiper as any).slideNext();
    }
    for (
      let i = (swiper as any)?.activeIndex;
      i < (swiper as any)?.activeIndex + 6;
      i++
    )
      trackEvent({
        eventName: ANALYTICS_EVENTS.UGC.CARD_VISIBLE,
        [ANALYTICS_PROPERTIES.RANKING]: i + 1,
      });
  };

  const slidePrev = () => {
    if (swiper !== null) {
      (swiper as any).slidePrev();
    }
  };

  const popupOpener = (index: any) => {
    if (isMobile) {
      window.history.pushState(null, '');
    }
    setOpenedIndex(index);
    setIsOpened(true);
    document.body.style.overflow = 'hidden';
  };

  const popupCloser = (index: any, viaBrowser = false) => {
    setOpenedIndex(null);
    setIsOpened(false);
    document.body.style.overflow = 'auto';
    if ((viaBrowser && isMobile) || !isMobile) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.UGC.POPUP_CLOSED,
        [ANALYTICS_PROPERTIES.RANKING]: index + 1,
        [ANALYTICS_PROPERTIES.UGC.CONTENT_TYPE]:
          cards[index]?.instagram_posts?.postType,
      });
    }
    if (!viaBrowser && isMobile) {
      window.history.back();
    }
  };

  const trackEmbedClick = (index: number) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.UGC.CARD_CLICKED,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.UGC.CONTENT_TYPE]:
        cards[index]?.instagram_posts?.postType,
    });
    trackEvent({
      eventName: ANALYTICS_EVENTS.UGC.POPUP_VIEWED,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.UGC.CONTENT_TYPE]:
        cards[index]?.instagram_posts?.postType,
    });
  };
  const trackRedirectToIG = (index: number, postType: any) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.UGC.REDIRECT_TO_IG,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.UGC.CONTENT_TYPE]: postType,
    });
  };
  const trackUsernameClick = (index: number, postType: any, username: any) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.UGC.USERNAME_CLICKED,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.UGC.CONTENT_TYPE]: postType,
      [ANALYTICS_PROPERTIES.UGC.USERNAME]: username,
    });
  };

  const getPopupModal = (cards: any, index: any) => {
    const card = cards[index]?.instagram_posts;
    const { username, imageURL, caption, url, postType } = card || {};
    const instagramAccountURL = `https://www.instagram.com/${username}`;
    return (
      <PopupWrapper onClick={() => popupCloser(index)}>
        <PopupContentWrapper>
          {/* @ts-expect-error TS(2769): No overload matches this call. */}
          <PopupCard onClick={(e) => e.stopPropagation()} isMobile={isMobile}>
            <WrapperHeader>
              <div>
                <Conditional
                  if={username === 'headout' || username === 'headoutuae'}
                >
                  <div className="user-logo">
                    <Image url={HEADOUT_PURPS_LOGO} alt={'user-logo'} />
                  </div>
                </Conditional>
                <a
                  className="username"
                  href={instagramAccountURL}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => trackUsernameClick(index, postType, username)}
                >
                  {username}
                </a>
              </div>
              <CloseIconWrapper onClick={() => popupCloser(index)}>
                {BLACK_COLOR_CLOSE}
              </CloseIconWrapper>
            </WrapperHeader>
            <MediaWrapper>
              <Conditional if={postType === 'Video'}>
                <PlayButton>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={() => {
                      trackRedirectToIG(index, postType);
                    }}
                  >
                    {PLAY_BUTTON}
                  </a>
                </PlayButton>
              </Conditional>
              <Image
                url={imageURL}
                alt={caption}
                format="jpg"
                quality={100}
                onClick={() => {
                  window.open(url), trackRedirectToIG(index, postType);
                }}
              />
            </MediaWrapper>
            <Description>
              <span className="username">{username}</span>
              <div
                className="caption"
                dangerouslySetInnerHTML={{
                  __html: parseCaption(caption),
                }}
              />
            </Description>
            <Conditional if={isMobile}>
              <BottomCTA>
                <Button
                  fillType="blackBordered"
                  onClick={() => popupCloser(index)}
                >
                  {strings.CLOSE}
                </Button>
              </BottomCTA>
            </Conditional>
          </PopupCard>
        </PopupContentWrapper>
        <Conditional if={!isMobile}>
          <SwiperControls>
            <div
              className="prev-slide"
              role="button"
              tabIndex={0}
              onClick={(e) => changePopup(e, 'prev')}
            >
              {CHEVRON_RIGHT_CIRCLE}
            </div>
            <div
              className="next-slide"
              role="button"
              tabIndex={0}
              onClick={(e) => changePopup(e, 'next')}
            >
              {CHEVRON_RIGHT_CIRCLE}
            </div>
          </SwiperControls>
        </Conditional>
      </PopupWrapper>
    );
  };

  const swiperParams = {
    slidesPerView: isMobile ? 2.2 : 6,
    slidesPerGroup: isMobile ? 2 : 5,
    spaceBetween: isMobile ? 16 : 24,
    freeMode: isMobile,
  };

  return (
    <>
      {/* @ts-expect-error TS(2769): No overload matches this call. */}
      <StyledWrapper ref={myRef}>
        <StyledHeading>
          {heading || strings.UGC.HEADING}
          <div className="sub-heading">
            {subHeading || strings.UGC.SUB_HEADING}
          </div>
        </StyledHeading>
        <SliderContainer>
          {/* @ts-expect-error TS(2769): No overload matches this call. */}
          <StyledSlider cardCount={cards?.length}>
            {/* @ts-expect-error TS(2322): Type 'Dispatch<SetStateAction<null>>' is not assig... Remove this comment to see the full error message */}
            <Swiper {...swiperParams} onSwiper={updateSwiper}>
              {cards?.map((card, index) => (
                <StyledSlide
                  key={index}
                  onClick={() => {
                    // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                    setOpenedIndex(index);
                    popupOpener(index);
                    trackEmbedClick(index);
                  }}
                  className={'swiper-slide'}
                >
                  <Image
                    fill
                    url={card?.instagram_posts?.imageURL}
                    alt={card?.instagram_posts?.caption}
                    format="jpg"
                    className={'image-wrapper'}
                  />
                  <div className="img-icon">{INSTAGRAM}</div>
                  <Conditional if={card?.instagram_posts?.postType === 'Video'}>
                    <div className="img-icon right">{VIDEO_ICON}</div>
                  </Conditional>
                  <div className="img-icon bottom">
                    @{card?.instagram_posts?.username}
                  </div>
                </StyledSlide>
              ))}
            </Swiper>
          </StyledSlider>
          <Conditional if={!isMobile}>
            <Controls>
              <Conditional if={!(swiper as any)?.isBeginning}>
                <div
                  className="prev-slide"
                  role="button"
                  tabIndex={0}
                  onClick={slidePrev}
                >
                  {CHEVRON_LEFT_CIRCLE}
                </div>
              </Conditional>
              <Conditional if={!(swiper as any)?.isEnd}>
                <div
                  className="next-slide"
                  role="button"
                  tabIndex={0}
                  onClick={slideNext}
                >
                  {CHEVRON_LEFT_CIRCLE}
                </div>
              </Conditional>
            </Controls>
          </Conditional>
        </SliderContainer>
      </StyledWrapper>
      <Conditional if={isOpened}>
        {getPopupModal(cards, openedIndex)}
      </Conditional>
    </>
  );
};

export default UGCCarousel;
