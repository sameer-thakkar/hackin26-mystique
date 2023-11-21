import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const CardContainer = styled.article`
  position: relative;
`;

export const ImageWrapper = styled.div`
  width: 100%;
  height: 22.25rem;
  background: ${COLORS.PURPS.LIGHT_TONE_4};
  border-radius: 8px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    width: 9.75rem;
    height: 17.5rem;
  }
`;

export const CardContent = styled.div`
  position: absolute;
  inset: auto 0 0 0;
  height: 11.875rem;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  background: linear-gradient(190deg, rgba(0, 0, 0, 0) 23.76%, #000 74.25%);
  border-radius: 0 0 8px 8px;
  ${expandFontToken(FONTS.DISPLAY_SMALL)};
  color: ${COLORS.BRAND.WHITE};

  @media (max-width: 768px) {
    height: 9.75rem;
    ${expandFontToken(FONTS.HEADING_REGULAR)};
    word-break: break-word;
    hyphens: auto;
  }
`;
