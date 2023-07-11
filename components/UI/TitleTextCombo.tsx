import styled from 'styled-components';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

const TitleTextCombo = styled.div<{
  isVenuePage?: boolean;
  noMargin?: boolean;
}>`
  position: relative;
  h2 {
    margin: 0;
    ${({ isVenuePage }) =>
      isVenuePage
        ? `
    ${expandFontToken(FONTS.HEADING_SMALL)}
    `
        : `
    ${expandFontToken(FONTS.HEADING_LARGE)};
    `}
  }
  p {
    ${expandFontToken('Paragraph/Large')}
  }
  display: grid;
  grid-row-gap: 0px;
  margin-bottom: ${({ noMargin }) => (noMargin ? 0 : '20px')};
  margin-bottom: ${({ noMargin }) => (noMargin ? 0 : '20px')};
  @media (min-width: 768px) {
    && {
      h2 {
        ${expandFontToken(FONTS.HEADING_LARGE)};
      }
    }
  }
`;

export default TitleTextCombo;
