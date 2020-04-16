import React, { useState } from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import Chevron from '../UI/Chevron';
import Slider from '../UI/Slider';
import Image from '../UI/Image';
import { AVENIR, GRAPHIK, COLORS } from '../../constants/ui-constants';
import { shortCodeSerializer } from '../../utils/shortCodes';

const StyledFAQSlider = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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

const FAQWrap = styled.div`
  .faq-item {
    padding: 16px 0;
    margin-right: 24px;
    border-bottom: 1px solid ${COLORS.CHALK};
    display: grid;
    grid-template-rows: max-content max-content;
  }
  .faq-item:last-child {
    border-bottom: none;
  }
  .question {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-column-gap: 10px;
    font-weight: ${AVENIR.BLACK};
    font-family: ${AVENIR.FONT_STACK};
  }
  .question-text {
    cursor: pointer;
  }
  @media (max-width: 768px) {
    .faq-item {
      grid-row-gap: 16px;
      margin-right: 0;
      padding: 16px;
    }
  }
`;

const TextBlock = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'grid' : 'none')};
  grid-row-gap: 8px;
  font-family: ${GRAPHIK.FONT_STACK};
  p {
    margin: 0;
  }
  a {
    color: ${COLORS.MED_SLATE_BLUE};
  }
  img {
    width: 100%;
  }
`;
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
 * FAQ Slider allows you to add a image slider & question combo. Each question can have a image or a slider associated to it.
 *
 * ## Repeatable Zone:
 *
 *  Upload Image: if you have the image locally, use this option to upload.
 *
 *  Link to Image: If image already uploaded, add the image url here.
 *
 *  Alt Text: Sets the alternate text for the image (alt)
 *
 *
 *
 * ## Non Repeatable Zone;
 *   Question: Enter the FAQ Question here.
 *
 *   Answer: Enter the FAQ Answer Here.
 *
 */
const FAQSlider = (props) => {
  const { faqs, sliceProps } = props;
  const { isMobile } = sliceProps;
  const [openFAQIndex, setOpenIndex] = useState(0);
  const images = faqs[openFAQIndex].images;
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
  return (
    <StyledFAQSlider>
      {!isMobile && openFAQIndex >= 0 ? (
        <SliderWrapper>
          {images.length > 1 ? (
            <Slider
              sliderOptions={sliderOptions}
              parentOverflowHidden={true}
              id={Math.random()}
            >
              {images.map((image, index) => {
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
                imageId={images[0]?.alt}
                url={images[0]?.url}
                alt={images[0]?.alt}
              />
            </SingleImage>
          )}
        </SliderWrapper>
      ) : null}

      <FAQWrap>
        {faqs.map((faqItem, index) => {
          const isOpen = index == openFAQIndex;
          return (
            <div className="faq-item" key={index}>
              <div
                role="button"
                tabIndex={0}
                className="question"
                onClick={() => {
                  setOpenIndex(index);
                }}
              >
                <div className="question-text">{faqItem.question}</div>
                <div className="state-icon">
                  <Chevron isActive={isOpen} activeCursor={false} />
                </div>
              </div>
              <TextBlock isOpen={isOpen}>
                {isMobile && isOpen ? (
                  <SliderWrapper>
                    <Slider
                      sliderOptions={sliderOptions}
                      parentOverflowHidden={true}
                      id={Math.random()}
                    >
                      {faqs[openFAQIndex].images.map((image, index) => {
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
                  </SliderWrapper>
                ) : null}
                <div className="answer-content">
                  <RichText
                    render={faqItem.answer}
                    htmlSerializer={shortCodeSerializer}
                  />
                </div>
              </TextBlock>
            </div>
          );
        })}
      </FAQWrap>
    </StyledFAQSlider>
  );
};

export default FAQSlider;
