import styled, { css } from 'styled-components';
import { Container as FindDirectionContainer } from 'components/common/Itinerary/TimelineView/components/StopCard/components/FindDirection/styles';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const RankContainer = styled.div<{ $isEnd?: boolean }>`
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
  margin: 0;
  ${expandFontToken(FONTS.MISC_OVERLINE_LARGE)}
  color: ${COLORS.GRAY.G2};
  z-index: 1;
`;

export const HeadingContainer = styled.div<{
  $isSubCard?: boolean;
}>`
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  align-items: center;
  position: relative;

  .image-wrap {
    height: 1.25rem;
    width: 2rem;

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
    margin-left: 1.875rem;

    &::after {
      content: '';
      position: absolute;
      height: 0.375rem;
      width: 0.375rem;
      border-radius: 50px;
      background-color: ${COLORS.GRAY.G5};
      left: -1.0625rem;
      transform: translateX(-50%);
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
    `}
`;

export const ClickableContainer = styled.div<{ $isClickable?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'auto')};
  position: relative;
`;
