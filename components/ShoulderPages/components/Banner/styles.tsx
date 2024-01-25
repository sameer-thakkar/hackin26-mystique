import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div`
  margin-top: -1px;
  position: relative;
  z-index: 4;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  color: ${COLORS.GRAY.G2};
  background: linear-gradient(
      180deg,
      rgba(233, 238, 255, 0) 0%,
      rgba(219, 189, 255, 0.5) 100%
    ),
    #fff;

  .banner-img {
    width: 36.5rem;
    height: 18.75rem;
    flex-shrink: 0;
    border-radius: 20px;
    object-fit: cover;

    @media (max-width: 768px) {
      width: 100% !important;
      height: unset;
    }
  }
`;

export const Divider = styled.div`
  width: 60%;
  max-width: 22.8rem;
  height: 1px;
  opacity: 0.3;
  background: linear-gradient(90deg, #b9a1a1 3.83%, #fff7f7 82.38%);
`;

export const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 1rem 10%;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1rem 1.5rem;
  }

  p {
    margin: 0;
  }
  p:first-child {
    color: ${COLORS.GRAY.G3};
    ${expandFontToken(FONTS.MISC_BOOSTER)}
    text-transform: uppercase;
    margin-bottom: 0.2rem;
  }
  p:last-child {
    color: ${COLORS.TEXT.PURPS_3};
    ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)}
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  width: 88.56vw;
  margin: 0 auto;
  max-width: 1200px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  color: ${COLORS.GRAY.G2};

  @media (max-width: 768px) {
    width: calc(100vw - 2.5rem);
    padding: 1rem 0 1.5rem;
  }
`;

export const TextContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  min-width: 40%;
  max-width: 50%;

  @media (max-width: 768px) {
    max-width: 100%;
  }

  h1 {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
    margin: 0;

    @media (max-width: 768px) {
      font-size: 28px;
      line-height: 36px;
    }
  }

  p {
    ${expandFontToken(FONTS.PARAGRAPH_LARGE)}
    margin: 0;

    @media (max-width: 768px) {
      font-size: 15px;
    }
  }
`;
