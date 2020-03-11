import React from 'react';
import styled from 'styled-components';
import { COLORS, GRAPHIK, AVENIR } from '../../constants/ui-constants';
import sliceHandler from '../Slices';

const StyledBackground = styled.div`
  padding: 40px 0;
  background: ${({ color }) => color};
  text-align: ${({ textCenter }) => (textCenter ? 'center' : 'initial')};
  font-family: ${AVENIR.FONT_STACK};
  font-size: 18px;
  line-height: 26px;
  color: ${COLORS.DAVY_GREY};
`;

const Background = props => {
  const { slices, sliceProps, color, gridCenter, textCenter } = props;
  const colorMap = {
    'Chalk Grey': COLORS.CHALK,
    'Light Grey': COLORS.LIGHTER_WHITE,
  };
  return (
    <StyledBackground
      color={colorMap[color]}
      gridCenter={gridCenter}
      textCenter={textCenter}
    >
      {slices.map((slice, index) => (
        <div
          key={index}
          className={`${
            slice.slice_type !== 'background' ? 'main-wrapper' : ''
          } slice-block ${slice.slice_type}`}
        >
          {sliceHandler(slice, sliceProps)}
        </div>
      ))}
    </StyledBackground>
  );
};

export default Background;
