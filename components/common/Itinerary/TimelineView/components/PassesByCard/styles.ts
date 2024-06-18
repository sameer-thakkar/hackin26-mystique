import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Heading = styled.h4`
  ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)}
  color: ${COLORS.BRAND.CANDY};
  margin: 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    height: 0.75rem;
    width: 0.75rem;
    top: 50%;
    left: -1.125rem;
    transform: translate(-100%, -35%);
    border-radius: 100px;
    background: ${COLORS.BRAND.PURPS};
  }
`;

export const SubCardContainer = styled.div<{ $isOpen?: boolean }>`
  transition: background-color 0.3s;
  border-radius: 8px;

  padding: ${({ $isOpen }) => ($isOpen ? '0.5rem 0' : '0.5rem')};
  ${({ $isOpen }) =>
    !$isOpen &&
    css`
      width: max-content;
      transform: translateX(-0.5rem);
    `}
`;

export const SubCardHeadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.4375rem;

  .image-wrap {
    width: 2rem;
    height: 1.25rem;

    img {
      border-radius: 4px;
    }
  }

  .sub-section-heading {
    ${expandFontToken(FONTS.SUBHEADING_REGULAR)}
    color: ${COLORS.BRAND.PURPS};
    margin-top: 0.25rem;
  }

  p.passing-by-sub-card-title {
    ${expandFontToken(FONTS.UI_LABEL_LARGE)}
    transition: color .3s;
  }

  svg {
    transition: transform 0.3s;
    path {
      transition: stroke 0.3s;
      stroke: ${COLORS.GRAY.G2};
    }
  }

  &:hover {
    p.passing-by-sub-card-title {
      color: ${COLORS.GRAY.G1};
    }

    svg.arrow-link {
      transform: rotate(-45deg);
      path {
        stroke: ${COLORS.GRAY.G1};
      }
    }
  }
`;

export const SubCardContentTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  h5.sub-card-name {
    ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)}
    margin: 0;
  }

  .sub-card-description p {
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)}
    color: ${COLORS.GRAY.G3};

    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const SubCardContentContainer = styled.div<{ $hasImage?: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-top: 1rem;

  .passing-by-sub-card-content-child {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .passing-by-sub-card-content-image-section {
    .image-wrap {
      width: 16rem;
      height: 10rem;

      img {
        border-radius: 8px;
      }
    }
  }

  .passing-by-sub-card-content-text-section {
    max-width: ${({ $hasImage }) => ($hasImage ? '23.3125rem' : 'max-content')};
  }
`;

export const Cta = styled.a`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: max-content;

  color: ${COLORS.TEXT.PURPS_3};
  ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
  text-anchor: middle;
  transition: color 0.3s;

  svg {
    height: 0.75rem;
    width: 0.75rem;
    transform: translateY(1px);
    transition: all 0.3s;

    path {
      stroke: ${COLORS.TEXT.PURPS_3};
    }
  }

  &:hover {
    color: ${COLORS.PURPS.DARK_TONE};

    svg {
      transform: rotate(-45deg);

      path {
        stroke: ${COLORS.PURPS.DARK_TONE};
      }
    }
  }
`;

export const Container = styled.div`
  position: relative;
  padding: 0.1875rem 0.5rem 1.25rem 2.25rem;
  transition: all 0.3s;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 0.125rem;
    top: 0;
    left: 0.75rem;
    transform: translateX(-50%);
    background: ${COLORS.BRAND.PURPS};
  }
`;
