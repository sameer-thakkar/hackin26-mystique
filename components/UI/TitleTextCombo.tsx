import { expandFontToken } from 'const/typography';
import styled from 'styled-components';

const TitleTextCombo = styled.div`
  h2 {
    margin: 0;
    ${expandFontToken('Heading/Large')}
  }
  p {
    ${expandFontToken('Paragraph/Large')}
  }
  display: grid;
  grid-row-gap: 0px;
  margin-bottom: ${({ noMargin }) => (noMargin ? 0 : '20px')};
`;

export default TitleTextCombo;
