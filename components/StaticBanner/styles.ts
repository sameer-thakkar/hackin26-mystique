import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const BannerSection = styled.div<{
  $isNonPoi?: boolean;
}>`
  margin: 0;
  .overlay {
    position: absolute;
    height: 5rem;
    inset: 13.25rem 0 0;
    z-index: 1;
    background: linear-gradient(
      180deg,
      rgba(247, 236, 255, 0) 1.39%,
      #fbf4ff 85.29%
    );
  }
  ${({ $isNonPoi }) =>
    $isNonPoi &&
    `background: linear-gradient(183deg, #fff 2.24%, #f6ebff 97.71%);`}

  @media (min-width: 768px) {
    height: 18.75rem;
    display: grid;
    padding: 2rem 0 1.25rem;
    justify-items: center;
    ${({ $isNonPoi }) =>
      $isNonPoi &&
      `background: linear-gradient(180deg,rgba(243, 233, 255, 0) 0%,rgba(243, 233, 255, 0.5) 100%), #fff;
       padding: 2rem 0;
      `}
  }
`;

export const Container = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-column-gap: 1.5rem;
    grid-template-columns: 1fr 1fr;
    height: 100%;
    width: 100vw;
    align-items: center;
  }

  @media (min-width: 1200px) {
    min-width: 75rem;
    width: 75rem;
  }
`;

export const ContentContainer = styled.div`
  display: grid;
  grid-template-areas:
    'top'
    'middle'
    'bottom';

  @media (min-width: 768px) {
    max-width: 32.5rem;
    margin: 0;
  }
`;

export const MediaContainer = styled.div<{
  $isNonPoi?: boolean;
}>`
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  height: 18.75rem;
  ${({ $isNonPoi }) =>
    !$isNonPoi && `box-shadow: 0px 12px 40px 12px rgba(0, 0, 0, 0.2);`}

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

  @media (max-width: 768px) {
    height: 13.75rem;
    border-radius: 0;

    img,
    video {
      height: 13.75rem;
      border-radius: 0;
    }
  }
`;

export const Heading = styled.h1<{
  $isNonPoi?: boolean;
  $displayRating?: boolean;
  $showTrustBooster?: boolean;
}>`
  margin: ${({ $showTrustBooster }) =>
    $showTrustBooster ? '0 1.5rem' : '1.5rem 1.5rem 0'};
  color: ${COLORS.GRAY.G2};
  grid-area: ${({ $isNonPoi, $displayRating, $showTrustBooster }) =>
    ($isNonPoi && $displayRating) || $showTrustBooster ? 'middle' : 'top'};
  ${expandFontToken(FONTS.HEADING_LARGE)};
  ${({ $isNonPoi, $displayRating }) =>
    $isNonPoi &&
    `margin: ${$displayRating ? '0.25rem 1.5rem 0' : '1.25rem 1.5rem 0'};
  `}

  @media (min-width: 768px) {
    margin: ${({ $showTrustBooster }) =>
      $showTrustBooster ? '0' : '0.5rem 0 0'};
    ${expandFontToken(FONTS.DISPLAY_REGULAR)}
  }
`;

export const DisclaimerText = styled.p`
  margin: 1rem 1.5rem 2rem;
  color: ${COLORS.GRAY.G2};
  ${expandFontToken(FONTS.PARAGRAPH_SMALL)};

  @media (min-width: 768px) {
    width: 30.375rem;
    margin: 1.5rem 0 0;
    ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}
  }
`;

export const RatingsWrapper = styled.div<{
  $isNonPoi?: boolean;
}>`
  display: flex;
  align-items: center;
  column-gap: 0;
  margin: ${({ $isNonPoi }) =>
    $isNonPoi ? '1.5rem 1.5rem 0' : '0.5rem 1.5rem 0'};
  grid-area: ${({ $isNonPoi }) => ($isNonPoi ? 'top' : 'middle')};

  svg {
    margin-top: 0.0625rem;
    height: 0.75rem;
    width: 0.75rem;
  }

  @media (min-width: 768px) {
    ${({ $isNonPoi }) =>
      $isNonPoi &&
      `
    border: 1px solid rgba(0, 0, 0, 0.30);
    border-radius: 4px;
    width: max-content;
    padding: 0.188rem 0.375rem 0.313rem;
    margin-bottom: 0.5rem;
  `}
    margin: ${({ $isNonPoi }) => ($isNonPoi ? '0' : '1rem 0 0')};
    column-gap: 0.25rem;
    svg {
      margin-top: 0;
      height: 1rem;
      width: 1rem;
    }
  }
`;

export const AverageRatingWrapper = styled.span<{
  $isNonPoi?: boolean;
}>`
  color: ${({ $isNonPoi }) =>
    $isNonPoi ? COLORS.GRAY.G1 : COLORS.TEXT.CANDY_1};
  margin: 0 0.1875rem 0 0.125rem;
  ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};

  @media (min-width: 768px) {
    margin: 0;
    ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)};
  }
`;

export const RatingCountWrapper = styled.span<{
  $isNonPoi?: boolean;
}>`
  color: ${({ $isNonPoi }) => ($isNonPoi ? COLORS.GRAY.G3 : COLORS.GRAY.G2)};
  ${expandFontToken(FONTS.UI_LABEL_REGULAR)};

  @media (min-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_LARGE)};
  }
`;

export const Divider = styled.div`
  background: ${COLORS.PURPS.LEVEL_15};
  height: 0.063rem;
  margin: 1rem 1.5rem 1.25rem;
  grid-area: 'bottom';
  opacity: 0.5;
  @media (min-width: 768px) {
    margin: 1rem 0 1.25rem;
    opacity: 0.3;
    background: linear-gradient(90deg, #b9a1a1 3.83%, #fff7f7 82.38%);
  }
`;
export const DescriptorWrapper = styled.div`
  @media (max-width: 768px) {
    overflow: hidden;
    width: 100%;
    .marquee {
      display: flex;
      animation: marquee-scroll 17s linear infinite;
      gap: 1rem;
    }
    @keyframes marquee-scroll {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(-120%);
      }
    }
  }
`;

export const Descriptor = styled.div`
  display: flex;
  gap: 0.375rem;
  flex: 0 0 auto;
  width: max-content;
  margin-bottom: 1rem;
  ${expandFontToken(FONTS.UI_LABEL_LARGE)};

  .image-wrap {
    width: auto;
  }
`;
