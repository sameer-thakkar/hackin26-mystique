import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div`
  width: calc(100vw - (5.46vw * 2));
  .swiper {
    margin-left: 0;
    .avg-rating {
      transform: translateY(-1px);
    }
  }
  @media (min-width: 768px) {
    width: 100%;
    .swiper {
      width: 100%;
    }
  }
`;

export const SwiperWrapper = styled.div`
  box-sizing: border-box;
  margin-bottom: 2rem;

  > .swiper {
    width: calc(100% - (5.46vw * 2));
    height: 100%;
    max-width: 1200px;

    @media (max-width: 768px) {
      width: 100vw;
      margin-left: -1rem;
      padding-left: 1rem;
      padding-right: 1rem;
      box-sizing: border-box;
    }

    > .swiper-wrapper {
      height: max-content;
      width: 100%;
      transition-timing-function: linear;
      align-items: stretch;
      margin-left: 0;

      > .swiper-slide {
        height: auto;
        -webkit-transform: translateZ(0);
        -webkit-backface-visibility: hidden;

        @media (max-width: 768px) {
          :last-child {
            padding-right: 4rem;
          }
        }
      }
    }
  }
  @media (min-width: 768px) {
    > .swiper {
      width: 100%;
    }
  }
  @media (max-width: 768px) {
    width: calc(100vw - (5.46vw));
    padding: 0;
  }
`;

export const Navigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  max-width: 1200px;
  padding-bottom: 1.5rem;

  @media (max-width: 768px) {
    width: calc(100% - (5.46vw * 2));
    align-items: end;
    width: 100%;
    box-sizing: border-box;
    padding-right: 1.5rem;
  }
  @media (min-width: 768px) {
    width: 100%;
  }

  u {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    cursor: pointer;
  }

  a {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
    color: ${COLORS.BRAND.PURPS};
    text-decoration: underline;
  }
`;
