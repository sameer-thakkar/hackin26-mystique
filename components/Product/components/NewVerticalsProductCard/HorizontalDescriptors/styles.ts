import styled from 'styled-components';
import { TourTags } from 'components/Product/styles';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const HorizontalTags = styled.div`
  grid-area: horizontal-tags;
  &&& {
    ${TourTags} {
      display: flex;
      white-space: nowrap;
      flex-wrap: wrap;
      gap: 0.375rem;
      flex-direction: row;
      padding: 0;

      .tour-tag {
        align-items: center;
        max-width: max-content;
        grid-column-gap: 0;
        ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
        color: ${COLORS.GRAY.G3};

        &:not(:last-child) {
          margin: 0;

          &::after {
            content: '';
            position: relative;
            height: 0.25rem;
            width: 0.25rem;
            background-color: ${COLORS.GRAY.G6};
            border-radius: 0.625rem;
            transform: translateY(0.125rem);
            margin-left: 0.25rem;
          }
        }
      }
    }
    @media (max-width: 768px) {
      ${TourTags} {
        margin: 0 0 0.5rem 0;
        gap: 0.25rem;
        .tour-tag {
          ${expandFontToken(FONTS.UI_LABEL_SMALL)}
        }
      }
    }
  }
`;
