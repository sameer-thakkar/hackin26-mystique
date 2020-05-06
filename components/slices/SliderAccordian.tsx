import React, { useState } from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import Slider from '../UI/Slider';
import Image from '../UI/Image';
import { shortCodeSerializer } from '../../utils/shortCodes';
import Accordian from './Accordian';

const StyledSliderAccordian = styled.div`
  display: grid;
  grid-template-columns: 1fr ${({ hasImageComponent }) =>
      hasImageComponent ? ` 1fr` : ``};
  grid-gap: 24px;
  border: 1px solid #ebebeb;
  border-radius: 2px;
  height: max-content;
  width: 100%;
  line-height: 1.4;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SliderWrapper = styled.div`
  display: grid;
  overflow: hidden;
  max-height: 368px;
  width: auto;
  display: grid;
  .swiper-slide img {
    width: 100%;
    height: auto;
    display: flex;
    object-fit: cover;
  }
  @media (max-width: 768px) {
    max-height: 195px;
    .swiper-slide img {
      height: 195px;
    }
  }
`;

const AccordiansWrap = styled.div``;

const SingleImage = styled.div`
  width: auto;
  display: grid;
  img {
    width: 100%;
    height: auto;
    display: flex;
    object-fit: cover;
  }
  @media (max-width: 768px) {
    max-height: 195px;
    margin-bottom: 16px;
  }
`;
/**
 * ### (a.k.a *TabAcco*, when used inside a tab.)
 * Question slice allows you to have a [accordian slice](/docs/slices-accordian--basic) and associate it with an image side by side. <br>
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
 *  **Alt Text**: Alternate text for the image, if the image fails to load this text will be shown. (also adds seo benifits.)
 *
 *
 *
 * ## Non Repeatable Zone;
 *   **Question**: Simple text field, will be set as the Accordian Heading, on click the answer/content will toggle between visible/hidden.
 *
 *   **Answer**: RichText field, will be hidden by default till user toggles the item open by clicking on the heading.
 *
 */
const SliderAccordian = (props) => {
  const { faqs: accordians, sliceProps } = props;
  const { isMobile } = sliceProps;
  const [activeAccordianIndex, setActiveAccoridanIndex] = useState(0);
  const activeAccordianImages = accordians[activeAccordianIndex].images.filter(
    (i) => i.url
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
    <SliderWrapper>
      {activeAccordianImages.length > 1 ? (
        <Slider
          sliderOptions={sliderOptions}
          parentOverflowHidden={true}
          id={Math.random()}
        >
          {activeAccordianImages.map((image, index) => {
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
        <SingleImage>
          <Image
            height={500}
            aspectRatio={'16:10'}
            imageId={activeAccordianImages[0]?.alt}
            url={activeAccordianImages[0]?.url}
            alt={activeAccordianImages[0]?.alt}
          />
        </SingleImage>
      )}
    </SliderWrapper>
  );

  return (
    <StyledSliderAccordian hasImageComponent={activeAccordianImages.length}>
      {!isMobile && activeAccordianIndex >= 0 ? SliderComponent : null}
      <AccordiansWrap>
        {accordians.map((accordian, index) => {
          const isOpen = index == activeAccordianIndex;
          const content = (
            <>
              {isMobile ? SliderComponent : null}
              <div className="answer-content">
                <RichText
                  render={accordian.answer}
                  htmlSerializer={shortCodeSerializer}
                />
              </div>
            </>
          );
          return (
            <Accordian
              content={content}
              isOpenOverride={isOpen}
              heading={accordian.question}
              clickHandler={() => setActiveAccoridanIndex(index)}
              key={index}
            />
          );
        })}
      </AccordiansWrap>
    </StyledSliderAccordian>
  );
};

export default SliderAccordian;
