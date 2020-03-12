import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button(props => {
  if (props.type === 'whiteBordered') {
    return `
    border: 1px solid white;
    border-radius: 4px;
    color: white;
    padding: 14px 24px;
    font-family: ${props.theme.button.fontFamily};
    font-size: ${props.theme.button.fontSize};
    font-weight: ${props.theme.button.fontWeight};
    background: rgba(34, 34, 34, 0.5);
    cursor: pointer;
    `;
  }
  return `
  border: 2px solid ${props.theme.button.color};
  border-radius: ${props.theme.button.borderRadius};
  color: ${props.theme.button.color};
  padding: 15px 20px;
  font-family: ${props.theme.button.fontFamily};
  font-size: ${props.theme.button.fontSize};
  font-weight: ${props.theme.button.fontWeight};
  background: transparent;
  cursor: pointer;
`;
});

const Button: React.FC<any> = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;
