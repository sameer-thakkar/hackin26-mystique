import styled, { css } from 'styled-components';
import { Container as FindDirectionContainer } from 'components/common/Itinerary/TimelineView/components/StopCard/components/FindDirection/styles';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const RankContainer = styled.div<{
  $isEnd?: boolean;
  $isActive?: boolean;
  $variant?: TimelineViewComponentVariant;
}>`
  left: 0;
  top: 0.2rem;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 4px;
  background-color: ${({ $isEnd }) =>
    $isEnd ? COLORS.TEXT.CANDY_1 : COLORS.BRAND.PURPS};
  z-index: 1;

  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;

  svg {
    path {
      stroke: ${COLORS.BRAND.WHITE};
    }
  }

  p {
    ${expandFontToken(FONTS.SUBHEADING_LARGE)}
    text-anchor: middle;
    color: ${COLORS.BRAND.WHITE};
    transform: translateY(-1px);
    position: relative;
    margin: 0 !important;

    ${({ $isEnd }) =>
      $isEnd &&
      css`
        transform: translateY(0);
        height: 1rem;
        width: 1rem;
        color: ${COLORS.TEXT.CANDY_1};

        ::after {
          content: '';
          position: absolute;
          height: 1rem;
          width: 1rem;
          border-radius: 50px;
          background-color: ${COLORS.BRAND.WHITE};
          left: 0;
          top: 0;
        }
      `}
  }

  ${({ $variant, $isEnd }) =>
    $variant === TimelineViewComponentVariant.REDUCED_WIDTH &&
    css`
      left: 0.1rem;
      top: 0.3rem;
      height: 1.25rem;
      width: 1.25rem;
      border-radius: 4px;

      p {
        ${expandFontToken(FONTS.SUBHEADING_SMALL)};

        ${$isEnd &&
        css`
          height: 0.625rem;
          width: 0.625rem;

          ::after {
            height: 0.625rem;
            width: 0.625rem;
          }
        `}
      }

      @media only screen and (min-width: 768px), print {
        border-radius: 2px;
        top: 0.2rem;
      }
    `}

  ${({ $isActive, $variant }) =>
    $isActive &&
    $variant === TimelineViewComponentVariant.REDUCED_WIDTH &&
    css`
      box-shadow: 0 0 0 4px rgba(136, 0, 255, 0.2);
    `};

  @media only screen and (min-width: 768px), print {
    ${({ $variant }) =>
      $variant === TimelineViewComponentVariant.REDUCED_WIDTH &&
      css`
        height: 1rem;
        width: 1rem;
        left: 0.25rem;
        top: 0.4rem;
      `}
  }
`;

export const ToggleContainer = styled.div`
  position: absolute;
  top: 0.375rem;
  right: 0.375rem;
  height: 1.25rem;
  width: 1.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;

  svg {
    path {
      stroke: ${COLORS.GRAY.G2};
    }
  }
`;

export const TitleContainer = styled.h5`
  ${expandFontToken(FONTS.MISC_OVERLINE_LARGE)}
  color: ${COLORS.GRAY.G2};
  z-index: 1;
  margin: 0 0 -0.5rem;
`;

export const HeadingContainer = styled.div<{
  $isSubCard?: boolean;
  $variant?: TimelineViewComponentVariant;
}>`
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  align-items: center;
  position: relative;

  .image-wrap {
    display: flex;
    height: ${({ $variant }) =>
      $variant === TimelineViewComponentVariant.REDUCED_WIDTH
        ? '1rem'
        : '1.25rem'};
    width: ${({ $variant }) =>
      $variant === TimelineViewComponentVariant.REDUCED_WIDTH
        ? '1.5rem'
        : '1.25rem'};
    img {
      border-radius: 2px;
    }
  }

  .stop-name {
    ${({ $isSubCard }) =>
      expandFontToken(
        $isSubCard ? FONTS.UI_LABEL_MEDIUM_HEAVY : FONTS.HEADING_SMALL
      )};
    color: ${COLORS.GRAY.G2};
  }

  ${FindDirectionContainer} {
    margin-left: 1rem;

    &::after {
      content: '';
      position: absolute;
      height: 0.375rem;
      width: 0.375rem;
      border-radius: 50px;
      background-color: ${COLORS.GRAY.G5};
      left: -0.625rem;
      transform: translate(-50%, 10%);
    }
  }

  ${({ $variant }) =>
    $variant === TimelineViewComponentVariant.REDUCED_WIDTH &&
    css`
      justify-content: space-between;

      .stop-title {
        ${expandFontToken(FONTS.MISC_OVERLINE_LARGE)};
        letter-spacing: 0.8px;
        color: ${COLORS.GRAY.G2};
        margin: 0 !important;
      }

      .stop-heading-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .stop-name-container {
        display: flex;
        gap: 0.375rem;
        align-items: center;
      }

      .stop-name {
        ${expandFontToken(FONTS.HEADING_SMALL)};
        margin: 0 !important;
      }

      .stop-subtext {
        ${expandFontToken(FONTS.UI_LABEL_SMALL)};
        color: ${COLORS.GRAY.G3};
      }

      .toggle-icon-container {
        display: flex;
        justify-content: center;
        align-items: center;

        svg {
          path {
            stroke: ${COLORS.GRAY.G2};
          }
        }
      }
    `};

  @media only screen and (min-width: 768px), print {
    ${({ $variant }) =>
      $variant === TimelineViewComponentVariant.REDUCED_WIDTH &&
      css`
        .stop-title {
          ${expandFontToken(FONTS.MISC_OVERLINE)};
        }

        .stop-name {
          ${expandFontToken(FONTS.HEADING_XS)};
        }
      `}

    .image-wrap {
      height: 1.25rem;
      width: 2rem;
    }
  }
`;

export const Description = styled.div<{
  $isOpen?: boolean;
  $isSubCard?: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.375rem;
  width: 100%;

  .description-text {
    color: ${COLORS.GRAY.G2};
    z-index: 1;

    p {
      display: -webkit-box;
      -webkit-line-clamp: ${({ $isOpen }) => ($isOpen ? 7 : 1)};
      -webkit-box-orient: vertical;
      overflow: hidden;
      ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
      color: ${COLORS.GRAY.G3};
      transition: color 0.3s;
    }
  }

  .description-read-more {
    background: none;
    border: none;
    outline: none;
    padding: 0;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    text-decoration: underline;
    color: ${COLORS.GRAY.G2};
    transition: opacity 0.3s;
    cursor: pointer;

    visibility: visible;
    opacity: 1;
    z-index: 1;
  }

  .stop-cta {
    background: none;
    border: none;
    outline: none;
    padding: 0;

    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
    text-decoration: underline;
    color: ${COLORS.GRAY.G2};
    transition: opacity 0.3s;
    margin-top: 0.625rem;
    cursor: pointer;

    flex-direction: row;
    align-items: center;
    text-anchor: middle;

    visibility: visible;
    opacity: 1;
    display: flex;
    z-index: 1;

    svg {
      margin-left: 0.5rem;
      height: 0.75rem;
      width: 0.75rem;

      path {
        stroke: ${COLORS.GRAY.G2};
      }
    }
  }
`;

export const DescriptionContainer = styled.div<{
  $isSubCard?: boolean;
  $isOpen?: boolean;
  $hasImage?: boolean;
}>`
  display: flex;
  transition: height 0.3s;
  position: relative;
  overflow: hidden;
  flex-direction: row;
  justify-content: flex-start;
  height: auto;
  gap: 1rem;
  padding: 0;
  ${({ $isOpen, $hasImage }) =>
    $isOpen &&
    $hasImage &&
    css`
      margin-top: 0.5rem;
    `}

  .image-wrap {
    min-width: 14.25rem;
    max-width: 14.25rem;
    aspect-ratio: 16/10;
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};

    img {
      border-radius: 4px;
    }
  }

  .sub-image-loader {
    width: 14.25rem;
    height: 8.9375rem;
    border-radius: 4px;
    transform: translateY(-0.3125rem);
    position: absolute;
  }

  display: ${({ $isSubCard, $isOpen }) =>
    ($isSubCard ? $isOpen : true) ? 'flex' : 'none'};
`;

export const SubStopsHeading = styled.h5`
  ${expandFontToken(FONTS.SUBHEADING_LARGE)}
  color: ${COLORS.GRAY.G2};
  margin: 0 0 0.5rem;
  padding-left: 1.25rem;
`;

export const SubCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const Container = styled.div<{
  $isSubCard?: boolean;
  $isStart?: boolean;
  $isEnd?: boolean;
  $variant?: TimelineViewComponentVariant;
}>`
  position: relative;
  cursor: default;
  padding: 0.1875rem 0.5rem 1.25rem 2.25rem;
  transition: all 0.3s;

  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &::before {
    content: '';
    position: absolute;
    --top-offset: ${({ $isStart }) => ($isStart ? 1.2 : 0)}rem;
    height: calc(100% - var(--top-offset));
    width: 2px;
    top: var(--top-offset);
    left: 0.75rem;
    transform: translateX(-50%);
    background: ${COLORS.BRAND.PURPS};

    ${({ $isEnd }) =>
      $isEnd &&
      css`
        top: 0;
        height: 1.2rem;
      `}
  }

  ${({ $isSubCard }) =>
    $isSubCard &&
    css`
      padding: 0.625rem 0.5rem 0.625rem 0;

      &::before {
        display: none;
      }

      ${ToggleContainer} {
        top: 0;
        right: -0.1875rem;
      }

      ${DescriptionContainer} {
        .sub-card-image {
          min-width: 14.25rem;
          max-width: 14.25rem;
          aspect-ratio: 16 / 10;
          height: auto;

          img {
            border-radius: 0.5rem;
          }
        }

        &::after {
          display: none;
        }
      }
    `};

  ${({ $variant }) =>
    $variant === TimelineViewComponentVariant.REDUCED_WIDTH &&
    css`
      padding: 0.1875rem 0.5rem 1.25rem 2.5rem;
    `};

  @media only screen and (min-width: 768px), print {
    ${({ $variant }) =>
      $variant === TimelineViewComponentVariant.REDUCED_WIDTH &&
      css`
        padding: 0.1875rem 0.5rem 1.25rem 1.75rem;
        gap: 1rem;
      `};
  }
`;

export const ContentContainer = styled.div<{
  $variant?: TimelineViewComponentVariant;
}>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;

  ${({ $variant }) =>
    $variant === TimelineViewComponentVariant.REDUCED_WIDTH &&
    css`
      gap: 1rem;

      &:hover {
        cursor: pointer;
      }
    `}
`;

export const ClickableContainer = styled.div<{ $isClickable?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'auto')};
  position: relative;
`;

export const SubStopsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
