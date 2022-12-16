import React, { useState } from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import dynamic from 'next/dynamic';
import Image from 'UI/Image';
import { shortCodeSerializer } from 'utils/shortCodes';
import Accordion, { StyledAccordion } from 'components/slices/Accordion';

const Slider = dynamic(() => import('UI/Slider'));

const StyledSliderAccordion = styled.div`
  display: grid;
  grid-template-columns: ${({ isGlobalMb }) => (isGlobalMb ? '528px' : '1fr')} ${({
      hasImageComponent,
    }) => (hasImageComponent ? `1fr` : ``)};
  grid-gap: 24px;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  overflow: hidden;
  height: max-content;
  width: 100%;
  line-height: 1.4;
  ${({ isGlobalMb }) =>
    isGlobalMb &&
    `border: none;
    grid-gap: 84px;
    `}
  ${StyledAccordion} {
    padding: 16px;
    ${({ isGlobalMb }) => isGlobalMb && `padding: 16px 0; margin-right: 0;`}
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    ${({ isGlobalMb }) => isGlobalMb && `p grid-gap: 16px;`}
  }
`;

const SliderWrapper = styled.div`
  display: grid;
  overflow: hidden;
  max-height: ${({ isGlobalMb }) => (isGlobalMb ? '326px' : '368px')};
  width: auto;
  display: grid;
  .swiper-slide img {
    width: 100%;
    height: ${({ isGlobalMb }) => (isGlobalMb ? `326px` : 'auto')};
    display: flex;
    object-fit: cover;
    ${({ isGlobalMb }) => isGlobalMb && `border-radius: 4px;`}
  }
  @media (max-width: 768px) {
    max-height: ${({ isGlobalMb }) => (isGlobalMb ? '212px' : '195px')};
    .swiper-slide img {
      height: ${({ isGlobalMb }) => (isGlobalMb ? '212px' : '195px')};
    }
  }
`;

const AccordionsWrap = styled.div``;

const SingleImage = styled.div`
  width: auto;
  display: grid;
  img {
    width: 100%;
    height: ${({ isGlobalMb }) => (isGlobalMb ? `326px` : 'auto')};
    display: flex;
    object-fit: cover;
    ${({ isGlobalMb }) => isGlobalMb && `border-radius: 4px;`}
  }
  @media (max-width: 768px) {
    max-height: ${({ isGlobalMb }) => (isGlobalMb ? '212px' : '195px')};
    img {
      height: ${({ isGlobalMb }) => (isGlobalMb ? '212px' : '195px')};
    }
  }
`;

/**
 * ### (a.k.a *TabAcco*, when used inside a tab.)
 * Question slice allows you to have a [accordion slice](/docs/slices-accordion--basic) and associate it with an image side by side. <br>
 * Question Slice can be used inside any wrapper slice. It will fit the default width of its wrapper. (common usage is with tabs)
 *
 * examples:
 *```html
 *<tab_wrapper_start>
 *  <tab>
 *    <question />
 *    <question />
 *    <question />
 *<tab_wrapper_end>
 *```
 *```html
 *<background_start color="light_grey">
 *  <question />
 *  <question />
 *  <question />
 *<background_end>
 *```
 *
 *
 * ## Repeatable Zone:
 *
 *  **Upload Image**: use this option if you want to upload the image.
 *
 *  **Link to Image**: alternatively if you have the image uploaded already, you can use this field to add the link.
 *
 *  **Alt Text**: Alternate text for the image, if the image fails to load this text will be shown. (also adds seo benefits.)
 *
 *
 *
 * ## Non Repeatable Zone;
 *   **Question**: Simple text field, will be set as the Accordion Heading, on click the answer/content will toggle between visible/hidden.
 *
 *   **Answer**: RichText field, will be hidden by default till user toggles the item open by clicking on the heading.
 *
 */

const SliderAccordion = (props) => {
  const { faqs: accordions, sliceProps } = props;
  const { isMobile, isGlobalMb } = sliceProps;

  accordions.forEach((accordian) => {
    if (accordian.images.length == 0)
      accordian.images[0] = accordions[0].images[0];
  });

  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const activeAccordionImages = accordions[activeAccordionIndex].images.filter(
    (i) => i?.url
  );

  const sliderOptions = {
    direction: 'horizontal',
    speed: 650,
    pagination: {
      el: '.slider-pagination',
      type: 'bullets',
      clickable: true,
      bulletClass: 'slider-bullet',
    },
  };

  const SliderComponent = (
    <SliderWrapper isGlobalMb={isGlobalMb}>
      {activeAccordionImages.length > 1 ? (
        <Slider sliderOptions={sliderOptions} parentOverflowHidden>
          {activeAccordionImages.map((image, index) => {
            return (
              <Image
                key={index}
                height={isMobile ? 195 : 375}
                aspectRatio={'16:10'}
                url={image?.url}
                alt={image.alt}
              />
            );
          })}
        </Slider>
      ) : (
        <SingleImage isGlobalMb={isGlobalMb}>
          <Image
            height={isMobile ? 195 : 375}
            aspectRatio={'16:10'}
            imageId={activeAccordionImages[0]?.alt}
            url={activeAccordionImages[0]?.url}
            alt={activeAccordionImages[0]?.alt}
          />
        </SingleImage>
      )}
    </SliderWrapper>
  );

  return (
    <StyledSliderAccordion
      hasImageComponent={activeAccordionImages.length}
      isGlobalMb={isGlobalMb}
    >
      {!isMobile && activeAccordionIndex >= 0 ? SliderComponent : null}
      <AccordionsWrap>
        {accordions.map((accordion, index) => {
          const isOpen = index == activeAccordionIndex;
          const content = (
            <>
              {isMobile ? SliderComponent : null}
              <div className="answer-content">
                <RichText
                  render={accordion.answer}
                  htmlSerializer={shortCodeSerializer}
                />
              </div>
            </>
          );
          return (
            <Accordion
              content={content}
              isOpenOverride={isOpen}
              heading={accordion.question}
              clickHandler={() => setActiveAccordionIndex(index)}
              key={index}
              isGlobalMb={isGlobalMb}
            />
          );
        })}
      </AccordionsWrap>
    </StyledSliderAccordion>
  );
};

export default SliderAccordion;
