import React, { useCallback, useContext, useEffect, useState } from 'react';
import { scroller } from 'react-scroll';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { PrismicRichText } from '@prismicio/react';
import type { SwiperProps } from 'swiper/react';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import { generateSidenavId, stringIdfy } from 'utils/helper';
import { shortCodeSerializer } from 'utils/shortCodes';
import COLORS from 'const/colors';
import { DESIGN } from 'const/index';
import { HALYARD } from 'const/ui-constants';
import ChevronLeft from 'assets/chevronLeft';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const StyledWrapper = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 22px;
  @media (max-width: 768px) {
    grid-row-gap: 24px;
  }
`;

const StyledMobileSlider = styled.div`
  display: flex;
  overflow-x: auto;
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  margin: 0 -16px;
  padding: 0 16px;
  last-child {
    margin-right: 16px;
  }
`;

const StyledContent = styled.div`
  display: grid;
  grid-row-gap: 8px;
  h2 {
    margin: 0;
    font-family: ${HALYARD.FONT_STACK};
    font-size: 24px !important;
    line-height: 33px;
    color: ${({ design }: { design: string | null }) =>
      design === DESIGN.V1 ? COLORS.GRAY.G2 : COLORS.GRAY.G1};
    font-weight: 600;
  }
  div {
    margin: 0;
    font-family: ${HALYARD.FONT_STACK};
    font-size: 16px;
    line-height: 20px;
    color: ${COLORS.GRAY.G2};
    p {
      margin: 0;
    }
  }
  @media (max-width: 768px) {
    h2 {
      line-height: 26px;
      font-family: ${HALYARD.FONT_STACK};
    }
    div {
      line-height: 20px;
      font-family: ${HALYARD.FONT_STACK};
      font-weight: 400;
    }
  }
`;

const StyledSlider = styled.div`
  display: flex;
  position: relative;
  .slider-container {
    overflow: hidden;
    display: flex;
    width: 100%;
    max-width: 1200px;
    margin: auto;
  }
  .swiper-initialized {
    width: 100%;
  }
  .swiper-container {
    padding-top: 10px;
  }
  .controls {
    display: flex;
  }
  .controls .btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -32px;
    display: flex;
    cursor: pointer;
  }
  .controls .btn svg {
    stroke-width: 1.5px;
  }
  .controls .btn-right {
    left: unset;
    right: -32px;
  }
  .controls .btn-right svg {
    transform: rotate(180deg);
  }
`;

const StyledSlide = styled.div`
  margin-right: 20px;
  transform: translate3d(0, 0, 0);
  transition: ease 0.2s;
  flex: 0 0 300px;
  &:hover {
    transform: translate3d(0, -5px, 0);
  }
  a {
    text-decoration: none;
    display: block;
  }
  img {
    height: 175px;
    width: 100%;
    border-radius: 4px;
    object-fit: cover;
  }
  div {
    font-family: ${HALYARD.FONT_STACK};
    font-size: 16px;
    font-weight: 600;
    color: ${COLORS.GRAY.G1};
    margin-top: 4px;
  }
`;

const desktopInteraction = (
  event: any,
  {
    card_title,
    isMobile,
    clickInteraction,
  }: {
    card_title: string;
    isMobile: boolean | null;
    clickInteraction: string;
  }
) => {
  if (!isMobile && clickInteraction === 'Scroll to Heading') {
    event.preventDefault();
    scroller.scrollTo(stringIdfy(card_title), {
      duration: 1200,
      offset: isMobile ? -80 : -100,
      smooth: 'easeInOutQuart',
    });
  }
};

type SlideProps = {
  className: string;
  link: {
    url: string;
    target: string;
  };
  image: {
    url: string;
    alt: string;
    title: string;
  };
  card_title: string;
};

const Slide = (props: any) => {
  const { className, link, image, card_title }: SlideProps = props;
  return (
    <StyledSlide className={className}>
      <a
        href={link.url}
        target={link.target}
        onClick={(e) => desktopInteraction(e, props)}
      >
        <Image
          url={image.url}
          alt={image.alt || image.title}
          width={280}
          height={250}
          aspectRatio="5:4"
        />
        <div>{card_title}</div>
      </a>
    </StyledSlide>
  );
};

type Image = {
  card_title: string | null;
  image: object;
  link: object;
};

type ImageLinksCarouselProps = {
  isMobile: boolean;
  images: Image[];
  heading: string;
  description: any[];
  clickInteraction: string;
};

/**
 *
 * A gallery like image carousel with mini titles for each image and a link wrapped over
 *
 * **All fields marked with a * are mandatory and will break the slice if left blank.**
 *
 * ### Non-repeatable zone
 * - *Carousel Heading
 * - Carousel Description
 *  - Rich Text field
 * - Click Interaction (Dropdown Selection)
 *    - Option 1 (default): Open the link specified, as usual.
 *    - Option 2: Scroll to Heading, if there is a tour section or jump link with same heading on the current page, clicking on the card will scroll to that section
 *
 * ### Repeatable zone
 * - Uploaded Image
 *  - Add your image from prismic
 *  - Additionally add an 'alt' field
 * - Link to Image
 *  - Add a link to the image directly
 *  - Will take precedence over 'Image Source'
 * - Image Alt
 *  - 'alt' field for Image URL
 *  - Will take precedence over 'Image Source' alt
 * - Card Link
 * - Card Title
 *
 * **Note: Either 'Uploaded Image' or 'Link to Image' is required and if left blank will break the slice**
 */

const ImageLinksCarousel: React.FC<ImageLinksCarouselProps> = (props) => {
  const [swiper, updateSwiper] = useState(null);
  const [_currentIndex, updateCurrentIndex] = useState(0);
  const {
    images,
    heading,
    description,
    isMobile,
    clickInteraction = 'Open Link',
  } = props;
  const { design } = useContext(MBContext);

  const goNext = () => {
    if (!swiper || (swiper as any)?.destroyed) return;
    (swiper as any).slideNext();
  };

  const goPrev = () => {
    if (!swiper || (swiper as any)?.destroyed) return;
    (swiper as any).slidePrev();
  };

  const updateIndex = useCallback(
    () => updateCurrentIndex((swiper as any).realIndex),
    [swiper]
  );

  useEffect(() => {
    if (isMobile || !swiper || (swiper as any)?.destroyed) return;
    (swiper as any).on('slideChange', updateIndex);
    return () => {
      if (swiper && !(swiper as any).destroyed) {
        (swiper as any).off('slideChange', updateIndex);
      }
    };
  }, [swiper, updateIndex, isMobile]);

  const swiperParams: SwiperProps = {
    slidesPerGroup: 4,
    direction: 'horizontal',
    speed: 650,
    slidesPerView: 4,
    spaceBetween: 24,
  };

  return (
    <StyledWrapper>
      <StyledContent design={design}>
        <h2 id={generateSidenavId(heading)}>{heading}</h2>
        <div>
          <PrismicRichText
            field={description}
            components={shortCodeSerializer}
          />
        </div>
      </StyledContent>
      {isMobile ? (
        <StyledMobileSlider>
          {images.map((image, index) => (
            <Slide key={index} {...image} isMobile={isMobile} />
          ))}
        </StyledMobileSlider>
      ) : (
        <StyledSlider>
          <div className="slider-container">
            {/* @ts-expect-error TS(2322): Type 'Dispatch<SetStateAction<null>>' is not assig... Remove this comment to see the full error message */}
            <Swiper {...swiperParams} onSwiper={updateSwiper}>
              {images.map((image, index) => (
                <Slide
                  className="swiper-slide"
                  key={index}
                  {...image}
                  isMobile={isMobile}
                  clickInteraction={clickInteraction}
                />
              ))}
            </Swiper>
          </div>
          <div className="controls">
            {swiper && !(swiper as any).isBeginning ? (
              <div
                className="swiper-btn btn btn-left"
                role="button"
                tabIndex={0}
                onClick={goPrev}
              >
                {ChevronLeft}
              </div>
            ) : null}
            {swiper && !(swiper as any).isEnd ? (
              <div
                className="swiper-btn btn btn-right"
                role="button"
                tabIndex={0}
                onClick={goNext}
              >
                {ChevronLeft}
              </div>
            ) : null}
          </div>
        </StyledSlider>
      )}
    </StyledWrapper>
  );
};

export default ImageLinksCarousel;
