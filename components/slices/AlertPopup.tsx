import React from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import { SOLEIL } from 'const/ui-constants';

import Swiper from '../Swiper';

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: 38% 55%;
  grid-template-areas: 'images content';
  grid-template-rows: max-content;
  grid-column-gap: 20px;
  font-family: ${SOLEIL.FONT_STACK};
  width: 850px;
  height: 522px;
  color: #444444;
  @media (max-width: 768px) {
    grid-template-areas: 'images' 'content';
    grid-template-columns: 100%;
    width: 100vw;
    height: unset;
  }
`;

const StyledContent = styled.div`
  align-self: center;
  grid-area: content;
  padding: 28px 16px;
  @media (max-width: 768px) {
    align-self: unset;
  }
`;

const StyledImages = styled.div`
  grid-area: images;
  display: flex;
  width: 100%;
  height: 522px;
  border-radius: 8px 8px 0px 0px;
  .swiper-pagination.swiper-pagination-bullets {
    top: unset;
    display: block;
  }
  img {
    object-fit: cover;
  }
  @media (max-width: 768px) {
    height: 200px;
    img {
      border-radius: 8px 8px 0px 0px;
    }
  }
`;

const StyledTitle = styled.div`
  font-weight: ${SOLEIL.SEMIBOLD};
  font-size: 22px;
  line-height: 24px;
  margin-bottom: 16px;
  @media (max-width: 768px) {
    font-size: 16px;
    line-height: 16px;
  }
`;

const StyledMessage = styled.div`
  font-size: 12px;
  ul {
    padding-inline-start: 20px;
  }
`;

type AlertPopupProps = {
  images: any[];
  title: string;
  description: string;
};

const swiperParams = {
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true,
  },
};

const AlertPopup: React.FC<AlertPopupProps> = ({
  images,
  title,
  description,
}) => {
  return (
    <StyledWrapper>
      <StyledImages>
        <Swiper {...swiperParams}>
          {images.map((image, index) => {
            return (
              <img
                className="swiper-slide"
                key={index}
                src={image.image_source.url}
                alt="swiper-slide"
              />
            );
          })}
        </Swiper>
      </StyledImages>
      <StyledContent>
        <StyledTitle>{title}</StyledTitle>
        <StyledMessage>
          <RichText render={description}></RichText>
        </StyledMessage>
      </StyledContent>
    </StyledWrapper>
  );
};

export default AlertPopup;
