import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const EntryPointContainer = styled.button`
  background: none;
  border: none;
  padding: 0;
  width: 100%;
  position: relative;
  cursor: pointer;
  align-items: center;
  cursor: pointer;

  .image-wrap {
    width: 18rem;
    height: 6.375rem;
    border: 1px solid ${COLORS.GRAY.G6};
    border-radius: 12px;
    overflow: hidden;
  }

  .entry-point-button {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    padding: 0.5rem;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: row;
    gap: 0.375rem;
    border-radius: 4px;
    align-items: center;

    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
    color: ${COLORS.BLACK};

    svg {
      transition: transform 0.3s;
      path {
        stroke: ${COLORS.BLACK};
      }
    }
  }

  &:hover {
    .entry-point-button svg {
      transform: translateX(0.125rem);
    }
  }
`;
