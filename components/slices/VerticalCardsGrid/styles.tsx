import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import styled from 'styled-components';

export const Wrapper = styled.div`
  width: calc(100vw - (5.46vw));
  margin-top: 0.5rem;
  h2 {
    ${expandFontToken(FONTS.HEADING_SMALL)};
    margin: 0;
  }
  .slider {
    display: grid;
    grid-auto-flow: column;
    overflow-x: scroll;
    margin: 1.5rem 0 1.5rem;
    height: 100%;
    overflow-y: visible;
    .card {
      cursor: pointer;
      margin-right: 0.75rem;
      width: 9.75rem;
      height: auto;
      padding-bottom: 0.25rem;
      transform: unset;
      transition: unset;
      grid-row-gap: 10px;
      &:hover {
        transform: unset;
      }
    }
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    img {
      border-radius: 0.25rem;
      height: 13rem;
    }
    .image-wrap {
      height: auto;
      width: auto;
    }
  }
  .theatre-name {
    margin-top: 0.5rem;
    ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
  }
  .theatre-info {
    margin-top: 0.25rem;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
  }
  @media (min-width: 768px) {
    max-width: 1200px;
    width: calc(100vw - (5.46vw * 2));
    h2 {
      ${expandFontToken(FONTS.HEADING_LARGE)};
    }
    .slider {
      max-width: 1200px;
      height: 100%;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      overflow: visible;
      margin-top: 2rem;
      gap: 1.5rem;
      .card {
        width: 11.25rem;
        margin-right: 0;
        transform: translate3d(0, 0, 0);
        transition: ease 0.2s;

        &:hover {
          transform: translate3d(0, -5px, 0);
        }

        img {
          height: 15rem;
          width: 100%;
        }
      }
    }
  }
`;
