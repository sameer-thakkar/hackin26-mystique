import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const BannerPlaceholder = styled.div`
  height: 18.75rem;
  @media (max-width: 768px) {
    height: 22.188rem;
  }
`;
export const BannerSection = styled.div<{
  $isNonPoi?: boolean;
  hasParentChip?: boolean;
}>`
  margin: 0;
  position: relative;

  ${({ $isNonPoi }) =>
    $isNonPoi &&
    `background: linear-gradient(183deg, #fff 2.24%, #f6ebff 97.71%);`}

  @media (min-width: 768px) {
    min-height: 18.75rem;
    display: grid;
    padding: ${({ hasParentChip }) =>
      hasParentChip ? '2rem 0' : '2rem 0 1.25rem'};
    justify-items: center;
    ${({ $isNonPoi }) =>
      $isNonPoi &&
      `background: linear-gradient(180deg,rgba(243, 233, 255, 0) 0%,rgba(243, 233, 255, 0.5) 100%), #fff;
       padding: 2rem 0;
      `}
  }
`;

export const Overlay = styled.div<{ $hideBanner?: boolean }>`
  position: absolute;
  height: 5.125rem;
  inset: 8.75rem 0 0;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(247, 236, 255, 0) 1.39%,
    #fbf4ff 85.29%
  );
  ${({ $hideBanner }) => $hideBanner && `display: none;`}
`;

export const Container = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-column-gap: 1.5rem;
    grid-template-columns: 1fr 1fr;
    height: 100%;
    width: 100%;
    align-items: center;
  }

  @media (min-width: 1200px) {
    min-width: 75rem;
    width: 75rem;
  }
`;

export const ContentContainer = styled.div<{
  hasParentChip?: boolean;
  hasExtraInfo?: boolean;
}>`
  display: grid;
  grid-template-areas:
    ${({ hasParentChip }) => hasParentChip && "'chip'"}
    'top'
    'middle'
    'bottom'
    'end'
    ${({ hasExtraInfo }) =>
      hasExtraInfo &&
      `
      'extraDivider'
      'extraInfo'
    `};

  @media (max-width: 768px) {
    ${({ hasParentChip }) =>
      hasParentChip &&
      `${DisclaimerText} {
      margin: 0.5rem 1.5rem 0 !important;
    }`}
    ${({ hasExtraInfo }) =>
      hasExtraInfo &&
      `
      padding-bottom: 1rem;
    `}
  }
  @media (min-width: 768px) {
    max-width: 32.5rem;
    margin: 0;
  }
`;

export const MediaContainer = styled.div<{
  $isNonPoi?: boolean;
  $hideBanner?: boolean;
  $hideOnMobile?: boolean;
}>`
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  height: 18.75rem;
  ${({ $isNonPoi }) =>
    !$isNonPoi && `box-shadow: 0px 12px 40px 12px rgba(0, 0, 0, 0.2);`}
  ${({ $hideBanner }) => $hideBanner && `display: none;`}

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
    ${({ $hideOnMobile }) => $hideOnMobile && 'display: none;'}

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
  $hasParentChip?: boolean;
}>`
  margin: ${({ $showTrustBooster }) =>
    $showTrustBooster ? '0 1.5rem' : '1.5rem 1.5rem 0'};
  color: ${COLORS.GRAY.G2};
  grid-area: ${({
    $isNonPoi,
    $displayRating,
    $showTrustBooster,
    $hasParentChip,
  }) =>
    ($isNonPoi && $displayRating) || $showTrustBooster || $hasParentChip
      ? 'middle'
      : 'top'};
  ${expandFontToken(FONTS.HEADING_LARGE)};
  ${({ $isNonPoi }) =>
    $isNonPoi &&
    `margin: 0.25rem 1.5rem 0;
  `}

  .bold-city {
    font-size: 30px;
    line-height: 38px;
    letter-spacing: 0.4px;
    font-style: normal;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 30px;
  }
  // Airport transfers
  span.airport-transfers {
    color: ${COLORS.BRAND.PURPS};
    display: block;
  }

  @media (min-width: 768px) {
    margin: ${({ $showTrustBooster }) =>
      $showTrustBooster ? '0' : '0.5rem 0 0'};
    ${expandFontToken(FONTS.DISPLAY_REGULAR)}
    .bold-city {
      font-size: 48px;
      line-height: 54px;
      letter-spacing: 0.6px;
      color: ${COLORS.PURPS.MEDIUM_TONE};
    }
  }

  ${({ $hasParentChip }) =>
    $hasParentChip &&
    `
    @media (max-width: 768px) {
      margin: 0.5rem 1.5rem 0 !important;
    }
  `}
`;
export const BannerDisclaimerText = styled.p`
  grid-area: end;
  ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  max-width: 21.875rem;
  margin: 0;
  margin-top: 0.25rem;
  color: ${COLORS.GRAY.G3};
  @media (max-width: 768px) {
    margin-left: 1.5rem;
  }
`;

export const DisclaimerText = styled.p<{
  hasParentChip?: boolean;
  $forceMobile?: boolean;
}>`
  margin: 1rem 1.5rem 2rem;
  grid-area: bottom;
  ${({ $forceMobile }) =>
    $forceMobile
      ? `${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}`
      : `  ${expandFontToken(FONTS.PARAGRAPH_SMALL)};`}
  vertical-align: middle;

  svg {
    width: 0.75rem;
    margin-right: 0.3rem;
    margin-bottom: -0.12rem;
  }
  color: ${COLORS.GRAY.G1};
  svg,
  path {
    stroke: ${COLORS.GRAY.G1};
  }

  @media (min-width: 768px) {
    width: 30.375rem;
    margin: ${({ hasParentChip }) =>
      hasParentChip ? '0.5rem 0 0' : '1.5rem 0 0'};

    ${({ $forceMobile }) =>
      $forceMobile
        ? `${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)};`
        : `${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}`}
    vertical-align: middle;
    color: ${COLORS.GRAY.G1};
    svg,
    path {
      stroke: ${COLORS.GRAY.G1};
    }
  }
`;

const handleMargin = ({
  $isNonPoi,
  $showTrustBooster,
}: {
  $isNonPoi?: boolean;
  $showTrustBooster?: boolean;
}) => {
  if ($isNonPoi) return '0 1.5rem 0';
  else if ($showTrustBooster) return '0.5rem 1.5rem 1.5rem';
  else return '0.5rem 1.5rem 0';
};

const handleGridArea = ({
  $isNonPoi,
  $showTrustBooster,
  $hasParentChip,
}: {
  $isNonPoi?: boolean;
  $showTrustBooster?: boolean;
  $hasParentChip?: boolean;
}) => {
  if ($isNonPoi || $hasParentChip) return 'top';
  else if ($showTrustBooster) return 'bottom';
  else return 'middle';
};

export const RatingsWrapper = styled.div<{
  $isNonPoi?: boolean;
  $showTrustBooster?: boolean;
  $hideComponent?: boolean;
  $showPointer?: boolean;
  $hasParentChip?: boolean;
}>`
  display: flex;
  align-items: center;
  column-gap: 0;
  display: ${({ $hideComponent }) => ($hideComponent ? 'none' : '')};
  margin: ${({ $isNonPoi, $showTrustBooster }) =>
    handleMargin({ $isNonPoi, $showTrustBooster })};
  grid-area: ${({ $isNonPoi, $showTrustBooster, $hasParentChip }) =>
    handleGridArea({ $isNonPoi, $showTrustBooster, $hasParentChip })};

  svg {
    margin-top: 0.0625rem;
    height: 0.75rem;
    width: 0.75rem;
  }
  z-index: 1;

  @media (min-width: 768px) {
    ${({ $showPointer }) => $showPointer && `cursor: pointer;`}
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
  display: block;
  margin-top: 1px;
  color: ${COLORS.GRAY.G3};
  ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  @media (min-width: 768px) {
    margin: 0;
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
  }
`;

export const Divider = styled.div<{ isVisible: boolean }>`
  background: ${COLORS.PURPS.LEVEL_15};
  height: ${({ isVisible }) => (isVisible ? '0.063rem' : 0)};
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  margin: 1rem 1.5rem 0.75rem;
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
    .swiper-slide {
      width: auto;
    }
    .swiper-wrapper {
      transition-timing-function: linear;
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

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    margin-bottom: 0.75rem;
    gap: 0.25rem;
    .image-wrap img {
      width: 1rem;
      height: 1rem;
    }
  }
`;

export const ParentChip = styled.a`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  grid-area: chip;
  color: ${COLORS.PURPS.LEVEL_3};
  background-color: ${COLORS.BACKGROUND.FLOATING_PURPS};
  border-radius: 2.25rem;
  padding: 0.5rem 1rem;
  width: max-content;
  font-size: 0.8rem;
  line-height: 1.25rem;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)};

  @media (max-width: 768px) {
    margin: 1rem 1.5rem 0.5rem;
    padding: 0.5rem 0.75rem;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
    text-transform: none;
  }

  svg {
    height: 0.9rem;
    margin-top: 0.1rem;
    path {
      stroke: ${COLORS.PURPS.LEVEL_3};
    }
  }
`;

export const ExtraDivider = styled.div`
  grid-area: extraDivider;
  width: 60%;
  max-width: 22.8rem;
  height: 1px;
  opacity: 0.3;
  margin: 1.5rem 0;
  background: linear-gradient(90deg, #8000ff 0%, #ffffff 100%);
  @media (max-width: 768px) {
    margin-left: 1.5rem;
  }
`;

export const InfoContainer = styled.div`
  grid-area: extraInfo;
  display: flex;
  flex-direction: row;
  gap: 1rem 10%;
  align-items: flex-start;
  flex-wrap: wrap;
  svg {
    transform: translateY(1.5px);
  }

  @media (max-width: 768px) {
    gap: 1rem 2rem;
    margin-left: 1.5rem;

    svg {
      height: 0.8rem;
      top: 0.25rem !important;
    }
  }

  p {
    margin: 0;
  }
  p:first-child {
    color: ${COLORS.GRAY.G3};
    ${expandFontToken(FONTS.MISC_BOOSTER)}
    text-transform: uppercase;
    margin-bottom: 0.2rem;
  }
  p:last-child,
  button {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)}

    @media (max-width: 768px) {
      font-size: 14px;
    }
  }
  button {
    cursor: pointer;
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0;
    position: relative;
    svg {
      position: absolute;
      right: -1.2rem;
      top: 0.15rem;
      transition: all 0.2s ease;
    }

    :hover svg,
    :focus svg {
      right: -1.45rem;
    }

    :hover,
    :focus {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      transform: translateY(-0.06rem);
    }
  }
`;
