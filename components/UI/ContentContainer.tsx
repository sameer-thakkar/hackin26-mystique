import styled from 'styled-components';

const ContentContainer = styled.div`
  margin: 10px;
  margin-top: 100px;
  max-width: 1200px;
  margin: 100px auto 10px;
  div {
    font-family: Graphik;
    line-height: 1.5;
  }
  @media (max-width: 768px) {
    margin: 100px 16px 10px;
  }
`;

export default ContentContainer;
