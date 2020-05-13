import styled from 'styled-components';

const TitleTextCombo = styled.div`
  h2 {
    margin: 0;
    font-size: 24px;
  }
  p {
    font-size: 16px;
  }
  display: grid;
  grid-row-gap: 20px;
  margin-bottom: ${({ noMargin }) => (noMargin ? 0 : '20px')};
`;

export default TitleTextCombo;
