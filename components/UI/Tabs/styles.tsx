import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledTabsContainer = styled.div<{
  $markerLeft: string;
  $markerWidth: string;
  $showLeftArrow?: boolean;
  $showRightArrow?: boolean;
}>`
  display: flex;
  flex-direction: column;
  overflow-x: visible;
  min-width: 0;

  &::-webkit-scrollbar {
    display: none;
  }

  .swiper {
    margin: 0;
  }

  .swiper-slide {
    flex-shrink: unset;

    &:last-child {
      margin-right: 10.625rem;
    }
  }

  .swiper-wrapper {
    position: relative;

    &:before {
      content: ' ';
      position: absolute;
      bottom: 0;
      left: ${({ $markerLeft }) => $markerLeft};
      width: ${({ $markerWidth }) => $markerWidth};
      height: 1px;
      background: ${COLORS.GRAY.G2};
      transition: all 0.2s linear;
    }
  }

  .tab-swiper {
    &-wrapper {
      margin-bottom: -1px;
    }

    &-controls {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${COLORS.BRAND.WHITE};
      border-radius: 50%;
      height: 1.5rem;
      width: 1.5rem;
      border: none;
      outline: none;
      cursor: pointer;
      filter: drop-shadow(0px 1.333px 5.333px rgba(0, 0, 0, 0.1))
        drop-shadow(0px 0px 0.667px rgba(0, 0, 0, 0.1));

      svg {
        height: 0.6875rem;
        width: 0.6875rem;
      }

      &.prev {
        left: -12px;
      }

      &.next {
        right: -12px;
      }
    }
  }

  .tab-list {
    &-container {
      display: flex;
      width: 100%;
      position: relative;
      border-bottom: 1px solid ${COLORS.GRAY.G6};
    }

    &-gradient {
      height: 100%;
      width: 3.75rem;
      position: absolute;
      z-index: 2;
      margin: 0;
      outline: none;
      border: none;
      cursor: pointer;

      &.prev {
        left: 0;
        background: linear-gradient(
          90deg,
          ${COLORS.BRAND.WHITE} 25%,
          rgba(255, 255, 255, 0) 100%
        );
        display: ${({ $showLeftArrow }) => ($showLeftArrow ? 'block' : 'none')};
      }

      &.next {
        right: 0;
        background: linear-gradient(
          270deg,
          ${COLORS.BRAND.WHITE} 25%,
          rgba(255, 255, 255, 0) 100%
        );
        display: ${({ $showRightArrow }) =>
          $showRightArrow ? 'block' : 'none'};
      }
    }

    &-item {
      display: flex;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      margin-right: 1.5rem;
      max-width: 15rem;

      &-title {
        ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
        color: ${COLORS.GRAY.G2};
        margin: 0;
        padding: 0.5rem 0 0.4375rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
`;
