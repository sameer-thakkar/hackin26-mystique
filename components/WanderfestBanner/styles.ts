import styled from 'styled-components';
import { expandFontToken } from 'const/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';

export const StyledBannerWrapper = styled.div<{ $isV1Design: boolean }>`
  display: grid;
  grid-template-columns: min-content 5fr 1fr;
  grid-gap: 2.5rem;
  align-items: center;
  padding: 1.125rem 3.75rem 1.5rem 2.5rem;
  border-radius: 12px;
  background: ${COLORS.BRAND.PURPS};
  color: ${COLORS.BRAND.WHITE};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-gap: 1rem;
    margin: ${({ $isV1Design }) => ($isV1Design ? `0 1.5rem` : `0 1rem`)};
    padding: 1.5rem 1.25rem;
  }
`;

export const StyledLottieWrapper = styled.div`
  width: 7rem;
  height: 4.09rem;

  @media (max-width: 768px) {
    width: 12.6rem;
    height: 2.625rem;
    margin-bottom: 0.5rem;
  }
`;

export const StyledTextWrapper = styled.div`
  h3 {
    margin: unset;
    color: ${COLORS.BRAND.WHITE};
    ${expandFontToken(FONTS.HEADING_REGULAR)}
    @media (max-width: 768px) {
      ${expandFontToken(FONTS.HEADING_XS)}
    }
  }
  p {
    max-width: 55%;
    margin: 0.25rem 0 0;
    color: ${COLORS.BRAND.WHITE};
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)}
    @media (max-width: 768px) {
      max-width: 100%;
      ${expandFontToken(FONTS.PARAGRAPH_SMALL)}
    }
  }
`;

export const StyledCTAWrapper = styled.div`
  justify-self: end;
  padding-top: 0.375rem;

  @media (max-width: 768px) {
    justify-self: start;
    padding-top: 0;
  }

  button {
    cursor: pointer;
    padding: 0.5rem 0.75rem;
    background: ${COLORS.PURPS.LIGHT_TONE_4};
    border: 1px solid ${COLORS.PURPS.LIGHT_TONE_4};
    border-radius: 4px;
    color: ${COLORS.BRAND.PURPS};
    ${expandFontToken(FONTS.BUTTON_SMALL)}
  }
`;
