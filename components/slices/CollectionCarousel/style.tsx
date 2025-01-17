import styled from 'styled-components';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const CardContainer = styled.div`
  max-width: ${SIZES.MAX_WIDTH};
  margin: 56px auto 0;

  .prev-slide,
  .next-slide {
    top: 7.5rem;
  }

  padding: 0 0 2rem 0;

  .collection-image {
    img {
      height: 15rem;
      width: 11.25rem;
      border-radius: 4px;
    }
  }

  &:has(+ footer) {
    padding: 0;
  }

  @media (max-width: 768px) {
    padding: 0 0 2.5rem 0;
    margin-top: 52px;

    & > div {
      margin: 0;
      padding-left: 1.5rem;
    }

    .collection-image {
      img {
        height: 13rem;
        width: 9.75rem;
      }
    }
  }
`;

export const Card = styled.div`
  cursor: pointer;
`;

export const Heading = styled.h3`
  ${expandFontToken(FONTS.HEADING_LARGE)};
  @media (max-width: 768px) {
    padding-left: 1.5rem;
    ${expandFontToken(FONTS.HEADING_SMALL)};
  }
`;

export const Label = styled.div`
  padding-top: 0.375rem;
  ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};

  word-wrap: break-word;
  width: 11.25rem;

  @media (max-width: 768px) {
    width: 9.75rem;
  }
`;
