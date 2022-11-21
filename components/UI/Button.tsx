import styled from 'styled-components';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';

const Button = styled.button((props) => {
  let styles = `
  border: ${props.borderWidth || '2px'} solid ${props.theme.primaryColor};
  padding: 12px ${props.paddingSides || '20px'};
  color: ${props.theme.primaryColor};
  background: transparent;
  min-width: ${props.minWidth || 'unset'};
  * {
    color: ${props.theme.primaryColor};
  }
  `;
  switch (props.fillType) {
    case 'fill':
      styles = `
      border: 0;
      color: ${COLORS.BRAND.WHITE};
      background: ${props.theme.primaryColor};
      padding: 14px ${props.paddingSides || '22px'};
      * {
        color: ${COLORS.BRAND.WHITE};
      }
      `;
      break;
    case 'fillGradient':
      styles = `
      border: 0;
      color: ${COLORS.BRAND.WHITE};
      background: ${props.theme.primaryColor};
      padding: 14px ${props.paddingSides || '22px'};
      * {
        color: ${COLORS.BRAND.WHITE};
      }
      `;
      break;
    case 'redBordered':
      styles = `
      border: 1px solid ${props.theme.primaryColor};
      color: ${props.theme.primaryColor};
      background: ${COLORS.BRAND.WHITE};
      padding: 13px ${props.paddingSides || '21px'};
      * {
        color: ${props.theme.primaryColor};
      }
      `;
      break;
    case 'whiteBordered':
      styles = `
      border: 1px solid ${COLORS.BRAND.WHITE};
      color: ${COLORS.BRAND.WHITE};
      background: rgba(34, 34, 34, 0.5);
      padding: 13px ${props.paddingSides || '21px'};
      * {
        color: ${COLORS.BRAND.WHITE};
      }
      `;
      break;
    case 'blackBordered':
      styles = `
        border: 1px solid ${COLORS.GRAY.G2};
        color: ${COLORS.GRAY.G2};
        background: ${COLORS.BRAND.WHITE};
        padding: 8px ${props.paddingSides || '21px'};
        * {
          color: ${COLORS.GRAY.G2};
        }
        `;
      break;
    case 'secondaryFill':
      styles = `
      border: 0;
      color: ${COLORS.BRAND.PURPS};
      background: ${COLORS.PURPS.LIGHT_TONE_4};
      padding: 14px ${props.paddingSides || '22px'};
      * {
        color: ${COLORS.BRAND.WHITE};
      }
      `;
      break;
    default:
      break;
  }
  return `
  ${styles}
  ${props.widthProp ? `width: ${props.widthProp};` : ''}
  border-radius: 8px;
  ${expandFontToken('Button/Medium')}
  cursor: pointer;
  text-align: center;
  :focus {
    outline: none;
  }
  `;
});

export default Button;
