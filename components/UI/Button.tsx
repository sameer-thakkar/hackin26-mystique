import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button(props => {
  return `
  border: 2px solid ${props.theme.button.color};
  border-radius: ${props.theme.button.borderRadius};
  color: ${props.theme.button.color};
  padding: 15px 20px;
  font-family: ${props.theme.button.fontFamily};
  font-size: ${props.theme.button.fontSize};
  font-weight: 500;
  background: transparent;
  cursor: pointer;
`;
});

const Button: React.FC<any> = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;
