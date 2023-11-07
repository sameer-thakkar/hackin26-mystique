import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const F1TrustBoosterContainer = styled.div`
  margin: 2.75rem auto 4rem;
  max-width: 75rem;

  @media (max-width: 768px) {
    margin: 2.5rem auto;
  }
`;

export const F1TrustBoosterWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(4, 1fr);
  align-items: flex-start;
  overflow-x: auto;
  gap: 1.5rem;

  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    display: flex;
    margin-right: 1.5rem;
  }
`;

export const TrustBoosterBox = styled.div<{
  isFirstBox: boolean;
  isLastBox: boolean;
}>`
  display: flex;
  align-items: flex-start;

  @media (max-width: 768px) {
    ${({ isFirstBox }) =>
      isFirstBox &&
      `
      margin-left: 1.5rem;
  `}
    ${({ isLastBox }) =>
      isLastBox &&
      `
      margin-right: 1.5rem;
  `}
    flex: 0 0 16.625rem;
  }
`;

export const SvgContainer = styled.div`
  margin-top: 0.75rem;
`;

export const TrustBoosterSubTextContainer = styled.div`
  margin-top: 0.125rem;
  ${expandFontToken(FONTS.PARAGRAPH_SMALL)};
  color: ${COLORS.GRAY.G4};
`;

export const TrustBoosterTextContainer = styled.div`
  margin-left: 0.75rem;
  ${expandFontToken(FONTS.HEADING_XS)};
  color: ${COLORS.GRAY.G2};
`;

export const ScrollBarContainer = styled.div`
  width: 48px;
  height: 5px;
  margin: 0.5rem auto 1.25rem;
  background: ${COLORS.GRAY.G7};
  border-radius: 25px;
  position: relative;
`;

export const ScrollBar = styled.div<{ left: number }>`
  width: 12px;
  height: 5px;
  background: ${COLORS.BRAND.PURPS};
  border-radius: 8px;
  position: absolute;
  ${({ left }) => `left: ${left}%`}
`;
