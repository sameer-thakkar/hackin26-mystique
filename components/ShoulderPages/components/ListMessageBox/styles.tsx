import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div`
  margin-bottom: 2.25rem;
  display: flex;
  padding: 1rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid rgba(128, 0, 255, 0.05);
  background-color: ${COLORS.BACKGROUND.FLOATING_PURPS};

  .title {
    ${expandFontToken(FONTS.HEADING_SMALL)}
    color: ${COLORS.TEXT.PURPS_3};
    margin: 0;
  }
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  div {
    display: flex;
    gap: 0.5rem;

    svg {
      flex: 0 0 12px;
      padding-top: 0.5rem;
    }

    p {
      flex: 1;
      ${expandFontToken(FONTS.PARAGRAPH_LARGE)}
      color: ${COLORS.GRAY.G2};
      margin: 0;

      @media (max-width: 768px) {
        font-size: 15px;
      }
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
    margin-bottom: -0.25rem;
    width: 0.75rem;
    transition: all 0.15s ease-out;
  }
`;
