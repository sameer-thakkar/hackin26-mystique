import styled from 'styled-components';

const HorizontalLine = styled.div`
  border-bottom: 1px solid;
  border-color: ${({ colorProp }) => colorProp};
`;

export default HorizontalLine;
