import styled from 'styled-components';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';

export const CurrencySelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  .header {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken('Heading/XS')}
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px; /* 133.333% */
    letter-spacing: 0.6px;
    margin-bottom: 0.5rem;
  }
`;

export const StyledSearchBox = styled.div<{
  isDarkMode?: boolean;
}>`
  display: flex;
  position: relative;
  margin-top: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    input {
      ${({ isDarkMode }) => {
        return isDarkMode
          ? `
        background: rgba(255, 255, 255, 0.12);
        border: none;
        `
          : `
            border: 1px solid ${COLORS.GRAY.G6};
  
        `;
      }};
      width: calc(100% - 2.5rem);
      max-width: 20.438rem;
      outline: none;
      border-radius: 0.25rem;
      padding: 0.875rem 1rem;
      padding-left: 2.25rem;
      ${expandFontToken('UI/Label Medium')};
    }
    ::placeholder {
      color: ${COLORS.GRAY.G4};
    }
    ${({ isDarkMode }) => isDarkMode && `color: ${COLORS.BRAND.WHITE};`}

    .input-icon {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      display: flex;
      align-items: center;
      left: 0.8em;
    }

    .close-icon {
      display: none;

      svg {
        height: 1.25rem;
        stroke: ${COLORS.GRAY.G3};
      }
      path {
        stroke: ${({ isDarkMode }) =>
          isDarkMode ? COLORS.GRAY.G6 : COLORS.GRAY.G2};
      }
    }
  }
`;
