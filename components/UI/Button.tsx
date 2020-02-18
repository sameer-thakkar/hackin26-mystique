import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  border: 2px solid #ec1943;
  border-radius: 5px;
  color: #ec1943;
  padding: 15px 20px;
  font-family: Graphik;
  font-size: 18px;
  font-weight: 500;
  background: transparent;
`;

const Button: React.FC<any> = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;
