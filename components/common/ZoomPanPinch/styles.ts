import styled from 'styled-components';
import COLORS from 'const/colors';

export const ControlsWrapper = styled.div`
  position: absolute;
  right: 1.5rem;
  top: 5.6rem;
  display: flex;
  flex-direction: column;
  z-index: 10;
  width: 2.25rem;
  box-sizing: border-box;

  .zoom-in {
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
  }

  .zoom-out {
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }

  .zoom-container {
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 8px 0px ${COLORS.GRAY.G6};
    border-radius: 0.25rem;
  }

  .reset-button {
    margin-top: 0.7rem;
    border-radius: 0.25rem;
    box-shadow: 0px 4px 8px 0px ${COLORS.GRAY.G6};
  }

  @media (max-width: 768px) {
    & {
      display: none !important;
    }
  }
`;

export const ControlsButton = styled.button`
  background: ${COLORS.BRAND.WHITE};
  border: 0;
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  box-sizing: border-box;

  &:hover {
    background: ${COLORS.GRAY.G8};
  }
  &:active {
    background: ${COLORS.GRAY.G7};
  }
`;
