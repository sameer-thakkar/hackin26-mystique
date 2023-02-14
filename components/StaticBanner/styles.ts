import styled from 'styled-components';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';
import { FONTS } from 'const/fonts';

export const BannerSection = styled.div`
  margin: 1.5rem 1.5rem 2rem;

  @media (min-width: 768px) {
    height: 18.75rem;
    max-width: 75rem;
    margin: 2rem auto 3rem;
  }
`;

export const Container = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-column-gap: 1.5rem;
    grid-template-columns: 1fr 1fr;
    height: 100%;
  }
`;

export const ContentContainer = styled.div`
  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 32.5rem;
  }
`;

export const MediaContainer = styled.div`
  position: relative;
  border-radius: 1rem;
  box-shadow: 0px 12px 40px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  .banner-image {
    display: block;
    object-fit: cover;
    width: 100%;
  }

  img,
  video {
    height: 18.75rem;
    border-radius: 1rem;
  }
`;

export const Heading = styled.h1`
  margin: 0;
  color: ${COLORS.GRAY.G2};
  ${expandFontToken(FONTS.HEADING_LARGE)};

  @media (min-width: 768px) {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)}
  }
`;

export const DisclaimerText = styled.p`
  margin: 1rem 0 0;
  color: ${COLORS.GRAY.G2};
  ${expandFontToken(FONTS.PARAGRAPH_SMALL)};

  @media (min-width: 768px) {
    width: 30.375rem;
    margin: 1.5rem 0 0;
    ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}
  }
`;

export const RatingsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  column-gap: 0;

  svg {
    margin-top: 0.0625rem;
    height: 0.75rem;
    width: 0.75rem;
  }

  @media (min-width: 768px) {
    margin-top: 1rem;
    column-gap: 0.25rem;

    svg {
      margin-top: 0;
      height: 1rem;
      width: 1rem;
    }
  }
`;

export const AverageRatingWrapper = styled.span`
  color: ${COLORS.TEXT.CANDY_1};
  margin: 0 0.1875rem 0 0.125rem;
  ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};

  @media (min-width: 768px) {
    margin: 0;
    ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)};
  }
`;

export const RatingCountWrapper = styled.span`
  color: ${COLORS.GRAY.G2};
  ${expandFontToken(FONTS.UI_LABEL_REGULAR)};

  @media (min-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_LARGE)};
  }
`;
