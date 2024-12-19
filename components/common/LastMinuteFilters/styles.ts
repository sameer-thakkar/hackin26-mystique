import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Heading = styled.h2`
  ${expandFontToken(FONTS.HEADING_REGULAR)}
  margin: 0 1.5rem 0.3rem;
`;

export const Counter = styled.div`
  background-color: ${COLORS.BRAND.PURPS};
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 2rem;
  height: var(--counter-size);
  width: var(--counter-size);
  transition: all 0.3s;

  .counter-text {
    ${expandFontToken(FONTS.MISC_OVERLINE)}
    letter-spacing: 0;
    text-align: center;
    color: white;
  }
`;

export const FilterButton = styled.div<{ isSelected: boolean }>`
  background: ${({ isSelected }) =>
    isSelected ? COLORS.PURPS.LIGHT_TONE_4 : COLORS.BRAND.WHITE};
  border: 1px solid
    ${({ isSelected }) => (isSelected ? COLORS.PURPS.LEVEL_3 : COLORS.GRAY.G6)};
  border-radius: 1.5rem;
  padding: 0.5rem 0.75rem;
  flex: 0 0 auto;

  display: flex;
  flex-direction: row;
  min-width: max-content;
  align-items: center;

  span {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
    min-width: max-content;
    color: ${({ isSelected }) =>
      isSelected ? COLORS.PURPS.LEVEL_3 : COLORS.GRAY.G2};
    transform: translateY(-1px);
  }

  ${Counter} {
    --counter-size: ${({ isSelected }) => (isSelected ? 1 : 0)}rem;
    opacity: ${({ isSelected }) => (isSelected ? 1 : 0)};
    margin-left: ${({ isSelected }) => (isSelected ? 0.25 : 0)}rem;
  }

  svg {
    stroke: ${COLORS.PURPS.LEVEL_3};
    margin-left: 0.375rem;
    transition: all 0.3s;

    &.cross {
      height: 0.541875rem;
      width: 0.541875rem;

      stroke-width: 0.25rem;
    }

    &.chevron {
      height: 0.625rem;
      width: 0.625rem;
      stroke-width: 0.125rem;

      ${({ isSelected }) =>
        isSelected &&
        css`
          margin-left: 0.25rem;
        `}

      path {
        stroke: ${({ isSelected }) =>
          isSelected ? COLORS.PURPS.LEVEL_3 : COLORS.GRAY.G2};
      }
    }

    &.ticket {
      height: 0.75rem;
      width: 0.75rem;
      stroke-width: 0.09375rem;
      margin-left: 0;
      margin-right: 0.25rem;

      path {
        stroke: ${({ isSelected }) =>
          isSelected ? COLORS.PURPS.LEVEL_3 : COLORS.GRAY.G2};
      }
    }

    ${({ isSelected }) =>
      !isSelected &&
      css`
        &.cross {
          transform: scale(0);
          opacity: 0;
          visibility: hidden;
          width: 0;
          margin-left: 0;
        }
      `};
  }
`;

export const FiltersContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0 1.5rem;
  font-size: 14px;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const FiltersWrapper = styled.div`
  padding: 1.5rem 0 1.25rem 0;
  margin-bottom: 1rem;
  background: white;
  position: sticky;
  top: -25px;
  z-index: 10;
  &.sticky {
    box-shadow: 0px 4px 8px 0px #0000001f;
  }
`;

export const Footer = styled.div`
  padding: 1rem 1.5rem;
  box-shadow: 0px -2px 12px rgba(84, 84, 84, 0.1);
`;

export const drawerStyles = css`
  .no-availability__drawer {
    height: auto;
    & > div:first-child {
      margin-left: 1.25rem;
      margin-right: 1.25rem;
    }
  }
  .close-icon {
    display: none;
  }
`;

export const DrawerBody = styled.div`
  margin: 1.25rem;
  margin-top: 0;
  margin-bottom: 2.5rem;
  font-size: 15px;
  font-weight: 300;
`;

export const SkeletonWrapper = styled.div`
  margin: 1rem 1.5rem;
  display: flex;
`;
