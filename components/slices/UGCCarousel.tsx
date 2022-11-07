import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Image from 'UI/Image';
import {
  BLACK_COLOR_CLOSE,
  CHEVRON_LEFT_CIRCLE,
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

const StyledSlider = styled.div`
  .swiper-container {
    padding-top: 0.75em;
    max-width: 1200px;

    @media (max-width: 768px) {
      ${({ cardCount }) =>
        `max-width: calc(((${cardCount} * 10.875rem) / ${
          cardCount / 2
        }) + 1rem)`};
    }
  }
`;

const StyledSlide = styled.div`
  cursor: pointer;

  img {
    aspect-ratio: 3/4;
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
  z-index: 10;
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
  max-width: 65.5rem;
  max-height: 46.5rem;
  overflow: hidden;
  background: ${COLORS.BRAND.WHITE};

  img {
    cursor: pointer;
    object-fit: cover;
  }
  .image-wrap {
    grid-area: 2 / 1 / 6 / 3;
  }

  @media (max-width: 768px) {
    border-radius: 1.25em 1.25rem 0 0;
    position: fixed;
    max-height: 95%;
    bottom: 0;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    overflow: scroll;
    .image-wrap {
      grid-area: 2 / 1 / 3 / 2;
      max-height: 70vh;
    }
  }
`;

const PlayButton = styled.a`
  cursor: pointer;
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-12rem, -15%);

  @media (max-width: 768px) {
    transform: translate(-1.75rem, -50%);
  }
`;

const MediaWrapper = styled.div`
  display: contents;

  @media (max-width: 768px) {
    position: relative;
    display: unset;
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
  }
  .next-slide {
    right: 2%;
    top: 50%;
    svg {
      transform: scaleX(-1);
    }
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
  position: relative;

  .prev-slide,
  .next-slide {
    display: inline;
    position: absolute;
    top: -10.25rem;
    z-index: 2;
    left: -1.25rem;
    cursor: pointer;
  }
  .next-slide {
    left: 73.85rem;
    svg {
      transform: scaleX(-1);
      margin-bottom: 0.219rem;
    }
  }
`;

const BottomFollow = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  background: ${COLORS.BRAND.WHITE};
  padding: 1rem 1.5rem;
  grid-area: 4 / 1 / 5 / 2;
  -webkit-box-shadow: 0 -0.75rem 1rem -0.25rem rgba(84, 84, 84, 0.1);
  box-shadow: 0 -0.75rem 1rem -0 25rem rgba(84, 84, 84, 0.1);

  a {
    ${expandFontToken('Button/Big')}
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
    updateCurrentIndex(swiper.realIndex);
    if (swiper.swipeDirection === 'next') mWebSwipeTrack(swiper.activeIndex);
  }, [swiper]);

  const mWebSwipeTrack = (activeIndex) => {
    if (swiper?.isEnd) {
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
    if (swiper !== null) {
      swiper.on('slideChange', updateIndex);
    }
    return () => {
      if (swiper !== null) {
        swiper.off('slideChange', updateIndex);
      }
    };
  }, [isMobile, swiper, updateIndex]);

  useEffect(() => {
    if (!myRef.current) return;
    const observerCallback = (entries, observer) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        trackEvent({
          eventName: ANALYTICS_EVENTS.UGC.VIEWED,
        });

        const visibleSlides = isMobile ? 2 : 6;
        for (let i = 0; i < swiper?.activeIndex + visibleSlides; i++) {
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

  const changePopup = (direction) => {
    const changeIndex = direction === 'next' ? 1 : -1;
    const cardIndex = modulus(openedIndex + changeIndex, cards?.length);
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
      swiper.slideNext();
    }
    for (let i = swiper?.activeIndex; i < swiper?.activeIndex + 6; i++)
      trackEvent({
        eventName: ANALYTICS_EVENTS.UGC.CARD_VISIBLE,
        [ANALYTICS_PROPERTIES.RANKING]: i + 1,
      });
  };

  const slidePrev = () => {
    if (swiper !== null) {
      swiper.slidePrev();
    }
  };

  const popupOpener = (index) => {
    setOpenedIndex(index);
    setIsOpened(true);
    document.body.style.overflow = 'hidden';
  };

  const popupCloser = (index) => {
    setOpenedIndex(null);
    setIsOpened(false);
    document.body.style.overflow = 'auto';
    trackEvent({
      eventName: ANALYTICS_EVENTS.UGC.POPUP_CLOSED,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.UGC.CONTENT_TYPE]:
        cards[index]?.instagram_posts?.postType,
    });
  };

  const trackEmbedClick = (index) => {
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
  const trackRedirectToIG = (index, postType) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.UGC.REDIRECT_TO_IG,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.UGC.CONTENT_TYPE]: postType,
    });
  };
  const trackFollowClick = (index, postType) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.UGC.FOLLOW_CLICKED,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.UGC.CONTENT_TYPE]: postType,
    });
  };
  const trackUsernameClick = (index, postType, username) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.UGC.USERNAME_CLICKED,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.UGC.CONTENT_TYPE]: postType,
      [ANALYTICS_PROPERTIES.UGC.USERNAME]: username,
    });
  };

  const getPopupModal = (cards, index) => {
    const card = cards[index]?.instagram_posts;
    const { username, imageURL, caption, url, postType } = card || {};
    const instagramAccountURL = `https://www.instagram.com/${username}`;
    return (
      <PopupWrapper>
        <PopupContentWrapper>
          <PopupCard isMobile={isMobile}>
            <WrapperHeader>
              <div>
                <Conditional
                  if={username === 'headout' || username === 'headoutuae'}
                >
                  <div className="user-logo">
                    <Image url={HEADOUT_PURPS_LOGO} />
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
                <span className="divider" />
                <Button
                  fillType="blackBordered"
                  onClick={() => trackFollowClick(index, postType)}
                >
                  <a
                    href={instagramAccountURL}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {strings.UGC.FOLLOW}
                  </a>
                </Button>
              </div>
              <CloseIconWrapper onClick={() => popupCloser(index)}>
                {BLACK_COLOR_CLOSE}
              </CloseIconWrapper>
            </WrapperHeader>
            <MediaWrapper>
              <Conditional if={postType === 'Video'}>
                <PlayButton
                  href={url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {PLAY_BUTTON}
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
              <BottomFollow>
                <Button
                  as="a"
                  fillType="blackBordered"
                  href={instagramAccountURL}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => trackFollowClick(index, postType)}
                >
                  {strings.UGC.FOLLOW_IG}
                </Button>
              </BottomFollow>
            </Conditional>
          </PopupCard>
        </PopupContentWrapper>
        <Conditional if={!isMobile}>
          <SwiperControls>
            <div
              className="prev-slide"
              role="button"
              tabIndex={0}
              onClick={() => changePopup('prev')}
            >
              {CHEVRON_LEFT_CIRCLE}
            </div>
            <div
              className="next-slide"
              role="button"
              tabIndex={0}
              onClick={() => changePopup('next')}
            >
              {CHEVRON_LEFT_CIRCLE}
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
    freeMode: false,
  };

  return (
    <>
      <StyledWrapper ref={myRef}>
        <StyledHeading>
          {heading}
          <div className="sub-heading">{subHeading}</div>
        </StyledHeading>
        <StyledSlider cardCount={cards?.length}>
          <Swiper {...swiperParams} getSwiper={updateSwiper}>
            {cards?.map((card, index) => (
              <StyledSlide
                key={index}
                onClick={() => {
                  setOpenedIndex(index);
                  popupOpener(index);
                  trackEmbedClick(index);
                }}
                className={'swiper-slide'}
              >
                <Image
                  url={card?.instagram_posts?.imageURL}
                  alt={card?.instagram_posts?.caption}
                  format="jpg"
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
            <Conditional if={!swiper?.isBeginning}>
              <div
                className="prev-slide"
                role="button"
                tabIndex={0}
                onClick={slidePrev}
              >
                {CHEVRON_LEFT_CIRCLE}
              </div>
            </Conditional>
            <Conditional if={!swiper?.isEnd}>
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
      </StyledWrapper>
      <Conditional if={isOpened}>
        {getPopupModal(cards, openedIndex)}
      </Conditional>
    </>
  );
};

export default UGCCarousel;
