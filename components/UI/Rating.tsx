import React from 'react';
import styled from 'styled-components';

import Star from './Star';

const StyledRating = styled.div`
  display: grid;
  grid-template-columns: repeat(5, max-content);
  grid-gap: 2px;
  height: 15px;
  width: max-content;
`;

const Rating = ({
  value,
  starSize = '15px',
  ...props
}: any) => {
  function getStars() {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      let star = 0;
      if (value >= i) {
        star = 1;
      } else if (value < i - 1) {
        star = 0;
      } else {
        star = value - i + 1;
      }
      stars.push(star);
    }
    return stars.map((val, index) => (
      <Star
        fillColor={props.fillColor}
        fillValue={val}
        key={index}
        starSize={starSize}
      />
    ));
  }
  return <StyledRating {...props}>{getStars()}</StyledRating>;
};

export default Rating;
