import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.main`
  margin-bottom: 56px;
  margin-top: 32px;

  @media (max-width: 768px) {
    margin-bottom: 52px;
  }

  h2 {
    ${expandFontToken(FONTS.HEADING_REGULAR)}

    margin-bottom: 16px;
  }

  .pairs-container {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem 5rem;
    margin-bottom: 16px;

    p {
      margin: 0;
    }

    .pair {
      box-sizing: border-box;
      display: flex;
      gap: 0.5rem;

      .icon {
        background-color: ${COLORS.GRAY.G7};
        padding: 0.5rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        flex: 0 0 12px;
        box-sizing: border-box;

        svg {
          width: 1.25rem;
          height: 1.25rem;
        }
      }

      .text-container {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        max-width: 100%;

        .label {
          ${expandFontToken(FONTS.MISC_BOOSTER)}
          color: ${COLORS.GRAY.G4};
          text-transform: uppercase;
        }

        p {
          ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
          line-height: unset;
          color: ${COLORS.GRAY.G2};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 70vw;
        }

        a {
          display: flex;
          align-items: center;

          &:hover p,
          &:focus p {
            color: ${COLORS.TEXT.PURPS_3} !important;
            text-decoration: underline;
          }
        }

        svg {
          margin-left: 0.2rem;
        }

        :hover .arrow,
        :focus .arrow {
          right: 1px;
          top: 1px;
        }
      }
    }
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`;

export const CTA = styled.a`
  vertical-align: middle;
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
  color: ${COLORS.BRAND.PURPS};

  &:hover {
    text-decoration: underline;

    svg {
      margin-left: 12px;
    }
  }

  svg {
    margin-left: 6px;
    margin-bottom: -0.24rem;
    width: 0.75rem;
    transition: all 0.15s ease-out;
  }
`;
