import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { HALYARD } from 'const/ui-constants';

export const CardContainer = styled.div<{
  $isSmall?: boolean;
  $hasTabsAbove: boolean;
}>`
  height: max-content;
  min-height: ${({ $isSmall }) => ($isSmall ? 'auto' : '27.25rem')};
  box-sizing: border-box;
  max-width: 17.625rem;
  padding: 0.75rem;

  ${({ $isSmall }) =>
    $isSmall ? 'padding-bottom: 0.75rem;' : 'padding-bottom: 0;'};

  border-radius: 12px;

  background: ${({ $isSmall }) =>
    $isSmall
      ? 'linear-gradient(180deg, #FCF7FF 0%, #FEFBFF 71.88%, #F5EDFF 100%);'
      : 'linear-gradient(180deg, #fcf7ff 0%, #ffffff 100%);'};
  overflow: hidden;

  position: sticky;
  top: 4.25rem;

  .card-title {
    ${expandFontToken(FONTS.HEADING_REGULAR)};
    color: ${COLORS.GRAY.G2};

    .purps-text {
      color: ${COLORS.BRAND.PURPS};
    }
  }

  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
    margin-top: 1.5rem;

    li {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)};

      svg {
        align-self: flex-start;
      }
    }
  }

  .brands-img {
    margin-top: ${(props) => (props.$isSmall ? '2.6525rem' : '3.25rem')};
    width: 100%;
    height: 3.75rem;
  }

  p {
    margin-top: 0.5rem;
    margin-bottom: 0;
    font-family: ${HALYARD.FONT_STACK};
    font-size: 0.625rem;
    font-weight: 500;
    line-height: 1rem;
    text-align: center;
  }

  .illustration {
    width: calc(100% + 2rem);
    height: ${({ $isSmall }) => ($isSmall ? '6rem' : '7.125rem')};
    margin-inline: -1.5rem;
    margin-bottom: -0.75rem;
    ${({ $isSmall }) =>
      $isSmall &&
      css`
        position: absolute;
        bottom: 0;
        z-index: -1;
        opacity: 0.5;
      `}

    ${(props) => (props.$isSmall ? '  margin-top: 0;' : '')}
  }

  @media (min-width: 769px) {
    padding-inline: 1rem;
    overflow: hidden;

    width: 17.625rem;

    top: ${({ $hasTabsAbove }) => ($hasTabsAbove ? '8.45rem' : '4.8rem')};

    .card-title {
      ${expandFontToken(FONTS.HEADING_REGULAR)}
      color: ${COLORS.GRAY.G2};

      .purps-text {
        color: ${COLORS.BRAND.PURPS};
      }
    }

    .illustration {
      margin-inline: -1rem;
      margin-bottom: -0.75rem;
      margin-top: 1.25rem;
    }
  }
`;
