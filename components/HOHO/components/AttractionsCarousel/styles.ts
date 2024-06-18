import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const CarouselContainer = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  .swiper-slide {
    width: 7.625rem;
  }
  @media (max-width: 768px) {
    width: 100%;
    max-width: unset;
    margin: unset;
    gap: 0.25rem;
  }
`;

export const HeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    margin: 0.25rem 0 0.75rem;
  }
`;

export const SectionHeading = styled.h2`
  && {
    margin: 0;
  }
  ${expandFontToken(FONTS.HEADING_SMALL)};
  color: ${COLORS.GRAY.G2};
  @media (max-width: 768px) {
    ${expandFontToken(FONTS.SUBHEADING_LARGE)};
  }
`;

export const CarouselControls = styled.div`
  display: flex;
  gap: 0.5rem;
  .prev-pill,
  .next-pill {
    width: 1.5rem;
    height: 1.5rem;
  }
  svg {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
`;
