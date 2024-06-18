import styled from 'styled-components';
import COLORS from 'const/colors';

export const StyledNavigationArrowsContainer = styled.div`
  margin-left: 1rem;
  display: flex;
`;

export const StyledArrowButtonContainer = styled.button`
  cursor: pointer;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${COLORS.GRAY.G6};
  border-radius: 50%;
  background: transparent;

  svg {
    width: 0.75rem;
    height: 0.75rem;

    path {
      stroke: ${COLORS.GRAY.G3};
    }
  }

  &:first-child {
    margin-right: 0.5rem;

    svg {
      margin-right: 0.0625rem;
    }
  }

  &:last-child {
    svg {
      margin-left: 0.0625rem;
    }
  }

  &:hover {
    border-color: ${COLORS.GRAY.G5};
  }

  &:disabled {
    svg > path {
      stroke: ${COLORS.GRAY.G6};
    }

    &:hover {
      border-color: ${COLORS.GRAY.G6};
    }
  }
`;
