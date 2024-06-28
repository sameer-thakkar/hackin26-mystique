import styled, { keyframes } from 'styled-components';
import COLORS from 'const/colors';

const fillColorAnimation = keyframes`
  from {
    width: 0;
  }
  
  to {
    width: 100%;
  }
`;

export const StyledAnimatedSwiperPaginationDotsContainer = styled.div`
  display: flex;
  gap: 0.25rem;

  .bullet {
    height: 0.375rem;
    width: 0.375rem;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    margin: 0 0.25rem 0 0;
    padding: 0;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    filter: drop-shadow(0px 2px 8px 0px rgba(0, 0, 0, 0.1))
      drop-shadow(0px 0px 1px 0px rgba(0, 0, 0, 0.1));
    position: relative;
    overflow: hidden;

    &.expanded {
      width: 1.5rem;
      border-radius: 16px;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: ${COLORS.BRAND.WHITE};
        animation: ${fillColorAnimation} 0.3s linear;
      }
    }
  }
`;
