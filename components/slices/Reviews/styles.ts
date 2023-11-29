import styled from 'styled-components';
import HorizontalLine from 'components/slices/HorizontalLine';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledReviews = styled.div`
  width: 100%;
  position: relative;
  .next-slide {
    right: 0.375rem !important;
  }
  .prev-slide {
    left: -1.25rem !important;
  }

  ${({ reviewType }: { reviewType: string | null }) => {
    if (reviewType === 'testimonial') {
      return `
        .custom-pagination {
          bottom: 40px;
          right: 64px;
          z-index: 1;
        }
    `;
    }
    return `
      .custom-pagination {
        top: 110%;
        left: 50%;
        transform: translateX(-50%);
      } 
    `;
  }}
  .slider-bullet {
    background-color: ${(props) => props.theme.primaryColor};
  }
  @media (max-width: 768px) {
    width: 100%;
    .swiper-wrapper {
      height: 100% !important;
    }
    ${({ reviewType }) => {
      if (reviewType === 'testimonial') {
        return `
        .custom-pagination {
          top: 95%;
          left: 50%;
          transform: translateX(-50%);
        }
      `;
      }
    }}
  }
`;

export const Title = styled.h2<{ showNewDesign?: boolean }>`
  font-size: 24px !important;
  line-height: 28px !important;
  font-weight: unset !important;
  display: block !important;
  text-align: left;
  padding: ${({ showNewDesign }) => (showNewDesign ? '0 1rem' : '0 1rem 2rem')};
  ::after {
    content: unset !important;
  }
`;

export const Review = styled.div<{ showNewDesign?: boolean }>`
  border: 1px solid ${COLORS.GRAY.G7};
  border-radius: 8px;
  height: 100%;
  display: grid;
  min-height: 15rem;
  margin-right: ${({ showNewDesign }) => (showNewDesign ? '0' : '1.625rem')};
  background: linear-gradient(
    154deg,
    rgba(255, 236, 255, 0.21) 0%,
    rgba(226, 216, 255, 0.31) 100%
  );

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

export const ReviewContent = styled.div`
  margin: 1.25rem 1.5rem 0;
`;

export const ReviewText = styled.div`
  color: ${COLORS.GRAY.G3};
  ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}
  margin: 0.875rem 0;
`;

export const ReviewTop = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
`;

export const Reviewer = styled.div`
  width: fit-content;
  display: grid;
  grid-column-gap: 16px;
  grid-template-areas: 'image name' 'image subtext';
`;

export const ReviewerImage = styled.div`
  grid-area: image;
  width: 48px;
  height: 48px;
  img {
    width: 100%;
    border-radius: 50%;
  }
`;

export const ReviewerName = styled.div`
  ${expandFontToken(FONTS.HEADING_SMALL)}
  line-height: 24px;
`;

export const ReviewerSubtext = styled.div`
  display: flex;
  gap: 0.25rem;
  font-size: 14px;
  line-height: 20px;
  color: ${COLORS.GRAY.G4};
`;

export const ReviewerCountry = styled.div`
  height: 1rem;
  width: 1rem;
  margin: 0.25rem 0.25rem 0 0.063rem;
`;

export const ReviewFooter = styled.div`
  ${HorizontalLine} {
    margin-bottom: 0.5rem;
  }
  ${expandFontToken(FONTS.PARAGRAPH_SMALL)}
  align-self: end;
  color: ${COLORS.GRAY.G4};
  text-decoration: underline;
  padding: 0 1.5rem 1.25rem;
`;

export const RatingWrapper = styled.div`
  justify-self: flex-end;
  align-self: center;
`;

export const RatingTime = styled.div`
  margin-top: 10px;
  text-align: right;
  font-size: 12px;
  line-height: 16px;
  color: ${COLORS.GRAY.G4};
`;

export const SwiperControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
  align-items: center;

  svg:not(.disabled):hover {
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
    border-radius: 50%;
  }

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
