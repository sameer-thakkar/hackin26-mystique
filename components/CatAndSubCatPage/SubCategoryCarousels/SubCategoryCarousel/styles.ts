import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const SubCategoryCarouselContainer = styled.div`
  width: calc(100% - (5.46vw * 2));
  max-width: ${SIZES.MAX_WIDTH};
  margin: 0 auto;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;

  @media (max-width: 768px) {
    width: 100%;
    max-width: unset;
    margin: unset;
  }
`;

export const HeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .see-all-cta {
    margin-left: auto;
    a {
      border-bottom: 1px solid ${COLORS.GRAY.G2};
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
      color: ${COLORS.GRAY.G2};
    }
  }

  @media (max-width: 768px) {
    width: calc(100% - (5.46vw * 2));
    max-width: ${SIZES.MAX_WIDTH};
    margin: 0 auto;
    .see-all-cta {
      a {
        ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
      }
    }
  }
`;

export const SectionHeading = styled.h2`
  margin: unset;
  ${expandFontToken(FONTS.HEADING_LARGE)};
  color: ${COLORS.GRAY.G2};
`;

export const CarouselControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;

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
