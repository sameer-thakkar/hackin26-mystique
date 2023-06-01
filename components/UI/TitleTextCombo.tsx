import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import styled from 'styled-components';

const TitleTextCombo = styled.div<{
  isVenuePage?: boolean;
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
  margin-bottom: ${({
    // @ts-expect-error TS(2339): Property 'noMargin' does not exist on type 'Pick<D... Remove this comment to see the full error message
    noMargin,
  }) => (noMargin ? 0 : '20px')};
  @media (min-width: 768px) {
    && {
      h2 {
        ${expandFontToken(FONTS.HEADING_LARGE)};
      }
    }
  }
`;

export default TitleTextCombo;
