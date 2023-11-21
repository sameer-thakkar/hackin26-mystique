import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const TopCollectionsCarouselSection = styled.div`
  padding: 3rem 0;

  @media (max-width: 768px) {
    padding: 2rem 0 3rem;
  }
`;

export const TopCollectionsCarouselContainer = styled.div`
  width: calc(100% - (5.46vw * 2));
  max-width: ${SIZES.MAX_WIDTH};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    width: 100%;
    max-width: unset;
    margin: unset;
    gap: 1rem;
  }
`;

export const HeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    width: calc(100% - (5.46vw * 2));
    max-width: ${SIZES.MAX_WIDTH};
    margin: 0 auto;
  }
`;

export const SectionHeading = styled.h2`
  margin: unset;
  ${expandFontToken(FONTS.HEADING_LARGE)};
  color: ${COLORS.GRAY.G2};

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.HEADING_SMALL)};
  }
`;

export const CarouselControls = styled.div`
  display: flex;
  gap: 0.5rem;

  .prev-pill,
  .next-pill {
    width: 2rem;
    height: 2rem;
  }

  svg {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
`;
