import styled from 'styled-components';

const HorizontalLine = styled.div<{
  colorProp?: string;
  styleProp?: string;
}>`
  border-bottom: ${({ styleProp }) => `1px ${styleProp || 'solid'}`};
  border-color: ${({ colorProp }) => colorProp};
`;

export default HorizontalLine;
