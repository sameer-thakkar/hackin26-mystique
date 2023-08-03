import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const TitleWrapper = styled.h2``;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  #title {
    margin: 0.625rem 0.625rem 0.5rem 0.625rem;
    ${expandFontToken(FONTS.HEADING_XS)};
    color: ${COLORS.GRAY.G1};
  }

  @media (max-width: 768px) {
    #title {
      margin-left: 0.5rem;
    }
  }
`;

export const CategoryTagsWrapper = styled.div`
  background: ${COLORS.GRAY.G7};
  border-radius: 12px;
  width: fit-content;
  margin-left: 0.625rem;
`;

export const CategoryTagWrapper = styled.div`
  padding: 0.25rem 0.5rem;
  color: ${COLORS.GRAY.G2};
  ${expandFontToken(FONTS.MISC_BADGE_SMALL)};
`;

export const RichTextWrapper = styled.div<{
  overflow: boolean;
}>`
  margin: 0.5rem 0.625rem 0.625rem;
  word-wrap: break-word;
  position: relative;
  flex: 1;

  ${({ overflow }) =>
    overflow &&
    `
    overflow: hidden; 
    max-height: 6.25rem;
    `};

  h3,
  h2,
  h1,
  p {
    margin: 0 !important;
    width: 100%;
    ${expandFontToken(FONTS.PARAGRAPH_SMALL)};
    font-family: halyard-text, sans-serif !important;
    font-weight: 300 !important;
    font-size: 12px !important;
    line-height: 20px !important;
    color: ${COLORS.GRAY.G2} !important;
  }

  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
  }
`;

export const GradientWrapper = styled.div`
  position: absolute;
  bottom: 0%;
  height: 30%;
  z-index: 1;
  width: 100%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.47) 0%,
    rgba(255, 255, 255, 0.84) 48.64%,
    #fff 84.29%
  );
`;
