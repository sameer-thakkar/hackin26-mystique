import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div`
  padding: 1rem;
  border: 1px solid ${COLORS.GRAY.G7};
  /* height: 17.62rem; */
  border-radius: 8px;

  h4 {
    ${expandFontToken(FONTS.HEADING_REGULAR)};
    color: ${COLORS.GRAY.G2};
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .show-all-reviews {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    ${expandFontToken(FONTS.BUTTON_SMALL)};
    border-radius: 4px;
    background: ${COLORS.PURPS.LIGHT_TONE_4};
    border: 0;
    margin-top: 1rem;
    padding: 0.5rem 0;
    color: ${COLORS.BRAND.PURPS};
  }
  @media (max-width: 768px) {
    height: auto;
    width: auto;
    padding: 1rem;
    h4 {
      ${expandFontToken(FONTS.HEADING_SMALL)};
    }
  }
`;

export const Separator = styled.div`
  border-top: 1px solid ${COLORS.GRAY.G7};
  margin-top: 0.5rem;
`;

export const ReviewContentWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-start;
  gap: 1rem;

  .review-image {
    width: auto;
    height: 10.8125rem;
    border-radius: 8px;
    background-color: ${COLORS.GRAY.G7};
    img {
      height: 100%;
      width: 6.75rem;
      border-radius: 8px;
      object-fit: cover;
    }
  }
`;

export const Review = styled.div`
  .formatted-time {
    color: ${COLORS.GRAY.G3};
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    margin-top: 0.5rem;
  }
  .content {
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
    color: ${COLORS.GRAY.G2};
    display: -webkit-box;
    -webkit-line-clamp: 5;
    line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media (max-width: 768px) {
    .content {
      hyphens: auto;
      display: -webkit-box;
      ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
      -webkit-line-clamp: 4;
      line-clamp: 4;
      text-align-last: justify;
      hyphens: auto;
      overflow-x: hidden;
    }
  }
`;

export const ReviewHeader = styled.div`
  display: flex;
  gap: 0.625rem;
  justify-content: flex-start;
  width: 100%;
`;

export const ImageWrapper = styled.div`
  flex-basis: 2.1875rem;
  background-color: ${COLORS.GRAY.G7};
  border-radius: 50%;
  height: 35px;
  width: 35px;
  svg {
    height: 2.25rem;
    width: 2.25rem;
  }
`;

export const MetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  h5 {
    color: ${COLORS.GRAY.G3};
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
    line-height: 1.2;
  }
  && {
    svg {
      height: 0.875rem;
      width: 0.875rem;
    }
  }
`;

export const ReviewStarsWrapper = styled.div`
  display: flex;
  gap: 0.1875rem;
  svg,
  path {
    height: 1rem;
    width: 1rem;
    fill: ${COLORS.BRAND.CANDY};
  }
`;

export const noBackgroundCss = css`
  svg path {
    fill: none;
  }
`;

export const Icon = styled.div<{
  noBackground: boolean;
}>`
  ${({ noBackground }) => (noBackground ? noBackgroundCss : '')}
`;

export const Gradient = styled.div`
  position: absolute;
  border-radius: 384px;
  background: radial-gradient(
    50% 50% at 50% 50%,
    rgba(0, 0, 0, 0.12) 0%,
    rgba(0, 0, 0, 0.03) 100%
  );
  filter: blur(15.5px);
  width: 100%;
  height: 84px;
  border-radius: 8px;
  z-index: 9;
  bottom: 0;
`;
