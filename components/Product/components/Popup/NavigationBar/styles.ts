import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const NavigationParent = styled.div<{ $isVisible?: boolean }>`
  position: absolute;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
  width: 100%;
  top: 0;
  z-index: 1;
  height: 4rem;
  width: 49.5rem;
  overflow: hidden;
  touch-action: none;
  pointer-events: none;
`;

export const NavigationContainer = styled.div<{ $isVisible?: boolean }>`
  background-color: white;
  width: 48rem;
  position: relative;
  padding: 0.75rem;
  transition: top 0.5s cubic-bezier(0.7, 0, 0.3, 1);
  top: ${({ $isVisible }) => ($isVisible ? 0 : '-100%')};
  box-shadow: 0px 2px 8px 0px #0000001a;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.25rem;
  touch-action: auto;
  pointer-events: all;
`;

export const NavigationLink = styled.div<{ $isSelected?: boolean }>`
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  ${expandFontToken(FONTS.SUBHEADING_REGULAR)}
  color: ${COLORS.GRAY.G3};

  transition: all 0.3s;
  background: none;
  cursor: pointer;

  ${({ $isSelected }) =>
    $isSelected
      ? css`
          color: ${COLORS.BRAND.CANDY};
          background: #fff2f8;
        `
      : css`
          &:hover {
            color: ${COLORS.GRAY.G2};
          }
        `}
`;
