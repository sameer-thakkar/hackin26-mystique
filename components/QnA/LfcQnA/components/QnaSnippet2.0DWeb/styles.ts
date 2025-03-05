import { styled } from 'styled-components';
import { css } from '@headout/pixie/css';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div`
  width: 100vw;
  padding: 2.625rem 0;
  background: ${COLORS.MISC.LAVENDER};
  position: relative;
`;

export const Heading = styled.div``;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const SwiperWrapper = styled.div`
  margin-top: 1.25rem;
  @media (min-width: 768px) {
    margin-top: 0;
    .swiper-slide {
      padding-top: 1.25rem;
    }
    &:not(.swiper-initialised) {
      .swiper-slide {
        width: 24rem;
        margin-right: 1.25rem;
      }
    }
  }
`;

export const Icon = styled.div`
  position: absolute;
  bottom: -4px;
  right: 0;
`;

export const Copy = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const Navigation = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const SeeAll = styled.u`
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
  color: ${COLORS.GRAY.G2};
  cursor: pointer;
  &:hover {
    color: ${COLORS.BRAND.PURPS};
  }
`;

export const Arrows = styled.div`
  display: flex;
  gap: 8px;
  > svg {
    cursor: pointer;
  }
`;

export const RealTips = css({
  margin: '0',
  marginBottom: '0.0625rem',
});
