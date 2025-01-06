import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  bottom: -1px;
  width: 1.5rem;
  max-height: 20px;
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
