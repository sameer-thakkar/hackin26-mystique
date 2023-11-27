import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { LANDSCAPE, LANDSCAPE_MWEB } from 'const/index';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const HeadingSection = styled.div`
  margin: auto;
  width: calc(100% - (5.46vw * 2));
  max-width: ${SIZES.MAX_WIDTH};
  padding-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  h2 {
    ${expandFontToken(FONTS.HEADING_LARGE)}
    flex: 60%;
    margin: 0;
  }
  a {
    ${expandFontToken(FONTS.BUTTON_SMALL)}
    text-decoration-line: underline;
    color: ${COLORS.GRAY.G2};
  }
  @media (max-width: 768px) {
    margin-top: 3rem;
    padding-bottom: 1rem;
    align-items: flex-start;

    h2 {
      ${expandFontToken(FONTS.HEADING_REGULAR)}
    }
    a {
      color: ${COLORS.GRAY.G3};
      text-decoration: none;
      text-align: center;
      border: 1px solid ${COLORS.GRAY.G4};
      border-radius: 4px;
      padding: 0.5rem 0.75rem;
      margin-top: 0.25rem;
    }
  }
`;

export const CarouselContainer = styled.div`
  position: relative;
  height: 25.625rem;
  display: flex;
  align-items: end;
  margin-bottom: 4rem;
  background-image: url(${LANDSCAPE});
  background-repeat: repeat-x;
  background-position: bottom;

  .hoho-bus {
    top: 10.5rem;
    animation: bounce 1s infinite;
  }

  @keyframes bounce {
    0% {
      top: 10.5rem;
    }
    50% {
      top: 10.25rem;
    }
    100% {
      top: 10.5rem;
    }
  }

  @media (max-width: 768px) {
    height: 17.813rem;
    background-image: url(${LANDSCAPE_MWEB});

    .hoho-bus {
      height: 4.063rem;
      width: 8rem;
      left: 1.563rem;
    }

    @keyframes bounce {
      0% {
        top: 0;
      }
      50% {
        top: -1px;
      }
      100% {
        top: 0;
      }
    }
  }
`;

export const SwiperWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  margin: auto;
  position: absolute;
  top: 0;

  .swiper-wrapper {
    transition-timing-function: linear;
  }
  .swiper-slide {
    width: auto;
  }

  @media (max-width: 768px) {
    bottom: 4.813rem;
  }
`;

export const StyledSlide = styled.div`
  width: 11.625rem;
  background: ${COLORS.BRAND.WHITE};
  display: flex;
  padding: 0.75rem 0.75rem 1rem;
  margin: 0.25rem 0 1.5rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  border-radius: 12px;
  background: ${COLORS.BRAND.WHITE};
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1),
    0px 0px 1px 0px rgba(0, 0, 0, 0.1);

  .attraction-name {
    ${expandFontToken(FONTS.HEADING_SMALL)}
  }

  .image-wrap {
    width: 11.625rem;
    height: 12.188rem;
  }

  img {
    border-radius: 12px;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 9.125rem;
    gap: 0.313rem;
    padding: 0.375rem 0.313rem 0.75rem;
    border-radius: 0.5rem;
    margin: 0 0 0.5rem;

    .image-wrap {
      width: 9.125rem;
      height: 9.313rem;
    }

    img {
      border-radius: 0.5rem;
    }

    .attraction-name {
      ${expandFontToken(FONTS.SUBHEADING_SMALL)}
    }
  }
`;
