import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledItineraryDescriptorsContainer = styled.div<{
  $componentType?: 'horizontal' | 'vertical';
}>`
  display: flex;
  flex-direction: column;

  .descriptor {
    &-icon-container {
      height: 1.5rem;
      width: 1.5rem;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${COLORS.GRAY.G8};

      .icon {
        height: 0.75rem;
        width: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    &-content-container {
      display: flex;
      flex-direction: column;
    }

    &-label {
      ${expandFontToken(FONTS.MISC_OVERLINE)};
      color: ${COLORS.GRAY.G3};
      letter-spacing: 0.8px;
      margin-bottom: 0.125rem;
      text-transform: uppercase;
    }

    &-subtext {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
      color: ${COLORS.GRAY.G2};
      white-space: pre-wrap;
    }

    &-cta {
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
      color: ${COLORS.GRAY.G2};
      text-decoration: underline;
      outline: none;
      border: none;
      background: transparent;
      margin: 0;
      padding: 0;
      display: flex;
    }
  }

  @media only screen and (min-width: 768px), print {
    .descriptor {
      &-icon-container {
        height: ${({ $componentType }) =>
          $componentType === 'horizontal' ? '2.125rem' : '2rem'};
        width: ${({ $componentType }) =>
          $componentType === 'horizontal' ? '2.125rem' : '2rem'};

        .icon {
          height: 1rem;
          width: 1rem;
        }
      }

      &-label {
        ${expandFontToken(FONTS.MISC_OVERLINE_LARGE)};
        letter-spacing: 0.6px;
      }

      &-subtext {
        ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
      }
    }

    ${({ $componentType }) =>
      $componentType === 'horizontal' &&
      css`
        flex-direction: row;
        align-items: center;

        .descriptor {
          &-icon-container {
            margin: 0 0.5rem 0 0;
          }
        }
      `};
  }
`;
