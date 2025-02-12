import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div<{
  hasScrolled: boolean;
  $isMonthOnMonthPage: boolean;
  $hasBannerImage: boolean;
}>`
  position: relative;
  z-index: ${({ hasScrolled }) => (hasScrolled ? 0 : 16)};
  background: ${COLORS.LTT_BANNER_BACKGROUND_COLOR};
  h1 {
    ${expandFontToken(FONTS.DISPLAY_LARGE)};
    margin: 0;
    display: -webkit-box;
    overflow: hidden;
    color: ${COLORS.BRAND.WHITE};
    background-clip: text;
    max-width: 36.75rem;
    line-height: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  @media (max-width: 768px) {
    z-index: 0;
    background: linear-gradient(180deg, #190130, #382057);
    h1 {
      ${expandFontToken(FONTS.HEADING_LARGE)};
      max-width: ${({ $hasBannerImage }) =>
        $hasBannerImage ? '11.25rem' : ''};
    }
    margin-bottom: 1.5rem;
  }
`;

export const Container = styled.div`
  width: calc(100% - 5.46vw * 2);
  max-width: 1200px;
  margin: 0 auto;
  @media (max-width: 768px) {
    padding-top: 0.25rem;
  }
`;

export const BannerContent = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 3.25rem;
  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;
export const Separator = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    height: 1px;
    width: 100%;
    border-top-width: 1px;
    -webkit-border-image: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.12) 0%,
        rgba(255, 255, 255, 0) 100%
      )
      1;
    border-style: solid none none none;
  }
`;
export const ImageContainer = styled.div`
  position: relative;
`;

export const Gradient = styled.div<{
  hasScrolled: boolean;
}>`
  position: absolute;
  bottom: -80px;
  right: 50px;
  z-index: ${({ hasScrolled }) => (hasScrolled ? 0 : 16)};
  width: 18.125rem;
  height: 5.125rem;
  border-radius: 50%;
  opacity: 0.2;
  filter: blur(117px);
  background-color: ${COLORS.BRAND.PURPS};
  @media (max-width: 768px) {
    display: none;
  }
`;
