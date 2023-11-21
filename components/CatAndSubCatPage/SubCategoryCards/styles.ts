import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const CardsSection = styled.div`
  padding: 2rem 0;
`;

export const CardsContainer = styled.div`
  width: calc(100% - (5.46vw * 2));
  max-width: ${SIZES.MAX_WIDTH};
  margin: 0 auto;
`;

export const HeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .sort-selector {
    margin-left: auto;
  }
`;

export const SectionHeading = styled.h2`
  margin: unset;
  ${expandFontToken(FONTS.HEADING_LARGE)};
  color: ${COLORS.GRAY.G2};

  @media (max-width: 767px) {
    ${expandFontToken(FONTS.HEADING_SMALL)};
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1.5rem;
  grid-row-gap: 2rem;
  padding-top: 1.5rem;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    padding-top: 1.5rem;
  }
`;
