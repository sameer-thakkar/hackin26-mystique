import styled from 'styled-components';
import { COLORS } from '../../constants/ui-constants';

const Button = styled.button((props) => {
  let styles = `
  border: 2px solid ${props.theme.primaryColor};
  padding: 12px ${props.paddingSides || '20px'};
  color: ${props.theme.primaryColor};
  background: transparent;
  * {
    color: ${props.theme.primaryColor};
  }
  `;
  switch (props.type) {
    case 'fill':
      styles = `
      border: 0;
      color: ${COLORS.WHITE};
      background: ${props.theme.primaryColor};
      padding: 14px ${props.paddingSides || '22px'};
      * {
        color: ${COLORS.WHITE};
      }
      `;
      break;
    case 'fillGradient':
      styles = `
      border: 0;
      color: ${COLORS.WHITE};
      background: ${props.theme.primaryColor};
      padding: 14px ${props.paddingSides || '22px'};
      * {
        color: ${COLORS.WHITE};
      }
      `;
      break;
    case 'redBordered':
      styles = `
      border: 1px solid ${props.theme.primaryColor};
      color: ${props.theme.primaryColor};
      background: ${COLORS.WHITE};
      padding: 13px ${props.paddingSides || '21px'};
      * {
        color: ${props.theme.primaryColor};
      }
      `;
      break;
    case 'whiteBordered':
      styles = `
      border: 1px solid ${COLORS.WHITE};
      color: ${COLORS.WHITE};
      background: rgba(34, 34, 34, 0.5);
      padding: 13px ${props.paddingSides || '21px'};
      * {
        color: ${COLORS.WHITE};
      }
      `;
      break;
    default:
      break;
  }
  return `
  ${styles}
  ${props.widthProp ? `width: ${props.widthProp};` : ''}
  border-radius: ${props.theme.button.borderRadius};
  font-family: ${props.theme.button.fontFamily};
  font-size: ${props.fontSize || props.theme.button.fontSize};
  font-weight: ${props.theme.button.fontWeight};
  line-height: 1;
  cursor: pointer;
  text-align: center;
  :focus {
    outline: none;
  }
  `;
});

export default Button;
