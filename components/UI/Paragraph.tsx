import styled from 'styled-components';

const Paragraph = styled.p`
  font-family: ${props => props.font || 'Graphik'};
  color: #545454;
  line-height: 1.5;
`;

export default Paragraph;
