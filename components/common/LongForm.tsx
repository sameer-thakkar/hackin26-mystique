import React, { Component } from 'react';
import styled from 'styled-components';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';
import { FULL_WIDTH_SLICES } from '../../constants';
import sliceHandler from '../Slices';

export const StyledLongForm = styled.div<{
  isVenuePage?: boolean;
}>`
  display: grid;
  grid-row-gap: ${({ isVenuePage }) => {
    return isVenuePage ? '64px' : '56px';
  }};
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${COLORS.GRAY.G2};
    line-height: 1.2;
  }
  .slice-block .image-wrap {
    width: 100%;
  }
  .slice-block img {
    width: 100%;
  }
  .slice-block div[class^='CardSection__CardGrid'] .image-wrap {
    min-height: 100%;
  }
  h2 {
    color: ${COLORS.GRAY.G2};
    display: inline-block;
    margin: 0.2em 0;
    ${expandFontToken('Heading/Large')}
  }
  h3 {
    ${expandFontToken('Heading/Small')}
  }
  /* Ignore immediate em,b,strong... inside h-tags */
  h1 > *,
  h2 > *,
  h3 > *,
  h4 > *,
  h5 > *,
  h6 > * {
    font-weight: 500;
    color: ${COLORS.GRAY.G2};
  }
  p {
    ${expandFontToken('Paragraph/Large')}
    margin-top: 0;
    color: ${COLORS.GRAY.G2};
  }
  & > p > a {
    text-decoration: none;
    color: ${COLORS.BRAND.PURPS};
  }

  ul {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken('Paragraph/Large')}
    padding-left: 20px;
  }

  @media (max-width: 768px) {
    ${({ isVenuePage }) =>
      isVenuePage
        ? `
      && {
        grid-row-gap: 40px
      }`
        : `
       grid-row-gap: 52px;
      `}
    h1 {
      ${expandFontToken('Heading/Large')}
      color: ${COLORS.GRAY.G2};
    }
    h2 {
      ${expandFontToken('Heading/Regular')}
      color: ${COLORS.GRAY.G2};
    }
    h3 {
      ${expandFontToken('Heading/Small')}
      color: ${COLORS.GRAY.G2};
    }
    h4 {
      font-size: 1rem;
      color: ${COLORS.GRAY.G2};
    }
    h5 {
      font-size: 0.8rem;
      color: ${COLORS.GRAY.G2};
    }
    h6 {
      font-size: 0.6rem;
      color: ${COLORS.GRAY.G2};
    }
    p, ul, ol {
      ${expandFontToken('Paragraph/Medium')}
    }
  }
`;
export default class LongForm extends Component<any, any> {
  render() {
    const { content, ...props } = this.props;

    return (
      <StyledLongForm isVenuePage={props.isVenuePage}>
        {content.map((slice: any, index: number) => (
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
