import styled from 'styled-components';
import { expandFontToken } from 'const/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';

export const StyledNestedMenuContainer = styled.ul<{ $isSelected?: boolean }>`
  display: ${({ $isSelected }) => ($isSelected ? 'block' : 'none')};

  @media (max-width: 768px) {
    margin: unset;
    padding: unset;
    background-color: ${COLORS.GRAY.G8};
    border-bottom: 0.5px solid ${COLORS.GRAY.G6};
    height: auto;
    transition: all 2s ease-in-out 0s;

    .last + & {
      margin-bottom: 5rem;
    }

    li {
      padding: 0.875rem 1.5rem;
      color: ${COLORS.GRAY.G2};
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}

      .nested-menu-item {
        display: flex;
        justify-content: space-between;
      }

      a {
        color: inherit;
      }

      svg {
        width: 1rem;
        height: 1rem;
        vertical-align: middle;
        pointer-events: none;
      }
    }
  }
`;
