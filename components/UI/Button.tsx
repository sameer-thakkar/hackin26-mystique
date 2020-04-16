import styled from 'styled-components';
import { COLORS } from '../../constants/ui-constants';

const Button = styled.button((props) => {
  if (props.type === 'whiteBordered') {
    return `
    border: 1px solid white;
    border-radius: 4px;
    color: white;
    padding: 15px ${props.paddingSides || '24px'};
    font-family: ${props.theme.button.fontFamily};
    font-size: ${props.fontSize || props.theme.button.fontSize};
    font-weight: ${props.theme.button.fontWeight};
    background: rgba(34, 34, 34, 0.5);
    cursor: pointer;
    :focus {
      outline: none;
    }
    @media (max-width: 768px) {
      padding: 11px ${props.paddingSides || '24px'};
    }
    `;
  } else if (props.type === 'colored') {
    return `
    border: 0;
    border-radius: ${props.theme.button.borderRadius};
    color: white;
    padding: 16px ${props.paddingSides || '22px'};
    font-family: ${props.theme.button.fontFamily};
    font-size: ${props.fontSize || props.theme.button.fontSize};
    font-weight: ${props.theme.button.fontWeight};
    background: ${COLORS.RHAPSODY_GRADIENT};
    cursor: pointer;
    text-decoration: none;
    :focus {
      outline: none;
    }
    @media (max-width: 768px) {
      padding: 11px ${props.paddingSides || '24px'};
    }
    `;
  }
  return `
  border: 2px solid ${props.theme.button.color};
  border-radius: ${props.theme.button.borderRadius};
  color: ${props.theme.button.color};
  padding: 14px ${props.paddingSides || '20px'};
  font-family: ${props.theme.button.fontFamily};
  font-size: ${props.fontSize || props.theme.button.fontSize};
  font-weight: ${props.theme.button.fontWeight};
  background: transparent;
  cursor: pointer;
  :focus {
    outline: none;
  }
  @media (max-width: 768px) {
    padding: 11px ${props.paddingSides || '24px'};
  }
`;
});

export default Button;
