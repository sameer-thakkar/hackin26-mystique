import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  bottom: -0.2rem;
  width: 1.5rem;
  display: inline-block;

  .arrow {
    position: absolute;
    right: 4px;
    top: 4px;
    transition: all 0.15s ease-out;
  }

  :hover {
    .arrow {
      right: 1px;
      top: 1px;
    }
  }
`;
