import styled from 'styled-components';
import COLORS from 'const/colors';
import { HALYARD } from 'const/ui-constants';

export const StyledContainer = styled.div``;

export const Row = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.75rem;
  flex-wrap: wrap;

  @media screen and (max-width: 768px) {
    flex-wrap: nowrap;
    width: 100%;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    margin: 0 -1rem;
    padding: 0 1rem;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const Tile = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  align-items: center;
  gap: 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(128, 0, 255, 0.05);
  background: ${COLORS.BACKGROUND.FLOATING_PURPS};

  p {
    color: ${COLORS.GRAY.G3};
    margin: 0;
    font-family: ${HALYARD.DISPLAY};
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 0.75rem;
    letter-spacing: 0.0625rem;
    text-transform: uppercase;
  }

  svg {
    width: 2.25rem;
    height: 2.25rem;
  }
`;

export const Legend = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.25rem;
  align-items: center;
  font-weight: 300;

  svg {
    padding-top: 0.1rem;
    width: 1rem;
    height: 1rem;
  }

  @media (max-width: 480px) {
    white-space: nowrap;
    overflow: hidden;
    font-size: calc(1vw + 1vh);
  }
`;
