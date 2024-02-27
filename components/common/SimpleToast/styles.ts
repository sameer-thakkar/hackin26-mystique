import styled, { css } from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import { TSToast } from 'components/common/SimpleToast/types';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';

export const TextContainer = styled.div`
  ${getFontDetailsByLabel(FONTS.SUBHEADING_REGULAR)}
  color: ${COLORS.GRAY.G2};
  width: max-content;

  margin: 1rem 0 1rem 1rem;
  padding-right: 1rem;
  border-right: 1px solid ${COLORS.GRAY.G6};

  @media (max-width: 768px) {
    ${getFontDetailsByLabel(FONTS.SUBHEADING_XS)}

    margin: .5rem 0 .5rem .5rem;
    padding-right: 0.75rem;
  }
`;

export const CloseButton = styled.button`
  padding: 1.125rem 1rem;
  background-color: ${COLORS.BRAND.WHITE};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;

  svg {
    fill: ${COLORS.GRAY.G2};
    width: 0.875rem;
    height: 0.875rem;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.625rem 0.5rem 0.75rem;
    svg {
      width: 0.7rem;
      height: 0.7rem;
    }
  }
`;

export const ToastContainer = styled.div`
  background: ${COLORS.BRAND.WHITE};

  border-radius: 0.5rem;
  border: 1px solid ${COLORS.GRAY.G6};
  box-shadow: 0 0.25rem 0.5rem 0 rgba(0, 0, 0, 0.12),
    0 -0.0625rem 0.125rem 0 rgba(0, 0, 0, 0.08);

  display: flex;
  flex-direction: row;
  align-items: center;

  transition: visibility 0.3s, opacity 0.3s;

  visibility: visible;
  opacity: 1;

  @media (max-width: 768px) {
    bottom: 1.5rem;
    left: 50%;
    box-shadow: 0 0.125rem 0.5rem 0 rgba(0, 0, 0, 0.1),
      0 0 0.0625rem 0 rgba(0, 0, 0, 0.1);

    .cookie-icon {
      margin: 0.4rem;
    }
  }
`;

const topCenter = css`
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
`;

const bottomCenter = css`
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
`;

export const ToastGroup = styled.div<{ $pos: TSToast['position'] }>`
  position: fixed;
  z-index: 99999;
  display: grid;
  row-gap: 0.5rem;
  ${(props) => {
    switch (props.$pos) {
      case 'bottom-center':
        return bottomCenter;

      case 'top-center':
      default:
        return topCenter;
    }
  }}
`;
