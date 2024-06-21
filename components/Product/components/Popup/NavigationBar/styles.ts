import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const NavigationParent = styled.div<{ $isVisible?: boolean }>`
  position: absolute;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
  width: 100%;
  top: 0;
  z-index: 100;
  height: 4rem;
  width: 49.5rem;
  overflow: hidden;
  touch-action: none;
  pointer-events: none;
`;

export const ButtonGradient = styled.div<{ $isLeft?: boolean }>`
  background: linear-gradient(to left, white 0%, transparent 75%);
  height: 2rem;
  width: 4rem;
  top: 50%;
  right: 3rem;
  transform: translateY(-50%);
  position: absolute;
  z-index: 1;

  ${({ $isLeft }) =>
    $isLeft &&
    css`
      background: linear-gradient(to right, white 0%, transparent 75%);
      right: auto;
      left: 0.75rem;
    `}
`;

export const NavigationContainer = styled.div<{ $isVisible?: boolean }>`
  background-color: white;
  width: 48rem;
  position: relative;
  padding: 0.75rem;
  transition: top 0.5s cubic-bezier(0.7, 0, 0.3, 1);
  top: ${({ $isVisible }) => ($isVisible ? 0 : '-100%')};
  box-shadow: 0px 2px 8px 0px #0000001a;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.25rem;
  touch-action: auto;
  pointer-events: all;

  .swiper {
    width: 45rem;
    margin: 0;

    .swiper-slide {
      width: auto;
    }
  }

  .descriptors-carousel-controls {
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
      left: 0.5rem;
    }

    &.next {
      right: 3rem;
    }
  }
`;

export const NavigationLink = styled.div<{ $isSelected?: boolean }>`
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  ${expandFontToken(FONTS.SUBHEADING_REGULAR)}
  color: ${COLORS.GRAY.G3};

  transition: all 0.3s;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: max-content;

  .new-tag {
    padding: 0.125rem 0.375rem 0.1875rem;
    border-radius: 0.25rem;
    background: linear-gradient(180deg, ${COLORS.BRAND.CANDY} 0%, #d8096d 100%);
    ${expandFontToken(FONTS.MISC_OVERLINE)};
    color: ${COLORS.BRAND.WHITE};
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin: auto;
  }

  ${({ $isSelected }) =>
    $isSelected
      ? css`
          color: ${COLORS.BRAND.CANDY};
          background: #fff2f8;
        `
      : css`
          &:hover {
            color: ${COLORS.GRAY.G2};
          }
        `}
`;
