import React, { useState } from 'react';
import styled from 'styled-components';
import Chevron from '../UI/Chevron';
import { RichText } from 'prismic-reactjs';
import { AVENIR, GRAPHIK, COLORS } from '../../constants/ui-constants';
import { Slider } from './Slider';
import Image from '../UI/Image';

const StyledFAQSlider = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 24px;
  width: 100%;
  line-height: 1.4;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledSliderWrapper = styled.div`
  display: grid;
  height: 368px;
  overflow: hidden;
  max-height: 368px;
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

const StyledFAQWrap = styled.div`
  .faq-item {
    padding: 16px 0;
    border-bottom: 1px solid ${COLORS.CHALK};
    display: grid;
    grid-template-rows: max-content max-content;
  }
  .question {
    display: grid;
    grid-template-columns: 1fr auto;
    font-weight: ${AVENIR.HEAVY};
    font-family: ${AVENIR.FONT_STACK};
  }
  .question-text {
    cursor: pointer;
  }
  @media (max-width: 768px) {
    .faq-item {
      grid-row-gap: 16px;
    }
  }
`;

const StyledTextBlock = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  margin-top: 8px;
  font-family: ${GRAPHIK.FONT_STACK};
  p {
    margin: 0;
  }
  a {
    color: #ec1943;
  }
  img {
    width: 100%;
  }
`;
const StyledSingleImage = styled.div`
  display: flex
  max-height: 368px;
  width: auto;
  display: grid;
  img {
    width: 100%;
    height: auto;
    display: flex;
    object-fit: cover;
  }
  @media (max-width: 768px){
    max-height: 195px;
    margin-bottom: 16px;
  }
`;

const FAQSlider = props => {
  const { faqs, sliceProps } = props;
  const { isMobile } = sliceProps;
  const [openFAQIndex, setOpenIndex] = useState(0);
  const images = faqs[openFAQIndex].images;
  return (
    <StyledFAQSlider>
      {!isMobile && openFAQIndex >= 0 ? (
        <StyledSliderWrapper>
          {images.length > 1 ? (
            <Slider images={images} id={Math.random()} />
          ) : (
            <StyledSingleImage>
              <Image
                imageId={images[0]?.alt}
                dontLazyLoad={true}
                url={images[0]?.url}
                alt={images[0]?.alt}
              />
            </StyledSingleImage>
          )}
        </StyledSliderWrapper>
      ) : null}

      <StyledFAQWrap>
        {faqs.map((faqItem, index) => {
          const isOpen = index == openFAQIndex;
          return (
            <div className="faq-item">
              <div
                className="question"
                onClick={() => {
                  setOpenIndex(index);
                }}
              >
                <div className="question-text">{faqItem.question}</div>
                <div className="state-icon">
                  <Chevron isActive={isOpen} />
                </div>
              </div>
              <StyledTextBlock isOpen={isOpen}>
                {isMobile && isOpen ? (
                  <StyledSliderWrapper>
                    <Slider
                      images={faqs[openFAQIndex].images}
                      id={Math.random()}
                    />
                  </StyledSliderWrapper>
                ) : null}
                <RichText render={faqItem.answer} />
              </StyledTextBlock>
            </div>
          );
        })}
      </StyledFAQWrap>
    </StyledFAQSlider>
  );
};

export default FAQSlider;
