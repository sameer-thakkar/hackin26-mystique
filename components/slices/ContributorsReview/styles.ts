import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div`
  p {
    margin: 0;
    ${expandFontToken(FONTS.PARAGRAPH_LARGE)};
    color: ${COLORS.GRAY.G2};
    @media (max-width: 768px) {
      ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}
    }
  }
`;
export const Heading = styled.h2`
  && {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
    margin-bottom: 2rem;
    @media (max-width: 768px) {
      margin-bottom: 1.5rem;
      ${expandFontToken(FONTS.HEADING_LARGE)}
    }
  }
`;

export const ReviewWrapper = styled.div`
  position: relative;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${COLORS.PURPS.LIGHT_TONE_2};
  && {
    a {
      display: inline-block;
      width: fit-content;
      margin-top: 0.5rem;
      color: ${COLORS.BRAND.CANDY};
    }
    a:hover {
      color: ${COLORS.TEXT.CANDY_1};
    }
  }
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Separator = styled.div`
  margin: 1rem 0;
  width: 100%;
  border-top: 1px solid;
  border-image: linear-gradient(
    90deg,
    rgba(128, 0, 255, 0.23) 0%,
    rgba(255, 255, 255, 0) 89.56%
  );
  border-image-slice: 1;
`;

export const Author = styled.div`
  display: flex;
  gap: 0.5rem;
  .image-wrap {
    width: auto;
  }
  @media (max-width: 768px) {
    img {
      width: 2rem;
      height: 2rem;
    }
  }
`;

export const AuthorMetaInfo = styled.div``;

export const AuthorName = styled.p`
  && {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
    @media (max-width: 768px) {
      ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
      line-height: 1;
    }
  }
`;

export const Date = styled.time`
  ${expandFontToken(FONTS.UI_LABEL_REGULAR)};

  color: ${COLORS.GRAY.G4};
  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  }
`;

export const TopLeftSvg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: -27px;
  top: -27px;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: ${COLORS.BRAND.WHITE};
  @media (max-width: 768px) {
    width: 2.25rem;
    height: 2.25rem;
    left: -16px;
    top: -16px;
    svg {
      width: 1.1875rem;
      height: 1.0625rem;
      transform: rotate(16deg);
    }
  }
`;

export const BottomRightSvg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: -27px;
  right: -27px;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: ${COLORS.BRAND.WHITE};
  svg {
    transform: rotate(180deg);
  }
  @media (max-width: 768px) {
    width: 2.25rem;
    height: 2.25rem;
    bottom: -16px;
    right: -16px;
    svg {
      width: 1.1875rem;
      height: 1.0625rem;
      transform: rotate(196deg);
    }
  }
`;
