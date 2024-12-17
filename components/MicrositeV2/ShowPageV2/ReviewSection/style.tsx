import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const ReviewSectionWrapper = styled.div`
  margin-top: 1rem;
  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }
`;

export const RatingsDetailsSection = styled.div<{
  $showingReviewsSection?: boolean;
}>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  ${({ $showingReviewsSection }) =>
    $showingReviewsSection &&
    css`
      padding-bottom: 2.94rem;
      border-bottom: dotted 1px ${COLORS.GRAY.G6};

      @media (max-width: 768px) {
        padding-bottom: 0.75rem;
      }
    `}

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const RatingsCountSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;
export const Ratings = styled.div`
  ${expandFontToken(FONTS.DISPLAY_REGULAR)};
  color: ${COLORS.TEXT.CANDY_1};
  svg {
    height: 1.75rem;
    width: 1.75rem;
  }

  @media (max-width: 768px) {
    font-weight: 400;
    line-height: 1.75rem;
  }
`;
export const RatingsCount = styled.div`
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
  color: ${COLORS.GRAY.G3};
  @media (max-width: 768px) {
    display: none;
  }
`;
export const RatingsSplit = styled.div`
  display: flex;
  flex-direction: column;
`;
export const StarCount = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  svg {
    margin-right: 0.12rem;
    height: 1rem;
    width: 1rem;
  }

  span {
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
    color: ${COLORS.GRAY.G2};
  }
`;

export const RatingBarBase = styled.div`
  margin-left: 1.25rem;
  margin-right: 1.38rem;
  height: 0.4rem;
  border-radius: 0.254rem;
  background-color: rgb(235, 235, 235);
  width: 10.75rem;

  @media (max-width: 768px) {
    margin-left: 1.63rem;
    margin-right: 1.05rem;
  }
`;

export const RatingBarAmount = styled.div<{ $width: number }>`
  background-color: ${COLORS.BRAND.CANDY};
  width: ${({ $width }) => `${$width}%`};
  height: 0.4rem;
  border-radius: 0.254rem;
`;

export const ReviewsSection = styled.div`
  padding: 1.5rem 0;
`;

export const Review = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`;

export const ReviewContent = styled.p`
  margin: 0;
  ${expandFontToken(FONTS.PARAGRAPH_LARGE)};
  color: ${COLORS.GRAY.G2};
  @media (max-width: 768px) {
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
`;

export const StyledReviewSectionHeading = styled.div`
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
  margin-top: 1rem;
  color: ${COLORS.GRAY.G2};
`;

export const ViewTranslatedContentButton = styled.p`
  margin: 0;
  margin-top: 0.5rem;
  ${expandFontToken(FONTS.UI_LABEL_LARGE)};
  color: rgb(15, 67, 189);
  cursor: pointer;
  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
  }
`;

export const ReviewMediaSection = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 1.25rem;
  overflow: scroll;
  z-index: 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }

  .swiper {
    margin: 0;
    width: 100%;
  }

  img,
  .image-wrap {
    border-radius: 0.375rem;
    width: 11.25rem;
    height: 15rem;
  }
  @media (max-width: 768px) {
    margin-left: -1rem;
    .swiper-wrapper {
      margin-left: 1rem;
    }
    img,
    .image-wrap {
      border-radius: 0.25rem;
      width: 6.125rem;
      height: 8.16669rem;
    }
  }
`;

export const AllReviewsButton = styled.a`
  display: flex;
  padding: 0.6875rem 1.25rem 0.8125rem 1.25rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 14.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${COLORS.GRAY.G2};
  background: ${COLORS.BRAND.WHITE};

  cursor: pointer;
  ${expandFontToken(FONTS.BUTTON_BIG)};
  color: ${COLORS.GRAY.G2};
  :hover {
    box-shadow: 0px 8px 15px 0px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    width: auto;
    ${expandFontToken(FONTS.BUTTON_MEDIUM)};
  }
`;

export const ShowMoreReviewsButton = styled.button`
  display: flex;
  padding: 0.6875rem 1.25rem 0.8125rem 1.25rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 14.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${COLORS.GRAY.G2};
  background: ${COLORS.BRAND.WHITE};

  cursor: pointer;
  ${expandFontToken(FONTS.BUTTON_BIG)};
  color: ${COLORS.GRAY.G2};

  :hover {
    box-shadow: 0px 8px 15px 0px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    width: 100%;
    ${expandFontToken(FONTS.BUTTON_MEDIUM)};
  }
`;

export const ReviewSkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 744px;
  margin-bottom: 1rem;
  line-height: 0;

  :not(:last-child) {
    margin-bottom: 2rem;
  }

  .react-loading-skeleton {
    z-index: 0;
  }

  @media (max-width: 768px) {
    width: 21.75rem;
  }
`;

export const ReviewUserDetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
`;

export const ReviewUserDetailsTextContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: start;
`;

export const ReviewSkeletonMediaContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

export const SnapshotSectionContainer = styled.div`
  border-bottom: dotted 1px ${COLORS.GRAY.G6};
`;
