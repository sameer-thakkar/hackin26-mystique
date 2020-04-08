import styled from 'styled-components';

const TitleTextCombo = styled.div`
  h2 {
    margin: 0;
  }
  display: grid;
  grid-row-gap: 20px;
  margin-bottom: ${({ noMargin }) => (noMargin ? 0 : '20px')};
`;

export default TitleTextCombo;
