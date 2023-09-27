import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const Container = styled.div`
  height: 18rem;
  position: relative;
  @media (min-width: 768px) {
    height: 33rem;
    overflow: hidden;
  }

  .gradient-wrapper {
    background: linear-gradient(180deg, rgba(10, 9, 11, 0) 0%, #060607 90.92%);
    position: absolute;
    bottom: -0.1rem;
    height: 15.62rem;
    width: 100%;
  }

  video {
    z-index: -1;
    position: relative;
  }
  img {
    z-index: -1;
  }
`;

export const TitleWrapper = styled.h1`
  position: absolute;
  inset: 8rem 0 0;
  width: calc(100% - (5.46vw * 2));
  max-width: ${SIZES.MAX_WIDTH};
  margin: auto;
  z-index: 1;

  .promo-text-wrapper {
    color: ${COLORS.GRAY.G8};
    ${expandFontToken(FONTS.DISPLAY_SMALL)};
  }
  .city-wrapper {
    color: ${COLORS.GRAY.G8};
    font-family: 'halyard-display';
    font-style: normal;
    font-weight: 600;
    font-size: 90px;
    line-height: 84px;
    margin-left: -0.1rem;
    letter-spacing: 2px;
    text-shadow: 0px 4px 22px rgba(0, 0, 0, 0.2), 0px 1px 4px rgba(0, 0, 0, 0.1);
  }
  .country-wrapper {
    color: ${COLORS.GRAY.G8};
    font-family: 'halyard-display';
    font-weight: 600;
    font-size: 40px;
    line-height: 55px;
    letter-spacing: 0.4px;
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    left: -0.5rem;
    top: unset;
    bottom: 1.8rem;
    .promo-text-wrapper {
      ${expandFontToken(FONTS.HEADING_REGULAR)};
    }
    .city-wrapper {
      font-weight: 700;
      font-size: 40px;
      line-height: 36px;
      letter-spacing: 0.4px;
    }
    .country-wrapper {
      font-size: 24px;
      line-height: 33px;
    }
  }
`;
