import styled from 'styled-components';

export const StyledChipsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  cursor: pointer;
  align-items: center;
  justify-items: flex-start;
  height: 34px;
  span {
    white-space: nowrap;
  }
`;
