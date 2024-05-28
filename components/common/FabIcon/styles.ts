import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const FabWrapper = styled.div`
  height: 4rem;
  width: 4rem;
  border-radius: 2.5rem;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.12),
    0px -1px 2px 0px rgba(0, 0, 0, 0.08);

  position: fixed;
  bottom: 0.75rem;
  right: 0.75rem;
  background: ${COLORS.BRAND.WHITE};
  cursor: pointer;
  z-index: 10;
  transition: width 0.3s ease-out;
  p {
    display: none;
  }
  svg {
    margin: 1.1875rem;
  }

  @media (max-width: 768px) {
    bottom: 1rem;
    right: 0.75rem;
  }

  @media (min-width: 768px) {
    :hover {
      min-width: fit-content;
      padding-right: 1.2rem;
      border-radius: 2.5rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      p {
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        display: inline-block;
        color: ${COLORS.BRAND.PURPS};
        ${expandFontToken(FONTS.BUTTON_BIG)}
      }
    }
  }
`;
