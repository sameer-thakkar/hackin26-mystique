import React, { Component } from 'react';
import styled from 'styled-components';
import sliceHandler from '../Slices';
import { FULL_WIDTH_SLICES } from '../../constants';
import { COLORS, SOLEIL } from '../../constants/ui-constants';

export const StyledLongForm = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  line-height: 1.6;
  display: grid;
  grid-row-gap: 72px;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${COLORS.FOUR_BLACK};
    line-height: 1.2;
  }
  .slice-block img {
    width: 100%;
  }
  h2 {
    display: inline-block;
    color: ${COLORS.FOUR_BLACK};
    font-size: 24px;
    margin: 0.2em 0;
    font-weight: ${SOLEIL.SEMIBOLD};
  }
  h3 {
    font-size: 22px;
    font-weight: 500;
  }
  /* Ignore immediate em,b,strong... inside h-tags */
  h1 > *,
  h2 > *,
  h3 > *,
  h4 > *,
  h5 > *,
  h6 > * {
    font-weight: ${SOLEIL.SEMIBOLD};
    color: ${COLORS.FOUR_BLACK};
  }
  p {
    font-size: 1rem;
    line-height: 1.6;
    color: ${COLORS.FOUR_BLACK};
    font-family: ${SOLEIL.FONT_STACK};
  }
  & > p > a {
    text-decoration: none;
    color: #ec1943;
  }

  ul {
    font-size: 1rem;
    padding-left: 20px;
    line-height: 2;
    color: ${COLORS.FOUR_BLACK};
  }

  @media (max-width: 768px) {
    grid-row-gap: 52px;
    h1 {
      font-size: 1.6rem;
      color: ${COLORS.FOUR_BLACK};
    }
    h2 {
      font-size: 1.4rem;
      color: ${COLORS.FOUR_BLACK};
    }
    h3 {
      font-size: 1.2rem;
      color: ${COLORS.FOUR_BLACK};
    }
    h4 {
      font-size: 1rem;
      color: ${COLORS.FOUR_BLACK};
    }
    h5 {
      font-size: 0.8rem;
      color: ${COLORS.FOUR_BLACK};
    }
    h6 {
      font-size: 0.6rem;
      color: ${COLORS.FOUR_BLACK};
    }
  }
`;
export default class LongForm extends Component<any, any> {
  render() {
    const { content, ...props } = this.props;
    return (
      <StyledLongForm>
        {content.map((slice, index) => (
          <div
            key={`long-form-${slice?.slice_type}-${index}`}
            className={`${
              !FULL_WIDTH_SLICES.includes(slice.slice_type)
                ? 'slice-wrapper'
                : ''
            } slice-block ${slice.slice_type}`}
          >
            {sliceHandler(slice, { ...props, sliceIndex: index })}
          </div>
        ))}
      </StyledLongForm>
    );
  }
}
