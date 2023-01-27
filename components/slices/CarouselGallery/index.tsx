import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { SwiperProps } from 'swiper/react';
import Image from 'UI/Image';
import RichContent from 'UI/RichContent';
import { stringIdfy } from 'utils/helper';
import { CHEVRON_RIGHT_CIRCLE } from 'assets/SvgIcons';
import Conditional from 'components/common/Conditional';
import { strings } from 'const/strings';

import {
  Heading,
  CarouselContainer,
  ImageGallery,
  Content,
  ContentWrapper,
} from '../CarouselGallery/styles';
import { CarouselGalleryProps } from '../CarouselGallery/interface';

const Swiper = dynamic(() =>
  import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

/**
 * Carousel Gallery allows you to add 'n' number of images into content framework, all images appear in a carousel format with each image having it's own content.
 *
 *
 * ### Non-repeatable zone
 * - Heading
 *  - Sets the Heading for the Carousel Gallery Section
 *
 * ### Repeatable zone
 * - Linked Image
 *  - Provide the CDN link to the image here.
 * - Image Alt
 *  - Provide the ALT text for the image here.
 * - Heading
 *  - You can provide some caption to the image.
 * - Content
 *  - RichText field for image description.
 * - CTA Link
 *  - Adds the CTA Link to redirect user to some other page for a corresponding image.
 */

const CarouselGallery: React.FC<CarouselGalleryProps> = ({
  images,
  heading,
}) => {
  const [swiper, setSwiperInstance] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateIndex = useCallback(() => {
    if (swiper !== null) {
      const slideIndex = swiper.realIndex;
      setCurrentIndex(slideIndex);
    }
  }, [swiper]);

  useEffect(() => {
    if (!swiper || swiper?.destroyed) return;

    swiper.on('slideChange', updateIndex);

    return () => {
      if (swiper && !swiper.destroyed) {
        swiper.off('slideChange', updateIndex);
      }
    };
  }, [swiper, updateIndex]);

  const onPrev = () => {
    if (swiper !== null) {
      swiper.slidePrev();
    }
  };

  const onNext = () => {
    if (swiper !== null) {
      swiper.slideNext();
    }
  };

  const swiperParams: SwiperProps = {
    pagination: {
      clickable: true,
    },
    spaceBetween: 0,
    speed: 300,
    grabCursor: true,
    preloadImages: false,
    onSlideChangeTransitionStart: updateIndex,
    onSwiper: (swiper) => setSwiperInstance(swiper),
  };

  const activeSlide = images[currentIndex];
  const { heading: activeSlideHeading, content, cta_link } = activeSlide;

  return (
    <>
      <Heading id={stringIdfy(heading)}>{heading}</Heading>
      <CarouselContainer>
        <ImageGallery>
          <Swiper {...swiperParams}>
            {images.map((image, index) => {
              return (
                <Image
                  url={image.linked_image?.url}
                  key={index}
                  alt={image?.image_alt}
                />
              );
            })}
          </Swiper>
          <div className="controls">
            <Conditional if={swiper && !swiper.isBeginning}>
              <div
                className="swiper-btn btn btn-left"
                role="button"
                tabIndex={0}
                onClick={onPrev}
              >
                {CHEVRON_RIGHT_CIRCLE}
              </div>
            </Conditional>
            <Conditional if={swiper && !swiper.isEnd}>
              <div
                className="swiper-btn btn btn-right"
                role="button"
                tabIndex={0}
                onClick={onNext}
              >
                {CHEVRON_RIGHT_CIRCLE}
              </div>
            </Conditional>
          </div>
        </ImageGallery>
        <Content>
          <ContentWrapper>
            <div className="active-slide">
              {currentIndex + 1}/{images.length}
            </div>
            <div className="heading">
              <RichContent render={activeSlideHeading} />
            </div>
            <div className="content">
              <RichContent render={content} />
            </div>
            <Conditional if={cta_link?.url}>
              <div
                className="cta"
                onClick={() => window.open(cta_link.url, '_blank')}
                role="button"
                tabIndex={0}
              >
                {strings.READ_MORE}
              </div>
            </Conditional>
          </ContentWrapper>
        </Content>
      </CarouselContainer>
    </>
  );
};

export default CarouselGallery;
