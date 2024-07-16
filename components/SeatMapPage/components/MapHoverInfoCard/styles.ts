import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const MapSectionInfoCardContainer = styled.div<{
  left: number;
  top: number;
  isVisible: boolean;
}>`
  position: fixed;
  ${({ left }) => left && `left: ${left}px;`}
  ${({ top }) => top && `top: ${top}px;`}
  ${({ isVisible }) => `visibility: ${isVisible ? 'visible' : 'hidden'};`}
  z-index: 19;

  @media (max-width: 768px) {
    & {
      display: none;
    }
  }
`;

export const MapSectionInfoCard = styled.div`
  min-width: 18.75rem;
  max-width: 20rem;
  border-radius: 1rem;
  box-sizing: border-box;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  background: white;
`;

export const Header = styled.section`
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: rgba(255, 255, 255, 0.95);
  position: relative;
  overflow: hidden;
`;

export const HeaderLeft = styled.div`
  flex: 0.7;
  display: flex;
  align-items: flex-start;
  background: ${COLORS.BRAND.PURPS};
  border-top-left-radius: 1rem;
  padding: 0.75rem;
  font-size: 1rem;
  color: ${COLORS.BRAND.WHITE};
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
  white-space: nowrap;
`;

export const HeaderRight = styled.div`
  flex: 0.3;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  background: ${COLORS.BRAND.PURPS};
  border-top-right-radius: 1rem;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: light;
  position: relative;
  color: ${COLORS.BRAND.WHITE};
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
  white-space: nowrap;
`;

export const Body = styled.section`
  padding: 0.75rem;
  box-sizing: border-box;
  color: gray;
  font-weight: light;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: ${COLORS.GRAY.G3};
  }
`;

export const QuickInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.25rem 0;
`;

export const P = styled.p`
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin: 0;
  padding: 0;
  color: ${COLORS.GRAY.G3};
  ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
`;

export const HR = styled.hr`
  border: 0;
  margin: 0.75rem 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #e2e2e2 0%, rgba(226, 226, 226, 0) 100%);
`;
