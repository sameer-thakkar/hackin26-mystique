import React, { Component } from 'react';
import sliceHandler from './Slices';
import { FULL_WIDTH_SLICES } from '../constants';
import { COLORS } from '../constants/ui-constants';
import styled from 'styled-components';

export const StyledLongform = styled.div`
  font-family: 'Graphik', 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial,
    sans-serif;
  line-height: 1.6;
  color: ${COLORS.FOUR_BLACK};
  display: grid;
  grid-row-gap: 40px;
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
    font-weight: 500;
  }
  h2::after {
    content: '';
    width: 75px;
    display: block;
    height: 3px;
    background: #ec1943;
    margin-top: 10px;
  }
  h3 {
    font-size: 1.4rem;
    font-weight: 500;
  }
  /* Ignore immediate em,b,strong... inside h-tags */
  h1 > *,
  h2 > *,
  h3 > *,
  h4 > *,
  h5 > *,
  h6 > * {
    font-weight: 500;
    color: ${COLORS.FOUR_BLACK};
  }
  p {
    font-size: 1rem;
    line-height: 1.6;
    color: ${COLORS.FOUR_BLACK};
    font-family: Avenir, Proxima-Nova, arial, sans-serif;
  }
  & > p > a {
    text-decoration: none;
    color: #ec1943;
  }

  ul {
    font-size: 1rem;
    padding-left: 20px;
    line-height: 2;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.6rem;
    }
    h2 {
      font-size: 1.4rem;
    }
    h3 {
      font-size: 1.2rem;
    }
    h4 {
      font-size: 1rem;
    }
    h5 {
      font-size: 0.8rem;
    }
    h6 {
      font-size: 0.6rem;
    }

    p,
    ul {
      font-size: 0.8rem;
    }
  }
`;
export default class LongForm extends Component<any, any> {
  render() {
    const { content, ...props } = this.props;
    return (
      <StyledLongform>
        {content.map((slice, index) => (
          <div
            key={index}
            className={`${
              !FULL_WIDTH_SLICES.includes(slice.slice_type)
                ? 'slice-wrapper'
                : ''
            } slice-block ${slice.slice_type}`}
          >
            {sliceHandler(slice, { ...props })}
          </div>
        ))}
      </StyledLongform>
    );
  }
}
