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
  margin-bottom: ${({  
 // @ts-expect-error TS(2339): Property 'noMargin' does not exist on type 'Pick<D... Remove this comment to see the full error message
 noMargin }) => (noMargin ? 0 : '20px')};
`;

export default TitleTextCombo;
